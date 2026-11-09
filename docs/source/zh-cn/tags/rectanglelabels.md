---
title: RectangleLabels
type: tags
order: 422
meta_title: 用于在图像中标注矩形边界框的 RectangleLabels 标签
meta_description: 使用 RectangleLabels 标签自定义 Label Studio，在图像中添加带标签的矩形边界框，用于语义分割和目标检测的机器学习与数据科学项目。
---

`RectangleLabels` 标签用于创建带标签的矩形。可用于为边界框语义分割任务添加标签。

与以下数据类型配合使用：image（图像）。标注结果会存储边界框的左上角，有关其旋转方式的更多信息，请参阅 [目标检测模板](/templates/image_bbox.html#Bounding-box-rotation-in-the-Label-Studio-results)。

{% insertmd zh-cn/includes/tags/rectanglelabels.md %}

### 示例

为图像上的矩形边界框添加标签的基础标注配置

```html
<View>
  <RectangleLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </RectangleLabels>
  <Image name="image" value="$image" />
</View>
```
