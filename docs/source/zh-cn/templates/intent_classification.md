---
title: 意图分类
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 340
meta_title: 意图分类数据标注模板
meta_description: 用于使用 Label Studio 对音频数据的意图进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/intent-classification.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想识别一段录音（例如采访或客服电话）的意图，请使用本模板，通过选择选项并收听音频片段来对意图进行分类。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="labels" toName="audio">
    <Label value="Segment" />
  </Labels>
  <Audio name="audio" value="$audio"/>
  <Choices name="intent" toName="audio" perRegion="true" required="true">
    <Choice value="Question" />
    <Choice value="Request" />
    <Choice value="Satisfied" />
    <Choice value="Interested" />
    <Choice value="Unsatisfied" />
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签来标注音频片段的特定部分：

```xml
<Labels name="labels" toName="audio">
    <Label value="Segment" />
</Labels>
```

使用 [Audio](/tags/audio.html) 对象标签指定音频数据，并显示可供分段的音频波形：
```xml
<Audio name="audio" value="$audio"/>
```

使用 [Choices](/tags/choices.html) 控制标签对音频片段的每个分段区域进行意图分类：
```xml
  <Choices name="intent" toName="audio" perRegion="true" required="true">
    <Choice value="Question" />
    <Choice value="Request" />
    <Choice value="Satisfied" />
    <Choice value="Interested" />
    <Choice value="Unsatisfied" />
  </Choices>
```
由于 `perRegion="true"` 参数，每个选择都应用于被标注为不同分段的区域。`required="true"` 参数确保在提交标注前，每个已标注的音频分段都必须选择一个选项。

{% insertmd zh-cn/includes/nested-classification.md %}

## 相关标签

- [Labels](/tags/labels.html)
- [Audio](/tags/audio.html)
- [Choices](/tags/choices.html)
