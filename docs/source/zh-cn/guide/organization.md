---
title: Organization management
short: Overview
tier: enterprise
type: guide
order: 0
order_enterprise: 351
meta_title: Organization management
meta_description: Brief overview of organization structures in Label Studio Enterprise. 
section: "Manage Your Organization"
date: 2024-02-16 15:44:07
---


要管理组织成员资格，请使用 Label Studio 中的 **组织（Organization）** 页面。只有具有所有者（Owner）或管理员（Administrator）角色的用户才能访问此页面：

<img style="max-width: 235px" src="/images/admin/org_page.png" alt="Screenshot of org link"/>

## 创建初始组织账户

创建新组织时，你必须直接注册而无需邀请链接。

对于本地部署（on-prem），请使用 `/user/signup`。

对于 SaaS 部署，请使用 [`app.humansignal.com/`](https://app.humansignal.com/)。

当你首次注册 Label Studio Enterprise 或 Starter Cloud 时，会自动创建一个与你的账户关联的组织。你成为该组织的所有者。通过邀请链接或 LDAP 或 SSO 角色加入 Label Studio 的人会加入一个现有组织。

!!! note
    每个组织只能有一个所有者。如果控制所有者账户的用户离开，你将需要 [提交支持工单](https://support.humansignal.com/hc/en-us/requests/new) 以请求重新分配此角色。

## 单个或多个组织

如果你的 Label Studio 计划允许，你可以在 Label Studio 中创建组织，以进一步隔离对数据和项目的访问。例如，你可以创建独立的组织，以完全不相关的部门之间分离工作与访问。如果某些部门可能在某个项目上相互协作，你可以对两者使用一个组织，而是使用工作区来组织他们可能或可能不协作的项目。

例如，你可以设置以下可能的配置之一：

- 一个组织用于你的公司，其中一个工作区用于支持部门，另一个用于开发团队，每个工作区中有针对不同类型客户请求的特定项目。

  <img style="width:70%" src="/images/LSE/LSE-one-org-many-workspaces.jpg" alt="Diagram showing Label Studio with one organization with multiple workspaces and projects within each workspace."/>

- 多个组织，例如一个用于客户索赔部门，另一个用于客户支持部门，每个组织中有针对特定类型保险的特定工作区，例如房屋保险索赔和汽车保险索赔，以及每个工作区中针对索赔类型的特定项目，例如事故索赔、伤害索赔、自然灾害索赔。客户支持组织可能有针对支持队列类型的特定工作区，以及针对所接收到的特定类型呼叫的项目。

  <img style="width:70%" src="/images/LSE/LSE-multiple-orgs-workspaces.jpg" alt="Diagram showing Label Studio with three organizations, each one with multiple workspaces and projects within each workspace."/>

  当你为组织成员分配用户角色时，他们对该组织的所有工作区和项目都持有该角色。

!!! note
    在多个组织中有用户可能会阻止你访问 [插件功能](/plugins/)。

组织内的经理可以看到该组织中的所有工作区，即使他们没有在其中执行操作的访问权限。标注者和审查者只能看到项目，而不是工作区。

如果你有权访问多个组织，请使用 **组织（Organizations）** 下拉菜单在你作为成员的组织之间切换：

<img style="max-width: 242px" src="/images/admin/org-switch.png" alt="Screenshot of org switcher"/>

## 更改组织名称

具有所有者或管理员角色的用户可以使用 API 重命名他们的组织：

```curl
LSE_URL=<Replace with your URL>
ORG_ID=<Replace with your org ID>
TOKEN=<Replace with your token>
  curl -X PATCH "$LSE_URL/api/organizations/$ORG_ID" \ 
    -H "Authorization: Token $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "New Org Name"}'
```

!!! note
    上面的示例使用旧版令牌。要使用你的个人访问令牌（JWT），请改用 `-H "Authorization: Bearer $TOKEN"`。
