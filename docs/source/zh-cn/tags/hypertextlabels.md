---
title: HyperTextLabels
type: tags
order: 408
meta_title: 用于创建带标签超文本（HTML）的 HyperTextLabels 标签
meta_description: 使用 HyperTextLabels 标签自定义 Label Studio，为机器学习和数据科学项目标注超文本（HTML）。
---

`HyperTextLabels` 标签用于创建带标签的超文本（HTML）。与 HyperText 对象标签配合使用，为命名实体识别任务标注 HTML 文本或 HTML 元素。

与以下数据类型配合使用：HTML。

{% insertmd zh-cn/includes/tags/hypertextlabels.md %}

### 示例

基础语义文本标注配置

```html
<View>
  <HyperTextLabels name="labels" toName="ht">
    <Label value="Header" />
    <Label value="Body Text" />
  </HyperTextLabels>
  <HyperText name="ht" value="$html" />
</View>
```
