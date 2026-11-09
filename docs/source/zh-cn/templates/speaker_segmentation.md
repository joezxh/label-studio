---
title: 说话人分离
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 325
meta_title: 说话人分离（分段）数据标注模板
meta_description: 用于使用 Label Studio 基于说话人对音频片段进行分段的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/speaker-segmentation.png" alt="" class="gif-border" width="552px" height="408px" />

在准备音频转写或训练一个用于区分不同说话人的机器学习模型时，使用本模板执行说话人分段，并用不同的说话人为音频片段的不同区域打标签。

!!! error Enterprise
    如果你正在管理更复杂或高吞吐量的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，专为在大规模场景下更快、更精准地进行标注而构建。

    请参阅我们全新的 [多通道音频转写](react_audio) 模板，并在 [为大规模音频转写构建更优 UI 以提升速度与质量](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="label" toName="audio" zoom="true" hotkey="ctrl+enter">
    <Label value="Speaker one" background="#00FF00"/>
    <Label value="Speaker two" background="#12ad59"/>
  </Labels>
  <Audio name="audio" value="$audio" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签，让标注人员高亮音频片段的特定区域并应用标签：
```xml
<Labels name="label" toName="audio" zoom="true" hotkey="ctrl+enter">
    <Label value="Speaker one" background="#00FF00"/>
    <Label value="Speaker two" background="#12ad59"/>
</Labels>
```

使用 [Audio](/tags/audio.html) 对象标签显示音频波形，并允许标注人员更改音频播放速度：
```xml
<Audio name="audio" value="$audio" />
```

## 相关标签

- [Labels](/tags/labels.html)
- [Audio](/tags/audio.html)
