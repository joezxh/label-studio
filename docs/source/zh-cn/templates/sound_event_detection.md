---
title: 声音事件检测
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 318
meta_title: 声音事件检测数据标注模板
meta_description: 用于使用 Label Studio 检测音频片段中事件声音的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/sound-event-detection.png" alt="" class="gif-border" width="552px" height="408px" />

在你需要改进声音事件检测的情况下，使用本模板播放音频片段，并根据可听见的是哪个事件声音来标注特定的音频区域。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="label" toName="audio" zoom="true" hotkey="ctrl+enter">
    <Label value="Event A" background="red"/>
    <Label value="Event B" background="green"/>
  </Labels>
  <Audio name="audio" value="$audio"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签，用相关的事件标签高亮音频片段：
```xml
  <Labels name="label" toName="audio" zoom="true" hotkey="ctrl+enter">
    <Label value="Event A" background="red"/>
    <Label value="Event B" background="green"/>
  </Labels>
```

使用 Audio 对象标签以波形形式显示音频，对音频片段进行分段，并为标注人员提供更改音频播放速度的选项。
```xml
<Audio name="audio" value="$audio" />
```

## 相关标签

- [Labels](/tags/labels.html)
- [Audio](/tags/audio.html)
