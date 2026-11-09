---
title: 多帧视频视图
type: plugins
category: Visualization
cat: visualization
order: 240
meta_title: 多帧视频视图
meta_description: 同步多个视频视图以显示具有不同帧偏移量的视频
tier: enterprise
---

<img src="/images/plugins/frame-offset-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此标注配置将三个视频播放器垂直排列，使查看和标注每一帧视频更加容易。

该插件确保视频保持同步，其中一个播放器显示提前一帧，另一个播放器显示上一帧。

![视频同步标注配置截图](/images/plugins/video_sync.png)

## 插件

```javascript
/**
 * Multi-frame video view plugin
 *
 * This plugin synchronizes three video views to display a video with three frames:
 * -1 frame, 0 frame, and +1 frame.
 *
 * It also synchronizes the timeline labels to the 0 frame.
 */

async function initMultiFrameVideoView() {
	// Wait for the Label Studio Interface to be ready
	await LSI;

	// Get references to the video objects by their names
	const videoMinus1 = LSI.annotation.names.get("videoMinus1");
	const video0 = LSI.annotation.names.get("video0");
	const videoPlus1 = LSI.annotation.names.get("videoPlus1");

	if (!videoMinus1 || !video0 || !videoPlus1) return;

	// Convert frameRate to a number and ensure it's valid
	const frameRate = Number.parseFloat(video0.framerate) || 24;
	const frameDuration = 1 / frameRate;

	// Function to adjust video sync with offset and guard against endless loops
	function adjustVideoSync(video, offsetFrames) {
		video.isSyncing = false;

		for (const event of ["seek", "play", "pause"]) {
			video.syncHandlers.set(event, (data) => {
				if (!video.isSyncing) {
					video.isSyncing = true;

					if (video.ref.current && video !== video0) {
						const videoElem = video.ref.current;

						adjustedTime =
							(video0.ref.current.currentFrame + offsetFrames) * frameDuration;
						adjustedTime = Math.max(
							0,
							Math.min(adjustedTime, video.ref.current.duration),
						);

						if (data.playing) {
							if (!videoElem.playing) videoElem.play();
						} else {
							if (videoElem.playing) videoElem.pause();
						}

						if (data.speed) {
							video.speed = data.speed;
						}

						videoElem.currentTime = adjustedTime;
						if (
							Math.abs(videoElem.currentTime - adjustedTime) >
							frameDuration / 2
						) {
							videoElem.currentTime = adjustedTime;
						}
					}

					video.isSyncing = false;
				}
			});
		}
	}

	// Adjust offsets for each video
	adjustVideoSync(videoMinus1, -1);
	adjustVideoSync(videoPlus1, 1);
	adjustVideoSync(video0, 0);
}

// Initialize the plugin
initMultiFrameVideoView();
```

**相关的 LSI 实例方法：**

* [annotation](custom#LSI-annotation)

## 标注配置

每个视频都包裹在 `<View>` 标签中，宽度为 100%，以确保它们上下堆叠。`Header` 标签为每个视频提供了一个标题，指明当前显示的是哪一帧。

`Video` 标签用于加载视频内容，其中 `name` 属性用于唯一标识每个视频播放器。

`TimelineLabels` 标签连接到第二个视频（`video0`），允许标注人员对视频的特定片段打标签。标签 `class1` 和 `class2` 可用于对视频内容进行分类，从而增强标注过程。

```xml
<View>
  <View style="display: flex">
  <View style="width: 100%">
    <Header value="Video -1 Frame"/>
    <Video name="videoMinus1" value="$video_url" 
           height="200" sync="lag" frameRate="29.97"/>
  </View>
  <View style="width: 100%">
    <Header value="Video +1 Frame"/>
    <Video name="videoPlus1" value="$video_url" 
           height="200" sync="lag" frameRate="29.97"/>
  </View>
  </View>
  <View style="width: 100%; margin-bottom: 1em;">
    <Header value="Video 0 Frame"/>
    <Video name="video0" value="$video_url"
           height="400" sync="lag" frameRate="29.97"/>
  </View>
  <TimelineLabels name="timelinelabels" toName="video0">
    <Label value="class1"/>
    <Label value="class2"/>
  </TimelineLabels>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Video](/tags/video.html)
* [TimelineLabels](/tags/timelinelabels.html)
* [Label](/tags/label.html)

## 示例数据

```json
[
  {
    "video": "/static/samples/opossum_snow.mp4"
  }
]
```
