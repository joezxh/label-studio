---
title: Workspaces
short: Workspaces
tier: enterprise
type: guide
order: 0
order_enterprise: 101
meta_title: Workspaces
meta_description: An overview of workspaces and actions you can perform with workspaces. 
section: "Create & Manage Projects"
date: 2024-02-05 17:36:34
---

工作区可以帮助你在项目生命周期的不同阶段或用例中组织、分类和管理项目：

* 使用工作区对相关项目进行分组和分类。
* 使用工作区简化项目成员资格管理。当某个用户作为成员被添加到工作区时，他们将有权访问该工作区内的所有项目。他们对项目的权限取决于他们的 [用户角色](admin_roles)。
* 使用工作区来归档项目。

## 创建工作区

!!! note
    要创建新工作区，你的用户角色必须是 Owner（所有者）、Administrator（管理员）或 Manager（经理）。

1. 在 Label Studio 中，点击右侧菜单中 **Workspaces（工作区）** 旁边的加号图标：

    ![添加按钮截图](/images/click-plus-sign.png)

2. 为工作区提供一个名称，并可选地提供颜色。
3. 点击 **Save（保存）**。

你现在可以开始在 [工作区内创建项目](setup_project)。

!!! info 提示
    你还可以通过复制来自不同工作区的现有项目来创建项目。或者，你可以更新 [项目的设置](manage_projects#Move-projects-between-workspaces)，将其从一个工作区移动到另一个工作区。

## 沙盒工作区（Sandbox workspace）

每个用户都有一个个人的沙盒工作区，可用于试验项目设置并熟悉 Label Studio。只有你能看到你沙盒中的项目。

你可以使用沙盒来配置项目并测试你的设置。然后，当你准备好时，你可以将项目移出沙盒，移入其他用户可以访问的工作区。

## 添加或移除工作区成员

当用户被添加到工作区时，他们会自动获得该工作区内任何项目的成员资格。他们在项目中能够看到的操作和信息取决于他们的用户角色。

1. 从工作区中，点击右上角的 **Manage Members（管理成员）**。
2. 使用搜索功能查找你想要添加到工作区的用户。
3. 选中其姓名旁边的复选框，然后点击 `>` 箭头将其添加。点击相反的箭头 `<` 以移除成员。
4. 点击 **Save（保存）**。

用户在被添加到工作区时不会收到通知。当他们登录 Label Studio 或刷新页面时，工作区会显示出来。

## 工作区权限

用户角色在组织级别设置。有关更多信息，请参阅 [用户角色和权限](admin_roles)。

* **Owner 和 Administrator** —— 这些用户可以查看所有工作区，即使他们没有被添加为成员。

    他们还可以查看这些工作区内未发布的项目。唯一的例外是你的沙盒工作区，只有你能看到它。
* **Manager** —— Manager 可以创建工作区。但组织内的其他 Manager 无法查看该工作区，除非他们被添加为成员。

    一旦被添加，Manager 可以查看工作区内的所有项目，包括未发布的项目。
* **Annotator（标注员）** —— 在被添加为成员之前无法查看工作区。

    一旦被添加，他们可以看到所有项目的卡片，但在项目发布且他们有任务要标注之前，无法进入标注流。
* **Reviewer（审核员）** —— 在被添加为成员之前无法查看工作区。

    一旦被添加，他们可以看到所有项目的卡片，但在项目发布且他们有任务要审核之前，无法访问该项目。

## 编辑工作区

你可以归档、删除、重命名以及为工作区选择不同的颜色。点击工作区名称旁边的齿轮图标以查看你的选项：

![工作区菜单截图](/images/project/workspace-edit-modal.png)

要访问这些操作，你的用户角色必须是 Owner（所有者）、Administrator（管理员）或 Manager（经理）。

## 归档工作区

为了减少工作区侧边栏中的杂乱，你可以将工作区从视图中归档，从而让你轻松定位高优先级的标注工作。你仍然可以完全访问已归档的工作区，并且可以随时取消归档。

点击工作区名称旁边的齿轮图标，或者点击工作区旁边的溢出菜单并选择 **Archive（归档）**：

![工作区菜单截图](/images/project/workspace-dropdown-menu.png)

### 查看已归档的工作区并取消归档

要查看已归档的工作区，请展开项目页面侧边栏底部的已归档工作区菜单。

![已归档工作区选项截图](/images/project/workspace-archive-expand.png)

从这里，你可以点击工作区名称旁边的齿轮图标，或者点击工作区旁边的溢出菜单并选择 **Unarchive（取消归档）**：

![已归档工作区选项截图](/images/project/workspace-unarchive-menu.png)

## 删除工作区

只有当工作区没有项目时，你才能删除它。如果你想删除工作区，请首先 [删除项目](manage_projects#Delete-projects) 或将它们 [移动到](manage_projects#Move-projects-between-workspaces) 另一个工作区。

一旦所有项目都被删除，点击工作区名称旁边的齿轮图标并点击 **Delete（删除）**。
