---
title: 两两回归
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 415
meta_title: 两两回归数据标注模板
meta_description: 用于使用 Label Studio 为回归模型执行两两比较任务的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/pairwise-regression.png" alt="" class="gif-border" width="552px" height="408px" />

如果你需要一个数据集来训练两两回归模型，请使用本模板根据两幅图像的相似程度对它们进行评分。你也可以自定义本模板，以对不同类型数据的不同属性进行评分，例如评价两段电影评论文本片段的情感是否相似。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header>Set how likely these images represent the same thing:</Header>
  <View style="display: grid; column-gap: 8px; grid-template: auto/1fr 1fr">
  	<Image name="image1" value="$image1" />
    <Image name="image2" value="$image2" />
  </View>
  <View style="margin-left: auto; margin-right: auto; width: 16em">
    <Rating name="rating" toName="image1,image2"/>
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header>Set how likely these images represent the same thing:</Header>
```

为包裹 Image 标签的 [View](/tags/view.html) 标签添加样式，以控制图像数据的显示方式：
```xml
<View style="display: grid; column-gap: 8px; grid-template: auto/1fr 1fr">
```
此样式将所包含的项显示为一个网格，列之间留有 8 像素的间隙。

使用 [Image](/tags/image.html) 对象标签在标注界面上指定两幅图像：
```xml
<Image name="image1" value="$image1" />
<Image name="image2" value="$image2" />
```
在 Image 标签之后关闭 [View](/tags/view.html) 标签。

添加一个新的、带样式的 [View](/tags/view.html) 标签，以控制评分选项在标注界面上的显示方式：
```xml
<View style="margin-left: auto; margin-right: auto; width: 16em">
```

使用 [Rating](/tags/rating.html) 控制标签显示可应用于两幅图像的星级评分：
```xml
<Rating name="rating" toName="image1,image2"/>
```
在 Rating 标签之后关闭 [View](/tags/view.html) 标签。

## 相关标签

- [Header](/tags/header.html)
- [View](/tags/view.html)
- [Image](/tags/image.html)
- [Rating](/tags/rating.html)
