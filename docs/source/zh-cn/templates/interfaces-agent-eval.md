---
title: Agent 评估 🔒
type: templates
category: Interfaces
order: 366
is_new: t
meta_title: Agent 评估标注界面模板
meta_description: 审阅 Agent 执行轨迹，逐步评分正确性，给出总体判定，并捕获失败模式与批评意见。
---

本模板创建一个 Agent 运行审阅界面，用于评估由 LLM Agent 针对用户请求所产生的多步骤执行轨迹——包括推理、工具调用、子 Agent、产物（artifact）和错误。

标注人员逐步阅读轨迹，将各个步骤评为 `correct`（正确）、`partial`（部分正确）或 `incorrect`（不正确），给出总体判定（`good` / `mixed` / `bad`），依据可配置的评分量表（rubric）对运行进行打分，标记失败模式，并撰写一段自由文本批评意见，供 AI 质量团队用于评估 Agent 表现并指导 Agent 开发的改进。

![Screenshot](/images/templates-misc/interface-agent-eval.png)

示例界面包含：

- **运行头部（Run header）**：显示运行 ID、Agent 与模型名称、状态、开始时间，以及一条 KPI 信息条，涵盖耗时、token 数、成本、工具调用数、错误数和已评分步骤进度。
- **运行河流缩略图（Run river minimap）**：左侧轨道按顺序排列每个步骤，按类型着色，按所选指标（`latency`、`tokens` 或 `cost`）调整大小，支持点击跳转滚动。
- **轨迹画布（Trace canvas）**：主阅读列，按类型（user、reasoning、tool_call、error、subagent、artifact、agent）渲染各步骤，可展开子 Agent 子步骤，并内联显示每步评分胶囊（pill）。
- **评分面板（Scoring panel）**：包含总体判定、可配置评分量表行、每步评分统计、失败模式标签芯片（chip）以及批评文本域——每一项均作为独立的标注结果保存。

!!! error Enterprise
    界面（Interfaces）仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces > Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为三列，外加一个固定的运行头部。

#### 运行头部

一个固定的长条，左侧为运行标识，右侧为 KPI 信息条。

- 左侧块显示运行 ID、状态徽章（`completed`、`completed-with-warnings` 或 `failed`）、运行名称、模型和开始时间戳。一旦设置了判定，状态旁会出现一个 `Verdict: <label>` 徽章。
- 右侧块显示 **Duration（耗时）**、**Tokens（token 数）**、**Cost（成本）**、**Tools（工具）**、**Errors（错误）** 以及 **Rated（已评分）** 计数器（`<已评分步骤>/<总步骤>`）。每个 KPI 仅当运行上对应字段存在时才会渲染。

![Screenshot](/images/templates-misc/interface-agent-eval-header.png)

#### 运行河流缩略图

每个步骤的垂直缩略图。每一行按步骤类型着色，并按所选指标调整大小。

- 顶部的 **Latency / Tokens / Cost（延迟 / Token / 成本）** 选项卡用于切换驱动条宽的指标。
- 缩进反映子 Agent 的嵌套关系；子 Agent 的子步骤位于其父级之下。
- 每条条状图左侧的评分圆点反映该步骤的逐步骤评分。
- 底部的颜色图例将每种步骤类型（User、Agent、Reasoning、Tool、Subagent、Artifact、Error）映射到其色块。

<img src="/images/templates-misc/interface-agent-eval-run-river.png" style="max-width: 150px" alt="运行河流缩略图截图">

#### 轨迹画布

主阅读列。每个步骤渲染为一张卡片，带有类型图标、标题、时间、耗时、token/成本元数据以及一行评分胶囊。

- 评分胶囊对应 `stepRatingLabels`——默认是 `correct`、`partial`、`incorrect`。点击胶囊即为该步骤评分；再次点击当前激活的胶囊可清除评分。
- 子 Agent 步骤可展开——切换以显示嵌套的子步骤（推理、工具调用、产物、Agent 消息）。
- 工具调用内联显示其 `args` 及返回 `result` 的预览。
- 错误会连同错误代码和消息一起渲染。
- **Show reasoning（显示推理）** 参数设为 `false` 时会隐藏推理步骤，在仅审阅对外可见行为时很有用。

<img src="/images/templates-misc/interface-agent-eval-trace.png" style="max-width: 600px" alt="轨迹画布截图">

#### 评分面板

右侧轨道，包含五个部分，每个部分都作为独立的标注结果持久化，因此审阅人员可以混合搭配填写哪些内容：

