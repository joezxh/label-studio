---
title: Use external libraries and services in an Interface
short: External libraries & APIs
tier: enterprise
type: guide
order: 0
order_enterprise: 146
meta_title: Use external libraries and network services in Label Studio Interfaces
meta_description: "How to call external APIs, load third-party packages, or bundle libraries directly into a Label Studio Interface, and which security setting each one needs."
section: "Interfaces"
---

Interface 作为 Label Studio 编辑器内部的一个 **沙箱模块（sandboxed module）** 运行。默认情况下，该沙箱 **没有出站网络，也无法加载第三方代码**。这是一种刻意为之的安全姿态，当你需要时可以放宽它。

常见的情况小而具体：从你的 ML 后端获取预测、用 `date-fns` 格式化日期、用 `zod` 校验载荷、从瓦片服务器拉取地图瓦片，或用 `d3` 绘制图表。当你的 Interface 需要外部 API 或第三方库时，你可以通过以下三种方式之一精确启用你所需的内容。

最常见的困惑点：**“调用外部 API”与“使用外部包”是在不同的地方配置的。** 把主机错误地加在错误的区块中会静默地不起任何作用。本页说明哪个是哪个。

## 三种路径一览

| 你想要…… | 示例 | 在哪里启用 |
|---|---|---|
| 从你的 Interface **调用外部 HTTP 服务** | 用 `fetch()` 你的 ML 后端、地理编码器、内部微服务、瓦片服务器 | **组织 > 设置 > Interfaces → API origins** |
| 在运行时 **从 CDN 加载第三方包** | 通过 `<script>` 标签从 `cdn.jsdelivr.net` 拉取 `three.js` 或 `d3` | **组织 > 设置 > Interfaces → 高级：外部脚本（Advanced: external scripts）** |
| **在无外部网络的情况下使用第三方包** | 将 `three.js` *打包进* Interface 并发布它 | 无需配置。代码是自包含的。 |

## 选择路径

- **要通过 HTTP 调用服务？** → **API origins**（路径 1）。
- **需要第三方库，且可以信任 CDN？** → **高级：外部脚本（Advanced: external scripts）**（路径 2）。
- **需要无外部依赖 / 离线（air-gapped）/ 严格安全的第三方库？** → **本地打包（Bundle locally）**（路径 3）。*默认首选。*

你也可以将它们组合使用。一个point-cloud（点云）Interface 可能 **在本地打包 `three.js`**（路径 3）*并且* 在 **API origins** 下 **允许列表（allow-list）你的瓦片/资源服务器**（路径 1），以便它能获取要渲染的数据。

!!! info 我可以使用第三方库吗？
    可以。Interface 源码不能使用 `import` / `require`，因为每个 Interface 是一个自包含模块，而不是 ES 模块。这是对 **模块语法** 的限制；第三方代码仍然没问题。通过从允许列表的 CDN 加载（路径 2）或将其打包进 Interface（路径 3）来引入库。

---

## 路径 1：调用外部 API 或服务（API origins）

当你的 Interface 需要通过 `fetch`、`XHR` 或 `WebSocket` 与 HTTP 服务通信时使用此路径。例如：将选中的区域发送到 ML 后端进行推理、对地址进行地理编码，或拉取地图瓦片。

1. 前往 **组织 > 设置 > Interfaces → API origins**。
2. 添加确切的来源（协议方案 **和** 主机），例如 `https://api.example.com`。每个条目一个主机。
3. 保存。你的 Interface 对该来源的 `fetch()` 调用现在会成功。

| 规则 | 详情 |
|---|---|
| 格式 | 完整的来源，包含协议方案（`https://host`）。 |
| 通配符 | 不允许（不能使用 `*` 或 `*.example.com`）。显式列出每个主机。 |
| 你的 LS 服务器 | 始终自动允许。不要添加它；只需列出第三方主机。 |
| 空列表 | **没有出站网络。** Interface 只能访问你的 Label Studio 服务器。 |

**API origins** 只管理 **数据请求**。它 **不能** 让你从该主机加载 `<script>`。如果你在这里添加了一个包 CDN 却期望加载库，什么都不会发生（为此请使用路径 2）。

!!! info 示例
    要将自定义 ML 后端连接到 Interface，你在此处将后端的来源加入允许列表。这正是让 Interface 能够向它发送区域载荷并渲染预测的原因。这里没有安装任何包；这是一次 API 调用。

---

## 路径 2：从 CDN 加载包（高级：外部脚本）

当你想要在运行时直接从 CDN 拉取库的便利性，并且你 **完全信任该主机** 时使用此路径。

1. 前往 **组织 > 设置 > Interfaces → 高级：外部脚本（Advanced: external scripts）**。
2. 打开 **允许外部脚本/样式表（Allow external scripts / stylesheets）**。
3. 添加一个或多个脚本来源，例如 `https://cdn.jsdelivr.net`。
4. 在你的 Interface 中，从该来源加载库（例如，注入一个 `<script>` 并使用其全局变量）。

| 规则 | 详情 |
|---|---|
| 协议方案 | 必须为 `https://`。HTTP 来源会被拒绝。 |
| 格式 | 仅来源（无路径、查询字符串、凭据或片段）。 |
| 通配符 | 不允许。 |
| 开关 | 除非复选框处于开启状态，否则来源会被忽略。关闭它会在保存时清空列表。 |

