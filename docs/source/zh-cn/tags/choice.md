---
title: Choice
type: tags
order: 403
meta_title: 用于单选标签的 Choice 标签
meta_description: 使用 choice 标签自定义 Label Studio，用于机器学习和数据科学项目的简单分类任务。
---

`Choice` 标签表示用于标注的单个选项。与 `Choices` 标签或 `Taxonomy` 标签配合使用，以提供具体的选项。

{% insertmd zh-cn/includes/tags/choice.md %}

### 示例

基础文本分类标注配置

```html
<View>
  <Choices name="gender" toName="txt-1" choice="single">
    <Choice value="Man" />
    <Choice value="Woman" />
    <Choice value="Nonbinary" />
    <Choice value="Other" />
  </Choices>
  <Text name="txt-1" value="John went to see Mary" />
</View>
```
