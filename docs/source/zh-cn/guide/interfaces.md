---
title: Interfaces overview
short: Overview
tier: enterprise
type: guide
order: 0
order_enterprise: 141
meta_title: Interfaces
meta_description: "Build custom labeling interfaces with React"
section: "Interfaces"
---

Interfaces 构建器允许你构建高度自定义的标注 UI，以便在你的 Label Studio 项目中使用。

使用 Interfaces，你无需选择模板并调整 [开箱即用的 XML 标签](/tags)，而是描述你想要的体验，Label Studio 就会构建一个完全交互式的、基于 React 的标注 UI，你可以预览、完善、保存并在项目间共享。

<iframe width="560" height="315" src="https://www.youtube.com/embed/pdcZ6HDwpiI?si=ZpeuyeKYx71q1vCR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

!!! note 可用性
    Interfaces 在 Label Studio Enterprise（包括自托管）和 Starter Cloud 中可用。如果你在自托管或本地部署（on-prem）上看不到 Interfaces，请联系你的客户经理为你的组织启用它。

    有两种构建 Interface 的方式：

    - **通过 Agent 创建（Create with Agent）**：产品内置的构建器。仅限 **Label Studio Cloud**。
    - **[本地开发（Develop Locally）](interfaces-local)**：使用你自己的编码 agent 构建，并将结果同步到 Label Studio。在任何部署上都可用。

    在 Label Studio Cloud 上，你可以用任意一种路径，随你喜欢。在自托管或本地部署（包括离线 air-gapped）上，**本地开发是构建 Interfaces 的方式**，因为通过 Agent 创建是一项仅限 Cloud 的功能。

    关于 Interfaces 的其他一切（版本控制、项目、导出）在两条路径上工作方式相同。请参阅 [使用 Agent 创建](interfaces-agent)。

## 何时使用 Interfaces

Interfaces 是 Label Studio 最强大的 UI 构建器。在以下情况下使用它们：

* [Label Studio 的 XML 标签](/tags) 不支持你的用例。例如，如果你想标注没有相应对象标签的数据类型（3D 文件、GEOTiff、DICOM 等）。
* 当你希望能够在 Label Studio 内，或使用你在 Label Studio 之外的自有工具和 agent 来 vibe code 你的标注 UI 时。要与 Claude Code、Codex 或 Cursor 等编码 agent 协作，请安装 [`create-interface-skill`](/skills/interface.html) —— 或查看完整的 [agent skills 概览](/skills/)。
* 当你需要对你的标注 UI 进行版本控制时。
* 当你需要更多自定义逻辑时。

