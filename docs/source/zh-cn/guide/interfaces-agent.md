---
title: Use the Label Studio agent to create an Interface
short: Create with agent
tier: enterprise
type: guide
order: 0
order_enterprise: 142
meta_title: Interfaces
meta_description: "Build custom labeling interfaces with React"
section: "Interfaces"
---

你可以通过两种方式创建 Interfaces。选择你喜欢的任意一种：

* **在 Label Studio 内** —— 使用 Label Studio 开箱即用的 Interface 构建器，提示我们的 agent 来构建并完善你的 Interface。

* **本地开发** —— 安装 [`create-interface-skill`](/skills/interface.html)，并使用你选择的 agent 通过 vibe coding 方式开发一个 Interface，然后将其导入 Label Studio。更多信息请参阅 [在本地开发 Interface](interfaces-local)。

!!! note
    这是构建同一事物的两种独立方式，无论哪种方式，最终得到的 Interface 都是完全相同的；只是编写（authoring）路径不同。

    在 Label Studio Cloud 上，**通过 Agent 创建（Create with Agent）** 和 [本地开发](interfaces-local) 都可用；选择适合你工作流的任意一种。**通过 Agent 创建** 是 Label Studio Cloud 的功能：在自托管或本地部署（on-prem）中它不可用，因此请改用 **本地开发** 来构建你的 Interface。

<iframe width="560" height="315" src="https://www.youtube.com/embed/pdcZ6HDwpiI?si=ZpeuyeKYx71q1vCR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

要开始，请在主菜单中选择 **Interfaces**，然后选择 **创建 Interface > 通过 Agent 创建（Create Interface > Create with Agent）**。

!!! info 提示
    如果你想从一个现有的标注 UI 而不是从空白开始，请选择任意 Interface 旁边的溢出菜单（overflow menu）并选择 **Duplicate（复制）**。从这里你可以编辑该副本。

![Screenshot](/images/interfaces/create-interface.png)

Interface 构建器由以下标签页组成：

| 标签页 | 描述 |
| --- | --- |
| [**Chat（对话）**](#Chat) | 向 Label Studio agent 提供指令，以构建你的自定义界面。 |
| [**Code（代码）**](#Code) | 查看并手动更新在构建会话期间创建的 React 组件。 |
| [**Version navigator（版本导航器）**](#Version-navigator) | 当你通过对话迭代界面时，可以在预览的不同版本之间导航。 |
| [**Preview（预览）**](#Preview) | 你的界面的交互式预览。 |
| [**Input/Output（输入/输出）**](#Input-Output) | 自定义你希望在预览中看到的输入数据，并查看在预览交互时会得到的输出。 |
| [**Config（配置）**](#Config) | 一旦你构建了一个基本的 Interface 版本，就可以使用此标签页来修改界面，而无需通过对话反复迭代。 |
| [**Grid Cell（网格单元格）**](#Grid-Cell) | 如果你在设置中启用了 **构建自定义网格视图（Build custom grid view）**，此标签页会列出每个网格单元格。 |

## Chat

**Chat** 标签页是你与 agent 协作构建 Interface 的地方。

在底部的消息框中，描述你想要的标注 UI。请具体说明：

- 标注者应该看到什么（文本、图像、对话、并排文档等）。
- 他们被要求做什么（选择标签、高亮文本片段、填写表单、对选项排序）。
- 任何领域约束（标签名称、必填字段、规则）。

### 计划模式（Plan mode）

在计划模式下，agent 会展示：

- **问题卡片（Question cards）** —— agent 用来缩小设计范围的多选题。点击适用的选项并提交。
- **计划摘要卡片（A plan summary card）** —— 提议的设计。你可以 **Approve（批准）** 它、**Approve with edits（带修改批准）**（先调整计划文本），或 **Revise（修订）**（发送反馈并让 agent 重新提议）。

一旦计划被批准，agent 就会切换到代码生成。

<img src="/images/interfaces/plan-mode.png" style="max-width: 500px" alt="Screenshot of Plan mode">

### 设置

你可以选择是否要为你的 Interface 构建自定义网格视图。

网格视图允许你添加一个自定义摘要，在网格视图（Grid View）中查看任务时显示在数据管理器（Data Manager）中。从项目设置修改 Interface 时，可以编辑此摘要。

## Code

**Code** 标签页是你查看并手动更新在构建会话期间创建的 React 组件的地方。

## 版本导航器（Version navigator）

当你更新 Interface 时，预览会更新以反映这些更改。你可以使用聊天面板上方的控件在 Interface 的各个版本之间移动：

<img src="/images/interfaces/versions.png" style="max-width: 500px" alt="Screenshot of Versions">

用它来：

- 逐步查看 agent 生成的每个快照以及你手动做的每次编辑。
- 如果后续更改破坏了某些内容，可将预览回滚到更早的版本。
- 选择任何更早的快照作为下一次提示（prompt）的基础。

!!! info 提示
    你导航到的版本仍可编辑 —— 你可以从历史上的任意一点继续完善。

## Preview

每当 agent 编写或编辑代码时，右侧的 **Preview** 会使用当前的示例任务数据重新渲染。像标注者那样在预览中四处点击 —— 如果某些地方看起来不对，请在对话中描述修复方式，agent 会修补代码。

如果代码存在语法或运行时错误，预览窗格中会显示一条错误消息，以便你知道哪里出了问题。

!!! info 提示
    当你与预览交互时，请查看 **Input/Output** 标签页，查看以 JSON 格式呈现的标注输出预览。确保这与你期望的相符。

## 输入/输出（Input/Output）

| 区块 | 描述 |
| --- | --- |
| **Input（输入）** | Interface 读取的输入数据。你可以编辑示例输入，以查看 Interface 在真实数据下的表现。 |
| **Output（输出）** | Interface 产生的输出数据。当你在 **Preview** 标签页中与界面交互时，此区块会自动更新，以 JSON 格式显示输出。 |

## Config

**Config** 标签页允许你调整 Interface 的标注控件。例如，你可以添加或删除选项、更改标签的颜色、调整标签的显示文本等。你所做的更改会反映在预览和代码中。

这些数值也可以在 **Chat** 面板中通过描述你想要做的更改来更新，并且稍后也可以从项目设置中更新。

## Grid Cell

**Grid Cell** 标签页仅在你于设置中启用了 **构建自定义网格视图（Build custom grid view）** 时才会出现。它会列出 Interface 中的每个网格单元格。
