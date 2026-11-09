---
title: 上下文滚动
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 301
meta_title: 上下文滚动
meta_description: 在音频上下文中标注转写内容的模板。
---

<img src="/images/templates/thumbnail-conversation-sentiment.png" alt="" class="gif-border" width="482px" height="282px" />

音频与对应段落之间的播放同步，为你提供了更丰富的上下文和控制能力，从而在进行对话分析时获得高质量的标注数据集并提高生产效率。

!!! error Enterprise
    如果你要管理更复杂或高吞吐量的音频标注项目，Label Studio Enterprise 包含了一个高级音频转写界面，专为在大规模场景下更快、更精准地进行标注而构建。

    请参阅我们全新的 [多通道音频转写](react_audio) 模板，并在[为大规模音频转写构建更优 UI 以提升速度与质量](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/)（博客文章）中了解更多。

## 标注配置

```html
<View>
  <Audio name="audio" value="$url" sync="text"></Audio>
    <View>
    <Header value="Transcript"/>
    <Paragraphs audioUrl="$audio" contextScroll="true" sync="audio" name="text" value="$text" layout="dialogue" textKey="text" nameKey="author" granularity="paragraph"/>
  </View>  
    <View>
      <Header value="Sentiment Labels"/>
      <ParagraphLabels  name="label" toName="text">
        <Label value="Positive" background="#00ff00"/>
        <Label value="Negative" background="#ff0000"/>
      </ParagraphLabels>
    </View>
</View>
```


## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Listen to the audio:"></Header>
```

使用 [Audio](/tags/audio.html) 对象标签指定音频片段的类型和位置。在本例中，音频片段以 `url` 键存储。音频与 [Paragraphs](/tags/paragraphs.html) 配对，其中 `contextScroll` 设为 true，且 `sync` 设为 audio。此外，段落标签的 `name` 应具有来自音频标签的 `textKey` 值：
```xml
<Audio name="audio" value="$url" sync="text"></Audio>
<Paragraphs audioUrl="$audio" contextScroll="true" sync="audio" name="text" value="$text" layout="dialogue" textKey="text" nameKey="author" granularity="paragraph"/>
```

使用 [Paragraph Labels](/tags/paragraphlabels.html) 控制标签配合 [Label](/tags/label.html) 标签，来标注段落转写内容的各个部分。
```xml
<ParagraphLabels  name="label" toName="text">
  <Label value="Positive" background="#00ff00"/>
  <Label value="Negative" background="#ff0000"/>
</ParagraphLabels>
```
## 转写数据

转写数据应包含起始时间，以及结束时间或时长其中之一。

```json
{
    "text": [
      {
        "end": 1.5,
        "text": "Dont you hate that?",
        "start": 0,
        "author": "Mia Wallace"
      },
      {
        "text": "Hate what?",
        "start": 1.5,
        "author": "Vincent Vega:",
        "duration": 3
      },
      {
        "end": 7,
        "text": "Uncomfortable silences. Why do we feel its necessary to yak to feel comfortable?",
        "start": 4.5,
        "author": "Mia Wallace:"
      },
      {
        "end": 10,
        "text": "I dont know. That's a good question.",
        "start": 8,
        "author": "Vincent Vega:"
      },
    ],
  },
```
## 增强此模板
本模板可以通过多种方式增强。

### 添加额外的数据点

可以向本模板添加若干标签，以向标注中增加更多的数据点。这里我们添加了 [Choices](/tags/choices.html) 和 [TextArea](/tags/textarea.html) 标签，以给出说话人上下文以及对转写内容的文本回应：
```xml
<View>
  <Choices name="speakers" toName="audio" choice="multiple" showInline="true">
  <Choice value="speaker_1"/>
  <Choice value="speaker_2"/>
</Choices>
</View>
<View>
  <Header value="Provide your response:"/>  
  <TextArea name="response" toName="text"/>
</View>

```
## 相关标签

- [Audio](/tags/audio.html)
- [Paragraphs](/tags/paragraphs.html)
- [Choices](/tags/choices.html)
- [TextArea](/tags/textarea.html)

## 相关模板

- [音频分类](audio_classification.html)
- [带分段的音频分类](audio_regions.html)