这与 **API origins** 是不同的设置。此处列出的主机可以向你的 Interface 提供可执行代码；而在 **API origins** 下列出的主机不能，反之亦然。

!!! warning
    从这些来源加载的脚本会以 Interface 的 **完整权限** 运行，并且可以读取该 Interface 正在渲染的任何任务数据。仅添加你完全信任的主机。大多数组织应保持此区块为禁用状态，并优先使用 **路径 3**。

---

## 路径 3：在本地打包包（无需允许列表，无网络）

**推荐用于锁定、本地部署（on-premise）或离线（air-gapped）部署，以及任何宁愿不开放出站来源或不信任 CDN 的团队。**

由于 Interface 是一个 **单一的自包含模块**，第三方库可以随你的 Interface 代码 *一起* 携带。该库成为你发布内容的一部分：没有 CDN、没有 `<script>` 标签、没有允许列表条目，并且在标注时也没有出站网络。

**如何操作**

1. 获取一个 **附加到某个变量的浏览器构建**：一个预构建的单文件 `dist`，或使用打包器生成一个（例如，`esbuild --bundle --format=iife --global-name=MyLib`）。Interface 源码会被编译但 **不会** 为你打包，因此请先将依赖解析到这一个文件中。避免使用 **ES 模块** 构建：不支持 `import` / `export` 语句。
2. 将那段代码包含进你的 Interface 源码中，并通过它定义的变量/全局变量来引用该库。在你的代码中 **不要** 使用 `import` / `require`。
3. 像往常一样验证、预览并发布（通过 Interfaces 编辑器，或 `label-studio-sdk interface validate/preview/sync`）。该库会随发布的 Interface 一起发布。

**以这种方式运行良好的内容**

- 纯计算和渲染库：日期/数字工具、校验（例如 `zod`）、图表/几何，以及浏览器内渲染器。
- 标准的浏览器渲染 API：**Canvas 和 WebGL 在沙箱中可用**，因此像 `three.js` 这样的库可以在 Interface 内部渲染。（*iframe capabilities* 列表管理的是设备特性，如摄像头和麦克风，而非 2D/3D 渲染。）

**需要牢记的限制**

- **使用 IIFE / 全局构建。** 不支持 `import` / `export` 语句，并且依赖顶层 `module.exports` 或 `require(...)` 的构建可能无法通过验证。你也无法在标注时 `require()` 一个 npm 包；请将依赖打包进文件中，而不是 require 它，并引用它定义的变量/全局变量。
- 该库必须在 **沙箱内的浏览器中运行**：没有 Node.js API，无法访问父页面的 `window`/`document`，没有持久的 `localStorage`/`sessionStorage`，并且该库自身执行的任何网络仍然受 **API origins**（路径 1）管理。
- 打包后的代码会成为 Interface 存储内容（body）的一部分。没有固定的大小限制，但非常大的包会增加加载和解析时间，所以请留意这一点。

---

## 实际示例：渲染大型点云

假设你需要在查看 LiDAR 点云并期望使用 `three.js` 来渲染它们。

- **离线 / 严格安全：** **在本地打包 `three.js`**（路径 3）。不添加任何允许列表；渲染器随 Interface 一起发布。如果点云数据是从服务获取的，请在 **API origins**（路径 1）下添加该数据主机。
- **可接受 CDN：** 在 **高级：外部脚本（Advanced: external scripts）**（路径 2）下将 CDN 加入允许列表，并从那里加载 `three.js`。

点云 **渲染** 之所以可行，是因为 WebGL 在沙箱中可用。真正的限制是 **数据大小和性能**：非常大的点云会给浏览器/WebGL 内存带来压力，无论库如何打包都是如此，因此请用有代表性的数据进行测试，并在需要时降采样或分块（tile）。

!!! info
    如今，一个重型第三方渲染器已经随一个标准 Interface 一起发布：**Document AI** 模板使用来自其打包代码的 **PDF.js** 来渲染 PDF。这是一个具体先例，表明大型库可以在 Interface 内部运行，包括那些在内部编译或将工作卸载到 Web worker 的库。

---

## 故障排查

| 症状 | 可能原因 | 修复 |
|---|---|---|
| 对我的服务的 `fetch()` 被阻止 | 主机不在 **API origins** 中，或被错误地列在 **外部脚本** 下。 | 在 **API origins**（路径 1）下添加确切的来源。 |
| 我的 CDN `<script>` 无法加载，但我已将主机添加到 **API origins** | **API origins** 管理的是数据请求，而不是脚本加载。 | 在 **高级：外部脚本** 下添加主机并启用开关（路径 2）。 |
| “Interface 不能使用包” | 误将不允许 `import` 的规则理解为对所有第三方代码的禁令。 | 你不能 `import` npm 包，但你可以将它们打包进来（路径 3）或从允许列表的 CDN 加载它们（路径 2）。 |
| 打包的库在应用中可用但在本地验证失败 | 该构建依赖顶层的 `module.exports` / `require`。 | 使用 **IIFE / 全局** 构建（例如 `esbuild --format=iife --global-name=…`）并引用它定义的变量。 |
| 库需要 Node API 或父级 `window` | 它不兼容浏览器/沙箱。 | 使用浏览器构建；将其任何网络调用置于 **API origins** 之后。 |
