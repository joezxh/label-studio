---
title: Video
type: tags
order: 311
meta_title: 用于视频标注的 Video 标签
meta_description: 使用 Video 标签自定义 Label Studio，用于机器学习和数据科学项目的基础视频标注任务。
---

Video 标签用于播放简单的视频文件。适用于分类、转写等视频标注任务。

与以下数据类型配合使用：video（视频）

### 视频格式

Label Studio 依赖你的网页浏览器播放视频并统计总帧数。因此，你的视频必须使用被广泛支持的格式和编码至关重要。为确保最大的兼容性，我们建议使用 MP4 容器，视频使用 H.264 (AVC) 编码，音频使用 AAC 编码。这种组合在所有现代浏览器中都被广泛支持，并能最大限度地减少诸如总时长检测不正确或播放问题等情况。此外，将你的视频转换为恒定帧率（CFR）（理想情况下约为 30 fps）也很重要，以避免帧数差异以及帧重复或丢失的问题。

你的文件中的所有音频流和视频流的时长也必须相同；否则，你会得到多余的总帧数。

将你的视频转换为这种推荐格式有助于确保它们在 Label Studio 中流畅播放，并且帧率和时长能被正确识别，从而实现准确的标注。要将任意视频转换为此格式，你可以使用 FFmpeg。例如，以下命令将输入视频转换为使用 H.264 视频、AAC 音频以及 30 fps 恒定帧率的 MP4：

```bash
# 以秒为单位提取准确的视频流时长
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nokey=1:noprint_wrappers=1 input.mp4)
# 将媒体文件重新编码为推荐格式
ffmpeg -i input_video.mp4 -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -to $DUR output_video.mp4
```

在此命令中：
- `-i input_video.mp4` 指定你的源视频。
- `-c:v libx264` 使用 H.264 编码进行视频编码。
- `-profile:v high -level 4.0` 设置兼容广泛设备的参数。
- `-pix_fmt yuv420p` 确保像素格式与大多数浏览器兼容。
- `-r 30` 强制设定 30 fps 的恒定帧率。你也可以省略 -r 选项，ffmpeg 会保留你当前的帧率。如果你 100% 确定你的视频是恒定帧率，这样做也没问题。
- `-c:a aac -b:a 128k` 以 128 kbps 的 AAC 编码音频。
- `-to` 会在容器时钟到达你视频的结束时间戳时立即停止写入输出，从而自动丢弃任何多余的音频尾部。
- `output_video.mp4` 是可供在 Label Studio 中使用的转换后的视频文件。

使用此 FFmpeg 命令重新编码你的视频有助于消除播放问题，并确保 Label Studio 准确检测视频总时长，提供流畅的标注体验。

建议使用以下命令检查视频的所有参数：
```bash
ffprobe -v error -show_format -show_streams -print_format json input.mp4
```

{% insertmd zh-cn/includes/tags/video.md %}

### 示例

用于在标注界面上显示视频的标注配置

```html
<View>
  <Video name="video" value="$video" />
</View>
```
### 示例

带有自定义播放速度设置的视频

```html
<View>
  <Video name="video" value="$video" defaultPlaybackSpeed="2" minPlaybackSpeed="1.5" />
</View>
```
### 示例

视频分类

```html
<View>
  <Video name="video" value="$video" />
  <Choices name="ch" toName="video">
    <Choice value="Positive" />
    <Choice value="Negative" />
  </Choices>
</View>
```
### 示例

视频转写

```html
<View>
  <Video name="video" value="$video" />
  <TextArea name="ta" toName="video" />
</View>
```
