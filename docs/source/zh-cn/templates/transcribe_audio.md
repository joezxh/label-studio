---
title: 自动语音识别
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 305
meta_title: 音频转写数据标注模板
meta_description: 使用 Label Studio 为自动语音识别场景进行音频转写的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/automatic-speech-recognition.png" alt="" class="gif-border" width="552px" height="408px" />

收听音频文件并用自然语言转写其内容，执行语音识别。

!!! error Enterprise
    如果你正在管理更复杂或高吞吐量的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，专为在大规模场景下更快、更精准地进行标注而构建。

    请参阅我们全新的 [多通道音频转写](react_audio) 模板，并在 [为大规模音频转写构建更优 UI 以提升速度与质量](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Audio name="audio" value="$audio" zoom="true" hotkey="ctrl+enter" />
  <Header value="Provide Transcription" />
  <TextArea name="transcription" toName="audio" rows="4" editable="true" maxSubmissions="1" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [`View`](/tags/view.html) 标签中。

使用 [Audio](/tags/audio.html) 对象标签的 `hotkey` 参数，让标注人员使用特定热键在标注界面上播放音频，并使用 `zoom="true"` 参数让标注人员放大音频波形：
```xml
<Audio name="audio" value="$audio" zoom="true" hotkey="ctrl+enter" />
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Provide Transcription" />
```

使用 [TextArea](/tags/textarea.html) 控制标签提示标注人员为音频添加转写文本：
```xml
<TextArea name="transcription" toName="audio" rows="4" editable="true" maxSubmissions="1" />
```
`rows="4"` 参数用于配置标注界面上文本框的可见大小。`maxSubmissions="1"` 参数将标注人员为该音频片段提交的转写数量限制为一条，而 `editable="true"` 参数允许标注人员编辑转写文本。


## 相关标签

- [Audio](/tags/audio.html)
- [Labels](/tags/labels.html)
- [TextArea](/tags/textarea.html)
