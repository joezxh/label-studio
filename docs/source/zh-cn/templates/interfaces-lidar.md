---
title: LiDAR 目标检测 🔒
type: templates
category: Interfaces
order: 372
is_new: t
meta_title: LiDAR 标注界面模板
meta_description: 通过 BEV、透视、相机重投影、时间轴轨道以及外壳区域详情来审阅和编辑 LiDAR 长方体。
---


本模板创建一个 LiDAR 目标检测界面，用于在三维点云上审阅和编辑 3D 长方体标注，提供同步的鸟瞰图、透视图和相机重投影视图，以及用于基于关键帧编辑的多轨道时间轴。

标注人员可以擦洗多帧场景，在鸟瞰图中绘制并调整长方体，观察每个对象重投影到六张相机图像中以便校验标定，在时间轴上管理每个对象的可见性分段和关键帧，并捕获审阅备注和真值标志——从而产出自动驾驶和机器人团队在 3D 目标检测中所需要的、丰富的轨道级（track-level）输出。

![Screenshot](/images/templates-misc/interface-lidar.png)

示例界面包含：

- **鸟瞰图（BEV）**：点云的自上而下视图，以自车（ego vehicle）为中心，叠加相机视锥，支持点击拖拽创建长方体。
- **透视 3D 视图**：同一场景的相机角度视图，以 3D 形式渲染相同的长方体。
- **相机重投影网格**：六张合成相机图块（前中 / 左 / 右，以及后中 / 左 / 右），使用相机的偏航角、视场角（FOV）和分辨率将每个长方体重投影到对应图像上。
- **时间轴**：带有按轨道划分的车道、可拖拽的可见性分段、关键帧标记、播放控件（播放/暂停、速度 0.25x-2x）以及帧擦洗器。
- **轨道编辑面板**：针对所选区域，带有长方体位姿滑块（X / Y / Z / 宽 / 长 / 高 / 偏航角）、遮挡标记、备注和审阅状态。
- **设置面板**：仅用于视图控制的选项——点样式、点大小、细节层级、BEV 缩放和偏移，以及投影开关。
- **可配置标签**：默认值为 `Car`、`Truck`、`Pedestrian`、`Cyclist`；通过 `labels` 参数重命名、重新着色或扩展。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces > Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为顶部工具栏、两行堆叠的视口（上方为 3D 视图、下方为相机视图）、底部的时间轴，以及两个滑出式侧边面板（设置和轨道编辑）。

#### 顶部栏

一个固定的工具栏，包含场景标识和全局控件。

- **场景标签**位于左侧，取自 `data.frame` 或 `data.scene`，并与当前帧号一同显示。
- **工具切换**包含三个工具：**Move（移动）**（`1`）、**Rectangle（矩形）**（`2`，用于在 BEV 中绘制新长方体）、**Hand（手）**（`3`，用于平移）。
- **布局切换**在 **Balanced（均衡）**（BEV + 3D + 相机）、**BEV focus（聚焦 BEV）** 和 **Camera focus（聚焦相机）** 之间循环。
- **Active label（激活标签）**选择器，用于设定你创建的下一个长方体所应用的标签——取自 `labels` 参数。
- **Settings（设置）**切换，用于打开右侧设置面板。

#### LiDAR 窗格

两个并排渲染点云的视口。

- **鸟瞰图（BEV）**：带有网格线、自车以及可选相机视锥叠加的自上而下投影。当 **Rectangle（矩形）** 工具处于激活状态时，拖拽即可在播放头（playhead）帧处创建新长方体；新区域继承 **Active label（激活标签）**。
- **透视 3D 视图**：同一组长方体和点的 3D 相机角度渲染。在任一视图中选择一个区域，都会在另一个视图中选中它。
- 设置面板控制 **Point style（点样式）**（`intensity`、`height`、`solid`）、**Point size（点大小）** 和 **Level of detail（细节层级）**（一个 0-1 滑块，用于为性能而下采样）。

#### 相机重投影网格

在 LiDAR 窗格下方，六张相机图块使用相机的偏航角、视场角和分辨率，将每个长方体重投影到合成图像上。

