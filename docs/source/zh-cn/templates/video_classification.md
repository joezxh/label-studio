---
title: 视频分类
type: templates
category: Videos
cat: videos
order: 701
meta_title: 视频分类数据标注模板
meta_description: 使用 Label Studio 进行视频分类任务的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/video-classification.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想构建一个视频分类机器学习模型（例如用于内容审核或训练场景），你需要一个经过分类的相关视频数据集。请使用本模板对视频进行分类。

你可以使用 HyperText 标签或 Video 标签来构建视频分类器。

## 交互式模板预览

<div id="main-preview"></div>

<!--当前因为两个标注配置会同时显示两个视频。待 Video 标签进入 LS 后将移除 HyperText 示例及详情-->

## 标注配置

使用 Video 标签：

```html
<View>
  <Video name="video" value="$video"/>
  <Choices name="choice" toName="video" showInline="true">
    <Choice value="Blurry" />
    <Choice value="Sharp" />
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Video](/tags/video.html) 对象标签在 Label Studio Enterprise 中显示视频片段：
```xml
<Video name="video" value="$video"/>
```

使用 [Choices](/tags/choices.html) 控制标签为标注人员提供分类选项：
```xml
<Choices name="choice" toName="video" showInline="true">
    <Choice value="Blurry" />
    <Choice value="Sharp" />
</Choices>
```

## 标注配置
使用 HyperText 标签：

```html
<View>
  <Choices name="type" toName="video" choice="single-radio">
    <Choice value="Motion"></Choice>
    <Choice value="Stable"></Choice>
  </Choices>
  <HyperText name="video" value="$html"></HyperText>
</View>
<!-- { "html": "<embed src='https://www.youtube.com/embed/mf9TKj0NuTQ'></embed>" } -->
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Choices](/tags/choices.html) 控制标签为标注人员提供单一选项，用于对视频进行分类：
```xml
<Choices name="type" toName="video" choice="single-radio">
    <Choice value="Motion"></Choice>
    <Choice value="Stable"></Choice>
</Choices>
```
  
使用 [HyperText](/tags/hypertext.html) 标签在 Label Studio 中向标注人员显示视频片段：
```xml
<HyperText name="video" value="$html"></HyperText>
```

### 输入数据

要使用带有 HyperText 标签的标注配置，请使用 HTML video 标签准备如下示例的输入数据：

```json 
[
 { "html": "<video src='examples.com/1.mp4'>" },
 { "html": "<video src='examples.com/2.mp4'>" }
]
```

你也可以嵌入网络上可用的视频：

```json 
[
  { "html": "<embed src='https://www.youtube.com/embed/mf9TKj0NuTQ'></embed>" }
]
```

在 W3 Schools 网站
<a href="https://www.w3schools.com/tags/att_video_src.asp">上阅读更多关于 HTML video 标签的内容</a>。

## 相关标签

- [Video](/tags/video.html)
- [HyperText](/tags/hypertext.html)
- [Choices](/tags/choices.html)
