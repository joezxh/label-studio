---
title: 使用 Ragas 评估 RAG
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 970
is_new: t
meta_description: 使用 Ragas 指标评估 LLM 回答。
date: 2024-07-26 14:49:57
---

<img src="/images/templates/evaluate-rag-automated-metrics.png" alt="" class="gif-border" width="700px"/>

本模板使用 [Ragas](https://docs.ragas.io/en/stable/) 框架来评估你的 RAG 流水线。当给定一个提示词时，它将使用 Ragas 和 OpenAI 返回以下内容：

* 针对该提示词的 LLM 生成回答（ML 后端示例使用 OpenAI）。
* [忠实度（faithfulness）](https://docs.ragas.io/en/latest/concepts/metrics/faithfulness.html) 和 [回答相关性（answer relevancy）](https://docs.ragas.io/en/latest/concepts/metrics/answer_relevance.html) 的 Ragas 分数。
* 一个 LLM 生成的回答评估。
* 关于具体哪些文档被用作上下文的全面概览。

## 前置条件

本模板需要 ML 后端才能工作。请按照 [RAG 快速入门标注](https://github.com/HumanSignal/label-studio-ml-backend/tree/agi-builders-workshop-rag/label_studio_ml/examples/rag_quickstart) 中的说明将 ML 后端连接到你的项目。

你需要一个 OpenAI API key，以及一个包含文档文件、用作上下文的目录。

!!! info Tip
    如果你只是想试用本模板和 ML 后端，可以克隆 [Label Studio 仓库](https://github.com/HumanSignal/label-studio)，并使用 `label-studio\docs` 目录作为你的上下文。

## 配置标注界面

为你的项目使用以下标注配置：

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
        .ragas input {
            background: none;
            border: none;
            padding: 0;
            margin-top: -8px;
            font-size: 20px;
            font-weight: 600;
        }
        .ragas input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
    </Style>
    <Header value="Question:"/>
    <View className="text-container">
        <Text name="context" value="$text"/>
    </View>
    <Header value="Additional instructions for the LLM prompt (optional):"/>
    <View className="prompt">
        <TextArea name="prompt"
                  toName="context"
                  rows="4"
                  editable="true"
                  showSubmitButton="false"
                  placeholder="Provide additional instructions here then Shift+Enter - to provide none, simply enter a space then shift+enter."
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
  	<View className="ragas" >
    <View style="display: flex;">
      <Header style="padding-right: 1em;" value="Ragas evaluation (averaged, 0 to 100):"/><Number name="float_eval" toName="context" defaultValue="0" />
    </View>
    <TextArea name="ragas"
              toName="context"
              rows="2"
              maxSubmissions="1"
              showSubmitButton="false"
              smart="false"
              placeholder="Ragas evaluation will appear here..."
    />
  	</View>
    <View className="evaluation" >
    <View style="display: flex;">
      <Header style="padding-right: 1em;" value="Textual evaluation:"/>
    </View>
    <TextArea name="evaluation"
              toName="context"
              rows="2"
              maxSubmissions="1"
              showSubmitButton="false"
              smart="false"
              placeholder="Textual evaluation will appear here..."
    />
    </View>
    <Header value="Documentation:"/>
    <View className="documentation">
    <TextArea name="documentation"
              toName="context"
              rows="2"
              maxSubmissions="1"
              showSubmitButton="false"
              smart="false"
              placeholder="Retrieved documentation will appear here..."
    />
    </View>
</View>
```

该配置包含以下元素：

* `<View>` - 所有标注配置都必须包含基础的 `View` 标签。在此配置中，`View` 标签用于配置区块的显示，类似于 HTML 中的 div 标签。它有助于组织标注界面的布局。
* `<Style>` - `Style` 标签用于定义应用于 `View` 内部元素的 CSS 样式。在此配置中，它为标注界面布局的各个部分设置了样式。
* `<Header>` - `Header` 标签用于在标注界面内显示标题。标题的文本在 `value` 参数中定义。
* `<TextArea>` - `TextArea` 标签提供一个可以输入文本的字段。在本例中，大多数文本字段将由 ML 后端自动填充。有一个字段你可以向 LLM 提供额外指令（例如，要求它把答案格式化为列表）。按 **Shift + Enter** 提交你的指令。

## 输入数据

使用上述配置，你需要将输入数据结构化为包含 `text` 元素。这就是 LLM 提示词。例如：

```json
[
  {
    "id": 1,
    "data": {
      "text": "What are the system requirements for Label Studio?"
    }
  },
  {
    "id": 2,
    "data": {
      "text": "How do I update Label Studio?"
    }
  }
]
```

## 相关标签

- [View](/tags/view.html)
- [Style](/tags/style.html)
- [TextArea](/tags/textarea.html)
- [Header](/tags/header.html)
