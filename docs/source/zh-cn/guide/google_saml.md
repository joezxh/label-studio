---
title: Google SAML SSO 设置示例
short: Google SAML SSO 与 Label Studio 设置示例
tier: enterprise
order: 253
meta_title: Google SAML SSO 与 Label Studio 设置示例
meta_description: Label Studio Enterprise 文档，介绍如何将 Google 设置为 SAML SSO 设置示例的身份提供商。
hide_sidebar: true
---

你可以将 Label Studio 设置为使用 Google 的 IdP 进行 SSO。 

你需要以下权限：

* 访问 [Google Admin console](https://admin.google.com/)。你的账户必须具有[超级管理员权限](https://support.google.com/a/answer/2405986#super_admin)。 
* 你的 Label Studio 用户角色必须是所有者或管理员。 

## 步骤 1：获取 Label Studio ACS 端点作为服务提供商（SP）

1. **访问 Label Studio SSO 设置：**
   - 使用具有所有者或管理员角色的账户登录 Label Studio。
   - 点击左上角的菜单并选择 **组织**。
   - 在右上角选择 **SSO 与 SAML**。

2. **复制 SAML 配置**
   - 从 **身份提供商详细信息** 部分，复制以下 URL： 
        - **断言消费者服务（ACS）URL**
        - **登录 URL**
        - **登出 URL**

    <img src="/images/google-saml/4-lse-saml.png" class="gif-border">

## 步骤 2：配置 Google 组和用户

1. **访问 Google Admin Console：**
   - 登录 [Google Admin console](https://admin.google.com/)。
   - 转到 **Directory（目录）** > **Groups（组）**。
 
    <img src="/images/google-saml/9-add-group.png" class="gif-border">

2. **添加新组：**
   - 点击 **创建组** 并按照步骤创建并保存一个新组。在此示例中，该组命名为 "TestGroup"。 
 
    <img src="/images/google-saml/10-add-group-2.png" class="gif-border">

3. **将用户分配到新组：**
   - 转到 **Directory（目录）** > **Users（用户）**。
   - 选择要添加到新组的用户。
   - 选择 **更多选项 > 将所选用户添加到组**。 
 
    <img src="/images/google-saml/11-add-group-3.png" class="gif-border">


## 步骤 3：将 Google 配置为身份提供商（IdP）

1. **访问 Google Admin console：**
   - 登录 [Google Admin console](https://admin.google.com/)。
   - 转到 **Apps（应用）** > **Web and mobile apps（Web 和移动应用）**。

    <img src="/images/google-saml/1-web-apps.png" class="gif-border">


2. **添加新 SAML 应用：**
   - 选择 **添加应用 > 添加自定义 SAML 应用**。
   - 输入应用的名称（例如 "Label Studio"）并点击 **继续**。

    <img src="/images/google-saml/2-add-app.png" class="gif-border">

3. **下载 IdP 元数据：**
   - 当提供选项时，下载新应用的 IdP 元数据文件。此文件包含配置 Label Studio 所需的全部信息。

    <img src="/images/google-saml/3-metadata.png" class="gif-border">
   
4. **配置 SAML 设置：**
   - 在 **服务提供商详细信息** 部分，输入以下内容：
     - **ACS URL**：粘贴从 Label Studio 复制的 ACS URL。
     - **Entity ID**：使用与 ACS URL 相同的 URL。
     - **Start URL**：（可选）可以留空或使用 Label Studio 的 **登录 URL**。
     - **Signed Response**：保持未勾选。
   - 点击 **继续**。
 
    <img src="/images/google-saml/5-acs-setup.png" class="gif-border">

5. **映射属性：**
   - 在 **属性映射** 部分，映射以下属性：
     - **主要电子邮件**：`Email`
     - **名**：`FirstName`
     - **姓**：`LastName`
   - 点击 **完成**。

    <img src="/images/google-saml/6-atrributes-setup.png" class="gif-border">

## 步骤 4：在 Label Studio 中完成配置

1. **上传 IdP 元数据：**
   - 返回 Label Studio SSO 与 SAML 设置页面。
   - 滚动到 **从身份提供商添加元数据**。
   - 上传你从 Google Admin console 下载的 IdP 元数据文件。

    <img src="/images/google-saml/4-lse-saml-add-metadata.png" class="gif-border">

2. **映射组和角色：**
   - 根据需要设置组到角色和工区的映射。确保组名与 Google 在 SAML 响应中发送的组名匹配。

    <img src="/images/google-saml/14-lse-saml-role-group.png" class="gif-border">

3. **保存配置：**
   - 点击 **保存** 以应用 SSO 配置。

## 步骤 5：在 Google Admin console 中完成配置

1. **返回 Google Admin console**：
   - 从 Google Admin console，转到 **Apps（应用）** > **Web and mobile apps（Web 和移动应用）**。
   - 选择 Label Studio 应用。

    <img src="/images/google-saml/12-assign-group-1.png" class="gif-border">

2. **将 Label Studio 应用分配给组：**
    - 点击 **用户访问** 卡片。 
    - 搜索然后将组分配给应用。 
    - 启用 **服务状态** 开关。 

    <img src="/images/google-saml/13-assign-group-2.png" class="gif-border">
    

## 步骤 6：测试配置

**使用 SSO 登录：**
   - 导航到 Label Studio 登录页面。
   - 点击 **SSO 登录** 按钮，并在提示时输入你的公司域。
   - 你应该被重定向到 Google SSO 登录页面。成功身份验证后，你将被重定向回 Label Studio。

<img src="/images/google-saml/15-lse-sso-login.png" class="gif-border">

## 附加说明

- 如果遇到任何问题，请验证 SAML 属性和 URL 在 Label Studio 和 Google Admin Console 中都已正确配置。

有关更多详细信息，你可以参考：
- [Label Studio SSO 设置指南](auth_setup)
- [关于 SAML 的 Google 官方文档](https://support.google.com/a/answer/6087519?hl=en#zippy=%2Cstep-add-the-custom-saml-app)
