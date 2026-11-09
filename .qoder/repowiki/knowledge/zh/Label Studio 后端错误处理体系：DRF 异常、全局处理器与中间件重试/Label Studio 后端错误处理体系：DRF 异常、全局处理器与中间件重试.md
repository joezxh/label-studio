---
kind: error_handling
name: Label Studio 后端错误处理体系：DRF 异常、全局处理器与中间件重试
category: error_handling
scope:
    - '**'
source_files:
    - label_studio/core/utils/exceptions.py
    - label_studio/core/utils/common.py
    - label_studio/core/settings/base.py
    - label_studio/core/middleware.py
    - label_studio/tasks/exceptions.py
    - label_studio/labels_manager/exceptions.py
    - label_studio/io_storages/exceptions.py
    - label_studio/data_manager/serializers.py
    - label_studio/jwt_auth/views.py
    - label_studio/fsm/state_manager.py
    - label_studio/fsm/transitions.py
---

## 1. 总体方案

Label Studio 后端基于 Django + Django REST Framework (DRF)，错误处理采用三层结构：
- **领域异常类**：在 `core/utils/exceptions.py` 中定义统一的基类，业务模块按需继承。
- **全局 DRF 异常处理器**：通过 `settings.base.EXCEPTION_HANDLER = 'core.utils.common.custom_exception_handler'` 注册，统一格式化响应体、记录日志、上报 Sentry。
- **中间件级容错**：`core/middleware.py` 中的 `DatabaseIsLockedRetryMiddleware` 对 SQLite 数据库锁错误进行指数退避重试。

前端（web/）未在此仓库范围内发现专门的错误处理框架；本卡片聚焦后端。

## 2. 关键文件与包

| 路径 | 作用 |
|---|---|
| `label_studio/core/utils/exceptions.py` | 定义 `LabelStudioError`、`LabelStudioAPIException`、`LabelStudioDatabaseException`、`LabelStudioDatabaseLockedException`、`ProjectExistException`、`SsrfBlockedUrlError` 以及 `extract_message()` |
| `label_studio/core/utils/common.py` | `custom_exception_handler` —— DRF 全局异常处理器 |
| `label_studio/core/settings/base.py` | 配置 `EXCEPTION_HANDLER` 指向上述处理器 |
| `label_studio/core/middleware.py` | `DatabaseIsLockedRetryMiddleware`（SQLite 锁重试）、`ContextLogMiddleware`（请求/响应上下文日志）等 |
| `label_studio/tasks/exceptions.py` | `AnnotationDuplicateError`（409 Conflict） |
| `label_studio/labels_manager/exceptions.py` | `LabelBulkUpdateError`（422 Unprocessable Entity） |
| `label_studio/io_storages/exceptions.py` | `UnsupportedFileFormatError(ValueError)`（非 API 异常） |
| `label_studio/data_manager/serializers.py` | `LockedViewError`、`ViewSaveConflictError`（直接继承 DRF `APIException`） |
| `label_studio/jwt_auth/views.py` | `TokenExistsError(APIException)` |
| `label_studio/fsm/state_manager.py` | `StateManagerError` / `InvalidTransitionError`（业务内部异常） |
| `label_studio/fsm/transitions.py` | `TransitionValidationError(Exception)` |

## 3. 架构与约定

### 3.1 异常类层次
```
Exception
├── LabelStudioError
└── DRF.APIException
    └── LabelStudioAPIException
        ├── LabelStudioDatabaseException
        ├── LabelStudioDatabaseLockedException
        ├── ProjectExistException
        └── SsrfBlockedUrlError
```
- `LabelStudioAPIException` 默认 `status_code=500`、`default_detail='Unknown error'`，子类通过覆盖 `status_code` 和 `default_detail` 表达语义化错误码（如 409、422、403）。
- 非 API 场景的异常使用原生 Python 异常：`ValueError`、`TypeError`、`IOError`、`KeyError`、`RuntimeError` 等散落在各工具函数中。
- 存储层、FSM 等内部子系统使用独立的 `*Error` 基类（如 `S3StorageError`、`StateManagerError`），不混入 API 层。

### 3.2 全局异常处理器 (`custom_exception_handler`)
- 为每个异常生成 UUID 作为 `id`，写入响应体并作为 `exception_id` 传入 Sentry。
- 对 `DRF.APIException` 且 `status_code < 500` 的情况跳过 Sentry 上报（避免把正常校验失败当作生产告警）。
- 调用 DRF 内置 `exception_handler`；若返回 Response，则提取 `detail` 或将其包装到 `validation_errors` 命名空间下，统一响应结构：
  ```json
  {
    "id": "...",
    "status_code": 422,
    "version": "x.y.z",
    "detail": "...",
    "display_context": {...},
    "exc_info": null
  }
  ```
