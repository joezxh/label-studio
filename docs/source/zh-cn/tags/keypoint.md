---
title: KeyPoint
type: tags
order: 409
meta_title: 用于为图像添加关键点的 KeyPoint 标签
meta_description: 使用 KeyPoint 标签自定义 Label Studio，为计算机视觉的机器学习和数据科学项目在图像中添加关键点。
---

`KeyPoint` 标签用于在不选择标签的情况下向图像添加关键点。当你只有一个标签要分配给关键点时，这会很有用。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/keypoint.md %}

### 示例

基础关键点图像标注配置

```html
<View>
  <KeyPoint name="kp-1" toName="img-1" />
  <Image name="img-1" value="$img" />
</View>
```
