---
title: Add users to Label Studio
short: Add users
type: guide
tier: opensource
order: 369
order_enterprise: 0
meta_title: Add users in Label Studio Community Edition
meta_description: Sign up for Label Studio and invite users to collaborate on your data labeling, machine learning, and data science projects.
section: "Manage Your Organization"
---

注册并创建一个 Label Studio 账户，以开始标注数据并设置项目。

!!! error Enterprise
    在 Label Studio 社区版（Community Edition）中，所有用户都可以访问相同的功能，并可以看到所有项目。

    如果你需要基于角色的访问和权限，请考虑升级到 Label Studio Enterprise。有关 Label Studio Enterprise 用户管理功能的更多信息，请参阅 Enterprise 文档中的 [用户管理概述](https://docs.humansignal.com/guide/manage_users)。要开始免费试用，请 [点击此处](https://app.heartex.com/user/trial)。

## 创建账户

当你首次 [启动 Label Studio](start.html) 时，你会看到注册屏幕。

1. 使用你的电子邮件地址和密码创建一个账户。
2. 登录到 Label Studio。

你创建的账户存储在 Label Studio 服务器的本地，并允许多个标注员在特定数据标注项目上进行协作。

### 通过命令行创建账户

你也可以在启动 Label Studio 时通过命令行创建账户。

```bash
label-studio start --username <username> --password <password> [--user-token <token-at-least-5-chars>]
```

!!! note
    `--user-token` 参数是可选的。如果你不设置用户令牌，系统会自动为用户生成一个。使用用户令牌进行 API 访问。令牌的最小长度为 5 个字符。

## 邀请用户加入 Label Studio

!!! info 提示
    要邀请协作者，你只需要一个 Label Studio 实例，并且你的所有团队成员都应该可以访问它。如果你想构建一个简单的解决方案，将 Label Studio 暴露在你的本地网络之外，可以 [尝试 ngrok](https://labelstud.io/guide/start.html#Expose-a-local-Label-Studio-instance-outside-using-ngrok)。

一旦创建了初始组织账户，你就可以开始邀请用户：

1. 打开 Label Studio 并点击左上角的菜单。
2. 选择 **Organization（组织）**。
3. 在 Organization 页面上，点击 **Add Members（添加成员）**。

从这里你可以复制一个对你的组织唯一的链接。

你可以与用户共享此链接，然后他们可以完成注册过程。

点击 **Reset Link（重置链接）** 以重置该链接。重置后，任何拥有旧链接的人都将无法注册新的用户账户。

!!! warning 安全提示
    重置邀请链接是一项安全措施，应该是控制访问的更广泛策略的一部分，其中包括禁用注册页面。请参阅下面的 [要求新用户必须受邀](#Require-invites-for-new-users)。

## 要求新用户必须受邀

虽然你可以通过邀请链接邀请用户加入你的组织，但这并不能阻止用户通过注册页面注册新账户。

要确保只有拥有邀请链接的用户才能加入，你必须配置你的环境变量。

### 限制本地部署的注册

要禁用注册页面，除非有人使用邀请链接，请在安装 Label Studio 后输入以下命令：

```bash
export LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true
```

### 限制云部署的注册

要将云部署的注册限制为仅限拥有链接的人，请在安装后、启动 Label Studio 之前设置以下环境变量：

```
LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true
LABEL_STUDIO_USERNAME=<username>
LABEL_STUDIO_PASSWORD=<password>

# token 是可选的，如果未设置则会自动生成
LABEL_STUDIO_USER_TOKEN=<token-at-least-5-chars>
```

设置完成后，你可以启动 Label Studio 并使用你设置为环境变量的用户名和密码登录。
