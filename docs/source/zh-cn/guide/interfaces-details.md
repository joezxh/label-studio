---
title: View Interface details
short: Interface details
tier: enterprise
type: guide
order: 0
order_enterprise: 145
meta_title: Interfaces
meta_description: "View, manage, and version custom labeling Interfaces"
section: "Interfaces"
---

Interface 详情页是一个已保存 Interface 的主页。通过它来检查 Interface、编辑它、管理版本，并从中创建项目。

要打开它，请在主菜单中选择 **Interfaces**，然后选择你想要查看的 Interface。

![Screenshot](/images/interfaces/details.png)

## 操作

Interface 详情页的顶部栏提供以下操作：

| 按钮 | 描述 |
| --- | --- |
| [**通过 Agent 迭代（Iterate with Agent）**](interfaces-agent) | 使用 agent 打开界面编辑器。这会打开一个带有界面编辑器和 agent 的新标签页。 |
| [**本地开发（Develop Locally）**](interfaces-local) | 安装 `create-interface-skill` 并与本地编码 agent 协作开发你的 Interface。 |


以及从页面右上角的溢出菜单（overflow menu）：

| 操作 | 描述 |
| --- | --- |
| **Edit（编辑）** | 编辑 Interface 的名称和描述。 |
| **Create Project（创建项目）** | 启动一个新的项目，并固定到 [版本导航器](#Versions) 中当前选定的版本。更多信息请参阅 [在项目中使用 Interface](./interfaces-project.md)。 |
| **Duplicate（复制）** | 创建 Interface 的新副本。 |
| **Delete（删除）** | 删除 Interface。如果有任何项目正在使用该 Interface，则不可使用此操作。 |

!!! info 提示
    模板 Interface 只能通过先复制它们才能使用和编辑。

## 预览（Preview）

**Preview** 区块会使用当前的示例任务数据渲染 Interface，与标注者看到的一模一样。点击各个控件，以确认 Interface 的行为符合你的预期。

!!! info 提示
    预览始终反映 [版本导航器](#Versions) 中当前选定的版本。切换版本以比较 Interface 在其历史不同节点的表现。

## 版本（Versions）

**Preview** 区块的右侧会显示版本列表。

选择一个版本，以将该版本的源码更新到 **Preview**、**Data I/O** 和 **Code** 区块。

你还可以从该版本旁边的溢出菜单管理版本：

| 操作 | 描述 |
| --- | --- |
| **Add Description（添加描述）** | 为版本添加描述。 |
| **Unpublish（取消发布）** | 当你从 Interface 创建项目时，项目经理可以从项目的上下文中切换界面版本。<br /><br />取消发布某个版本会将其从 **项目 > 设置 > 标注界面（Project > Settings > Labeling Interface）** 下的版本列表中隐藏。 |

<img src="/images/interfaces/version-overflow.png" style="max-width: 500px" alt="Screenshot of Version overflow menu">

## 数据 I/O（Data I/O）

**Data I/O** 区块提供关于 Interface 所需输入和预期输出的信息。

使用此区块来确认 Interface 读取你计划导入的任务字段，并产生下游工作流（导出、分析、Prompts）所期望的标注形态。

!!! info 提示
    你可以编辑示例任务数据，以查看 Interface 在真实数据下的表现。

## 项目（Projects）

**Projects** 区块列出当前正在使用此 Interface 的每个项目，以及每个项目固定的版本、创建日期和任务数量。

通过此区块你可以：

- 点击某个项目以直接打开它。
- 点击 **Create Project** 以从该 Interface 启动一个新项目。该项目固定到版本导航器中当前选定的版本。

!!! info 提示
    编辑 Interface 不会追溯更新现有项目。每个项目会持续运行在其固定的版本上，直到你从项目的标注设置中升级它。更多信息请参阅 [在项目中使用 Interface](interfaces-project)。

## 代码（Code）

**Code** 区块显示所选版本的只读 JSX 源码。用它来：

- 在将 Interface 附加到项目之前，审计它实际做了什么。
- 复制代码片段与队友分享，或粘贴到副本中。
- 确认 Interface 暴露了你期望的可选辅助工具（例如 `paramsSchema`、`outputSchema` 或 `GridCell`）。
