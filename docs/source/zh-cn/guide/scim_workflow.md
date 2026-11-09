---
title: How SCIM works with Label Studio Enterprise
short: SCIM workflows and API
tier: enterprise
type: guide
order: 0
order_enterprise: 390
meta_title: How SCIM works with Label Studio Enterprise
meta_description: A description of SCIM workflows and entities
section: "Manage Your Organization"
parent: "scim_setup"
parent_enterprise: "scim_setup"
date: 2024-01-25 10:07:22
---

跨域身份管理（System for Cross-domain Identity Management，SCIM）是一种用于在身份域或 IT 系统之间自动交换用户身份信息开放标准。SCIM 旨在使基于云的应用程序和服务中的用户管理更加轻松高效，减少用户管理所需的时间和资源。

对于使用 Label Studio Enterprise 的组织，SCIM 提供了一种简化管理用户身份和访问权限的方法。通过集成 SCIM，管理员可以自动化用户的配置和取消配置，跨系统同步用户数据，并确保正确的个人能够访问 Label Studio Enterprise 内的必要资源。

## SCIM 工作流

你可以使用 SCIM 执行以下操作：

* 添加用户
* 删除用户（将其用户角色设置为 Deactivated（已停用））
* 将用户分配到组
* 从组中取消分配用户
* 将组映射到用户角色

    请注意，组是在 IdP（身份提供者）中定义的，而不是在 Label Studio 中。但是，组到角色的映射是在 Label Studio 中定义的。

## SCIM API 端点

你可以使用 Label Studio 中的 SCIM 来控制和交互两个实体：Users（用户）和 Groups（组）。

!!! note
    我们的 API 使用 [django-scim2 库](https://django-scim2.readthedocs.io/en/latest/)。

#### Users（用户）
* 搜索用户：`GET /scim/v2/Users?filter=userName =<user@email.com>&startIndex=1&count=100`
    * 如果用户存在则返回 `200`
    * 如果不存在则返回 `404`
* 获取用户：`GET /scim/v2/Users/user@email.com`
* 创建用户：`POST /scim/v2/Users/`

    这还需要一个包含用户信息的有效负载，例如 email 和密码。

#### Groups（组）

* 修改组成员：`PUT /scim/v2/Groups/<group-name>`

    示例：
    ```json
{
  "BODY": {
    "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
    "id": "<group-name>",
    "displayName": "<group-name>",
    "members": [
      {
        "value": "<user@email.com>",
        "display": "<user@email.com>"
      }
    ]
  }
}
    ```

* 创建组：`POST /scim/v2/Groups/<group-name>`
* 获取组：`GET /scim/v2/Groups/<group-name>`

#### SCIM 设置 API

这些设置也可以在 Label Studio 应用中的 **Organization > SCIM（组织 > SCIM）** 页面上进行配置。从这里你可以将组映射到用户角色，并将组映射到工作区（[见下文](#SCIM-settings)）。

* [检索 SCIM 设置](https://app.heartex.com/docs/api/#tag/SSO/operation/api_scim_settings_list)：`GET /api/scim/settings`
* [更新 SCIM 设置](https://app.heartex.com/docs/api/#tag/SSO/operation/api_scim_settings_list)：`POST /api/scim/settings`

## SCIM 设置

### Roles（角色）

你可以通过组映射将角色分配给用户。使用 [更新 SCIM 设置 API](https://api.labelstud.io/api-reference/api-reference/sso/scim/update) 或登录 Label Studio 并转到 **Organization（组织）** 页面。点击右上角的 **SCIM**。

#### 组织级别的角色

这些角色可以是 **Annotator（标注员）**、**Reviewer（审核员）**、**Manager（经理）** 或 **Administrator（管理员）**。

每个组在组织级别只能映射到一个角色。有关每个角色具有哪些权限的更多信息，请参阅 [Label Studio Enterprise 中的角色](manage_users#Roles-in-Label-Studio-Enterprise)。

你也可以将一个组分配给 **Deactivated（已停用）** 角色，这将撤销他们的 Label Studio 访问权限。

#### 项目级别的角色

为了更精细的控制，你可以为组分配项目级别的角色。

这些角色可以是 **Annotator（标注员）**、**Reviewer（审核员）** 或 **Inherit（继承）**（意味着它们继承其组织级别的角色）。

与组织级别的角色不同，一个组可以被分配到跨多个项目的多个角色。例如，组 A 可以是项目 1 中的标注员，项目 2 中的审核员。

### Workspaces（工作区）

你也可以使用 SCIM 将用户组分配到工作区，或者如果工作区尚不存在则创建一个新的工作区。

当你将组分配到工作区时，它们将作为工作区成员被添加。这意味着默认情况下，他们将有权访问该工作区内的任何项目。

他们对于这些项目的权限将取决于他们的组织级别角色。但是，你可以通过使用 SCIM 分配项目级别角色（见上文）来覆盖此设置。
