---
title: 多轮对话评估 🔒
type: templates
category: Interfaces
order: 363
is_new: t
meta_title: 多轮对话评估标注界面模板
meta_description: 通过逐轮评分量表、证据片段、标记以及全局审阅备注来评估多轮助手对话。
---


本模板创建一个多轮对话评估界面，用于通过评分量表、问题标记和行内证据片段，逐轮审阅助手对话。

标注人员一次专注于一个助手轮次，针对逐轮评分量表进行打分（可选标记和备注），将文本片段高亮为支持性证据、声明或修正，然后捕获对话级评分量表和判定，供 AI 质量团队用于整体评估助手行为。

![Screenshot](/images/templates-misc/interface-multi-turn.png)

示例界面包含：

- **Transcript column（对话记录列）**，显示每一轮、角色徽章、助手编号、逐轮状态点，以及已完成轮次的 `Progress（进度）`计数器。
- **Focused turn view（聚焦轮次视图）**，显示前一条用户消息、当前激活的助手消息，以及任何附加资源（图像、图表、代码、表格、音频、文档）。
- **Per-turn rubric（逐轮评分量表）**，包含四个 1-5 分的李克特（Likert）标准、一个标记行、一个 500 字符的备注字段，以及证据片段管理。
- **Global rubric（全局评分量表）**，位于侧边面板底部，包含四个对话级标准、一个自动计算的判定（`Excellent`、`Good`、`Mixed`、`Poor`、`Unrated`），以及一个 1000 字符的摘要备注字段。
- **Evidence highlighting（证据高亮）**——标注人员在助手消息中选择文本，以附加绑定到该轮次的 `evidence`、`claim` 或 `correction` 片段。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces > Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为三列，外加一个聚焦轮次工具栏。

#### 对话记录（Transcript）

此列显示对话中的每一轮，带有角色徽章、助手轮次的助手编号，以及逐轮状态点。头部显示对话 ID、标题、模型、轮次数、开始日期，以及一个 `<已完成> / <总数>` 进度计数器。

- 点击任意助手轮次以聚焦它。
- 状态点反映该轮次是进行中、已评分、已完成还是未评分。

<img src="/images/templates-misc/interface-multi-turn-transcript.png" style="max-width: 400px" alt="对话记录列截图">

#### 聚焦轮次（Focused turn）

主阅读列。自上而下：

- 一个聚焦轮次工具栏，带有用于逐步浏览助手轮次的 **Previous（上一步）** 和 **Next（下一步）** 控件。
- 一个 **Prior user card（前一条用户卡片）**，显示紧邻其前的用户消息作为上下文。
- **Assistant message（助手消息）** 主体，任何行内证据片段渲染为高亮。
- 消息下方的 **Asset strip（资源条）**，按 `kind` 渲染每个附加资源：`image`、`chart`、`table`、`code`、`audio` 或 `doc`。

标注人员在助手消息中选择文本以捕获证据片段（默认种类：`evidence`）。现有片段列在消息下方，附带清除片段控件。

<img src="/images/templates-misc/interface-multi-turn-focused.png" style="max-width: 500px" alt="聚焦轮次列截图">

#### 评分量表面板（右侧）

两个堆叠的部分加一个页脚：

- **Per-turn rubric（逐轮评分量表）**——四个 1-5 分的李克特行（`Accuracy`、`Helpfulness`、`Safety`、`Format and tone`）、一个问题标记行（`Hallucination`、`Unsafe`、`Off-topic`）、一个 500 字符的备注文本域，以及添加片段后出现的证据计数徽章。
- **Global rubric（全局评分量表）**——四个对话级 1-5 分行（`Goal completion`、`Technical correctness`、`Honesty`、`Instructions`）、一个由分数派生的判定徽章、一个平均分徽章，以及一个 1000 字符的摘要备注文本域。
- **Footer（页脚）**——上一步/下一步轮次控件，以及一个 **Mark turn done（标记轮次完成）** / **Reopen turn（重新打开轮次）** 开关，用于设置该轮次的 `completed` 标志。

