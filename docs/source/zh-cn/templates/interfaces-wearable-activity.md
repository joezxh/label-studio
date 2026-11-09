---
title: 可穿戴活动标记 🔒
type: templates
category: Interfaces
order: 375
is_new: t
meta_title: 可穿戴活动标注界面模板
meta_description: 审阅可穿戴设备的时间序列通道，并对活动、睡眠或 ECG 片段进行打标签。
---

本模板创建一个可穿戴活动界面（Wearable Activity Interface），用于审阅来自腕戴或胸戴设备的多通道时间序列数据（心率、HRV、加速度、呼吸、SpO2），并将时间段标记为活动、睡眠阶段或 ECG 节律。

标注人员可以看到一条 24 小时上下文条，其中包含自动检测的片段；放大到当天的一个聚焦窗口，擦洗同步的传感器通道，并从三个分组（活动、睡眠阶段、ECG 节律）之一，将标签应用到刷选区域或播放头周围的默认时间跨度上。每个标签都会写出一个区域，包含 `start`、`end`、`duration` 以及来源 `task` 分组，从而产出健康科技和纵向监测团队在活动识别、睡眠分期和节律审阅中所需要的结构化时间跨度输出。

![Screenshot](/images/templates-misc/interface-wearable-activity.png)

示例界面包含：

- **24 小时上下文条**，带有自动检测到的睡眠和活动片段、已有的标注标记，以及一个可拖拽缩放的刷选框，用于更新聚焦窗口。
- **同步的通道堆叠**，最多渲染五条信号轨迹——心率、HRV、加速度幅值、呼吸和 SpO2——共享同一个播放头和选择跨度。
- **跨度刷选**：在通道堆叠中刷选以创建一个时间选择，标注面板会将下一个标签应用到该选择上。在没有活动选择时，标签会应用到播放头周围默认的 ±30 分钟窗口。
- **侧边轨道**：显示每个通道在当前样本处的值，以及聚焦窗口内的 min / max / mean 统计。
- **GPS 路线预览**：位于通道堆叠下方，高亮与当前选择相匹配的路线片段。
- **判定面板**：位于右侧，包含三个堆叠的标签分组——**Activity**、**Sleep stage** 和 **ECG rhythm**——每个标签都以热键按钮的形式呈现。
- **可配置的标签分组**：通过 `activityLabels`、`sleepLabels` 和 `rhythmLabels`，外加一个用于输出校验的合并 `labels` 列表。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces >Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为顶部头部、24 小时上下文条、通道堆叠（其下方带有路线预览）、实时样本统计的侧边轨道，以及用于应用标签的右侧判定面板。

#### 顶部栏

一个细长的头部，包含模板名称和任务上下文。

- **Wearable Activity** 标题以及任务的 `date` 字段（缺失时显示 `"24h sensor review"`）。
- 作为界面的静态标签——此处不包含任何控件。

#### 上下文条

通道堆叠上方的一条 24 小时概览条。

- 来自 `segments` 任务字段的自动检测**上下文片段**渲染为两条堆叠的车道——上方是睡眠阶段，下方是活动——使用每个片段的标签颜色。
- 已有的**标注标记**显示为第三行，供审阅人员查看他们已经标注过的位置。
- 在条上任意位置**拖拽**以刷选一个新的聚焦窗口——该跨度成为通道堆叠中的可见范围。当前的**播放头**位置渲染为一条垂直参考线。
- 右上角的小图例显示了 **Sleep**、**Move**、**Workout** 和 **Annotation** 色块的颜色编码。

#### 通道堆叠

主中央面板——为聚焦窗口渲染的一堆叠信号轨迹。

- **通道**——`Heart rate`（bpm）、`HRV`（ms）、`Accel mag`（g）、`Respiration`（rpm）和 `SpO2`（%）。每个通道都有各自的 y 轴范围和颜色。
- **播放头**在所有通道间共享；点击堆叠中的任意位置即可移动它。
- 水平**刷选**以创建一个时间选择。该选择跨所有通道持续存在，标注面板会将下一个标签应用到它。
- 窗口范围可通过上方的上下文条重置或重新开窗。

#### 侧边轨道

一个狭窄的右侧列，显示播放头位置的实时数值。

- 每个通道在播放头处的**当前样本**值。
- **窗口统计**——聚焦于窗口内每个通道的 min、max 和 mean。
- 当你擦洗播放头或更改窗口时持续刷新。

#### 路线预览

一个渲染在通道堆叠下方的 GPS 面板。

- 将 `route` 任务字段渲染为投影折线，并在匹配的点上带有播放头标记。
- 当有选择处于活跃状态时，只有所选时间段内的路线部分会被高亮。
- 用于交叉核对锻炼片段——例如，确认一个 "Running" 跨度与路线的户外部分相匹配。

#### 判定面板

一个 360 像素的右侧面板，用于将标签应用到当前选择。

