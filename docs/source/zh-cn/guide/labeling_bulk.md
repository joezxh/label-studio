---
title: Bulk labeling
short: Bulk labeling
tier: enterprise
type: guide
order: 0
order_enterprise: 137
meta_title: Bulk Labeling
meta_description: Bulk labeling in Label Studio
section: "Create & Manage Projects"
parent: "labeling"
parent_enterprise: "labeling"
date: 2025-05-24 17:19:21
---

当你有一大批共享相同标签或标注、想要一次性应用的任务时，批量标注（Bulk labeling）非常有用。例如：

* **数据分类**：快速用同一类别标注多个任务。
* **筛选与分组**：使用筛选器隔离符合特定条件的任务（例如，你知道都是“已批准”的任务），然后批量标注它们。
* **速度与一致性**：避免对可以放心共享标签的项目进行重复标注。

## 支持的数据类型

批量标注支持所有数据类型（例如图像、文本、音频、视频）。

## 支持的用户角色

只有处于审查者（Reviewer）、经理（Manager）、管理员（Admin）或所有者（Owner）角色的用户才能使用数据管理器（Data Manager）中可用的批量标注操作。

!!! info 提示
    处于标注者（Annotator）角色的用户仍然可以使用 [插件启用的批量标注操作](/plugins/bulk_labeling)。

## 支持的标注任务

批量标注支持分类任务和文本区域（text area）输入。

你可以使用任何受支持的控制标签（control tags）组合，并且所有对象标签（object tags，例如 `<Image>`、`<Text>`、`<Video>`）都受支持。

可以通过以下批量标注操作分配的控件标签：

* [Choices](/tags/choices.html)
* [DateTime](/tags/datetime.html)
* [Number](/tags/number.html)
* [Rating](/tags/rating.html)
* [Taxonomy](/tags/taxonomy.html)
* [TextArea](/tags/textarea.html)

如果你的标注配置包含上述未列出的控件标签，则无法使用 **批量标注** 操作。

!!! note 限制
    请注意以下几点：
    * 目前仅支持全局分类任务。这意味着控件标签不能启用 `perItem` 或 `perRegion`。
    * 对于通过批量标注选项执行的标注，不会计算前置时间（lead time）。

## 批量标注面板

当你执行批量标注时，你的选项会在一个侧边面板中打开。请注意，你可以根据需要点击展开/折叠图标或按 `shift` + `.` 来展开或折叠此面板。

![Gif opening and closing bulk label drawer](/images/label/bulk-expand.gif)

## 列表视图

你可以从数据管理器的列表视图执行批量标注。如果你想使用筛选器来标注结果的子集，这尤其有用。

选中你想要标注的任务旁边的复选框，然后点击 **标注 *n* 个任务（Label *n* Tasks）** 旁边的下拉菜单。选择 **批量标注（Bulk label）**。这会打开一个包含你的标注选项的面板（见 [上文](#Bulk-labeling-panel)）。

![Screenshot of Bulk label option from List view](/images/label/bulk-list-view.png)

做出你的选择并点击 **提交（Submit）**。

## 网格视图

你可以使用网格视图直观地检查，然后选择任务进行批量标注。

要从网格视图中选择任务，你可以点击它们旁边的复选框，或打开每一个并在浏览时选择任务。

![Gif showing selecting images in grid view](/images/label/bulk-grid-navigating.gif)

一旦选中，点击 **标注 *n* 个任务（Label *n* Tasks）** 旁边的下拉菜单。选择 **批量标注（Bulk label）**。这会打开一个包含你的标注选项的面板（见 [上文](#Bulk-labeling-panel)）。

!!! info 提示
    有用于选择任务、滚动、缩放和在任务之间导航的快捷键。要查看可用快捷键列表，请点击任务上方的帮助图标：

    ![Screenshot highlighting help icon](/images/label/bulk-hotkeys.png)