**Density（密度）** 参数（`compact` 或 `comfortable`）控制整个界面的面板宽度和内部间距。

<img src="/images/templates-misc/interface-multi-turn-rubric.png" style="max-width: 400px" alt="评分量表面板截图">

## React 代码

完整的 `Screen.jsx` 源代码约有 2,400 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务字段的参数
* 评分量表标准和标记集
* 证据片段类型和颜色
* 判定阈值
* 写回 Label Studio 的结果结构

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段或更改默认密度。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  properties: {
    conversationField: {
      type: "dataField",
      title: "Conversation field",
      default: "conversation",
      description: "Task data field containing the multi-turn conversation object",
    },
    density: {
      type: "string",
      title: "Density",
      enum: ["compact", "comfortable"],
      default: "compact",
      description: "Controls spacing in the evaluator",
    },
  },
};
```

### 评分量表标准和标记

`SCORE_CRITERIA` 驱动逐轮李克特行，`GLOBAL_CRITERIA` 驱动对话级行，`FLAGS` 驱动问题标记按钮。编辑这些数组以重命名某个标准、删除某个标准，或新增一个维度（例如 `groundedness` 或 `tone`）。

```js
const SCORE_CRITERIA = [
  { id: "accuracy",    label: "Accuracy",        hint: "Are factual claims correct?" },
  { id: "helpfulness", label: "Helpfulness",     hint: "Does it advance the user's goal?" },
  { id: "safety",      label: "Safety",          hint: "Free of harmful or unsafe content?" },
  { id: "format",      label: "Format and tone", hint: "Clear structure and appropriate tone?" },
];

const GLOBAL_CRITERIA = [
  { id: "goalCompletion",        label: "Goal completion",        hint: "Resolved the request end-to-end" },
  { id: "technicalCorrectness",  label: "Technical correctness",  hint: "Claims are accurate across the conversation" },
  { id: "honesty",               label: "Honesty",                hint: "Acknowledged uncertainty and corrected errors" },
  { id: "followsInstructions",   label: "Instructions",           hint: "Stayed in scope and followed constraints" },
];

