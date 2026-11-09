---
title: 视频时间轴分割
type: templates
category: Videos
cat: videos
order: 710
meta_title: 视频时间轴分割数据标注模板
meta_description: 使用 Label Studio 在时间轴上对视频进行分割的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/video-timeline-segmentation.png" alt="" class="gif-border" width="552px" height="408px" />

为了更容易识别视频时间轴，请使用视频时间轴分割，在视频的音频通道旁标注片段。如果你想在时间轴上标注视频的音频片段，请使用本模板。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Video timeline segmentation via Audio sync trick"/>
  <Video name="video" value="$video_url" sync="audio"/>
  <Labels name="tricks" toName="audio" choice="multiple">
    <Label value="Kickflip" background="#1BB500"/>
    <Label value="360 Flip" background="#FFA91D"/>
    <Label value="Trick" background="#358EF3"/>
  </Labels>
  <Audio name="audio" value="$video_url" sync="video" speed="false"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Video timeline segmentation via Audio sync trick"/>
```

使用 Video 对象标签提供视频片段并将其与音频片段同步：
```xml
<Video name="video" value="$video_url" sync="audio"/>
```

使用 Labels 控制标签用特定动作高亮视频片段：
```xml
<Labels name="tricks" toName="audio" choice="multiple">
    <Label value="Kickflip" background="#1BB500"/>
    <Label value="360 Flip" background="#FFA91D"/>
    <Label value="Trick" background="#358EF3"/>
</Labels>
```

使用 Audio 对象标签与视频一起播放视频片段的音频：
```xml
<Audio name="audio" value="$video_url" sync="video" speed="false"/>
```

## 相关标签

- [Header](/tags/header.html)
- [Video](/tags/video.html)
- [Labels](/tags/labels.html)
- [Audio](/tags/audio.html)
