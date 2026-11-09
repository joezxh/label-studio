---
title: 项目组件
short: 项目组件
# type: guide  # this page is not ready, so remove it from everywhere
# tier: all
order: 118
meta_title: 项目组件
meta_description: "Label Studio Documentation for Project components."
section: "Project & Team Management"
---

本页描述了 Label Studio UI 中的一般项目组件。

## 标注界面

Label Studio 界面允许你标注和注释你的数据。只有在设置好项目、标注界面并导入数据后，你才能开始标注和注释数据。有关更多信息，请参阅[标注和注释数据](labeling.html#Start-labeling)页面。

## 标注

标注是在图像上标记数据的过程。图像可能包含人、车辆、任何物体，以使机器能够识别。标注有多种类型，可用于让机器了解世界中各种物体的存在。有关更多信息，请参阅[标注和注释数据](labeling.html#Start-labeling)页面。

<div class="enterprise-only">

## 审阅

在多个标注者标注任务后，审阅他们的输出来验证结果的质量。有关更多信息，请参阅[在 Label Studio 中审阅标注](quality.html)页面。

## 成员

在 Label Studio Enterprise 版本中，你可以向特定工区添加成员，或向工区内的特定项目添加成员。有关更多信息，请参阅[向项目添加成员](setup_project.html#Add-members-to-a-project)页面。

</div>

## 机器学习

使用 Label Studio ML 后端将 Label Studio 与机器学习模型集成。有关更多信息，请参阅[将 Label Studio 集成到你的机器学习管道](ml.html)页面。

## 云存储

你可以添加源存储连接以将数据从外部源同步到 Label Studio 项目，并添加目标存储连接以将标注从 Label Studio 同步到外部存储。有关更多信息，请参阅[从外部存储同步数据](storage.html)页面。

## Webhook

Label Studio 中的 Webhooks 允许你设置订阅 Label Studio 内部发生的某些事件的集成。当事件被触发时，Label Studio 会向配置的 webhook URL 发送 HTTP POST 请求。有关更多信息，请参阅[在 Label Studio 中设置 Webhooks](webhooks.html)页面。
