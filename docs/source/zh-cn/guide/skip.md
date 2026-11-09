---
title: 跳过任务
short: 跳过任务
tier: all
type: guide
order: 139
order_enterprise: 139
meta_title: 在 Label Studio 中跳过项目任务
section: "创建与管理项目"
parent: "labeling"
parent_enterprise: "labeling"
date: 2025-05-24 17:19:21
---

<div class="opensource-only">

在通过标注流查看任务时（选择**标注所有任务**或**按显示顺序标注任务**，而不是在 Data Manager 中点击任务），可以使用**跳过**操作。

<img src="/images/label/skip.png" class="gif-border" style="max-width: 413px">

当你跳过某个任务时，该任务会从你的标注队列中移除。

如果另一位标注者也在处理该标注队列，他们将看到被跳过的任务。如果所有标注者都跳过了某个任务，该任务将保持未完成状态。

你可以在 Data Manager 中使用 **Cancelled**（已取消）列来查看哪些任务已被跳过。

!!! error Enterprise
    任务的跳过方式以及任务被跳过后的处理逻辑，在 Label Studio Enterprise 和 Starter Cloud 中高度可配置。更多信息请参阅[企业版文档](https://docs.humansignal.com/guide/skip)。

</div>

<div class="enterprise-only">

在通过标注流查看任务时（选择**标注所有任务**或**按显示顺序标注任务**，而不是在 Data Manager 中点击任务），可以使用**跳过**操作。

<img src="/images/label/skip.png" class="gif-border" style="max-width: 413px">

## 配置任务跳过

标注者是否可以跳过任务，以及被跳过的任务会发生什么，可通过以下设置进行配置：

* [**标注 > 任务跳过**](project_settings_lse#skip)

* [**标注 > 跳过队列**](project_settings_lse#skip-queue)

虽然你可以从项目设置中完全禁止跳过，但如果你想让特定任务不可跳过，则需要通过在导入项目的 JSON 任务定义中添加特殊键来配置。

## 单个任务不可跳过

要使单个任务不可跳过，请在导入项目的 [JSON 任务定义](tasks#Basic-Label-Studio-JSON-format) 中指定 `"allow_skip": false`。

例如，以下 JSON 片段将生成一个可跳过任务和一个不可跳过任务：

```json
[
  {
    "data": {
      "text": "Demo text 1"
    },
    "allow_skip": false
  },
  {
    "data": {
      "text": "Demo text 2"
    }
  }
]
```

!!! note
    经理、管理员和所有者仍然可以跳过这些任务。只有标注者和审核者无法跳过通过此方法标记为不可跳过的任务。

!!! info Tip
    使用 **Allow Skip**（允许跳过）列可以查看哪些任务已禁用跳过，并筛选不可跳过的任务。该列默认隐藏，仅对经理、管理员和所有者可见。

</div>
