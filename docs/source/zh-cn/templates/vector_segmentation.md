---
title: 向量分割
type: templates
category: Computer Vision
cat: computer-vision
order: 130
meta_title: 向量分割数据标注模板
meta_description: 使用 Label Studio 通过 Vector 标签进行基于向量的图像分割任务的模板。
---

# 向量分割模板

本模板演示了如何使用 Vector 标签执行基于向量的图像分割任务。

## 标注配置

```html
<View>
    <header value="Select label and click the image to start" />
    <Image name="image" value="$image" zoom="true" />
    <VectorLabels
        name="label"
        toName="image"
        strokeWidth="3"
        pointSize="small"
        opacity="0.9"
        closable="true"
        curves="true"
    >
        <label value="Road" background="red" />
        <label value="Boundary" background="blue" />
        <label value="Path" background="green" />
    </VectorLabels>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：

```xml
<Header value="Select label and click the image to start"/>
```

使用 [Image](/tags/image.html) 对象标签指定图像数据，并允许标注人员缩放图像：

```xml
<Image name="image" value="$image" zoom="true"/>
```

使用 [VectorLabels](/tags/vectorlabels.html) 控制标签，让标注人员为特定标签创建向量。

```xml
<VectorLabels name="label" toName="image"
              strokeWidth="3" pointSize="small"
              opacity="0.9" closable="true" curves="true">
  <Label value="Road" background="red"/>
  <Label value="Boundary" background="blue"/>
  <Label value="Path" background="green"/>
</VectorLabels>
```

标注人员可以使用 `opacity` 参数控制向量的不透明度，并使用 `pointSize` 和 `strokeWidth` 参数控制向量工具的样式。使用 [Label](/tags/label.html) 控制标签的 `background` 参数来控制每个向量的颜色。

`closable="true"` 参数允许将向量闭合为多边形，而 `curves="true"` 则启用贝塞尔曲线以创建平滑的向量路径。

## 相关标签

- [Header](/tags/header.html)
- [Image](/tags/image.html)
- [VectorLabels](/tags/vectorlabels.html)
- [Label](/tags/label.html)
