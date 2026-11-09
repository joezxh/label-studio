---
title: 问答
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 230
meta_title: 问答数据标注模板
meta_description: 用于使用 Label Studio 在任务中识别问题答案的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/question-answering.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个问答机器学习模型，请使用本模板来开发数据集。本模板提示标注人员阅读一段文本，然后高亮回答某个具体问题的文本片段。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Please read the passage" />
  <Text name="text" value="$text" granularity="word"/>
  <Header value="Select a text span answering the following question:"/>
  <Text name="question" value="$question"/>
  <Labels name="answer" toName="text">
    <Label value="Answer" maxUsage="1" background="red"/>
  </Labels>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Please read the passage" />
```

使用 [Text](/tags/text.html) 对象标签向标注人员显示一段文本：
```xml
<Text name="text" value="$text" granularity="word"/>
```
使用 `granularity` 参数确保高亮的文本片段包含完整的词。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Select a text span answering the following question:"/>
```

使用另一个 [Text](/tags/text.html) 对象标签向标注人员显示第二段文本片段，在本例中是有关该文本的问题：
```xml
<Text name="question" value="$question"/>
```
`name` 参数必须与用于第一段文本片段的 `name` 不同，`value` 用于引用 CSV 文件中的某一列或 JSON 文件中的某个键，以获取要显示的文本。你也可以使用 `value` 参数显示静态文本。

使用 [Labels](/tags/labels.html) 控制标签为标注人员提供一个 Answer（答案）标签，用于在原始文本段落中高亮问题的答案：
```xml
<Labels name="answer" toName="text">
    <Label value="Answer" maxUsage="1" background="red"/>
</Labels>
```

## 相关标签

- [Text](/tags/text.html)
- [Labels](/tags/labels.html)
