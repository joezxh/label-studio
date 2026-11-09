---
title: 机器人回合回放审阅 🔒
type: templates
category: Interfaces
order: 360
is_new: t
meta_title: 机器人标注界面模板
meta_description: 结合视频上下文、时间轴分段、质量评分、失误、子目标与指导备注来审阅机器人回合。
---

本模板创建一个机器人回合回放审阅界面（Robotics Episode Review Interface），用于在其采集到的视频流旁并排检视自主策略（policy）的回放。

标注人员逐步浏览回合，对整体执行质量进行打分，并细化子任务、失误、子目标和指导备注的时间轴，供 ML 与机器人团队用于评估策略表现。

![Screenshot](/images/templates-misc/interface-robotics.png)

示例界面包含：

- **多摄像头视频面板**，带有可切换的主视图（顶部、手腕等）以及三种布局模式：单视图、画廊、主视图+侧视图。
- **播放控制**，包含播放/暂停、逐帧步进、速度（0.25x - 2x），以及叠加失误标记的擦洗条。
- **时间轴面板**，渲染子任务分段、失误标记、子目标和指导提示，支持点击跳转以及按状态着色的分段。
- **元数据面板**，包含 1-5 星质量评分、控制模式、速度分级、来源、机器人 ID、问题计数和采集日期。
- **分段编辑**，标注人员可以从时间轴工具栏新增子任务、在播放头处拆分当前分段、标记失误，或固定子目标。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces >Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为三个区域外加一个固定头部。

#### 头部栏

显示回合数标题、回合 ID 和机器人名称，以及三个控件：

- 一个在 **One**、**Gallery**、**Main + Side** 之间切换的布局开关。
- 一个 **Main video（主视频）** 下拉框（在 One 和 Main + Side 布局下显示），用于选择哪个摄像头占据主视口。
- 一个质量读数（例如 `quality 4/5`），与元数据面板中的星级评分保持同步。
  
![Screenshot](/images/templates-misc/interface-robotics-header.png)

#### 视频面板

渲染所选摄像头画面和播放控制条。在回合播放或擦洗过程中，距离播放头 5 秒内的一个活跃失误会以叠加层突出显示，并展示失误标签与严重度。

![Screenshot](/images/templates-misc/interface-robotics-video.png)

#### 时间轴面板

显示当前子任务（`now: <name>`）以及当前时刻触发的任何指导提示。四个工具栏按钮供标注人员编辑时间轴：

- **New subtask（新建子任务）**：在播放头处插入一个新分段。
- **Split segment（拆分分段）**：在播放头处将当前分段拆分为两个。
- **Mark mistake（标记失误）**：在播放头处放置一个失误标记。
- **Pin subgoal（固定子目标）**：在播放头处附加一个子目标标签。

工具栏下方，三条车道与时间标尺并排渲染：子任务车道（按状态着色——`queued`、`running`、`done`、`warn`）、失误/指导车道，以及子目标车道。点击车道的任意位置都会将播放头跳转到对应时间。

![Screenshot](/images/templates-misc/interface-robotics-timeline.png)

#### 元数据面板

一个右侧轨道，包含两个部分：

- **Episode metadata（回合元数据）**——1-5 星的 **Quality（质量）**评分（也可由 `1`-`5` 按键驱动）、**Control mode（控制模式）**分段开关（`joint` 或 `EE pose`）、**Speed（速度）**显示、**Bin（分级）**徽章，以及一个小型速度直方图。
- **Source（来源）**——**Source（来源）**、**Robot（机器人）**、**Issues（问题）**计数，以及 **Captured（采集）**日期。

界面还响应键盘快捷键：**Space** 切换播放/暂停、**ArrowLeft** / **ArrowRight** 将播放头步进一秒、**1**-**5** 设置质量评分。

<img src="/images/templates-misc/interface-robotics-metadata.png" style="max-width: 300px" alt="元数据面板截图">

## React 代码

