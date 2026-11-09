---
title: Support reports - Beta 🧪
short: Support reports 🧪
type: guide
tier: enterprise
order: 0
order_enterprise: 360
meta_title: Support reports
meta_description: Generate anonymized support reports so the HumanSignal team can diagnose issues, tune performance, and suggest better workflows for your Label Studio deployment.
section: "Manage Your Organization"
parent_enterprise: "admin_settings"
---

支持报告为你提供了一种安全、低摩擦的方式，告诉 HumanSignal 团队你的 Label Studio Enterprise 部署内部发生了什么。

这些报告将匿名化的运行指标和环境细节打包在一起，我们的支持和产品团队使用它们来：

- 了解你正在哪里遇到困难
- 发现瓶颈和错误配置
- 推荐具体的工作流和性能优化
- 优先处理对你最重要的功能

![Screenshot of support reports page](/images/admin/support-reports-1.png)

## 生成报告

1. 转到 **Organization > Settings > Support Reports（组织 > 设置 > 支持报告）**。

2. 在 **Reports（报告）** 下，点击 **Generate New Report（生成新报告）**。

3. 报告状态显示在报告下方，并从 **Pending（待处理）** → **Running（运行中）** → **Completed（已完成）** 移动。

    对于拥有大量数据的大型组织，这可能需要几分钟。

完成后，你可以使用操作图标来：

* 直接下载 ZIP 并查看其内容
* 通过电子邮件触发交付

![Screenshot of support reports page](/images/admin/support-report-generate.png)

!!! note
    要下载 ZIP 文件，你需要配置了 [持久化存储](persistent_storage)。这是因为在生成支持报告时，Label Studio 会先使用配置的存储后端持久化报告工件，然后才能下载。

    如果你没有配置持久化存储，或者凭据无效，你在尝试下载 ZIP 文件时将收到错误。

## 配置自动交付

你可以配置你的设置，以便所有报告都自动通过电子邮件发送到指定的电子邮件地址。

输入应接收报告的电子邮件地址。多个电子邮件地址用逗号分隔。

你可以通过打开选项为每个生成的报告自动执行此操作，或者可以使用 **Reports（报告）** 部分下的操作手动执行。

## 报告中包含的信息

支持报告旨在对调试和规划有用，同时保持共享的安全性：

- **运行指标和使用模式**
  例如：
  - 项目和任务量
  - 队列大小和处理速率
  - 常见的标注操作和特性使用

- **环境概况**
  关于以下方面的高级信息：
  - 部署类型（云 / 本地）
  - Label Studio 和 Label Studio Enterprise 的版本
  - 连接的服务（数据库、存储后端）在类型和配置标志的级别，而不是凭据

!!! info 提示

    由于报告只是一个里面带有 JSON 文档的 ZIP 文件，你可以在本地打开它，将其提供给你的内部工具，或直接附加到工单中。

## 隐私与安全

支持报告在有意上保持保守：

- **无原始任务数据或标注**
  报告从不包含标签文本、文档、图像、音频、标注负载或其他标注数据。

- **无 PII 数据：**
  无标签文本、图像、音频或用户名。仅包含聚合和匿名化的统计信息。

- **无密钥的配置：**
  环境细节侧重于 **启用了什么** 以及系统 **如何** 配置，而不是凭据、密钥或专有 URL。

- **你控制共享的内容：**
  - 报告在你的部署内部生成。
  - 你可以自己下载并检查 JSON。
  - 你决定是否以及如何与 HumanSignal 共享 ZIP。

如果你需要更严格的控制（例如，在共享任何内容之前的内部审查和批准工作流），支持报告很容易插入这些流程，因为它们是：

- 纯 JSON + ZIP 文件
- 按需生成
- 可由你的安全和合规团队完全检查

## 何时生成报告

我们建议在以下情况下生成支持报告：

- 你打开一个关于以下内容的 **支持工单**：
  - 性能（队列缓慢、超时、UI 迟缓）
  - 难以复现的错误
  - 复杂项目或工作流中不明确的行为
- 你正在规划 **扩展或迁移** 并想要指导：
  - 迁移到更大的数据集
  - 添加新团队或项目
  - 收紧标注周转时间的 SLA
- 你想要对你的部署进行 **健康检查**：
  - 我们是否高效地使用 Label Studio？
  - 我们的工作流是否符合最佳实践？

在许多情况下，将一份最新的支持报告附加到你的初始工单上，可以让我们跳过几个诊断步骤，直接给出建议的修复和改进。
