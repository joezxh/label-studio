---
title: Choices
type: tags
order: 404
meta_title: 用于多选标签的 Choices 标签
meta_description: 使用多选标签自定义 Label Studio，用于机器学习和数据科学项目。
---

`Choices` 标签用于创建一组选项，以单选按钮或复选框形式呈现。它可用于单类或多类分类，也用于标注员可以选择一个或多个答案的高级分类任务。

Choices 可以具有动态值，以从任务中加载标签。该任务数据应包含用于创建底层 `<Choice>` 的选项列表。选项中的所有参数都会传递给相应的标签。

`Choices` 标签可与任意数据类型配合使用。

{% insertmd zh-cn/includes/tags/choices.md %}

### 示例

基础文本分类标注配置

```html
<View>
  <Choices name="gender" toName="txt-1" choice="single-radio">
    <Choice alias="M" value="Male" />
    <Choice alias="F" value="Female" />
    <Choice alias="NB" value="Nonbinary" />
    <Choice alias="X" value="Other" />
  </Choices>
  <Text name="txt-1" value="John went to see Mary" />
</View>
```
**示例** *（此配置使用动态标签）*  

`Choice` 可以从任务数据动态加载。它应是一个包含属性的对象数组。
  `html` 可用于显示富内容，其优先级高于 `value`，但在导出的结果中仍会使用 `value`。

```html
<View>
  <Audio name="audio" value="$audio" />
  <Choices name="transcription" toName="audio" value="$variants" />
</View>
<!-- {
  "data": {
    "variants": [
      { "value": "Do or doughnut. There is no try.", "html": "<img src='https://labelstud.io/images/logo.png'>" },
      { "value": "Do or do not. There is no trial.", "html": "<h1>You can use hypertext here</h2>" },
      { "value": "Do or do not. There is no try." },
      { "value": "Duo do not. There is no try." }
    ]
  }
} -->
```
**示例** *（等同于以下配置）*  
```html
<View>
  <Audio name="audio" value="$audio" />
  <Choices name="transcription" toName="audio" value="$variants">
    <Choice value="Do or doughnut. There is no try." />
    <Choice value="Do or do not. There is no trial." />
    <Choice value="Do or do not. There is no try." />
    <Choice value="Duo do not. There is no try." />
  </Choices>
</View>
```
