---
title: 设置持久化存储
type: guide
tier: all
order: 87
order_enterprise: 87
meta_title: 使用 Label Studio 设置持久化存储
meta_description: 为托管在云端的 Label Studio 配置持久化存储，以存储上传的数据（如任务数据、用户图像等）。
section: "安装与设置"
---

设置持久化存储，以便上传的任务数据、用户图像和其他媒体在重启后保留，并对所有 Label Studio 组件可用。

!!! note
    默认情况下，Label Studio 使用 nginx 来提供上传的媒体。要使持久化存储正常工作，请与 Label Studio 一起运行 nginx。这是推荐的设置，可减轻 Label Studio 服务器的负载。

    如果你使用没有 nginx 的最小化设置，可以设置 `USE_NGINX_FOR_UPLOADS=false` 和 `USE_NGINX_FOR_EXPORT_DOWNLOADS=false`。在这种情况下，Label Studio 提供所有上传和导出。这不推荐：它会增加 uwsgi 工作进程的负载，并且在用户处理大文件时可能导致中断。

根据你的部署选择以下之一：

* **[Kubernetes 搭配 PVC](#Set-up-Kubernetes-PVC)** — 使用持久卷声明（ReadWriteMany）进行集群内存储。
* **[Amazon S3](#Set-up-Amazon-S3)** — 适用于 AWS 或 Docker Compose。
* **[Google Cloud Storage（GCS）](#Set-up-Google-Cloud-Storage)** — 适用于 Google Cloud 或 Docker Compose。
* **[Microsoft Azure 存储](#Set-up-Microsoft-Azure-Storage)** — 适用于 Azure 或 Docker Compose。

## 设置 Kubernetes PVC

<a id="Set-up-Kubernetes-PVC"></a>

当你在 Kubernetes 上部署 Label Studio 时，可以使用持久卷声明（PVC）作为持久化存储，而不是云对象存储。PVC **必须**支持 **ReadWriteMany** 访问模式，以便多个 Pod（例如 app 和 rqworker）可以读写同一卷。

在 `ls-values.yaml` 中使用 `persistence.config.volume` 部分配置持久化，并将 `accessModes` 设置为 `ReadWriteMany`：

```yaml
global:
  persistence:
    enabled: true
    type: volume
    config:
      volume:
        size: 50Gi
        accessModes:
          - ReadWriteMany
```

!!! note
    你的集群必须提供支持 `ReadWriteMany` 的 StorageClass 或默认存储（例如 NFS、EFS、Azure Files 或其他网络支持的存储）。标准块存储（例如许多默认云磁盘）通常仅支持 ReadWriteOnce，当多个 Pod 需要挂载同一 PVC 时不适用。

## 设置 Amazon S3

<a id="Set-up-Amazon-S3"></a>

将 Amazon S3 设置为托管在 AWS 中或使用 Docker Compose 的 Label Studio 的持久化存储。

### 创建 S3 存储桶

首先按照 Amazon Simple Storage Service 用户指南中的步骤[创建 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。

!!! note
    如果你想在静态时保护存储在 S3 存储桶中的数据，可以按照 Amazon Simple Storage Service 用户指南中的步骤[为 Amazon S3 存储桶设置默认服务器端加密](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html)。

### 为 S3 存储桶配置 CORS

!!! note
    如果你打算使用直接文件上传功能并存储音频、视频、csv 等媒体文件，应完成此步骤。

为你的存储桶设置跨源资源共享（CORS）访问。请参阅 Amazon S3 用户指南中的[配置跨源资源共享（CORS）](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enabling-cors-examples.html)。使用或修改以下示例：
```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "*"
    ],
    "ExposeHeaders": [
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### 配置 S3 存储桶

创建 S3 存储桶后，设置必要的 IAM 权限以授予 Label Studio 对你的存储桶的访问权限。你有四种方式管理对 S3 存储桶的访问：
- 使用 OIDC 提供商设置 **IAM 角色**（**推荐**）。
- 使用 **访问密钥**。
- 不使用 OIDC 提供商设置 **IAM 角色**。
- 使用 **带有 Docker Compose 的访问密钥**。

选择相关标签页并按照你所需选项的步骤操作：

<div class="code-tabs">
  <div data-name="IAM 角色（OIDC）">

!!! note
    要使用此方法设置 IAM 角色，你必须为集群配置并预置 OIDC 提供商。请参阅 Amazon EKS 用户指南中的[为你的集群创建 IAM OIDC 提供商](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)。

1. 按照 Amazon EKS 用户指南中的步骤[为你的服务账户创建 IAM 角色和策略](https://docs.aws.amazon.com/eks/latest/userguide/create-service-account-iam-policy-and-role.html)。
2. 使用以下 IAM 策略，将 `<YOUR_S3_BUCKET>` 替换为你的存储桶名称：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>/*"
      ]
    }
  ]
}
```

3. 创建 **IAM 角色作为 Web 身份**，使用集群 OIDC 提供商作为身份提供商：
   - 从你的 IAM 控制台创建新的 **角色**。
   - 选择 **Web identity**（Web 身份）标签页。
   - 在 **Identity Provider**（身份提供商）下拉列表中，选择你的 EKS 的 OpenID Connect 提供商 URL 和 `sts.amazonaws.com` 作为受众。
   - 将新创建的权限附加到角色并为其命名。
   - 检索角色 ARN 以备下一步使用。
4. 创建 IAM 角色后，将其作为注解添加到你的 `ls-values.yaml` 文件中。
   或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: s3
    config:
      s3:
        bucket: "<YOUR_BUCKET_NAME>"
        region: "<YOUR_BUCKET_REGION>"
        folder: ""
app:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME_FROM_STEP_3>

rqworker:
  serviceAccount:
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME_FROM_STEP_3>
```

  </div>

  <div data-name="访问密钥">

1. 创建具有 **编程访问** 的 IAM 用户。请参阅 AWS Identity and Access Management 用户指南中的[在你的 AWS 账户中创建 IAM 用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)。
2. 创建用户时，对于 **Set permissions**（设置权限）选项，选择 **Attach existing policies directly**（直接附加现有策略）。
3. 选择 **Create policy**（创建策略）并附加以下策略，将 `<YOUR_S3_BUCKET>` 替换为你的存储桶名称：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>/*"
      ]
    }
  ]
}
```

4. 创建用户后，将用户名和访问密钥保存在安全的地方。
5. 使用你新创建的访问密钥 ID 和私有密钥更新你的 `ls-values.yaml` 文件，分别作为 `<YOUR_ACCESS_KEY_ID>` 和 `<YOUR_SECRET_ACCESS_KEY>`。
   或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: s3
    config:
      s3:
        accessKey: "<YOUR_ACCESS_KEY_ID>"
        secretKey: "<YOUR_SECRET_ACCESS_KEY>"
        bucket: "<YOUR_BUCKET_NAME>"
        region: "<YOUR_BUCKET_REGION>"
        folder: ""
```

!!! note
    或者，你可以使用已存在的 Kubernetes 密钥和键。

1. 使用你的 AWS 访问密钥创建 Kubernetes 密钥：
```shell
kubectl create secret generic <YOUR_SECRET_NAME> --from-literal=accesskey=<YOUR_ACCESS_KEY_ID> --from-literal=secretkey=<YOUR_SECRET_ACCESS_KEY>
```
2. 使用你新创建的 Kubernetes 密钥更新你的 `ls-values.yaml` 文件：
```yaml
global:
  persistence:
    enabled: true
    type: s3
    config:
      s3:
        accessKeyExistingSecret: "<YOUR_SECRET_NAME>"
        accessKeyExistingSecretKey: "accesskey"
        secretKeyExistingSecret: "<YOUR_SECRET_NAME>"
        secretKeyExistingSecretKey: "secretkey"
        bucket: "<YOUR_BUCKET_NAME>"
        region: "<YOUR_BUCKET_REGION>"
```

  </div>

  <div data-name="IAM 角色（EKS 节点）">

要在 EKS 中不使用 OIDC 创建 IAM 角色，请按照以下步骤操作。

1. 在 AWS 控制台 UI 中，转到 **EKS > Clusters（集群）> `YOUR_CLUSTER_NAME` > Node Group（节点组）**。
2. 选择部署了 Label Studio 的 `YOUR_NODE_GROUP` 名称。
3. 在 **Details**（详细信息）页面上，找到并选择 Node IAM Role ARN 选项，并选择 **Attach existing policies directly**（直接附加现有策略）。
3. 选择 **Create policy**（创建策略）并附加以下策略，将 `<YOUR_S3_BUCKET>` 替换为你的存储桶名称：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>/*"
      ]
    }
  ]
}
```

4. 添加 IAM 策略后，配置你的 `ls-values.yaml` 文件。
   或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: s3
    config:
      s3:
        bucket: "<YOUR_BUCKET_NAME>"
        region: "<YOUR_BUCKET_REGION>"
        folder: ""
```

  </div>

  <div data-name="Docker Compose">

1. 创建具有 **编程访问** 的 IAM 用户。请参阅 AWS Identity and Access Management 用户指南中的[在你的 AWS 账户中创建 IAM 用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)。
2. 创建用户时，对于 **Set permissions**（设置权限）选项，选择 **Attach existing policies directly**（直接附加现有策略）。
3. 选择 **Create policy**（创建策略）并附加以下策略，将 `<YOUR_S3_BUCKET>` 替换为你的存储桶名称：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::<YOUR_S3_BUCKET>/*"
      ]
    }
  ]
}
```

4. 创建用户后，将用户名和访问密钥保存在安全的地方。
5. 更新你的 `env.list` 文件，将 `<YOUR_ACCESS_KEY_ID>` 和 `<YOUR_SECRET_ACCESS_KEY>` 替换为你的新访问密钥 ID 和私有密钥。或者，你可以使用 `STORAGE_AWS_FOLDER` 指定文件夹（默认为 `""` 或省略此参数）：
```shell
STORAGE_TYPE=s3
STORAGE_AWS_ACCESS_KEY_ID="<YOUR_ACCESS_KEY_ID>"
STORAGE_AWS_SECRET_ACCESS_KEY="<YOUR_SECRET_ACCESS_KEY>"
STORAGE_AWS_BUCKET_NAME="<YOUR_BUCKET_NAME>"
STORAGE_AWS_REGION_NAME="<YOUR_BUCKET_REGION>"
STORAGE_AWS_FOLDER=""
```

  </div>
</div>

## 设置 Google Cloud Storage

<a id="Set-up-Google-Cloud-Storage"></a>

将 Google Cloud Storage（GCS）设置为托管在 Google Cloud Platform（GCP）中或使用 Docker Compose 的 Label Studio 的持久化存储。

### 创建 GCS 存储桶

1. 首先创建存储桶。请参阅 Google Cloud Storage 指南中的[创建存储桶](https://cloud.google.com/storage/docs/creating-buckets)。例如，名为 `heartex-example-bucket-123456` 的存储桶。
2. 选择存储桶的[访问控制方法](https://cloud.google.com/storage/docs/access-control)时，选择 **uniform access control**（统一访问控制）。
3. 创建 IAM 服务账户。请参阅 Google Cloud Storage 指南中的[创建和管理服务账户](https://cloud.google.com/iam/docs/creating-managing-service-accounts)。
4. 选择预定义的 **Storage Object Admin**（存储对象管理员）IAM 角色添加到服务账户，以便该账户可以创建、访问和删除存储桶中的对象。
5. 向该角色添加条件，将角色限制为仅访问属于你创建的存储桶的对象。你可以通过两种方式之一添加条件：
    - 设置服务账户 IAM 角色时选择 **Add Condition**（添加条件），然后使用 **Condition Builder**（条件构建器）指定以下值：
      - 条件类型（Condition type）：`Name`
      - 运算符（Operator）：`Starts with`（以…开头）
      - 值（Value）：`projects/_/buckets/heartex-example-bucket-123456`
    - 或者，**使用通用表达式语言**（CEL）指定 IAM 条件。例如，设置以下内容：`resource.name.startsWith('projects/_/buckets/heartex-example-bucket-123456')`。请参阅 Google Cloud Storage 指南中的[Overview of IAM Conditions 中的 CEL for Conditions](https://cloud.google.com/iam/docs/conditions-overview#cel)。

### 为 GCS 存储桶配置 CORS

!!! note
    如果你打算使用直接文件上传功能并存储音频、视频、csv 等媒体文件，应完成此步骤。

为你的存储桶设置 CORS 访问。请参阅 Google Cloud 用户指南中的[配置跨源资源共享（CORS）](https://cloud.google.com/storage/docs/configuring-cors#configure-cors-bucket)。使用或修改以下示例：
```shell
echo '[
   {
      "origin": ["*"],
      "method": ["GET","PUT","POST","DELETE","HEAD"],
      "responseHeader": ["Content-Type","Access-Control-Allow-Origin"],
      "maxAgeSeconds": 3600
   }
]' > cors-config.json
```

在以下命令中将 `YOUR_BUCKET_NAME` 替换为你的实际存储桶名称，以更新存储桶的 CORS：
```shell
gsutil cors set cors-config.json gs://YOUR_BUCKET_NAME
```

### 配置 GCS 存储桶

你可以使用 **Workload Identity** 或 **Access keys**（访问密钥）将 Label Studio 连接到你的 GCS 存储桶。

创建存储桶并设置 IAM 权限后，将 Label Studio 连接到你的 GCS 存储桶。有三种连接方式：
- 使用 Workload Identity 允许 GKE 中的工作负载通过模拟你创建的服务账户来访问你的 GCS 存储桶（**推荐**）。
- 创建服务账户密钥以在 Google Cloud 外部使用服务账户。
- 创建服务账户密钥以与 Docker Compose 一起使用。

<div class="code-tabs">
<div data-name="Workload Identity">

!!! note
    确保 Workload Identity 在你的 GKE 集群上已启用，并且你满足必要的先决条件。请参阅 Google Kubernetes Engine 指南中的[使用 Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)。

1. 设置以下环境变量，将你创建的服务账户指定为 `GCP_SA` 变量，并根据需要用 `<>` 中的其他引用替换：
```shell
GCP_SA=<Service-Account-You-Created>
APP_SA="serviceAccount:<GCP_PROJECT_ID>.svc.id.goog[<K8S_NAMESPACE>/<HELM_RELEASE_NAME>-lse-app]"
WORKER_SA="serviceAccount:<GCP_PROJECT_ID>.svc.id.goog[<K8S_NAMESPACE>/<HELM_RELEASE_NAME>-lse-rqworker]"
```

2. 在集群上的 Kubernetes 服务账户与你创建的 GCS 服务账户之间创建 IAM 策略绑定，允许 Label Studio 应用的 K8s 服务账户和相关的 rqworker 模拟另一个服务账户。从命令行运行以下命令：
```shell
gcloud iam service-accounts add-iam-policy-binding ${GCP_SA} \
    --role roles/iam.workloadIdentityUser \
    --member "${APP_SA}"
gcloud iam service-accounts add-iam-policy-binding ${GCP_SA} \
    --role roles/iam.workloadIdentityUser \
    --member "${WORKER_SA}"
```

3. 绑定服务账户后，更新你的 `ls-values.yaml` 文件以包含服务账户和其他配置的值。更新 `projectID`、`bucket`，并将 `<GCP_SERVICE_ACCOUNT>` 替换为你的部署的相关值。
   或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: gcs
    config:
      gcs:
        projectID: "<YOUR_PROJECT_ID>"
        bucket: "<YOUR_BUCKET_NAME>"
        folder: ""
app:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<GCP_SERVICE_ACCOUNT>"

rqworker:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: "<GCP_SERVICE_ACCOUNT>"
```

</div>
<div data-name="服务账户密钥">

你可以使用你创建的服务账户密钥，或者如果你已经有 Kubernetes 密钥和键，请按照[以下步骤](#Use-an-existing-Kubernetes-secret-and-key)使用它们。

#### 创建新的服务账户密钥

<a id="Use-an-existing-Kubernetes-secret-and-key"></a>

1. 从 UI 创建服务账户密钥并下载 JSON。按照 Google Cloud Identity and Access Management 指南中的[创建和管理服务账户密钥](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)步骤操作。

2. 下载服务账户密钥的 JSON 后，在你的 `ls-values.yaml` 文件中更新或创建对 JSON、projectID 和存储桶的引用。
   或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: gcs
    config:
      gcs:
        projectID: "<YOUR_PROJECT_ID>"
        applicationCredentialsJSON: "<YOUR_JSON>"
        bucket: "<YOUR_BUCKET_NAME>"
        folder: ""
```

#### 使用现有的 Kubernetes 密钥和键

1. 使用你的 GCS 服务账户 JSON 文件创建 Kubernetes 密钥，将 `<PATH_TO_JSON>` 替换为服务账户 JSON 文件的路径：
```shell
kubectl create secret generic <YOUR_SECRET_NAME> --from-file=key_json=<PATH_TO_JSON>
```

2. 使用你新创建的 Kubernetes 密钥更新你的 `ls-values.yaml` 文件：
```yaml
global:
   persistence:
      enabled: true
      type: gcs
      config:
         gcs:
            projectID: "<YOUR_PROJECT_ID>"
            applicationCredentialsJSONExistingSecret: "<YOUR_SECRET_NAME>"
            applicationCredentialsJSONExistingSecretKey: "key_json"
            bucket: "<YOUR_BUCKET_NAME>"
```

</div>
<div data-name="Docker Compose">

1. 从 UI 创建服务账户密钥并下载 JSON。按照 Google Cloud Identity and Access Management 指南中的[创建和管理服务账户密钥](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)步骤操作。
2. 下载服务账户密钥的 JSON 后，在你的 `env.list` 文件中更新或创建对 JSON、projectID 和存储桶的引用。
   或者，你可以通过指定 `STORAGE_GCS_FOLDER` 选择文件夹（默认为 `""` 或省略此参数）：
```shell
STORAGE_TYPE=gcs
STORAGE_GCS_BUCKET_NAME="<YOUR_BUCKET_NAME>"
STORAGE_GCS_PROJECT_ID="<YOUR_PROJECT_ID>"
STORAGE_GCS_FOLDER=""
GOOGLE_APPLICATION_CREDENTIALS="/opt/heartex/secrets/key.json"
```

3. 将第 1 步下载的 JSON 文件放在与你的 `env.list` 文件相同的目录中。

4. 在 `docker-compose.yml` 文件中附加以下条目作为 `app.volumes` 的路径：
```yaml
- ./service-account-file.json:/opt/heartex/secrets/key.json:ro
```

</div>
</div>


## 设置 Microsoft Azure 存储

<a id="Set-up-Microsoft-Azure-Storage"></a>

创建一个 Microsoft Azure 存储容器，用作 Label Studio 的持久化存储。

### 创建存储容器

1. 创建 Azure 存储账户。请参阅 Microsoft Azure 产品文档中的[创建存储账户](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)。

!!! note
    确保将 **Stock Keeping Unit（SKU，库存单位）** 设置为 `Premium_LRS`，并将 **kind** 参数设置为 `BlockBlobStorage`。此配置会使用固态硬盘（SSD）而不是标准硬盘驱动器（HDD）。如果你将此参数设置为基于 HDD 的存储选项，你的实例可能太慢并可能发生故障。

2. 在 [Azure Portal](https://portal.azure.com/) 中的 **Storage accounts > Access keys**（存储账户 > 访问密钥）部分找到生成的密钥，或运行以下命令：
```shell
az storage account keys list --account-name=${STORAGE_ACCOUNT}
```

3. 按照 Microsoft Azure 产品文档中的[使用 Azure 门户上传、下载和列出 Blob](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal)步骤，在你的存储账户中创建存储容器，或运行以下命令：
```shell
az storage container create --name <YOUR_CONTAINER_NAME> \
          --account-name <YOUR_STORAGE_ACCOUNT> \
          --account-key "<YOUR_STORAGE_KEY>"
```

### 为 Azure 存储桶配置 CORS

!!! note
    如果你打算使用直接文件上传功能并存储音频、视频、csv 等媒体文件，应完成此步骤。

为你的存储桶设置 CORS 访问。请参阅 Azure 用户指南中的[配置跨源资源共享（CORS）](https://docs.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services#enabling-cors-for-azure-storage)。使用或修改以下示例：
```xml
<Cors>
    <CorsRule>
        <AllowedOrigins>*</AllowedOrigins>
        <AllowedMethods>GET,PUT,POST,DELETE,HEAD</AllowedMethods>
        <AllowedHeaders>x-ms-blob-content-type</AllowedHeaders>
        <ExposedHeaders>x-ms-*</ExposedHeaders>
        <MaxAgeInSeconds>3600</MaxAgeInSeconds>
    </CorsRule>
<Cors>
```

### 配置 Azure 容器

你可以使用 Kubernetes 中的账户密钥或 Docker Compose 中的账户密钥将 Label Studio 连接到你的 Azure 容器。选择与你 Label Studio 部署相关的选项。

<div class="code-tabs">
  <div data-name="Kubernetes">

使用你创建的 `YOUR_CONTAINER_NAME`、`YOUR_STORAGE_ACCOUNT` 和 `YOUR_STORAGE_KEY` 更新你的 `ls-values.yaml` 文件。
或者，你可以通过指定 `folder` 选择文件夹（默认为 `""` 或省略此参数）：
```yaml
global:
  persistence:
    enabled: true
    type: azure
    config:
      azure:
        storageAccountName: "<YOUR_STORAGE_ACCOUNT>"
        storageAccountKey: "<YOUR_STORAGE_KEY>"
        containerName: "<YOUR_CONTAINER_NAME>"
        folder: ""
```

如果你已有密钥，可以改用它来创建 Kubernetes 密钥。
1. 使用你的 Azure 访问密钥创建 Kubernetes 密钥：
```shell
kubectl create secret generic <YOUR_SECRET_NAME> --from-literal=storageaccountname=<YOUR_STORAGE_ACCOUNT> --from-literal=storageaccountkey=<YOUR_STORAGE_KEY>
```
2. 使用你新创建的 Kubernetes 密钥更新你的 `ls-values.yaml` 文件：
```yaml
global:
   persistence:
      enabled: true
      type: azure
      config:
         azure:
            storageAccountNameExistingSecret: "<YOUR_SECRET_NAME>"
            storageAccountNameExistingSecretKey: "storageaccountname"
            storageAccountKeyExistingSecret: "<YOUR_SECRET_NAME>"
            storageAccountKeyExistingSecretKey: "storageaccountkey"
            containerName: "<YOUR_CONTAINER_NAME>"
```

  </div>

  <div data-name="Docker Compose">

使用你创建的 `YOUR_CONTAINER_NAME`、`YOUR_STORAGE_ACCOUNT` 和 `YOUR_STORAGE_KEY` 更新你的 `env.list` 文件。
或者，你可以通过指定 `STORAGE_AZURE_FOLDER` 选择文件夹（默认为 `""` 或省略此参数）：
```shell
STORAGE_TYPE=azure
STORAGE_AZURE_ACCOUNT_NAME="<YOUR_STORAGE_ACCOUNT>"
STORAGE_AZURE_ACCOUNT_KEY="<YOUR_STORAGE_KEY>"
STORAGE_AZURE_CONTAINER_NAME="<YOUR_CONTAINER_NAME>"
STORAGE_AZURE_FOLDER=""
```

  </div>
</div>