完整的 `Screen.jsx` 源代码约有 2,600 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务字段的参数
* 界面回退使用的默认示例数据
* 分段状态与配色方案
* 键盘快捷键
* 写回 Label Studio 的结果结构

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  properties: {
    episodeIdField: { type: "string", title: "Episode ID field", default: "episodeId" },
    titleField: { type: "string", title: "Episode title field", default: "title" },
    totalSecField: { type: "string", title: "Duration seconds field", default: "totalSec" },
    totalFramesField: { type: "string", title: "Frame count field", default: "totalFrames" },
    videosField: { type: "string", title: "Videos field", default: "videos" },
    subtasksField: { type: "string", title: "Subtasks field", default: "subtasks" },
    mistakesField: { type: "string", title: "Initial mistakes field", default: "mistakes" },
    subgoalsField: { type: "string", title: "Subgoals field", default: "subgoals" },
    coachingField: { type: "string", title: "Coaching field", default: "coaching" },
    defaultVideoLayout: {
      type: "string",
      title: "Default video layout",
      enum: ["one", "gallery", "main-side"],
      default: "main-side",
    },
  },
  required: ["episodeIdField", "titleField", "totalSecField", "totalFramesField"],
};
```

### 默认示例数据

如果任务缺少任何可选字段（subtasks、mistakes、subgoals、coaching、videos），界面会从这些常量自行播种。

编辑它们以更改演示数据，或在你始终发送真实值后将其移除。

```js
const DEFAULT_SUBTASKS = [
  { id: "1", name: "grasp shirt",         start: 0,  end: 8,   status: "done" },
  { id: "2", name: "lift to center",      start: 8,  end: 21,  status: "done" },
  { id: "3", name: "align fold",          start: 21, end: 38,  status: "warn", note: "missed crease" },
  { id: "4", name: "fold left over right",start: 38, end: 62,  status: "running" },
  { id: "5", name: "smooth + release",    start: 62, end: 92,  status: "queued" },
  { id: "6", name: "stack onto pile",     start: 92, end: 134, status: "queued" },
];

const DEFAULT_MISTAKES = [{ id: "m1", at: 30, label: "missed crease", severity: "warn" }];

const DEFAULT_SUBGOALS = [
  { id: "g1", at: 0,  label: "right hand on collar" },
  { id: "g2", at: 14, label: "shirt centered" },
  // ...
];

const DEFAULT_COACHING = [
  { id: "c1", at: 12, text: "now lift the right corner" },
  // ...
];

const DEFAULT_VIDEOS = [
  { id: "front",       label: "Front view",  view: "front",       sub: "primary - 1280x720 - 30 fps" },
  { id: "left-wrist",  label: "Left wrist",  view: "left-wrist",  sub: "640x480" },
  { id: "right-wrist", label: "Right wrist", view: "right-wrist", sub: "640x480" },
];
```

### 分段状态与颜色

每个子任务都带有一个来自 `SEGMENT_STATUS_OPTIONS` 的状态，`segmentColor` 返回时间轴和 Outliner 中使用的色块。调整这些可新增一种状态（例如 `failed`）或重新定义现有状态。

```js
const SEGMENT_STATUS_OPTIONS = ["queued", "running", "done", "warn"];

function segmentColor(segment) {
  if (segment.status === "done")    return "#34988d";
  if (segment.status === "warn")    return "#e69559";
  if (segment.status === "running") return "#4c5fa9";
  return "#a49f95";
}
```

### 键盘快捷键

热键位于顶层 `Screen` 组件中。在此添加或重新映射某个按键。

```js
function onKey(event) {
  if (event.target && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.code === "Space") {
    event.preventDefault();
    setPlaying((value) => !value);
  } else if (event.code === "ArrowLeft") {
    setT((value) => clamp(value - 1, 0, episode.totalSec));
  } else if (event.code === "ArrowRight") {
    setT((value) => clamp(value + 1, 0, episode.totalSec));
  } else if (event.key >= "1" && event.key <= "5") {
    updateReview(props, episode, { _quality: Number(event.key), _currentTimeSec: t });
  }
}
```

### 结果结构

`getResults` 构建 Label Studio 持久化的标注。它始终发出一个 `episode_review` choices 结果，外加每个时间轴分段一个 `segment` labels 结果，全部附加到单个 `episode` 对象——这是你扩展界面时应当保留的约定。

```js
const REVIEW_FROM_NAME = "episode_review";
const SEGMENT_FROM_NAME = "segment";
const EPISODE_TO_NAME = "episode";

