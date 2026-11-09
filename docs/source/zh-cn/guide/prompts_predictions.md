---
title: Generate predictions from a prompt
short: Generate predictions from a prompt
tier: enterprise
type: guide
order: 0
order_enterprise: 234
meta_title: Generate predictions
meta_description: Generate predictions to auto-label project tasks
section: Prompts
date: 2024-06-13 21:54:22
---

你可以继续保存和评估你的 prompts，直到达到你想要的准确度水平。当你的 prompt 准备就绪时，你可以用它来为项目中的所有任务生成预测。

!!! note
    当你点击 **评估（Evaluate）** 时，你将为所选基线中的每个任务创建预测，并覆盖你用此 prompt 生成的任何先前预测。

    评估你的 Prompts 可能会在你的任务上产生多个预测：如果你为一个项目准备了多个 Prompts，或者如果你同时点击了 **评估** 和 **从 Prompt 获取所有任务的预测（Get Predictions for All Tasks from a Prompt）**，你将在数据管理器中看到任务有多个预测。

## 为所有任务生成预测

当你对 prompt 有信心时，点击 **获取所有任务的预测（Get Predictions for All Tasks）**。根据项目中任务的数量，这可能需要一些时间来完成。

<video src="../images/prompts/predictions.mp4" controls="controls" style="max-width: 800px;" class="gif-border" />

!!! note
    使用此操作时，预测不会累积。如果你为所有任务获取了预测，修改了 prompt，然后再次为所有任务生成预测，你将覆盖先前的预测，并且每个任务仅反映最近的预测。

完成后，你可以返回项目并打开数据管理器。使用 **每个任务的总预测数（Total predictions per task）** 列来确认每个任务至少有一个预测：

![Screenshot of the prediction preview](/images/prompts/prediction_column.png)

## 移除预测

如果你过早地生成了预测或想使用新的 prompt，只需选择所有任务并选择 **操作 > 删除预测（Actions > Delete Predictions）**。要仅从特定模型或模型版本中移除预测，请使用 [项目设置中的 **预测（Predictions）** 页面](project_settings_lse#Predictions)。

## 从预测创建标注

一旦你有了预测，你可能仍想将它们转换为标注（取决于你的工作流和期望的结果）。

你可以通过打开任务来审查预测。预测列在模型名称下方并以灰色显示：

![Screenshot of the prediction preview](/images/prompts/prediction.png)

在数据管理器中，选择你想要标注的所有任务，然后选择 **操作 > 从预测创建标注（Actions > Create Annotations from Predictions）**。系统会要求你选择要使用的模型和版本。

![Gif of the of create annotations action](/images/prompts/create_annotations_1.gif)
