---
kind: build_system
name: Label Studio 全栈构建与发布体系（Makefile + Docker 多阶段构建 + GitHub Actions CI/CD）
category: build_system
scope:
    - '**'
source_files:
    - Makefile
    - Dockerfile
    - pyproject.toml
    - web/package.json
    - .github/workflows/cicd_pipeline.yml
    - .github/workflows/docker-build.yml
    - .github/workflows/release-pipeline.yml
    - deploy/docker-entrypoint.sh
    - deploy/uwsgi.ini
    - deploy/default.conf
---

## 1. 使用的系统与工具

Label Studio 是一个 Python(Django) + React/Vite 前端 + Hexo 文档站的 Monorepo，其构建与发布由以下核心系统协同完成：

- **Python 依赖与包构建**：`pyproject.toml` + `uv`（`uv_build` 作为 build-backend），锁定在 `uv>=0.13.5`；`label-studio-sdk` 通过 `[tool.uv.sources]` git pin 到固定 commit。
- **前端构建**：`web/package.json` 声明 `packageManager: "bun@1.3.11"`，使用 Vite (npm alias `rolldown-vite@^7.3.1`)、React、Storybook、Cypress、Biome 等；产物输出到 `web/dist`。
- **容器镜像**：`Dockerfile` 采用 4 阶段构建（`uv` → `frontend-builder` → `venv-builder` → `production`），基于 Alpine Linux，运行 Nginx + uWSGI + Django。
- **CI/CD**：GitHub Actions，入口为 `.github/workflows/cicd_pipeline.yml`，按文件变更路径分派 linter、pytest、migrations、前端测试、Docker 构建等 job。
- **版本与发布**：分支命名约定 `ls-release/<version>`，配合 `release-pipeline.yml`、`docker-build.yml`、`build_pypi.yml` 完成 PyPI 发布、Docker 多架构 manifest 推送、Helm Chart 更新、Homebrew Tap 更新。
- **开发编排**：`docker-compose.yml` + `Makefile` 提供本地 dev/migrate/test 快捷命令。

## 2. 关键文件

| 文件 | 作用 |
|---|---|
| `Makefile` | 统一入口：`run-dev`、`migrate-dev`、`test`、`frontend-*`、`docker-*`、`fmt*`、`generate-swagger` |
| `Dockerfile` | 多阶段镜像构建，注入 COMMIT_* 元信息 |
| `pyproject.toml` | Python 项目元数据、依赖、uv/ruff/pytest 配置 |
| `web/package.json` | 前端脚本、依赖、Bun 包管理器 |
| `.github/workflows/cicd_pipeline.yml` | PR/push 主流水线，触发 lint、test、docker build |
| `.github/workflows/docker-build.yml` | 多平台 (amd64/arm64) Docker 构建与 manifest 合并 |
| `.github/workflows/release-pipeline.yml` | 正式发布后触发 promote / pypi / helm / homebrew |
| `deploy/docker-entrypoint.sh` | 容器启动入口，顺序执行 `deploy/docker-entrypoint.d/` 下脚本 |
| `deploy/uwsgi.ini` | uWSGI 应用服务器配置 |
| `deploy/default.conf` | Nginx 反向代理配置 |
| `scripts/build_docker.sh` | 辅助的 Docker 构建脚本 |

## 3. 架构与约定

### 3.1 多阶段 Docker 构建

`Dockerfile` 明确注释了四个阶段：

1. **`uv`**：从 `ghcr.io/astral-sh/uv:${UV_VERSION}` 拉取预编译 uv 二进制。
2. **`frontend-builder`**：基于 `oven/bun:1.3-alpine`，安装 `web/package.json` + `web/bun.lock`，运行 `bun run build`，将产物写入 `/label-studio/label_studio/core/static/js/manifest.json` 和 `sw.js`。
3. **`venv-builder`**：基于 `python:${PYTHON_VERSION}-alpine`，先 `uv sync --frozen --no-install-project` 安装依赖（缓存 pyproject.toml/uv.lock 层），再 `COPY label_studio` 并二次 `uv sync` 安装项目本身，最后 `collectstatic`。
4. **`production`**：仅复制 venv-builder 产物 + web/dist，设置 `USER 1001`，ENTRYPOINT 指向 `deploy/docker-entrypoint.sh`。

构建参数：`NODE_VERSION=22`、`PYTHON_VERSION=3.14`、`UV_VERSION=0.13.5`，以及 `COMMIT_VERSION/BRANCH/MESSAGE/DATE/SHA` 被写入 `label_studio/core/version_.py`。

### 3.2 前端构建管线

- 包管理器强制为 Bun（`packageManager: "bun@1.3.11"`），`make frontend-*` 与 Dockerfile 均使用 `--frozen-lockfile`。
- 生产构建：`bun run build` → `vite build` → 产物到 `web/dist`，同时生成 Service Worker (`tools/build-service-worker.mjs`)。
- 开发模式：`bun run dev` 或 `bun run watch`，启用 HMR。
- Storybook：`bun run ui:serve` 在 `libs/storybook/.storybook`。
- 测试：`bun test --dom`（Bun built-in）、Jest（组件级）、Cypress（E2E/integration）。

### 3.3 Python 依赖管理

