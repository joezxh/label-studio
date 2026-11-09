---
title: Set up Microsoft Azure Blob storage
short: Microsoft Azure
type: guide
tier: all
order: 154
order_enterprise: 154
meta_title: Set up Microsoft Azure Blob storage
meta_description: "How to set up source and target storage for Microsoft Azure Blob storage."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

将你的 [Microsoft Azure Blob 存储](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) 容器连接到 Label Studio。有关 Label Studio 如何保护对云存储的访问的详细信息，请参阅 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage)。

## 为 Azure blob 存储设置 CORS

如果你计划使用代理存储，可以跳过此步骤。

如果你计划使用预签名 URL，则必须配置 CORS。

更多信息，请参阅 [预签名 URL 与存储代理](storage#Pre-signed-URLs-vs-Storage-proxies)。

1. 在 Azure 门户中，导航到存储账户的页面。
2. 从左侧菜单中，向下滚动到 **设置 > 资源共享（CORS）（Settings > Resource sharing (CORS)）**。
3. 在 **Blob service（Blob 服务）** 下添加以下规则：

   * **Allowed origins（允许的来源）：** `https://app.humansignal.com`（或你正在使用的域名）
   * **Allowed methods（允许的方法）：** `GET, HEAD, OPTIONS`
   * **Allowed headers（允许的标头）：** `*`
   * **Exposed headers（暴露的标头）：** `*`
   * **Max age（最大期限）：** `3600`

4. 点击 **保存（Save）**。

![Screenshot](/images/storages/azure-cors.png)

## Azure blob 存储

在开始之前，查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。

你还需要提供以下信息。这些信息都可以在 Azure 控制台中你的存储账户的 resource 页面上找到。

你需要：

- 你正在使用的容器名称
- 你的存储账户名称
- 与你的存储账户关联的访问密钥

![Screenshot](/images/storages/azure.png)

!!! info 提示
    如果你在本地部署（on-prem）中工作，可以设置 `AZURE_BLOB_ACCOUNT_NAME` 和 `AZURE_BLOB_ACCOUNT_KEY` 环境变量，而不是手动将它们添加到 UI 中。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储（Settings > Cloud Storage > Add Source Storage）**。

选择 **Azure Blob Storage** 并点击 **下一步**。

#### 配置连接

填写以下字段，然后点击 **测试连接**：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <th style="width: 25%;">字段</th>
    <th>描述</th>
  </tr>

  <tr>
    <td>Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Container Name（容器名称）</td>
    <td>
      输入你的 Azure 存储容器名称。这可以在 Azure 控制台中你的存储账户 resource 页面下的 <strong>Data storage > Containers（数据存储 > 容器）</strong> 中找到。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Account Name（账户名称）</td>
    <td>
      输入你的 Azure 存储账户名称。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Account Key（账户密钥）</td>
    <td>
      输入你的 Azure 存储账户的访问密钥。这可以在 Azure 控制台中你的存储账户 resource 页面下的 <strong>Security + networking > Access keys（安全 + 网络 > 访问密钥）</strong> 中找到。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Use pre-signed URLs（启用）/ <br/> Proxy through the platform（关闭）</td>
    <td>
      这决定了从你的容器加载数据的方式：
      <ul>
        <li><strong>使用预签名 URL</strong>：Label Studio 直接为你的 S3/GCS/Azure 对象生成有时间限制的 HTTPS 链接，并将浏览器重定向到那里（HTTP 303），因此标注者的浏览器直接从云存储下载媒体文件。这通常更快且扩展性更好，但需要在存储桶上配置正确的 CORS 和预签名权限。这也意味着流量从浏览器流向存储，而不是通过 Label Studio。</li>
        <li><strong>通过平台代理</strong> —— 后端从云存储下载文件并将其流式传输到浏览器，因此所有媒体流量都通过 Label Studio 服务器。这将数据完全保留在 Label Studio/网络边界内，对每个请求强制执行任务级访问检查，并避免 CORS/预签名的设置，但会使用更多的 Label Studio worker 资源，并且可能稍慢一些。</li>
      </ul>
      <br/>
      更多信息，请参阅
      <a href="storage#Pre-signed-URLs-vs-Storage-proxies">预签名 URL 与存储代理</a>。
    </td>
  </tr>

  <tr>
    <td>Expire pre-signed URLs (minutes)（预签名 URL 过期时间（分钟））</td>
    <td>控制预签名 URL 保持有效的时长。</td>
  </tr>

</table>
</div>

#### 导入设置与预览

填写以下字段，然后点击 **加载预览（Load preview）** 以确保你正在同步正确的数据：

<div class="noheader rowheader">

| | |
| --- | --- |
| Bucket Prefix（容器前缀） | 可选地，输入你要在其中使用的容器内的目录名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Import Method（导入方法） | 选择是希望为容器中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤容器对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/azure/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储（Settings > Cloud Storage > Add Target Storage）**。

选择 **Azure Blob Storage** 并点击 **下一步**。

填写以下字段：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">

  <tr>
    <td style="width: 25%;">Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Container Name（容器名称）</td>
    <td>
      输入你的 Azure 存储容器名称。这可以在 Azure 控制台中你的存储账户 resource 页面下的 <strong>Data storage > Containers（数据存储 > 容器）</strong> 中找到。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Container Prefix（容器前缀）</td>
    <td>
      可选地，输入你要在其中使用的容器内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

  <tr>
    <td>Account Name（账户名称）</td>
    <td>
      输入你的 Azure 存储账户名称。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Account Key（账户密钥）</td>
    <td>
      输入你的 Azure 存储账户的访问密钥。这可以在 Azure 控制台中你的存储账户 resource 页面下的 <strong>Security + networking > Access keys（安全 + 网络 > 访问密钥）</strong> 中找到。（见上面的截图。）
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在容器中删除，请启用此选项。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/azure/sync)。

