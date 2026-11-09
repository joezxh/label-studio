---
title: 视频目标检测与跟踪
type: templates
category: Videos
cat: videos
order: 715
is_new: t
meta_title: 视频目标检测数据标注模板
meta_description: 使用 Label Studio 检测视频中目标的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/video-object-tracking.png" alt="" class="gif-border" width="552px" height="408px" />

视频目标检测旨在用边界框检测视频流中的目标，不同于使用静态图像的[图像目标检测](/templates/image_bbox.html)。

视频目标跟踪是进一步的扩展，其中检测到的目标会随其在视频帧中的移动而被跟踪，包括空间和时间两个方向。
图示模板提供了视频中目标跟踪的手动与自动两种方式。除了支持逐帧视频目标跟踪的新视频播放器之外，最新版本还提供了一个更高效、更符合人体工效、更灵活的新型标注用户界面。

<a href="https://app.humansignal.com/b/MTkx"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

!!! attention "重要"

    1. 视频分类与目标跟踪在 Label Studio 1.6 版本之前仅可预览，但如今这些功能已完全可用并可用于生产环境。
    2. 在 Label Studio Enterprise 中，视频目标跟踪被称为用于视频目标检测的视频标注（video labeling）。
    3. 支持的视频格式为 `mpeg4/H.264 webp` 与 `webm`。支持的视频格式也取决于浏览器以及客户端的任何预转换处理。


## 前提条件

使用视频目标检测功能的前提条件如下：

1. 准备需要标注的数据集。
2. 使用支持该数据的数据标签与工具。
3. 使用视频分类可用的视频播放器。
4. 将所有边界框放置到屏幕上。


## 支持的关键特性

视频播放器支持以下关键特性：

* 在视频上使用边界框的视频与目标检测用例。
* 通过在视频上创建矩形进行视频分割。


## 标注配置

获取目标检测与跟踪项目最简单的方式是在项目设置中指定以下标注配置。

```xml
  <View>
     <Header>Label the video:</Header>
     <Video name="video" value="$video" framerate="25.0"/>
     <VideoRectangle name="box" toName="video" />
     <Labels name="videoLabels" toName="video" allowEmpty="true">
       <Label value="Man" background="blue"/>
       <Label value="Woman" background="red"/>
       <Label value="Other" background="green"/>
     </Labels>
  </View>
```


## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header>Label the video:</Header>
```

使用 [Video](/tags/video.html) 对象标签指定视频数据。`framerate` 参数设置项目中所有视频的帧率。请在该标签的参考页面查看所有可用参数。
```xml
<Video name="video" value="$video" frameRate="25.0"/>
```

!!! note
    请确保 `frameRate` 与视频的实际帧率一致。如果你的视频存在缺陷或帧率可变，可能会导致不一致。在上传前将视频转码为恒定帧率会有所帮助。
     
使用 [VideoRectangle](/tags/videorectangle.html) 控制标签，让标注人员为视频帧添加矩形：
```xml
<VideoRectangle name="box" toName="video" />
```

使用 [Labels](/tags/labels.html) 控制标签指定可添加到视频帧上矩形区域的标签：
```xml
<Labels name="videoLabels" toName="video" allowEmpty="true">
    <Label value="Man" background="blue"/>
    <Label value="Woman" background="red"/>
    <Label value="Other" background="green"/>
