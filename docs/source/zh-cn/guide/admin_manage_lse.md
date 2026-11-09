---
title: 管理用户账户
short: 管理用户账户
tier: enterprise
type: guide
order: 0
order_enterprise: 372
meta_title: 管理用户账户
meta_description: 如何为用户分配角色、删除用户、标记用户以及停用用户
section: "管理你的组织"
parent: "manage_users"
parent_enterprise: "manage_users"
date: 2024-02-06 12:00:25
---


!!! note
    如果你使用的是 SSO/SAML 或 SCIM，你可以在组织级别和项目级别将组映射到角色。有关更多信息，请参阅[为 Label Studio 设置 SSO 身份验证](auth_setup)和[为 Label Studio 设置 SCIM2](scim_setup)。 

    如果你使用的是带有 SCIM 或 SAML/SSO 的 IdP，你还应该从 IdP 处理用户的停用和删除。


## 为用户分配角色

如果你使用[邀请链接选项](admin_user#Invite-users-to-Label-Studio-Enterprise)邀请用户，他们的账户会被创建，但必须通过为其分配角色来激活。

!!! info Tip
    你可以使用表格上方的角色筛选器查看所有待处理用户。选择 **Not Activated**（未激活）角色。

1. 打开 Label Studio 并点击左上角的菜单。 
2. 选择 **组织**。 

    如果你没有看到 **组织** 选项，说明你无权访问组织页面。只有所有者或管理员角色的用户才能访问此页面。 

3. 找到你要为其分配角色的用户账户。 

4. 使用用户旁边的下拉菜单选择角色。 

![Screenshot of the role drop-down menu](/images/admin/assign_role.png)


## 以编程方式分配角色

要以编程方式激活并分配用户角色，你可以使用 API：

https://api.labelstud.io/api-reference/api-reference/organizations/members/update


你可以从 **组织** 页面找到用户 ID 和组织 ID：

![Screenshot of the role drop-down menu](/images/admin/user-ids.png)

你还可以使用 API：

* [列出组织](https://api.labelstud.io/api-reference/api-reference/organizations/list)
* [列出成员](https://api.labelstud.io/api-reference/api-reference/organizations/members/list)

## 标记成员

你可以用元数据标记组织成员。 

### 通过 CSV 应用成员标签

要批量应用成员标签，请转到组织页面并点击 **Tag Members**（标记成员）。 

从这里你可以上传具有以下格式的 CSV：

```csv
email,tags
heidi@humansignal.com,"Data Science, Seattle"
sally@humansignal.com,"Finance, New York City"
```

* 确保包含 `email,tags` 作为表头。 
* 标签必须括在引号中。 
* 如果你有多个标签，请用逗号分隔。 


!!! info Tip
    如果你从电子表格编辑器导出 CSV，请务必在上传前在文本编辑器中检查格式。电子表格编辑器可能会添加不必要的格式。


### 添加和删除标签

要删除或手动添加新标签，请转到 **组织 > 设置 > 成员标签**。 

### 手动分配标签

如果你想手动为单个用户分配标签，可以使用组织成员表格中的 **Tags**（标签）列。 

![screenshot](/images/admin/tags-apply.png)

## 停用用户

你可以通过将用户分配到 **Deactivated**（已停用）角色来停用用户账户。停用用户会撤销其访问权限，并释放其许可证中的席位。

你可以通过将用户分配到活跃用户角色来重新激活用户。


## 删除用户

1. 从组织页面，选择你要删除的用户。 

2. 点击 **删除**。 

3. 出现确认消息。点击 **删除成员**。 

一旦删除，用户完成的任何工作或所做的更改都将显示为属于"Deleted User"（已删除用户）。

如果你日后想再次添加该用户，需要重新邀请他们加入组织。