- 相机固定为：**Front Center（前中）**、**Front Left（左前）**、**Front Right（右前）**、**Rear Center（后中）**、**Rear Left（左后）**、**Rear Right（右后）**。
- 点击某个图块可单独聚焦该相机；再次点击则返回网格。
- 在任何视图中悬停或选择某条轨道，都会在每个能看到它的相机图块中高亮它。

#### 时间轴

底部面板，带有播放控件和按轨道划分的车道堆叠。

- **播放控件**——播放/暂停（也可按 `Space`）、步进控件（或 `ArrowLeft` / `ArrowRight`，按住 `Shift` 可十帧跳转）以及速度选择器。
- **帧擦洗器**，带有当前帧指示器。
- **按轨道的车道**——每个区域一行。每条车道显示彩色可见性分段（对象存在的帧范围）、关键帧菱形标记以及遮挡间隔。拖拽分段边缘可调整其大小。
- **轨道操作**位于车道头部——**New track（新建轨道）**、在播放头处 **Add keyframe（添加关键帧）**、**End visible（结束可见）**（在播放头处终止分段）、**Resume visible（恢复可见）**（开始一个新分段）、**Edit（编辑）**（打开右侧轨道编辑面板）以及 **Delete（删除）**。

#### 设置面板

从顶部栏打开的右侧滑出式面板。仅用于改变场景渲染方式、而不修改任何区域只读控件。

- **View settings（视图设置）**——参考系（`ego` 或 `world`）、点样式、点大小、细节层级、BEV 缩放、BEV 偏移，以及用于相机视锥叠加的 **Show projection（显示投影）** 开关。
- **Calibration（标定）**——每个相机的偏航角、视场角和分辨率显示，用于校验重投影。

#### 轨道编辑面板

针对当前所选区域的右侧滑出式面板，通过时间轴车道的 **Edit（编辑）** 操作打开。

- **Pose sliders（位姿滑块）**——X / Y / Z（米）、宽 / 长 / 高（米）以及偏航角（弧度）。
- **Label（标签）**下拉框、**Source（来源）**（`human` / `model`）、**Confidence（置信度）**徽章、**Verified（已验证）**标志、**Review status（审阅状态）**（`accepted`、`needs_review`、`rejected`、`ground_truth`），以及 **Notes（备注）**文本域。
- 所有编辑都会传播到每个视图中的长方体，并写回到播放头帧处轨道的关键帧。

## React 代码

完整的 `Screen.jsx` 源代码约有 2,900 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务数据的参数，
* 用于激活标签选择器、BEV 长方体颜色以及时间轴的默认标签集，
* 用于重投影的相机阵列，
* 写回 Label Studio 的结果结构。

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段或替换标签集。默认值与下面的示例输入一致。

```js
paramsSchema: {
  type: "object",
  properties: {
    pointCloudField: {
      type: "dataField",
      default: "points",
      description: "Task data field containing LiDAR point samples",
    },
    labels: {
      type: "labels",
      default: DEFAULT_LABELS,
      description: "Object labels",
    },
  },
}
```

界面还会在任务数据存在时读取 `frame_index`（或 `frame`）和 `total_frames`；如果缺失，场景将从单帧片段的第 0 帧开始。

### 默认标签

`DEFAULT_LABELS` 驱动激活标签选择器、时间轴车道色块以及 BEV/3D 长方体颜色。就地编辑它即可重命名、重新着色或扩展标签集——`name` 是作为每个区域上的 `choices[0]` 值持久化的内容。

```js
const DEFAULT_LABELS = [
  { name: "Car",        color: "#617ada" },
  { name: "Truck",      color: "#3287e2" },
  { name: "Pedestrian", color: "#e69559" },
  { name: "Cyclist",    color: "#34988d" },
];
```

### 相机

`CAMERAS` 定义了六个重投影图块。每个条目的 `yaw`、`fov` 和 `res` 决定长方体如何投影到该相机的图像上。在此添加、移除或重新标定相机。

