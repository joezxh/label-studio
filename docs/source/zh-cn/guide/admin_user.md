---
title: 在 Label Studio Enterprise 中添加成员
short: 添加成员
tier: enterprise
type: guide
order: 0
order_enterprise: 369
meta_title: 向 Label Studio 添加并邀请成员
meta_description: 如何在 Label Studio Enterprise 中添加成员概述
section: "管理你的组织"
parent: "manage_users"
parent_enterprise: "manage_users"
date: 2024-02-05 17:15:19
---

你可以从 Label Studio 的 **组织** 页面查看、添加和管理组织成员。

点击左上角菜单并选择 **组织** 以导航到 **组织** 页面。

只有具有所有者或管理员角色的用户才能访问此页面。


## 邀请成员

一旦创建了初始组织账户，你就可以开始邀请用户。

在组织页面，点击 **Invite Members**（邀请成员）。从这里你有两个选项：

### 邀请链接

你可以与用户共享此链接，然后他们可以完成注册过程。

但是，在所有者或管理员手动为他们分配角色之前，他们将无法访问 Label Studio。请参阅 [用户角色和权限](admin_roles)。

点击 **Reset**（重置）以重置链接。重置后，任何持有旧链接的人都将无法注册新的用户账户。

### 通过电子邮件邀请

输入以逗号分隔的电子邮件地址列表，然后为新账户选择一个用户角色。
    
用户将收到一封包含创建其 Label Studio 账户链接的电子邮件，并在注册完成后即可访问 Label Studio。

### 要求新用户邀请（本地部署）

虽然你可以通过邀请链接邀请用户加入你的组织，但这并不能阻止用户通过注册页面注册新账户。

你可以通过设置以下环境变量来移除通过 `/user/signup` 页面创建账户的选项：

```bash
LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true
```

用户只能通过邀请链接或电子邮件注册。

## 激活新用户

通过链接注册的用户在分配用户角色之前将无法访问 Label Studio。

要筛选待处理的用户，请从 **组织 > 成员** 页面顶部的角色筛选器中选择 **Pending**（待处理）：

![screenshot of the pending users filter](/images/admin/user-activate.png)

然后使用下拉菜单分配角色：

![Screenshot of the role drop-down menu](/images/admin/user-pending.png)
