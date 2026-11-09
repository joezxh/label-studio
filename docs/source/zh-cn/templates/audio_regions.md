---
title: Audio Classification with Segments
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 335
meta_title: 带分段的音频分类数据标注模板
meta_description: 使用 Label Studio 为分割任务对音频区域进行分类的模板，用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/audio-classification-segments.png" alt="" class="gif-border" width="598.4px" height="319.2px" />

如果你想对音频片段的特定分段执行音频分类任务，可以使用此模板收听音频文件并对片段的主题进行分类。

!!! error Enterprise
    如果你正在管理更复杂或大规模的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，旨在支持更大规模下更快、更精准的标注。

    查看我们全新的 [多通道音频转写](react_audio) 模板，并在 [面向规模化速度与质量的全新音频转写 UI](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置 

```html
<View>
  <Header value="Select its topic:"></Header>
  <Labels name="label" toName="audio" choice="multiple">
    <Label value="Politics" background="yellow"></Label>
    <Label value="Business" background="red"></Label>
    <Label value="Education" background="blue"></Label>
    <Label value="Other"></Label>
  </Labels>
  <Header value="Listen to the audio:"></Header>
  <Audio name="audio" value="$url"></Audio>
</View>
```

## 关于标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来向标注员提供说明：
```xml
<Header value="Select its topic:"></Header>
```

使用 [Labels](/tags/labels.html) 控制标签，让标注员能够对音频进行分段并同时对其进行分类。 
```xml
<Labels name="label" toName="audio" choice="multiple">
    <Label value="Politics" background="yellow"></Label>
    <Label value="Business" background="red"></Label>
    <Label value="Education" background="blue"></Label>
    <Label value="Other"></Label>
</Labels>
```
`choice="multiple"` 参数允许一个音频分段被标注多个主题。

使用 [Audio](/tags/audio.html) 对象标签指定要分类的音频文件位置：
```xml
<Audio name="audio" value="$url"></Audio>
```

## 相关标签

- [Audio](/tags/audio.html)
- [Labels](/tags/labels.html)
