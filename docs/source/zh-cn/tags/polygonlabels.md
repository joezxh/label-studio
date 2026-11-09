---
title: PolygonLabels
type: tags
order: 418
meta_title: 用于为图像中的多边形添加标签的 PolygonLabels 标签
meta_description: 使用 PolygonLabels 标签自定义 Label Studio，为语义分割的机器学习和数据科学项目标注图像中的多边形。
---

`PolygonLabels` 标签用于创建带标签的多边形。可用于为语义分割任务中的多边形应用标签。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/polygonlabels.md %}

### 示例

用于图像多边形语义分割的基础标注配置

```html
<View>
  <Image name="image" value="$image" />
  <PolygonLabels name="labels" toName="image">
    <Label value="Car" />
    <Label value="Sign" />
  </PolygonLabels>
</View>
```
