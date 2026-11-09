---
title: Ground truth 标注
short: Ground truth 标注
tier: enterprise
type: guide
order: 0
order_enterprise: 305
meta_title: Ground truth 标注
meta_description: 在 Label Studio Enterprise 中设置 ground truth 标注。 
section: "审阅与衡量质量"
date: 2024-09-30 13:57:28
---

"ground truth"（真值）标注是一种经过验证的高质量标注，用作特定任务的正确答案。它充当基准，用于评估其他标注的准确性和机器学习模型的性能。

Label Studio Enterprise 将标注者的标注和模型预测与任务的 ground truth 标注进行比较，以计算 0 到 1 之间的准确率分数。

!!! error Enterprise
    Ground truth 标注仅在 Label Studio Enterprise 版中可用。如果你使用的是 Label Studio 社区版，请参阅 [Label Studio 功能](https://labelstud.io/guide/label_studio_compare.html) 了解更多信息。

## 将标注标记为 ground truth

打开任务以查看其标注。点击底部的星形图标，将特定标注设置为 ground truth：

![screenshot of ground truth](/images/review/ground_truth.png)

!!! note
    一个任务只能有一个标注被设置为该任务的 ground truth 标注。如果你将任务的新标注设置为 ground truth，则该任务之前被设置为 ground truth 的标注会被更新为不再是 ground truth 标注。

## 按用户设置 ground truth

要批量更新任务以确保来自特定标注者的标注应被视为 ground truth，首先选择你要更新的任务。

然后选择 **Actions > Set Ground Truths**（设置 Ground Truth）。然后你可以从标注者列表中选择。

![screenshot of ground truth column](/images/review/ground-truth-set.png)

## 查看现有 ground truth 标注

你可以使用数据管理器中的 **Ground Truth**（Ground Truth）列来识别哪些任务已有 ground truth：

![screenshot of ground truth column](/images/review/ground_truth_dm.png)

你还可以使用筛选器来包含或排除已设置 ground truth 的任务。

## 在标注者间一致性弹窗中查看 ground truth

将鼠标悬停在 **Agreement**（一致性）列上以查看显示标注者间一致性的弹窗。已被标记为 ground truth 的标注会用星形图标 ⭐️ 指示：

<img src="/images/review/iaa-popover.png" alt="" class="gif-border" style="max-width:705px" />


## 移除 ground truth 标注

要移除单个 ground truth 标注，只需打开任务并再次点击星形图标以取消设置。

要移除多个 ground truth 标注，请在数据管理器中选择任务旁边的复选框，然后选择 **Actions > Delete Ground Truths**（删除 Ground Truth）。
