---
title: 并排 LLM 输出对比
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 960
is_new: t
meta_description: 对两个 LLM 回答进行并排对比评估。
date: 2024-07-26 14:48:48
---

<img src="/images/templates/side-by-side-comparison.png" alt="" class="gif-border" width="700px"/>

有时你需要对比两个不同的模型回答，或者将模型回答与真实标签（ground truth）进行对比。在本模板中，两个选项并排呈现，你点击选择符合你标准的那一个。

有关如何将此模板与 Label Studio SDK 配合使用的教程，请参阅 [评估 LLM 回答](https://api.labelstud.io/tutorials/tutorials/evaluate-llm-responses)。

## 配置标注界面

[创建一个项目](/guide/setup_project) 并使用以下标注配置：

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
```

该配置包含以下元素：

* `<View>` - 所有标注配置都必须包含基础的 `View` 标签。在此配置中，`View` 标签用于配置区块的显示，类似于 HTML 中的 div 标签。它有助于组织标注界面的布局。
* `<Style>` - `Style` 标签用于定义应用于 `View` 内部元素的 CSS 样式。在此配置中，它为标注界面布局的各个部分设置了样式。
* `<Text>` - `Text` 标签用于显示输入数据提供的文本。根据下面的示例输入数据，文本块显示的是 `prompt` 或某个回答（`answer1` 或 `answer2`）的信息。你可能需要调整 value 以匹配你自己的 JSON 结构。
* `<Pairwise>` - `Pairwise` 标签用于显示选择元素。它呈现供用户点击选择的选项。有关更多内容，请阅读 [Label Studio 两两对比模板](generative-pairwise-human-preference)。

## 输入数据

在本示例中，你包含了提示词以及来自不同 LLM 的两个回答。

```json
[
  {
    "data": {
      "prompt": "What is the capital of France?",
      "answer1": "Paris",
      "answer2": "London"
    }
  }
]
```

## 相关标签

- [View](/tags/view.html)
- [Style](/tags/style.html)
- [Text](/tags/text.html)
- [Pairwise](/tags/pairwise.html)