</Labels>
```
你可以替换并在 `<Labels>` 部分中添加更多与你的标注场景相对应的标签。


## 输入数据

通过 `<Video>` 标签中的 `value` 属性，以视频流 URL 的形式指定输入数据。
对于上面的示例，预期使用以下[导入 JSON 格式](/guide/tasks.html#Basic-Label-Studio-JSON-format)：

```json
{
  "video": "https://htx-pub.s3.amazonaws.com/samples/opossum_snow.mp4"
}
```

## 输出数据

标注数据由手动创建的关键帧，以及（可选的）插值得到的关键帧组成。下面是 JSON 模式的说明：

| JSON 键 | 类型 | 描述 |
| --- | --- | --- |
| id | string | 区域（被跟踪目标）ID | 
| type | string | "videorectangle" | 
| value.labels | list of strings | 目标标签 | 
| value.duration | numeric | 目标在视频流中的总生命周期时长（秒） |
| value.sequence | list of objects | 关键帧列表 |

`value.sequence` 列表中的关键帧格式如下：

| JSON 键 | 类型 | 描述 |
| --- | --- | --- |
| x | numeric | 边界框 x 轴坐标（以左上角为原点，从左到右） |
| y | numeric | 边界框 y 轴坐标（以左上角为原点，从上到下） |
| time | numeric | 关键帧的绝对时间位置（秒） |
| frame | numeric | 关键帧的索引位置（从 0 开始的帧序号） |
| width | numeric | 当前帧中边界框的宽度 |
| height | numeric | 当前帧中边界框的高度 |
| rotation | numeric | 当前帧中边界框的旋转角度（顺时针） |
| enabled | boolean | 是否开启后续帧的插值（例如用于标注遮挡） |

### 示例

```json
{
  "id": "d1111333b6",
  "type": "videorectangle",
  "value": {
    "labels": [
      "Other"
    ],
    "duration": 11.96,
    "sequence": [
      {
        "x": 46.71875,
        "y": 6.944444444444445,
        "time": 0.04,
        "frame": 1,
        "width": 4.0625,
        "height": 23.61111111111111,
        "enabled": true,
        "rotation": 0
      },
      {
        "x": 46.640625,
        "y": 6.666666666666667,
        "time": 0.24,
        "frame": 6,
        "width": 4.140625,
        "height": 23.88888888888889,
        "enabled": true,
        "rotation": 0
      }
    ],
    "framesCount": 299
  },
  "origin": "manual",
  "to_name": "video",
  "from_name": "box"
}
```

### 导出带插值帧的数据

默认情况下，导出数据时只包含关键帧。

在导出标注时，你或许希望包含插值帧。这样可以确保视频中的每一帧都被包含进来。

你可以通过以下方法之一，使用 `interpolate_key_frames` 参数来实现：


#### 使用 API 创建启用插值的导出快照

你可以使用 Label Studio API 创建一个启用了关键帧插值的导出快照。

**端点：**
```
POST /api/projects/{project_id}/exports
```
**请求体：**
```json
{
  "title": "Export with Interpolated Keyframes",
  "serialization_options": {
    "interpolate_key_frames": true
  }
}
```
**示例 cURL 命令：**
```bash
curl -X POST 'https://your-label-studio-domain.com/api/projects/{project_id}/exports' \
  -H 'Authorization: Token YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "title": "Export with Interpolated Keyframes",
    "serialization_options": {
      "interpolate_key_frames": true
    }
  }'
```
**步骤：**
1. **创建导出快照：**
   - 向 `/api/projects/{project_id}/exports` 发送 `POST` 请求，在 `serialization_options` 中将 `interpolate_key_frames` 设为 `true`。
2. **检查导出状态：**
   - 轮询导出状态，使用 `GET /api/projects/{project_id}/exports/{export_id}`，直到 `status` 变为 `completed`。
3. **下载导出文件：**
   - 导出完成后，使用以下方式下载导出文件：
     ```
     GET /api/projects/{project_id}/exports/{export_id}/download?exportType=JSON
     ```
   - 示例 cURL 命令：
     ```bash
     curl -X GET 'https://your-label-studio-domain.com/api/projects/{project_id}/exports/{export_id}/download?exportType=JSON' \
       -H 'Authorization: Token YOUR_API_KEY' \
       -o 'exported_annotations.json'
     ```

#### 使用 Label Studio SDK

如果你正在使用 Label Studio SDK，可以创建一个启用插值的导出：

**Python 代码示例：**

```python
from label_studio_sdk import Client
import time
# 连接到 Label Studio
ls = Client(url='http://localhost:8080', api_key='YOUR_API_KEY')
# 根据 ID 获取你的项目
project = ls.get_project(PROJECT_ID)
# 创建启用插值的导出快照
export_result = project.export_snapshot_create(
    title='Export with Interpolated Keyframes',
    serialization_options={
        'interpolate_key_frames': True
    }
)
# 获取导出 ID
export_id = export_result['id']
# 等待导出完成
while True:
    export_status = project.get_export_status(export_id)
    if export_status['status'] == 'completed':
        break
    elif export_status['status'] == 'failed':
        raise Exception('Export failed')
    else:
        time.sleep(5)  # 再次检查前等待 5 秒
