---
title: Set up Amazon S3 cloud storage
short: AWS S3 
type: guide
tier: all
order: 152
order_enterprise: 152
meta_title: Set up Amazon S3 cloud storage
meta_description: "How to set up source and target cloud storage for Amazon S3."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

你可以将你的 [Amazon S3](https://aws.amazon.com/s3/) 存储桶连接到 Label Studio，以检索标注任务或存储已完成的标注。

* 源存储（Source store）允许你从云环境导入数据。请参阅 [源存储](storage#Source-storage)。

* 目标存储（Target store）允许你自动导出标注。请参阅 [目标存储](storage#Target-storage)。

你可以创建一种或两种连接类型。

## 配置对你的 S3 存储桶的访问

在开始之前，你必须为你的数据配置访问权限和权限。

这些步骤假设你正在使用同一个 AWS 角色来管理源存储和目标存储与 Label Studio。如果你仅将 S3 用于源存储，Label Studio 不需要对存储桶的 PUT 访问权限。

#### 1. 启用对你的存储桶的编程访问

[查看 Amazon Boto3 配置文档](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html#configuration)，了解更多关于如何设置对 S3 存储桶访问的信息。

!!! note
    只有在临时安全凭证的情况下才需要会话令牌。请参阅 AWS Identity and Access Management 文档中关于 [请求临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html) 的内容。

#### 2. 分配角色策略

将以下角色策略分配给一个你设置用于检索源任务和存储 S3 中标注的账户，将 `<your_bucket_name>` 替换为你的存储桶名称：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<your_bucket_name>",
                "arn:aws:s3:::<your_bucket_name>/*"
            ]
        }
    ]
}
```

!!! note
    `"s3:PutObject"` 仅用于目标存储连接，而 `"s3:DeleteObject"` 仅用于你希望允许在 Label Studio 中删除的标注也会在目标 S3 存储桶中被删除的目标存储连接。

#### 3. 配置 CORS

使用允许从与你的 Label Studio 部署主机名相同的来源进行 GET 访问的策略来设置你的存储桶的跨域资源共享（CORS）访问。请参阅 Amazon S3 用户指南中的 [配置跨域资源共享（CORS）](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html)。

!!! note
    这仅在你使用预签名 URL 时才需要。如果你使用代理（proxying），则无需配置 CORS。更多信息，请参阅 [预签名 URL 与存储代理](storage#Pre-signed-URLs-vs-Storage-proxies)。

使用或修改以下示例：
```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

## Amazon S3

在开始之前：

