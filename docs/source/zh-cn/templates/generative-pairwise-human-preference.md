---
title: 面向 RLHF 的人类偏好数据收集
type: templates
category: LLM Fine-tuning
cat: llm-fine-tuning
order: 904
is_new: t
meta_title: 创建用于 RLHF 人类偏好数据收集的数据集
meta_description: 用于使用 Label Studio 创建面向 RLHF 的人类偏好数据收集数据集的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/generative-pairwise-human-preference.png" alt="" class="gif-border" width="700px" />

本项目将帮助你通过收集比较数据来确立对人类偏好的判断，从而将你的 LLM 提升到 ChatGPT 的质量水平，这些比较数据用于评估监督模型生成的回答。

通过对多个回答按质量进行排序，你可以训练出一个能够有效捕捉人类偏好的奖励模型。该奖励模型在强化学习中发挥着至关重要的作用，能够优化微调后的基础模型的性能。

#### 延伸阅读与资源

- [收集人类反馈教程](https://github.com/HumanSignal/RLHF/blob/master/tutorials/RLHF_with_Custom_Datasets.ipynb) 一份 Jupyter Notebook 教程，将引导你一步步完成收集比较数据、确立人类偏好，并将这些反馈纳入奖励模型训练的过程。
- [RLHF 资源](https://github.com/HumanSignal/RLHF)：关于如何收集数据并构建端到端的「基于人类反馈的强化学习（RLHF）」系统来微调生成式 AI 模型的一系列链接、教程和最佳实践。
- [Awesome-Human-in-the-Loop 列表](https://github.com/HumanSignal/awesome-human-in-the-loop)：一个关于用于模型再训练的人类参与（human-in-the-loop）资源与参考的精选列表。
- [演讲：通过人类反馈改进机器学习](https://youtu.be/nx_vJpux_Sg)：来自 PyData Berlin 的一场演讲，介绍如何使用 RLHF 通过人类反馈改进机器学习。
- [研讨会：强化学习入门](https://youtu.be/Oqo8k8SyMX4)：关于如何开始使用强化学习的研讨会。
- [指南：你今天可以微调的五个大语言模型](https://labelstud.io/blog/five-large-language-models-you-can-fine-tune-today/)
  
## 如何收集数据集

RLHF 的数据集由两部分组成：

1. 输入提示词
2. 每个提示词对应的多个生成回答。

为了简化人工标注人员的工作，建议每个提示词提供 2 个可选择的回答。

从一组初始的提示词和回答开始，其中每个条目都是一个具有以下结构的 JSON 对象：

```json
[{
    "prompt": "The quick brown fox...",
    "answer1": "jumps over the lazy dog.",
    "answer2": "bags few lynx."
}, ...]
```

你可以手动生成这些示例，或者使用你的 [基线模型生成多个备选假设](https://huggingface.co/blog/how-to-generate)。

在数据集开始收集到 `dataset.json` 文件后，创建一个项目并将数据集上传到 Label Studio。

## 启动你的标注项目

1. 在 Label Studio 中创建新项目
2. 进入 `设置 > 标注界面 > 浏览模板 > 生成式 AI > 面向 RLHF 的人类偏好收集`
3. 保存项目

## 导入数据集

使用 Python SDK，你可以将带有输入提示词的数据集导入 Label Studio。使用你刚创建的项目的 `PROJECT_ID`，运行以下代码：

```python
from label_studio_sdk import Client

ls = Client(url='<YOUR-LABEL-STUDIO-URL>', api_key='<YOUR-API_KEY>')

project = ls.get_project(id=PROJECT_ID)
project.import_tasks('dataset.json')
```

然后你可以通过创建回答来开始标注数据集。

## 如何配置标注界面

`面向 RLHF 的人类偏好收集` 模板包含以下 XML 格式的标注界面：

```xml

<View className="root">
  <Style>
    .root {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Roboto',
        sans-serif;
      line-height: 1.6;
      background-color: #f0f0f0;
    }

    .container {
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
    }

    .prompt {
      padding: 20px;
      background-color: #0084ff;
      color: #ffffff;
      border-radius: 5px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    }

    .answers {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }

    .answer-box {
      flex-basis: 49%;
      padding: 20px;
      background-color: rgba(44, 62, 80, 0.9);
      color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    }

    .answer-box p {
      word-wrap: break-word;
    }

    .answer-box:hover {
      background-color: rgba(52, 73, 94, 0.9);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .lsf-richtext__line:hover {
      background: unset;
    }

    .answer-box .lsf-object {
      padding: 20px
    }
  </Style>
  <View className="container">
    <View className="prompt">
      <Text name="prompt" value="$prompt" />
    </View>
    <View className="answers">
      <Pairwise name="comparison" toName="answer1,answer2"
                selectionStyle="background-color: #27ae60; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2); border: 2px solid #2ecc71; cursor: pointer; transition: all 0.3s ease;" />
      <View className="answer-box">
        <Text name="answer1" value="$answer1" />
      </View>
      <View className="answer-box">
        <Text name="answer2" value="$answer2" />
      </View>
    </View>
  </View>
</View>
<!--{ "data" : {
  "prompt": "What are the key benefits of using Reinforcement Learning from Human Feedback (RLHF) for dataset collection in the context of Large Language Model (LLM) generation?",
  "answer1": "Reinforcement Learning from Human Feedback (RLHF) for dataset collection in Large Language Model (LLM) generation provides key benefits such as improved model performance through direct optimization, better alignment with human values by incorporating human feedback, and the ability to iteratively refine the model based on user interactions, resulting in a more user-friendly and efficient language model.",
  "answer2": "Using Reinforcement Learning from Human Feedback (RLHF) for dataset collection in Large Language Model (LLM) generation offers advantages such as enhanced model capabilities by optimizing for desired outcomes, greater adaptability to human preferences through the inclusion of human feedback, and the opportunity to continuously improve the model based on user experiences, ultimately leading to a more effective and responsive language model."
}}
-->

```

`<Style>` 部分为标注界面定义了自定义的 UI 设计，并配合 `<View>` 标签提供的布局。
在本示例中，我们使用了一个包含提示词和两个回答框的简单布局。`<Pairwise>` 标签定义了对写在 `<Text>` 标签中的回答进行的两两比较。
显示的文本取自 `$prompt`、`$answer1` 和 `$answer2` 变量，这些变量由 `<Text>` 标签通过 `value` 属性定义。

此外，你可以修改 XML 注释部分中的 `"prompt"`、`$answer1` 和 `$answer2`，以查看使用你自己的数据时的效果。

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

以上表示带有标注的任务列表。每个任务都有一个 `data.prompt` 字段，包含输入提示词，每个 "annotations" 条目在 `result.value.text` 字段下包含回答结果。
每个任务可以创建多个标注。

或者，你可以将相同的数据下载为 CSV 格式：

```csv
prompt,instruction
"Generate...","def sum..."
```

## 如何微调模型

你生成的示例可用于微调开源 LLM 模型，如 GPT-2、T5、Falcon、LLaMa 等。你可以在 [HuggingFace LLM 排行榜](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard) 上查看完整的模型列表，并从 [Model Hub](https://huggingface.co/models) 下载和微调模型。
此外，还有许多可用的微调服务：[OpenAI](https://platform.openai.com/)、[CoHere](https://cohere.com/)、[AI21 Studio](https://www.ai21.com/studio/foundation-models)、[MosaicML](https://www.mosaicml.com/)、[Google Cloud AI Platform](https://cloud.google.com/products/ai)、[AzureML](https://azure.microsoft.com/en-us/free/machine-learning/search/) 等。

## 相关标签

- [Text](/tags/text.html)
- [TextArea](/tags/textarea.html)
- [Style](/tags/style.html)
