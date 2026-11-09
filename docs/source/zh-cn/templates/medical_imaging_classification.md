---
title: 带边界框的医学图像分类
type: templates
category: Computer Vision
cat: computer-vision
order: 160
meta_title: 带边界框的医学图像分类模板
meta_description: 用于分类医学图像并使用边界框进行图像分割的模板。
---


<img src="/images/templates/medical-image-classification.png" alt="" class="gif-border" width="552px" height="408px" />

本模板界面允许标注人员：

- 使用 "Tumor"（肿瘤）标签在图像中被识别为肿瘤的区域周围绘制边界框。
- 通过选择 "Benign"（良性）、"Malignant"（恶性）或 "Normal"（正常）之一来对整张图像进行分类。

这种设置适用于需要定位肿瘤同时又提供图像整体评估的医学影像任务。

## 标注配置

```xml
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Tumor" background="green"/>
  </RectangleLabels>
  <Choices name="classification" toName="image">
    <Choice value="Benign"/>
    <Choice value="Malignant"/>
    <Choice value="Normal"/>
  </Choices>
</View>
```

## 关于此标注配置

#### 图像

```xml
<Image name="image" value="$image"/>
```

这会显示图像。`value="$image"` 表示它使用任务数据中来自 `image` 字段的图像。

!!! info Tip
    有关示例图像，你可以使用 [kaggle](https://www.kaggle.com/datasets/aryashah2k/breast-ultrasound-images-dataset?resource=download) 上提供的示例数据集。

#### 边界框

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Tumor" background="green"/>
</RectangleLabels>
```
这定义了你可以使用的图像分割方式。在本模板中，你绘制的是矩形（边界框）。

- `RectangleLabels` 标签创建了一个绘制边界框的工具，`toName="image"` 表示这些框将与名为 `image` 的标签相关联（在本示例中，即 `<Image>` 标签所分配的名称）。
- `Label` 标签指定边界框代表 "Tumor"（肿瘤）区域，以绿色背景显示。

有关使用边界框的更多信息，请参阅 [使用边界框进行目标检测](image_bbox)。

#### 分类

```xml
<Choices name="classification" toName="image">
  <Choice value="Benign"/>
  <Choice value="Malignant"/>
  <Choice value="Normal"/>
</Choices>
```

这添加了图像级别的分类选项。

- `<Choices>` 标签提供一组供标注人员选择的选项。
- `toName="image"` 将这些选项应用到整张图像。
- 标注人员可以将图像分类为 "Benign"（良性）、"Malignant"（恶性）或 "Normal"（正常）。

你可以通过编辑、新增或删除来更改这些分类选项。如果你的需求更复杂，也可以使用[嵌套选项](image_classification#Enhance-classification-templates-with-nested-choices)。

## 相关标签

- [Image](/tags/image.html)
- [RectangleLabels](/tags/rectanglelabels.html)
- [Choices](/tags/choices.html)