- 对非 DRF 异常：构造 500 响应，附带 `exc_info`（traceback，仅在 `DEBUG_MODAL_EXCEPTIONS=True` 时保留）。
- 特殊分支：`LabelStudioXMLSyntaxErrorSentryIgnored` → 400；`TooManyFilesSent` → 400 并给出上传数量限制提示。
- 将 `OperationalError('database is locked')` 转换为 `LabelStudioDatabaseLockedException`，以便上层识别。

### 3.3 中间件级错误恢复
`DatabaseIsLockedRetryMiddleware` 仅当 `DJANGO_DB == sqlite` 时启用（否则抛出 `MiddlewareNotUsed`）。它检测状态码 500 且响应体包含 `b'database-is-locked-error'` 的请求，最多重试 15 次，初始间隔 1 秒、按 1.5 倍退避。该标记由 `LabelStudioDatabaseLockedException` 的 detail 文本携带（HTML 链接中包含 `database-is-locked-errors`）。

### 3.4 其他中间件相关行为
- `ContextLogMiddleware` 捕获请求 body（JSON 或 UTF-8 解码），并在 `process_response` 中发送结构化日志。
- `DisableCSRF` 配合 `enforce_csrf_checks` 装饰器，按视图/查询参数开关 CSRF。
- `HumanSignalCspMiddleware` 根据响应标记切换 CSP report-only ↔ 常规策略。

### 3.5 业务模块的异常使用模式
- `tasks/exceptions.AnnotationDuplicateError`：继承 `LabelStudioAPIException`，设置 409 Conflict。
- `labels_manager/exceptions.LabelBulkUpdateError`：继承 `LabelStudioAPIException`，设置 422。
- `io_storages.exceptions.UnsupportedFileFormatError`：继承 `ValueError`，属于非 API 异常，由调用方捕获后自行处理。
- `data_manager.serializers.LockedViewError` / `ViewSaveConflictError`：直接继承 DRF `APIException`，绕过自定义基类。
- `jwt_auth.views.TokenExistsError`：直接继承 DRF `APIException`。
- FSM 子系统的 `StateManagerError` / `InvalidTransitionError` / `TransitionValidationError`：纯 Python 异常，用于状态机内部校验。

## 4. 约定与约束

- **API 错误必须通过 DRF `APIException` 或其子类抛出**，并由 `core/utils/common.custom_exception_handler` 统一收敛。这是通过 `settings.base.EXCEPTION_HANDLER` 强制生效的。
- **领域 API 异常应继承 `LabelStudioAPIException`**，并通过覆盖 `status_code` 与 `default_detail` 表达语义（见 `ProjectExistException`、`AnnotationDuplicateError`、`LabelBulkUpdateError`、`SsrfBlockedUrlError`）。
- **非 API 的内部错误使用原生 Python 异常**（`ValueError`、`TypeError`、`KeyError`、`IOError`、`RuntimeError` 等），不进入 DRF 异常通道。
- **数据库锁错误**：底层 `OperationalError('database is locked')` 被处理器转换为 `LabelStudioDatabaseLockedException`，再由 `DatabaseIsLockedRetryMiddleware` 针对 SQLite 自动重试——这是一种显式的“错误→恢复”约定。
- **Sentry 上报规则**：非 5xx 的 DRF 异常（含 4xx 校验错误）默认跳过 Sentry，减少噪声；只有 5xx 或未识别异常才上报。
- **响应体结构**：所有经 DRF 处理的异常最终输出 `{id, status_code, version, detail, display_context?, exc_info?}`，校验错误额外以 `validation_errors` 字段承载。
- **SSRF 防护**：`core/utils/io.py` 在 URL 解析阶段抛出 `SsrfBlockedUrlError`（403 Forbidden），是安全边界上的专用异常类型。
- **模板错误页面**：Django 模板 `templates/403.html`、`templates/404.html`、`templates/500.html` 提供 HTML 错误页，与 JSON API 错误并行存在。

## 5. 观察到的缺口

- 部分模块（`data_manager.serializers`、`jwt_auth.views`）直接继承 DRF `APIException` 而非 `LabelStudioAPIException`，说明基类并非强制约束，而是约定。
- 大量工具函数直接使用 `raise ValueError(...)` / `raise TypeError(...)`，没有统一的包装层，这些异常会走 `custom_exception_handler` 的非标准分支，产生 500 响应。
- 未发现 `try/except ... finally` 形式的资源清理模式，也未发现 `panic/recover`（Python 无此概念）；错误传播主要依赖异常冒泡至 DRF 处理器。