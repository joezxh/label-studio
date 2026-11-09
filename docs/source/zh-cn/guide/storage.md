---
title: Sync data from external storage
short: Add project storage 
type: guide
tier: all
order: 151
order_enterprise: 151
meta_title: Cloud and External Storage Integration
meta_description: "Label Studio Documentation for integrating Amazon AWS S3, Google Cloud Storage, Microsoft Azure, Redis, and local file directories with Label Studio."
section: "Import & Export"

---

将流行的云和外部存储系统与 Label Studio 集成，以收集上传到存储桶、容器、数据库或目录的新项目，并返回标注结果，以便你可以在机器学习流水线中使用它们。

| 存储 | 社区版 | 企业版 |
|---|---|---|
| [Amazon S3](storage_s3) | ✅ | ✅ |
| [使用 IAM 角色的 Amazon S3](storage_s3#Amazon-S3-with-IAM-role) | ❌ | ✅ |
| [Google Cloud Storage](storage_gcp) | ✅ | ✅ |
| [使用工作负载身份联合（WIF）的 Google Cloud Storage](storage_gcp#Google-Cloud-Storage-with-Workload-Identity-Federation-WIF) | ❌ | ✅ |
| [用于 GKE 的带有服务账户模拟的 Google Cloud Storage](storage_gcp#Google-Cloud-Storage-with-service-account-impersonation-for-GKE) | ❌ | ✅ |
| [Microsoft Azure Blob Storage](storage_azure) | ✅ | ✅ |
| [使用服务主体的 Microsoft Azure Blob Storage](storage_azure#Azure-blob-storage-with-Service-Principal) | ❌ | ✅ |
| [Databricks Files (UC Volumes)](storage_databricks) | ❌ | ✅ |
| [使用服务主体的 Databricks Files (UC Volumes)](storage_databricks) | ❌ | ✅ |
| [Redis database](storage_redis)| ✅ | ✅ |
| [Local storage](storage_local) | ✅ | ✅ |

你可以添加源存储连接以将数据从外部源同步到 Label Studio 项目，并添加目标存储连接以将标注从 Label Studio 同步到外部存储。

每个源和目标存储设置都是特定于项目的。你可以将多个存储桶、容器、数据库或目录作为项目的源或目标存储进行连接。

## 源存储

Label Studio 不会自动从源存储同步数据。如果你将新数据上传到已连接的云存储桶，请使用 UI 同步存储连接，以便在不重启的情况下将新的标注任务添加到 Label Studio。你也可以使用 API 来设置或同步存储连接。请参阅 [Label Studio API](https://api.labelstud.io/api-reference/introduction/getting-started) 并找到相关的存储连接类型。

从云存储同步的任务数据不存储在 Label Studio 中。相反，数据是使用预签名 URL 访问的。你还可以使用存储的 VPC 和 IP 限制来保护对云存储的访问。有关详细信息，请参阅 [保护对云存储的访问](security.html#Secure-access-to-cloud-storages)。

### 源存储权限

* 如果你将导入方法设置为 "Files（文件）"，Label Studio 后端将只需要 LIST 权限，并且不会从你的存储桶下载任何数据。

* 如果你将导入方法设置为 "Tasks（任务）"，Label Studio 后端将需要 GET 权限来读取 JSON 文件并将其转换为 Label Studio 任务。

当你的用户访问标注时，后端将尝试将 URI（例如 s3://）解析为 URL（https://）链接。URL 将返回给前端并由用户的浏览器加载。要加载这些 URL，浏览器将需要从你的云存储获得 HEAD 和 GET 权限。HEAD 请求在开始时发出，允许浏览器确定音频、视频或其他文件的大小。然后浏览器发出 GET 请求以检索文件正文。

### 源存储同步与 URI 解析

源存储功能可以分为两个部分：
* 同步（Sync） —— 当 Label Studio 扫描你的存储并从中导入任务时。
* URI 解析（URI resolving） —— 当 Label Studio 后端请求云存储将 URI 链接（例如 `s3://bucket/1.jpg`）解析为 HTTPS（`https://aws.amazon.com/bucket/1.jpg`）时。这样，用户的浏览器就能够加载媒体。

<img src="/images/source-cloud-storages.png" class="make-intense-zoom">

### 导入方法

!!! info
    "Treat every bucket object as a source file（将每个存储桶对象视为源文件）" 选项已被重命名并作为 "Import method（导入方法）" 下拉菜单重新引入。

Label Studio 源存储具有一个 "Import method（导入方法）" 下拉菜单。此设置启用了两种将任务加载到 Label Studio 的不同方法。

##### Tasks（任务）

当设置为 "Tasks" 时，JSON、JSONL/NDJSON 或 Parquet 格式的任务可以直接从存储桶加载到 Label Studio。这种方法在处理涉及多个媒体源的复杂任务时特别有用。

<img src="/images/source-storages-treat-off.png" class="make-intense-zoom">

你可以将多个任务放在同一个 JSON 文件中，但不能在同一文件中混合任务格式。

{% details <b>带有裸任务的示例</b> %}

`task_01.json`
```
{
  "image": "s3://bucket/1.jpg",
  "text": "opossums are awesome"
}
```

`task_02.json`
```
{
  "image": "s3://bucket/2.jpg",
  "text": "cats are awesome"
}
```

或者：

`tasks.json`
```
[
  {
    "image": "s3://bucket/1.jpg",
    "text": "opossums are awesome"
  },
  {
    "image": "s3://bucket/2.jpg",
    "text": "cats are awesome"
  }
]
```

{% enddetails %}

<br>

{% details <b>带有任务、标注和预测的示例</b> %}

`task_with_predictions_and_annotations_01.json`
```
{
    "data": {
        "image": "s3://bucket/1.jpg",
        "text": "opossums are awesome"
    },
    "annotations": [...],
    "predictions": [...]
}
```

`task_with_predictions_and_annotations_02.json`
```
{
    "data": {
      "image": "s3://bucket/2.jpg",
      "text": "cats are awesome"
    }
    "annotations": [...],
    "predictions": [...]
}
```

或者：

`tasks_with_predictions_and_annotations.json`
```
[
  {
      "data": {
          "image": "s3://bucket/1.jpg",
          "text": "opossums are awesome"
      },
      "annotations": [...],
      "predictions": [...]
  },
  {
      "data": {
        "image": "s3://bucket/2.jpg",
        "text": "cats are awesome"
      }
      "annotations": [...],
      "predictions": [...]
  }
]
```

{% enddetails %}

<br>

{% details <b>JSONL 示例</b> %}

`tasks.jsonl`
```
{ "image": "s3://bucket/1.jpg", "text": "opossums are awesome" }
{ "image": "s3://bucket/2.jpg", "text": "cats are awesome" }
```

{% enddetails %}

在 Label Studio Enterprise 和 Starter Cloud 版本中，Parquet 文件也可以像 JSON 和 JSONL 一样用于导入任务。

<br>

##### Files（文件）

当设置为 "Files" 时，Label Studio 会自动列出存储桶中的文件并构造任务。这仅适用于涉及单个媒体源（例如图像、文本等）的简单标注任务。*

<img src="/images/source-storages-treat-on.png" class="make-intense-zoom">

### 预签名 URL vs 存储代理

Label Studio 从云存储获取媒体数据有两种安全机制：通过预签名 URL 和通过代理。你使用哪一种取决于在设置源存储时是打开还是关闭 **Use pre-signed URLs（使用预签名 URL）**。**Use pre-signed URLs** 默认使用。当 **Use pre-signed URLs** 关闭时，启用代理存储。

<div class="enterprise-only">

!!! note
    你可以控制你的组织是否允许使用存储代理。转到 **Organization > Usage & License（组织 > 使用与许可证）** 并选择 **Enable Storage Proxy（启用存储代理）**。这必须由 Owner 角色的用户完成。

    当 **Enable Storage Proxy（启用存储代理）** 被禁用时，你组织中的用户将无法创建或修改 "Presigned URLs（预签名 URL）" 关闭的源存储连接。此限制确保所有存储连接都必须使用预签名 URL。

</div>

<br/>

#### 预签名 URL

在这种情况下，你的浏览器收到一个指向限时 S3/GCS/Azure 预签名 URL 的 HTTP 303 重定向。这是默认行为。

使用预签名 URL 的主要好处是，如果你希望确保你的媒体文件尽可能 **与** Label Studio 网络 **隔离**。

<img src="/images/storages/storage-proxy-presigned.png" style="max-width:600px; margin: 0 auto" alt="Diagram of presigned URL flow">

下面云存储配置文档中已包含此操作所需的权限。

#### 代理存储

在代理模式下，Label Studio 后端在服务器端获取对象并将其直接流式传输到浏览器。

<img src="/images/storages/storage-proxy.png" style="max-width:600px; margin: 0 auto" alt="Diagram of proxy flow">

这有多个好处，包括：

- **安全性**
    - 对媒体文件的访问会基于 Label Studio 用户角色和项目访问权限进一步限制。
    - 此访问也应用于缓存文件。这意味着即使媒体被缓存，如果用户对该任务的访问被撤销，对该文件的访问也会受到限制。
    - 数据保留在 Label Studio 网络边界内。这对于希望为其网络流量保持单一入口点的本地部署环境特别有用。
- **配置**
    - 不需要 CORS 设置。
    - 不需要预签名权限。

要允许代理存储，你需要确保你他权限包括以下内容：

{% details <b>AWS S3</b> %}

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

{% enddetails %}

<br>

{% details <b>Google Cloud Storage</b> %}

- `storage.objects.get` - 读取对象数据和元数据
- `storage.objects.list` - 列出存储桶中的对象（如果使用前缀）

{% enddetails %}

<br>

{% details <b>Azure Blob Storage</b> %}

添加 **Storage Blob Data Reader（存储 Blob 数据读取者）** 角色，其中包括：
- `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`
- `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/getTags/action`

{% enddetails %}

<br>

!!! note 本地部署注意事项
    大型媒体文件以顺序的 8 MB 块进行流式传输，这些块被拆分到不同的 GET 请求中。这可能导致频繁请求后端以获取下一部分数据，并使用额外的资源。

    你可以使用以下环境变量进行配置：

    * `RESOLVER_PROXY_MAX_RANGE_SIZE` - 默认为 8 MB，定义每个请求返回的最大块大小。
    * `RESOLVER_PROXY_TIMEOUT` - 默认为 20 秒，定义 uWSGI worker 在单个请求上花费的最长时间。

## 目标存储

如果你配置了目标存储，你的标注将保存在两个地方：Label Studio 数据库和你的目标存储中。

* 当标注员在标注任务时点击 **Submit（提交）** 或 **Update（更新）** 时，标注会被发送到目标存储以及 Label Studio 数据库。
* 当用户点击目标存储上的 **Sync（同步）** 按钮时，所有标注将再次从头保存。

目标存储接收每个标注的 JSON 格式导出。有关导出任务在目标存储中如何显示的详细信息，请参阅 [标注任务的 Label Studio JSON 格式](export#Label-Studio-JSON-format-of-annotated-tasks)。

当标注在 Label Studio 中被删除时，你也可以删除目标存储中的标注。默认情况下此选项处于关闭状态。

### 目标存储权限

要使用此类存储，你必须具有 PUT 权限，DELETE 权限是可选的。

## 故障排查

在使用外部云存储连接时，请记住以下几点：

* 对于源存储：
   * 当选择 **Files（文件）** 导入方法时，Label Studio 不会导入存储桶中存储的数据，而是创建对对象的 *引用*。因此，你完全控制要同步并在标注屏幕上显示的数据。
   * 当选择 **Tasks（任务）** 导入方法时，假定存储桶文件是不可变的；将更新文件的状态推送到 Label Studio 的唯一方法是使用新文件名将其上传到存储，或者删除与该文件关联的所有任务并重新同步。
* 与外部存储桶的同步操作仅单向进行。它要么从存储桶上的对象创建任务（源存储），要么将标注推送到输出存储桶（目标存储）。在存储桶端更改某些内容并不能保证结果的一致性。
* 我们建议每个 Label Studio 项目使用单独的存储桶文件夹。
* 存储区域：为了最小化延迟并提高效率，请将数据存储在地理位置上更靠近你的团队而不是靠近 Label Studio 服务器的云存储桶中。

<div class="opensource-only">

有关更多故障排查信息，请参阅 [Label Studio 故障排查](troubleshooting)。

</div>

<div class="enterprise-only">

有关更多故障排查信息，请参阅 HumanSignal 支持中心中的 [导入、导出与存储故障排查](https://support.humansignal.com/hc/en-us/sections/16982163062029-Import-Export-Storage)。

</div>
