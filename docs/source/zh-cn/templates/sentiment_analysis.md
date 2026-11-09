---
title: 情感分析文本分类
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 205
meta_title: 情感分析数据标注模板
meta_description: 用于使用 Label Studio 对文本情感进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/text-classification.png" alt="" class="gif-border" width="552px" height="408px" />

使用本模板对文本的情感进行分类。例如，如果你想对某个在线零售商出售的乐器评论进行情感分类。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置 

```html
<View>
  <Header value="Choose text sentiment:"/>
  <Text name="my_text" value="$reviewText"/>
  <Choices name="sentiment" toName="my_text" choice="single" showInline="true">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Choose text sentiment:"/>
```

使用 [Text](/tags/text.html) 对象标签显示待分类的文本：
```xml
<Text name="my_text" value="$reviewText"/>
```

使用 [Choices](/tags/choices.html) 控制标签为标注人员提供分类选项，允许他们只选择一个选项，并将选项显示在一行内：
```xml
<Choices name="sentiment" toName="my_text" choice="single" showInline="true">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
</Choices>
```

## 增强此模板

你可以通过多种方式增强此模板。

### 执行多分类

你可以使用样式从视觉上分隔不同的分类选项，为标注人员提供一个针对文本的多分类任务。

例如，将单个 [Choices](/tags/choices.html) 控制标签的各个选项用 [View](/tags/view.html) 标签包裹起来以调整样式：
```xml
  <Choices name="sentiment" toName="text" choice="multiple">
    <View style="display: flex; justify-content: space-between">
      <View style="width: 50%">
        <Header value="Select Topics" />
        <Choice value="Politics"/>
    	<Choice value="Business"/>
    	<Choice value="Sport"/>
      </View>
      <View>
        <Header value="Select Moods" />
        <Choice value="Cheerful"/>
    	<Choice value="Melancholy"/>
    	<Choice value="Romantic"/>
      </View>
    </View>
  </Choices>
```
为每个部分添加 [Header](/tags/header.html) 标签，可以在界面上从视觉上分隔这些选项，同时在标注中仍将所有的选项与该文本样本一起存储。

### 在三列中组合多种类型的标注

除了文本分类之外，你还可以在同一个标注任务中执行其他类型的标注。在本示例中，你可以在标注界面上创建一个三列视图，左侧列放置命名实体识别标签，中间列放置待标注的文本样本，右侧列放置分类选项。由于标注配置中的标签是按顺序渲染的，元素的排列顺序就指定了每个内容出现在哪一列。

首先为标注配置的 [View](/tags/view.html) 标签添加样式以使用 flex 布局：
```xml
<View style="display: flex;">
```

然后使用一个新 [View](/tags/view.html) 标签的样式来为命名实体识别标签创建一列：
```xml
  <View style="width: 150px; padding: 0 1em; margin-right: 0.5em; background: #f1f1f1; border-radius: 3px">    
    <Labels name="label" toName="text">
      <Label value="Person" />
      <Label value="Organization" />
    </Labels>
  </View>
```

在另一组 [View](/tags/view.html) 标签中指定 [Text](/tags/text.html) 对象标签，将其放置在中间列。
```xml
  <View>
    <Text name="text" value="$text" />
  </View>
```

然后创建一个第三列，用一个 [View](/tags/view.html) 标签来显示可用的分类 [Choices](/tags/choices.html)，并包含一个 [Header](/tags/header.html) 来为标注人员提供指导：
```xml
  <View style="padding: 0 1em; margin-left: 0.5em; background: #f1f1f1; border-radius: 3px">
    <Choices name="importance" toName="text">
      <Header value="Text Importance" />
      <Choice value="High" />
      <Choice value="Medium" />
      <Choice value="Low" />
    </Choices>
  </View>
```

别忘了关闭最外层的 [View](/tags/view.html) 标签：
```xml
</View>
```

{% insertmd zh-cn/includes/nested-classification.md %}

## 相关标签
- [Text](/tags/text.html)
- [Choices](/tags/choices.html)
- [Choice](/tags/choice.html)
- [View](/tags/view.html)
- [Header](/tags/header.html)

## 相关模板
- [命名实体识别](named_entity.html)
- [图像分类](image_classification.html)
- [槽填充与意图分类](slot_filling.html)