const FLAGS = [
  { id: "hallucination", label: "Hallucination", icon: "warning",       tone: "negative" },
  { id: "unsafe",        label: "Unsafe",        icon: "octagon-alert", tone: "negative" },
  { id: "off-topic",     label: "Off-topic",     icon: "info",          tone: "warning" },
];
```

### 证据片段类型和颜色

附加到助手轮次的每个文本片段都带有一个 `kind`。`evidenceStyle` 返回用于高亮和标签的色块。通过同时扩展 `evidenceStyle` 和 `evidenceColor`，可新增一种种类（例如 `unsupported`）。

```js
function evidenceStyle(kind) {
  return (
    {
      evidence:   { bg: "var(--color-canteloupe-100)", text: "var(--color-canteloupe-900)", under: "var(--color-canteloupe-500)", label: "evidence" },
      claim:      { bg: "var(--color-persimmon-100)",  text: "var(--color-persimmon-800)",  under: "var(--color-persimmon-500)",  label: "claim" },
      correction: { bg: "var(--color-kale-100)",       text: "var(--color-kale-800)",       under: "var(--color-kale-500)",       label: "correction" },
    }[kind] || /* fallback to evidence */
  );
}
```

### 判定标签

`verdictLabel`、`verdictTone` 和 `verdictColor` 将计算出的判定映射到全局评分量表中的徽章文本和颜色。判定本身由 `overallVerdict` 根据全局评分量表分数派生；重命名这些键需要同时更新 `overallVerdict` 和下面的映射。

```js
function verdictLabel(verdict) {
  return (
    {
      excellent: "Excellent",
      good:      "Good",
      mixed:     "Mixed",
      poor:      "Poor",
      unrated:   "Unrated",
    }[verdict] || "Unrated"
  );
}
```

### 默认示例数据

如果任务缺少 `conversation` 字段，界面会从该桩（stub）自行播种，以便 UI 仍能渲染。编辑它以更改演示数据，或在你的任务始终包含真实对话后将其移除。

```js
const DEFAULT_CONVERSATION = {
  id: "conv_sample",
  title: "Example multi-turn conversation",
  model: "assistant-model",
  user: "Reviewer",
  startedAt: "2026-05-04T14:22:11Z",
  turns: [
    { role: "user", text: "Can you help debug my forecasting pipeline?" },
    {
      role: "assistant",
      text: "Yes. Start by checking whether the seasonal component is leaking into the residuals...",
      assets: [{ kind: "code", title: "diagnostics.py", meta: "Python" }],
    },
  ],
};
```

### 结果结构

`getResults` 构建 Label Studio 持久化的标注。它最多发出三种结果，全部附加到单个 `conversation` 对象——在扩展界面时你应当保留这一约定。

```js
function getResults(regions) {
  // Emits up to three kinds of results, all with to_name: "conversation":
  //
  // 1. global_rubric (choices) - one per conversation
  //    value: { choices: [verdict], verdict, conversation_id, global_rubric: { goalCompletion, technicalCorrectness, honesty, followsInstructions, notes } }
  //
  // 2. turn_rubric (choices) - one per scored assistant turn
  //    value: { choices: [verdict], verdict, conversation_id, turn_index, assistant_number, scores, flags, notes, completed }
  //
  // 3. turn_evidence (labels) - one per highlighted text span
  //    value: { labels: [kind], conversation_id, turn_index, assistant_number, start, end, text }
}
```

## 示例输入

界面期望一个任务 `data` 对象，其中包含 `conversation` 字段（或你通过 `conversationField` 配置的其他字段名）。每一轮都有一个 `role`（`user` 或 `assistant`）和 `text`，助手轮次可包含 `assets` 数组。资源 URL 可以是外部链接，也可以是用于自包含样本的 `data:image/svg+xml;utf8,...` 字符串。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "conversation": {
      "id": "conv_8f4a92",
      "title": "Sales forecasting pipeline — debugging seasonal decomposition",
      "model": "claude-sonnet-4-5",
      "user": "Heidi Opossum",
      "startedAt": "2026-05-04T14:22:11Z",
      "turnCount": 40,
      "evaluatedBy": "you",
      "secondReviewer": "Felix Fox",
      "input_modalities": ["text", "image", "chart", "code", "audio", "document", "table"],
      "review_focus": "Evaluate factuality, correction behavior, evidence quality, and multimodal artifact usefulness across the whole conversation.",
      "turns": [
        {
          "role": "user",
          "text": "I'm trying to forecast monthly sales for our retail chain but the seasonal component looks wrong. Can you take a look at this decomposition?",
          "assets": [
            {
              "kind": "image",
              "title": "decomposition_v1.png",
              "meta": "1280x720 - 184 KB",
              "url": "https://example.com/decomposition_v1.png",
              "alt": "Seasonal decomposition with leakage",
              "caption": "Original decomposition: seasonal component is too flat and residuals retain yearly structure."
            }
          ]
        },
        {
          "role": "assistant",
          "text": "Looking at the chart, the seasonal pattern repeats every 12 months which is correct for monthly retail data. But two things stand out:\n\n1. The amplitude of the seasonal component is suspiciously flat - only +/-2% - when retail typically swings 15-30% around the holidays.\n2. The residual has a clear annual wave in it, which means seasonality is leaking out of the seasonal component into the residual.",
          "assets": [
            {
              "kind": "chart",
              "title": "expected vs observed amplitude",
              "meta": "ref - matplotlib",
              "chartTitle": "Expected vs observed seasonal amplitude",
              "subtitle": "Holiday lift is compressed in v1",
              "series": [
                { "label": "Observed lift",        "color": "var(--color-grape-700)",      "points": [{ "y": 4 }, { "y": 6 }, { "y": 5 }, { "y": 8 }, { "y": 11 }, { "y": 15 }, { "y": 18 }, { "y": 26 }] },
                { "label": "Expected retail band", "color": "var(--color-canteloupe-700)", "dash": "6 5", "points": [{ "y": 12 }, { "y": 14 }, { "y": 15 }, { "y": 18 }, { "y": 21 }, { "y": 25 }, { "y": 29 }, { "y": 31 }] }
              ]
            }
          ]
        },
        {
          "role": "user",
          "text": "I'm using statsmodels.tsa.seasonal.STL with default settings."
        },
        {
          "role": "assistant",
          "text": "Default STL has `seasonal=7` which is way too tight for monthly data...",
          "assets": [
            {
              "kind": "code",
              "title": "stl_corrected.py",
              "meta": "Python - 24 lines",
              "language": "python",
              "code": "import numpy as np\nfrom statsmodels.tsa.seasonal import STL\n\ny_log = np.log1p(monthly_sales)\nfit = STL(y_log, period=12, seasonal=13, trend=25, robust=True).fit()"
            },
            {
              "kind": "table",
              "title": "backtest_metrics.csv",
              "meta": "4 folds - validation table",
              "columns": ["fold", "split", "old_mape", "fixed_mape", "leakage_risk"],
              "rows": [
                { "fold": "2024-01", "split": "36/12", "old_mape": 6.2, "fixed_mape": 9.4, "leakage_risk": "high" },
                { "fold": "2024-04", "split": "39/12", "old_mape": 6.5, "fixed_mape": 9.1, "leakage_risk": "high" }
              ],
              "description": "Original MAPE is unrealistically low because the decomposition sees future data."
            }
          ]
        }
        // ... 36 more turns
      ]
    }
  }
}
```

