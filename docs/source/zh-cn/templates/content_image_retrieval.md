---
title: 基于内容的图像检索
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 425
meta_title: 基于内容的图像检索数据标注模板
meta_description: 用于为基于内容的图像检索任务标注数据的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/content-based-image-search.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个用于基于内容的图像检索计算机视觉任务的机器学习模型，请使用本模板。此标注配置会显示一张图像，并提示标注人员选择与一张或多张相似图像相对应的选项。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Image name="query" value="$query_image" />
  <Header value="Choose similar images:" />
  <View style="display: grid; column-gap: 8px; grid-template: auto/1fr 1fr 1fr">
    <Image name="image1" value="$image1" />
    <Image name="image2" value="$image2" />
    <Image name="image3" value="$image3" />
  </View>
  <Choices name="similar" toName="query" required="true" choice="multiple">
    <Choice value="One" />
    <Choice value="Two" />
    <Choice value="Three" />
  </Choices>
  <Style>
    [dataneedsupdate]~div form {display: flex}
    [dataneedsupdate]~div form>* {flex-grow:1;margin-left:8px}
  </Style>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签指定用于查询的图像位置：
```xml
<Image name="query" value="$query_image" />
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Choose similar images:" />
```

使用 [View](/tags/view.html) 标签中的样式将多个 [Image](/tags/image.html) 对象标签包裹起来，以网格形式显示多张图像：
```xml
  <View style="display: grid; column-gap: 8px; grid-template: auto/1fr 1fr 1fr">
    <Image name="image1" value="$image1" />
    <Image name="image2" value="$image2" />
    <Image name="image3" value="$image3" />
  </View>
```
  
使用 [Choices](/tags/choices.html) 控制标签显示适用于原始图像的选项，要求必须作答，并允许标注人员选择多个选项：
```xml
<Choices name="similar" toName="query" required="true" choice="multiple">
    <Choice value="One" />
    <Choice value="Two" />
    <Choice value="Three" />
</Choices>
```

使用 [Style](/tags/style.html) 标签对标注界面上使用的 div form 类应用额外的 CSS 样式，以进一步增强网格效果：
```xml
<Style>
    [dataneedsupdate]~div form {display: flex}
    [dataneedsupdate]~div form>* {flex-grow:1;margin-left:8px}
</Style>
```
`[dataneedsupdate]` 选项将样式与标注配置中使用的对象标签关联起来。
  

## 相关标签

- [Image](/tags/image.html)
- [Header](/tags/header.html)
- [View](/tags/view.html)
- [Choices](/tags/choices.html)
- [Style](/tags/style.html)
