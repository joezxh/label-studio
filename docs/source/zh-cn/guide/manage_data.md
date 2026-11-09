---
title: 在项目中使用数据管理器
short: 数据管理器
type: guide
tier: all
order: 122
order_enterprise: 122
meta_title: 在项目中使用数据管理器
meta_description: 为你的标注项目管理、筛选和排序项目数据。
section: "创建与管理项目"
parent: "manage_projects_lso"
parent_enterprise: "manage_projects"
---

数据管理器页面是你查看所有标注任务、排序和筛选数据、导入和导出数据，以及执行与任务相关的各种操作的地方。

有关设置项目的信息，请参阅[创建和配置项目](setup_project)。

<div class="opensource-only">

![数据管理器截图](/images/project/dm-community.png)

</div>

<div class="enterprise-only">

![数据管理器截图](/images/project/dm-enterprise.png)

</div>

数据管理器中的每一行都代表你数据集中的一个标注任务。

<div class="enterprise-only">

## 任务状态

随着你对任务执行操作，每个任务会经历一系列状态。有关更多信息，请参阅[项目与任务状态管理](project_states)。

</div>

## 筛选或排序项目数据

借助筛选条件和标签页，你可以将数据拆分为不同的部分，由不同的标注人员进行标注；或者按照预测得分或数据中的其他值，以特定顺序排列数据以执行标注。

