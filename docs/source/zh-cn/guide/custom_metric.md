---
title: 为 Label Studio 添加自定义一致性指标
short: 自定义指标
tier: enterprise
type: guide
order: 0
order_enterprise: 310
meta_title: 为标注添加自定义一致性指标
meta_description: Label Studio Enterprise 文档，介绍如何添加自定义一致性指标，用于评估标注者一致性，或评估你数据标注和机器学习项目的标注和预测结果的质量。
section: "审查与衡量质量"
parent: "stats"
parent_enterprise: "stats"
---

编写自定义一致性指标来评估 Label Studio Enterprise 项目中预测和标注的质量。 

Label Studio Enterprise 包含各种[项目一致性指标](agreement_metrics)，但如果你想使用自定义指标或 Label Studio 中不可用的标准指标来评估标注，你可以编写自己的指标。 

!!! note
    此功能开箱即用地提供给 Label Studio Enterprise Cloud 用户。 
    
    对于 Label Studio Enterprise 本地部署环境，你必须配置你的云提供商以允许 Label Studio 部署和调用无服务器函数。Label Studio 支持 [AWS Lambda](#AWS-Lambda) 和 [Google Cloud Functions](#Google-Cloud-Functions)。有关更多信息，请参阅 [本地部署](#本地部署)。   


Label Studio Enterprise 包含各种标注和标注统计信息以及添加你自己统计信息的能力。Label Studio 的开源社区版不包含这些计算。如果你使用的是 Label Studio 社区版，请参阅 <a href="https://labelstud.io/guide/label_studio_compare.html">Label Studio 功能</a> 了解更多信息。

## 将你的自定义一致性指标添加到 Label Studio

自定义一致性指标在项目级别下的 **设置 > 质量 > 一致性 > 自定义一致性指标代码** 中添加。

!!! note 
    你必须先配置标注界面，然后才能添加自定义一致性指标。 

**使用 AWS Lambda 的本地部署**

| 字段 | 描述 |
| --- | --- |
| **Lambda 标签** | 使用语法 `tag_name tag_value` 为 AWS Lambda 函数添加标签。 |
| **Lambda 前缀** | 为 AWS Lambda 函数选择前缀。 |

**使用 Google Cloud Functions 的本地部署**

与 AWS Lambda 不同，你不能为 Google Cloud Functions 函数设置前缀或标签。请参阅下面的 [Label Studio 如何管理你的函数](#Label-Studio-如何管理你的函数)。 


## 如何编写你的自定义一致性指标

有关一致性指标的更多信息，请参阅 [任务一致性](stats)。

你可以使用一致性指标来比较两个标注，或者一个标注与一个预测。使用输入参数 `annotation_1` 和 `annotation_2` 指定要比较的标注，或者指定要比较的标注和预测。 

将你的代码添加到 Label Studio 中定义的以下函数中：
```python
def agreement(annotation_1, annotation_2, per_label=False) -> float:
```

此函数采用以下参数：

| 参数 | 格式 | 描述 |
| --- | --- | --- |
| `annotation_1` | JSON 对象 | 在计算一致性时要比较的第一个标注或预测。以 [Label Studio JSON 格式](export.html#Label-Studio-JSON-format-of-annotated-tasks) 检索。 |
| `annotation_2` | JSON 对象 | 在计算一致性时要比较的第二个标注或预测。以 [Label Studio JSON 格式](export.html#Label-Studio-JSON-format-of-annotated-tasks) 检索。 |
| `per_label` | 布尔值 | 是否对标注中的每个标签执行一致性计算，还是跨整个标注结果执行。  |
| `return` | 浮点数 | 要分配的一致性分数，作为 0 到 1 之间的浮点数。 |

例如，给定以下标注配置：

```xml
<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image" showInLine="true">
    <Choice value="Positive" />
    <Choice value="Negative" />
	<Choice value="Neutral" />
  </Choices>
</View>
```

以下一致性指标比较分类任务的两个标注，其选择项为 "Positive" 和 "Negative"：

```python
def agreement(annotation_1, annotation_2, per_label=False) -> float:

    # 以 Label Studio JSON 格式检索两个标注
    r1 = annotation_1["result"][0]["value"]["choices"][0]
    r2 = annotation_2["result"][0]["value"]["choices"][0]
    
    # 基于特定的选择值确定标注一致性
    if r1 == r2:
        # 如果标注匹配且包含选择项 "Positive"，返回一致性分数 0.99
        if r1 == "Positive":
            return 0.99
        # 如果标注匹配且包含选择项 "Negative"，返回一致性分数 0.7
        if r1 == "Negative":
            return 0.7
    # 如果标注不匹配，返回一致性分数 0
    else:
        return 0
```

如果你设置 `per_label=True`，你可以为每个标签定义单独的方法或一致性分数。如果这样做，你必须为每个标签返回单独的分数。例如，对于分类任务，你可以使用以下函数为标注中使用的每个标签分配权重并返回特定的一致性分数：

```python
def agreement(annotation_1, annotation_2, per_label=False) -> float:

    label_1 = annotation_1["result"][0]["value"]["choices"][0]
    label_2 = annotation_2["result"][0]["value"]["choices"][0]
    weight = {"Positive": 0.99, "Negative": 0.01}
    
    if label_1 == label_2:
        if per_label:
            return {label_1: weight[label_1]}
        else:
            return weight[label_1]
    else:
        if per_label:
            return {label_1: 0, label_2: 0}
        else:
            return 0
```

### 显示日志

你可以查看自定义一致性指标的日志以进行故障排除。 

要生成日志，你必须首先至少有一个由至少两个标注者标注的任务。 


## AWS Lambda（本地部署）

如果你将 Label Studio Enterprise 部署在私有云（自管理）Amazon Web Services（AWS）Elastic Compute Cluster（EC2）实例或 Amazon Elastic Kubernetes Service（EKS）中，你必须授予额外的权限，以便 Label Studio Enterprise 可以在 AWS Lambda 中运行自定义一致性指标。 

要设置权限，请执行以下操作： 
1. [创建一个 AWS IAM 角色](#步骤-1创建用于日志记录-的-aws-iam-角色) 供自定义指标 Lambda 函数用于将日志存储在 Cloudwatch 中
2. 设置授予对 AWS Lambda 访问权限的权限。如何执行此操作取决于你的部署场景：
   - [使用在 EC2 中运行的 Docker Compose 部署](#在-ec2-中运行的-docker-compose)。
   - [在带有 OIDC 提供商的 EKS 中部署](#在-带有-oidc-提供商的-eks-中部署)。
   - [在不带 OIDC 提供商的 EKS 中部署](#在-不带-oidc-提供商的-eks-中部署)。

你必须知道用于管理 Label Studio Enterprise 的 AWS 账户的 AWS 账户 ID 才能执行这些步骤。 

### 步骤 1：创建用于日志记录的 AWS IAM 角色

使用你首选的方法，创建一个 AWS IAM 角色。 

1. 创建一个名为 `LSE_CustomMetricsExecuteRole` 的 AWS IAM 角色。按照 AWS Identity and Access Management 文档中的[为 AWS 服务创建角色（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html#roles-creatingrole-service-console)中的步骤，创建用于向 AWS 服务委派权限的角色。
2. 无论你使用控制台还是 AWS CLI 创建角色，都要创建或附加以下 IAM 策略，以允许该角色将日志存储在 Cloudwatch 中。将 `YOUR_AWS_ACCOUNT` 替换为有权访问 Label Studio Enterprise 的 AWS 账户 ID。
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:*:YOUR_AWS_ACCOUNT:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:*:YOUR_AWS_ACCOUNT:log-group:/aws/lambda/custom-metric-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:PutRetentionPolicy"
            ],
           "Resource": [
               "arn:aws:logs:*:YOUR_AWS_ACCOUNT:log-group:/aws/lambda/custom-metric-*"
           ]
        }
    ]
}
```

#### 创建 IAM 策略以授予 AWS Lambda 权限

要向用于管理 Label Studio Enterprise 访问以与 AWS Lambda 交互的特定用户、角色或 EKS 节点组授予权限，请使用以下 IAM 策略。创建一个名为 `LSE_AllowInteractLambda` 的 IAM 策略，并将 `YOUR_AWS_ACCOUNT` 替换为你的 AWS 账户 ID：
```json
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Sid": "VisualEditor0",
         "Effect": "Allow",
         "Action": "iam:PassRole",
         "Resource": "arn:aws:iam::YOUR_AWS_ACCOUNT:role/LSE_CustomMetricsExecuteRole"
      },
      {
         "Sid": "VisualEditor1",
         "Effect": "Allow",
         "Action": [
            "lambda:CreateFunction",
            "lambda:UpdateFunctionCode",
            "lambda:InvokeFunction",
            "lambda:GetFunction",
            "lambda:DeleteFunction",
            "lambda:TagResource",
            "lambda:ListTags"
         ],
         "Resource": [
            "arn:aws:lambda:*:YOUR_AWS_ACCOUNT:function:custom-metric-*"
         ]
      },
      {
         "Sid": "VisualEditor2",
         "Effect": "Allow",
         "Action": "lambda:ListFunctions",
         "Resource": "*"
      },
      {
         "Action": [
            "logs:CreateLogGroup",
            "logs:PutRetentionPolicy",
            "logs:TagResource",
            "logs:StartQuery",
            "logs:GetQueryResults"
         ],
         "Effect": "Allow",
         "Resource": [
            "arn:aws:logs:*:YOUR_AWS_ACCOUNT:log-group:/aws/lambda/custom-metric-*"
         ]
      }
   ]
}
```

### 步骤 2：配置 Label Studio Enterprise 与 AWS Lambda 之间的权限

创建用于管理自定义一致性指标日志的 IAM 角色后，设置权限以允许 Label Studio Enterprise 与 AWS Lambda 交互。 

如何设置权限取决于你如何在自管理云基础设施中部署 Label Studio Enterprise：
- [使用在 EC2 中运行的 Docker Compose 部署](#在-ec2-中运行的-docker-compose)
- [在带有 OIDC 提供商的 EKS 中部署](#在-带有-oidc-提供商的-eks-中部署)
- [在不带 OIDC 提供商的 EKS 中部署](#在-不带-oidc-提供商的-eks-中部署)

#### 在 EC2 中运行的 Docker Compose

如果你使用 Docker Compose 在 AWS EC2 实例中部署了 Label Studio Enterprise，请执行以下操作以完成自定义一致性指标功能的权限设置：
1. 按照 AWS 文档步骤[在你的 AWS 账户中创建 IAM 用户](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) 创建具有编程访问权限的 IAM 用户。此类用户被授予访问 AWS 服务的访问密钥。
2. 在创建 IAM 用户时，对于 **设置权限** 选项，选择 **直接附加现有策略**。
3. 选择 **创建策略** 并附加 [`LSE_AllowInteractLambda` 策略](#创建-iam-策略以授予-aws-lambda-权限)。
4. 完成用户创建后，将用户名和访问密钥保存在安全的地方。
5. 在你用于部署 Label Studio Enterprise 的 `docker-compose.yaml` 文件中，在 `app` 和 `rqworkers` 部分添加以下环境变量：

!!! attention "重要" 
    更新：
    - 将 `YOUR_AWS_ACCESS_KEY_ID`、`YOUR_AWS_SECRET_ACCESS_KEY` 和 `YOUR_AWS_ACCOUNT` 替换为步骤 1 中创建的账户的凭据。 
    - 将 `YOUR_AWS_REGION` 替换为你的 EC2 实例所在的 AWS 区域。
```
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
LS_LAMBDA_REGION_CUSTOM_METRICS=YOUR_AWS_REGION
LS_LAMBDA_ROLE_CUSTOM_METRICS=arn:aws:iam::YOUR_AWS_ACCOUNT:role/LSE_CustomMetricsExecuteRole
```

在环境中设置这些权限后，你就可以编写自定义一致性指标并将其添加到 Label Studio Enterprise：
1. [编写你的自定义一致性指标](#如何编写你的自定义一致性指标)。
2. [将你的自定义一致性指标添加到 Label Studio Enterprise](#将你的自定义一致性指标添加到-label-studio)。

#### 在带有 OIDC 提供商的 EKS 中部署

如果你在 Amazon Elastic Kubernetes Service（EKS）中使用 OpenID Connect（OIDC）进行身份和访问管理（IAM）部署了 Label Studio Enterprise，请执行以下操作以完成自定义一致性指标功能的权限设置：
1. 按照 AWS Identity and Access Management 文档中的[为 AWS 服务创建角色（控制台）](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html#roles-creatingrole-service-console)中的步骤，创建一个名为 `LSE_ServiceAccountApp` 的 AWS IAM 角色。
2. 在相关情况下，将 [`LSE_AllowInteractLambda` 策略](#创建-iam-策略以授予-aws-lambda-权限) 附加到 `LSE_ServiceAccountApp` 角色。 
3. 更新你的 helm `values.yaml` 文件以包含以下映射。将 `YOUR_AWS_ACCOUNT` 替换为你的 AWS 账户 ID：
```yaml
app:
  serviceAccount:
    annotations: 
      eks.amazonaws.com/role-arn: arn:aws:iam::YOUR_AWS_ACCOUNT:role/LSE_ServiceAccountApp
```
4. [重启你的 Helm 版本](install_enterprise_k8s.html#Restart-Label-Studio-Enterprise-using-Helm)。
   
在环境中设置这些权限后，你就可以编写自定义一致性指标并将其添加到 Label Studio Enterprise：
1. [编写你的自定义一致性指标](#如何编写你的自定义一致性指标)。
2. [将你的自定义一致性指标添加到 Label Studio Enterprise](#将你的自定义一致性指标添加到-label-studio)。

#### 在不带 OIDC 提供商的 EKS 中部署

如果你在 Amazon Elastic Kubernetes Service（EKS）中部署了 Label Studio Enterprise 并且未使用 OpenID Connect（OIDC）进行身份和访问管理（IAM），请执行以下操作以完成自定义一致性指标功能的权限设置：
1. 在 AWS 控制台 UI 中，转到 **EKS > 集群 > YOUR_CLUSTER_NAME > 节点组**。
2. 选择部署了 Label Studio Enterprise 的 **YOUR_NODE_GROUP** 名称。
3. 在 **详细信息** 页面上，找到并选择 **节点 IAM 角色 ARN** 选项。
4. 创建 AWS IAM 策略 [`LSE_AllowInteractLambda`](#创建-iam-策略以授予-aws-lambda-权限)。
5. [重启你的 Helm 版本](install_enterprise_k8s.html#Restart-Label-Studio-Enterprise-using-Helm)。
   
在环境中设置这些权限后，你就可以编写自定义一致性指标并将其添加到 Label Studio Enterprise：
1. [编写你的自定义一致性指标](#如何编写你的自定义一致性指标)。
2. [将你的自定义一致性指标添加到 Label Studio Enterprise](#将你的自定义一致性指标添加到-label-studio)。

## Google Cloud Functions（本地部署）

如果你在 Google Cloud Platform（GCP）上部署 Label Studio Enterprise，你可以在 [Google Cloud Functions（第 2 代）](https://cloud.google.com/functions/docs/concepts/version-comparison) 上运行自定义一致性指标，而不是 AWS Lambda。

在开始之前，请确保你拥有 GCP 项目 ID，并知道 Label Studio Enterprise 是如何部署的（Compute Engine VM、带有 Workload Identity 的 GKE，或不带 Workload Identity 的 GKE）。

### 步骤 1：启用所需的 GCP API

Label Studio Enterprise 需要在你的 GCP 项目中启用以下 API：

- [Cloud Functions API](https://console.cloud.google.com/apis/library/cloudfunctions.googleapis.com) (`cloudfunctions.googleapis.com`)
- [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com) (`cloudbuild.googleapis.com`)
- [Cloud Storage API](https://console.cloud.google.com/apis/library/storage.googleapis.com) (`storage.googleapis.com`)
- [Cloud Logging API](https://console.cloud.google.com/apis/library/logging.googleapis.com) (`logging.googleapis.com`)
- [Artifact Registry API](https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com) (`artifactregistry.googleapis.com`)
- [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com) (`run.googleapis.com`)

你可以使用 `gcloud` CLI 启用它们：
```bash
gcloud services enable \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  logging.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  --project=YOUR_GCP_PROJECT
```

### 步骤 2：为 Cloud Functions 创建运行时服务账户

创建一个专用的服务账户供你的 Cloud Functions 运行。它只需要 **日志编写者** 角色。

1. 创建服务账户：
```bash
gcloud iam service-accounts create lse-custom-metrics-runtime \
  --display-name="LSE Custom Metrics Runtime" \
  --project=YOUR_GCP_PROJECT
```

2. 授予日志编写者角色：
```bash
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT \
  --member="serviceAccount:lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"
```

你稍后需要此服务账户电子邮件（`lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com`）用于 `GCP_SERVICE_ACCOUNT_CUSTOM_METRICS` 环境变量。

### 步骤 3：向 Label Studio Enterprise 身份授予权限

Label Studio Enterprise 运行的身份需要管理 Cloud Functions 并上传函数源代码。此身份因部署而异——你的 Compute Engine VM 服务账户、通过 Workload Identity 绑定的专用 GCP 服务账户，或你的 GKE 节点池服务账户。下面特定于部署的部分会告诉你应该将此角色绑定到哪个身份。

创建一个名为 `LSE_CustomMetricsDeployer` 的自定义 IAM 角色，具有以下权限：

```yaml
title: LSE Custom Metrics Deployer
description: Allows Label Studio Enterprise to deploy and invoke custom metric Cloud Functions
stage: GA
includedPermissions:
  # Cloud Functions lifecycle
  - cloudfunctions.functions.create
  - cloudfunctions.functions.update
  - cloudfunctions.functions.delete
  - cloudfunctions.functions.get
  - cloudfunctions.functions.list
  # Source upload via generateUploadUrl
  - cloudfunctions.functions.generateUploadUrl
  # Source code download from GCS staging bucket
  - storage.objects.get
  - storage.objects.create
  # Cloud Functions invocation (2nd gen uses Cloud Run)
  - run.routes.invoke
  # View function execution logs
  - logging.logEntries.list
  - logging.logs.list
  # Act as the runtime service account
  - iam.serviceAccounts.actAs
```

你可以使用 `gcloud` CLI 创建此角色：
```bash
gcloud iam roles create LSE_CustomMetricsDeployer \
  --project=YOUR_GCP_PROJECT \
  --title="LSE Custom Metrics Deployer" \
  --description="Allows Label Studio Enterprise to deploy and invoke custom metric Cloud Functions" \
  --permissions=cloudfunctions.functions.create,cloudfunctions.functions.update,cloudfunctions.functions.delete,cloudfunctions.functions.get,cloudfunctions.functions.list,cloudfunctions.functions.generateUploadUrl,storage.objects.get,storage.objects.create,run.routes.invoke,logging.logEntries.list,logging.logs.list,iam.serviceAccounts.actAs
```

然后将其绑定到 Label Studio Enterprise 身份。将 `LSE_IDENTITY` 替换为相应的成员（请参阅下面特定于部署的部分）：
```bash
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT \
  --member="LSE_IDENTITY" \
  --role="projects/YOUR_GCP_PROJECT/roles/LSE_CustomMetricsDeployer"
```

!!! note
    除了单个自定义角色外，你还可以分配以下预定义角色：`roles/cloudfunctions.developer`、`roles/run.invoker`、`roles/storage.objectAdmin`、`roles/logging.viewer` 和 `roles/iam.serviceAccountUser`。上面的自定义角色遵循最小权限原则。

#### 在 Compute Engine VM 上使用 Docker Compose 部署

如果你在 Compute Engine VM 上使用 Docker Compose 部署了 Label Studio Enterprise：

1. 确保 VM 作为具有 `LSE_CustomMetricsDeployer` 自定义角色（或等效的预定义角色）在项目级别绑定的服务账户运行。如果你需要创建一个，请运行：
```bash
gcloud iam service-accounts create lse-app \
  --display-name="LSE Application" \
  --project=YOUR_GCP_PROJECT

gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT \
  --member="serviceAccount:lse-app@YOUR_GCP_PROJECT.iam.gserviceaccount.com" \
  --role="projects/YOUR_GCP_PROJECT/roles/LSE_CustomMetricsDeployer"
```

2. 将该服务账户分配给你的 Compute Engine 实例。

3. 在你用于部署 Label Studio Enterprise 的 `docker-compose.yaml` 文件中，将以下环境变量添加到 `app` 和 `rqworkers` 部分：

!!! attention "重要"
    将 `YOUR_GCP_PROJECT` 替换为你的 GCP 项目 ID，将 `YOUR_GCP_REGION` 替换为你的首选区域（例如 `us-central1`）。

```
CUSTOM_METRIC_PROVIDER=gcp
GCP_PROJECT_CUSTOM_METRICS=YOUR_GCP_PROJECT
GCP_REGION_CUSTOM_METRICS=YOUR_GCP_REGION
GCP_SERVICE_ACCOUNT_CUSTOM_METRICS=lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com
```

!!! note
    在具有适当范围的服务账户的 Compute Engine 上，Label Studio 自动使用 [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials)——无需密钥文件。

#### 在带有 Workload Identity 的 GKE 中部署

如果你使用的是带有 [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity) 的 GKE：

1. 为 Label Studio Enterprise 创建 GCP 服务账户（如果你还没有）：
```bash
gcloud iam service-accounts create lse-app \
  --display-name="LSE Application" \
  --project=YOUR_GCP_PROJECT
```

2. 将 `LSE_CustomMetricsDeployer` 自定义角色绑定到服务账户：
```bash
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT \
  --member="serviceAccount:lse-app@YOUR_GCP_PROJECT.iam.gserviceaccount.com" \
  --role="projects/YOUR_GCP_PROJECT/roles/LSE_CustomMetricsDeployer"
```

3. 允许 Kubernetes 服务账户模拟 GCP 服务账户：
```bash
gcloud iam service-accounts add-iam-policy-binding \
  lse-app@YOUR_GCP_PROJECT.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:YOUR_GCP_PROJECT.svc.id.goog[YOUR_NAMESPACE/YOUR_K8S_SERVICE_ACCOUNT]"
```

4. 更新你的 Helm `values.yaml` 以注解 Kubernetes 服务账户并设置所需的环境变量：
```yaml
app:
  serviceAccount:
    annotations:
      iam.gke.io/gcp-service-account: lse-app@YOUR_GCP_PROJECT.iam.gserviceaccount.com
  extraEnvironmentVars:
    CUSTOM_METRIC_PROVIDER: gcp
    GCP_PROJECT_CUSTOM_METRICS: YOUR_GCP_PROJECT
    GCP_REGION_CUSTOM_METRICS: YOUR_GCP_REGION
    GCP_SERVICE_ACCOUNT_CUSTOM_METRICS: lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com

rqworker:
  extraEnvironmentVars:
    CUSTOM_METRIC_PROVIDER: gcp
    GCP_PROJECT_CUSTOM_METRICS: YOUR_GCP_PROJECT
    GCP_REGION_CUSTOM_METRICS: YOUR_GCP_REGION
    GCP_SERVICE_ACCOUNT_CUSTOM_METRICS: lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com
```

5. 重启你的 Helm 版本。

#### 在不带 Workload Identity 的 GKE 中部署

如果你使用的是不带 Workload Identity 的 GKE，你的 Pod 会作为 GKE 节点的服务账户进行身份验证，因此这才是你授予权限的身份。

1. 在你的 GCP 控制台中，转到 **Kubernetes Engine > 集群 > YOUR_CLUSTER > 节点池 > YOUR_NODE_POOL > 安全**，并记下服务账户。

2. 将 `LSE_CustomMetricsDeployer` 自定义角色绑定到节点池的服务账户：
```bash
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT \
  --member="serviceAccount:YOUR_NODE_SERVICE_ACCOUNT@YOUR_GCP_PROJECT.iam.gserviceaccount.com" \
  --role="projects/YOUR_GCP_PROJECT/roles/LSE_CustomMetricsDeployer"
```

3. 更新你的 Helm `values.yaml` 以设置所需的环境变量：
```yaml
app:
  extraEnvironmentVars:
    CUSTOM_METRIC_PROVIDER: gcp
    GCP_PROJECT_CUSTOM_METRICS: YOUR_GCP_PROJECT
    GCP_REGION_CUSTOM_METRICS: YOUR_GCP_REGION
    GCP_SERVICE_ACCOUNT_CUSTOM_METRICS: lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com

rqworker:
  extraEnvironmentVars:
    CUSTOM_METRIC_PROVIDER: gcp
    GCP_PROJECT_CUSTOM_METRICS: YOUR_GCP_PROJECT
    GCP_REGION_CUSTOM_METRICS: YOUR_GCP_REGION
    GCP_SERVICE_ACCOUNT_CUSTOM_METRICS: lse-custom-metrics-runtime@YOUR_GCP_PROJECT.iam.gserviceaccount.com
```

4. 重启你的 Helm 版本。


### GCP 的环境变量参考

| 变量 | 描述 | 默认 |
| --- | --- | --- |
| `CUSTOM_METRIC_PROVIDER` | 设置为 `gcp` 以使用 Google Cloud Functions 而不是 AWS Lambda。 | `aws` |
| `GCP_PROJECT_CUSTOM_METRICS` | 部署 Cloud Functions 的 GCP 项目 ID。 | （无，必填） |
| `GCP_REGION_CUSTOM_METRICS` | Cloud Functions 的 GCP 区域（例如 `us-central1`、`europe-west1`）。 | `us-central1` |
| `GCP_SERVICE_ACCOUNT_CUSTOM_METRICS` | 部署的 Cloud Functions 作为运行时服务账户运行的电子邮件。 | （无，可选） |

### Cloud Function 运行时配置

Label Studio Enterprise 使用固定的运行时配置部署每个自定义指标 Cloud Function。这些值无法从 UI 或环境变量进行用户配置，并适用于每个已部署的函数：

| 设置 | 值 |
| --- | --- |
| **运行时** | Python 3.13 (`python313`) |
| **入口点** | `agreement_handler` |
| **内存** | 256 MB |
| **请求超时** | 60 秒 |
| **最大实例数** | 1 |
| **入口** | 仅限内部 (`ALLOW_INTERNAL_ONLY`) |

这对你的指标代码意味着：

- 使用 Python 3.13 兼容的代码和导入。
- 保持 `agreement` 函数轻量且无状态。加载大型模型或运行昂贵的计可能会超过 256 MB/60 秒的限制并导致评分失败。
- 评分请求按函数在每个函数上排队一次一个。这对后台工作线程来说没问题，但意味着指标不适合交互式使用。

##### 网络连接

自定义指标函数部署为仅限内部入口，这会影响你如何访问它们：

- **与 Label Studio Enterprise 相同的 GCP 项目：** 开箱即用。你的 Compute Engine 或 GKE 工作负载的内部流量默认被允许。
- **不同的 VPC 或项目：** 你需要首先设置内部连接——Shared VPC、VPC 对等连接或 Serverless VPC Access 连接器——否则评分将失败。
- **直接测试函数：** 你无法从 Google 网络外部调用它。从你的笔记本电脑或 Cloud Console **测试** 按钮发出的 `curl` 将返回 `403 Forbidden`。要验证部署，请在 Label Studio Enterprise 内部触发评分（例如，对使用指标的项目重新计算一致性）。

#### Label Studio 如何管理你的函数

Label Studio 为每个使用自定义指标的项目创建一个 Cloud Function，在评分运行之间重用它，并为你解析函数 URL——无需手动配置 URL 或函数名称。

要在 Google Cloud 控制台中查找函数：

1. 在你配置的 GCP 项目和区域中打开 **Cloud Functions**。
2. 查找名为 `custom-metric-<project_id>-<timestamp>` 的函数。
3. 打开函数以查看日志、部署状态和触发器 URL。

##### 函数生命周期行为

| 行为 | 描述 |
| --- | --- |
| **部署** | 如果找不到匹配的现有函数，则创建新函数。 |
| **更新** | 尽可能更新现有函数。 |
| **提供商/指标更改** | 如果你切换到此指标/提供商之外，Label Studio 会尝试删除先前管理的 GCP 函数。 |
| **应用中的运行时状态** | 应用报告 NotDeployed、Pending、Active、Failed、NotFound、Error 等状态。 |
| **可发现性和元数据** | Label Studio 对函数应用内部标签（元数据）以进行项目/组织/主机跟踪。这些标签主要用于内部管理和云侧过滤。函数 HTTPS URL 由 Label Studio 自动解析和缓存。 |

!!! attention "重要"
    前缀和标签/标记当前未作为 GCP 的 UI 中面向用户的字段公开。 
    
    高级用户只能通过 API 级别的指标参数（如果你的组织公开该工作流）设置此类值，而不是通过标准设置屏幕。
