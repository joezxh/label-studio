---
title: Configuration details of SaaS
short: SaaS configuration
type: guide
tier: enterprise
order: 0
order_enterprise: 96
meta_title: app.humansignal.com and app.humansignal.eu Settings
meta_description: This page contains information about the settings that are used on app.humansignal.com and app.humansignal.eu, available to HumanSignal SaaS customers.
section: "Install & Setup"
---

本文档描述了管理 app.humansignal.com（app.heartex.com）交互的 IP 配置、主机名和使用限制。

## 邮件配置

app.humansignal.com（app.heartex.com）通过使用 [SendGrid](https://sendgrid.com/) 从 `humansignal.com` 域发送电子邮件，并拥有其自己的专用 IP 地址：

- `208.117.59.219`

app.humansignal.eu 通过使用 [SendGrid](https://sendgrid.com/) 从 `humansignal.eu` 域发送电子邮件，并在 EU 区域拥有其自己的专用 IP 地址：

- `159.183.231.189`

## IP 范围

### app.humansignal.com（app.heartex.com）

#### 入站流量 IP 地址
- `34.199.69.93`
- `52.22.82.31`
- `3.233.209.176`

#### 出站连接 IP 地址
*用于导入/导出、ML 后端和 Prompts*

- `3.219.3.197`
- `34.237.73.3`
- `44.216.17.242`

### app.humansignal.eu

#### 入站流量 IP 地址
- `3.79.91.185`
- `63.176.196.34`
- `18.153.87.16`

#### 出站连接 IP 地址
*用于导入/导出、ML 后端和 Prompts*

- `52.59.18.15`
- `18.194.85.62`
- `54.93.122.250`

## 主机名列表

要在本地 HTTP(S) 代理或用户端计算机上的其他网页拦截软件中设置允许列表，请添加以下主机名：

- `app.humansignal.com`
- `app.humansignal.eu`

请注意，我们分别通过 https://app.humansignal.com/docs/api 和 https://humansignal.com/ 提供文档和公司页面，这些页面会直接从常用的公共 CDN 主机名加载某些页面内容。

## 使用限制

Label Studio 基于每个访问令牌（Access Token）施加速率限制。如果请求超过了速率限制，将返回一个 429 状态码的响应。建议客户端在这种情况下暂停并在短暂延迟后重试。

| 路径                      | 速率限制                                                 |
|---------------------------|------------------------------------------------------------|
| `/api/projects/*/import`  | `1 request / 1 second`（每秒 1 个请求）                                     |
| `/api/tasks/*/annotations`| `5 request / 1 second`（每秒 5 个请求）                                     |
| `/api`                    | 限制在组织内按用户设置。默认限制为：<br/><br/>每个用户 `15 requests / 1 second`（每秒 15 个请求） |

## 其他操作限制

| 设置                  | 默认限制 |
|--------------------------|---------------|
| 最大导入文件大小 | 200 MB        |
| 页面加载超时    | 90 seconds（秒）    |

## Webhook 限制

以下限制适用于 [webhooks](webhooks.html)：

| 设置                    | 限制      |
|----------------------------|------------|
| Webhook 响应超时 | 10 seconds（秒） |

如果 webhook 连续失败 50 次，系统会自动将其禁用。失败包括任何非 `2xx` 的响应、连接错误，或响应超过 10 秒超时。要重新启用被禁用的 webhook，请解决接收端点的问题，并在项目或组织的 webhook 设置中重新激活该 webhook。

## 活动日志保留期

活动日志保留 180 天。
