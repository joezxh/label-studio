---
title: Interactive LLM labeling with GPT
type: guide
tier: all
order: 5
hide_menu: true
hide_frontmatter_title: true
meta_title: Interactive LLM labeling with OpenAI, Azure, or Ollama
meta_description: Label Studio tutorial for interactive LLM labeling with OpenAI, Azure, or Ollama
categories:
    - Generative AI
    - Large Language Model
    - OpenAI
    - Azure
    - Ollama
    - ChatGPT
image: "/guide/ml_tutorials/llm-interactive.png"
---

# 交互式 LLM 标注

此示例服务器将 Label Studio 连接到 [OpenAI](https://platform.openai.com/)、[Ollama](https://ollama.com/) 或 [Azure](https://azure.microsoft.com/en-us/products/ai-services/openai-service) API，以与 GPT 聊天模型（gpt-3.5-turbo、gpt-4 等）进行交互。

交互式流程允许你执行以下场景：

* 根据 LLM 提示自动标注数据（例如"将此文本分类为讽刺或不讽刺"）
* 收集用户提示和响应输入对，以微调你自己的 LLM。
* 自动化对图像文档的数据收集和摘要。
* 创建 RLHF（基于人类反馈的强化学习）循环，以改进 LLM 的性能。
* 评估 LLM 的性能。

查看更多示例，请参阅 [生成式 AI 模板](https://labelstud.io/templates/gallery_generative_ai) 部分。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`llm_interactive` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/llm_interactive)。

## 快速开始

1. 在 `http://localhost:9090` 上构建并启动机器学习后端 <br /><br />
```bash
docker-compose up
```

2. 检查它是否工作：<br /><br />
 ```bash
$ curl http://localhost:9090/health
{"status":"UP"}
```

3. 打开一个 Label Studio 项目并转到 **设置 > 模型（Settings > Model）**。[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)，指定 `http://localhost:9090` 作为 URL。

   确保启用了 **交互式预标注（Interactive preannotations）** 切换开关，然后点击 **验证并保存（Validate and Save）**。
4. 项目配置应与 ML 后端兼容。此 ML 后端可以支持各种输入数据格式，如纯文本、超文本、图像和结构化对话。为确保项目配置兼容，请遵循以下规则：

   - 项目应包含至少一个用作提示输入的 `<TextArea>` 标签。要指定要使用哪个 `<TextArea>` 标签，请设置 `PROMPT_PREFIX` 环境变量。
   例如，如果你的标注配置包含 `<TextArea name="prompt" ...>`，那么你将指定 `PROMPT_PREFIX=prompt`。
   - 项目应包含来自以下受支持标签列表中至少一个输入数据标签：`<Text>`、`<Image>`、`<HyperText>`、`<Paragraphs>`。
   - 如果你想将生成的 LLM 响应捕获为标签，你的标注配置应包含 `<Choices>` 标签。
   例如 `<Choices name="choices" ...>`。
   - 如果你想设置在用户输入之前显示的默认提示，可以设置 `DEFAULT_PROMPT` 环境变量。例如 `DEFAULT_PROMPT="Classify this text as sarcastic or not. Text: {text}, Labels: {labels}"`（将此文本分类为讽刺或不讽刺。文本：{text}，标签：{labels}）或 `DEFAULT_PROMPT=/path/to/prompt.txt`。

    请注意，默认提示在 `USE_INTERNAL_PROMPT_TEMPLATE=1` 模式下不受支持，因此你将需要设置 `USE_INTERNAL_PROMPT_TEMPLATE=0` 才能使用默认提示。你可以在提示模板中使用 `task['data']` 中的字段，以及特殊的 `{labels}` 字段来显示可用标签的列表。

5. 打开一个任务并确保启用了 **自动标注（Auto-Annotation）** 切换开关（它位于标注界面的底部）。
6. 在提示输入框中输入提示并按 `Shift+Enter`。将生成 LLM 响应并显示在响应字段中。
7. 如果你想一次将 LLM 自动标注应用于多个任务，请转到 [数据管理器](https://labelstud.io/guide/manage_data)，选择一组任务，然后选择 **操作 > 检索预测（Actions > Retrieve Predictions）**（或在 Label Studio Enterprise 中的 **批量预测（Batch Predictions）**）。

## 配置示例

### 提示工程与模型响应评估

```xml

<View>
    <Style>
        .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }

        .text-container {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
        font-family: 'Courier New', monospace;
        line-height: 1.6;
        font-size: 16px;
        }
    </Style>
    <Header value="Context:"/>
    <View className="text-container">
        <Text name="context" value="$text"/>
    </View>
    <Header value="Prompt:"/>
    <View className="prompt">
        <TextArea name="prompt"
                  toName="context"
                  rows="4"
                  editable="true"
                  maxSubmissions="1"
                  showSubmitButton="false"
                  placeholder="Type your prompt here then Shift+Enter..."
        />
    </View>
    <Header value="Response:"/>
    <TextArea name="response"
              toName="context"
              rows="4"
              editable="true"
              maxSubmissions="1"
              showSubmitButton="false"
              smart="false"
              placeholder="Generated response will appear here..."
    />
    <Header value="Evaluate model response using one or more metrics:"/>
    <Taxonomy name="evals" toName="context" leafsOnly="true" showFullPath="true" pathSeparator=": ">
        <Choice value="Relevance">
            <Choice value="Relevant"/>
            <Choice value="Irrelevant"/>
        </Choice>
        <Choice value="Correctness">
            <Choice value="Correct"/>
            <Choice value="Incorrect"/>
            <Choice value="Contains hallucinations"/>
        </Choice>
        <Choice value="Bias">
            <Choice value="Gender" hint="Discrimination based on a person's gender."/>
            <Choice value="Political"
                    hint="A preference for or prejudice against a particular political party, ideology, or set of beliefs."/>
            <Choice value="Racial/Ethnic"
                    hint="Prejudice or discrimination based on a person's race, ethnicity, or national origin."/>
            <Choice value="Geographical"
                    hint=" Prejudices or preferential treatment based on where a person lives or comes from."/>
        </Choice>
        <Choice value="Toxicity">
            <Choice value="Personal Attacks"
                    hint="Insults or hostile comments aimed at degrading the individual rather than addressing their ideas."/>
            <Choice value="Mockery" hint="Sarcasm or ridicule used to belittle someone."/>
            <Choice value="Hate"
                    hint="Expressions of intense dislike or disgust, often targeting someone's identity or beliefs."/>
            <Choice value="Dismissive Statements"
                    hint="Comments that invalidate the person's viewpoint or shut down discussion without engaging constructively."/>
            <Choice value="Threats or Intimidation"
                    hint="Statements intending to frighten, control, or harm someone, either physically or emotionally."/>
            <Choice value="Profanity"
                    hint="Use of strong or offensive language that may be considered disrespectful or vulgar."/>
            <Choice value="Sexual Harassment" hint="Unwelcome or inappropriate sexual remarks or physical advances."/>
        </Choice>
    </Taxonomy>
    <Header value="Overall response quality:"/>
    <Rating name="rating" toName="context"/>
</View>
```

### 自动文本分类

```xml

<View>
    <Style>
        .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
    </Style>
    <!-- Input data -->
    <Text name="text" value="$text"/>
    <!-- Prompt input -->
    <TextArea name="prompt" toName="text" editable="true" rows="2" maxSubmissions="1" showSubmitButton="false"/>
    <!-- LLM response output -->
    <TextArea name="response" toName="text" smart="false" editable="true"/>
    <View style="box-shadow: 2px 2px 5px #999;
               padding: 20px; margin-top: 2em;
               border-radius: 5px;">
        <Choices name="sentiment" toName="text"
                 choice="multiple" showInLine="true">
            <Choice value="Sarcastic"/>
            <Choice value="Not Sarcastic"/>
        </Choices>
    </View>
</View>
```

**示例数据输入：**

```json
{
  "text": "I love it when my computer crashes"
}
```

### 为 LLM 监督微调收集数据

使用 [`<Paragraphs>`](https://labelstud.io/tags/paragraphs) 标签表示 ChatGPT 风格的界面：

```xml

<View>
    <Style>
        .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
    </Style>
    <Paragraphs name="chat" value="$dialogue" layout="dialogue" textKey="content" nameKey="role"/>
    <Header value="User prompt:"/>
    <View className="prompt">
        <TextArea name="prompt" toName="chat" rows="4" editable="true" maxSubmissions="1" showSubmitButton="false"/>
    </View>
    <Header value="Bot answer:"/>
    <TextArea name="response" toName="chat" rows="4" editable="true" smart="false" maxSubmissions="1" showSubmitButton="false"/>

</View>
```

**示例数据输入：**

```json
{
  "dialogue": [
    {
      "role": "user",
      "content": "What is the capital of France?"
    },
    {
      "role": "assistant",
      "content": "The capital of France is Paris."
    },
    {
      "role": "user",
      "content": "Tell me a joke."
    }
  ]
}
```

### 自动化对图像文档的数据收集和摘要

```xml

<View>
    <Style>
        .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }

        .container {
        display: flex;
        justify-content: space-between; /* Align children with space in between */
        align-items: flex-start; /* Align children at the start of the cross axis */
        }

        .image {
        /* Adjust these values according to the size of your image */
        width: 600px; /* Example width for the image */
        height: auto; /* Maintain aspect ratio */
        /* Removed position: sticky, float: right, and margin-right */
        }

        .blocks {
        width: calc(100% - 220px); /* Adjust the calculation to account for the image width and some margin */
        height: 600px; /* Set the height for the scrolling area */
        overflow-y: scroll; /* Allow vertical scrolling */
        }

        .block {
        background-color: #f0f0f0; /* Sample background color for each block */
        padding: 20px; /* Spacing inside each block */
        margin-bottom: 10px; /* Spacing between blocks */
        }


    </Style>
    <View className="container">
        <View className="blocks">

            <View className="block">
                <Header value="Prompt:"/>
                <View className="prompt">
                    <TextArea name="prompt" toName="image"
                              showSubmitButton="false"
                              editable="true"
                              rows="3"
                              required="true"/>
                </View>
                <Header value="Classification:"/>

                <Choices name="category" toName="image" smart="false" layout="select">
                    <Choice value="Groceries"/>
                    <Choice value="Dining/Restaurants"/>
                    <Choice value="Clothing/Apparel"/>
                    <Choice value="Electronics"/>
                    <Choice value="Home Improvement"/>
                    <Choice value="Health/Pharmacy"/>
                    <Choice value="Gasoline/Fuel"/>
                    <Choice value="Transportation/Travel"/>
                    <Choice value="Entertainment/Leisure"/>
                    <Choice value="Utilities/Bills"/>
                    <Choice value="Insurance"/>
                    <Choice value="Gifts/Donations"/>
                    <Choice value="Personal Care"/>
                    <Choice value="Education/Books"/>
                    <Choice value="Professional Services"/>
                    <Choice value="Membership/Subscriptions"/>
                    <Choice value="Taxes"/>
                    <Choice value="Vehicle Maintenance/Repairs"/>
                    <Choice value="Pet Care"/>
                    <Choice value="Home Furnishings/Decor"/>
                    <Choice value="Other"/>
                </Choices>
            </View>
            <View className="block">
                <Header value="Summary:"/>
                <TextArea name="summarization-response" toName="image"
                          showSubmitButton="false"
                          maxSubmissions="0"
                          editable="true"
                          smart="false"
                          rows="3"
                />
            </View>
        </View>
        <View className="image">
            <Image name="image" value="$image"/>
        </View>
    </View>
</View>
```

**示例数据输入：**

```json
{
  "image": "https://sandbox2-test-bucket.s3.amazonaws.com/receipts/113494_page1.png"
}
```

## 参数

部署服务器时，你可以将以下参数指定为环境变量：

- `DEFAULT_PROMPT`：定义在用户输入之前显示的默认提示。例如 `DEFAULT_PROMPT="Classify this text as sarcastic or not. Text: {text}, Labels: {labels}"`（将此文本分类为讽刺或不讽刺。文本：{text}，标签：{labels}）或 `DEFAULT_PROMPT=/path/to/prompt.txt`。

    请注意，如果你正在设置默认提示，则 `USE_INTERNAL_PROMPT_TEMPLATE` 应设置为 `0`。

- `PROMPT_PREFIX`（默认值：`prompt`）：提示输入字段的标识符。例如，如果你将
  `PROMPT_PREFIX` 设置为 `my-prompt`，则将使用以下输入字段作为
  提示：`<TextArea name="my-prompt" ...>`。

- `USE_INTERNAL_PROMPT_TEMPLATE`（默认值：`1`）。如果设置为 `1`，服务器将使用内部提示模板。如果设置为
  `0`，服务器将使用输入提示中提供的提示模板。

- `PROMPT_TEMPLATE`（默认值：`"Source Text: {text}\n\nTask Directive: {prompt}"`）：要使用的提示模板：

  - 如果 `USE_INTERNAL_PROMPT_TEMPLATE` 设置为 `1`，服务器将使用
  默认的内部提示模板。

  - 如果 `USE_INTERNAL_PROMPT_TEMPLATE` 设置为 `0`，服务器将使用输入提示中提供的提示模板（即来自 `<TextArea name="my-prompt" ...>` 的用户输入）。

    在后一种情况下，用户必须提供与输入任务字段匹配的占位符。例如，如果用户想要使用来自输入任务 `{"input_text": "user text", "instruction": "user instruction"}` 的 `input_text` 和 `instruction` 字段，用户必须提供如下的提示模板：`"Source Text: {input_text}, Custom instruction : {instruction}"`。

- `OPENAI_MODEL`（默认值：`gpt-3.5-turbo`）：要使用的 OpenAI 模型。

- `OPENAI_PROVIDER`（可用选项：`openai`、`azure`、`ollama`，默认值 - `openai`）：要使用的 OpenAI 提供方。

- `TEMPERATURE`（默认值：`0.7`）：模型使用的温度。

- `NUM_RESPONSES`（默认值：`1`）：在 `<TextArea>` 输出字段中生成的响应数量。如果你想
  生成多个响应并让用户对最佳响应进行排序，这将很有用。

- `OPENAI_API_KEY`：要使用的 OpenAI 或 Azure API 密钥。必须在部署服务器之前设置。

### Azure 配置

如果你使用 Azure 作为你的 OpenAI 提供方（`OPENAI_PROVIDER=azure`），你需要指定以下环境变量：

- `AZURE_RESOURCE_ENDPOINT`：这是你的 Azure 资源的端点。应根据你的 Azure 设置将其设置为适当的值。

- `AZURE_DEPLOYMENT_NAME`：这是你的 Azure 部署的名称。它应与你在 Azure 中给部署指定的名称相匹配。

- `AZURE_API_VERSION`：这是你正在使用的 Azure API 的版本。默认值为 `2023-05-15`。

### Ollama 配置

如果你使用 Ollama 作为你的 LLM 提供方（`OPENAI_PROVIDER=ollama`），你需要指定以下环境变量：

- `OPENAI_MODEL`：要使用的 Ollama 模型，例如 `llama3`。

- `OLLAMA_ENDPOINT`：这是你的 Ollama 端点的端点。应根据你的设置将其设置为适当的值。如果你在本地运行它，则通常可以在 `http://host.docker.internal:11434/v1/` 上访问它
