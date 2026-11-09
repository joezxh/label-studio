---
title: 为 Label Studio 设置 LDAP 身份验证
short: LDAP
tier: enterprise
type: guide
order: 0
order_enterprise: 385
meta_title: Label Studio Enterprise 的 LDAP 身份验证
meta_description: Label Studio Enterprise 文档，介绍如何为你的数据标注、机器学习和数据科学项目设置 LDAP 身份验证。
section: "管理你的组织"
parent: "admin_auth"
parent_enterprise: "admin_auth"
date: 2024-05-24 09:08:58
---

设置 LDAP 身份验证以管理对 Label Studio 的访问。

!!! error Enterprise
    LDAP 身份验证仅在 Label Studio Enterprise 版中可用，并且仅适用于本地部署安装。如果你使用的是 Label Studio 社区版，请参阅 <a href="https://labelstud.io/guide/label_studio_compare.html">Label Studio 功能</a> 了解更多信息。


为了更轻松地[管理对 Label Studio Enterprise 的访问](manage_users.html)，你可以将 LDAP 组映射到 `roles`（角色）或 `workspaces`（工区）。 

## 设置 LDAP 身份验证 

设置 LDAP 身份验证后，你将无法再使用原生身份验证登录 Label Studio UI。使用 Docker 中的环境变量设置 LDAP 身份验证并将 LDAP 用户分配到你的 Label Studio Enterprise 组织。 

你还可以将特定的 LDAP 组映射到 Label Studio Enterprise 中的特定组织角色和工区，从而更轻松地设置和管理基于角色的访问控制（RBAC）以及 Label Studio Enterprise 中的项目访问。 

你可以参考这个示例环境变量文件来设置你自己的 LDAP：

```bash 
AUTH_LDAP_ENABLED=1

# 使用 ldaps 来保护 LDAP 连接
AUTH_LDAP_SERVER_URI=ldaps://ldap.example.com
# LDAP 管理员凭据    
AUTH_LDAP_BIND_DN=uid=user,ou=sysadmins,o=123abc,dc=zexample,dc=com
AUTH_LDAP_BIND_PASSWORD=password123

# 允许用户使用用户名（不仅是电子邮件）登录 Label Studio
USE_USERNAME_FOR_LOGIN=1

# 在 LDAP 组中的简单用户搜索
AUTH_LDAP_USER_DN_TEMPLATE=uid=%(user)s,ou=Users,o=123abc,dc=example,dc=com

# 指定要分配给平台上所有用户的组织
# 警告：在任意 LDAP 用户登录之前，必须注册具有此电子邮件的用户 
AUTH_LDAP_ORGANIZATION_OWNER_EMAIL=heartex@heartex.net

# 从 LDAP 目录填充用户：
# firstName、lastName、mail、sAMAccountName 取自你的 LDAP 记录 
AUTH_LDAP_USER_ATTR_MAP_FIRST_NAME=firstName
AUTH_LDAP_USER_ATTR_MAP_LAST_NAME=lastName
# 指定用于 AUTH_LDAP_USER_QUERY_FIELD 的字段为 'email'
AUTH_LDAP_USER_ATTR_MAP_EMAIL=mail
# 指定用于 AUTH_LDAP_USER_QUERY_FIELD 的字段为 'username' 
AUTH_LDAP_USER_ATTR_MAP_USERNAME=sAMAccountName

# 在 Label Studio 中查询进行身份验证的用户，可以是 [email|username]
AUTH_LDAP_USER_QUERY_FIELD=email

# 组参数
AUTH_LDAP_GROUP_SEARCH_BASE_DN=ou=Users,o=group-id,dc=example,dc=com
AUTH_LDAP_GROUP_SEARCH_FILTER_STR=(objectClass=groupOfNames)
AUTH_LDAP_GROUP_TYPE=ou
```

如果你想使用递归扫描在多个 LDAP 组中搜索以授予对 Label Studio 的访问权限，而不是依赖 `AUTH_LDAP_USER_ON_TEMPLATE` 使用的简单搜索，请像下面这样更新你的环境变量文件：
```bash
# 将此参数留空
AUTH_LDAP_USER_DN_TEMPLATE=""
# 指定你希望允许登录的组，用 ';' 分隔 
AUTH_LDAP_USER_SEARCH_BASES="ou=guests,dc=domain,dc=com;ou=owners,dc=domain,dc=com"
```


## 用户角色映射

使用 `;` 指定多个组，将 LDAP 组映射到特定的 Label Studio Enterprise 角色。

```bash
AUTH_LDAP_ORGANIZATION_ROLE_ADMINISTRATOR=cn=admins,ou=users,o=123abc,dc=example,dc=com 
AUTH_LDAP_ORGANIZATION_ROLE_MANAGER=cn=managers,ou=users,o=123abc,dc=example,dc=com 
AUTH_LDAP_ORGANIZATION_ROLE_REVIEWER=cn=reviewers,ou=users,o=123abc,dc=example,dc=com
AUTH_LDAP_ORGANIZATION_ROLE_ANNOTATOR=cn=annotators,ou=users,o=123abc,dc=example,dc=com;cn=guests,ou=users,o=123abc,dc=example,dc=com
AUTH_LDAP_ORGANIZATION_ROLE_NOT_ACTIVATED=cn=not,ou=users,o=123abc,dc=example,dc=com 
AUTH_LDAP_ORGANIZATION_ROLE_DEACTIVATED=cn=deactivated,ou=users,o=123abc,dc=example,dc=com
```


## 工区映射

将 LDAP 组映射到特定的 Label Studio 工区。使用 JSON 格式，其中键是工区标题，值是 LDAP 组。使用 `;` 分隔组以指定多个组。 

```bash
AUTH_LDAP_ORGANIZATION_WORKSPACES='{"Workspace 1":"cn=team1,ou=users,o=60cbc901ec2e8e387a3b2d3e,dc=jumpcloud,dc=com","Workspace 2":"cn=team2,ou=users,o=60cbc901ec2e8e387a3b2d3e,dc=jumpcloud,dc=com"}'
```

## 仅使用 LDAP 管理用户访问

如果你想完全使用 LDAP 管理 Label Studio 角色和工区，请将以下内容添加到你的环境变量文件：

```
MANUAL_PROJECT_MEMBER_MANAGEMENT=0
MANUAL_WORKSPACE_MANAGEMENT=0
MANUAL_ROLE_MANAGEMENT=0
```

设置这些选项会禁用 Label Studio API 和 UI 中用于在 Label Studio 内为特定用户分配角色和工区的选项，并完全依赖环境变量文件中的设置。


## 在 LDAP/Active Directory 上启用 TLS

要在 LDAP/Active Directory 上启用安全的传输层安全性（TLS）连接，请添加以下环境变量：

```bash
AUTH_LDAP_CONNECTION_OPTIONS="OPT_X_TLS_CACERTFILE=/path/to/cert.crt;OPT_X_TLS_NEWCTX=0"
```

其中 `OPT_X_TLS_CACERTFILE` 指向包含证书的文件。如果你使用的是自签名证书，则需要将 `OPT_X_TLS_NEWCTX=0` 添加为 `AUTH_LDAP_CONNECTION_OPTIONS` 环境变量的最后一项。
