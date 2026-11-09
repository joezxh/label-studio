---
title: Ellipse
type: tags
order: 406
meta_title: 用于为图像添加椭圆边界框的 Ellipse 标签
meta_description: 使用 ellipse 标签自定义 Label Studio，为机器学习和数据科学项目在图像中添加椭圆边界框。
---

`Ellipse` 标签用于在图像上添加椭圆边界框。适用于使用椭圆的边界框图像分割任务。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/ellipse.md %}

### 示例

使用椭圆的基础图像分割标注配置

```html
<View>
  <Ellipse name="ellipse1-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
