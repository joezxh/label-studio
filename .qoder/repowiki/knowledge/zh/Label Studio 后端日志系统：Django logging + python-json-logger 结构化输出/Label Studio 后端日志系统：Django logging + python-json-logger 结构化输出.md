---
kind: logging_system
name: Label Studio 后端日志系统：Django logging + python-json-logger 结构化输出
category: logging_system
scope:
    - '**'
source_files:
    - label_studio/core/settings/base.py
    - label_studio/core/utils/formatter.py
    - label_studio/core/middleware.py
    - label_studio/core/current_request.py
    - label_studio/core/utils/contextlog.py
---

## 1. 使用的框架与工具

- Python 标准库 `logging` 模块作为唯一日志框架。
- 通过 Django 的 `LOGGING` 配置字典（`label_studio/core/settings/base.py`）集中初始化。
- JSON 格式由第三方包 `pythonjsonlogger` 提供，自定义类 `CustomJsonFormatter` 继承自 `jsonlogger.JsonFormatter`（见 `label_studio/core/utils/formatter.py`）。
- 未引入额外的日志采集/聚合 SDK；仅有一个独立的遥测组件 `ContextLog`（`label_studio/core/utils/contextlog.py`），将请求上下文以 HTTP POST 发送到 `https://tele.labelstud.io`，不属于应用日志通道。

## 2. 关键文件

- `label_studio/core/settings/base.py`：定义 `LOGGING` 配置、格式化器、处理器、根 logger 级别及第三方 logger 抑制规则。
- `label_studio/core/utils/formatter.py`：`CustomJsonFormatter`，在每条 JSON 日志中注入 `request_id` 字段。
- `label_studio/core/middleware.py`：会话超时等关键业务路径使用 `logger.info(...)` 记录行为。
- `label_studio/core/current_request.py`：提供 `get_current_request()`，被 `CustomJsonFormatter` 用于从当前线程上下文取 `X-Request-ID`。
- `label_studio/core/utils/contextlog.py`：`ContextLog` 类，负责收集并上报用户交互遥测数据（独立于应用日志）。