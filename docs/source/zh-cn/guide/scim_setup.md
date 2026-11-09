---
title: Set up SCIM2 for Label Studio
short: SCIM2
tier: enterprise
type: guide
order: 0
order_enterprise: 389
meta_title: System for Cross-domain Identity Management (SCIM) for Label Studio Enterprise
meta_description: Label Studio Enterprise documentation for setting up SCIM2
section: "Manage Your Organization"
parent: "admin_auth"
parent_enterprise: "admin_auth"
---

跨域身份管理（System for Cross-domain Identity Management，SCIM）是一种用于在组织内跨服务和应用程序管理访问的流行协议。

使用 SCIM 提供者，你可以管理对 Label Studio Enterprise 工作区的访问，并向单个用户和组授予角色。

## 要求

Label Studio Enterprise 使用 SCIM 2.0 标准。

Label Studio Enterprise 遵循 [SCIM RFC 5741](https://datatracker.ietf.org/doc/html/rfc7644#section-3.2)，并且可以与任何支持该标准的访问管理服务集成。

有关 SCIM 工作流的更多信息，请参阅 [SCIM 如何与 Label Studio Enterprise 协同工作](scim_workflow)。

## 先决条件

* SCIM 与你的 SSO 集成进行交互。在开始之前，你必须已经配置了 SSO。如果尚未设置 SSO，请按照 [设置 SSO](auth_setup.html) 进行操作。

!!! note
    Okta 或类似的 SSO 提供者有基于 SSO 的 SCIM 集成。

* 你需要提供一个 [Legacy token（旧版令牌）](access_tokens#Legacy-tokens)，并且它必须与你的组织的 Owner（所有者）角色关联。

## 使用 Okta 设置 SCIM 集成

!!! attention "重要"
    此视频演示了在 "Unique Identifier Field for Users（用户的唯一标识符字段）" 字段中使用 `userName`。必须使用 `email` 作为唯一标识符，而不是 `userName`；否则，SCIM 将无法正确处理在 SCIM 集成之前创建的用户。

<iframe width="560" height="315" src="https://www.youtube.com/embed/MA3de3gu18A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

要管理对 Label Studio Enterprise 的访问，请将应用程序添加到你的 SCIM 提供者（Okta）。

Okta 使用 Bearer（请求头应为 `Authorization: Bearer <token>`）令牌与应用程序的 REST API 端点进行交互，以配置和取消配置访问。

### 将 Label Studio Enterprise 添加为应用程序（如果尚未完成）

1. 在 Okta 中导航到 **Applications > Applications（应用程序 > 应用程序）**。点击 **Create App Integration（创建应用集成）**。
2. 选择 **SAML 2.0**。输入一个应用名称（例如 _Label Studio Enterprise_）。
3. 在 **Configure SAML（配置 SAML）** 下，按照 [设置 SSO 指南](auth_setup.html) 中列出的步骤设置 SAML 集成。
4. 确保 Label Studio Enterprise 出现在活动应用程序列表中。

### 启用 SCIM 配置

1. 在 Okta 中导航到 **Applications > Applications（应用程序 > 应用程序）**。
2. 选择 **Label Studio Enterprise**。
3. 选择 **General（常规）** 选项卡并选择 **Enable SCIM provisioning（启用 SCIM 配置）**。
4. 选择 **Provisioning（配置）** 选项卡。
5. 在左侧菜单中选择 **Integration（集成）**。
6. 点击右上角的 **Edit（编辑）**。

填写以下字段：

| 字段 | 值/描述 |
|-------|-------------------|
| **SCIM connector base URL（SCIM 连接器基础 URL）** | `https://<LABEL_STUDIO_BASE_URL>/scim/v2/`，其中 `<LABEL_STUDIO_BASE_URL>` 是你的 Label Studio Enterprise 实例的基础 URL。 |
| **Unique identifier field for users（用户的唯一标识符字段）** | 使用 `email`。Label Studio Enterprise 在该字段中使用 email 作为用户标识符。 |
| **Supported provisioning actions（支持的配置操作）** | 选择以下项：<br>- Import New Users and Profile Updates（导入新用户和配置文件更新）<br>- Push New Users（推送新用户）<br>- Push Profile Updates（推送配置文件更新）<br>- Push Groups（推送组） |
| **HTTP Header → `Authorization: Bearer <token>`** | 输入与 Label Studio 中 Owner 账户关联的 [Legacy token（旧版令牌）](access_tokens#Legacy-tokens)。<br />对于 Label Studio，`Token` 和 `Bearer` 是相同的令牌。但是，在请求头中使用 `Bearer` 而不是 `Token` 非常重要。 |

### SCIM 设置与应用程序触发器

1. 在应用程序页面上，导航到 **Provisioning（配置）** 选项卡，并在左侧菜单中选择 **To App（到应用）**。点击右上角的 **Edit（编辑）**。
2. 启用以下项：
   - Create Users（创建用户）
   - Update User Attributes（更新用户属性）
   - Deactivate Users（停用用户）

### 将应用程序分配给单个用户

你可以在 **用户** 页面和 **应用程序** 页面上分配应用程序。

1. 在 **应用程序** 页面上，导航到 **Assignments（分配）** 选项卡。
2. 点击 **Assign（分配）** 并选择 **Assign to People（分配给人员）**。
3. 选择你希望添加到 Label Studio Enterprise 的人员。
4. 点击 **Done（完成）**。

点击 **Done（完成）** 后，Okta 将相应地发送请求以在 Label Studio Enterprise 中创建用户。

### 取消用户的分配

1. 在应用程序页面上，导航到 **Assignments（分配）** 选项卡。
2. 在左侧菜单中选择 **People（人员）**。
3. 点击你希望取消分配的用户的删除叉号。
4. 确认取消分配。

### 将应用程序分配给组

管理对应用程序访问的最便捷方式是通过组。你可以将 Label Studio 分配给组，并在 Okta 中管理这些组。更改将传播到应用程序。

### 在 Label Studio 中设置组映射

1. 在 Label Studio 中，点击左上角的菜单并选择 **Organization（组织）**。
2. 在右上角选择 **SCIM**。
3. 更新角色和工作区映射。确保你输入的组名称与你的 SCIM 提供者发送的组名称相同。

    * **Organization Roles to Groups Mapping（组织角色到组映射）** —— 在组与组织级别的组与角色之间建立映射。在组织级别设置的角色是用户的默认角色，并自动分配给工作区和项目。有关角色的更多信息，请参阅 [Label Studio Enterprise 中的角色](admin_roles)。

        你可以将多个组映射到同一个角色。请注意，**未激活（Not Activated）** 或 **已停用（Deactivated）** 的用户不计入你账户的席位限制。
    * **Workspaces to Groups Mapping（工作区到组映射）** —— 将组作为成员添加到工作区。具有 Manager、Reviewer 或 Annotator 角色的用户只有在被添加为该工作区的成员后，才能看到工作区。

        选择一个现有的工作区或创建一个新的工作区。你可以将多个组映射到同一个工作区。
    * **Projects to Groups Mapping（项目到组映射）** —— 在组与项目级别的组与角色之间建立映射。项目级别的角色可以是 **Annotator（标注员）**、**Reviewer（审核员）** 或 **Inherit（继承）**。

        你可以将一个组映射到跨多个项目的不同角色。你也可以将多个组映射到相同的角色和相同的项目。有关角色的更多信息，请参阅 [Label Studio Enterprise 中的角色](admin_roles)。

        如果你选择 **Inherit（继承）**，该组将继承上面 **Organization Roles to Groups Mapping（组织角色到组映射）** 下设置的角色。如果组继承了 Not Activated 角色，则用户被映射到项目，但在组同步之前（意味着用户首先进行身份验证）他们实际上并未被分配到项目。

### 将组分配给应用程序

1. 使用 Okta，导航到 **应用程序** 页面并打开 **Assignments（分配）** 选项卡。
2. 选择 **Assign → Assign to Groups（分配 → 分配给组）** 并选择该组。
3. 将属性 **Active** 设置为 true。

保存组分配后，更新将被排队并发送到 Label Studio。

!!! note
    或者，你可以立即将更改推送到 Label Studio。

### 将组同步到应用程序

1. 使用 Okta，导航到 **应用程序** 页面并打开 **Push Groups（推送组）** 选项卡。
2. 点击 **Push Groups（推送组）** 并选择 **Find groups by name（按名称查找组）**。
3. 找到你想要同步到 Label Studio 的组。
4. 如果你已经有一个与 **SCIM** >> **Settings（设置）** 页面上指定的名称相同的工作区，请选择 **Create Group（创建组）** 或 **Link Group（链接组）**。

### 取消组的分配

要取消组从应用程序的分配，请按照 [取消用户的分配](#Unassigning-the-application-for-users) 中的步骤进行操作。

1. 在 **应用程序** 页面上，导航到 **Assignments（分配）** 选项卡。
2. 在左侧菜单中选择 **Group（组）**。
3. 点击你希望取消分配的组的删除叉号。
4. 确认取消分配。

<i>查看此视频教程以删除用户和组。</i>
<iframe width="560" height="315" src="https://www.youtube.com/embed/vMA0TLhHGYE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 使用 Microsoft Entra ID（Azure AD）设置 SCIM

Label Studio Enterprise 支持使用 Microsoft Entra ID（前身为 Azure AD）进行 SCIM 配置。设置与 Okta 类似，但需要特定的属性映射配置。

### 支持的用户属性

Label Studio Enterprise 支持一组有限的用于配置的 SCIM 用户属性。在 Microsoft Entra ID 中配置属性映射时，仅包含下面列出的属性。

| SCIM 属性 | 描述 | 必需 |
|---|---|---|
| `emails[type eq "work"].value` | 用户的电子邮件地址（主标识符） | 是 |
| `userName` | 用户名（在 Label Studio 中映射到 email） | 是 |
| `active` | 用户是否处于活动状态 | 是 |
| `name.givenName` | 用户的名字 | 否 |
| `name.familyName` | 用户的姓氏 | 否 |

!!! warning "不支持的属性会导致配置错误"
    映射 Label Studio 不支持的属性将导致 SCIM 配置期间出现 **HTTP 501（Not Implemented，未实现）** 错误。你必须删除所有类似这样的多余 Microsoft Entra ID 属性映射：

    * `displayName`
    * `preferredLanguage`
    * `name.formatted`
    * `externalId`

### 配置 Microsoft Entra ID 配置

1. 在 [Microsoft Entra 管理中心](https://entra.microsoft.com) 中，在左侧菜单中选择 **Enterprise apps（企业应用）**。
2. 选择你的企业应用程序。
3. 在左侧菜单中选择 **Provisioning（配置）**。
4. 将 **Tenant URL（租户 URL）** 设置为 `https://<LABEL_STUDIO_BASE_URL>/scim/v2/`。
5. 将 **Secret Token（机密令牌）** 设置为与 Label Studio 中 Owner 账户关联的 [Legacy token（旧版令牌）](access_tokens#Legacy-tokens)。

    这必须是 Legacy token，而不是 Personal Access Token。它还必须与 Owner 角色的用户关联。
6. 在 **Mappings（映射）** 下，打开 **Provision Microsoft Entra ID Users（配置 Microsoft Entra ID 用户）**。
7. 删除除上面列出的受支持属性之外的所有属性映射。

    保留：
    * `emails[type eq "work"].value` → `userPrincipalName`
    * `userName` → `userPrincipalName`
    * `active` → `Switch([IsSoftDeleted], , "False", "True", "True", "False")`
    * `name.givenName` → `givenName`
    * `name.familyName` → `surname`
8. 在 **Mappings（映射）** 下，打开 **Provision Microsoft Entra ID Groups（配置 Microsoft Entra ID 组）**，如果你希望使用基于组的角色分配，请确保它已启用。
9. 对于组配置，请在 Label Studio 中配置 SCIM 组设置（请参阅上面的 [设置组映射](#set-up-group-mapping)）。