- **Overall verdict（总体判定）**——`verdictLabels` 中每个条目对应一个按钮。再次点击可清除判定。
- **Rubric（评分量表）**——`rubricItems` 中每个条目对应一行 1-5 评分。每个已评分维度都会成为一个独立的 `rubric` 结果。
- **Per-step ratings（每步评分）**——只读统计，显示每个评分各有多少步骤，由轨迹画布中的胶囊驱动。
- **Failure modes（失败模式）**——来自 `failureModeLabels` 的可切换标签芯片。
- **Critique（批评意见）**——一个自由文本文本域，作为 `critique` 标注结果保存。

<img src="/images/templates-misc/interface-agent-eval-scoring.png" style="max-width: 300px" alt="评分面板截图">

## React 代码

完整的 `Screen.jsx` 源代码约有 2,000 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务数据的参数
* 默认标签集（判定、步骤评分、失败模式、评分量表条目）
* 步骤类型元数据
* 写回 Label Studio 的结果结构

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段、更改默认密度、隐藏推理步骤，或切换缩略图的指标。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  properties: {
    runField: {
      type: "dataField",
      title: "Run field",
      default: "run",
      description: "Task data field containing the agent run object",
    },
    verdictLabels:     { type: "labels", title: "Verdict labels",      default: DEFAULT_VERDICT_LABELS },
    stepRatingLabels:  { type: "labels", title: "Step rating labels",  default: DEFAULT_STEP_RATING_LABELS },
    failureModeLabels: { type: "labels", title: "Failure mode labels", default: DEFAULT_FAILURE_MODE_LABELS },
    rubricItems: {
      type: "array",
      title: "Rubric items",
      default: DEFAULT_RUBRIC_ITEMS,
      description: "Rubric dimensions shown in the scoring panel",
    },
    density:       { type: "string",  title: "Density",       enum: ["compact", "comfortable"], default: "comfortable" },
    showReasoning: { type: "boolean", title: "Show reasoning", default: true },
    minimapMode:   { type: "string",  title: "River metric",  enum: ["latency", "tokens", "cost"], default: "latency" },
  },
};
```

### 默认标签集

这四个常量驱动判定按钮、步骤评分胶囊、失败模式芯片和评分量表行。就地编辑它们即可重命名或重新着色某个标签、删除某个条目，或新增一个条目。

```js
const DEFAULT_VERDICT_LABELS = [
  { name: "good",  color: "#22625d" },
  { name: "mixed", color: "#664228" },
  { name: "bad",   color: "#b3523d" },
];

const DEFAULT_STEP_RATING_LABELS = [
  { name: "correct",   color: "#34988d" },
  { name: "partial",   color: "#e69559" },
  { name: "incorrect", color: "#e6694e" },
];

const DEFAULT_FAILURE_MODE_LABELS = [
  { name: "hallucination",    color: "#e6694e" },
  { name: "missing_citation", color: "#e69559" },
  { name: "stale_data",       color: "#e69559" },
  { name: "wrong_tool",       color: "#e69559" },
  { name: "verbose",          color: "#a49f95" },
  { name: "incomplete",      color: "#e69559" },
  { name: "off_topic",        color: "#a49f95" },
  { name: "good_recovery",    color: "#34988d" },
];

