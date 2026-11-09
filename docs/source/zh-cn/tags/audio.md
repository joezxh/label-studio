---
title: Audio
type: tags
order: 301
meta_title: 用于音频标注的 Audio 标签
meta_description: 使用 Audio 标签自定义 Label Studio，以应对机器学习和数据科学项目中的高级音频标注任务。
---

Audio 标签用于播放音频并显示其波形。适用于需要标注音频区域、查看波形以及在标注过程中操作音频的音频标注任务。

!!! error Enterprise
    如果你正在管理更复杂或大规模的音频标注项目，Label Studio Enterprise 包含一个高级音频转写界面，旨在支持更大规模下更快、更精准的标注。

    查看我们全新的 [多通道音频转写](/templates/react_audio) 模板，并在 [博客 - 面向规模化速度与质量的全新音频转写 UI](https://humansignal.com/blog/building-a-better-ui-for-audio-transcription-at-scale/) 中了解更多。

与以下数据类型配合使用：audio（音频）

{% insertmd zh-cn/includes/tags/audio.md %}

### 示例

在标注界面上播放音频

```html
<View>
  <Audio name="audio" value="$audio" />
</View>
```
### 示例

播放支持多声道的音频

```html
<View>
  <Audio name="audio" value="$audio" splitchannels="true" />
</View>
```
### 示例

音频分类

```html
<View>
  <Audio name="audio" value="$audio" />
  <Choices name="ch" toName="audio">
    <Choice value="Positive" />
    <Choice value="Negative" />
  </Choices>
</View>
```
### 示例

音频转写

```html
<View>
  <Audio name="audio" value="$audio" />
  <TextArea name="ta" toName="audio" />
</View>
```
### 示例

用于标注音频区域并对音频样本进行评分的标注配置

```html
<View>
  <Labels name="lbl-1" toName="audio-1">
    <Label value="Guitar" />
    <Label value="Drums" />
  </Labels>
  <Rating name="rate-1" toName="audio-1" />
  <Audio name="audio-1" value="$audio" />
</View>
```
### 示例

与视频同步

```html
<View>
  <Video name="video-1" value="$video" sync="audio-1" />
  <Labels name="lbl-1" toName="audio-1">
    <Label value="Guitar" />
    <Label value="Drums" />
  </Labels>
  <Audio name="audio-1" value="$video" sync="video-1" />
</View>
```
### 示例

与段落同步

```html
<View>
  <Labels name="lbl-1" toName="audio-1">
    <Label value="Guitar" />
    <Label value="Drums" />
  </Labels>
  <Audio name="audio-1" value="$audio" sync="txt-1" />
  <Paragraphs audioUrl="$audio" sync="audio-1" name="txt-1" value="$text" layout="dialogue" showplayer="true" />
</View>
```
