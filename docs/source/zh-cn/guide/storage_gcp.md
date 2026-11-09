---
title: Set up Google Cloud Storage
short: Google Cloud
type: guide
tier: all
order: 153
order_enterprise: 153
meta_title: Set up Google Cloud Storage
meta_description: "How to set up source and target storage for Google Cloud."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

在 Label Studio 中动态导入任务并将标注导出到 Google Cloud Storage（GCS）存储桶。有关 Label Studio 如何保护对云存储的访问的详细信息，请参阅 [保护对云存储的访问](security#Secure-access-to-cloud-storage)。

## 配置对你的 Google Cloud Storage 存储桶的访问

首先，查看 [项目的云存储](storage) 和 [保护对云存储的访问](security#Secure-access-to-cloud-storage) 中的信息。

然后你需要完成以下先决条件：

#### 1. 启用对你的存储桶的编程访问

请参阅 Google Cloud Storage 文档中的 [Cloud Storage 客户端库](https://cloud.google.com/storage/docs/reference/libraries)，了解如何设置对你的 GCS 存储桶的访问。

#### 2. 设置对你的存储桶的身份认证

你的账户必须具有 **Service Account Token Creator（服务账户令牌创建者）** 和 **Storage Object Viewer（存储对象查看者）** 角色以及 **storage.buckets.get** 访问权限。请参阅 Google Cloud Storage 文档中的 [设置身份认证](https://cloud.google.com/storage/docs/reference/libraries#setting_up_authentication) 和 [Cloud Storage 的 IAM 权限](https://cloud.google.com/storage/docs/access-control/iam-permissions)。

<div class="enterprise-only">

!!! note
    如果你使用的是 WIF，请参阅下面的 [服务账户权限](#Service-account-permissions)。

</div>

#### 3. 配置 CORS

使用允许从与你的 Label Studio 部署主机名相同的来源进行 GET 访问的策略来设置你的存储桶的跨域资源共享（CORS）访问。请参阅 Google Cloud 用户指南中的 [配置跨域资源共享（CORS）](https://cloud.google.com/storage/docs/configuring-cors#configure-cors-bucket)。

!!! note
    这仅在你使用预签名 URL 时才需要。如果你使用代理（proxying），则无需配置 CORS。更多信息，请参阅 [预签名 URL 与存储代理](storage#Pre-signed-URLs-vs-Storage-proxies)。

使用或修改以下示例：

```shell
echo '[
   {
      "origin": ["*"],
      "method": ["GET"],
      "responseHeader": ["Content-Type","Access-Control-Allow-Origin"],
      "maxAgeSeconds": 3600
   }
]' > cors-config.json
```

在以下命令中将 `YOUR_BUCKET_NAME` 替换为你的实际存储桶名称，以更新你的存储桶的 CORS：

```shell
gsutil cors set cors-config.json gs://YOUR_BUCKET_NAME
```

## Google Cloud Storage

在开始之前：

* 查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。
* [配置对你的 GCS 存储桶的访问](#Configure-access-to-your-GCS-bucket)。

### Google 应用凭证

你需要提供 Google 应用凭证。这些是你在设置存储时输入的 JSON 文件。

1. 从 Google Cloud Console 中，转到 **IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）**。
2. 选择你需要凭证的特定服务账户。如果你没有，请创建一个新服务账户。
3. 在服务账户详情中，转到 **Keys（密钥）** 选项卡并点击 **Add Key > Create new key（添加密钥 > 创建新密钥）**。
4. 选择 JSON 密钥类型并点击 **Create（创建）**。JSON 文件将被生成并自动下载到你的计算机。

另请参阅：

* [为带有附加服务账户的资源设置 ADC](https://docs.cloud.google.com/docs/authentication/set-up-adc-attached-service-account)
* [设置应用默认凭证（Application Default Credentials）](https://docs.cloud.google.com/docs/authentication/provide-credentials-adc)。

!!! note
    如果你使用服务账户来授权访问 Google Cloud Platform，请确保激活它。请参阅 [gcloud auth activate-service-account](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account)。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储（Settings > Cloud Storage > Add Source Storage）**。

选择 **Google Cloud Storage** 并点击 **下一步**。

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
      输入你的 GCS 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Google Application Credentials（Google 应用凭证）</td>
    <td>
      输入你创建的用于管理存储桶身份认证的 GCS 凭证 JSON 文件。<br /><br /><strong>本地部署用户：</strong> 或者，你可以使用 <code>GOOGLE_APPLICATION_CREDENTIALS</code> 环境变量和/或设置应用默认凭证，这样用户无需手动配置凭证。<br /><br />请参阅下面的 <a href="#Application-Default-Credentials-for-enhanced-security-for-GCS">用于增强 GCS 安全性的应用默认凭证</a>。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      输入你的存储桶所在的 Google 项目的 ID（例如 <code>my-label-studio-project</code>）。<br /><br />如果你不确定，可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到。
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
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/gcs/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储（Settings > Cloud Storage > Add Target Storage）**。

选择 **Google Cloud Storage** 并点击 **下一步**。

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
      输入你的 GCS 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Bucket Prefix（存储桶前缀）</td>
    <td>
      可选地，输入你要在其中使用的存储桶内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

  <tr>
    <td>Google Application Credentials（Google 应用凭证）</td>
    <td>
      输入你创建的用于管理存储桶身份认证的 GCS 凭证 JSON 文件。<br /><br /><strong>本地部署用户：</strong> 或者，你可以使用 <code>GOOGLE_APPLICATION_CREDENTIALS</code> 环境变量和/或设置应用默认凭证，这样用户无需手动配置凭证。<br /><br />请参阅下面的 <a href="#Application-Default-Credentials-for-enhanced-security-for-GCS">用于增强 GCS 安全性的应用默认凭证</a>。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      输入你的存储桶所在的 Google 项目的 ID（例如 <code>my-label-studio-project</code>）。<br /><br />如果你不确定，可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到。
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在存储桶中被删除，请启用此选项。你的凭证必须包含删除存储桶对象的能力。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/gcs/sync)。

### 用于增强 GCS 安全性的应用默认凭证

如果你在本地部署中使用 Label Studio 与 Google Cloud Storage，可以设置 [应用默认凭证（Application Default Credentials）](https://cloud.google.com/docs/authentication/provide-credentials-adc)，以便为所有项目全局提供云存储身份认证，这样用户无需手动配置凭证。

推荐的方法是使用 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量。例如：

```bash
  export GOOGLE_APPLICATION_CREDENTIALS=json-file-with-GCP-creds-23441-8f8sd99vsd115a.json
```

## 使用工作负载身份联合（WIF）的 Google Cloud Storage

<div class="opensource-only">

在 Label Studio Enterprise 中，你可以将工作负载身份联合（Workload Identity Federation，WIF）池与 Google Cloud Storage 一起使用。

与使用应用凭证不同，WIF 允许你使用临时凭证。每次向 GCS 发出请求时，Label Studio 会连接到你的身份池以请求临时凭证。

更多信息，请参阅我们 Enterprise 文档中的 [使用工作负载身份联合（WIF）的 Google Cloud Storage](https://docs.humansignal.com/guide/storage_gcp.html#Google-Cloud-Storage-with-Workload-Identity-Federation-WIF)。

</div>

<div class="enterprise-only">

你也可以将工作负载身份联合（WIF）池与 Google Cloud Storage 一起使用。

与使用应用凭证不同，WIF 允许你使用临时凭证。每次向 GCS 发出请求时，Label Studio 会连接到你的身份池以请求临时凭证。

有关 WIF 的更多信息，请参阅 [Google Cloud - 工作负载身份联合](https://cloud.google.com/iam/docs/workload-identity-federation)。

在开始之前：

* 查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。
* [配置对你的 GCS 存储桶的访问](#Configure-access-to-your-GCS-bucket)。

### 服务账户权限

你需要一个具有以下权限的服务账户：

- 存储桶：**Storage Admin**（`roles/storage.admin`）
- 项目：**Service Account Token Creator**（`roles/iam.serviceAccountTokenCreator`）
- 项目：**Storage Object Viewer**（`roles/storage.viewer`）

请参阅 Google Cloud 文档中的 [创建服务账户](https://cloud.google.com/iam/docs/service-accounts-create?hl=en)。

### 创建工作负载身份池

你有几种方法可以创建工作负载身份池（WIF pool）。

<details>
<summary>使用 Terraform</summary>
<br>

下面提供了一个示例脚本。确保所有必需的变量都已设置：

* GCP 项目变量：

  * `var.gcp_project_name`

  * `var.gcp_region`

* HumanSignal 提供的 SaaS：

  * `var.aws_account_id` = `490065312183`

  * `var.aws_role_name` = `label-studio-app-production`

然后运行：

```bash
terraform init
terraform plan
terraform apply
```

一旦应用，你将拥有一个可正常运行的工作负载身份池，该池信任 Label Studio AWS IAM 角色。

```json
## 变量
/* AWS 变量是为了让托管在 AWS 上的 Label Studio 资源能够向外请求凭证 */

variable "gcp_project_name" {
  type        = string
  description = "GCP 项目名称"
}

variable "gcp_region" {
  type        = string
  description = "GCP 区域"
}

variable "label_studio_gcp_sa_name" {
  type        = string
  description = "GCP Label Studio 服务账户名称"
}

variable "aws_account_id" {
  type        = string
  description = "AWS 项目 ID"
}

variable "aws_role_name" {
  type        = string
  description = "AWS 角色名称"
}

variable "external_ids" {
  type        = list(string)
  default = []
  description = "外部 ID 列表"
}

## 输出

output "GCP_WORKLOAD_ID" {
  value = google_iam_workload_identity_pool_provider.label-studio-provider-jwt.workload_identity_pool_id
}

output "GCP_WORKLOAD_PROVIDER" {
  value = google_iam_workload_identity_pool_provider.label-studio-provider-jwt.workload_identity_pool_provider_id
}

## 主部分

provider "google" {
  project = var.gcp_project_name
  region  = var.gcp_region
}

resource "random_id" "random" {
  byte_length = 4
}

locals {
  aws_assumed_role = "arn:aws:sts::${var.aws_account_id}:assumed-role/${var.aws_role_name}"

  external_id_condition = (
    length(var.external_ids) > 0
    ? format("(attribute.aws_role == \"%s\") && (attribute.external_id in [%s])",
      local.aws_assumed_role,
      join(", ", formatlist("\"%s\"", var.external_ids))
    )
    : format("(attribute.aws_role == \"%s\")", local.aws_assumed_role)
  )
}

resource "google_iam_workload_identity_pool" "label-studio-pool" {
  workload_identity_pool_id = "label-studio-pool-${random_id.random.hex}"
  project                   = var.gcp_project_name
}

resource "google_iam_workload_identity_pool_provider" "label-studio-provider-jwt" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.label-studio-pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "label-studio-jwt-${random_id.random.hex}"

  attribute_condition = local.external_id_condition

  attribute_mapping = {
    "google.subject"        = "assertion.arn"
    "attribute.aws_account" = "assertion.account"
    "attribute.aws_role"    = "assertion.arn.contains('assumed-role') ? assertion.arn.extract('{account_arn}assumed-role/') + 'assumed-role/' + assertion.arn.extract('assumed-role/{role_name}/') : assertion.arn"
    "attribute.external_id" = "assertion.external_id"
  }

  aws {
    account_id = var.aws_account_id
  }
}

data "google_service_account" "existing_sa" {
  account_id = var.label_studio_gcp_sa_name
}

resource "google_service_account_iam_binding" "label-studio-sa-oidc" {
  service_account_id = data.google_service_account.existing_sa.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.label-studio-pool.name}/attribute.aws_role/${local.aws_assumed_role}"
  ]
}
```

</details>

<details>
<summary>使用 gcloud 命令行</summary>
<br>

将带括号的变量（`[PROJECT_ID]`、`[POOL_ID]`、`[PROVIDER_ID]` 等）替换为你的实际值。

必要时请确保转义引号或使用单引号。

1. 创建工作负载身份池：

   ```shell
   gcloud iam workload-identity-pools create [POOL_ID] \
  --project=[PROJECT_ID] \
  --location="global" \
  --display-name="[POOL_DISPLAY_NAME]"
   ```
   其中：

   * `[POOL_ID]` 是你想要分配给你的 WIF 池的 ID（例如 `label-studio-pool-abc123`）。请注意，因为你稍后需要再次使用它。
   * `[PROJECT_ID]` 是你的 Google Cloud 项目的 ID。
   * `[POOL_DISPLAY_NAME]` 是你的池的用户可读名称（可选，但推荐）。

1. 为 AWS 创建提供者（provider）。

    这允许具有正确外部 ID 和 AWS 角色配置的 AWS 主体模拟 Google Cloud 服务账户。这是必要的，因为发出请求的 Label Studio 资源托管在 AWS 中。

    ```shell
    gcloud iam workload-identity-pools providers create-aws [PROVIDER_ID] \
    --workload-identity-pool="[POOL_ID]" \
    --account-id="490065312183" \
    --attribute-condition="attribute.aws_role==\"arn:aws:sts::490065312183:assumed-role/label-studio-app-production\"" \
    --attribute-mapping="google.subject=assertion.arn,attribute.aws_account=assertion.account,attribute.aws_role=assertion.arn,attribute.external_id=assertion.external_id"

    ```
    其中：

    * `[PROVIDER_ID]` 是提供者 ID（例如 `label-studio-app-production`）。
    * `[POOL_ID]`：你在第 1 步中提供的池 ID。

2. 为你之前创建的 [服务账户](#Service-account-permissions) 授予 `iam.workloadIdentityUser` 角色。

    ```shell
    gcloud iam service-accounts add-iam-policy-binding [SERVICE_ACCOUNT_EMAIL] \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/[PROJECT_NUMBER]/locations/global/workloadIdentityPools/[POOL_ID]/attribute.aws_role/arn:aws:sts::490065312183:assumed-role/label-studio-app-production"
    ```

    其中：

    * `[SERVICE_ACCOUNT_EMAIL]` 是与你的 GCS 服务账户关联的电子邮件（例如 `my-service-account@[PROJECT_ID].iam.gserviceaccount.com`）。
    * `[PROJECT_NUMBER]`：你的 Google 项目编号。这不同于项目 ID。你可以用以下命令找到项目编号：

        `gcloud projects describe $PROJECT_ID --format="value(projectNumber)"`
    * `[POOL_ID]`：你在第 1 步中提供的池 ID。

在 Label Studio 中设置连接之前，请记下你为以下变量提供的值（会要求你提供它们）：

* `[POOL_ID]`
* `[PROVIDER_ID]`
* `[SERVICE_ACCOUNT_EMAIL]`
* `[PROJECT_NUMBER]`
* `[PROJECT_ID]`

</details>

<details>
<summary>使用 Google Cloud Console</summary>
<br>

在开始之前，请确保你在正确的项目中：

![Screenshot of the GCS console with project highlighted](/images/storages/gcs-project.png)

1. 从 Google Cloud Console 中，导航到 [**IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）**](https://console.cloud.google.com/iam-admin/workload-identity-pools)。

2. 点击 **Get Started（开始使用）** 以启用 API。

3. 在 **Create an identity pool（创建身份池）** 下，填写以下字段：

    * **Name（名称）**：这是池 ID（例如 `label-studio-pool-abc123`）。请注意此 ID，因为你稍后需要再次使用它。
    * **Description（描述）**：这是池的显示名称（例如 "Label Studio Pool"）。

4. 在 **Add a provider pool（添加提供者池）** 下，填写以下字段：

    * **Select a provider（选择提供者）**：选择 AWS。这是负责发出请求的 Label Studio 组件所在的位置。
    * **Provider name（提供者名称）**：输入 `Label Studio App Production`（你可以使用不同的显示名称，但你需要确保相应的提供者 ID 仍然是 `label-studio-app-production`）
    * **Provider ID（提供者 ID）**：输入 `label-studio-app-production`。
    * **AWS Account ID（AWS 账户 ID）**：输入 `490065312183`。

5. 在 **Configure provider attributes（配置提供者属性）** 下，输入以下内容：

    * 点击 **Add condition（添加条件）** 然后输入以下内容：

        `attribute.aws_role=="arn:aws:sts::490065312183:assumed-role/label-studio-app-production"`

    * 点击 **Edit mapping（编辑映射）** 然后添加以下内容：

        - `google.subject = assertion.arn`
        - `attribute.aws_role = assertion.arn.contains('assumed-role') ? assertion.arn.extract('{account_arn}assumed-role/') + 'assumed-role/' + assertion.arn.extract('assumed-role/{role_name}/') : assertion.arn`（这可能默认已填充）
        - `attribute.aws_account = assertion.account`
        - `attribute.external_id = assertion.external_id`

6. 点击 **Save（保存）**。

7. 转到 **IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）**，找到你希望允许 AWS（Label Studio）模拟的服务账户。请参阅上面的 [服务账户权限](#Service-account-permissions)。

8. 从 **Principals with access（有访问权限的主体）** 选项卡中，点击 **Grant Access（授予访问权限）**。

    ![Screenshot of grant access button](/images/storages/gcs-grant-access.png)

9. 在 **New principals（新主体）** 字段中，添加以下内容：

    `principalSet://iam.googleapis.com/projects/[PROJECT_NUMBER]/locations/global/workloadIdentityPools/[POOL_ID]/attribute.aws_role/arn:aws:sts::490065312183:assumed-role/label-studio-app-production`

    其中：

    * `[PROJECT_NUMBER]` - 将其替换为你的 Google 项目编号。这不同于项目 ID。要查找项目编号，请转到 **IAM & Admin > Settings（IAM 与管理 > 设置）**。
    * `[POOL_ID]` - 将其替换为池 ID（你在上面第 3 步中输入的 **Name（名称）**，例如 `label-studio-pool-abc123`）。

9. 在 **Assign Roles（分配角色）** 下，使用 **Role（角色）** 下拉菜单中的搜索字段找到 **Workload Identity User（工作负载身份用户）** 角色。

    ![Screenshot of principal window](/images/storages/gcs-principal.png)

10. 点击 **Save（保存）**

在 Label Studio 中设置连接之前，请记下以下内容（会要求你提供它们）

* 你的池 ID - 可从 **IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）** 获取
* 你的提供者 ID - 可从 **IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）** 获取（这应该是 `label-studio-app-production`）
* 你的服务账户电子邮件 - 可从 **IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）** 获取。选择服务账户，电子邮件列在 **Details（详情）** 下。
* 你的 Google 项目编号 - 可从 **IAM & Admin > Settings（IAM 与管理 > 设置）** 获取
* 你的 Google 项目 ID - 可从 **IAM & Admin > Settings（IAM 与管理 > 设置）** 获取

</details>

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储**。

选择 **Google Cloud Storage (WIF Auth)（Google Cloud Storage（WIF 认证））** 并点击 **下一步**。

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
      输入你的 GCS 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Workload Identity Pool ID（工作负载身份池 ID）</td>
    <td>
      这是你在创建工作负载身份池时指定的 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Workload Identity Provider ID（工作负载身份提供者 ID）</td>
    <td>
      这是你在设置提供者时指定的 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Service Account Email（服务账户电子邮件）</td>
    <td>
      这是与你在先决条件中设置的服务账户关联的电子邮件。你可以在 <strong>IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）</strong> 下的服务账户的 <strong>Details（详情）</strong> 页面中找到它。例如 <code>labelstudio@random-string-382222.iam.gserviceaccount.com</code>。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      你的 Google 项目 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Google Project Number（Google 项目编号）</td>
    <td>
      你的 Google 项目编号。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
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
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/gcswif/sync)。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储**。

选择 **Google Cloud Storage (WIF Auth)（Google Cloud Storage（WIF 认证））** 并点击 **下一步**。

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
      输入你的 GCS 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Bucket Prefix（存储桶前缀）</td>
    <td>
      可选地，输入你要在其中使用的存储桶内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

<tr>
    <td>Workload Identity Pool ID（工作负载身份池 ID）</td>
    <td>
      这是你在创建工作负载身份池时指定的 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Workload Identity Provider ID（工作负载身份提供者 ID）</td>
    <td>
      这是你在设置提供者时指定的 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Workload Identity Pools（IAM 与管理 > 工作负载身份池）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Service Account Email（服务账户电子邮件）</td>
    <td>
      这是与你在先决条件中设置的服务账户关联的电子邮件。你可以在 <strong>IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）</strong> 下的服务账户的 <strong>Details（详情）</strong> 页面中找到它。例如 <code>labelstudio@random-string-382222.iam.gserviceaccount.com</code>。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      你的 Google 项目 ID。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Google Project Number（Google 项目编号）</td>
    <td>
      你的 Google 项目编号。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在存储桶中被删除，请启用此选项。你的凭证必须包含删除存储桶对象的能力。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/gcswif/sync)。

</div>

## 用于 GKE 的带有服务账户模拟的 Google Cloud Storage

<div class="opensource-only">

在 Label Studio Enterprise 中，如果你在 GKE 中部署 Label Studio，可以设置服务账户模拟。

Google Cloud Storage 服务账户模拟允许一个 Google Cloud 服务账户在没有其密钥访问权限的情况下临时承担另一个服务账户的权限。

更多信息，请参阅我们 Enterprise 文档中的 [用于 GKE 的带有服务账户模拟的 Google Cloud Storage](https://docs.humansignal.com/guide/storage_gcp.html#Google-Cloud-Storage-with-service-account-impersonation-for-GKE)。

</div>

<div class="enterprise-only">

Google Cloud Storage 服务账户模拟允许一个 Google Cloud 服务账户在没有其密钥访问权限的情况下临时承担另一个服务账户的权限。

在 Google Kubernetes Engine（GKE）上部署 Label Studio 时，工作负载通常使用通过工作负载身份映射到 Google Cloud 服务账户的 Kubernetes 服务账户进行身份认证。但是，这个直接关联的 GCP 服务账户可能没有对你的 GCS 存储桶的广泛访问权限。

通过服务账户模拟，工作负载的 GCP 服务账户可以改为模拟一个单独的、具有更高权限的、拥有必要存储权限的服务账户。这种方法无需创建、分发和轮换长期有效的服务账户密钥，从而降低了凭证泄露的风险。

更多信息，请参阅：

* [服务账户模拟](https://cloud.google.com/iam/docs/service-account-impersonation)
* [使用服务账户模拟](https://cloud.google.com/docs/authentication/use-service-account-impersonation)

在开始之前：

* 查看 [项目的云存储](storage) 和 [保护对云存储的访问](security.html#Secure-access-to-cloud-storage) 中的信息。
* [配置对你的 GCS 存储桶的访问](#Configure-access-to-your-GCS-bucket)。
* 你需要来自 Label Studio 平台管理员的 **基础服务账户电子邮件（base service account email）**。这是绑定到通过 GKE 工作负载身份运行 Label Studio 的 Kubernetes 服务账户的 GCP 服务账户。如果尚未设置，请参阅下面的 [配置 GKE 项目（平台管理员）](#Configure-the-GKE-project-platform-administrator)。

你将工作在两个 Google Cloud 项目中：

* [你的基础 GKE 项目。](#Configure-the-GKE-project-platform-administrator) 这是你使用 GKE 部署 Label Studio 的地方。
* [你的目标 Google Cloud 项目。](#Configure-the-target-Google-Cloud-project) 这是你的 GCS 存储桶所在的位置。

### 配置 GKE 项目（平台管理员）

这是由管理 GKE 中 Label Studio 部署的平台管理员执行的一次性设置。如果已完成，你可以跳到 [配置目标 Google Cloud 项目](#Configure-the-target-Google-Cloud-project) 并向你的管理员请求基础服务账户电子邮件。

#### 启用功能开关（feature flag）

你必须在 Label Studio 部署中启用 `fflag_feat_bros_763_gcs_sa_impersonation` 功能开关才能使用服务账户模拟。你可以在 helm chart 的 [extraEnvironmentVars](helm_values#The-global-extraEnvironmentVars-usage) 下添加它：

```yaml
global:
  extraEnvironmentVars:
      fflag_feat_bros_763_gcs_sa_impersonation: "true"
```

!!! note
    环境变量名称必须 **小写**。Label Studio 功能开关解析器以区分大小写的方式匹配 `fflag_` 前缀。

#### 创建基础服务账户

在 GKE 项目中创建一个 GCP 服务账户，它将作为你的 Label Studio Pod 的身份。这是稍后将被授予在其他项目中模拟目标服务账户权限的“基础”服务账户。

1. 从 Google Cloud Console 中，确保你在 **GKE 项目**（部署了 Label Studio 的项目）中。
2. 转到 [**IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）**](https://console.cloud.google.com/iam-admin/serviceAccounts)。
3. 点击 **Create Service Account（创建服务账户）**。
4. 输入名称和描述（例如 `lse-base`）。
5. 点击 **Done（完成）**。此阶段无需授予额外的角色。
6. 记下服务账户电子邮件（例如 `lse-base@your-gke-project.iam.gserviceaccount.com`）。这是你将与需要配置存储访问权限的数据团队共享的 **基础服务账户电子邮件**。

#### 将基础服务账户绑定到 Kubernetes 服务账户

使用 [GKE 工作负载身份](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) 将 GCP 基础服务账户链接到 Label Studio Pod 使用的 Kubernetes 服务账户。这允许 Pod 在没有管理密钥的情况下自动以基础服务账户的身份进行身份认证。

1. 将工作负载身份注解添加到 Label Studio 使用的 Kubernetes 服务账户：

    ```shell
    kubectl annotate serviceaccount label-studio-sa \
      --namespace=label-studio \
      iam.gke.io/gcp-service-account=BASE_SA_EMAIL
    ```

    将 `label-studio-sa` 和 `label-studio` 替换为你的实际 Kubernetes 服务账户名称和命名空间，并将 `BASE_SA_EMAIL` 替换为上一步中的电子邮件。

2. 授予工作负载身份用户角色，以便 Kubernetes 服务账户可以充当 GCP 服务账户：

    ```shell
    gcloud iam service-accounts add-iam-policy-binding BASE_SA_EMAIL \
      --role="roles/iam.workloadIdentityUser" \
      --member="serviceAccount:GKE_PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"
    ```

    其中：

    * `BASE_SA_EMAIL` 是基础服务账户电子邮件（例如 `lse-base@your-gke-project.iam.gserviceaccount.com`）。
    * `GKE_PROJECT_ID` 是你的 GKE 项目的 ID。
    * `NAMESPACE` 是部署了 Label Studio 的 Kubernetes 命名空间（例如 `label-studio`）。
    * `KSA_NAME` 是 Label Studio 使用的 Kubernetes 服务账户的名称（例如 `label-studio-sa`）。

3. 通过运行一个测试 Pod 来验证绑定是否生效：

    ```shell
    kubectl run workload-identity-test \
      --image=google/cloud-sdk:slim \
      --serviceaccount=label-studio-sa \
      --namespace=label-studio \
      -it --rm -- gcloud auth list
    ```

    输出应显示基础服务账户电子邮件作为活动账户。

有关更多信息，请参阅 Google Cloud 文档中的 [使用工作负载身份](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。

<details>
<summary>使用 Terraform</summary>
<br>

```hcl
resource "google_service_account" "lse_base" {
  project      = "your-gke-project"
  account_id   = "lse-base"
  display_name = "Label Studio Base SA"
}

resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.lse_base.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:your-gke-project.svc.id.goog[label-studio/label-studio-sa]"
}
```

将 `your-gke-project`、`label-studio` 和 `label-studio-sa` 替换为你的实际项目 ID、命名空间和 Kubernetes 服务账户名称。

</details>

### 配置目标 Google Cloud 项目

#### 第 1 步：在目标 Google Cloud 项目中创建服务账户

在包含你的存储桶的 Google Cloud 项目中，创建一个服务账户，Label Studio 将模拟该账户以访问你的数据。

1. 从 Google Cloud Console 中，转到 [**IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）**](https://console.cloud.google.com/iam-admin/serviceAccounts)。
2. 点击 **Create Service Account（创建服务账户）**。
3. 输入名称和描述（例如 `sa-label-studio-data`）。
4. 点击 **Create and Continue（创建并继续）**。
5. 记下服务账户电子邮件（例如 `sa-label-studio-data@your-data-project.iam.gserviceaccount.com`）。你稍后需要它。

请参阅 Google Cloud 文档中的 [创建服务账户](https://cloud.google.com/iam/docs/service-accounts-create)。

#### 第 2 步：授予目标服务账户对存储桶的访问权限

授予目标服务账户对你想要连接到 Label Studio 的 Google Cloud Storage 存储桶的适当角色。你需要的角色取决于你计划如何使用存储：

* 对于 **源存储**（导入数据）：`roles/storage.objectViewer`
* 对于 **目标存储**（导出标注）：`roles/storage.objectAdmin`

`roles/storage.objectAdmin` 对于目标存储是必需的，因为 Label Studio 需要在存储桶中创建、覆盖以及（可选地）删除对象。如果你只需要不带删除的写入访问权限，`roles/storage.objectCreator` 就足够了，但 **Can delete objects from storage（可以从存储中删除对象）** 选项将不起作用。

1. 转到 [**Cloud Storage > Buckets（云存储 > 存储桶）**](https://console.cloud.google.com/storage/browser) 并选择你的存储桶。
2. 点击 **Permissions（权限）**，然后点击 **Grant Access（授予访问权限）**。
3. 在 **New principals（新主体）** 字段中，输入你 [在第 1 步](#Step-1-Create-a-service-account-in-your-target-Google-Cloud-project) 收到的目标服务账户电子邮件。
4. 在 **Role（角色）** 下拉菜单中，为源存储选择 **Storage Object Viewer**（`roles/storage.objectViewer`），为目标存储选择 **Storage Object Admin**（`roles/storage.objectAdmin`）。如果需要，使用 **Add another role（添加另一个角色）** 来同时添加两者。
5. 点击 **Save（保存）**。

<details>
<summary>使用 gcloud</summary>
<br>

对于源存储（读取访问权限）：

```shell
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME \
  --member="serviceAccount:TARGET_SA_EMAIL" \
  --role="roles/storage.objectViewer"
```

对于目标存储（写入和删除访问权限）：

```shell
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME \
  --member="serviceAccount:TARGET_SA_EMAIL" \
  --role="roles/storage.objectAdmin"
```

将 `YOUR_BUCKET_NAME` 和 `TARGET_SA_EMAIL` 替换为你的实际值。

</details>

#### 第 3 步：允许从 Label Studio 基础服务账户进行模拟

此步骤授权 Label Studio 基础服务账户（在 GKE 中运行）模拟你的目标服务账户。

向目标服务账户上的基础服务账户授予 `roles/iam.serviceAccountTokenCreator`。此角色还包括 `signBlob` 权限，Label Studio 使用该权限为存储对象的直接浏览器访问生成预签名 URL。

1. 转到 [**IAM & Admin > Service Accounts（IAM 与管理 > 服务账户）**](https://console.cloud.google.com/iam-admin/serviceAccounts) 并选择你 [在第 1 步](#Step-1-Create-a-service-account-in-your-target-Google-Cloud-project) 创建的目标服务账户。
2. 点击 **Permissions（权限）** 选项卡，然后点击 **Grant Access（授予访问权限）**。
3. 在 **New principals（新主体）** 字段中，输入 [你的 Label Studio 平台管理员在基础账户中](#Create-a-base-service-account) 提供的 **基础服务账户电子邮件**。
4. 在 **Role（角色）** 下拉菜单中，选择 **Service Account Token Creator**（`roles/iam.serviceAccountTokenCreator`）。
5. 点击 **Save（保存）**。

<details>
<summary>使用 gcloud</summary>
<br>

```shell
gcloud iam service-accounts add-iam-policy-binding TARGET_SA_EMAIL \
  --member="serviceAccount:BASE_SA_EMAIL" \
  --role="roles/iam.serviceAccountTokenCreator"
```

其中：

* `TARGET_SA_EMAIL` 是你 [在第 1 步](#Step-1-Create-a-service-account-in-your-target-Google-Cloud-project) 收到的目标服务账户的电子邮件。
* `BASE_SA_EMAIL` 是 [你的 Label Studio 平台管理员在基础账户中](#Create-a-base-service-account) 提供的基础服务账户电子邮件。

</details>

#### 第 4 步：在存储桶上配置 CORS（预签名 URL 所需）

如果你计划使用 **预签名 URL**（默认值），你必须在 GCS 存储桶上配置跨域资源共享（CORS），以便标注者的浏览器可以直接从 Google Cloud Storage 加载媒体文件。

1. 创建一个名为 `cors.json` 的文件，内容如下：

    ```json
    [
      {
        "origin": ["https://your-label-studio-domain.com"],
        "method": ["GET", "HEAD"],
        "responseHeader": ["Content-Type", "Content-Range", "Content-Disposition"],
        "maxAgeSeconds": 3600
      }
    ]
    ```

    将 `https://your-label-studio-domain.com` 替换为你的 Label Studio 实例可访问的 URL。

2. 将 CORS 配置应用到存储桶：

    ```shell
    gcloud storage buckets update gs://YOUR_BUCKET_NAME --cors-file=cors.json
    ```

3. 验证 CORS 配置：

    ```shell
    gcloud storage buckets describe gs://YOUR_BUCKET_NAME --format="default(cors_config)"
    ```

如果你使用 **通过平台代理（Proxy through the platform）** 模式而不是预签名 URL，则不需要 CORS 配置，因为所有流量都通过 Label Studio 服务器。

### 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储**。

选择 **Google Cloud Storage (SA Impersonation)（Google Cloud Storage（服务账户模拟））** 并点击 **下一步**。

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
      输入你的 Google Cloud Storage 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Target Service Account Email（目标服务账户电子邮件）</td>
    <td>
      输入你 <a href="#Step-1-Create-a-service-account-in-your-target-Google-Cloud-project">在第 1 步</a> 创建的目标服务账户的电子邮件（例如 <code>sa-label-studio-data@your-data-project.iam.gserviceaccount.com</code>）。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      输入存储桶所在的 Google 项目的 ID（例如 <code>your-data-project</code>）。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Use pre-signed URLs（启用）/ <br/> Proxy through the platform（关闭）</td>
    <td>
      这决定了从你的存储桶加载数据的方式：
      <ul>
        <li><strong>使用预签名 URL</strong>：Label Studio 直接为你的 GCS 对象生成有时间限制的 HTTPS 链接，并将浏览器重定向到那里（HTTP 303），因此标注者的浏览器直接从云存储下载媒体文件。这通常更快且扩展性更好，但需要在存储桶上 <a href="#Step-4-Configure-CORS-on-the-bucket-required-for-pre-signed-URLs">配置 CORS</a>。URL 签名所需的 <code>signBlob</code> 权限已包含在 <a href="#Step-3-Allow-impersonation-from-the-Label-Studio-base-service-account">第 3 步</a> 授予的 <code>roles/iam.serviceAccountTokenCreator</code> 角色中。</li>
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
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的容器内子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

### 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储**。

选择 **Google Cloud Storage (SA Impersonation)（Google Cloud Storage（服务账户模拟））** 并点击 **下一步**。

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
      输入你的 GCS 存储桶名称。
    </td>
  </tr>

  <tr>
    <td>Bucket Prefix（存储桶前缀）</td>
    <td>
      可选地，输入你要在其中使用的存储桶内的目录名称。例如 <code>data-set-1</code> 或 <code>data-set-1/subfolder-2</code>。
    </td>
  </tr>

  <tr>
    <td>Target Service Account Email（目标服务账户电子邮件）</td>
    <td>
      输入你在第 1 步创建的目标服务账户的电子邮件（例如 <code>sa-label-studio-data@your-data-project.iam.gserviceaccount.com</code>）。
    </td>
  </tr>

  <tr>
    <td>Google Project ID（Google 项目 ID）</td>
    <td>
      输入存储桶所在的 Google 项目的 ID（例如 <code>your-data-project</code>）。你可以在 Google Cloud Console 的 <strong>IAM & Admin > Settings（IAM 与管理 > 设置）</strong> 下找到它。
    </td>
  </tr>

  <tr>
    <td>Can delete objects from storage（可以从存储中删除对象）</td>
    <td>如果你希望在 Label Studio 中删除的标注也能够在存储桶中被删除，请启用此选项。这要求目标服务账户在存储桶上具有 <code>roles/storage.objectAdmin</code> 角色（见 <a href="#Step-2-Grant-the-target-service-account-access-to-your-bucket">第 2 步</a>）。</td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

### 故障排查

| 错误 | 原因 | 解决方案 |
|-------|-------|----------|
| Label Studio 中没有 **Google Cloud Storage (SA Impersonation)（Google Cloud Storage（服务账户模拟））** 选项 | 你尚未启用所需的功能开关。 | 在你的 Label Studio GKE 部署中设置功能开关（见 [启用功能开关](#Enable-the-feature-flag)）。请注意环境变量必须 **小写**：`fflag_feat_bros_763_gcs_sa_impersonation`。 |
| `Permission 'iam.serviceAccounts.getAccessToken' denied on resource (or it may not exist)`（权限 'iam.serviceAccounts.getAccessToken' 在资源上被拒绝（或它可能不存在）） | 基础服务账户没有权限模拟目标服务账户。 | 验证基础服务账户在目标服务账户上具有 `roles/iam.serviceAccountTokenCreator`（见 [第 3 步](#Step-3-Allow-impersonation-from-the-Label-Studio-base-service-account)）。 |
| `404 Service account not found（404 找不到服务账户）` | 目标服务账户电子邮件不正确或该账户不存在。 | 验证电子邮件以 `.iam.gserviceaccount.com` 结尾，并且该账户存在于你的 GCP 项目中。 |
| `Permission 'storage.buckets.get' denied on resource` 或 `403 Access denied to bucket` | 目标服务账户在存储桶上没有必要的权限。 | 授予目标服务账户在存储桶上的 `roles/storage.objectViewer`（对于源存储）或 `roles/storage.objectAdmin`（对于目标存储）（见 <a href="#Step-2-Grant-the-target-service-account-access-to-your-bucket">第 2 步</a>）。 |
| 图像或媒体文件未加载；浏览器控制台中出现 CORS 错误 | GCS 存储桶没有为你的 Label Studio 域名配置 CORS。这仅在使用预签名 URL 时适用。 | 向存储桶添加 CORS 策略，允许从你的 Label Studio URL 进行 `GET` 和 `HEAD`（见 <a href="#Step-4-Configure-CORS-on-the-bucket-required-for-pre-signed-URLs">第 4 步</a>）。 |

</div>

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)

## 用于增强 GCS 安全性的 IP 过滤

Google Cloud Storage 提供 [存储桶 IP 过滤](https://cloud.google.com/storage/docs/ip-filtering-overview) 作为一种强大的安全机制，可根据源 IP 地址限制对你的数据的访问。此功能有助于防止未经授权的访问，并提供对谁可以与你的存储桶交互的细粒度控制。

阅读更多关于 [位于你的 VPC 之后的源存储](security.html#Source-storage-behind-your-VPC)。

**常见用例：**
- 仅将存储桶访问限制为你的组织的 IP 范围
- 仅允许从你基础设施中的特定 VPC 网络进行访问
- 通过限制对已知 IP 地址的访问来保护敏感数据
- 通过将第三方集成的 IP 加入白名单来控制对其的访问

<details>
<summary>如何设置 IP 过滤</summary>
<br>

1. 首先，通过控制台或 CLI 创建你的 GCS 存储桶
2. 创建一个 JSON 配置文件以定义 IP 过滤规则。你有两个选项：
   对于公共 IP 范围：
```json
{
  "mode": "Enabled", 
  "publicNetworkSource": {
    "allowedIpCidrRanges": [
      "xxx.xxx.xxx.xxx", // 你的第一个 IP 地址
      "xxx.xxx.xxx.xxx", // 你的第二个 IP 地址
      "xxx.xxx.xxx.xxx/xx" // 你的 CIDR 表示法的 IP 范围
    ]
  }
}
```

<div class="enterprise-only">

!!! note
    如果你在 app.humansignal.com 使用 Label Studio Enterprise 并从你的办公室网络访问它：
    - 添加 Label Studio Enterprise 的对外 IP 地址（见 [IP 范围](saas.html#IP-ranges)）
    - 添加你的办公室网络 IP 范围（例如 192.168.1.0/24）
    - 如果 Label Studio Enterprise 和你的办公室都在同一个 VPN 网络（例如 10.0.0.0/16）上，你只需添加该 VPN 子网

</div>

对于 VPC 网络来源：
```json
{
  "mode": "Enabled",
  "vpcNetworkSources": [
    {
      "network": "projects/PROJECT_ID/global/networks/NETWORK_NAME",
      "allowedIpCidrRanges": [
        RANGE_CIDR
      ]
    }
  ]
}
```

3. 使用以下命令将 IP 过滤规则应用到你的存储桶：
```bash
gcloud alpha storage buckets update gs://BUCKET_NAME --ip-filter-file=IP_FILTER_CONFIG_FILE
```

4. 不再需要时，移除 IP 过滤规则：
```bash
gcloud alpha storage buckets update gs://BUCKET_NAME --clear-ip-filter
```

#### 需要考虑的限制
- 所有规则中最多 200 个 IP CIDR 块
- IP 过滤规则中最多 25 个 VPC 网络
- 不支持双区域存储桶
- 可能会影响来自某些 Google Cloud 服务的访问

[阅读更多关于 GCS IP 过滤](https://cloud.google.com/storage/docs/ip-filtering-overview)

</details>
