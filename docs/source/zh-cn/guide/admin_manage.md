---
title: 管理用户账户
short: 管理用户账户
tier: opensource
type: guide
order: 372
order_enterprise: 0
meta_title: 管理用户账户
meta_description: 在 Label Studio 社区版中管理现有用户账户
section: "管理你的组织"
date: 2024-02-06 16:36:44
---

!!! error Enterprise
    在 Label Studio 社区版中，用户管理可用的选项相对有限。 
    
    在 Label Studio Enterprise 中，你可以为用户设置角色、限制其权限、删除和停用用户，并查看用户操作的详细日志。有关 Label Studio Enterprise 用户管理功能的更多信息，请参阅企业文档中的 [用户管理概述](https://docs.humansignal.com/guide/manage_users)。要开始免费试用，请[点击此处](https://app.heartex.com/user/trial)。  

## 从命令行检索用户信息

启动 Label Studio 后，你可以从命令行检索有关用户的信息，包括用户的 API 用户令牌。

从命令行运行以下命令：

```bash
label-studio user --username <username>
```

你可以看到用户信息，包括其 API 令牌，作为响应的最后一行。例如：

```
=> User info:
{'id': 1, 'first_name': 'User', 'last_name': 'Somebody', 'username': 'label-studio', 'email': 'example@labelstud.io', 'last_activity': '2021-06-15T19:37:29.594618Z', 'avatar': '/data/avatars/img.jpg', 'initials': 'el', 'phone': '', 'active_organization': 1, 'token': '<api_token>', 'status': 'ok'}
```

用户也可以从 Label Studio 应用中检索自己的令牌。有关更多信息，请参阅 [访问令牌](access_tokens)。 


## 在 Label Studio 中查看现有账户

你可以从 Label Studio 查看组织用户列表：

1. 打开 Label Studio 并点击左上角菜单。 
2. 选择 **组织**。 

点击用户的行以查看其活动的更多详细信息，例如他们最后活跃的时间、他们创建了哪些项目，以及他们为哪些项目做出了贡献。 

## 重置密码

如果你忘记密码或出于安全原因定期更改密码，可以从命令行更改。

在运行 Label Studio 的服务器上，运行以下命令。然后在提示时输入用户名和新密码：

```bash
label-studio reset_password
```

你也可以使用可选的命令行参数来重置用户名的密码。

- 指定用户名并在提示时输入密码：

    ```bash
label-studio reset_password --username <username>
New password:
```

- 同时指定用户名和密码：

    ```bash
label-studio reset_password --username <username> --password <password>
```