- 头部条显示活跃的**跨度**——无论是刷选的选择，还是以播放头为中心的默认 ±30 分钟窗口——及其时间范围和持续时间。
- 三个堆叠的标签分组：**Activity**（提示 `R W B S`）、**Sleep stage**（`A M L D`）和 **ECG rhythm**（`S A V I`）。
- 每个标签都是一个按钮，带有彩色热键徽章和标签名称。点击它会为活跃跨度创建一个区域，并打上匹配的 `task` 分组（`activity`、`sleep` 或 `rhythm`）标签。
- 在 `readOnly` 模式下按钮被禁用。

## React 代码

完整的 `Screen.jsx` 源代码约有 1,500 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务数据和标签分组的参数，
* 三个分组各自的默认标签，
* 通道堆叠和侧边轨道使用的通道定义，
* 写回 Label Studio 的结果结构。

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段，或替换三个标签分组中的任何一个。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  properties: {
    sensorField:    { type: "dataField", default: "sensor",   description: "Task data field containing wearable sensor samples" },
    segmentField:   { type: "dataField", default: "segments", description: "Task data field containing precomputed context segments" },
    routeField:     { type: "dataField", default: "route",    description: "Task data field containing GPS route points" },
    labels:         { type: "labels",    default: ALL_DEFAULT_LABELS,    description: "Allowed output labels for validation and auto-labeling" },
    activityLabels: { type: "labels",    default: DEFAULT_ACTIVITY_LABELS, description: "Activity labels shown in the activity tab" },
    sleepLabels:    { type: "labels",    default: DEFAULT_SLEEP_LABELS,    description: "Sleep stage labels shown in the sleep tab" },
    rhythmLabels:   { type: "labels",    default: DEFAULT_RHYTHM_LABELS,   description: "ECG rhythm labels shown in the rhythm tab" },
  },
};
```

### 默认标签

每个分组都有各自的常量。就地编辑它们以重命名、重新着色或重新映射热键——`name` 是持久化到输出 `value.choices[0]` 中的内容，`color` 显示在热键徽章上并用于为标注标记着色，`hotkey` 显示在标签按钮上。

```js
const DEFAULT_ACTIVITY_LABELS = [
  { name: "Running",   hotkey: "R", color: "#FF7557" },
  { name: "Walking",   hotkey: "W", color: "#57983C" },
  { name: "Cycling",   hotkey: "B", color: "#34988D" },
  { name: "Strength",  hotkey: "S", color: "#9F6CC6" },
  { name: "Yoga",      hotkey: "Y", color: "#E37BD3" },
  { name: "Swimming",  hotkey: "P", color: "#6D87F1" },
  { name: "Sedentary", hotkey: "E", color: "#6B6860" },
  { name: "Artifact",  hotkey: "X", color: "#A49F95" },
];

const DEFAULT_SLEEP_LABELS = [
  { name: "Awake",          hotkey: "A", color: "#99ABF5" },
  { name: "REM",            hotkey: "M", color: "#9F6CC6" },
  { name: "Light Sleep",    hotkey: "L", color: "#576CC1" },
  { name: "Deep Sleep",     hotkey: "D", color: "#37447A" },
  { name: "Sleep Artifact", hotkey: "X", color: "#6B6860" },
];