const DEFAULT_RUBRIC_ITEMS = [
  { id: "helpfulness",           label: "Helpfulness",   desc: "Solved the user's task" },
  { id: "faithfulness",          label: "Faithfulness",  desc: "Grounded in retrieved sources" },
  { id: "efficiency",            label: "Efficiency",    desc: "Reasonable tool and token use" },
  { id: "tool_use",              label: "Tool use",      desc: "Right tools and arguments" },
  { id: "instruction_following", label: "Instructions",  desc: "Format and scope followed" },
];
```

### 步骤类型元数据

每个步骤都有一个 `kind`。`stepMeta` 返回轨迹画布和河流缩略图中使用的颜色、背景、标签和图标。通过扩展此映射可新增一种类型（例如 `tool_result`）。

```js
function stepMeta(kind) {
  return (
    {
      user:      { color: "var(--color-sand-700)",      bg: "var(--color-sand-100)",      label: "User",      icon: "people" },
      agent:     { color: "var(--color-grape-700)",     bg: "var(--color-grape-000)",     label: "Agent",     icon: "spark" },
      reasoning: { color: "var(--color-fig-700)",       bg: "var(--color-fig-000)",       label: "Reasoning", icon: "sparkle" },
      tool_call: { color: "var(--color-blueberry-700)", bg: "var(--color-blueberry-000)", label: "Tool",      icon: "settings" },
      subagent:  { color: "var(--color-plum-700)",      bg: "var(--color-plum-000)",      label: "Subagent",  icon: "models" },
      artifact:  { color: "var(--color-kale-700)",      bg: "var(--color-kale-000)",      label: "Artifact",  icon: "folder" },
      error:     { color: "var(--color-persimmon-700)", bg: "var(--color-persimmon-000)", label: "Error",     icon: "warning" },
    }[kind] || /* fallback to a neutral "Step" entry */
  );
}
```

### 结果结构

`getResults` 构建 Label Studio 持久化的标注。与其他界面不同，本界面会发出最多五个独立的结果——每个评分部分一个——全部附加到同一个 `run` 对象上。只有在审阅人员实际填写了某个部分时才会发出对应的结果，因此部分标注也能干净地保存。

```js
function getResults(regions) {
  // Emits up to five independent results, all with to_name: "run":
  //
  // 1. step_classification (choices) - one combined result for all per-step pills
  //    value: { choices: [unique_ratings...], step_scores: { [stepId]: rating }, run_id }
  //
  // 2. verdict (choices) - the overall verdict
  //    value: { choices: [verdict], verdict, run_id }
  //
  // 3. rubric (number) - one per scored rubric dimension
  //    value: { number: score, rubric_id, rubric_label, run_id }
  //
  // 4. failure_modes (choices) - the selected failure-mode tags
  //    value: { choices: [tag...], failure_tags: [tag...], run_id }
  //
  // 5. critique (textarea) - the free-text notes
  //    value: { text: [notes], notes, run_id }
}
```

## 示例输入

界面期望一个任务 `data` 对象，其中包含一个 `run` 字段（或你通过 `runField` 配置的其他字段名）。`run.steps` 中的每个条目都有一个 `kind`（`user`、`reasoning`、`tool_call`、`subagent`、`artifact`、`error` 或 `agent`），以及针对该类型的特定字段。子 Agent 步骤可以携带一个 `children` 数组，用于存放嵌套步骤。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "run": {
      "id": "run_8h3k2lq9",
      "name": "EU AI Act compliance summary - Q3 2025",
      "agent": "research-assistant-v3.2",
      "model": "claude-sonnet-4.5",
      "status": "completed-with-warnings",
      "startedAt": "2026-05-03T14:21:08Z",
      "duration": 78.6,
      "totalTokens": 68420,
      "totalCost": 0.317,
      "turns": 18,
      "toolCalls": 12,
      "subagents": 2,
      "errors": 1,
      "retries": 2,
      "steps": [
        {
          "id": "s1",
          "kind": "user",
          "author": "Maya Okafor",
          "time": "14:21:08",
          "content": "I need a 1-pager on EU AI Act Q3 2025 compliance updates for our legal team. Focus on what changed for foundation model providers since June. Cite primary sources only.",
          "tokens": 56
        },
        {
          "id": "s2",
          "kind": "reasoning",
          "time": "14:21:09",
          "durationMs": 1240,
          "tokens": 412,
          "summary": "Scope the request to Q3 2025, foundation model providers, and primary-source citations. Search first, then delegate legal diff extraction and policy impact review."
        },
        {
          "id": "s3",
          "kind": "tool_call",
          "tool": "web_search",
          "time": "14:21:10",
          "durationMs": 2410,
          "tokens": 88,
          "cost": 0.002,
          "args": {
            "query": "EU AI Act foundation model providers Q3 2025 compliance updates",
            "domains": ["digital-strategy.ec.europa.eu", "eur-lex.europa.eu", "edpb.europa.eu"],
            "recency_days": 120
          },
          "result": {
            "ok": true,
            "results": 8,
            "preview": "8 results from primary-source domains. Top result is an implementing regulation on GPAI obligations."
          }
        },
        {
          "id": "s5",
          "kind": "error",
          "tool": "web_fetch",
          "time": "14:21:15",
          "durationMs": 8200,
          "args": { "url": "https://ec.europa.eu/digital-strategy/news/ai-act-q3-update", "timeout_ms": 8000, "retry": 1 },
          "error": { "code": "TIMEOUT", "message": "Upstream timed out after 8000ms." },
          "retried": true
        },
        {
          "id": "s7",
          "kind": "subagent",
          "name": "legal-analysis",
          "role": "Extract structured changes from primary sources",
          "model": "claude-sonnet-4.5",
          "time": "14:21:27",
          "durationMs": 18740,
          "tokens": 14820,
          "cost": 0.094,
          "summary": "Returned article-level changes with verified citations and a structured obligation table.",
          "children": [
            {
              "id": "s7.2",
              "kind": "tool_call",
              "tool": "extract_legal_diff",
              "args": { "document_id": "reg_impl_2025_1847", "baseline": "reg_2024_1689", "sections": ["Article 53", "Article 55", "Annex XI"] },
              "result": { "ok": true, "changes": 7, "preview": "7 article-level changes; 4 affect GPAI providers." }
            },
            {
              "id": "s7.3",
              "kind": "artifact",
              "title": "Source-backed obligations table",
              "artifactType": "markdown",
              "preview": "| Obligation | Source | Q3 change |\n| --- | --- | --- |\n| Technical documentation | Article 53 | Template fields clarified |"
            }
          ]
        },
        {
          "id": "s9",
          "kind": "artifact",
          "title": "Citation matrix draft",
          "artifactType": "markdown",
          "preview": "| Claim | Citation | Status |\n| --- | --- | --- |\n| Documentation template clarified | EUR-Lex reg_impl_2025_1847 | verified |\n| Enforcement examples updated | Commission news page | needs review |"
        },
        {
          "id": "s12",
          "kind": "agent",
          "time": "14:22:27",
          "durationMs": 1840,
          "tokens": 610,
          "content": "Draft complete: a 1-page Q3 2025 EU AI Act update with three provider obligations, a citation matrix, and a reviewer note for the timed-out Commission page."
        }
        // ... more steps
      ]
    }
  }
}
```

