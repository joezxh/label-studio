---
title: 活动日志
short: 活动日志
tier: enterprise
type: guide
order: 0
order_enterprise: 354
meta_title: Label Studio 中的用户活动日志
meta_description: 如何在 Label Studio 中查看用户活动日志
section: "管理你的组织"
date: 2024-02-05 16:40:16
---

你可以从 **组织 > 活动日志** 页面查看用户日志。只有具有管理员或所有者角色的用户才能访问此页面。

!!! note
    在 Label Studio Enterprise Cloud (`app.humansignal.com`) 中，活动日志保留 180 天。 
    
    在 Label Studio Enterprise 本地部署版中，活动日志的保留期限没有限制。

日志包含用户 ID、IP 地址、时间戳，以及通过记录 API 请求所执行的操作类型。你可以通过点击 API 请求来了解每个正在执行的操作的更多信息。

!!! note
    在某些情况下，点击 API 请求不会返回额外信息。这通常是因为请求包含敏感信息，例如密码。

你可以按以下条件筛选日志：

* 用户
* 项目
* 请求类型（GET、POST、PATCH、DELETE）
* 日期范围
* 请求关键字
