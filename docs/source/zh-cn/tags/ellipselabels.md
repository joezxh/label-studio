---
title: EllipseLabels
type: tags
order: 407
meta_title: 用于为图像添加带标签椭圆边界框的 EllipseLabels 标签
meta_description: 使用 EllipseLabels 标签自定义 Label Studio，为语义图像分割的机器学习和数据科学项目标注带椭圆边界框的图像。
---

`EllipseLabels` 标签用于创建带标签的椭圆。可用于为椭圆应用标签以进行语义分割。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/ellipselabels.md %}

### 示例

基础语义图像分割标注配置

```html
<View>
  <EllipseLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </EllipseLabels>
  <Image name="image" value="$image" />
</View>
```
