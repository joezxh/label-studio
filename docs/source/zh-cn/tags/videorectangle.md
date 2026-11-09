---
title: VideoRectangle
type: tags
order: 436
meta_title: 用于视频标注的 VideoRectangle 标签
meta_description: 使用 VideoRectangle 标签自定义 Label Studio，用于机器学习和数据科学项目的基础视频标注任务。
---

VideoRectangle 标签为视频带来目标跟踪能力。它与 `<Video/>` 和 `<Labels/>` 标签配合使用。

与以下数据类型配合使用：video（视频）

{% insertmd zh-cn/includes/tags/videorectangle.md %}

### 示例

视频目标跟踪

```html
<View>
  <Header>Label the video:</Header>
  <Video name="video" value="$video" />
  <VideoRectangle name="box" toName="video" />

  <Labels name="videoLabels" toName="video">
    <Label value="Cell" background="#944BFF"/>
    <Label value="Bacteria" background="#98C84E"/>
  </Labels>
</View>
```
