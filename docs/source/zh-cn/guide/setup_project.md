---
title: 创建和配置项目
short: 创建项目
type: guide
tier: all
order: 104
order_enterprise: 104
section: "创建与管理项目"
meta_title: 设置你的标注项目
meta_description: 在 Label Studio 中设置数据标注和注释项目，为你的机器学习和数据科学项目生成高质量数据。
---

Label Studio 中的所有标注活动都是在项目的上下文中进行的。

## 项目设置工作流

<div class="opensource-only">

在[启动 Label Studio](/guide/start) 并[创建账户](/guide/signup) 之后，创建一个项目以开始标注你的数据。

1. **[创建一个项目](#Create-a-project)**。
2. **[将数据导入 Label Studio](/guide/tasks)**。

    对于小型项目、测试或概念验证工作，你可以通过 UI 直接将本地文件导入 Label Studio。你可以在项目创建工作流中执行此操作。

    但是，对于较大的项目，我们建议设置云存储。你需要先创建项目，然后从项目设置中添加存储。有关更多信息，请参阅[从外部存储同步数据](/guide/storage)。

3. **[自定义你的标注界面](/guide/setup)**。

    我们建议你从预配置的模板开始并对其进行修改，但你也可以使用我们的[标签库](/tags) 创建自己的自定义模板。

4. **[配置项目设置](/guide/project_settings)**。

    最后，你可以配置可选设置，例如任务采样和标注说明。

</div>

<div class="enterprise-only">

1. **[创建一个项目](#Create-a-project)**。
2. **[将数据导入 Label Studio](/guide/tasks)**。

    对于小型项目、测试或概念验证工作，你可以通过 UI 直接将本地文件导入 Label Studio。你可以在项目创建工作流中执行此操作。

    但是，对于较大的项目，我们建议设置云存储。你需要先创建项目，然后从项目设置中添加存储。有关更多信息，请参阅[从外部存储同步数据](/guide/storage)。

3. **[自定义你的标注界面](/guide/setup)**。

    我们建议你从预配置的模板开始并对其进行修改，但你也可以使用我们的[标签库](/tags) 创建自己的自定义模板。

    如果已启用，你可以先向 Label Studio [AI 助手](/guide/ask_ai) 描述你的需求，让它代你生成 XML。

4. **[配置项目设置](/guide/project_settings_lse)**。

    接下来，你将需要配置标注人员和审核人员可以看到的信息，以及你希望他们的工作流自动化程度。

    默认情况下，任何作为项目成员的用户都可以在项目发布后立即开始标注，并且每个任务只需要一名标注人员即可视为完成。要自定义此设置，请参阅[项目设置的 **Annotation（标注）** 部分](/guide/project_settings_lse#Annotation)。

    默认情况下，审核人员无需被分配到已完成的任务，并且每个任务只需要一个被接受的标注。要自定义此设置，请参阅[项目设置的 **Review（审核）** 部分](/guide/project_settings_lse#Review)。

5. **[将成员添加到你的项目或工作区](#Add-members-to-a-project)**。

    具有 Owner（所有者）和 Admin（管理员）角色的用户可以看到所有项目。但是，Manager（经理）、Annotator（标注人员）和 Reviewer（审核人员）角色的用户必须先被添加到项目[或其父工作区](/guide/workspaces) 才能访问它。

6. **[发布你的项目](#Publish-project-to-annotators)**。

    Manager 角色的用户如果是该项目的成员，则可以看到未发布的项目。但是，Annotator 或 Reviewer 角色的用户在项目实施发布之前无法看到或访问它。

</div>

## 创建一个项目

在 Label Studio 中，点击右上角的 **Create Project（创建项目）**。将打开一个包含三个标签页的窗口：

<dl>

<dt>Project Name（项目名称）</dt>

<dd>

这是唯一必需的栏目。

在此处选择你的工作区，输入项目名称，并（可选）输入项目描述。

完成后，你可以点击 **Save（保存）** 来创建项目，也可以完成其他标签页。

</dd>

<dt>Data Import（数据导入）</dt>

<dd>

从这里，你可以将文件上传到 Label Studio。你可以现在执行此操作，也可以在项目创建之后执行。

对于较大的项目，我们建议设置云存储或使用其他导入方法。有关更多信息，请参阅[将数据导入 Label Studio](/guide/tasks) 和[从外部存储同步数据](/guide/storage)。

</dd>

<dt>Labeling Setup（标注设置）</dt>

<dd>

你可以选择一个模板来开始你的标注配置。为便于设置，请选择一个[模板](/templates)。你稍后可以根据需要自定义模板。请参阅[配置标注](/guide/setup)。

你可以现在执行此操作，也可以在项目创建之后执行。

</dd>

</dl>

完成后，点击 **Save（保存）**。

<div class="opensource-only">

!!! error Enterprise
    Workspaces（工作区）仅适用于 Label Studio 企业版用户。Label Studio 企业版还包含许多额外的项目配置选项，例如基于角色的访问控制和流程自动化。有关更多信息，请参阅[社区版与企业版功能对比](/guide/label_studio_compare)。

</div>

<div class="opensource-only">

## 为你的项目设置标注设置

在用户开始标注之前，你可以设置以下几项：

* [数据标注人员说明](/guide/project_settings#Instructions)

    你还可以选择在用户进入标注流时（标注流是指用户点击 **Label All Tasks（标注所有任务）** 时）以弹出消息的形式显示这些说明。

* [任务采样](/guide/project_settings#General)

    任务采样决定了任务在标注流中展示给用户的顺序。默认使用顺序采样，即用户看到的顺序与数据管理器中的排序相同。你可以将其更改为以随机顺序显示任务。

从数据管理器，点击右上角的 **Settings（设置）**。你也可以从每个项目的溢出菜单访问设置：

![项目溢出菜单截图](/images/project/project_menu_oss.png)

有关所有可用设置的更多信息，请参阅[项目设置](/guide/project_settings)。

## Label Studio 存储你的项目数据和配置的位置

Label Studio 中的所有标注活动都是在项目的上下文中进行的。

从 1.0.0 版本开始，Label Studio 将你的项目数据和配置存储在 SQLite 数据库中。你可以选择改用 PostgreSQL。请参阅[设置数据库存储](/guide/storedata)。

在早于 1.0.0 的 Label Studio 版本中，当你首次启动 Label Studio 时，它会从一个由 Label Studio 创建的项目目录启动，默认名为 `./my_project`。

`label-studio start ./my_project --init`

</div>

<div class="enterprise-only">

## 配置高影响设置

按设计，Label Studio 具有高度可定制性，项目有许多配置选项。要配置项目设置，请打开一个项目并点击右上角的 **Settings（设置）**。

为避免不知所措，请重点关注以下设置。它们对你的标注体验影响最大。

#### 标注设置

标注人员是为项目任务进行标注的用户。

* **Distribute labeling tasks（分配标注任务）**

    位于 **Annotation（标注）** 下，这决定了标注人员是否必须被手动分配到某个任务才能对其进行标注。

    如果你使用的是自动分配（Auto distribution），项目成员可以在项目发布后立即开始标注。否则，他们必须被手动分配。

* **Allow empty annotations（允许空标注）**

    位于 **Annotation（标注）** 下，这决定了标注人员是否可以在不先添加标签的情况下完成任务。

    默认情况下，允许标注人员提交空标注。你可以更改此设置，使所有任务都需要一个标签。

* **Annotations per task minimum（每个任务的最少标注数）**

    （这仅在你使用自动分配时适用）。

    位于 **Quality（质量）** 下，这决定了在任务被视为完成之前必须有多少名标注人员提交任务。

    默认情况下，每个任务只需要一名标注人员提交。你可以配置更高的任务重叠度，即每个任务在被认为完成之前必须具有最少数量的标注人员。

有关标注人员可用的所有设置的说明，请参阅[项目设置 - Annotation（标注）](/guide/project_settings_lse#Annotation) 和[项目设置 - Quality（质量）](/guide/project_settings_lse#Quality)。

有关自动任务分配的简要概述，请参阅以下视频：

<iframe width="560" height="315" src="https://www.youtube.com/embed/b1_o-yhT1uY?si=NspgI-rWwE6l7ZIN" title="YouTube 视频播放器" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

#### 审核设置

审核人员是审核标注人员提交内容是否准确的用户。

* **Task is reviewed after at least one accepted annotation（至少一个被接受的标注后任务即被审核）** 或
**Task is reviewed after all annotations are reviewed（所有标注都被审核后任务才被审核）**

    配置什么操作决定任务已被审核。默认情况下，审核人员只需要接受任务的一个标注。你可以更改此设置，使审核人员必须接受或拒绝来自所有标注人员的提交。

* **Review only manually assigned tasks（仅审核手动分配的任务）**

    默认情况下，只要有可审核的已标注任务，审核人员就可以开始审核。但是，你可以更改此设置，使审核人员必须被手动分配到任务。

有关审核人员可用的所有设置的说明，请参阅[项目设置 - Review（审核）](/guide/project_settings_lse#Review)。

## 将成员添加到项目

你可以通过两种方式将成员添加到项目：
* [在工作区级别添加成员](/guide/workspaces#Add-or-remove-workspace-members)。工作区成员资格由项目继承。
* 在项目级别添加成员。

要将成员添加到特定项目：

1. 导航到项目设置并选择 **Members（成员）**。
2. 使用搜索功能找到要添加到项目的用户。
3. 选中其姓名旁边的复选框，然后点击 `>` 箭头将其添加。点击相反的箭头 `<` 以移除成员。
4. 如果用户的组织级角色是 Annotator（标注人员）或 Reviewer（审核人员），你可以使用下拉菜单为他们分配特定于此项目的角色。

    项目级角色为 Annotator（标注人员）或 Reviewer（审核人员）。因此，例如，一个用户可以在一个项目中是 Annotator，而在另一个项目中是 Reviewer。

5. 点击 **Save（保存）**。

当用户被添加到项目时，不会收到通知。

有关更多信息，请参阅[项目设置 - Members（成员）](/guide/project_settings_lse#Members)。

## 发布项目

你可以向标注人员隐藏项目，以便在任何人开始标注之前完全配置项目。当你准备好让标注人员开始标注时，请发布项目。

要发布项目，请点击页面顶部面包屑导航中的暂停图标：

![发布项目截图](/images/project/publish.png)

你可以稍后通过点击面包屑导航中的播放图标来取消发布项目。

</div>
