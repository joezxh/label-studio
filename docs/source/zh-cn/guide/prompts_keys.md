---
title: 用于 Prompts 的模型提供商 API 密钥
short: API 密钥
tier: enterprise
type: guide
order: 0
order_enterprise: 229
meta_title: 模型提供商 API 密钥
meta_description: 添加用于 Prompts 的 API 密钥
section: Prompts
date: 2024-06-11 16:53:16
---

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

!!! note
        如果你限制对资源的网络访问，在配置网络安全时，可能需要将 HumanSignal 的 IP 地址加入白名单（[SaaS 上的 IP 范围](saas#Outbound-Connections-IP-Addresses)）。


一旦通过 API 密钥添加了模型，组织中任何有权访问 Prompts 功能的人都可以在执行其 prompt 时选择关联的模型。

你可以通过点击 Prompts 页面右上角的 **API Keys**（API 密钥）来打开 **Model Provider API Keys**（模型提供商 API 密钥）窗口，查看你拥有的 API 密钥并添加新的密钥：

![Screenshot of the API keys button](/images/prompts/model_keys.png)

{% insertmd zh-cn/includes/base_models.md %} 

添加密钥后，所有支持的模型都会在你[起草 prompt](prompts_draft) 时出现在基础模型下拉菜单中。

## 添加模型提供商

!!! note
    你在此处配置的模型也将在你的[组织级提供商](model_providers)中可用。

{% insertmd zh-cn/includes/model_keys.md %}
