---
title: Manage projects in Label Studio Enterprise
short: Manage projects
tier: enterprise
type: guide
order: 0
order_enterprise: 116
meta_title: Manage projects in Label Studio Enterprise
meta_description: A description of various project management actions available.
section: "Create & Manage Projects"
---

更多项目操作，请参阅：

* [创建项目](setup_project#Create-a-project)
* [向项目添加成员](setup_project#Add-members-to-a-project)
* [发布项目](setup_project#Publish-a-project)
* [为项目任务分配标注者](manage_data#Assign-annotators-to-tasks)

你可以使用 **所有项目（All Projects）** 页面查看所有工作区中的项目。

![Screenshot of the All Projects page](/images/project/projects_page.png)

## 搜索项目

使用右上角的搜索框。你可以按项目名称搜索。

* 要在某个工作区内搜索，请使用该工作区页面上的搜索字段。
* 要跨所有项目搜索，包括已归档工作区中的项目，请前往 **所有项目（All Projects）** 执行搜索。

项目搜索允许部分匹配且不区分大小写。

## 项目状态

项目状态会反映在项目页面上以及查看项目时顶部栏中。例如，**准备发布（Ready to Publish）**、**标注中（Annotating）**、**已完成（Done）**。

有关项目状态的更多信息，请参阅 [项目与任务状态管理](project_states)。

## 创建项目模板

项目模板包含以下内容：

* 标注配置
* 大部分项目设置

它不包含：

* 项目任务或导入的数据
* 项目成员设置
* 任务分配
* 外部存储设置

要创建项目模板：

1. 在你想要用作模板的项目中，打开 **设置（Settings）**。
2. 在项目设置的 **常规（General）** 标签页中，点击 **另存为模板（Save as Template）**。
3. 为项目添加标题和描述。
4. 点击 **保存（Save）**。

这些模板随后会出现在项目创建流程中模板画廊（Template Gallery）的 **Label Studio Enterprise 模板（Label Studio Enterprise Templates）** 部分下。

## 复制项目

当你复制一个项目时，你可以复制以下内容：

* 标注配置
* 大部分项目设置
* 项目成员设置
* 项目任务或上传的数据（可选）

复制不包括：

* 任务分配
* 已完成的标注
* 外部存储设置

要复制一个项目：

1. 点击项目的溢出菜单（overflow menu）并选择 **复制项目（Duplicate project）**：

    <img src="/images/project/project_menu_lse.png" style="max-width: 500px" alt="Screenshot">

2. 选择新项目所在的工作区。
3. 输入新项目的名称，并（可选）输入描述。
4. 选择是仅复制项目设置（包括标注配置），还是同时包含任务。
5. 点击 **复制（Duplicate）**。

你可能需要刷新页面才能看到新项目。

## 在工作区之间移动项目

1. 打开项目并点击右上角的 **设置（Settings）**。
2. 在 **常规（General）** 标签页下，使用 **工作区（Workspace）** 下拉菜单选择新的工作区。
3. 点击 **保存（Save）**。

## 发布项目

你可以向标注者隐藏项目，以便在任何人开始标注之前完全配置项目。当你准备好让标注者开始标注时，发布该项目。

要发布项目，请点击页面顶部面包屑导航中的暂停图标：

![Screenshot of publish project](/images/project/publish.png)

你稍后可以通过点击面包屑导航中的播放图标来取消发布该项目。

## 固定项目

要固定一个项目，请点击项目的溢出菜单并选择 **固定项目（Pin project）**：

<img src="/images/project/project_menu_lse.png" style="max-width: 500px" alt="Screenshot">

被固定的项目会置顶显示在“项目”页面上。

## 删除项目

要删除一个项目，请打开项目设置并选择 **危险区域（Danger Zone）** 页面。从这里你可以访问 **删除项目（Delete Project）** 操作。

删除项目会从 Label Studio 中永久移除所有任务、标注和项目数据。
