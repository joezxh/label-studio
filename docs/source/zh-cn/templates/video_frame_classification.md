---
title: 视频帧分类
type: templates
category: Videos
cat: videos
order: 705
is_new: t
meta_title: 视频帧分类
meta_description: 用于对视频中帧进行分类的模板。
---

<img src="/images/templates/video-frame-classification.png" alt="" class="gif-border" width="552px" height="408px" />

视频帧分类是为视频中单个帧分配标签的过程。当你需要分析视频中的特定时刻或事件（例如检测动作、状态或随时间发生的变化），而不是将整段视频作为一个整体进行分类时，这种技术非常有用。

<iframe width="560" height="315" src="https://www.youtube.com/embed/DsTsbg5NSWQ?si=uOfseQ1CNJ_-uIGv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 标注配置

```xml
<View>
   <TimelineLabels name="videoLabels" toName="video">
     <Label value="Movement" background="#c813ec"/>
     <Label value="Still" background="#1d81cd"/>
     <Label value="Slow Motion" background="#54d651"/>
   </TimelineLabels>
   <Video name="video" value="$video" frameRate="25.0" timelineHeight="120" />
</View>
```

## 关于此标注配置

#### <View>

所有标注配置都必须包裹在 `<View>` 标签中。

#### Video 对象标签

使用 `<Video>` 对象标签指定视频数据。

* `frameRate` 参数设置视频的帧率。请确保其与视频的实际帧率一致。如果你的视频存在缺陷或帧率可变，可能会导致不一致。在上传前将视频转码为恒定帧率会有所帮助。
* 使用 `timelineHeight` 控制用于选择帧的时间轴的高度。
  
更多参数，请参阅 [Video 标签页面](/tags/video)。

```xml
  <Video name="video" value="$video" frameRate="25.0" timelineHeight="120"/>
```

#### TimelineLabels 控制标签

使用 [TimelineLabels 控制标签](/tags/timelinelabels) 定义可应用于视频特定帧的标签。

在 `TimelineLabels` 中使用 `Label` 标签来定义你想要使用的标签。

```xml
<TimelineLabels name="videoLabels" toName="video">
     <Label value="Movement" background="#c813ec"/>
     <Label value="Still" background="#1d81cd"/>
     <Label value="Slow Motion" background="#54d651"/>
</TimelineLabels>
```

## 输入数据格式

准备输入数据时，让 video 字段指向你的视频 URL。如果你想测试一段视频，可以使用如下示例的 JSON 文件：

```json
[
  {
    "video": "/static/samples/opossum_snow.mp4"
  }
]
```


## 相关标签
- [TimelineLabels](/tags/timelinelabels.html)
- [Video](/tags/video.html)
- [Label](/tags/label.html)
- [帧分类的 ML 后端示例](https://github.com/HumanSignal/label-studio-ml-backend/blob/master/label_studio_ml/examples/yolo/README_TIMELINE_LABELS.md)
