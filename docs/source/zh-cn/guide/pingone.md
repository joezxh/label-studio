---
title: Ping Federate 与 Ping Identity SAML SSO 设置示例
short: Ping Federate 与 Ping Identity 与 PingOne SAML SSO 设置
tier: enterprise
order: 253
meta_title: Ping Federate 与 Ping Identity 与 PingOne SAML SSO 设置示例
meta_description: Label Studio Enterprise 关于设置 Ping Federate 与 Ping Identity 与 PingOne SAML SSO 的文档。
hide_sidebar: true
---

## PingOne 配置

### 添加新应用 

1. 点击带 `+` 号的蓝色圆圈。  
<img src="/images/pingone/setup-1.png" class="gif-border">

2. 选择 `Manual Enter`（手动输入），输入来自 Label Studio Enterprise SAML SSO 页面的 URL。
<img src="/images/pingone/setup-2.png" class="gif-border">

3. 结果
<img src="/images/pingone/main.png" class="gif-border">


### 概览标签

<img src="/images/pingone/overview.png" class="gif-border">
<br><br>

### 配置标签

<img src="/images/pingone/configuration-1.png" class="gif-border">
<br><br>

<img src="/images/pingone/configuration-2.png" class="gif-border">
<br><br>

### 属性标签

你应在映射中使用此组值：
```
Expression: ${user.memberOfGroupNames == null ? '': #string.join(user.memberOfGroupNames, ',')}
```
<br>
<img src="/images/pingone/attributes.png" class="gif-border">
<br><br>

### 策略标签

<img src="/images/pingone/policies.png" class="gif-border">
<br><br>

### 访问标签

<img src="/images/pingone/access.png" class="gif-border">

## 用户与组

!!! warning
    所有用户应至少属于一个组，否则将导致登录错误。
     

## Label Studio Enterprise 设置 

你可以在 **组织** 页面 >> **SAML SSO** 找到 LSE SAML SSO 设置。你可以使用 `Groups` 属性映射用户角色和工区。  
 
<br>
<img src="/images/pingone/saml-settings.png" class="gif-border">


## 使用 SSO 登录 

现在你可以使用 SSO 会话登录，在 SSO 登录页面输入你的公司域名：

<br>
<img src="/images/pingone/login-sso.png" class="gif-border">

管理员可以在 SAML SSO 页面找到域名：

<br>
<img src="/images/pingone/domain-settings.png" class="gif-border">