# 下载导出文件
export_file_path = project.export_snapshot_download(
    export_id, export_type='JSON', path='.'
)
print(f'Exported data saved to {export_file_path}')
```

**注意：**
- 将 `YOUR_API_KEY` 替换为你的实际 API key。
- 将 `PROJECT_ID` 替换为你的项目 ID。
- 请确保已安装最新版本的 Label Studio SDK。

#### 使用命令行界面（CLI）

你可以使用 Label Studio CLI 导出带有插值关键帧的标注。

**命令：**
```bash
label-studio export --host http://localhost:8080 --api-key YOUR_API_KEY PROJECT_ID JSON --interpolate-key-frames
```
**注意：**
- `--interpolate-key-frames` 标志会在导出期间启用插值。
- 请将 `YOUR_API_KEY` 和 `PROJECT_ID` 分别替换为你的 API key 和项目 ID。
- 导出的数据默认保存在 `data/export` 目录中。


#### 使用带查询参数的导出端点

你可以直接使用导出端点，并将 `interpolate_key_frames` 作为查询参数传递，从而导出带插值的数据。
**端点：**
```
GET /api/projects/{project_id}/export?interpolate_key_frames=true
```
**示例 cURL 命令：**
```bash
curl -X GET 'https://your-label-studio-domain.com/api/projects/{project_id}/export?interpolate_key_frames=true' \
  -H 'Authorization: Token YOUR_API_KEY' \
  -o 'exported_annotations.json'
