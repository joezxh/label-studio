---
title: Rectangle
type: tags
order: 421
meta_title: 用于为图像添加矩形边界框的 Rectangle 标签
meta_description: 使用 Rectangle 标签自定义 Label Studio，为机器学习和数据科学项目在图像中添加矩形边界框。
---

`Rectangle` 标签用于在不选择标签的情况下向图像添加矩形（边界框）。当你只有一个标签要分配给矩形时，这会很有用。

与以下数据类型配合使用：image（图像）。标注结果会存储边界框的左上角，有关其旋转方式的更多信息，请参阅 [目标检测模板](/templates/image_bbox.html#Bounding-box-rotation-in-the-Label-Studio-results)。

{% insertmd zh-cn/includes/tags/rectangle.md %}

### 示例

用于为图像添加矩形边界框区域的基础标注配置

```html
<View>
  <Rectangle name="rect-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
