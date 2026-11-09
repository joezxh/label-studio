---
title: Polygon
type: tags
order: 417
meta_title: 用于为图像添加多边形的 Polygon 标签
meta_description: 使用 Polygon 标签自定义 Label Studio，为分割的机器学习和数据科学项目在图像中添加多边形。
---

`Polygon` 标签用于在不选择标签的情况下向图像添加多边形。当你只有一个标签要分配给多边形时，这会很有用。适用于图像分割任务。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/polygon.md %}

### 示例

用于多边形图像分割的基础标注配置

```html
<View>
  <Polygon name="rect-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
