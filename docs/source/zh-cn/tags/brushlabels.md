---
title: BrushLabels
type: tags
order: 401
meta_title: 用于图像分割标注的 BrushLabels 标签
meta_description: 使用 brush label 标签自定义 Label Studio，用于机器学习和数据科学项目的图像分割标注。
---

用于图像分割任务的 `BrushLabels` 标签适用于需要应用遮罩或使用笔刷在图像上绘制区域的场景。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/brushlabels.md %}

### 示例

基础图像分割标注配置

```html
<View>
  <BrushLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </BrushLabels>
  <Image name="image" value="$image" />
</View>
```
