---
title: 多图像分类
type: templates
category: Computer Vision
cat: computer-vision
order: 140
meta_title: 多图像分类数据标注模板
meta_description: 用于使用 Label Studio 一次性对多张图像进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/multi-image-classification.png" alt="" class="gif-border" width="552px" height="389px" />

在你需要一次性对多张图像进行分类，或者想针对多张图像提出多个问题时，可以使用本模板。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Please select everything you see on the image" />

  <View style="display: flex;">
    <View style="width: 49%; margin-right: 1.99%">
      <Image name="img-left" value="$image1"/>
      <Choices name="class-left" toName="img-left" choice="multiple">
        <Choice value="People" />
        <Choice value="Trees" />
        <Choice value="Animals" />
      </Choices>
    </View>

    <View style="width: 49%;">
      <Image name="img-right" value="$image2"/>
      <Choices name="class-right" toName="img-right" choice="multiple">
        <Choice value="Food" />
        <Choice value="Cars" />
        <Choice value="Buildings" />
      </Choices>
    </View>
  </View>

  <View>
    <Header value="Which one is clearer to you?" />
    <Choices name="comparison" toName="img-left" showInline="true">
      <Choice value="Left" />
      <Choice value="Right" />
    </Choices>
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Please select everything you see on the image" />
```

使用 [View](/tags/view.html) 标签的样式设置显示方式，使两张图像并排显示：
```xml
  <View style="display: flex;">
```
随后每张图像都包裹在各自的 [View](/tags/view.html) 标签中以控制显示：
```xml
<View style="width: 49%; margin-right: 1.99%">
```

在第一个 [View](/tags/view.html) 标签内，[Image](/tags/image.html) 对象标签指定显示在左侧的图像：
```xml
<Image name="img-left" value="$image1"/>
```
`value` 参数指定了 Label Studio JSON 任务中 `"image1"` 这个 JSON 键，导入时必须提供两张图像的 URL。

[Choices](/tags/choices.html) 控制标签显示应用于左侧图像的分类选项，由 `toName` 参数指定。`choice` 参数表示标注人员可以选择多个选项：
```xml
<Choices name="class-left" toName="img-left" choice="multiple">
    <Choice value="People" />
    <Choice value="Trees" />
    <Choice value="Animals" />
</Choices>
```

显示左侧图像和相关选项的 [View](/tags/view.html) 标签关闭后，一个新的 [View](/tags/view.html) 标签将第二张图像和选择选项样式化为显示在右侧：
```xml
<View style="width: 49%;">
```

在这个 [View](/tags/view.html) 标签内，[Image](/tags/image.html) 对象标签指定显示在右侧的图像：
```xml
<Image name="img-right" value="$image2"/>
```
`value` 参数指定了 Label Studio JSON 任务中 `"image2"` 这个 JSON 键，导入时必须提供两张图像的 URL。

[Choices](/tags/choices.html) 控制标签显示应用于右侧图像的分类选项，由 `toName` 参数指定：
```xml
<Choices name="class-right" toName="img-right" choice="multiple">
    <Choice value="Food" />
    <Choice value="Cars" />
    <Choice value="Buildings" />
</Choices>
```

关闭用于图像和选择样式的两组 [View](/tags/view.html) 标签，并使用一个新的 View 标签来分隔其余的整体分类选项。你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明，并使用 Choices 控制标签来显示关于两张图像的选项。
```xml
<View>
    <Header value="Which one is clearer to you?" />
    <Choices name="comparison" toName="img-left" showInline="true">
      <Choice value="Left" />
      <Choice value="Right" />
    </Choices>
</View>
```
Choices 标签的 `toName` 值引用 `img-left`，使得所有标注在结果中被关联在一起。

## 相关标签
- [Header](/tags/header.html)
- [View](/tags/view.html)
- [Image](/tags/image.html)
- [Choices](/tags/choices.html)

## 相关模板
- [Image Classification](image_classification.html)
