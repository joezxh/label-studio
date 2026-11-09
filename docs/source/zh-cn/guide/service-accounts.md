---
title: Service accounts
short: Service accounts
tier: enterprise
type: guide
hide_menu: false
order: 0
order_enterprise: 363
meta_title: Service accounts
meta_description: Overview of service accounts in Label Studio Enterprise
section: "Manage Your Organization"
parent_enterprise: "admin_settings"
date: 2025-02-18 12:03:59
---

服务账户被允许对 Label Studio 进行 API 访问，但它们无法登录或通过 UI 与平台进行交互。它们仅用于通过 [Label Studio API](https://api.labelstud.io/api-reference/introduction/getting-started) 以编程方式访问。

!!! note
    默认情况下，每个组织允许有 1 个服务账户。这个初始服务账户不计入你的许可证席位数量。

    如果你需要添加更多，你可以请求额外的服务账户。

## 创建服务账户

要添加服务账户，请转到 **Organization > Settings > Service Accounts（组织 > 设置 > 服务账户）**。

点击 **Create Service Account（创建服务账户）** 并填写以下字段：

| 字段 | 描述 |
|---|---|
| **Name（名称）** | 服务账户的名称。服务账户创建后无法更改。 |
| **Organization role（组织角色）** | 该角色决定了服务账户在组织内的编程访问级别。有关更多信息，请参阅 [用户角色和权限](admin_roles)。<br><br>**注意：** 你可以稍后根据需要升级或降级服务账户的角色。 |
| **Workspaces and projects（工作区和项目）** | 对于角色为 Annotator、Reviewer 或 Manager 的服务账户，将其分配给一个或多个工作区和/或项目。<br><br>**注意：** 你可以稍后通过分配或删除服务账户的方式来更改工作区/项目，就像你对标准用户所做的那样。在管理项目和成员时，服务账户将出现在用户列表中。 |

创建服务账户时，系统会提供一个 API 令牌供你使用。你只有一次机会复制该令牌，因此请务必将其复制到安全的位置。

创建后，服务账户将在其角色和项目范围内拥有完整的 API 访问权限和能力。

## 更新和管理服务账户

点击服务账户旁边的溢出菜单以查看以下操作：

| 操作 | 描述 |
|---|---|
| **View Member Performance（查看成员绩效）** | 查看服务账户的 [成员绩效仪表板](dashboard_annotator)。 |
| **View Activity Log（查看活动日志）** | 查看服务账户的 [活动日志](admin_logs)。 |
| **Reset Token（重置令牌）** | 撤销并重置服务账户的 API 令牌。 |
| **Delete（删除）** | 删除服务账户。 |
