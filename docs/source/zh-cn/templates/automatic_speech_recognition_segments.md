---
title: Automatic Speech Recognition using Segments
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 310
meta_title: 使用分段的自动语音识别数据标注模板
meta_description: 使用 Label Studio 为自动语音识别分段用例进行音频转写的模板，用于你的机器学习和数据科学项目。
---

<img src="/images/templates/automatic-speech-recognition-using-segments.png" alt="" class="gif-border" width="552px" height="408px" />

收听音频文件并对其进行分段，然后用自然语言转写每个分段的内容，使用分段执行语音识别。

!!! error Enterprise
    如果你正在管理更复杂或大规模的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，旨在支持更大规模下更快、更精准的标注。

    查看我们全新的 [多通道音频转写](react_audio) 模板，并在 [面向规模化速度与质量的全新音频转写 UI](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="labels" toName="audio">
    <Label value="Speech" />
    <Label value="Noise" />
  </Labels>
  <Audio name="audio" value="$audio"/>
  <TextArea name="transcription" toName="audio"
            rows="2" editable="true"
            perRegion="true" required="true" />
</View>
```

## 关于标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签，让标注员能够高亮表示不同类型噪声的音频部分：
```xml
<Labels name="labels" toName="audio">
    <Label value="Speech" />
    <Label value="Noise" />
</Labels>
```

使用 [Audio](/tags/audio.html) 对象标签显示可标注的音频波形：
```xml
<Audio name="audio" value="$audio"/>
```

使用 [TextArea](/tags/textarea.html) 控制标签，提示标注员为每个音频分段提供转写文本：
```xml
  <TextArea name="transcription" toName="audio"
            rows="2" editable="true"
            perRegion="true" required="true" />
```
`editable="true"` 参数指定转写文本可以编辑，`required="true"` 将转写文本设置为标注员的必填字段。如果音频片段的每个分段都没有提供转写文本（由 `perRegion="true"` 参数设定），则无法提交标注。

## 增强此模板

### 为特定音频分段添加上下文

如果你想提示标注员为特定音频分段添加上下文（例如通过选择给定音频片段中说话人的口音或假定性别），可以向你的标注配置中添加以下内容：
```xml
    <View visibleWhen="region-selected">
      <Header value="Select the assumed gender of the speaker:" />
      <Choices name="gender" toName="audio"
               perRegion="true" required="true">
        <Choice value="Man" />
        <Choice value="Woman" />
      </Choices>
    </View>
```
[View](/tags/view.html) 标签的 `visibleWhen` 参数意味着该选项仅在选中特定音频分段时才可见。[Header](/tags/header.html) 标签向标注员提供说明。[Choices](/tags/choices.html) 标签包含 `perRegion` 参数，以将所选选项仅应用于选中的音频分段。 


## 相关标签

- [Audio](/tags/audio.html)
- [Labels](/tags/labels.html)
- [TextArea](/tags/textarea.html)