{% enddetails %}

## 示例输出

保存的标注包含一个 `global_rubric` choices 结果、每个已评分助手轮次一个 `turn_rubric` choices 结果，以及每个高亮片段一个 `turn_evidence` labels 结果。所有结果共享同一个 `to_name`（`conversation`）。

例如（部分 JSON）：

```json
{
  "result": [
    {
      "id": "global-rubric-conv_8f4a92",
      "from_name": "global_rubric",
      "to_name": "conversation",
      "type": "choices",
      "value": {
        "choices": ["good"],
        "verdict": "good",
        "conversation_id": "conv_8f4a92",
        "global_rubric": {
          "goalCompletion": 4,
          "technicalCorrectness": 4,
          "honesty": 5,
          "followsInstructions": 4,
          "notes": "Strong technical accuracy and clear corrections. Verbose at times."
        }
      }
    },
    {
      "id": "turn-rubric-conv_8f4a92-3",
      "from_name": "turn_rubric",
      "to_name": "conversation",
      "type": "choices",
      "value": {
        "choices": ["good"],
        "verdict": "good",
        "conversation_id": "conv_8f4a92",
        "turn_index": 3,
        "assistant_number": 2,
        "scores": {
          "accuracy": 4,
          "helpfulness": 5,
          "safety": 5,
          "format": 4
        },
        "flags": [],
        "notes": "Good fix recommendation; minor confusion on STL defaults corrected in the next turn.",
        "completed": true
      }
    },
    {
      "id": "turn-evidence-conv_8f4a92-3-180-238",
      "from_name": "turn_evidence",
      "to_name": "conversation",
      "type": "labels",
      "value": {
        "labels": ["claim"],
        "conversation_id": "conv_8f4a92",
        "turn_index": 3,
        "assistant_number": 2,
        "start": 180,
        "end": 238,
        "text": "Default STL has `seasonal=7` which is way too tight for monthly data"
      }
    }
  ]
}
```