const DEFAULT_RHYTHM_LABELS = [
  { name: "Sinus Rhythm",    hotkey: "S", color: "#34988D" },
  { name: "AFib",            hotkey: "A", color: "#FF7557" },
  { name: "PVC",             hotkey: "V", color: "#E69559" },
  { name: "Inconclusive",    hotkey: "I", color: "#6B6860" },
  { name: "Motion Artifact", hotkey: "M", color: "#45433E" },
];
```

### 通道

`CHANNELS` 同时驱动中央信号堆叠和侧边轨道读数。每个条目的 `read` 函数从单个样本中提取数值，`range` 设定 y 轴边界，`color` 为轨迹着色。

```js
const CHANNELS = [
  { key: "hr",    label: "Heart rate",  unit: "bpm", color: "#FF7557", range: [45, 175], read: (sample) => sample.hr },
  { key: "hrv",   label: "HRV",         unit: "ms",  color: "#99ABF5", range: [15, 120], read: (sample) => sample.hrv },
  { key: "accel", label: "Accel mag",   unit: "g",   color: "#F4AA2A", range: [0.75, 2.2], read: (sample) => sample.accel },
  { key: "resp",  label: "Respiration", unit: "rpm", color: "#34988D", range: [8, 30],   read: (sample) => sample.resp },
  { key: "spo2",  label: "SpO2",        unit: "%",   color: "#6D87F1", range: [88, 100], read: (sample) => sample.spo2 },
];
```

要新增一个通道（例如皮肤温度或压力分数），追加一个具有唯一 `key`、y 轴 `range` 以及从样本中提取数值的 `read` 函数的条目。

### 结果结构

`getResults` 为每个被标记的时间跨度发出一个 Label Studio 结果。每个结果都使用 `from_name: "activity"`、`type: "choices"`，并将所选时间范围、持续时间以及来源标签分组（`task`）写入 `value`。

```js
function getResults(regions) {
  // Emits one result per labeled span with from_name: "activity", type: "choices".
  // to_name: sensorField (defaults to "sensor")
  // value: {
  //   choices: [label],            // e.g. ["Running"], ["Deep Sleep"], ["AFib"]
  //   start, end, duration,        // seconds since the start of the day
  //   task,                        // "activity" | "sleep" | "rhythm"
  //   note?                        // optional reviewer note
  // }
}
```

## 示例输入

界面期望一个任务 `data` 对象，其中包含由时间戳样本组成的 `sensor` 数组、可选的预计算上下文跨度 `segments` 数组（用于驱动 24 小时上下文条），以及可选的 GPS 点 `route` 数组。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "device": "Garmin Forerunner 965",
    "date": "2026-04-18",
    "timezone": "America/Los_Angeles",
    "workout": "Golden Gate Park tempo run",
    "sensor": [
      { "timestamp": 0,     "hr": 57,  "hrv": 84, "x": 0.01, "y": 0.02, "z": 0.98, "resp": 12.4, "spo2": 97.1 },
      { "timestamp": 5400,  "hr": 52,  "hrv": 96, "x": 0.01, "y": 0.03, "z": 0.99, "resp": 11.7, "spo2": 96.8 },
      { "timestamp": 25200, "hr": 66,  "hrv": 59, "x": 0.04, "y": 0.08, "z": 1.01, "resp": 14.9, "spo2": 97.6 },
      { "timestamp": 61200, "hr": 104, "hrv": 38, "x": 0.24, "y": 0.31, "z": 1.09, "resp": 20.1, "spo2": 97.3 },
      { "timestamp": 63000, "hr": 146, "hrv": 25, "x": 0.63, "y": 0.78, "z": 1.29, "resp": 25.8, "spo2": 96.8 },
      { "timestamp": 64800, "hr": 143, "hrv": 27, "x": 0.58, "y": 0.72, "z": 1.24, "resp": 25.1, "spo2": 96.9 },
      { "timestamp": 85800, "hr": 61,  "hrv": 70, "x": 0.02, "y": 0.03, "z": 0.99, "resp": 13.0, "spo2": 97.2 }
      // ... typically one sample every few minutes across the 24-hour window
    ],
    "segments": [
      { "start": 0,     "end": 5400,  "label": "Light Sleep", "kind": "sleep" },
      { "start": 5400,  "end": 10800, "label": "Deep Sleep",  "kind": "sleep" },
      { "start": 10800, "end": 15600, "label": "REM",         "kind": "sleep" },
      { "start": 25200, "end": 33600, "label": "Sedentary",   "kind": "activity" },
      { "start": 61200, "end": 66600, "label": "Running",     "kind": "activity" },
      { "start": 80400, "end": 86400, "label": "Light Sleep", "kind": "sleep" }
    ],
    "route": [
      { "timestamp": 61200, "lat": 37.76951, "lon": -122.48684 },
      { "timestamp": 62400, "lat": 37.77046, "lon": -122.48222 },
      { "timestamp": 63600, "lat": 37.76942, "lon": -122.47734 },
      { "timestamp": 64800, "lat": 37.76918, "lon": -122.47265 },
      { "timestamp": 66000, "lat": 37.77112, "lon": -122.46830 },
      { "timestamp": 66600, "lat": 37.77204, "lon": -122.46615 }
    ]
  }
}
```

{% enddetails %}

每个传感器样本都带有以秒为单位（自当天开始起）的 `timestamp`、心率 / HRV / 呼吸 / SpO2 读数，以及一个三轴加速度计三元组（`x`、`y`、`z`），界面会将其合并为 `Accel mag` 通道。`segments` 和 `route` 都是可选的——当它们缺失时，界面会渲染空白车道或隐藏 GPS 面板。

## 示例输出

保存的标注包含每个被标记跨度一个结果。下面的示例展示了三个区域——当天开始时一个 `Deep Sleep` 阶段、配速跑期间的 `Running` 锻炼，以及同一锻炼窗口上的 `Sinus Rhythm` 节律审阅。

```json
{
  "result": [
    {
      "id": "wearable-sleep-deep-sleep-5400-10800",
      "from_name": "activity",
      "to_name": "sensor",
      "type": "choices",
      "value": {
        "choices": ["Deep Sleep"],
        "start": 5400,
        "end": 10800,
        "duration": 5400,
        "task": "sleep"
      },
      "origin": "manual"
    },
    {
      "id": "wearable-activity-running-61200-66600",
      "from_name": "activity",
      "to_name": "sensor",
      "type": "choices",
      "value": {
        "choices": ["Running"],
        "start": 61200,
        "end": 66600,
        "duration": 5400,
        "task": "activity",
        "note": "Tempo segment confirmed against GPS route."
      },
      "origin": "manual"
    },
    {
      "id": "wearable-rhythm-sinus-rhythm-61200-66600",
      "from_name": "activity",
      "to_name": "sensor",
      "type": "choices",
      "value": {
        "choices": ["Sinus Rhythm"],
        "start": 61200,
        "end": 66600,
        "duration": 5400,
        "task": "rhythm"
      },
      "origin": "manual"
    }
  ]
}
```
