---
title: 为 Label Studio Enterprise 设置电子邮件后端
short: 设置电子邮件后端
tier: enterprise
type: guide
order: 0
order_enterprise: 90
meta_title: Label Studio 中的电子邮件后端
section: "安装与设置"
---

在 Label Studio Enterprise 中，你可以配置电子邮件后端以启用通过电子邮件重置密码并接收通知。设置电子邮件后端有三个可用选项：
* 虚拟控制台电子邮件后端 - 所有电子邮件都将打印在应用控制台中。
* SMTP 后端
* [Sendgrid 后端](https://sendgrid.com/)

### 虚拟控制台后端

虚拟控制台电子邮件后端是一个用于测试目的简单选项。配置此后端后，应用生成的所有电子邮件都将打印在应用控制台中，而不是发送给收件人。

```bash
FROM_EMAIL = Label Studio <hello@labelstud.io>

# 选项 1：应用控制台
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### SMTP 后端

SMTP（简单邮件传输协议）后端允许你使用自定义 SMTP 服务器发送电子邮件。这在配置电子邮件传递选项方面提供了灵活性，并且可以与各种电子邮件服务提供商集成。

更多详细信息可以在此处找到：https://docs.djangoproject.com/en/4.2/topics/email/#smtp-backend。如果你的 SMTP 配置与证书或主机名验证不兼容，我们提供了
`label_studio.core.utils.mail.NoVerificationEmailBackend`，它可以代替 Django 默认的 `smtp.EmailBackend` 使用，但请注意此选项安全性较低。请参阅 https://docs.djangoproject.com/en/5.0/releases/4.2/#miscellaneous 了解更多信息。

```bash
# SMTP 服务器，
FROM_EMAIL=Label Studio <hello@labelstud.io>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=USERNAME@gmail.com
EMAIL_HOST_PASSWORD=PASSWORD # 这是你的账户密码，或者如果你在 Google 账户上启用了 2fa，则是单独的应用密码
EMAIL_USE_TLS=1
EMAIL_USE_SSL=0
# EMAIL_SSL_KEYFILE=/path/inside/of/ls/container/key  # 可选
# EMAIL_SSL_CERTFILE=/path/inside/of/ls/container/cert  # 可选
EMAIL_TIMEOUT=60
```

### Sendgrid 后端

Sendgrid 后端利用 Sendgrid API 发送电子邮件。此选项需要活跃的 Sendgrid 账户和用于身份验证的 API 密钥。Sendgrid 后端提供易于使用且可靠的电子邮件传递服务。

```bash
# 选项 2：Sendgrid
EMAIL_BACKEND=sendgrid_backend.SendgridBackend
SENDGRID_API_KEY=<SENDGRID-API-KEY>
```