在你标注之前筛选或排序数据时，你会修改标注时看到的任务以及任务的顺序。虽然[任务采样](https://labelstud.io/guide/start#Set-up-task-sampling-for-your-project) 影响整个项目的任务顺序且无法更改，但筛选和排序任务可以随时更改。

<img src="/images/data-manager-filters.png" class="gif-border">

<div class="opensource-only">

!!! error Enterprise
    在 Label Studio 企业版和 Starter Cloud 中，你可以针对标注结果使用高级筛选。有关更多信息，请参阅我们的[企业版文档](https://docs.humansignal.com/guide/manage_data#Filter-annotation-results)。

</div>

<div class="enterprise-only">

### 筛选标注结果

你可以根据任务的标注结果进行筛选。在筛选列表中，在 **Annotations（标注）** 下从你的标注配置中选择一个控件标签，然后选择要查找的值。如果项目包含预测，其控件标签也会列在 **Predictions（预测）** 下。

**Annotations（标注）** 下对控件标签的筛选附带一个 **Annotators（标注人员）** 子筛选，因此你只能查看特定标注人员的标注。有关更多信息，请参阅[使用子筛选](#Use-child-filters)。

!!! note
    在 Label Studio 社区版中，`Annotation results（标注结果）` 筛选是对任务所有标注的非结构化文本搜索，因此你无法按控件标签的值进行筛选。

支持以下标签：
- 所有 `Labels` 标签（例如 `Labels`、`ParagraphLabels` 等）
- `Choices`
- `Taxonomy`
- `Rating`

**已知限制：**
- 使用 `apiUrl` 加载的[分类法](/templates/taxonomy) 将不会被检测。

### 使用子筛选

子筛选允许你根据必须全部适用于_同一个_标注、审核或预测的条件来筛选任务，而不是针对任务整体。例如，你可以查找由特定标注人员完成且被接受的标注任务，而不是一个标注匹配一个条件、另一个标注匹配另一个条件的任务。

**Annotations（标注）** 和 **Predictions（预测）** 下的控件标签筛选，以及 **Reviews（审核）** 下的筛选，都可以有子筛选。要添加一个子筛选，请在筛选条件下选择 **Add Child Filter（添加子筛选）**。**Task（任务）** 下的 **Annotation results（标注结果）** 字段是文本搜索，没有子筛选。

#### 示例：查找标注人员选择了某个标签的任务

查找特定标注人员选择了特定标签的任务：

1. 在 **Annotations（标注）** 下为你的控件标签添加一个筛选，例如 **annotations > sentiment**。选择 **is（是）** 并选择 **Negative（负面）**。
2. 在随附添加的 **Annotators（标注人员）** 子筛选中，选择 **is any of（是以下任一）** 并选择该标注人员。

<img src="/images/data-manager-filters-lse.png" class="gif-border">

两个条件都适用于同一个标注。另一个标注人员选择了 **Negative（负面）** 的任务不会匹配。

#### 示例：查找审核人员最近的拒绝记录

查找特定审核人员在给定日期之后拒绝标注的任务：

1. 在 **reviews > Reviewed by（审核人）** 上添加一个筛选，选择 **is any of（是以下任一）**，并选择该审核人员。
2. 选择 **Add Child Filter（添加子筛选）**，然后将 **Review result（审核结果）** 设置为 **is any of（是以下任一）** 并选择 **Rejected（已拒绝）**。
3. 再次选择 **Add Child Filter（添加子筛选）**，然后将 **Reviewed at（审核时间）** 设置为 **is after（晚于）** 并选择日期。

<img src="/images/data-manager-child-filters.png" class="gif-border">

所有三个条件都适用于同一次审核。该审核人员较早的拒绝记录，或其他人最近的拒绝记录，都不会匹配。

</div>

### 示例：优先标注新数据

按日期对项目中的数据进行排序，以优先标注最新数据。

1. 在一个项目中，将数据的 **Order（排序）** 从默认更改为 **Created at（创建时间）**。
2. 将条目的顺序更新为升序，使最新条目显示在最前面。
3. 选择 **Label Tasks As Displayed（按显示顺序标注任务）**，以从新到旧开始标注任务。

### 示例：按预测得分排序

如果你上传了带有预测得分的[预标注数据](predictions.html)，或者你的[机器学习后端](ml.html) 在模型输出中产生了预测得分，你可以按预测得分对项目中的数据进行排序。

1. 在一个项目中，将数据 **Order（排序）** 的默认设置更改为使用 **Prediction score（预测得分）** 字段。
2. 将条目的顺序更新为升序或降序，以基于较高置信度或较低置信度的预测进行标注。
3. 选择 **Label Tasks As Displayed（按显示顺序标注任务）**，以按预测得分顺序开始标注任务。
你也可以使用[任务采样](https://labelstud.io/guide/start#Set-up-task-sampling-for-your-project) 来使用预测得分排序。

### 示例：使用标签页和筛选条件拆分数据集

如果你想标注一个大型数据集，你可能希望使用标签页和筛选条件将其拆分为较小的部分，并为不同的标签页分配不同的标注人员。在 Label Studio 社区版中，你无法将标注人员分配到特定任务，但你可以在特定标注人员之后重命名标签页，以此作为使用标签页基本分配任务的方式。

例如，你可能将一个包含 300 张图像的数据集拆分为 3 个不同的标签页，并让不同的标注人员专注于每个标签页：
1. 在一个项目中，创建一个筛选条件，其中 **ID** 字段 **is between（介于）** 值 "1" 和 "100" 之间。点击筛选条件之外以查看该标签页上已筛选的条目。
2. 点击标签页的竖省略号并选择 **Rename（重命名）**。以你希望专注于该标签页条目的特定标注人员命名。
3. 点击 **+** 图标创建一个新标签页。点击新标签页的竖省略号并选择 **Rename（重命名）**，以第二个标注人员的名字命名。
4. 在新标签页上，创建一个筛选条件，其中 **ID** 字段 **is between（介于）** 值 "101" 和 "200" 之间。点击筛选条件之外以查看该标签页上已筛选的条目。
5. 点击 **+** 图标创建一个新标签页。点击新标签页的竖省略号并选择 **Rename（重命名）**，以第三个标注人员的名字命名。
6. 在新标签页上，创建一个筛选条件，其中 **ID** 字段 **is between（介于）** 值 "201" 和 "300" 之间。点击筛选条件之外以查看该标签页上已筛选的条目。
7. 任何标注人员都可以登录并导航到与其工作相关的标签页，然后点击 **Label（标注）** 按钮，开始标注其标签页上的任务子集。

## 将筛选条件保存为标签页

你可以在数据管理器上创建标签页，以[拆分数据集](#Example-Split-a-dataset-using-tabs-and-filters) 进行标注，按状态（已标注、已预测、未标注）或其他原因分离任务。

你创建的标签页取决于你的[标注配置设置](setup.html)，因为标注配置定义了可用于筛选和排序的数据字段。

!!! note
    如果你对标注配置进行更改，数据管理器中的任何标签页都会被移除。请务必在完成项目设置之后再在数据管理器中设置复杂的标签页。

<div class="enterprise-only">

## 将标注人员分配到任务

在 Label Studio 企业版中，如果你是管理员或项目经理，你可以将标注人员分配到特定项目中的任务。在[将标注人员添加到项目或工作区](setup_project.html#Add-members-to-a-project) 之后，将标注人员分配到特定任务。如果你使用的是[手动任务分配](setup_project.html#Set-up-task-distribution-for-labeling)，则必须将标注人员分配到任务。

1. 对于特定项目，在数据管理器上选择任务。
2. 选择下拉菜单并选择 **Assign Annotators（分配标注人员）**。
3. 选择标注人员的名称并点击 `>` 箭头将其分配到所选任务。
4. 点击 **Assign（分配）**。

如果你想批量分配任务，可以使用筛选条件精确识别要分配的任务，然后选择数据管理器上的顶部复选框以选中显示的所有任务，并将其分配给某个标注人员。

</div>

## 删除任务或标注

如果你有重复的任务，或者想删除标注，可以从 Label Studio 中删除任务和标注。

1. 在 Label Studio UI 中，打开你要更新的项目。
2. 筛选数据管理器页面，仅显示你要删除的数据。例如，特定的标注，或由特定标注人员标注的任务。
3. 选择要删除的任务或标注的复选框。
4. 选择带有任务数量的下拉菜单，并选择 **Delete tasks（删除任务）** 或 **Delete annotations（删除标注）**。
5. 点击 **Ok（确定）** 以确认你的操作。

如果你想更改标注界面或执行其他类型的数据标注，请先选择数据集的所有标注并删除这些标注。

<div class="enterprise-only">

## 一致性列

数据管理器中的一致性列反映了标注人员在某项任务上的共识。有关一致性及其计算方式的更多信息，请参阅[任务一致性](stats)。

你将在数据管理器中看到以下一致性列：

* **Agreement（一致性）** - 这是该任务的总体一致性。

    它计算为特定任务所有控件标签之间的一致性得分的平均值。请参阅[总体一致性](stats#Overall-agreement)。
* **[控件标签] agreement（一致性）** - 每个控件标签都有自己的得分。

    控件标签一致性的计算方式取决于你的项目设置方式。请参阅[每个控件标签的一致性](stats#Per-control-tag-agreement)。

![截图](/images/review/agreement-dm.png)

### 标注人员和模型

点击任何一致性列以选择你希望用于一致性计算的特定标注人员和模型。

![截图](/images/review/agreement-dm-modal.png)

默认情况下，所有标注人员（而非模型）都被选中用于一致性计算。

但是，你可以自定义此设置以选择标注人员、模型或模型与标注人员的子集进行比较。

例如，如果你有 10 名标注人员并选择了 3 名，则总体一致性得分和控件标签一致性得分将重新计算以仅反映你的选择。

!!! note
    你必须至少选择两项进行比较。

    你的选择将应用于数据管理器中的所有一致性列。你无法为不同的一致性列选择不同的标注人员和模型。

### 真值匹配

如果你的项目包含真值标注，你可以使用此选项将单个标注人员或单个模型与真值标注进行比较。

Label Studio 将应用你为项目配置的任何一致性指标和方法，但会将计算限制在所选标注人员或模型以及标记为真的标注上。

<img src="/images/review/agreement-dm-gt.png" class="gif-border" style="max-width:679px">

### 一致性弹出框

点击任何一致性列以查看一个弹出框，其中包含有关所用指标和方法的的信息。

如果你使用的是 **Pairwise（成对）** 方法，你将看到所选标注人员和模型的一致性得分明细。

<img src="/images/review/agreement-dm-popover.png" class="gif-border" style="max-width:600px">

</div>
