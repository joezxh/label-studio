---
title: 组织级模型提供商 API 密钥
short: 模型提供商
tier: enterprise
type: guide
hide_menu: false
order: 0
order_enterprise: 361
meta_title: 模型提供商
meta_description: 如何在 Label Studio 中为 AI 功能设置模型提供商。 
section: "管理你的组织"
parent_enterprise: "admin_settings"
date: 2025-02-18 12:03:59
---

要在你的组织中使用某些 AI 功能，你必须首先设置模型提供商。你可以从 **组织 > 设置** 设置模型提供商。

例如，如果你想在使用 [`<Chat>` 标签](/tags/chat.html) 时与 LLM 交互，你首先需要配置对该模型的访问。


!!! note
    这些模型不与 Label Studio [AI 助手](ask_ai) 一起使用。

## 关于添加模型提供商

### 用户访问 

添加后，这些模型提供商可供组织中任何也在使用 AI 驱动工作流的人使用。 
    
但是，只有有权访问组织设置（所有者和管理员）的用户才能添加和配置模型。

### 将网络访问加入白名单

如果你限制对资源的网络访问，在配置网络安全时，可能需要将 HumanSignal 的 IP 地址加入白名单（[SaaS 上的 IP 范围](saas#Outbound-Connections-IP-Addresses)）。

### 方法

添加模型提供商 API 密钥有两种方法。 

* 在一种情况下，每个组织获得一个提供商连接，这提供对一组白名单模型的访问。示例包括：

    * OpenAI
    * Vertex AI
    * Gemini
    * Anthropic

* 在第二种情况下，你为每个模型添加单独的 API 密钥。示例包括：

    * Azure OpenAI
    * Azure AI Foundry
    * Custom

{% insertmd zh-cn/includes/base_models.md %}

## 添加模型提供商

!!! note
    如果你已经配置了要与 [Prompts](prompts_overview) 一起使用的模型提供商，这些将自动添加到你的组织级提供商。

{% insertmd zh-cn/includes/model_keys.md %}
