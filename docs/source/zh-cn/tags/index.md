---
title: Introduction
type: tags
order: 201
meta_title: 自定义 Label Studio 用户界面
meta_description: 在机器学习和数据科学项目中，使用类 XML 标签为数据标注任务自定义 Label Studio 标注界面。
---

你可以使用类 XML 标签在 Label Studio 中配置标注界面。Label Studio 使用三种不同类型的标签来管理标注：

- **Object（对象）** 标签用于数据类型，用于显示在任务中可标注的元素，例如 [audio](/tags/audio.html)、[HTML](/tags/hypertext.html)、[images](/tags/image.html)、[paragraphs](/tags/paragraphs.html)、[text](/tags/text.html) 等。
- **Control（控件）** 标签可用于标注对象。例如，使用 [labels](/tags/labels.html) 进行语义和命名实体任务，使用 [choices](/tags/choices.html) 进行分类任务，使用 [textarea](/tags/textarea.html) 进行转写任务，等等。
- **Visual（视觉）** 标签用于修改标注界面的视觉外观，例如控制特定标注选项的 [view](/tags/view.html)，或添加 [header](/tags/header.html)。

## 创建自定义标注配置

当你 [设置标注界面](/guide/setup.html) 时，可以选择使用标签来创建自定义标注界面。创建自定义标注界面时，你必须关注任务数据的结构，并相应地进行配置。

<div class="opensource-only">

!!! error enterprise
    Label Studio Enterprise 提供将插件作为标注界面一部分的选项。插件允许你使用 JavaScript 扩展界面并自定义标注员工作流。更多信息，请参阅 [插件](https://docs.humansignal.com/guide/plugins)。

</div>

<div class="enterprise-only">

!!! info Tip
    你也可以将插件作为标注界面的一部分来实现。插件允许你使用 JavaScript 扩展界面并自定义标注员工作流。更多信息，请参阅 [插件](/guide/plugins)。

</div>

### 连接元素

所有控件和对象标签都需要 **name** 参数。每个控件标签还需要一个 **toName** 参数，其值需与配置中对象标签的 **name** 参数相匹配。

例如，如果你希望为命名实体识别任务的文本添加标签，可以使用以下标注配置：

```xml
<View>
  <Labels name="lbl" toName="txt">
    <Label value="Label 1"></Label>
    <Label value="Label 2"></Label>
  </Labels>
  <Text name="txt" value="$value"></Text>
</View>
```

在此示例中，Label 标签与 Text 标签配合使用来标注文本。你可以在同一配置中组合多个控件和对象标签，并使用名称将它们连接起来。

### 变量

所有对象标签以及部分控件和视觉标签都支持在其参数中使用变量。你可以使用变量一次性设置标注配置，并通过特定任务中的数据来管理标注界面上显示的内容。

要使用变量，请在标签的 `value` 参数中使用它，并通过 `$` 符号和你要引用的字段名称来指定。例如，对于包含以下部分 JSON 的示例任务：

```json
{
  "header": "This is a different header for each task",
  "textlabel": "This is the text that needs to be labeled"
}
```

使用以下标注配置来引用数据字段：

```xml
<View>
  <Header value="$header"></Header>
  <Text name="text" value="$textlabel"></Text>
  <Choices name="sentiment" toName="text" choice="single" showInLine="true">
   <Choice value="Positive"/>
   <Choice value="Negative"/>
   <Choice value="Neutral"/>
  </Choices>
</View>
```

然后你的标注界面如下所示：

<br/>
<img src="/images/tag-header-example.png" alt="Screenshot of the labeling interface showing header of "This is a different header for each task" and text to be labeled of "This is the text that needs to be labeled" followed by a row of 3 checkboxes with Positive, Negative, and Neutral options." class="gif-border" width="748px" height="284px" />

### 样式

你可以使用 [Style](/tags/style.html) 标签设置标注界面的样式，也可以向 [View](/tags/view.html) 标签添加样式。

例如，你可以为 `View` 标签设置样式，以创建包含多个控件和对象标签的双栏标注界面，如下面的标注配置所示：

```xml
<View style="display: flex;">
  <View style="flex: 50%">
    <Header value="Choose:"></Header>
    <Text name="txt-1" value="$value"></Text>
    <Choices name="chc" toName="txt-1">
      <Choice value="Choice 1"></Choice>
      <Choice value="Choice 2"></Choice>
    </Choices>
  </View>
  <View style="flex: 50%; margin-left: 1em">
    <Header value="Enter your question and rate text:"></Header>
    <Text name="txt-2" value="$value"></Text>
    <Rating name="rating" toName="txt-2"></Rating>
    <TextArea name="question"></TextArea>
  </View>
</View>
```