function getResults(regions) {
  // Builds one reviewResult:
  //   { from_name: "episode_review", to_name: "episode", type: "choices",
  //     value: { choices: ["Reviewed"], quality, mistakes, subgoals, notes, currentTimeSec, selectedSegmentId, episodeId } }
  //
  // Plus one segmentResult per region:
  //   { from_name: "segment", to_name: "episode", type: "labels",
  //     value: { id, name, start, end, status, note, order } }
}
```

## 示例输入

界面期望一个任务 `data` 对象，其中包含回合定义，以及（可选的）videos、subtasks、mistakes、subgoals 和 coaching。每个 `videos[].url` 可以是外部 URL，也可以是用于自包含样本的 `data:video/mp4;base64,...` 字符串。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "episodeId": "avea-4-4-left-000000",
    "title": "SO101 4-4-left manipulation preview",
    "robot": "SO101 follower",
    "robotId": "so101-left",
    "source": "Robotics dataset",
    "datasetUrl": "https://huggingface.co/datasets/avea-robotics/4-4-left",
    "license": "Apache-2.0",
    "captured": "18s embedded preview clip from episode_000000, offset 6s",
    "speed": "30 fps source",
    "speedBin": "12 fps preview",
    "controlMode": "joint",
    "totalSec": 18,
    "totalFrames": 540,
    "initialTime": 4.5,
    "initialQuality": 4,
    "videos": [
      {
        "id": "top",
        "label": "Top camera",
        "view": "front",
        "sub": "320x240 preview",
        "url": "https://example.com/episode_000000_top.mp4"
      },
      {
        "id": "wrist",
        "label": "Wrist camera",
        "view": "left-wrist",
        "sub": "320x240 preview",
        "url": "https://example.com/episode_000000_wrist.mp4"
      }
    ],
    "subtasks": [
      { "id": "1", "name": "move into workspace",     "start": 0,   "end": 3,    "status": "done" },
      { "id": "2", "name": "align wrist over target", "start": 3,   "end": 6,    "status": "done" },
      { "id": "3", "name": "approach object",         "start": 6,   "end": 9.5,  "status": "running" },
      { "id": "4", "name": "grasp and lift",          "start": 9.5, "end": 13,   "status": "warn",   "note": "brief hesitation before lift" },
      { "id": "5", "name": "move to placement area",  "start": 13,  "end": 16,   "status": "queued" },
      { "id": "6", "name": "release and retreat",     "start": 16,  "end": 18,   "status": "queued" }
    ],
    "mistakes": [
      { "id": "m1", "at": 10.5, "label": "hesitation before lift", "severity": "warn" }
    ],
    "subgoals": [
      { "id": "g1", "at": 0,  "label": "arm initialized" },
      { "id": "g2", "at": 4,  "label": "target centered in top view" },
      { "id": "g3", "at": 8,  "label": "gripper near object" },
      { "id": "g4", "at": 12, "label": "object lifted" },
      { "id": "g5", "at": 17, "label": "release posture reached" }
    ],
    "coaching": [
      { "id": "c1", "at": 4,  "text": "center target before closing gripper" },
      { "id": "c2", "at": 10, "text": "commit to lift once contact is stable" },
      { "id": "c3", "at": 16, "text": "slow down before release" }
    ]
  }
}
```

{% enddetails %}

## 示例输出

保存的标注包含一个 `episode_review` choices 结果，以及每个时间轴分段一个 `segment` labels 结果。所有结果共享同一个 `to_name`（`episode`），因此它们被分组到同一个逻辑区域上。

例如（部分 JSON）：

```json
{
  "result": [
    {
      "id": "episode-review-avea-4-4-left-000000",
      "from_name": "episode_review",
      "to_name": "episode",
      "type": "choices",
      "value": {
        "choices": ["Reviewed"],
        "episodeId": "avea-4-4-left-000000",
        "quality": 4,
        "selectedSegmentId": "3",
        "currentTimeSec": 9.5,
        "mistakes": [
          { "id": "m1", "at": 10.5, "label": "hesitation before lift", "severity": "warn" },
          { "id": "mistake-1715515200000", "at": 12.4, "label": "review marker", "severity": "warn" }
        ],
        "subgoals": [
          { "id": "g4", "at": 12, "label": "object lifted" }
        ],
        "notes": ""
      }
    },
    {
      "id": "segment-avea-4-4-left-000000-1",
      "from_name": "segment",
      "to_name": "episode",
      "type": "labels",
      "value": {
        "id": "1",
        "name": "move into workspace",
        "start": 0,
        "end": 3,
        "status": "done",
        "note": "",
        "order": 0
      }
    },
    {
      "id": "segment-avea-4-4-left-000000-4",
      "from_name": "segment",
      "to_name": "episode",
      "type": "labels",
      "value": {
        "id": "4",
        "name": "grasp and lift",
        "start": 9.5,
        "end": 13,
        "status": "warn",
        "note": "brief hesitation before lift",
        "order": 3
      }
    }
  ]
}
```