有关 Interfaces 与经典 Label Studio 标签之间的完整比较，请参阅 [Interfaces 与经典标签](#Interfaces-vs-classic-tags)。


## 项目与功能集成

一旦保存，你就可以使用该 Interface 创建新项目（受工作区范围限制 —— 请参阅 [Interface 范围](#Interface-scope)）。该项目使用 Interface 来渲染标注 UI。

由于标注仍然存储为常规的 Label Studio 结果，标准的审查工作流和导出仍然有效。

| 功能 | 说明 |
|---------|-------|
| **Prompts** | Interface 的输出 schema 指导 Prompts 如何将 LLM 的结构化响应转换为 Label Studio 标注，以便你可以预标注任务并由人工审查。 |
| **一致性（Agreements）** | 你可以像对待任何其他任务一样查看和探索一致性。<br/>但是，你无法自定义按控件标签划分的一致性指标。 |
| **分析（Analytics）** | 你可以使用仪表板来可视化标注和审查工作，就像对待任何其他 Label Studio 项目一样。 |
| **项目设置** | 在配置带有 Interface 的项目时，项目设置没有变化或限制。 |
| **插件（Plugins）** | Interfaces 不支持插件。相反，你可以直接在 Interface 代码中包含插件类型的功能。 |
| **XML 标签** | Interfaces 不纳入经典的 XML 标签，也无法与经典的 XML 标注界面组合。 |

## Interfaces 与经典标签

| 功能 | 经典 XML 标签 | Interfaces |
| --- | --- | --- |
| 格式 | XML 标签库 | React / agent 生成的代码 |
| 如何构建 | 配置 XML 或选择模板 | 通过 Label Studio agent 或带有 skills 的编码 agent 进行自然语言提示 |
| 迭代速度 | 中等 | 极快（提示 → 完善 → 发布） |
| 多模态支持 | 支持，但受限 | 完全灵活，并支持传统 XML 标签不支持的数据（3D 数据、geotiff 等） |
| 业务逻辑 | 通过插件实现，作为挂接到配置的独立代码 | 直接写入 Interface 组件 |
| AI 自动化 | 通过 ML 后端连接模型 | ML 后端、原生模型集成，在 Prompts 中支持 LLM-as-a-judge 预标注或评估 |
| 跨项目可复用性 | 配置是项目级的；复用意味着复制和漂移 | Interfaces 是一等对象 —— 无需复制即可移植到任何项目 |
| 版本控制 | 有限 | 内置版本历史记录，支持一键回滚 |
| 访问控制 | 项目级 | Interface 本身上的工作区级或项目级访问 |
| 后端集成 | 是 | 是 |
| Agent 兼容性 | 否 | 是（Label Studio agent 或选择你自己的） |
| 护栏（Guardrails） | 标签库强制兼容性 | Agent 与你的生产环境分离运行 |

## Interface 范围

有模板 Interface、共享 Interface，以及限定到特定工作区的 Interface。

模板 Interface 是开始的最快方式；共享和工作区范围让团队能够在共享的一组标注体验上实现标准化。

| 范围        | 谁可以看见它                          | 谁可以编辑它                                  |
|--------------|-----------------------------------------|--------------------------------------------------|
| **模板（Templates）**   | 你组织中的每个人          | 无人 —— 由 HumanSignal 维护，只读。但是，你可以复制一个系统 Interface 并编辑该副本。 |
| **共享（Shared）**   | 你组织中的每个人           | 任何具有适当 [权限](#User-access) 的人          |
| **工作区（Workspace）**| 仅所选工作区的成员    | 所有者和管理员，或是该工作区成员的经理                        |

请注意以下几点：

- **模板 Interface 是只读的。** 你不能修改或删除 HumanSignal 提供的模板 —— 请先复制它并编辑副本。

- **范围更改是结构性的。** 在共享范围和工作区范围之间移动 Interface 可能会改变谁能够使用它来创建新项目。


## 安全性

### 用户访问

| 角色 | 访问 |
|------|--------|
| **所有者和管理员（Owners and Admins）** | 可以为任何工作区创建和编辑共享 Interface |
| **经理（Managers）** | 可以为他们是成员的任何工作区创建和编辑共享 Interface |
| **标注者和审查者（Annotators and Reviewers）** | 无权访问 Interfaces 功能 |

### 管理控制

你可以为你的组织启用或禁用创建和编辑 Interfaces 的能力。更多信息请参阅 [Interfaces 设置](admin-interfaces)。

### 沙箱化

Interfaces 作为渲染在 Label Studio 编辑器外壳（shell）内部的沙箱模块运行。为了保持它们的安全、可移植且易于升级，运行时强制执行一个狭窄的契约：

- **仅 React 源码，默认封闭。** 代码使用 `React` 和标准 hooks（`useState`、`useRef`、`useEffect`、`useCallback`、`useMemo`）外加一个小的 `getField` 辅助函数运行。你不能在源码中 `import` npm 包。你 *仍然* 可以通过 **将其打包进 Interface** 或 **从你允许列表的主机加载** 来使用第三方库。请参阅 [使用外部库与服务](interfaces-libraries)。
- **带有 JSX 的纯 JavaScript。** 没有 TypeScript，没有类型注解，没有 `import` / `export` 语句。该模块在运行时被编译和评估，并且必须暴露一个默认组件以及可选的辅助函数（`getResults`、`parseResults`、`outputSchema`、`inputSchema`、`paramsSchema`、`GridCell`）。
- **默认无网络访问。** 开箱即用时，Interface 只能访问你的 Label Studio 服务器。要让它调用外部服务（例如 ML 后端），所有者/管理员必须在 **组织 > 设置 > Interfaces → API origins** 下将该来源加入允许列表。请参阅 [使用外部库与服务](interfaces-libraries)。
- **有限的持久化。** 状态仅在标注会话的期间存在。任何你想要保留的内容都必须通过标注结果返回。
