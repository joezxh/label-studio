---
title: KeyPointLabels
type: tags
order: 410
meta_title: 用于标注关键点的 KeyPointLabels 标签
meta_description: 使用 KeyPointLabels 标签自定义 Label Studio，为计算机视觉的机器学习和数据科学项目标注关键点。
---

`KeyPointLabels` 标签用于创建带标签的关键点。可用于为已识别的关键点应用标签，例如为人脸识别标注项目识别面部特征。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/keypointlabels.md %}

### 示例

用于多个区域的基础关键点图像标注配置

```html
<View>
  <KeyPointLabels name="kp-1" toName="img-1">
    <Label value="Face" />
    <Label value="Nose" />
  </KeyPointLabels>
  <Image name="img-1" value="$img" />
</View>
```
