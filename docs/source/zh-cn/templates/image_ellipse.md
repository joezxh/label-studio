---
title: 使用椭圆进行目标检测
type: templates
category: Computer Vision
cat: computer-vision
order: 115
meta_title: 使用椭圆进行目标检测数据标注模板
meta_description: 用于使用椭圆区域进行目标检测和分割使用场景的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/object-detection-ellipses.png" alt="" class="gif-border" width="600px" height="408px" />

如果你想使用椭圆进行目标检测或语义分割，请使用本模板。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <EllipseLabels name="tag" toName="img">
    <Label value="Blood Cell" />
    <Label value="Stem Cell" />
  </EllipseLabels>
  <Image name="img" value="$image" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [EllipseLabels](/tags/ellipselabels.html) 控制标签为你的图像添加带特定标签的椭圆。
```xml
<EllipseLabels name="tag" toName="img">
    <Label value="Blood Cell" />
    <Label value="Stem Cell" />
</EllipseLabels>
```

使用 [Image](/tags/image.html) 对象标签指定图像数据：
```xml
  <Image name="img" value="$image" />
```

## 相关标签

- [EllipseLabels](/tags/ellipselabels.html)
- [Label](/tags/label.html)
- [Image](/tags/image.html)
