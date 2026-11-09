---
title: Create a project from an Interface
short: Interface projects
tier: enterprise
type: guide
order: 0
order_enterprise: 144
meta_title: Create projects from Interfaces
meta_description: "Create and update projects using Label Studio Interfaces"
section: "Interfaces"
---

一旦你创建了一个 Interface，就可以从中创建一个项目。

!!! note
    每个项目只能使用一个 Interface。但是，你可以自定义 Interface，并在项目设置中切换版本。


## 从 Interface 创建项目

* 从 Interfaces 列表中，点击溢出菜单（overflow menu）并选择 **Create Project（创建项目）**。
* 从 Interface 详情页，选择 **Projects** 标签页并点击 **Create Project（创建项目）**。

| 字段 | 描述 |
| --- | --- |
| **Workspace（工作区）** | 将创建项目的 workspace。你只能为 [共享 Interface](interfaces#Interface-scope) 选择工作区。 |
| **Project Title（项目标题）** | 项目的名称。 |
| **Description（描述）** | 项目的描述。 |

## 每个项目继承了什么

该项目拥有自己的 Interface 代码副本，固定到你选择的版本。

请注意以下几点：

- **后续对 Interface 的编辑不会追溯性地更改现有项目。**

    项目会持续运行其固定的版本，直到有人显式更改版本。你可以从 **项目 > 设置 > 标注界面（Project > Settings > Labeling Interface）** 下的版本选择器执行此操作。
- **配置归属于项目。**

    Interface 暴露的任何可配置选项（标签名称、颜色、显示文本、哪个任务数据字段保存主要内容等）都是按项目存储的。编辑一个项目的配置不会影响任何其他项目，即使是共享相同 Interface 和版本的项目。


## 配置项目的 Interface

对于从 Interfaces 创建的项目，你可以从 **设置 > 标注界面（Settings > Labeling Interface）** 调整 UI。

你从项目上下文中进行的调整只会影响该项目的 Interface，并且不会迭代 Interface 版本。

如果你想迭代 Interface 版本，可以从 [Interface 详情页](interfaces-details) 进行。点击 **Open Interface（打开 Interface）**。

### 源 Interface（Source Interface）

从这里你可以查看有关 Interface 的信息，例如其名称、创建日期，以及你在项目中使用的版本。

使用下拉菜单在版本之间切换。

### Interface 配置

从这里你可以配置标注元素，例如标签名称、颜色和显示文本。

![Screenshot](/images/interfaces/project-settings.png)
