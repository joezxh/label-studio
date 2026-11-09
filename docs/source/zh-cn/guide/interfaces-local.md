---
title: Develop an Interface locally
short: Develop locally
tier: enterprise
type: guide
order: 0
order_enterprise: 143
meta_title: Interfaces
meta_description: "Build and iterate on custom labeling Interfaces from your terminal using the Label Studio SDK CLI"
section: "Interfaces"
---

你可以从自己的编辑器和自己的编码 agent（Claude、Codex 或 Cursor）构建或迭代一个 Interface，而不使用产品内置的 agent。**这在任何部署上都是一等选项（许多团队更喜欢它），并且是在自托管或本地部署（on-prem，包括离线 air-gapped）上构建 Interface 的方式，因为在这些环境中通过 Agent 创建（Create with Agent，一项 Label Studio Cloud 功能）不可用。**

你在磁盘上编写 JSX，针对你的 Label Studio 实例进行实时预览，并在准备好发布时将结果同步回去。

当你希望以下情况时，本地开发很有用：

- 使用你已经设置好的编码 agent 或 IDE。
- 针对一个已检出的 Interface 副本离线工作，然后再将更改推送回去。
- 将一个现有的 React 模型草图带入 Label Studio。
- 在发布之前针对你的 Interface 运行自动化验证和 Playwright 场景。

<iframe width="560" height="315" src="https://www.youtube.com/embed/-xOjbN4PAhk?si=CUtfpYCxYQc0lRmx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 1. 安装 label-studio-sdk 包并检查你的设置

在开始之前，请确保你具备：

