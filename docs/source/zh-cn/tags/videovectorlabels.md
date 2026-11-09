---
title: VideoVectorLabels
short: VideoVectorLabels
type: tags
order: 438
meta_title: 用于视频向量标注的 VideoVectorLabels 标签
meta_description: 使用 VideoVectorLabels 标签自定义 Label Studio，用于视频上带标签的向量标注。
---

`VideoVectorLabels` 标签在视频帧上创建带标签的向量。它将 [VideoVector](/tags/videovector.html) 和 [Labels](/tags/labels.html) 合并为一个标签，便于进行向量标注，并支持跨视频帧的基于关键帧的插值。

与以下数据类型配合使用：video（视频）。

!!! note 可用性
    `VideoVector` 和 `VideoVectorLabels` 标签目前仅在 Label Studio Enterprise（包括自托管）和 Starter Cloud 中提供。

这些标签与 [SAM2](/guide/ml_tutorials/segment_anything_2_video.html) 配合用于视频分割和目标跟踪效果很好。详见 [VideoVector](/tags/videovector.html#Use-with-SAM2-for-video-segmentation)。

## 参数

{% insertmd zh-cn/includes/tags/videovectorlabels.md %}

### 示例

在视频上进行带标签的向量标注（使用闭合路径）

```html
<View>
  <Video name="video" value="$video" />
  <VideoVectorLabels name="labels" toName="video" closable="true">
    <Label value="Road" />
    <Label value="Boundary" />
  </VideoVectorLabels>
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
| value.labels | <code>Array.&lt;string&gt;</code> | 分配给此向量的标签名称数组 |

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
        "closed": true,
        "vertices": [
          { "id": "point-1", "x": 25.0, "y": 30.0, "prevPointId": null, "isBezier": false },
          { "id": "point-2", "x": 75.0, "y": 30.0, "prevPointId": "point-1", "isBezier": false },
          { "id": "point-3", "x": 50.0, "y": 70.0, "prevPointId": "point-2", "isBezier": false }
        ]
      }
    ],
    "labels": ["Road"]
  }
}
```
