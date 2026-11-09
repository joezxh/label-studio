---
title: API Reference for Label Studio
short: API
type: guide
tier: all
order: 401
order_enterprise: 401
meta_title: API Endpoints
meta_description: API documentation for authenticating, listing data science projects, importing predictions and raw data and exporting annotated data, and user management.
section: "Integrate & Extend"

---

你可以使用 Label Studio API 导入待标注数据、导出标注结果、为 Label Studio 配置机器学习功能，以及将任务与云存储同步。

更多指引和交互式示例，请参阅 [API 参考文档](https://api.labelstud.io/api-reference/introduction/getting-started)。如果你想用 Python 脚本编写 API 调用，请使用 [Label Studio Python SDK](sdk.html)。

!!! info 提示
    关于使用我们 API 的更多指引，请参阅 [Label Studio API 与 SDK 的 5 个技巧与诀窍](https://labelstud.io/blog/5-tips-and-tricks-for-label-studio-s-api-and-sdk/)。

### 对 API 进行身份认证

你必须获取自己的访问令牌（access token），才能对 API 进行身份认证。

你能否创建令牌，以及可以创建哪些类型的令牌，取决于你的组织设置。

!!! note "API keys 与 Access tokens"
    在 Label Studio 中，**“访问令牌（access tokens）”** 与 **“API keys（API 密钥）”** 含义相同，可互换使用。

访问令牌 / API 密钥有两种类型：**个人访问令牌（PATs）** 与 **旧版令牌（Legacy Tokens）**。

你可以在此处了解更多它们之间的区别：[访问令牌](access_tokens)。

#### 查找你的访问令牌

1. 打开 Label Studio，点击右上角的用户图标。选择 **账户与设置（Account & Settings）**。
2. 在左侧选择 **个人访问令牌（Personal Access Token）** 或 **旧版令牌（Legacy Token）**。

根据你选择的是哪个，你需要生成一个新的令牌，或复制所显示的那个令牌。

#### 使用个人访问令牌对 HTTP API 请求进行身份认证

PAT 在 HTTP API 请求中使用 `'Authorization: Bearer <token>'`，例如：

```bash
curl -X <method> <Label Studio URL>/api/<endpoint> -H 'Authorization: Bearer <token>'
```

#### 使用旧版令牌对 HTTP API 请求进行身份认证

旧版令牌在 HTTP API 请求中使用 `'Authorization: Token <token>'`，例如：

```bash
curl -X <method> <Label Studio URL>/api/<endpoint> -H 'Authorization: Token <token>
```

#### 对 Python SDK 请求进行身份认证

在使用 SDK 时，你无需区分旧版令牌与个人访问令牌。

```python
# 定义 Label Studio 可访问的 URL
LABEL_STUDIO_URL = 'YOUR_BASE_URL'

# API key 可以是你的 PAT 或旧版访问令牌
LABEL_STUDIO_API_KEY = 'YOUR_API_KEY'

# 导入 SDK 与 client 模块
from label_studio_sdk import LabelStudio
client = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=LABEL_STUDIO_API_KEY)
```

请参阅 [API 身份认证文档](https://api.labelstud.io/api-reference/introduction/getting-started#authentication)。

### 列出所有项目

要使用 Label Studio API 执行大多数任务，你必须指定项目 ID，有时也称为 `pk`（主键）。如果你不知道自己的项目 ID 是什么，可以获取你在 Label Studio 中可访问的所有项目列表。请参阅 [列出你的项目 API 端点文档](https://api.labelstud.io/api-reference/api-reference/projects/list)。

### 创建并配置一个项目

使用 API 在 Label Studio 中创建一个项目并配置其标注界面。请参阅 [创建新项目 API 端点文档](https://api.labelstud.io/api-reference/api-reference/projects/create)。

如果你想在通过 API 提交之前，先确认标注界面的配置是否有效，可以使用 [校验标签配置（validate label config）](https://api.labelstud.io/api-reference/api-reference/projects/validate-config) API 端点。

### 使用 API 导入任务

要使用 API 导入任务，请确保你知道要将任务添加到的项目 ID。更多示例与参数说明，请参阅 [导入数据端点文档](https://api.labelstud.io/api-reference/api-reference/tasks/create)。

### 检索任务

检索某个具体项目的分页任务列表。如果需要，你也可以使用此 API 端点来检索任务与标注，作为导出标注的替代方案。详情与参数请见 [列出项目任务端点文档](https://api.labelstud.io/api-reference/api-reference/tasks/list)。

### 导出标注

要导出标注，首先请参阅 [你的项目可导出哪些格式](https://api.labelstud.io/api-reference/api-reference/projects/exports/list-formats)。

从响应中选择你所需的格式，然后调用导出端点。更多详情请参阅 [导出标注](https://api.labelstud.io/api-reference/api-reference/projects/exports/download-sync) 端点文档。