```js
const CAMERAS = [
  { id: "front_center", name: "Front Center", yaw: 0,               fov: 60,  res: "1920x1208" },
  { id: "front_left",   name: "Front Left",   yaw: -Math.PI / 4,    fov: 70,  res: "1920x1208" },
  { id: "front_right",  name: "Front Right",  yaw:  Math.PI / 4,    fov: 70,  res: "1920x1208" },
  { id: "rear_center",  name: "Rear Center",  yaw:  Math.PI,        fov: 110, res: "1920x886"  },
  { id: "rear_left",    name: "Rear Left",    yaw: -Math.PI * 3 / 4, fov: 70, res: "1920x1208" },
  { id: "rear_right",   name: "Rear Right",   yaw:  Math.PI * 3 / 4, fov: 70, res: "1920x1208" },
];
```

### 键盘快捷键

快捷键位于顶层 `LidarObjectDetectionScreen` 组件中。在此添加或重新映射按键。

```js
function onKey(event) {
  if (event.target?.tagName === "INPUT" || event.target?.tagName === "TEXTAREA") return;
  if (event.code === "Space") {
    event.preventDefault();
    setPlaying((value) => !value);
  } else if (event.code === "ArrowLeft") {
    setFrame((value) => clamp(value - (event.shiftKey ? 10 : 1), 0, sceneData.TOTAL_FRAMES - 1));
  } else if (event.code === "ArrowRight") {
    setFrame((value) => clamp(value + (event.shiftKey ? 10 : 1), 0, sceneData.TOTAL_FRAMES - 1));
  } else if (event.key === "1") setTool("move-tool");
  else if (event.key === "2") setTool("rectangle-tool");
  else if (event.key === "3") setTool("hand-tool");
}
```

### 结果结构

`getResults` 为每个轨道发出一个 Label Studio 结果。每个结果都使用 `from_name: "objects"`、`to_name: "points"` 和 `type: "choices"`，并将长方体位姿、可见性分段、关键帧和审阅元数据序列化到 `value` 中。坐标以自车坐标系下的米为单位（`coordinate_system: "ego_vehicle_meters"`）。

```js
function getResults(regions) {
  // Emits one result per track with from_name: "objects", to_name: "points", type: "choices".
  // value: {
  //   choices: [label],
  //   track_id, source_track_id?, frame,
  //   x, y, z, width, length, height, yaw,     // cuboid pose at the saved frame
  //   point_count, coordinate_system: "ego_vehicle_meters",
  //   birth, death,                            // first and last visible frame
  //   segments: [{ start, end }, ...],         // visibility ranges across the scene
  //   keyframes: [{ f, x, y, z, width, length, height, yaw }, ...],
  //   notes?, review_status?, ground_truth?
  // }
}
```

## 示例输入

