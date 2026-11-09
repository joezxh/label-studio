---
title: TimelineLabels
type: tags
order: 429
meta_title: TimelineLabels 标签
meta_description: 使用 TimelineLabels 对视频帧进行分类。
---

使用 TimelineLabels 标签对视频帧进行分类。可以是单帧，也可以是一段连续的帧。

首先选择一个标签，然后单击一次以标注单帧。单击并拖动以标注多帧。

![Screenshot of video with frame classification](../images/timelinelabels.png)

与 `<Video>` 控制标签配合使用。

!!! info Tip
    你可以使用 `<Video>` 标签上的 `timelineHeight` 参数增加时间轴的高度。

{% insertmd zh-cn/includes/tags/timelinelabels.md %}

### 示例
```html
<View>
  <Header>Label timeline spans:</Header>
  <Video name="video" value="$video" />
  <TimelineLabels name="timelineLabels" toName="video">
    <Label value="Nothing" background="#944BFF"/>
    <Label value="Movement" background="#98C84E"/>
  </TimelineLabels>
</View>
```
