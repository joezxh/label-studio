---
kind: configuration_system
name: Label Studio 后端配置系统：Django settings + LaunchDarkly 特性开关 + 环境变量分层
category: configuration_system
scope:
    - '**'
source_files:
    - label_studio/core/settings/base.py
    - label_studio/core/settings/label_studio.py
    - label_studio/core/utils/params.py
    - label_studio/core/feature_flags/base.py
    - label_studio/core/feature_flags/stale_feature_flags.py
    - label_studio/feature_flags.json
    - label_studio/core/utils/secret_key.py
    - deploy/docker-entrypoint.sh
    - deploy/uwsgi.ini
    - docker-compose.yml
---

## 1. 采用的系统与框架

- **Django Settings 分层**：基于 Django 的 `settings.base` + `settings.label_studio.py` 两层结构，通过 `DJANGO_SETTINGS_MODULE`（由 `label_studio/server.py` / `manage.py` 注入）选择具体配置。
- **环境变量解析器**：自定义 `label_studio.core.utils.params.get_env` / `get_bool_env` / `get_env_list` / `get_all_env_with_prefix`，统一从 `os.environ` 读取。
- **特性开关（Feature Flags）**：使用 [LaunchDarkly Python SDK](https://launchdarkly.github.io/python-sdk/) (`ldclient`)，支持三种数据源：本地 JSON/YAML 文件、Redis 远程存储、离线模式。
- **密钥管理**：`core.utils.secret_key.generate_secret_key_if_missing` 在 `BASE_DATA_DIR` 下生成/持久化 `SECRET_KEY`。

## 2. 关键文件与包

| 路径 | 职责 |
|---|---|
| `label_studio/core/settings/base.py` | 所有 Django 默认设置（数据库、CORS、DRF、RQ、Sentry、Feature Flags 等），全部通过 `get_env*` 覆盖 |
| `label_studio/core/settings/label_studio.py` | 社区版覆盖层：注入 SECRET_KEY、选择 DJANGO_DB、初始化 Sentry、设定 FEATURE_FLAGS_DEFAULT_VALUE = True |
| `label_studio/core/utils/params.py` | 环境变量读取工具（`get_env`、`get_bool_env`、`get_env_list`、`get_all_env_with_prefix`、`has_env`） |
| `label_studio/core/feature_flags/base.py` | LaunchDarkly 客户端初始化与 `flag_set` / `all_flags` API |
| `label_studio/core/feature_flags/stale_feature_flags.py` | 已废弃 flag 的硬编码回退值 |
| `label_studio/feature_flags.json` | 随仓库分发的 LaunchDarkly 本地 flags 文件（5000+ 行，包含 `flags` / `segments` 结构） |
| `label_studio/core/utils/secret_key.py` | 自动生成并持久化 `SECRET_KEY` |
| `deploy/docker-entrypoint.sh` / `deploy/uwsgi.ini` | 容器启动时注入环境变量、加载 `.env` 的方式 |

## 3. 架构与约定

### 3.1 环境变量优先级
`get_env(name, default)` 按以下顺序查找同一个 name 的值：**`LABEL_STUDIO_<NAME>` → `HEARTEX_<NAME>` → `<NAME>`**，第一个命中即返回。因此部署方可以用 `LABEL_STUDIO_` 前缀做命名空间隔离，旧变量名仍兼容。

布尔值解析走 `cast_bool_from_str`：`true/yes/on/1` → `True`，`false/no/not/off/0` → `False`，其他字符串抛 `ValueError`。

### 3.2 Django Settings 分层
- `base.py`：定义所有默认值，包括 `DATABASES_ALL`（PostgreSQL / MySQL / SQLite）、`INSTALLED_APPS`、`MIDDLEWARE`、`REST_FRAMEWORK`、`RQ_QUEUES`、`SENTRY_DSN`、`FEATURE_FLAGS_*` 等。
- `label_studio.py`：`from core.settings.base import *` 后仅覆盖运行期差异项（如 `DEBUG=False`、`SESSION_ENGINE='django.contrib.sessions.backends.signed_cookies'`、`FEATURE_FLAGS_DEFAULT_VALUE=True`、`FEATURE_FLAGS_OFFLINE=True`、`FEATURE_FLAGS_FROM_FILE=True`）。

### 3.3 数据库配置
`DJANGO_DB` 环境变量决定使用 `postgresql` / `mysql` / `sqlite`；PostgreSQL 默认连接 `localhost:5432/postgres`，MySQL 默认 `localhost:3306/labelstudio`，SQLite 默认 `BASE_DATA_DIR/label_studio.sqlite3`。

### 3.4 特性开关（Feature Flags）
`core.feature_flags.base` 根据三个设置决定 LaunchDarkly 行为：
- `FEATURE_FLAGS_FROM_FILE=True`：从 `FEATURE_FLAGS_FILE`（默认 `feature_flags.json`）加载，绝对路径或相对于 `label_studio` 包的相对路径均可。
- `FEATURE_FLAGS_OFFLINE=True`：SDK 离线模式，所有 flags 返回 `FEATURE_FLAGS_DEFAULT_VALUE`（社区版为 `True`）。
- 生产模式：通过 `FEATURE_FLAGS_API_KEY` 连接 LaunchDarkly，可选 Redis feature store（`REDIS_LOCATION` + `REDIS_SSL_SETTINGS`）。

评估优先级：`STALE_FEATURE_FLAGS` > 同名环境变量（见下文）> `override_system_default` > `FEATURE_FLAGS_DEFAULT_VALUE` > LaunchDarkly 服务端结果。

### 3.5 环境变量覆盖 Feature Flags
`all_flags()` 会扫描以 `ff_`、`fflag_`、`fflag-`、`feat_` 为前缀的所有布尔环境变量，合并到 flags 响应中，从而允许运维通过环境变量直接覆盖任意 flag。

### 3.6 密钥与敏感信息
`SECRET_KEY` 不在代码中硬编码；`label_studio.py` 调用 `generate_secret_key_if_missing(BASE_DATA_DIR)`，首次启动时在 `BASE_DATA_DIR` 下写入 `secret_key.txt`。Sentry DSN 通过 `SENTRY_DSN` / `FRONTEND_SENTRY_DSN` 环境变量注入，默认指向 Heartex 内部 ingest 端点。

### 3.7 前端配置
前端构建产物通过 Django 模板上下文暴露 `settings`（`core.context_processors.settings`），前端侧通过 Jotai/MobX 消费 `all_flags` API 获取运行时开关。

## 4. 约定与约束

- **环境变量命名约定**：所有可配置项统一通过 `get_env` / `get_bool_env` 访问，禁止直接 `os.environ.get`（`base.py` 中除极早期日志配置外均遵循此约定）。支持的变量名前缀优先级为 `LABEL_STUDIO_` > `HEARTEX_` > 无前缀。
- **布尔值严格校验**：非 `true/false/yes/no/on/off/1/0` 的字符串会被 `cast_bool_from_str` 拒绝，抛出 `ValueError`。
- **Feature Flags 必须显式声明来源**：当设置 `FEATURE_FLAGS_FROM_FILE=True` 时，必须同时提供有效的 `FEATURE_FLAGS_FILE`，否则 `core.feature_flags.base.get_feature_file_path` 会抛出 `ValueError`（见 base.py 第 34-38 行）。
- **Community 版默认开启所有 flags**：`label_studio.py` 将 `FEATURE_FLAGS_DEFAULT_VALUE = True`，而 `base.py` 默认为 `False`，这是两个版本的行为差异点。
- **Stale flags 强制覆盖**：`stale_feature_flags.py` 中的条目绕过 LaunchDarkly，直接返回硬编码值，用于下线已清理但仍有引用的 flag。
- **Secret Key 不入库**：`SECRET_KEY` 由 `generate_secret_key_if_missing` 生成并持久化到 `BASE_DATA_DIR`，而非环境变量或数据库。
- **数据库引擎白名单**：`DATABASES_ALL` 只定义 `postgresql` / `mysql` / `sqlite` 三种引擎，`DJANGO_DB` 取不到对应键时会得到 `None`，后续 Django 启动时报错。
- **CORS 默认宽松**：未显式设置 `CORS_ALLOWED_ORIGINS` / `CORS_ALLOWED_ORIGIN_REGEXES` 时，`CORS_ALLOW_ALL_ORIGINS` 默认 `True`（见 `base.py` 第 320-325 行）。
- **Feature Flag 环境变量前缀**：只有 `ff_`、`fflag_`、`fflag-`、`feat_` 四个前缀会被 `all_flags()` 收集并覆盖服务端 flags，其他前缀的环境变量不会生效。

## 5. 相关配置文件（部署层）

- `docker-compose.yml` / `docker-compose.override.example.yml`：示例环境变量（`POSTGRE_*`、`MYSQL_*`、`SENTRY_DSN`、`BASE_DATA_DIR` 等）。
- `deploy/docker-entrypoint.sh`：容器入口脚本，负责等待 DB、执行迁移、加载额外配置。
- `deploy/uwsgi.ini`：uWSGI 进程配置，绑定端口、worker 数、静态文件挂载。
- `pyproject.toml`：Python 依赖声明（含 `launchdarkly-server-sdk`、`django`、`djangorestframework` 等）。
- `web/package.json` / `web/vite.config.ts`：前端构建配置，独立于后端配置系统。