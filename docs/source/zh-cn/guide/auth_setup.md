---
title: 为 Label Studio 设置 SSO 身份验证
short: SSO 与 SAML
tier: enterprise
type: guide
order: 0
order_enterprise: 387
meta_title: Label Studio Enterprise 的 SSO 身份验证
meta_description: Label Studio Enterprise 文档，介绍如何为你的数据标注、机器学习和数据科学项目设置 SSO 身份验证。
section: "管理你的组织"
parent: "admin_auth"
parent_enterprise: "admin_auth"
---

使用 SAML 设置单点登录（SSO），使用你现有的身份提供商（IdP）来管理对 Label Studio 的访问。

!!! error Enterprise
    SSO 身份验证仅在 Label Studio Enterprise 版中可用。如果你使用的是 Label Studio 社区版，请参阅 <a href="https://labelstud.io/guide/label_studio_compare.html">Label Studio 功能</a> 了解更多信息。


为了更轻松地[管理对 Label Studio Enterprise 的访问](manage_users.html)，你可以将 SAML 组映射到 `roles`（角色）或 `workspaces`（工区）。 

## 设置 SAML SSO

Label Studio Enterprise 的组织所有者或管理员可以为实例设置 SSO 和 SAML。Label Studio Enterprise 支持以下 IdP：
- [Okta](https://www.youtube.com/watch?v=Dr-_hyWIw4M)
- [Google SAML](google_saml.html)
- [Ping Federate 和 Ping Identity SAML SSO 设置示例](pingone.html)
- OneLogin
- Microsoft Entra ID（以前称为 Azure Active Directory、Azure AD）
- Auth0
- 其他使用 SAML 断言的 IdP

设置 SSO 后，你可以使用原生身份验证访问 Label Studio UI，但这不是一个推荐选项，特别是对于具有所有者角色的用户。

- 你可以将 SSO 与正常登录一起使用。这不是一个推荐选项。

- 你可以使用 [DISABLE_SIGNUP_WITHOUT_LINK](admin_user#Require-invites-for-new-users) 选项来阻止用户创建自己的组织。

### 将你的身份提供商连接到 Label Studio Enterprise

将 Label Studio Enterprise 设置为服务提供商（SP）与你的身份提供商（IdP）一起使用 SAML 身份验证。 

细节因你的 IdP 而异，但通常你将完成以下步骤：

#### 在 Label Studio 中：

1. 转到 **组织** 页面。 
    
    如果你没有看到选择 **组织** 的选项，说明你没有使用适当的角色登录。 
2. 在右上角选择 **SSO 与 SAML**。 
3. 在 **组织** 字段中，确保域与你的 IdP 中用于组织的域匹配。
4. 复制以下 URL：
    
    * **带有受众（EntityID）和收件人（Reply）详细信息的断言消费者服务（ACS）URL**——IdP 使用此 URL 在成功身份验证后将用户重定向到。
    * **登录 URL**——这是用户将用于登录 Label Studio 的 URL。 
    * **登出 URL**——这是在成功从 Label Studio 登出后用于重定向用户的 URL。

#### 在你的 IdP 中：

1. 将你从 Label Studio 复制的 URL 粘贴到适当的位置。 
2. 生成元数据 XML 文件，或指定描述 IdP 元数据的 URL。
3. 设置或确认设置以下 SAML 属性。Label Studio Enterprise 期望特定的用户身份属性映射。

**默认属性名称为：**

| 数据 | 默认属性 |
| --- | --- |
| 电子邮件地址 | Email |
| 名或给定名 | FirstName |
| 姓或家族名 | LastName |
| 组名 | Groups | 

!!! note Note
    不同的身份提供商使用不同的属性名称。Label Studio 在 SSO 与 SAML 设置页面中提供 **预设**，以快速配置流行 IdP 的正确属性映射。如果你的 IdP 使用不同的值，你也可以手动配置自定义属性名称。

**按 IdP 划分的属性预设：**

| IdP | 电子邮件 | 名 | 姓 | 组 |
| --- | --- | --- | --- | --- |
| Default | `Email` | `FirstName` | `LastName` | `Groups` |
| Auth0 | `email` | `given_name` | `family_name` | `groups` |
| Entra ID（简写） | `emailAddress` | `givenName` | `surname` | `groups` |
| Google | `Email` | `FirstName` | `LastName` | `Groups` |
| PingOne | `emailAddress` | `givenName` | `surname` | `Groups` |
| Okta | `email` | `firstName` | `lastName` | `groups` |

**使用完整 URI 格式的 Microsoft Entra ID：**

如果你的 Entra ID 配置了默认声明 URI，请使用：

| 属性 | URI |
| --- | --- |
| 电子邮件 | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` |
| 名 | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` |
| 姓 | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname` |
| 组 | `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups` |


#### 在 Label Studio 中：

1. 返回 SSO 与 SAML 页面。 
2. 上传元数据 XML 文件或指定元数据 URL。  
3. 设置组映射。这些也可以稍后添加或编辑。

    确保你输入的组名与你的 IdP 在 SAML 身份验证响应中作为属性发送的组名相同。

    * **组织角色到组映射**——在组织级别将组映射到角色。在组织级别设置的角色是用户的默认角色，并自动分配给工区和项目。有关角色的更多信息，请参阅 [Label Studio Enterprise 中的角色](manage_users#Roles-in-Label-Studio-Enterprise)。
    
        你可以将多个组映射到同一角色。请注意，处于 **未激活** 或 **已停用** 状态的用户不计入你账户的席位限制。 
    * **工区到组映射**——将组作为成员添加到工区。具有经理、审阅者或标注者角色的用户只有在被添加为该工区成员后才能看到工区。
    
        选择现有工区或创建新工区。你可以将多个组映射到同一工区。 
    * **项目到组映射**——在项目级别将组映射到角色。项目级别的角色可以是 **标注者**、**审阅者** 或 **继承**。 
    
        你可以将组映射到多个项目中的不同角色。你也可以将多个组映射到相同的角色和相同的项目。有关角色的更多信息，请参阅 [Label Studio Enterprise 中的角色](manage_users#Roles-in-Label-Studio-Enterprise)。 
    
        If you select **Inherit**, the group will inherit the role set above under **Organization Roles to Groups Mapping.** If the group is inheriting the Not Activated role, the users are mapped to the project, but they are not actually assigned to the project until the group is synced (meaning that the user authenticates with SSO). 
4. 点击 **保存**。

5. 通过使用你的 SSO 账户登录 Label Studio Enterprise 来测试配置。


### 使用 Okta 设置 SAML SSO 视频教程

<iframe class="video-border" width="560" height="315" src="https://www.youtube.com/embed/Dr-_hyWIw4M" width="100%" height="400vh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 仅使用 SSO 管理用户访问 

如果你想完全使用单点登录（SSO）管理 Label Studio 角色和工区，请将以下内容添加到你的环境变量文件：

```
MANUAL_PROJECT_MEMBER_MANAGEMENT=0
MANUAL_WORKSPACE_MANAGEMENT=0
MANUAL_ROLE_MANAGEMENT=0
```

设置这些选项会禁用 Label Studio API 和 UI 中用于在 Label Studio 内为特定用户分配角色和工区的选项，并完全依赖环境变量文件中的设置。

!!! info Tip
    如果你使用的是 Label Studio 的 SaaS 版本（Label Studio Enterprise Cloud）并希望为你的组织启用这些限制，请[提交工单](https://support.humansignal.com/hc/en-us/requests/new) 提交你的请求。  
    
    如果请求，我们还可以为你的组织禁用通用登录选项。禁用后，用户只能使用 SSO 登录字段，通用登录选项被完全禁用。 

### 登录页面 URL

你还可以设置 `LOGIN_PAGE_URL` 环境变量，将登录页面重定向到指定的 URL。   
