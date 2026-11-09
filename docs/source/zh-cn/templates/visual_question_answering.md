---
title: 视觉问答
type: templates
category: Computer Vision
cat: computer-vision
order: 143
meta_title: 视觉问答数据标注模板
meta_description: 使用 Label Studio 执行视觉问答数据标注任务的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/visual-question-answering.png" alt="" class="gif-border" width="552px" height="408px" />

使用这个视觉问答模板创建一个包含图像回答问题答案的数据集。针对一张图像，标注人员可以提供关于某个问题的自由文本答案，并用相关方面对问题的组成部分进行标注。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Image name="image" value="$image"/>
  <Labels name="aspect" toName="q1">
    <Label value="attribute identification" background="#F39C12"/>
    <Label value="counting" background="#E74C3C"/>
    <Label value="comparison" background="#3498DB"/>
    <Label value="multiple attention" background="#2ECC71"/>
    <Label value="logical operations" background="#8E44AD"/>
  </Labels>
  <Header value="Please answer these questions:"/>
  <View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
      <Header value="Q1:"/>
      <Text name="q1" value="$q1"/>
      <Header value="A1:"/>
      <TextArea name="answer1" toName="q1" rows="1" maxSubmissions="1"/>
  </View>
  <View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
    <Header value="Q2:"/>
    <Text name="q2" value="$q2"/>
    <Header value="A2:"/>
    <TextArea name="answer2" toName="q2" rows="1" maxSubmissions="1"/>
  </View>
  <View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
    <Header value="Q3:"/>
    <Text name="q3" value="$q3"/>
    <Header value="A3:"/>
    <TextArea name="answer3" toName="q3" rows="1" maxSubmissions="1"/>
    </View>
  <View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
    <Header value="Q4:"/>
    <Text name="q4" value="$q4"/>
    <Header value="A4:"/>
    <TextArea name="answer4" toName="q4" rows="1" maxSubmissions="1"/>
    </View>
</View>
```

## 关于此标注配置

所有标注配置元素都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签显示图像：
```xml
<Image name="image" value="$image"/>
```
该图像以 URL 形式存储在 Label Studio 的 JSON 格式文件中，键为 "image"。

使用 [Labels](/tags/labels.html) 控制标签，对关于图像的第一个问题应用特定标签，以对问题中被询问的具体部分进行分类：
```xml
  <Labels name="aspect" toName="q1">
    <Label value="attribute identification" background="#F39C12"/>
    <Label value="counting" background="#E74C3C"/>
    <Label value="comparison" background="#3498DB"/>
    <Label value="multiple attention" background="#2ECC71"/>
    <Label value="logical operations" background="#8E44AD"/>
  </Labels>
```
`toName="q1"` 参数使得这些标签只应用于第一个问题的文本。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Please answer these questions:"/>
```

为 [View](/tags/view.html) 标签添加样式以控制问题和答案块的显示外观：
```xml
<View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
```

使用 [Header](/tags/header.html) 标签为标注人员提供关于文本样本的上下文：
```xml
<Header value="Q1:"/>
```

使用 [Text](/tags/text.html) 对象标签显示问题。
```xml
<Text name="q1" value="$q1"/>
```
该文本样本以键 "q1" 存储在 Label Studio 的 JSON 格式文件中。

使用 [Header](/tags/header.html) 标签为标注人员提供关于文本样本的上下文：
```xml
<Header value="A1:"/>
```

使用 [TextArea](/tags/textarea.html) 控制标签为标注人员提供回答第 1 题的位置：
```xml
<TextArea name="answer1" toName="q1" rows="1" maxSubmissions="1"/>
```
作为此文本框提交一部分输入的文本，会以名称 "answer1" 存储在导出的 Label Studio JSON 中，并通过 `toName` 字段与第 1 题关联。该文本框只允许提交 1 次，并且在标注界面上显示时只有 1 行高。

在问答块结束时，关闭 [View](/tags/view.html) 标签：
```xml
  </View>
```

完整的一节问答提示如下所示：
```xml
  <View style="display: grid; grid-template-columns: 1fr 10fr 1fr 3fr; column-gap: 1em">
    <Header value="Q2:"/>
  <Text name="q2" value="$q2"/>
   <Header value="A2:"/>
    <TextArea name="answer2" toName="q2" rows="1" maxSubmissions="1"/>
  </View>
```


## 相关标签

- [Image](/tags/image.html)
- [Labels](/tags/labels.html)
- [Header](/tags/header.html)
- [TextArea](/tags/textarea.html)
