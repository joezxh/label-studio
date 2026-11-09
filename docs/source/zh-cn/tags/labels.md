---
title: Labels
type: tags
order: 412
meta_title: 用于标注区域的 Labels 标签
meta_description: 使用 Labels 标签自定义 Label Studio，为机器学习和数据科学项目中的任务区域提供一组标签。
---

`Labels` 标签为机器学习和数据科学项目中的任务区域提供一组标签。使用 `Labels` 标签创建一组可分配给已识别区域的标签，并指定要分配给区域的标签值。

所有类型的 Labels 都可以具有动态值，以从任务中加载标签。该任务数据应包含用于创建底层 `<Label>` 的选项列表。选项中的所有参数都会传递给相应的标签。

Labels 标签可与 audio（音频）和 text（文本）数据类型配合使用。其他数据类型有各自特定的 Labels 标签。

{% insertmd zh-cn/includes/tags/labels.md %}

### 示例

用于为一段文本应用标签的基础标注配置

```html
<View>
  <Labels name="type" toName="txt-1">
    <Label alias="B" value="Brand" />
    <Label alias="P" value="Product" />
  </Labels>
  <Text name="txt-1" value="$text" />
</View>
```
**示例** *（此配置片段使用动态标签）*  
```html
<Labels name="product" toName="shelf" value="$brands" />
<!-- {
  "data": {
    "brands": [
      { "value": "Big brand" },
      { "value": "Another brand", "background": "orange" },
      { "value": "Local brand" },
      { "value": "Green brand", "alias": "Eco", showalias: true }
    ]
  }
} -->
```
**示例** *（等同于以下配置）*  
```html
<Labels name="product" toName="shelf">
  <Label value="Big brand" />
  <Label value="Another brand" background="orange" />
  <Label value="Local brand" />
  <Label value="Green brand" alias="Eco" showAlias="true" />
</Labels>
```