```

## Label Studio UI 增强

视频播放器功能包含以下 UI 增强：
1. 双“区域”与“详情”控制面板（而非单一侧边栏），让标注人员无需滚动即可查看任务的所有相关信息。
2. 可折叠、可拖拽、可调整大小的面板，供标注人员自定义工作区，特别有助于更大尺度地查看图像或视频。
3. 对每个区域更精细的控制，包括精确设置边界框的宽度、高度和坐标，以实现像素级的完美标注。
4. 更简洁的界面，用于分组、组织区域、链接、添加元数据、删除区域，以及锁定区域的新功能。


## 使用场景

视频播放器提供以下使用场景：
1. [增强图像，使标注人员更容易更精准地标注模糊图像](#enhance-images)。
2. [添加关键帧并调整关键帧之间的边界框，以轻松实现边界框形状与位置的过渡](#add-keyframes)。
3. [借助改进的时间轴分割，在视频的时间戳之间进行选择与标注](#select-and-label-between-timestamps)。
4. [使用可选的基于热键的导航，以实现更细粒度的目标跟踪](#use-optional-hotkey-driven-navigation)。
5. [使用细粒度控制操作跨后续帧标注并跟踪目标](#fine-grained-control-actions)。
6. [重新配置标注工作区，以简化对更大任务的标注，包括具有多个区域的大型图像和较长视频](#reconfigure-annotation-workspaces)。

视频目标检测提供了构建在视频之上的分析功能。例如，如果你查看一段视频，你会看到在视频上带有跟踪目标边界框。

### 增强图像
在 Label Studio 界面中，视频界面会呈现主视频画布，并提供控制项，让标注人员通过以下操作更精准地标注模糊图像：

**放大、缩小、缩放以适配，或缩放到 100%。**

<img src="../images/zoom-options.png" class="gif-border" />

<i>图 1：缩放选项。</i>


**跟踪缩放选项。**
<img src="../images/video-object-tracking-zoom-options.png" class="gif-border" />
<i>图 2：视频目标跟踪缩放选项。</i>


**跳转到上一个关键帧。**
<img src="../images/go-to-previous-keyframe.png" class="gif-border" />
<i>图 3：跳转到上一个关键帧按钮。</i>


**后退一步。**
<img src="../images/go-one-step-back.png" class="gif-border" />
<i>图 4：后退一步按钮。</i>


**播放与暂停。**
<img src="../images/play-pause.png" class="gif-border" />
<i>图 5：播放与暂停按钮。</i>


**前进一步。**
<img src="../images/go-one-step-forward.png" class="gif-border" />
<i>图 6：前进一步按钮。</i>


**跳转到下一个关键帧。**
<img src="../images/goto-next-keyframe.png" class="gif-border" />
<i>图 7：跳转到下一个关键帧按钮。</i>


**切换时间轴。**
<img src="../images/toggle-timeline.png" class="gif-border" />
<i>图 8：切换时间轴按钮。</i>


### 添加关键帧
在视频播放器中，你可以看到帧数、总帧数和当前帧数。你可以在帧与帧之间或特定的帧编号之间导航。在导航过程中会添加关键点，以便你可以跳转到之前的关键点或之前的帧。


<img src="../images/total-frames-current-frame.png" class="gif-border" />
<i>图 9：处理帧。</i>

你可以折叠或展开时间轴，也可以使用计时器选项来设置和调整视频的时间。
<img src="../images/time-frame.png" class="gif-border" />
<i>图 10：使用时间帧导航。</i>

你也可以调整矩形框以检测目标感兴趣区域。
<img src="../images/adjust-rectangle-frame-for-obj-detection.png" class="gif-border" />
<i>图 11：调整用于目标检测的矩形框。</i>

要检测徽章上的目标，请选择标签并在其上绘制矩形。
<img src="../images/object-detection-badge.png" class="gif-border" />
<i>图 12：目标检测徽章。</i>


### 使用时间戳

当你处理时间戳或时间轴时，可以在边界框上添加关键帧并从特定帧编号开始。一条细线（在滚动时延伸到视频末尾）表示边界框的过渡或生命周期。你可以使用一帧接一帧地跟踪徽章。

<img src="../images/navigate-to-particular-framenumber.png" class="gif-border" />
<i>图 13：导航到特定帧编号。</i>

灰色矩形和橙色菱形表示所选的关键帧。
<img src="../images/keyframe-timeline-to-create-bb.png" class="gif-border" />
<i>图 14：关键帧时间轴。</i>

### 使用热键导航
启用基于热键的导航，以增强目标跟踪的细粒度。

<img src="../images/enable-shortcut-keys.png" class="gif-border" />
<i>图 15：启用基于热键的导航。</i>


### 细粒度控制操作
使用细粒度控制操作跨后续帧标注并跟踪目标。

**形状过渡**

当你调整边界框并出现新的关键帧时，就会发生形状过渡。例如，你可以添加一个新的关键帧并调整边界框以贴合徽章。然后从某一帧（比如第 30 帧）导航回之前的某一帧（第 17 帧）。现在，你会看到边界框形状在这些帧之间发生了变化。此操作将有助于轻松实现边界框形状的过渡，并调整以适配被跟踪的目标。你可以为每个帧添加更多关键点或关键点到每一帧，以更精确地跟踪过渡。

<img src="../images/adjust-rectangle-frame-for-obj-detection.png" class="gif-border" />
<i>图 16：调整矩形框。</i>


**监控生命周期**

当你处于特定帧编号中，且徽章消失时，就无需再跟踪它了。

<img src="../images/disappears-badge.png" class="gif-border" />
<i>图 17：徽章消失。</i>

现在导航到该特定帧编号并按下**切换插值（Toggle Interpolation）**按钮。它会在此时切断插值，徽章随之消失。它只显示之前添加的帧。

<img src="../images/activate-toggle-interpolation.png" class="gif-border" />
<i>图 18：激活切换插值。</i>

图 17 中消失的徽章现在在插值中重新出现，如你所见图 19。
<img src="../images/badge-appear-within-interpolation.png" class="gif-border" />
<i>图 19：徽章在插值中出现。</i>

**过渡帧**

如果你不想让视频自行播放，而是希望查看帧的过渡，那么你可以拖动帧指示器来查看它是如何过渡、如何出现、如何消失等等。你还可以通过拖动显示当前可见视口的概览窗口来设置视频的位置。

### 重新配置标注工作区
你可以重新配置标注工作区，以简化对更大任务的标注，包括具有多个区域的大型图像和较长视频。这可以让你查看更多的视频部分、更宽的时间轴空间，并能看到许多关键帧和区域。

你可以通过切换关键点来添加关键点。例如，如果你不小心移动了边界框，而它不在正确的位置，那么你必须移除关键点以将其重置到初始位置。你可以为对象检测添加许多边界框。

<img src="../images/add-multiple-keyframes.png" class="gif-border" />
<i>图 20：添加多个关键点。</i>

图 21 展示了可用于对象检测和跟踪的可用边界框（`Car`、`Airplane` 或 `Possum`）。
<img src="../images/add-many-bb.png" class="gif-border" />
<i>图 21：添加许多边界框。</i>

小地图为每个添加的标签区域显示独立的线条。在图 22 中，小地图为每个添加的 `Car`、`Airplane` 或 `Possum` 标签区域显示独立的线条。
<img src="../images/mini-map-upto-5bb.png" class="gif-border" />
<i>图 22：多区域的小地图。</i>

### 更多示例
以下展示了视频目标跟踪功能的更多示例。
<img src="../images/videoplayer.png" class="gif-border" />
<i>图 23：视频目标跟踪示例 1。</i>

带时间戳的视频目标跟踪功能示例。
<video src="../images/video-1.mp4" controls="controls" style="max-width: 730px;" class="gif-border" />

<i>图 24：带时间戳的视频目标跟踪示例 2。</i>

在视频播放器中移动大纲窗口。
<video src="../images/video-2.mp4" controls="controls" style="max-width: 730px;" class="gif-border" />

<i>图 25：在视频播放器中移动大纲窗口的示例 3。</i>

## 相关标签

- [Video](/tags/video.html)
- [VideoRectangle](/tags/videorectangle.html)
- [Labels](/tags/labels.html)
