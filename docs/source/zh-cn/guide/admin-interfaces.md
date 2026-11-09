---
title: Interface admin settings
short: Interfaces
tier: enterprise
type: guide
hide_menu: false
order: 0
order_enterprise: 363
meta_title: Interface admin settings
section: "Manage Your Organization"
parent_enterprise: "admin_settings"
date: 2025-02-18 12:03:59
---


**组织 > 设置 > Interfaces** 页面是所有者（Owner）和管理员（Admin）为组织开启 Interfaces 功能，并为每个 Interface 运行所依赖的安全 `allowlist`（白名单）进行配置的地方。

这些设置会统一应用于组织内的每一个 Interface —— 包括内嵌的 iframe、主标注画布、产品内预览，以及“本地开发”（Develop Locally）演练场。

从 **组织 > 设置 > Interfaces** 访问这些设置。

!!! info 我需要配置哪个区块？
    - 要让某个 Interface **调用外部 API/服务**（`fetch`/XHR/WebSocket）→ **API origins（API 来源）**。
    - 要让某个 Interface **从 CDN 加载第三方脚本/样式表** → **高级：外部脚本（Advanced: external scripts）**。
    - 要使用**完全不依赖外部网络**的库，请将其打包进 Interface。此处无需配置。参见 [使用外部库与服务](interfaces-libraries)。

## 启用 Interfaces

切换 **允许本组织的项目使用 Interfaces（Allow projects in this organization to use Interfaces）**，即可在组织范围内启用 Interfaces 功能。

## API origins

Interfaces 允许通过 `fetch`、`XHR` 或 `WebSocket`（即 CSP 的 `connect-src` 指令）访问的主机。

| 规则 | 详情 |
| --- | --- |
| 格式 | 包含协议方案在内的完整来源（origin），例如 `https://api.example.com`。 |
| 通配符 | 不允许（不能使用 `*` 或 `*.example.com`）。请列出具体的多个主机。 |
| 空列表 | 空列表表示 Interfaces **没有出站网络** —— 它们只能调用你的 Label Studio 服务器。 |
| 空白符与逗号 | 会被拒绝。每个条目添加一台主机。 |

!!! info 提示
    你的 Label Studio 服务器自身的来源始终会被自动允许 —— 无需手动添加。只需列出第三方主机。

## Iframe 能力

Interfaces 允许通过 iframe 的 `allow=` 属性请求的能力。点击任意标签（chip）即可开启或关闭它。该列表刻意保持精简：

| 能力 | 典型用途 |
| --- | --- |
| `autoplay` | 无需用户交互即可播放音频或视频。 |
| `camera` | 从设备摄像头读取数据。 |
| `clipboard-write` | 以编程方式复制到剪贴板。 |
| `encrypted-media` | 播放受 DRM 保护的媒体。 |
| `fullscreen` | 进入全屏模式。 |
| `geolocation` | 读取用户的位置信息。 |
| `idle-detection` | 检测用户是否处于空闲状态。 |
| `language-detector` | 使用设备端的语言检测 API。 |
| `microphone` | 从设备麦克风读取数据。 |
| `on-device-speech-recognition` | 在本地运行语音识别。 |
| `storage-access` | 请求未分区的存储访问权限。 |

!!! warning
    保持最小化。每一个被启用的能力，都是某个 Interface（包括第三方或实验性的 Interface）可能调用的入口。只有当组织内有 Interface 确实需要时才启用。

## 高级：外部脚本

使用此区块，允许 Interfaces 从一组受信任的主机加载第三方的 `<script>` 和 `<style>` 标签。

启用 **允许外部脚本/样式表（Allow external scripts / stylesheets）** 以解锁来源列表，然后添加一个或多个脚本来源，例如 `https://cdn.jsdelivr.net`。

| 规则 | 详情 |
| --- | --- |
| 协议方案 | 必须为 `https://`。HTTP 来源会被拒绝。 |
| 格式 | 仅来源 —— 不能包含路径、查询字符串、凭据或片段（fragment）。 |
| 通配符 | 不允许。 |
| 开关 | 除非 **允许外部脚本（Allow external scripts）** 复选框处于开启状态，否则来源会被忽略。关闭复选框会在保存时清空列表。 |

!!! warning
    从这些来源加载的脚本会以 Interface 的完整权限运行，并可读取该 Interface 正在渲染的任何任务数据。仅添加你完全信任的主机。大多数组织应保持此区块为禁用状态。