界面期望一个任务 `data` 对象，其中包含 `points` 数组（由 `{ x, y, z, intensity }` 样本组成），以及可选的 `frame` / `frame_index` / `total_frames` 字段。可选的 `tracks` 数组会预填充注释（例如来自某次模型运行），随后由标注人员审阅和编辑。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "frame": "warehouse-lidar-000000",
    "frame_index": 0,
    "total_frames": 300,
    "points": [
      { "x": -0.872, "y": 3.857,  "z": -1.060, "intensity": 0.008 },
      { "x": -0.498, "y": 4.217,  "z": -1.138, "intensity": 0.024 },
      { "x":  0.611, "y": 6.370,  "z": -1.725, "intensity": 0.016 },
      { "x": -1.806, "y": -3.290, "z": -0.594, "intensity": 0.024 }
      // ... typically thousands of points per frame
    ],
    "tracks": [
      {
        "id": 17,
        "label": "Car",
        "birth": 0,
        "death": 299,
        "source": "human",
        "confidence": 0.99,
        "verified": true,
        "keyframes": [
          { "f": 0,   "x": 0.4, "y": 22.0, "z": 0.7, "w": 1.85, "l": 4.6, "h": 1.55, "yaw": 1.5708 },
          { "f": 140, "x": 0.6, "y": 14.2, "z": 0.7, "w": 1.85, "l": 4.6, "h": 1.55, "yaw": 1.6508 },
          { "f": 299, "x": 2.6, "y":  9.8, "z": 0.7, "w": 1.85, "l": 4.6, "h": 1.55, "yaw": 1.7908 }
        ]
      },
      {
        "id": 23,
        "label": "Pedestrian",
        "birth": 40,
        "death": 260,
        "source": "model",
        "confidence": 0.88,
        "occlusions": [[145, 168]],
        "keyframes": [
          { "f": 40,  "x":  4.5, "y": 28.0, "z": 0.9, "w": 0.7, "l": 0.5, "h": 1.78, "yaw": 3.1416 },
          { "f": 180, "x": -3.0, "y": 27.5, "z": 0.9, "w": 0.7, "l": 0.5, "h": 1.78, "yaw": 3.1416 },
          { "f": 260, "x": -6.0, "y": 27.4, "z": 0.9, "w": 0.7, "l": 0.5, "h": 1.78, "yaw": 3.1416 }
        ]
      }
    ],
    "metadata": {
      "dataset": {
        "name": "Voxel51/lidar-warehouse-dataset",
        "url": "https://huggingface.co/datasets/Voxel51/lidar-warehouse-dataset",
        "license": "cc-by-sa-4.0",
        "sensor": "Velodyne Puck VLP-16",
        "coordinate_transform": "source [x_forward, y_left, z_up, rgb] mapped to task {x: y_left, y: x_forward, z, intensity}"
      }
    }
  }
}
```

{% enddetails %}

点使用自车坐标系下的米为单位，其中 `x` 指向左侧、`y` 指向前方、`z` 指向上方。强度已归一化到 0-1。

## 示例输出

保存的标注包含每个轨道一个结果。下面的示例展示了两条轨道——一条 `Car`，具有横跨整个场景的五个关键帧；一条 `Pedestrian`，其中段中遮挡间隔被捕获为两个可见性分段。

```json
{
  "result": [
    {
      "id": "lidar-track-17",
      "from_name": "objects",
      "to_name": "points",
      "type": "choices",
      "value": {
        "choices": ["Car"],
        "track_id": 17,
        "source_track_id": 17,
        "frame": 140,
        "x": 0.6, "y": 14.2, "z": 0.7,
        "width": 1.85, "length": 4.6, "height": 1.55,
        "yaw": 1.6508,
        "point_count": 142,
        "coordinate_system": "ego_vehicle_meters",
        "birth": 0,
        "death": 299,
        "segments": [{ "start": 0, "end": 299 }],
        "keyframes": [
          { "f": 0,   "x": 0.4, "y": 22.0, "z": 0.7, "width": 1.85, "length": 4.6, "height": 1.55, "yaw": 1.5708 },
          { "f": 140, "x": 0.6, "y": 14.2, "z": 0.7, "width": 1.85, "length": 4.6, "height": 1.55, "yaw": 1.6508 },
          { "f": 299, "x": 2.6, "y":  9.8, "z": 0.7, "width": 1.85, "length": 4.6, "height": 1.55, "yaw": 1.7908 }
        ],
        "review_status": "accepted"
      }
    },
    {
      "id": "lidar-track-23",
      "from_name": "objects",
      "to_name": "points",
      "type": "choices",
      "value": {
        "choices": ["Pedestrian"],
        "track_id": 23,
        "source_track_id": 23,
        "frame": 180,
        "x": -3.0, "y": 27.5, "z": 0.9,
        "width": 0.7, "length": 0.5, "height": 1.78,
        "yaw": 3.1416,
        "point_count": 9,
        "coordinate_system": "ego_vehicle_meters",
        "birth": 40,
        "death": 260,
        "segments": [
          { "start": 40,  "end": 144 },
          { "start": 169, "end": 260 }
        ],
        "keyframes": [
          { "f": 40,  "x":  4.5, "y": 28.0, "z": 0.9, "width": 0.7, "length": 0.5, "height": 1.78, "yaw": 3.1416 },
          { "f": 180, "x": -3.0, "y": 27.5, "z": 0.9, "width": 0.7, "length": 0.5, "height": 1.78, "yaw": 3.1416 },
          { "f": 260, "x": -6.0, "y": 27.4, "z": 0.9, "width": 0.7, "length": 0.5, "height": 1.78, "yaw": 3.1416 }
        ],
        "notes": "Confirmed via rear-left camera, no occlusion at frame 180.",
        "review_status": "needs_review"
      }
    }
  ]
}
```
