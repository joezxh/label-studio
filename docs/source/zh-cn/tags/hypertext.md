---
title: HyperText
type: tags
order: 303
meta_title: 用于超文本标记（HTML）的 HyperText 标签
meta_description: Label Studio 的 HyperText 标签为机器学习和数据科学项目的超文本标记（HTML）自定义 Label Studio。
---

`HyperText` 标签显示用于标注的超文本标记。适用于为 NER 和 NLP 项目标注 HTML 编码的文本和网页。

与以下数据类型配合使用：HTML。

{% insertmd zh-cn/includes/tags/hypertext.md %}

### 示例

用于标注 HTML 内容的标注配置

```html
<View>
  <HyperText name="text-1" value="$text" />
  <Labels name="parts" toName="text-1">
    <Label value="Caption" />
    <Label value="Article" />
    <Label value="Author" />
  </Labels>
</View>
```
### 示例
```html
<View>
  <HyperText name="p1">
    <p>Some explanations <em>with style</em></p>
  </HyperText>
</View>
```
