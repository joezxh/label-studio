
### OpenAI

每个组织只能拥有一个 OpenAI 密钥。这会授予你访问一组白名单模型的权限。有关这些模型的列表，请参阅[支持的基座模型](#Supported-base-models)。

如果你还没有账户，可以[在此创建 OpenAI 账户](https://platform.openai.com/signup)。

你可以在 [API 密钥页面](https://platform.openai.com/api-keys) 找到你的 OpenAI API 密钥。

### Gemini

每个组织只能拥有一个 Gemini 密钥。这会授予你访问一组白名单模型的权限。有关这些模型的列表，请参阅[支持的基座模型](#Supported-base-models)。

有关获取 Gemini API 密钥的信息，请参阅 [Get a Gemini API key](https://ai.google.dev/gemini-api/docs/api-key)。

### Vertex AI

每个组织只能拥有一个 Vertex AI 密钥。这会授予你访问一组白名单模型的权限。有关这些模型的列表，请参阅[支持的基座模型](#Supported-base-models)。

请按照此处的说明生成 JSON 格式的凭据文件：[Authenticate to Vertex AI Agent Builder - Client libraries or third-party tools](https://cloud.google.com/generative-ai-app-builder/docs/authentication#client-libs)

JSON 凭据是必需的。你也可以选择性地提供与你的 Google Cloud Platform 环境关联的项目 ID 和位置。

### Anthropic

每个组织只能拥有一个 Anthropic 密钥。这会授予你访问一组白名单模型的权限。有关这些模型的列表，请参阅[支持的基座模型](#Supported-base-models)。

有关获取 Anthropic API 密钥的信息，请参阅 [Anthropic - Accessing the API](https://docs.anthropic.com/en/api/getting-started#accessing-the-api)。

### Azure OpenAI

每个 Azure OpenAI 密钥都绑定到特定的部署，而每个部署包含一个单独的 OpenAI 模型。因此，如果你想通过 Azure 使用多个模型，需要为每个模型创建一个部署，然后将每个密钥添加到 Label Studio。

有关我们支持的 Azure OpenAI 模型列表，请参阅[支持的基座模型](#Supported-base-models)。

要使用 Azure OpenAI，你必须先创建 Azure OpenAI 资源，然后创建一个模型部署：

1. 在 Azure 门户中，[创建 Azure OpenAI 资源](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource)。

2. 在 Azure OpenAI Studio 中，[创建部署](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model)。这是一个基座模型终结点。

将密钥添加到 Label Studio 时，系统会要求你提供以下信息：

| 字段 | 说明 |
| --- | --- |
| **部署（Deployment）** | 部署的名称。默认情况下，它与模型名称相同，但你可以在创建部署时自定义。如果它们不同，你必须使用部署名称，而不是底层模型名称。 |
| **终结点（Endpoint）** | 这是 Azure 提供的目标 URI。  |
| **API 密钥** | 这是 Azure 提供的密钥。 |

你可以在 Azure OpenAI Studio 中部署的 **Details（详细信息）** 部分找到所有这些相关信息。

![Azure 部署详细信息截图](/images/prompts/azure_deployment.png)

### Azure AI Foundry

使用 Azure AI Foundry 模型目录来部署模型：[AI Foundry 文档](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/model-catalog-overview)。

部署完成后，导航到已部署模型的 Details（详细信息）页面。设置与 Label Studio 连接所需的信息位于 **Endpoint（终结点）** 下：

![AI Foundry 终结点详细信息截图](/images/prompts/ai-foundry.png)

将密钥添加到 Label Studio 时，系统会要求你提供以下信息：

| 字段 | 说明 |
| --- | --- |
| **模型（Model）** | 模型名称。它与你的终结点信息一起作为参数提供（见上方截图）。 |
| **终结点（Endpoint）** | 这是 AI Foundry 提供的 **Target URI（目标 URI）**。  |
| **API 密钥** | 这是 AI Foundry 提供的 **Key（密钥）**。 |


### 自定义 LLM

你可以使用自己自托管和微调的模型，只要它满足以下标准：

* 你的服务器必须为 LLM 提供 [JSON 模式](https://js.useinstructor.com/concepts/patching/#json-schema-mode)，具体来说，API 必须接受带 `type: json_object` 的 `response_format` 以及带有效 JSON schema 的 `schema`：`{"response_format": {"type": "json_object", "schema": <schema>}}`
* 服务器 API 必须遵循 [OpenAI 格式](https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format)。

兼容的 LLM 示例包括 [Ollama](https://ollama.com/) 和 [sglang](https://github.com/sgl-project/sglang?tab=readme-ov-file#openai-compatible-api)。

要添加自定义模型，请输入以下内容：

* 模型的名称。
* 模型的终结点 URL。例如 `https://my.openai.endpoint.com/v1`
* 访问模型的 API 密钥。API 密钥绑定到特定账户，但如果添加，则访问权限在组织内共享。（可选）
* 访问模型 API 的认证令牌（auth token）。认证令牌在服务器级别提供 API 访问。（可选）

#### 使用 Ollama 的示例

1. 安装 [Ollama](https://ollama.com/)，例如 `ollama run llama3.2`
2. [验证你的本地 OpenAI 兼容 API 是否正常工作](https://ollama.com/blog/openai-compatibility)，例如 `http://localhost:11434/v1`
3. 创建对外暴露的终结点，例如 `https://my.openai.endpoint.com/v1` -> `http://localhost:11434/v1`
4. 添加到 Label Studio 的连接：
    - 名称：`llama3.2`（必须与 Ollama 中的模型名称一致）
    - 终结点：`https://my.openai.endpoint.com/v1`（注意需要 `v1` 后缀）
    - API 密钥：`ollama`（默认）
    - 认证令牌：空


#### 使用 Hugging Face Inference Endpoints 的示例
1. 使用 [DeepSeek 模型](https://huggingface.co/deepseek-ai/DeepSeek-R1)
2. 在 `API Keys（API 密钥）` 中，添加到 `Custom（自定义）` 提供方：
    - 名称：`deepseek-ai/DeepSeek-R1`
    - 终结点：`https://router.huggingface.co/together/v1`
    - API 密钥：`<your-hf-api-key>`
    - 认证令牌：空
