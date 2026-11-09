---
title: ParagraphLabels
type: tags
order: 416
meta_title: 用于段落标签的 ParagraphLabels 标签
meta_description: 使用段落标签自定义 Label Studio，用于机器学习和数据科学项目。
---

`ParagraphLabels` 标签用于创建带标签的段落。与 `Paragraphs` 标签配合使用，为一段文本添加标签。

与以下数据类型配合使用：paragraphs（段落）。

{% insertmd zh-cn/includes/tags/paragraphlabels.md %}

### 示例

用于标注段落的基础标注配置

```html
<View>
  <ParagraphLabels name="labels" toName="prg">
    <Label value="Statement" />
    <Label value="Question" />
  </ParagraphLabels>
  <Paragraphs name="prg" value="$dialogue" layout="dialogue" />
</View>
```