{% enddetails %}

## 示例输出

保存的标注包含最多五个独立的结果，全部附加到同一个 `run` 对象。评分面板中的每个部分都会产生自己的结果，审阅人员留空的任何部分都会被直接省略。

例如（部分 JSON）：

```json
{
  "result": [
    {
      "id": "agent-evaluation-run_8h3k2lq9-step-classification",
      "from_name": "step_classification",
      "to_name": "run",
      "type": "choices",
      "value": {
        "choices": ["correct", "partial", "incorrect"],
        "step_scores": {
          "s2": "correct",
          "s3": "correct",
          "s5": "incorrect",
          "s7": "partial",
          "s9": "correct",
          "s12": "correct"
        },
        "run_id": "run_8h3k2lq9"
      }
    },
    {
      "id": "agent-evaluation-run_8h3k2lq9-verdict",
      "from_name": "verdict",
      "to_name": "run",
      "type": "choices",
      "value": {
        "choices": ["mixed"],
        "verdict": "mixed",
        "run_id": "run_8h3k2lq9"
      }
    },
    {
      "id": "agent-evaluation-run_8h3k2lq9-rubric-faithfulness",
      "from_name": "rubric",
      "to_name": "run",
      "type": "number",
      "value": {
        "number": 4,
        "rubric_id": "faithfulness",
        "rubric_label": "Faithfulness",
        "run_id": "run_8h3k2lq9"
      }
    },
    {
      "id": "agent-evaluation-run_8h3k2lq9-rubric-tool_use",
      "from_name": "rubric",
      "to_name": "run",
      "type": "number",
      "value": {
        "number": 3,
        "rubric_id": "tool_use",
        "rubric_label": "Tool use",
        "run_id": "run_8h3k2lq9"
      }
    },
    {
      "id": "agent-evaluation-run_8h3k2lq9-failure-modes",
      "from_name": "failure_modes",
      "to_name": "run",
      "type": "choices",
      "value": {
        "choices": ["missing_citation", "good_recovery"],
        "failure_tags": ["missing_citation", "good_recovery"],
        "run_id": "run_8h3k2lq9"
      }
    },
    {
      "id": "agent-evaluation-run_8h3k2lq9-critique",
      "from_name": "critique",
      "to_name": "run",
      "type": "textarea",
      "value": {
        "text": ["Strong primary-source grounding for most claims, but one Commission news citation is still unresolved after the web_fetch timeout. Good recovery via EUR-Lex; faithfulness penalized for the unresolved citation."],
        "notes": "Strong primary-source grounding for most claims, but one Commission news citation is still unresolved after the web_fetch timeout. Good recovery via EUR-Lex; faithfulness penalized for the unresolved citation.",
        "run_id": "run_8h3k2lq9"
      }
    }
  ]
}
```
