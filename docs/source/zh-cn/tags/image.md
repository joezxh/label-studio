---
title: Image
type: tags
order: 304
meta_title: 用于图像的 Image 标签
meta_description: 使用 Image 标签自定义 Label Studio，为计算机视觉的机器学习和数据科学项目标注图像。
---

`Image` 标签用于在页面上显示图像。适用于所有图像标注任务，在标注界面上显示图像。

与以下数据类型配合使用：images（图像）。

当你使用该标签标注图像区域时，标注会保存为相对于图像原始尺寸的百分比，范围 0-100。

{% insertmd zh-cn/includes/tags/image.md %}

### 示例

在标注界面上显示图像的标注配置

```html
<View>
  <!-- 从 JSON 的 url 字段或 CSV 的列中检索图像 url -->
  <Image name="image" value="$url" rotateControl="true" zoomControl="true"></Image>
</View>
```
### 示例

用于执行多图像分割的标注配置

```html
<View>
  <!-- 从 JSON 的 url 字段或 CSV 的列中检索图像 url -->
  <Image name="image" valueList="$images" rotateControl="true" zoomControl="true"></Image>
</View>
<!-- {
  "data": {
    "images": [
      "https://images.unsplash.com/photo-1556740734-7f3a7d7f0f9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1556740734-7f3a7d7f0f9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    ]
  }
} -->
```