* 查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。
* [配置对你的 S3 存储桶的访问](#Configure-access-to-your-S3-bucket)。
* [获取你的 AWS 访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储（Settings > Cloud Storage > Add Source Storage）**。

选择 **Amazon S3** 并点击 **下一步**。

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
    <td>Bucket Name（存储桶名称）</td>
    <td>
      输入你的 S3 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Region Name（区域名称）</td>
    <td>
      输入 AWS 区域名称。例如 <code>us-east-1</code>。
    </td>
  </tr>

  <tr>
    <td>S3 Endpoint（S3 端点）</td>
    <td>
      可选地，输入一个 S3 端点。当你想要覆盖由 S3 创建的默认 URL 以访问你的存储桶时，这很有用。
    </td>
  </tr>

  <tr>
    <td>Access Key ID（访问密钥 ID）</td>
    <td>
      输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的访问密钥 ID。
    </td>
  </tr>

  <tr>
    <td>Secret Access Key（私有访问密钥）</td>
    <td>
      输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的私有密钥。
    </td>
  </tr>

  <tr>
    <td>Session Token（会话令牌）</td>
    <td>
      可选地，输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的会话令牌。
    </td>
  </tr>

  <tr>
    <td>Use pre-signed URLs（启用）/ <br/> Proxy through the platform（关闭）</td>
    <td>
      这决定了从你的存储桶加载数据的方式：
      <ul>
        <li><strong>使用预签名 URL（Use pre-signed URLs）</strong>：Label Studio 直接为你的 S3/GCS/Azure 对象生成有时间限制的 HTTPS 链接，并将浏览器重定向到那里（HTTP 303），因此标注者的浏览器直接从云存储下载媒体文件。这通常更快且扩展性更好，但需要在存储桶上配置正确的 CORS 和预签名权限。这也意味着流量从浏览器流向存储，而不是通过 Label Studio。</li>
        <li><strong>通过平台代理（Proxy through the platform）</strong> —— 后端从云存储下载文件并将其流式传输到浏览器，因此所有媒体流量都通过 Label Studio 服务器。这将数据完全保留在 Label Studio/网络边界内，对每个请求强制执行任务级访问检查，并避免 CORS/预签名的设置，但会使用更多的 Label Studio worker 资源，并且可能稍慢一些。</li>
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
| Bucket Prefix（存储桶前缀） | 可选地，输入你要在其中使用的存储桶内的目录名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Import Method（导入方法） | 选择是希望为存储桶中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤存储桶对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内的子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/s-3/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储（Settings > Cloud Storage > Add Target Storage）**。

选择 **Amazon S3** 并点击 **下一步**。

填写以下字段：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">

  <tr>
    <td style="width: 25%;">Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Bucket Name（存储桶名称）</td>
    <td>
      输入你的 S3 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Bucket Prefix（存储桶前缀）</td>
    <td>
      可选地，输入你要在其中使用的存储桶内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

  <tr>
    <td>Region Name（区域名称）</td>
    <td>
      输入 AWS 区域名称。例如 <code>us-east-1</code>。
    </td>
  </tr>

  <tr>
    <td>S3 Endpoint（S3 端点）</td>
    <td>
      可选地，输入一个 S3 端点。当你想要覆盖由 S3 创建的默认 URL 以访问你的存储桶时，这很有用。
    </td>
  </tr>

  <tr>
    <td>Access Key ID（访问密钥 ID）</td>
    <td>
      输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的访问密钥 ID。
    </td>
  </tr>

  <tr>
    <td>Secret Access Key（私有访问密钥）</td>
    <td>
      输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的私有密钥。
    </td>
  </tr>

  <tr>
    <td>Session Token（会话令牌）</td>
    <td>
      可选地，输入具有对你的 S3 存储桶访问权限的 AWS 账户的临时安全凭证的会话令牌。
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在 S3 存储桶中被删除，请启用此选项。与存储桶关联的存储凭证必须包含删除存储桶对象的能力。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/s-3/sync)。

## 使用 IAM 角色的 Amazon S3

<div class="opensource-only">

在 Label Studio Enterprise 中，你可以使用配置了外部 ID 的 IAM 角色来安全地访问 S3 存储桶内容。'external ID'（外部 ID）是一个唯一的标识符，它通过确保只有受信任的实体才能担任该角色来增强安全性，从而降低未经授权访问的风险。请参阅 Enterprise 文档中的 [使用 IAM 角色的 Amazon S3](https://docs.humansignal.com/guide/storage_s3#Amazon-S3-with-IAM-role)。

</div>

<div class="enterprise-only">

如果你想要使用一种可撤销的方法来授予 Label Studio 对你的 Amazon S3 存储桶的访问权限，请使用 IAM 角色及其临时安全凭证，而不是访问密钥 ID 和私有密钥。这一额外的安全层仅在 Label Studio Enterprise 中可用。

在开始之前：

* 查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。
* [配置对你的 S3 存储桶的访问](#Configure-access-to-your-S3-bucket)。

### 在 Amazon AWS 中设置 IAM 角色

<br />
{% details <b>针对 2025 年 4 月 7 日之前创建 IAM 角色策略的 Label Studio Cloud 用户的通知</b> %}

自 **2025 年 4 月 7 日** 起，新的存储连接需要更新你 IAM 角色策略中的 AWS 主体（principal）。

如果你在 **2025 年 4 月 7 日之前** 设置了你的 IAM 角色并且已经将其与 Label Studio 一起使用，则必须在创建 Label Studio 项目中的新存储连接之前将以下内容添加到你的主体列表中：

<code>"arn:aws:iam::490065312183:role/label-studio-app-production"</code>

例如：

<img src="/images/storages/s3-trust-policy.png" alt="screenshot">

（请参阅下面的第 3 步。）

添加新主体可确保你能创建新的连接。

保留旧主体可确保预先存在的存储连接能够继续加载数据。

添加到 Label Studio 的现有基于 S3 IAM 角色的访问存储将继续按原样工作，无需任何必要的更改。

此更改仅在你设置新连接时才需要。

{% enddetails %}

在 Amazon AWS 中设置一个 IAM 角色以与 Label Studio 一起使用。

1. 从 Label Studio 中，转到 **组织（Organization）** 页面以检索你组织的 `External ID`（外部 ID）。你必须是所有者或管理员才能查看组织页面。

    ![Screenshot](/images/storages/external-id.png)
2. 按照 [Amazon AWS 文档创建 IAM 角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) 在你的 AWS 账户中。

    设置角色时，请务必要求外部 ID，并且不要求多因素身份验证。选择一个现有的权限策略，或者创建一个允许对存储桶进行编程访问的策略。
3. 使用外部 ID 创建一个信任策略。使用以下示例：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::490065312183:role/label-studio-app-production"
        ]
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": [
            "<YOUR-ORG-ExternalId>"
          ]
        }
      }
    }
  ]
}
```

!!! attention
    如果你的存储桶已经连接到 Label Studio 项目，并且该连接是在 2025 年 4 月 7 日之前创建的，你将需要把新角色（上面列出的）与你的旧用户一起添加，以便继续使用你现有的项目。你还必须保留旧角色，以便预先存在的项目可以继续从 AWS 加载数据。

4. 创建 IAM 角色后，记下该角色的 Amazon Resource Name（ARN）。在 Label Studio 中设置 S3 源存储时你需要它。
5. 为角色分配角色策略，以允许它访问你的 S3 存储桶。将 `<your_bucket_name>` 替换为你的 S3 存储桶名称。对 S3 源存储使用以下角色策略：
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
            ],
            "Resource": [
                "arn:aws:s3:::<your_bucket_name>",
                "arn:aws:s3:::<your_bucket_name>/*"
            ]
        }
    ]
}
```
对 S3 目标存储使用以下角色策略：
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::<your_bucket_name>",
                "arn:aws:s3:::<your_bucket_name>/*"
            ]
        }
    ]
}
```

!!! note
    `"s3:DeleteObject"` 仅用于你希望 Label Studio 中删除的标注也能在目标 S3 存储桶中被删除的目标存储连接。

有关使用带有外部 ID 的 IAM 角色来向第三方（Label Studio）授予对你的 AWS 资源的访问权限的更多详细信息，请参阅 Amazon AWS 文档 [在向第三方授予对你的 AWS 资源的访问权限时如何使用外部 ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html)。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储**。

选择 **Amazon S3 with IAM Role（使用 IAM 角色的 Amazon S3）** 并点击 **下一步**。

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
    <td>Bucket Name（存储桶名称）</td>
    <td>
      输入你的 S3 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Region Name（区域名称）</td>
    <td>
      输入 AWS 区域名称。例如 <code>us-east-1</code>。
    </td>
  </tr>

  <tr>
    <td>S3 Endpoint（S3 端点）</td>
    <td>
      可选地，输入一个 S3 端点。当你想要覆盖由 S3 创建的默认 URL 以访问你的存储桶时，这很有用。
    </td>
  </tr>

  <tr>
    <td>Role ARN（角色 ARN）</td>
    <td>
      输入你之前创建的用于授予 Label Studio 访问权限的 IAM 角色的 Amazon Resource Name（ARN）。
    </td>
  </tr>

  <tr>
    <td>Use pre-signed URLs（启用）/ <br/> Proxy through the platform（关闭）</td>
    <td>
      这决定了从你的存储桶加载数据的方式：
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
| Bucket Prefix（存储桶前缀） | 可选地，输入你要在其中使用的存储桶内的目录名称。例如 `data-set-1` 或 `data-set-1/subfolder-2`。 |
| Import Method（导入方法） | 选择是希望为存储桶中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤存储桶对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内的子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/s-3-s/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储**。

选择 **Amazon S3 with IAM Role（使用 IAM 角色的 Amazon S3）** 并完成以下字段：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">

  <tr>
    <td style="width: 25%;">Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Bucket Name（存储桶名称）</td>
    <td>
      输入你的 S3 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Bucket Prefix（存储桶前缀）</td>
    <td>
      可选地，输入你要在其中使用的存储桶内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

  <tr>
    <td>Region Name（区域名称）</td>
    <td>
      输入 AWS 区域名称。例如 <code>us-east-1</code>。
    </td>
  </tr>

  <tr>
    <td>S3 Endpoint（S3 端点）</td>
    <td>
      可选地，输入一个 S3 端点。当你想要覆盖由 S3 创建的默认 URL 以访问你的存储桶时，这很有用。
    </td>
  </tr>

  <tr>
    <td>Role ARN（角色 ARN）</td>
    <td>
      输入你创建的用于授予 Label Studio 访问权限的 IAM 角色的 Amazon Resource Name（ARN）。
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在 S3 存储桶中被删除，请启用此选项。与存储桶关联的存储凭证必须包含删除存储桶对象的能力。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/s-3-s/sync)。

</div>

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)

## 用于增强 S3 存储安全性的 IP 过滤和 VPN

为了最大化安全性并将数据隔离在 VPC 之后，通过设置存储的 IP 限制来限制对 Label Studio 后端和内部网络用户的访问，仅允许受信任的网络执行任务同步和生成预签名 URL。此外，通过配置 VPC 私有端点或将存储访问限制为特定 IP 或 VPC，在存储与用户浏览器之间建立安全连接。

阅读更多关于 [位于你的 VPC 之后的源存储](security.html#Source-storage-behind-your-VPC)。

<details>
<summary>适用于 S3 存储的存储桶策略示例</summary>
<br>

!!! warning
    这些示例存储桶策略明确拒绝来自允许 IP 地址范围之外的任何请求。即使输入了存储桶策略的用户，如果不满足条件，也可能会被拒绝访问该存储桶。因此，在保存之前务必仔细审查存储桶策略。如果你意外被锁定，请参阅 [如何重新获得对 Amazon S3 存储桶的访问权限](https://repost.aws/knowledge-center/s3-accidentally-denied-access)。

 **有用的资源**：
   - [AWS 文档：Amazon S3 的 VPC 端点](https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html)
   - [AWS 文档：如何配置 VPC 端点](https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-services-overview.html)

转到你的 S3 存储桶，然后在 AWS 管理控制台中转到 **Permissions > Bucket Policy（权限 > 存储桶策略）**。添加以下策略：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAccessUnlessFromSaaSIPsForListAndGet",
            "Effect": "Deny",
            "Principal": {
                "AWS": "arn:aws:iam::490065312183:role/label-studio-app-production"
            },
            "Action": [
                "s3:ListBucket",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ],
            "Condition": {
                "NotIpAddress": {
                    "aws:SourceIp": [
                      //// 文档中 app.humansignal.com 的 IP 范围
                        "x.x.x.x/32",
                        "x.x.x.x/32",
                        "x.x.x.x/32"
                    ]
                }
            }
        },
//// 可选
        {
            "Sid": "DenyAccessUnlessFromVPNForGetObject",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
            "Condition": {
                "NotIpAddress": {
                    "aws:SourceIp": "YOUR_VPN_SUBNET/32"
                }
            }
        }
    ]
}
```
</details>
