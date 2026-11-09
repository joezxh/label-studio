---
title: 语音活动检测
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 320
meta_title: 语音活动检测数据标注模板
meta_description: 使用 Label Studio 检测音频片段中语音活动的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/voice-activity-detection.png" alt="" class="gif-border" width="600px" height="498px" />

如果你想训练一个语音活动检测（VAD）模型，用于自动化呼叫中心交互、改进语音激活助手系统，或其他语音检测场景，可以使用本模板。创建音频片段中可能包含语音的段落，然后将每个段落分类为是否包含语音、是否包含用于语音激活助手场景的特定唤醒词，或者仅仅是噪声。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Listen to the audio:"></Header>
  <Audio name="audio" value="$url" zoom="true"></Audio>    
  <Header value="Highlight segments with sound louder than baseline:"></Header>
  <Labels name="label" toName="audio" choice="multiple">
    <Label value="Above Baseline Sound" background="green" alias="possible-speech"></Label>
  </Labels>
  <Header value="Select a segment and classify it:"></Header>
  <Choices name="voice" toName="audio" choice="multiple" showInline="true" perRegion="true">
    <Choice value="Wake Word" alias="wake-word"></Choice>
    <Choice value="Speech" alias="plain-speech"></Choice>
    <Choice value="Noise" alias="not-speech"></Choice>
  </Choices>
</View>
```

## 关于此标注配置
所有标注配置都必须包裹在 [`View`](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Listen to the audio:"></Header>
```

使用 [Audio](/tags/audio.html) 对象标签指定待处理音频文件的位置：
```xml
<Audio name="audio" value="$url"></Audio>
```

使用 [Labels](/tags/labels.html) 控制标签，让标注人员对音频进行分段，并识别可能存在语音的位置。
```xml
  <Labels name="label" toName="audio" choice="multiple">
    <Label value="Above Baseline Sound" background="green" alias="possible-speech"></Label>
  </Labels>
```
`choice="multiple"` 参数允许一个音频片段被标注上重叠的标签。`alias` 参数让你可以为导出标注中的标签指定一个不同于标注人员所见内容的名称。

使用 [Choices](/tags/choices.html) 控制标签，提示标注人员对每段音频中的声音类型进行分类：
```xml
  <Choices name="voice" toName="audio" choice="multiple" showInline="true" perRegion="true">
    <Choice value="Wake Word" alias="wake-word"></Choice>
    <Choice value="Speech" alias="plain-speech"></Choice>
    <Choice value="Noise" alias="not-speech"></Choice>
  </Choices>
```
`choice="multiple"` 参数允许标注人员同时为特定片段选择 "Speech" 和 "Wake Word" 作为选项。`perRegion` 参数表示每个分类都应用于一个特定的音频片段。

## 相关标签
- [Header](/tags/header.html)
- [Audio](/tags/audio.html)
- [Labels](/tags/labels.html)
- [Choices](/tags/choices.html)

## 相关模板
- [信号质量检测](signal_quality_detection.html)
- [声音事件检测](sound_event_detection.html)
- [带片段的音频分类](audio_regions.html)