## 使用服务主体的 Azure blob 存储

<div class="opensource-only">

在 Label Studio Enterprise 中，你可以使用 Azure 服务主体（Service Principal）身份验证，在不使用存储账户访问密钥的情况下将 Label Studio 安全地连接到 Azure Blob 存储。

更多信息，请参阅我们 Enterprise 文档中的 [使用服务主体的 Azure Blob 存储](https://docs.humansignal.com/guide/storage_azure.html#Azure-Blob-Storage-with-Service-Principal)。

</div>

<div class="enterprise-only">

你可以使用 Azure 服务主体身份验证，在不使用存储账户访问密钥的情况下将 Label Studio Enterprise 安全地连接到 Azure Blob 存储。

服务主体身份验证通过 Entra（前身为 "Azure Active Directory"）身份和访问管理提供了增强的安全性，允许进行细粒度的权限控制和审计能力。

服务主体身份验证使用 Entra ID 来验证应用程序。与使用提供对存储账户完全访问权限的存储账户密钥不同，服务主体身份验证允许你授予特定的权限，并且可以轻松撤销或轮换。

更多信息，请参阅 [Microsoft - Microsoft Entra ID 中的应用程序和服务主体对象](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals)。

### 先决条件

- Azure 订阅和存储账户
- 在存储账户上创建应用注册（App Registrations）和分配角色的权限
- 用于存放数据的私有容器（如果需要，请创建一个）

### 在 Entra 中设置服务主体

#### 在 Entra 中注册应用

1. 打开 [Microsoft Entra 管理中心](https://entra.microsoft.com/#home)。
2. 在右侧选择 **App registrations（应用注册）** 并点击 **New registration（新注册）**。请参阅 [注册应用程序](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)。

    提供一个名称并选择适当的账户类型。你可以将重定向 URI 留空。
3. 在 Overview（概述）下，复制 **Application (client) ID（应用程序（客户端）ID）** 和 **Directory (tenant) ID（目录（租户）ID）**。
4. 在 **Certificates & secrets（证书和机密）** 下，添加一个新的客户端机密（client secret）。

    复制 **Value（值）** 字段。

#### 在 Azure 中授予主体存储访问权限

返回 Azure 门户并转到你的存储账户。

1. 从你的存储账户中，在左侧选择 **Access control (IAM)（访问控制（IAM））**。
2. 选择 **Add > Add role assignment（添加 > 添加角色分配）**。
3. 使用搜索字段定位 **Storage Blob Data Contributor（存储 Blob 数据参与者）**。点击该角色以将其突出显示。
4. 在上方选择 **Members（成员）** 选项卡。
5. 选择 **User, group, or service principal（用户、组或服务主体）**，然后点击 **Select members（选择成员）**。
6. 使用提供的搜索字段定位你之前创建的应用程序的名称并点击 **Select（选择）**。
7. 点击 **Review + assign（查看 + 分配）**。

#### 创建容器

1. 在你的存储账户页面上，点击左侧的 **Data storage（数据存储）**。
2. 选择 **Containers（容器）**。
3. 如果你没有容器，请创建一个具有私有访问权限的新容器。

!!! warning
    如果你计划使用预签名 URL，请在存储账户的 Blob 服务上配置 CORS。请参阅 [为 Azure blob 存储设置 CORS](#Set-up-CORS-for-Azure-blob-storage)。

#### 所需权限

- 对于源存储：
  - `Microsoft.Storage/storageAccounts/blobServices/containers/read`
  - `.../containers/blobs/read`
- 对于目标存储：
  - `.../containers/blobs/read`
  - `.../containers/blobs/write`
  - `.../containers/read`
  - `.../containers/blobs/delete`（可选）

这些权限已包含在内置的 **Storage Blob Data Contributor（存储 Blob 数据参与者）** 角色中。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储** > **添加源存储**。

选择 **Azure Blob Storage with Service Principal（使用服务主体的 Azure Blob 存储）** 并点击 **下一步**。

##### 配置连接

填写以下字段，然后点击 **测试连接**：

<div class="noheader rowheader">

| | |
| --- | --- |
| Storage Title（存储标题） | 输入一个名称，使其在 Label Studio 中显示为该存储连接。 |
| Storage Name（存储名称） | 输入你的 Azure 存储账户名称。 |
| Container Name（容器名称） | 输入 Azure 存储账户内的容器名称。 |
| Tenant ID（租户 ID） | 指定你应用注册中的 **Directory (tenant) ID（目录（租户）ID）**。 |
| Client ID（客户端 ID） | 指定你应用注册中的 **Application (client) ID（应用程序（客户端）ID）**。 |
| Client Secret（客户端机密） | 指定你之前复制的客户端机密的 **Value（值）**。 |
| **Use pre-signed URLs / Proxy through the platform（使用预签名 URL / 通过平台代理）** | 启用或禁用预签名 URL。[查看更多。](storage#Pre-signed-URLs-vs-Storage-proxies) |
| Expiration minutes（过期分钟数） | 调整预签名 URL 有效的分钟数计数器。 |

</div>

##### 导入设置与预览

填写以下字段，然后点击 **加载预览（Load preview）** 以确保你正在同步正确的数据：

<div class="noheader rowheader">

| | |
| --- | --- |
| Bucket Prefix（容器前缀） | 可选地，输入你要在其中使用的容器内的文件夹名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Import Method（导入方法） | 选择是希望为容器中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤容器对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

##### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/azure-spi/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储**。

选择 **Azure Blob Storage with Service Principal（使用服务主体的 Azure Blob 存储）** 并点击 **下一步**。

填写以下字段：

<div class="noheader rowheader">

| | |
| --- | --- |
| Storage Title（存储标题） | 输入一个名称，使其在 Label Studio 中显示为该存储连接。 |
| Storage Name（存储名称） | 输入你的 Azure 存储账户名称。 |
| Container Name（容器名称） | 输入 Azure 存储账户内的容器名称。 |
| Container Prefix（容器前缀） | 可选地，输入你要在其中使用的容器内的文件夹名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Tenant ID（租户 ID） | 指定你应用注册中的 **Directory (tenant) ID（目录（租户）ID）**。 |
| Client ID（客户端 ID） | 指定你应用注册中的 **Application (client) ID（应用程序（客户端）ID）**。 |
| Client Secret（客户端机密） | 指定你之前复制的客户端机密的 **Value（值）**。 |
| Can delete objects from storage（可以从存储中删除对象） | 如果你希望在 Label Studio 中删除的标注也能够在存储桶中被删除，请启用此选项。你的凭证必须包含删除存储桶对象的能力。 |

</div>

添加后，点击 **同步（Sync）** 以推送导出。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/azure-spi/sync)。

#### 验证与故障排查

- 添加存储后，连接会被检查。如果失败，请验证：
  - Tenant ID、Client ID、Client Secret 值（没有多余的空格；机密未过期）
  - 存储账户和容器名称（区分大小写）
  - 角色分配：应用注册在存储账户上具有 Storage Blob Data Contributor 角色
  - 使用预签名 URL 时设置了 CORS；如果正在测试，请尝试代理模式

</div>

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)
