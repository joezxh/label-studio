---
title: VideoVector
short: VideoVector
type: tags
order: 437
meta_title: 用于视频向量标注的 VideoVector 标签
meta_description: 使用 VideoVector 标签自定义 Label Studio，用于视频帧上的向量标注。
---

`VideoVector` 标签为视频带来向量标注能力。它与 `<Video/>` 和 `<Labels/>` 标签配合使用，并支持闭合路径和骨架模式，以及跨视频帧的基于关键帧的插值。

与以下数据类型配合使用：video（视频）。

!!! note 可用性
    `VideoVector` 和 `VideoVectorLabels` 标签目前仅在 Label Studio Enterprise（包括自托管）和 Starter Cloud 中提供。

<iframe class="video-border" width="100%" height="400vh" src="https://www.youtube.com/embed/NR0CkXODEbk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 与 SAM2 配合用于视频分割

`VideoVector` 与 [Segment Anything Model 2 (SAM2)](/guide/ml_tutorials/segment_anything_2_video.html) 配合时尤其强大。你无需在每一帧上手动绘制和调整向量，只需在关键帧上放置一个向量，让 SAM2 跨视频跟踪并传播该对象，从而只需修正模型发生偏移的那些帧。对于目标跟踪和视频分割工作流，这种组合才是这些标签真正发挥价值的地方。

有关逐步设置，请参阅 [SAM2 with Videos ML backend 教程](/guide/ml_tutorials/segment_anything_2_video.html)。一篇专门讲解 `VideoVector` + SAM2 的博客文章即将发布。

## 关键帧的工作原理

你在单帧上标注一个向量，Label Studio 会将该帧存储为关键帧。当你在后续帧上移动点、添加点或闭合路径时，会创建一个新的关键帧。Label Studio 会对每个顶点位置（包括贝塞尔控制点）在关键帧之间进行线性插值，因此向量会随视频播放跟随你的对象。

## 路径与点基础

| Action | Instruction |
|------------------------------|-------------|
| **添加点** | 点击空白处。 |
| **向路径段添加点** | 在两点之间的段上按住 <code>Shift</code> 并点击。 |
| **结束或退出路径** | 按 <code>Esc</code> 或双击你添加到路径的最后一个点。 |
| **移动点** | 直接点击某个点并拖动以重新定位。 |
| **删除点** | 按 <code>Alt</code> 或 <code>Option</code> 并点击已有的点。 |

## 高级

### 闭合路径

你可以创建闭合路径以构成多边形形状。要创建闭合路径，请在你的标注配置中使用 `closable="true"` 参数。

| Action | Instruction |
|-------------------------|-----------------------------------------------------------------------------|
| **闭合路径** | 双击你的最后一个点。这会自动在你的第一个点和最后一个点之间添加一段。 |
| **断开闭合路径** | 按 `Alt` 或 `Option` 并点击闭合路径中的某个向量段以重新打开它。点击某个点可删除该点。 |

### 骨架

你可以在标注配置中使用 `skeleton="true"` 参数创建骨架向量。

启用后，新点会连接到活动点，而不是最后添加的点。

## 参数

{% insertmd zh-cn/includes/tags/videovector.md %}

### 示例

视频向量标注

```html
<View>
  <Header>Label the video:</Header>
  <Video name="video" value="$video" />
  <VideoVector name="vector" toName="video" />

  <Labels name="videoLabels" toName="video">
    <Label value="Road" background="#944BFF"/>
    <Label value="Boundary" background="#98C84E"/>
  </Labels>
</View>
```

### 结果参数

**Kind**: global typedef
**Returns**: <code>VideoVectorRegionResult</code> - Label Studio 格式的序列化视频向量区域数据
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| original_width | <code>number</code> | 原始视频帧宽度（像素） |
| original_height | <code>number</code> | 原始视频帧高度（像素） |
| image_rotation | <code>number</code> | 视频帧旋转角度（度） |
| value | <code>Object</code> |  |
| value.sequence | <code>Array.&lt;Object&gt;</code> | 关键帧数组；关键帧之间的位置会被插值 |
| value.sequence[].frame | <code>number</code> | 该关键帧适用的帧号 |
| value.sequence[].enabled | <code>boolean</code> | 从该关键帧起向量是否可见 |
| value.sequence[].closed | <code>boolean</code> | 该关键帧上向量是否为闭合（多边形）或开放（折线） |
| value.sequence[].vertices | <code>Array.&lt;Object&gt;</code> | 包含坐标、贝塞尔曲线信息和点关系的点对象数组 |
| value.labels | <code>Array.&lt;string&gt;</code> | 分配给此向量的标签名称数组（与 `<Labels>` 或 `VideoVectorLabels` 配合使用时） |

#### 结果 JSON 导出示例

```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "sequence": [
      {
        "frame": 1,
        "enabled": true,
        "closed": false,
        "vertices": [
          { "id": "point-1", "x": 25.0, "y": 30.0, "prevPointId": null, "isBezier": false },
          { "id": "point-2", "x": 75.0, "y": 70.0, "prevPointId": "point-1", "isBezier": false }
        ]
      },
      {
        "frame": 30,
        "enabled": true,
        "closed": false,
        "vertices": [
          { "id": "point-1", "x": 40.0, "y": 45.0, "prevPointId": null, "isBezier": false },
          { "id": "point-2", "x": 80.0, "y": 60.0, "prevPointId": "point-1", "isBezier": false }
        ]
      }
    ],
    "labels": ["Road"]
  }
}
```