- `pyproject.toml` 中 `requires-python = ">=3.11,<4"`，`[build-system]` 指定 `uv_build<0.14.0`。
- `label-studio-sdk` 通过 `[tool.uv.sources]` git pin 到 `bb754c29572d6e2b7ec3723409c4043cc370b2`。
- 可选 extra `uwsgi` 包含 `pyuwsgi`、`uwsgitop`。
- 测试依赖在 `[dependency-groups].test`，构建依赖在 `[dependency-groups].build`。
- Ruff 规则：target-version `py311`，line-length 119，select F/E/I001，忽略 E501/E402。

### 3.4 CI/CD 流水线

`cicd_pipeline.yml` 是总调度器：

- 使用 `dorny/paths-filter` 按路径区分 `src` / `frontend` / `docker` / `migrations` 四类变更。
- 对 src 变更触发：trufflehog、bandit、ruff、pytest、migrations、conda-test。
- 对 frontend 变更触发：biome、tests-yarn-unit、tests-yarn-lsf、build-frontend-docs。
- 仅在 `ls-release/**` 分支上触发 `build-docker`（调用 `docker-build.yml`）。
- `check_gate` 汇总所有 job 状态，允许部分 skip/failure（trufflehog、cursor-review 为 allowed-failures）。
- Dependabot PR 自动 squash merge。

`docker-build.yml`：

- 计算 image_version：`ls-release/<ver>` → `<ver>rc<sha>`，其他分支 → `<pretty-branch-name>`。
- 双平台 matrix：`linux/amd64` (ubuntu-latest) + `linux/arm64` (ubuntu-24.04-arm)。
- 使用 `docker/build-push-action@v7` 输出 `push-by-digest=true,name-canonical=true`，再通过 `imagetools create` 合并 manifest。
- 下载 LaunchDarkly feature_flags.json 作为构建输入。

`release-pipeline.yml`：

- 在 release published 或 workflow_dispatch(ref_name) 时触发。
- 依次执行：promote_docker_image → build_hugging_face_docker_image → jira_set_fix_version → build-pypi → delete-rc-assets → update-homebrew-tap → update-helm-chart。

### 3.5 版本策略

- 开发版版本号位于 `pyproject.toml` 的 `version = "1.24.0.dev0"`。
- 发布分支命名：`ls-release/<semver>`（如 `ls-release/1.24.0`）。
- `cicd_pipeline.yml` 中的 draft-release job 用正则 `^[v]?([0-9]+)\.([0-9]+)\.([0-9]+)(\.post([0-9]+))?$` 校验分支名，并自动生成 RC 后缀 `rc<ahead_by>`。
- Docker 镜像 tag：`<image_version>`（如 `1.24.0rc3`）+ `<build_version>`（时间戳+短 sha）。PyPI 上传使用 `build_pypi.yml`。

### 3.6 容器启动链

`deploy/docker-entrypoint.sh` 顺序执行 `deploy/docker-entrypoint.d/` 下的脚本（common/app/nginx/app-init/app-docker 子目录），典型顺序：检查权限 → 配置 nginx → 配置 CA bundle → 等待 DB → 运行迁移 → 初始化 Label Studio。

## 4. 约定与约束

- **Python 解释器**：必须 ≥3.11（`pyproject.toml` `requires-python`）。
- **uv 版本锁定**：`required-version = ">=0.13.5"`，Dockerfile 硬编码 `UV_VERSION=0.13.5`，CI 也使用该版本。
- **前端包管理器**：`packageManager: "bun@1.3.11"`，所有构建步骤使用 `bun install --frozen-lockfile` 与 `bun run`。
- **依赖锁定**：Python 侧使用 `uv.lock`，前端侧使用 `web/bun.lock`，构建时必须 `--frozen-lockfile`。
- **外部依赖 git pin**：`label-studio-sdk` 通过 `[tool.uv.sources]` 固定到特定 commit，Dockerfile 注释说明该依赖由 monorepo sync 维护。
- **发布分支命名**：必须以 `ls-release/` 开头，且分支名须匹配 semver 正则（由 `cicd_pipeline.yml` 的 draft-release job 强制校验）。
- **Docker 多架构**：官方镜像必须同时产出 `linux/amd64` 与 `linux/arm64`，并通过 manifest list 合并（`docker-build.yml` matrix + imagetools create）。
- **CI 门禁**：PR 必须通过 `check_gate` 聚合的所有 job（lint、test、migration、docker build、前端测试）才能合并，其中 trufflehog 与 cursor-review 允许失败。
- **静态资源收集**：Vite 产物的 `manifest.json` 必须在 `collectstatic` 之前复制到 `label_studio/core/static/js/`，这是 Dockerfile 中显式 COPY 的顺序要求。
- **运行时用户**：生产镜像以 `USER 1001` 非 root 用户运行。
- **环境变量注入**：构建期传入 `COMMIT_VERSION/BRANCH/MESSAGE/DATE/SHA`，最终写入 `label_studio/core/version_.py` 供运行时读取。
- **Feature Flags**：构建镜像前需从 LaunchDarkly 下载 `feature_flags.json` 到 `label_studio/feature_flags.json`，否则构建失败。
- **Pre-commit**：`Makefile fmt*` 目标统一通过 `.pre-commit-dev.yaml` 调用 pre-commit hooks，支持 `--hook-stage manual` 与 `--hook-stage pre-push` 两种模式。