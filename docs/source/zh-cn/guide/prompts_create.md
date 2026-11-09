---
title: 创建 Prompt
short: 创建 Prompt
tier: enterprise
type: guide
order: 0
order_enterprise: 228
meta_title: 创建 Prompt
meta_description: 如何创建 Prompt
section: Prompts
date: 2024-06-11 16:53:16
---

## 先决条件

* 你的 LLM 的 [API 密钥](prompts_keys)。 
* 符合[下述标准](#Create-a-Prompt)的项目。 

## 创建 Prompt

在 Prompts 页面，点击右上角的 **Create Prompt**（创建 Prompt），然后填写以下字段：

<div class="noheader rowheader">

| | |
| --- | --- |
| 名称 | 输入 Prompt 的名称。 |
| 描述 | 输入 Prompt 的描述。  |
| 目标项目| 选择你要使用的项目。如果你没有任何符合条件的项目，你将看到错误消息。<br>请参阅下面的说明。<br><br>当你选择一个项目时，会显示有关标注配置的附加信息。这包括应用 prompt 时将使用的类别。  |

</div>

!!! note 符合条件的项目
    目标项目必须满足以下标准：
    * 你必须有权访问该项目。如果你是 Manager（经理）角色，需要被添加到项目中才能访问。 
    * 项目不能位于你的个人沙盒工区中。 
    * 虽然连接到 ML 后端的项目仍会出现在符合条件的项目列表中，但我们不建议将 Prompts 与 ML 后端一起使用，因为这会干扰评估 prompt 时准确率和分数的计算方式。 
  
