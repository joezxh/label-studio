---
title: SSO、LDAP 与 SCIM
short: SSO、LDAP 与 SCIM
tier: enterprise
type: guide
order: 0
order_enterprise: 383
meta_title: Label Studio Enterprise 的身份与访问选项
meta_description: Label Studio Enterprise 中可用身份与访问选项概述
section: "管理你的组织"
date: 2025-09-21 09:08:58
---

Label Studio Enterprise 提供企业级身份与访问管理，以集中认证、自动化用户生命周期，并跨组织、工区和项目控制访问。



!!! info Tip
    SSO 处理认证；SCIM 处理自动化的用户和组配置。 
    
    大多数企业先启用 SSO，然后启用 SCIM 以进行持续的用户/组同步。LDAP 通常用于本地部署。

## LDAP

仅限本地部署。

在自托管环境中针对你的目录（例如 AD/LDAP）进行认证，同时在 Label Studio 中管理角色。

- 使用企业目录凭据登录
- 在 Label Studio 中保留 RBAC 和项目/工区权限

请参阅[为 Label Studio 设置 LDAP 认证](auth_ldap)。

## SSO（SAML 2.0）

通过你的 IdP（Okta、Google SAML、Azure AD/Microsoft Entra、Ping Identity、OneLogin 等）对用户进行认证，实现无缝、安全的登录流程。

- 使用你的 IdP 进行集中登录
- 跨工具的单点登录
- 在 IdP 强制执行企业安全策略

请参阅[为 Label Studio 设置 SSO 认证](auth_setup) 以及我们的 [SAML API 文档](https://api.labelstud.io/api-reference/api-reference/sso/saml/get)。

## SCIM 2.0

自动化配置/取消配置以及组到角色的映射。支持创建/更新/停用用户和推送组，包括工区/项目成员管理。

- 自动配置/取消配置用户
- 同步用户档案更改
- 推送工区和项目成员的组
- 将组映射到组织角色和项目级角色

请参阅[为 Label Studio 设置 SCIM2](scim_setup) 以及我们的 [SCIM API 文档](https://api.labelstud.io/api-reference/api-reference/sso/scim/get)。
