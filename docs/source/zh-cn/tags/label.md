---
title: Label
type: tags
order: 411
meta_title: 用于单选标签的 Label 标签
meta_description: 使用 Label 标签自定义 Label Studio，为机器学习和数据科学项目的任务区域分配单个标签。
---

`Label` 标签表示一个单独的标签。与 `Labels` 标签（包括 `BrushLabels`、`EllipseLabels`、`HyperTextLabels`、`KeyPointLabels` 以及其他 `Labels` 标签）配合使用，以指定某个标签的值。

{% insertmd zh-cn/includes/tags/label.md %}

### 示例

用于文本的基础命名实体识别标注配置

```html
<View>
  <Labels name="type" toName="txt-1">
    <Label alias="B" value="Brand" />
    <Label alias="P" value="Product" />
  </Labels>
  <Text name="txt-1" value="$text" />
</View>
```
