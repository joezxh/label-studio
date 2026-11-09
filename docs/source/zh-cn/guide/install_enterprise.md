---
title: 安装概述
short: 安装
tier: enterprise
type: guide
order: 0
order_enterprise: 60
meta_title: Label Studio Enterprise 的安装概述
meta_description: 本地部署 Label Studio Enterprise 时涉及的组件概述
section: "安装与设置"
---

Label Studio Enterprise 的两个核心组件是主应用和 RQ（Redis 队列）worker。本地部署通常还包括以下组件：

* [**身份提供商**](auth_setup)：连接到主应用的外部 IdP，向 Label Studio 发送 SAML 或 SCIM2.0 断言。身份提供商帮助你管理用户凭据和访问。常见的 IdP 包括 Okta、Ping、Microsoft Active Directory。 

    虽然建议集成身份提供商以更可扩展和安全的方式管理用户身份验证和访问控制，但如果需要，Label Studio Enterprise 也可以使用其自己的内部用户管理系统进行部署。 
* [**负载均衡器/ingress**](ingress_config)：这充当流量管理器，将传入的网络请求定向到主应用。
* [**PostgresSQL 数据库**](install_enterprise_k8s#可选为-postgresql-设置-tls)：这连接到主应用以存储标注元数据。它还连接到 RQ worker 以存储报告和预标注。
* [**Redis**](install_enterprise_k8s#可选为-redis-设置-tls)：这与主应用一起工作以执行后台任务，例如计算统计报告和预测。它还与 RQ worker 通信以管理后台作业队列。 
* [**云存储**](persistent_storage)：云存储与主应用和 RQ worker 一起工作以管理资产和数据。
  * 用于头像和快照等资产的持久化存储。 
  * 将数据传输到 Label Studio 以用于标注任务的导入存储。 
  * 用于在任务被标注时保存导出标注数据的导出存储。 
* **集成**：例如，这些可以是计算预标注的[自定义 ML 后端](ml)，或者你使用 [webhooks](webhooks) 与 Label Studio 集成的任何其他第三方服务。 


![使用 Kubernetes 的本地 Label Studio Enterprise 部署中包含的内容示意图](/images/LSE_k8s_scheme.png)
