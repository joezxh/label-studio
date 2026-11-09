---
title: Set up Databricks UC volume storage
short: Databricks
type: guide
tier: all
order: 155
order_enterprise: 155
meta_title: Set up Databricks storage
meta_description: "How to set up source and target storage for Databricks (UC Volumes)."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

<div class="opensource-only">

在 Label Studio Enterprise 中，你可以连接到 Databricks Unity Catalog（UC）卷作为你的源存储和目标存储。

有关更多信息，请参阅我们 Enterprise 文档中的 [Databricks Files (UC Volumes)](https://docs.humansignal.com/guide/storage_databricks)。

</div>

<div class="enterprise-only">

将 Label Studio Enterprise 连接到 Databricks Unity Catalog（UC）卷，以将文件作为任务导入，并将标注作为 JSON 导出回你的卷。此连接器使用 Databricks Files API，并且仅在代理模式下运行（[预签名 URL](storage#Pre-signed-URLs-vs-Storage-proxies) 不被 Databricks 支持）。

## 先决条件
- Databricks 工作区 URL（Workspace Host），例如 `https://adb-12345678901234.1.databricks.com`（或 Azure 域）。

    请参阅 [创建工作区](https://docs.databricks.com/aws/en/admin/workspace/) 和 [获取工作区对象的标识符](https://docs.databricks.com/aws/en/workspace/workspace-details#workspace-url)。
- 以下之一，所有这些都必须具有访问 Files API 的权限：
  - Databricks Personal Access Token (PAT)（个人访问令牌）
  - Databricks Service Principal（服务主体）
  - 用于 Azure Databricks 的 Azure AD Service Principal

    请参阅下面的 [认证选项](#Authentication-options)。

- 位于 `/Volumes/<catalog>/<schema>/<volume>` 下的 UC 卷路径，其中包含你想要标注的文件。

    请参阅 [什么是 Unity Catalog 卷？](https://docs.databricks.com/aws/en/volumes/)。

- 必须为你的组织启用 [代理](storage#Pre-signed-URLs-vs-Storage-proxies)（**Organization > Usage & License > Features（组织 > 使用与许可证 > 功能）**）。

- 在开始之前，请查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。

## 认证选项

### PAT（个人访问令牌）

使用在 Databricks 工作区 UI 中创建的长生命周期令牌进行的传统认证

- **优点**：设置简单，随处可用，不需要付费账户
- **缺点**：长生命周期凭证，与用户账户绑定
- **最适合**：开发、测试、个人项目

#### 生成 PAT

你可以从 Databricks 工作区下的 **Account > Settings > Developer > Access tokens（账户 > 设置 > 开发人员 > 访问令牌）** 生成令牌。请参阅 [Databricks 个人访问令牌认证](https://docs.databricks.com/en/dev-tools/auth/pat.html)。

在 Label Studio 中配置存储时，系统会要求你提供访问令牌。

### Databricks 服务主体

这是使用在 Databricks 账户控制台中创建的服务主体的基于 OAuth 的认证。
适用于所有云平台（AWS、GCP、Azure）。

- **优点**：不与用户账户绑定，OAuth 令牌自动刷新
- **缺点**：需要 Databricks 账户控制台访问权限（免费层不可用）
- **最适合**：生产工作负载、自动化、CI/CD
- **令牌端点**：`{workspace_host}/oidc/v1/token`

#### 设置服务主体认证

1. 转到 Databricks 账户控制台，选择 **User management > Service principals > Add service principal（用户管理 > 服务主体 > 添加服务主体）**。
2. 在服务主体设置下生成 OAuth 密钥（**Secrets > Generate secret（密钥 > 生成密钥）**）。
3. 保存 `client_id` 和生成的密钥。
4. 将服务主体分配到你的工作区。

请参阅 [管理服务主体](https://docs.databricks.com/aws/en/admin/users-groups/manage-service-principals) 和 [使用 OAuth 授权服务主体访问 Databricks](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html)。

在 Label Studio 中配置存储时，系统会要求你提供以下内容：

* **Client ID（客户端 ID）** —— 这是你的服务主体的 **Application ID（应用程序 ID）**。
* **Client Secret（客户端密钥）** —— 这是你创建服务主体后生成的客户端密钥。

!!! note

    对于服务主体认证，Label Studio 会自动获取并刷新 OAuth 访问令牌（约 1 小时有效期）。无需手动轮换令牌。

### 用于 Azure Databricks 的 Microsoft Entra 服务主体

使用 Entra 应用注册进行的基于 OAuth 的认证。
仅限 Azure Databricks。

- **优点**：与 Azure 身份管理集成，OAuth 令牌自动刷新
- **缺点**：仅限 Azure，需要 Entra 配置，需要 Databricks 账户控制台访问权限（免费层不可用）
- **最适合**：具有集中身份管理的 Azure 环境
- **令牌端点**：`https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token`

#### 设置服务主体认证

1. 打开 [Microsoft Entra 管理中心](https://entra.microsoft.com/#home)。
2. 在右侧选择 **App registrations（应用注册）** 并点击 **New registration（新注册）**。请参阅 [注册应用程序](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)。
3. 在 Overview（概述）下，记下 **Application (client) ID（应用程序（客户端）ID）** 和 **Directory (tenant) ID（目录（租户）ID）**。
4. 在 **Certificates & secrets（证书和密钥）** 下，添加一个新的客户端密钥。
5. 转到 Databricks 账户控制台，选择 **User management > Service principals > Add service principal（用户管理 > 服务主体 > 添加服务主体）**。
6. 输入来自 Entra 的 Application ID（应用程序 ID）。
7. 将服务主体分配到你的工作区。

有关更多信息，请参阅 [使用 OAuth 授权服务主体访问 Azure Databricks](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/auth/oauth-m2m)。

在 Label Studio 中配置存储时，系统会要求你提供以下内容：

* **Azure Tenant ID（Azure 租户 ID）** —— 这是可从你的应用注册的 **Overview（概述）** 页面获取的 **Directory (tenant) ID（目录（租户）ID）**。
* **Client ID（客户端 ID）** —— 这是可从你的应用注册的 **Overview（概述）** 页面获取的 **Application (client) ID（应用程序（客户端）ID）**。
* **Client Secret（客户端密钥）** —— 这是你在注册应用程序后生成的客户端密钥。

!!! note

    对于服务主体认证，Label Studio 会自动获取并刷新 OAuth 访问令牌（约 1 小时有效期）。无需手动轮换令牌。

## 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **Settings > Cloud Storage > Add Source Storage（设置 > 云存储 > 添加源存储）**。

选择 **Databricks Files (UC Volumes)（Databricks 文件（UC 卷））** 并点击 **下一步**。

#### 配置连接

填写以下字段，然后点击 **测试连接（Test connection）**：

<div class="noheader rowheader">

| | |
| --- | --- |
| Storage Title（存储标题） | 输入一个名称，使其在 Label Studio 中显示为该存储连接。 |
| Workspace Host（工作区主机） | 输入你的工作区 URL，例如 `https://<workspace-identifier>.cloud.databricks.com` |
| Authentication Method（认证方法） | 选择一种认证方法，然后输入所需的信息。请参阅上面的 [认证选项](#Authentication-options)。 |
| Catalog（目录） <br> Schema（模式） <br> Volume（卷） | 指定你的卷路径（UC 坐标）。你可以从 Databricks 中的 **Catalog Explorer（目录资源管理器）** 找到它（见下面的屏幕截图）。 |

</div>

![Screenshot of Databricks UI and LS UI](/images/storages/databricks-volume.png)

#### 导入设置与预览

填写以下字段，然后点击 **加载预览（Load preview）** 以确保你正在同步正确的数据：

<div class="noheader rowheader">

| | |
| --- | --- |
| Bucket Prefix（前缀） | 可选地，输入你要在其中使用的卷内的目录名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Import Method（导入方法） | 选择是希望为容器中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤存储桶对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/databricks/sync)。

!!! note "URI 方案"
    要直接在任务 JSON 中引用 Databricks 文件（而不使用源存储），请使用 Label Studio 的 Databricks URI 方案：

    `dbx://Volumes/<catalog>/<schema>/<volume>/<path>`

    示例：

    `{ "image": "dbx://Volumes/main/default/dataset/images/1.jpg" }`

!!! note "故障排查"
    - 如果你的文件预览返回零个文件，请验证 `/Volumes/<catalog>/<schema>/<volume>/<prefix?>` 下的路径以及你的权限。
    - 确保 Workspace Host 没有尾随斜杠，并且与你的工作区域匹配。
    - 如果预览可用但媒体无法加载，请确认代理模式被允许用于你的组织（在 Label Studio 中的 **Organization > Usage & License > Features（组织 > 使用与许可证 > 功能）**），并且网络出口允许 Label Studio 访问 Databricks。

!!! warning "代理与安全性"
    此连接器通过 Label Studio 后端流式传输数据，并支持 HTTP Range。Databricks 不支持预签名 URL，因此此选项在 Label Studio 中也不适用。

## 创建目标存储连接

重复上一节中的步骤，但使用 **添加目标存储（Add Target Storage）**。使用相同的工作区主机、令牌和卷路径（UC 坐标）。

对于你的 **Bucket Prefix（前缀）**，设置一个要使用的导出文件夹（例如 `exports/${project_id}`），并确定是否要允许从目标存储中删除文件。

启用文件删除后，如果你在 Label Studio 中删除标注（通过 UI 或 API），Label Studio 也将删除该目标存储中此存储连接对应的导出 JSON 文件。

请注意，这仅影响由该目标存储导出的文件，而不影响你的源媒体或任务。你的 PAT 或 SP 权限也必须允许删除。

添加后，点击 **同步（Sync）** 以将标注作为 JSON 文件导出到你的目标卷。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/databricks/sync)。

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)

</div>
