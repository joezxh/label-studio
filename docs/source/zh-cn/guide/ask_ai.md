---
title: AI 助手
short: AI 助手
tier: enterprise
type: guide
order: 0
order_enterprise: 356
meta_title: 关于 AI 助手
meta_description: 有关在 Label Studio 中使用 AI 功能的信息
section: "管理你的组织"
date: 2025-01-28 16:40:16
---

Label Studio AI 助手是一个在 Label Studio 文档、代码库和其他几个 Label Studio 资源上训练过的 OpenAI LLM。

## 使用 AI 助手进行项目设置 

你可以向 AI 描述你的标注项目需要什么以及你希望标注者能够选择什么，而不必从头手动构建标注界面或项目说明。

你可以像聊天一样与它交互，这意味着你可以在之前指令的基础上进行构建并请求更改。 

![Screenshot of AI Assistant for labeling configs](/images/admin/ai-project.png)


## 使用 AI 助手获取一般帮助

你也可以使用 AI 助手来寻求 Label Studio 的故障排除和一般帮助。  

![Screenshot of AI Assistant for labeling configs](/images/admin/ai-ask.png)  


## AI 助手常见问题

### 如何启用或禁用 AI 助手？

你的组织可以从 **组织 > 用量与许可证** 页面启用 AI 助手。 

!!! note
    只有所有者角色的用户可以修改这些设置。对于 Starter Cloud 用户，请[提交支持工单](mailto:support@humansignal.com) 以请求禁用。 

![Screenshot of settings](/images/admin/ai-settings.png) 

* **启用 AI 功能**——为你的标注界面配置启用 AI 助手。 
* **启用 Ask AI**——为 Label Studio 一般帮助启用 AI 助手。 

### 你们使用什么模型？

我们使用 OpenAI Tier 5 模型，主要是 gpt-4o 和 o3-mini。 

### 你们的所有 AI 功能都使用相同的后端吗？

是的。 

### 使用什么数据来生成答案？

仅使用你在聊天窗口中提供的数据来生成响应，这包括：

* 所有聊天消息
* 你上传的任务样本
* 当前的标注配置

### 我的数据如何用于训练模型？

该模型在公开资源（如我们的文档、代码库、博客和网站）上进行训练。我们还使用专门为模型编写的额外示例对其进行训练。 

我们拥有 Tier 5 OpenAI 账户，并选择退出所有训练数据请求。

我们跟踪对我们的 AI 的请求以用作质量控制，但它们仅用于测试模型的输出。例如：如果 X 公司问"创建一个标注负鼠的项目"，我们可能会注意到我们的 AI 没有提供令人满意的答案，并且我们可能会创建包含负鼠的配置并在其上训练模型。该模型不会在 X 公司的任何问题或数据上进行训练。

所有跟踪数据都受我们行业领先的[安全和隐私政策](https://humansignal.com/security/)保护。

### 它是否符合 HIPAA？

你的业务伙伴协议（BAA）不涵盖这些功能。如果你需要遵守 HIPAA，我们建议你禁用 Ask AI。
