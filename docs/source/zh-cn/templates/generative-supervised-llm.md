---
title: 监督式 LLM 微调
type: templates
category: LLM Fine-tuning
cat: llm-fine-tuning
order: 903
is_new: t
meta_title: 创建用于监督式 LLM 微调的数据集
meta_description: 用于使用 Label Studio 创建监督式 LLM 微调数据集的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/generative-supervised-llm.png" alt="" class="gif-border" width="700px"/>

本模板旨在帮助你开始进行监督式 LLM 微调的过程。

监督式 LLM 微调的目标是优化你的大语言模型（LLM），使其针对用户定义的提示词生成比原始基础模型更具上下文针对性的回答。

<a href="https://app.humansignal.com/b/MTk1"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

你可能会在以下多种场景中使用这种方法：

- 文档分类
- 通用问答（QA）系统
- 信息检索
- 客户支持服务

通常，当你需要以下情况时，会出现对这种数据集收集模板的需求：

- 训练大型基础模型以遵循你的指令；
- 创建任何自然语言处理（NLP）类型的模型，例如针对你的领域定制的情感分析、文本摘要、问答、命名实体识别；
- 修正模型在生成回答中的错误；
- 以特定风格生成回答；
- 从少样本（few-shot）模型生成场景切换到零样本（zero-shot）学习模式，而无需提供任何示例；
- 降低模型生成成本。

所有这些任务都需要一个由提示词及相应回答或补全（completions）组成的数据集，例如：

```json
[
  {
    "prompt": "<prompt text>",
    "response": "<generated response>"
  },
  {
    "prompt": "<prompt text>",
    "response": "<generated response>"
  },
  {
    "prompt": "<prompt text>",
    "response": "<generated response>"
  }
]
```

## 如何收集数据集

通过收集初始的一组提示词来启动你的项目：

```json
[
  {
    "prompt": "<prompt text>"
  },
  {
    "prompt": "<prompt text>"
  },
  {
    "prompt": "<prompt text>"
  }
]
```

每个 JSON 条目都会在 Label Studio 中作为一个单独的任务呈现，以完成回答。

## 启动你的标注项目

*需要帮助来开始使用 Label Studio？请查看我们的 [从零到一教程](https://labelstud.io/blog/zero-to-one-getting-started-with-label-studio/)。*

1. 在 Label Studio 中创建新项目
2. 进入 **设置 > 标注界面 > 浏览模板 > 生成式 AI > 监督式 LLM 微调**
3. 保存
或者，你也可以使用我们的 Python SDK 创建一个新项目：

```python
import label_studio_sdk

ls = label_studio_sdk.Client('YOUR_LABEL_STUDIO_URL', 'YOUR_API_KEY')
project = ls.create_project(title='Chatbot Model Assessment', label_config='<View>...</View>')
```

## 导入数据集

使用 Python SDK，你可以将带有输入提示词的数据集导入 Label Studio。使用你刚创建的项目的 `PROJECT_ID`，运行以下代码：

```python
from label_studio_sdk import Client

ls = Client(url='<YOUR-LABEL-STUDIO-URL>', api_key='<YOUR-API_KEY>')

project = ls.get_project(id=PROJECT_ID)
project.import_tasks('prompts.json')
```

然后你可以通过创建回答来开始标注数据集。

## 导出数据集

根据问题陈述的复杂程度，需要对从数百到数千个任务进行标注，才能对你的 LLM 进行微调。

在标注了足够多的任务后，你可以按以下原始的 Label Studio JSON 格式导出数据集：

```json
[
  {
    "id": 1,
    "data": {
      "prompt": "Generate a Python function that takes a list of integers as input and returns the sum of all even numbers in the list."
    },
    "annotations": [
      {
        "id": 1,
        "created_at": "2021-03-03T14:00:00.000000Z",
        "result": [
          {
            "from_name": "instruction",
            "to_name": "prompt",
            "type": "textarea",
            "value": {
              "text": [
                "def sum_even_numbers(numbers):\n    return sum([n for n in numbers if n % 2 == 0])"
              ]
            }
          }
        ],
// other fields
```

它表示带有标注的任务列表。每个任务都有一个 `data.prompt` 字段，包含输入提示词，每个 "annotations" 条目在 `result.value.text` 字段下包含回答结果。
每个任务可以创建多个标注。

或者，你可以将相同的数据下载为 CSV 格式：

```csv
prompt,instruction
"Generate...","def sum..."
```

## 如何配置标注界面

`监督式语言模型微调` 模板包含以下 XML 格式的标注界面：

```xml

<View className="root">
    <Style>
        <!-- 针对提示词和回答输入的不同 CSS 样式 -->
    </Style>
    <View className="container">
        <View className="prompt">
            <Text name="prompt" value="$prompt"/>
        </View>
        <View className="answer-input">
            <TextArea name="instruction" toName="prompt"
                      maxSubmissions="1" required="true"
                      requiredMessage="You must provide the response to the prompt"
                      placeholder="Type your answer here..."
                      rows="10"
            />
        </View>
    </View>
</View>
```

这里它接收 `"$prompt"` 变量中的输入提示词，并将其渲染为 `<Style>` 部分定义的带有蓝色背景的文本块。然后它渲染一个带有黑色背景的文本区域，用于收集标注人员的回答。该回答保存在 `"$instruction"` 变量中。

你可以修改 XML 注释中的 `"prompt"`，以查看使用你自己的数据时的效果。

## 如何微调模型

你生成的示例可用于微调开源 LLM 模型，如 LLaMa、Pythia、Falcon、StableLM、MPT 等。你可以在 [HuggingFace LLM 排行榜](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard) 上查看完整的模型列表，并从 [Model Hub](https://huggingface.co/models) 下载和微调模型。
此外，还有许多可用的微调服务：OpenAI、CoHere、[MosaicML](https://www.mosaicml.com/)、Google Cloud AI Platform、AzureML 等。

## 相关标签

- [Text](/tags/text.html)
- [TextArea](/tags/textarea.html)
- [Style](/tags/style.html)