- **[`label-studio-sdk` Python 包](https://github.com/HumanSignal/label-studio-sdk)。** 如果你已经安装，请确保版本为 2.0.22 或更高。
   ```bash
   pip install --upgrade label-studio-sdk
   # 或
   poetry add label-studio-sdk
   ```
- Node.js 和 npm 在你的 `PATH` 中可用。
- 你的 Label Studio Enterprise URL 和一个 [API 令牌](access_tokens)。
- 如果希望 agent 协助，已安装一个编码 agent（Claude、Codex 或 Cursor）。

要开始，请在主菜单中选择 **Interfaces**，然后选择 **创建 Interface > 本地开发（Create Interface > Develop Locally）**。

!!! info 提示
    要迭代一个已存在于 Label Studio 中的 Interface，请打开 Interface 详情页并点击顶部栏中的 **本地开发（Develop Locally）**。该对话框会遵循 [版本导航器](interfaces-details#Versions) 中当前选定的版本。

## 2. 安装 create-interface skill

为你的本地编码 agent 安装 [`create-interface-skill`](/skills/interface.html)。该 skill 包含用于在本地处理 Interfaces 的命令和约定，以便你的 agent 能够编写一个有效的 Interface 模块。

在 **本地开发（Develop Locally）** 模态框中，选择你的 agent 并复制安装命令：

| Agent | 安装命令 |
| --- | --- |
| **Claude** | `npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a claude-code` |
| **Codex** | `npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a codex` |
| **Cursor** | `npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a cursor` |

在终端中运行该命令，然后重启你的 agent，使其加载新 skill。每个 agent 只需安装一次 skill。

!!! info 提示
    如果你更愿意手动编写 Interface，可以跳过此步骤。该 skill 是可选的 —— 它只是为你的 agent 提供上下文。

## 3. 初始化 Interface

使用 SDK 提供的命令在本地目录中初始化 Interface：

```bash
export LABEL_STUDIO_URL="https://your-instance.humansignal.com"
export LABEL_STUDIO_API_KEY="<your token>"
label-studio-sdk interface init ./my-interface
cd ./my-interface
label-studio-sdk interface preview .
```

`interface init` 会生成一个起始的 `Screen.jsx`、`task.json` 和 `scenarios.js`，以便你有一个可运行的基线进行构建。

!!! info 提示
    你也可以向各个命令传递 `--lse-url` 和 `--token`，而不是导出它们。如果你针对多个 Label Studio 实例工作，这会很有用。

#### 从现有 Interface 开始

要迭代一个已存在于 Label Studio 中的 Interface，请打开 Interface 详情页并点击顶部栏中的 **本地开发（Develop Locally）**。该对话框会遵循 [版本导航器](interfaces-details#Versions) 中当前选定的版本。

或者，你可以使用：

```bash
label-studio-sdk interface pull --id <interface-id> --version <version-id> ./my-interface
```

该对话框会为你预填 `--id` 和 `--version`。如果没有 `--version`，`pull` 会获取 Interface 的最新版本，包括任何未发布的本地草稿。

## 4. 检查本地设置

运行以下命令来检查你的本地设置：

```bash
label-studio-sdk interface doctor
```

首次验证或 doctor 运行会将 Node 校验器依赖安装到用户缓存目录中。

## 5. 启动实时预览

进入你的 Interface 目录并运行预览命令：

```bash
cd ./my-interface
label-studio-sdk interface preview .
```

这会在 Label Studio 中打开一个 **playground**（在 `interfaces/playground` URL），它与你的本地环境实时连接。playground 会监视你的源文件 —— 每次保存都会实时将你最新的更改反映到预览中。

例如，如果你的 Label Studio 实例位于 `https://your-instance.humansignal.com`，playground 将位于 `https://your-instance.humansignal.com/interfaces/playground`。

## 6. 在本地环境中开发

在 playground 运行的情况下，你可以使用你熟悉的本地工具 —— 你的 IDE、终端，或你机器上的编码 agent —— 而不是在产品内编辑。像对待任何其他项目一样保存你的更改，playground 会针对当前的示例任务数据重新渲染。

## 7. 验证 Interface

在同步你的更改之前，验证 Interface 以捕获任何问题：

```bash
label-studio-sdk interface validate .
```

静态验证会检查 JSX 编译、最终的模块形态、schema 导出，并针对 `getResults` 和 `parseResults` 运行冒烟测试。若要同时运行你在 `scenarios.js` 中定义的任何由浏览器驱动的 Playwright 场景，请添加 `--scenario`：

```bash
label-studio-sdk interface validate . --scenario scenarios.js
```

验证也会作为 `sync` 的一部分运行，因此如果你宁愿在同步时捕获问题，可以跳过此步骤。在 `sync` 上使用 `--no-validate` 可完全绕过该检查。

## 8. 将你的更改同步回 Label Studio

一旦你的本地代码准备就绪，运行同步命令以将你的本地目录与 Label Studio 实例同步：

| 模式 | 同步命令 |
| --- | --- |
| **新建 Interface** | `label-studio-sdk interface sync . --title "My Interface" --workspace <id> --publish` |
| **现有 Interface** | `label-studio-sdk interface sync . --message "Describe the change"` |

请注意以下几点：

* 默认情况下，`sync` 会创建一个 **未发布的本地草稿**，以便你可以在发布之前在 Label Studio 中审查该版本。

* 添加 `--publish` 以立即发布该版本，并使其对新项目可用。本地开发对话框在从头开始新建 Interface 时会自动包含 `--publish`，而在迭代现有 Interface 时会省略它。

* 对于新 Interfaces，`--workspace` 标志是可选的。如果你没有指定工作区，该 Interface 将被创建在 [**共享（Shared）** 范围](interfaces#Interface-scope) 中（它可以被任何工作区中的项目使用）。

`sync` 的实用标志：

| 标志 | 描述 |
| --- | --- |
| `--publish` | 立即发布该版本，而不是将其保留为草稿。 |
| `--message "..."` | 在同步版本旁存储一条历史消息。 |
| `--dry-run` | 打印计划执行的操作，而不写入服务器。 |
| `--workspace <id>` / `--workspace-title "..."` | 将新创建的 Interface 放置在特定的工作区中。 |
| `--force` | 即使本地源哈希未更改也上传。 |
| `--no-validate` | 跳过验证关卡（编译仍然是必需的）。 |

成功同步后，CLI 会在你的源文件旁边写入一个 sidecar 文件（`Screen.jsx.ls-interface.json`）。

该 sidecar 以 Label Studio 基础 URL 为键，并记住 Interface ID、工作区、源版本以及最后推送的源哈希，因此未来的 `sync`、`start` 和 `open` 命令不需要 `--id`。

!!! info 提示
    在 **本地开发（Develop Locally）** 模态框中点击 **刷新版本（Refresh Versions）**，以在你的同步之后看到新的草稿或已发布版本出现在 Interface 详情页上。

## 有用的 CLI 命令

完整的命令参考在 [**Interface CLI 指南**](https://github.com/HumanSignal/label-studio-sdk/blob/master/interface-cli.md) 中。在本地开发时最有用的命令是：

| 命令 | 描述 |
| --- | --- |
| `interface init <dir>` | 生成起始 Interface（`Screen.jsx`、`task.json`、`scenarios.js`）。 |
| `interface pull --id <id> <dir>` | 将现有 Interface 下载到本地目录。当未设置 `--version` 时，默认为最新版本（包括草稿）。 |
| `interface preview <dir>` | 打开实时 playground 并监视源文件的更改。 |
| `interface validate <dir>` | 运行静态验证和（可选的）Playwright 场景。 |
| `interface sync <dir>` | 将本地更改推送回 Label Studio。默认创建草稿；添加 `--publish` 以发布。 |
| `interface start <dir>` | 同步 Interface，创建一个使用它的项目，并打开该项目的 Data 标签页。 |
| `interface open <dir>` | 使用本地 sidecar 在 Label Studio 中打开已保存的 Interface。 |
| `interface doctor` | 检查 Node.js、npm、API 令牌和连通性。 |

## 故障排查

| 错误 | 处理方式 |
| --- | --- |
| `node is required for interface validation` | 安装 Node.js 并确保 `node` 在你的 `PATH` 中。 |
| `npm is required to install validator dependencies` | 安装 npm 并重新运行 `interface doctor`。 |
| `source did not compile` | 修复 JSX 语法错误。Interface 文件是作为自包含的 JSX 片段编译的；不支持 `import` / `require` 以及特定于打包器的语法。要使用第三方库，**请将其预打包进单个源文件**（或从允许列表的主机加载）。请参阅 [使用外部库与服务](interfaces-libraries)。 |
| `Module did not return an object` | 让文件中的最终表达式为一个用括号包裹的对象字面量，例如 `({ default: Screen })`。 |
| `Missing getResults` 或 `Missing parseResults` | 静态验证期间的警告，但对于场景验证是必需的。当你需要可靠的保存/加载行为时，请添加这两个函数。 |
| `no sidecar entry` | 针对目标 Label Studio URL 运行 `interface sync`，或向支持它的命令传递 `--id`。 |
| `multiple workspaces titled ...` | 使用数字工作区 ID 传递 `--workspace`，而不是 `--workspace-title`。 |
