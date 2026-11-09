---
title: Manage your user account settings
short: Account and settings
tier: all
type: guide
order: 378
order_enterprise: 378
meta_title: User Account and Settings
meta_description: Update your user account and settings in Label Studio
section: "Manage Your Organization"
parent_enterprise: "manage_users"
date: 2024-01-03 12:03:59
---

要访问你的用户账户和设置，请点击右上角的用户图标并选择 **Account & Settings（账户与设置）**。

<div class="opensource-only">

![账户与设置选项截图](/images/admin/account_settings.png)

</div>

<div class="enterprise-only">

![账户与设置选项截图](/images/admin/account_settings_lse.png)

</div>

## 个人信息

在 Label Studio 中创建账户后，你可以更新以下内容：

* 名字
* 姓氏
* 电话号码
* 个人资料图片（使用不大于 1200 x 1200 像素或 1024 KB 的图片）

由于你的电子邮件地址就是你的用户名，因此你无法更新它。如果你需要更改电子邮件地址，则需要使用新的电子邮件地址创建另一个用户。

## 快捷键

使用此页面为你的用户账户配置自定义快捷键。

### 操作

| 操作 | 描述 |
| --- | --- |
| **导出快捷键（Export Hotkeys）** | 生成一个 JSON 文件，你可以与其他 Label Studio 用户共享。 |
| **导入快捷键（Import Hotkeys）** | 复制并粘贴 JSON 格式的自定义快捷键映射。 |
| **重置为默认值（Reset to Defaults）** | 将所有快捷键重置为其默认值。 |

### 设置自定义快捷键

对于每个快捷键，点击每个操作旁边列出的默认快捷键。然后，在出现提示时，按下你想要使用的按键。

!!! note
    每个快捷键可以是一个单个字符键（数字、字母、符号），也可以是字符键与多个控制键的组合（例如 `Shift`、`Control`、`Option` 等）。

<div style="width: 80%; margin-left: auto; margin-right: auto">

![自定义键截图](/images/admin/global-hotkeys.png)

</div>

## 电子邮件偏好

使用此页面选择你想要接收哪种类型的电子邮件通知。

## 成员资格信息

在此页面上，你可以找到有关你的组织的信息，例如组织的创建时间和所有者（最初创建 Label Studio 组织的用户）的电子邮件地址。

<div class="enterprise-only">

你还可以查看你的 [用户角色](admin_roles) 以及你贡献内容的高级摘要。

</div>

<div class="opensource-only">

你还可以查看你贡献内容的高级摘要。

</div>

## 个人访问令牌

!!! note
    此选项是否出现取决于 [你的组织级别的设置](access_tokens#Enable-API-keys-for-an-organization)。

点击 **Create（创建）** 以生成一个访问令牌。创建令牌时，请务必将其保存在安全的地方，因为它只会显示一次。

虽然个人访问令牌可与 Label Studio SDK 无缝协作，但如果你使用的是 HTTP API 请求，则需要采取额外的步骤。请参阅 [个人访问令牌与 API](access_tokens#Personal-access-tokens-and-the-API)。

<div class="enterprise-only">

你的组织管理员可以选择为所有个人访问令牌设置过期日期。

</div>

## 旧版令牌

!!! note
    此选项是否出现取决于 [你的组织级别的设置](access_tokens#Enable-API-keys-for-an-organization)。

此令牌是为你预先生成的。旧版令牌对于某些 API 任务更易于使用，但通常安全性较低。有关更多信息，请参阅 [访问令牌](access_tokens)。

点击 **Renew（更新）** 以生成新令牌。任何使用你旧令牌的现有脚本都将失去其授权，需要更新以包含你的新令牌。
