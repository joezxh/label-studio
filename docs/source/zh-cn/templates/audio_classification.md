---
title: Audio Classification
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 330
meta_title: 音频分类数据标注模板
meta_description: 使用 Label Studio 对音频和意图进行分类的模板，用于你的数据科学和机器学习项目。
---

<img src="/images/templates-misc/audio-classification.png" alt="" class="gif-border" width="482px" height="282px" />

如果你想执行音频分类任务，例如意图或情感分类，可以使用此模板收听音频文件并对片段的主题进行分类。

!!! error Enterprise
    如果你正在管理更复杂或大规模的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，旨在支持更大规模下更快、更精准的标注。

    查看我们全新的 [多通道音频转写](react_audio) 模板，并在 [面向规模化速度与质量的全新音频转写 UI](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Listen to the audio:"></Header>
  <Audio name="audio" value="$url"></Audio>
  <Header value="Select its topic:"></Header>
  <Choices name="label" toName="audio" choice="single-radio" showInline="true">
    <Choice value="Politics"></Choice>
    <Choice value="Business"></Choice>
    <Choice value="Education"></Choice>
    <Choice value="Other"></Choice>
  </Choices>
</View>
```

## 关于标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来向标注员提供说明：
```xml
<Header value="Listen to the audio:"></Header>
```

使用 [Audio](/tags/audio.html) 对象标签指定音频片段的类型和位置。在本例中，音频片段存储在数据中名为 `url` 的键下：
```xml
<Audio name="audio" value="$url"></Audio>
```

使用 [Choices](/tags/choices.html) 控制标签，通过 `showInline="true"` 管理分类选项在界面上的呈现方式，并通过 `choice="single-radio"` 管理界面上使用的选择选项。`toName="audio"` 选项将选项与音频片段关联起来。 
```xml
<Choices name="label" toName="audio" choice="single-radio" showInline="true">
```
你必须将 Choices 标签与 [Choice](/tags/choice.html) 配合使用，以指定用于音频分类的可用选项，然后关闭 Choices 标签：
```xml
    <Choice value="Politics"></Choice>
    <Choice value="Business"></Choice>
    <Choice value="Education"></Choice>
    <Choice value="Other"></Choice>
</Choices>
```

## 增强此模板

此模板可以通过多种方式增强。

### 更改选项的外观

如果你想让分类区域在视觉上与标注界面其余部分区分开，可以向 [View](/tags/view.html) 标签添加样式。将 [Choices](/tags/choices.html) 和 [Header](/tags/header.html) 包裹在它们各自的 View 标签中：
```xml
<View style="box-shadow: 2px 2px 5px #999;
             padding: 20px; margin-top: 2em;
             border-radius: 5px;">
  <Header value="Select the topic of the audio clip"/>
  <Choices name="label" toName="audio" choice="single-radio" showInline="true">
    <Choice value="Politics"></Choice>
    <Choice value="Business"></Choice>
    <Choice value="Education"></Choice>
    <Choice value="Other"></Choice>
  </Choices>
</View>
```

{% insertmd zh-cn/includes/nested-classification.md %}

## 相关标签

- [Audio](/tags/audio.html)
- [Choices](/tags/choices.html)

## 相关模板

- [Intent Classification](intent_classification.html)
- [Audio Classification with Segments](audio_regions.html)
