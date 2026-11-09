---
title: 在 Kubernetes 上部署 Label Studio Enterprise
short: 使用 Kubernetes 安装
tier: enterprise
type: guide
order: 0
order_enterprise: 69
meta_title: 在 Kubernetes 上部署 Label Studio Enterprise
meta_description: 在 Kubernetes 上部署 Label Studio Enterprise，例如在 Amazon Elastic Container Service for Kubernetes 上，以在可扩展的容器化环境中创建机器学习和数据科学项目。 
section: "安装与设置"
parent_enterprise: "install_enterprise"
---

使用 Helm 3 在 Kubernetes 集群上部署 Label Studio Enterprise。你可以使用此 Helm chart 设置 Label Studio Enterprise 以部署到 Kubernetes 集群，并安装、升级和管理应用程序。 

你的 Kubernetes 集群可以是自托管的，也可以安装在 Amazon EKS 等位置。请参阅 Amazon 教程，了解有关在 Amazon EKS 上部署应用的更多信息：[使用 Amazon Elastic Container Service for Kubernetes 部署 Kubernetes 应用](https://aws.amazon.com/getting-started/hands-on/deploy-kubernetes-app-amazon-eks/)。

<div class="enterprise-only">

!!! warning
    要安装 Label Studio 社区版，请参阅 <a href="https://labelstud.io/guide/install_k8s.html">在 Kubernetes 上部署 Label Studio</a>。本页专门针对 Label Studio 的企业版。

</div>

!!! note
    Label Studio Enterprise 的本地部署不支持学术许可证。 

下面这张高层架构图概述了 Label Studio Enterprise 部署的主要组件。

<img src="/images/LSE_k8s_scheme.png"/>

!!! warning
    Label Studio Enterprise 2.2.9 已弃用 MinIO 作为服务。

Label Studio Enterprise 运行在 Python 上，并使用 rqworkers 执行额外任务。元数据和标注存储在作为持久化存储的捆绑版 PostgreSQL 中。如果你在云中托管 Label Studio Enterprise，请使用[云中的持久化存储](persistent_storage.html) 而不是 MinIO。

## 在 Kubernetes 上安装 Label Studio Enterprise

如果你想在 Kubernetes 上安装 Label Studio Enterprise，并且你的 K8s 集群可以不受限制地访问互联网，请按照以下步骤操作。 

1. 验证你满足[所需的软件先决条件](#所需的软件先决条件)并查看[容量规划](#容量规划) 指南。
2. [准备 Kubernetes 集群](#准备-kubernetes-集群)。
3. [添加 Helm chart 仓库](#添加-helm-chart-仓库)。
4. [配置 Kubernetes 密钥](#配置-kubernetes-密钥)
5. [配置持久化存储](persistent_storage.html)。 
6. [配置 ingress](ingress_config.html)。
7. [配置 values.yaml 文件](#配置-values-yaml)。
8. （可选）[为 PostgreSQL 设置 TLS](#可选为-postgresql-设置-tls)
9. （可选）[为 Redis 设置 TLS](#可选为-redis-设置-tls)
10. [使用 Helm 在你的 Kubernetes 集群上安装 Label Studio Enterprise](#使用-helm-在你的-kubernetes-集群上安装-label-studio-enterprise)。

如果你使用代理从 Kubernetes 集群访问互联网，或者它与互联网气隙隔离，请参阅如何[在没有公网访问的情况下安装 Label Studio Enterprise](install_k8s_airgapped.html)。

### 所需的软件先决条件

- **Kubernetes** —— 版本 1.17 或更高
- **Helm** —— 版本 3.6.3 或更高
- **Redis** —— 版本 6.0.5 或更高
- **PostgreSQL** —— 版本 14.0 或更高
- **持久化存储** —— 具有 ReadWriteMany 访问模式的 PVC 或兼容 S3 的对象存储

Redis 和 PostgreSQL 是 Label Studio Enterprise 的必需组件，需要它们才能完全正常运行。此 chart 不包含或安装 Redis 或 PostgreSQL；你必须预先配置它们（例如，根据你公司的标准）并在你的 Helm values 中提供连接详细信息。

**持久化存储** 必须使用以下之一：具有 **ReadWriteMany** 访问模式的持久卷声明（PVC），或兼容 S3 的对象存储。有关配置详细信息，请参阅[设置持久化存储](persistent_storage.html)。

此 chart 已测试并确认可与 [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) 和 [cert-manager](https://cert-manager.io/docs/) 一起使用。有关 Label Studio 的 ingress 设置的更多信息，请参阅[为 Label Studio Kubernetes 部署设置入口控制器](ingress_config.html)。 

你的 Kubernetes 集群可以是自托管的，也可以安装在 Amazon EKS 等位置。 

### 容量规划

要规划 Kubernetes 集群的容量，请参考这些指南。 

Label Studio Enterprise 对资源请求、资源限制和副本计数具有以下默认配置：

<div class="enterprise-only">

```yaml
app:
  replicas: 1
  resources:
    requests:
      memory: 1024Mi
      cpu: 1000m
    limits:
      memory: 6144Mi
      cpu: 4000m

rqworker:
  queues:
    high:
      replicas: 1
    low:
      replicas: 1
    default:
      replicas: 4
    critical:
      replicas: 1
  resources:
    requests:
      memory: 256Mi
      cpu: 100m
    limits:
      memory: 1024Mi
      cpu: 1000m
```

</div>

在你对这些值进行更改之前，请熟悉 Kubernetes 文档中的 [Pod 和容器的资源管理](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) 指南。 

如果你选择更改这些默认设置，请考虑以下情况：

| 针对这种情况                               | 调整此项                                                                                                                           |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| 超过 10 个并发标注者          | 调整 `app` pod 中 `resources` 的请求和限制                                                                       |
| 提高容错能力                    | 增加 `app` 和/或 `rqworker` 服务的副本数                                                                   |
| 生产部署（副本）            | 副本数等于或大于 Kubernetes 集群中可用区的数量                                       | 

#### RQ worker 副本

`default` 队列是最大的队列。建议为 `default` 队列使用比其他队列多 4 倍的副本。其他队列（`critical`、`high`、`low`）可以具有相同数量的副本。你可以从每个 1 个副本开始。 

### 准备 Kubernetes 集群

在安装 Label Studio 之前，使用 [kubectl](https://kubernetes.io/docs/reference/kubectl/) 准备 Kubernetes 集群。 

使用 Helm chart 安装 Label Studio Enterprise 并设置 PostgreSQL 和 Redis 数据库，以存储相关的 Label Studio Enterprise 配置和标注。你必须在安装时使用 Helm 指定的 YAML 文件中为你的部署配置特定值。

### 添加 Helm chart 仓库

添加 Helm chart 仓库以轻松安装和更新 Label Studio。

1. 从命令行：
   ```shell
   helm repo add heartex https://charts.heartex.com/
   helm repo update heartex
   ```
2. 如果需要，检查可用版本：
   ```shell
   helm search repo heartex/label-studio
   ```

<div class="enterprise-only">

### 配置 Kubernetes 密钥

1. 确保你拥有许可证密钥和 Docker Hub 凭据，或者向 Heartex 团队申请。
2. 创建一个密钥，以从 Docker 仓库拉取最新的 Label Studio Enterprise 镜像。从集群的命令行运行以下命令：
    ```shell
    kubectl create secret docker-registry heartex-pull-key \
        --docker-server=https://index.docker.io/v2/ \
        --docker-username=heartexlabs \
        --docker-password=<CUSTOMER_PASSWORD>
    ```
3. 将 Label Studio Enterprise 许可证创建为 Kubernetes 密钥。你可以将其指定为文件或特定的 URL。
   从命令行将许可证指定为文件：
   ```shell
   kubectl create secret generic lse-license --from-file=license=path/to/lic
   ```
   或者从命令行将许可证指定为 URL：
   ```shell
   kubectl create secret generic lse-license --from-literal=license=https://lic.heartex.ai/db/<CUSTOMER_LICENSE_ID>
   ```
   
</div>

<div class="enterprise-only">

### 配置 values.yaml 

你必须为你部署的 Label Studio Enterprise 配置一个 `values.yaml` 文件。以下文件包含 Label Studio 最小安装的默认值。此 chart 已测试并确认可与 [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) 和 [cert-manager](https://cert-manager.io/docs/) 一起使用。

Label Studio Enterprise 最小安装的示例 `values.yaml` 文件：
```yaml
global:
  image:
    repository: heartexlabs/label-studio-enterprise
    tag: REPLACE_ME
  
  imagePullSecrets:
    # 使用前面的 kubectl 命令定义
    - name: heartex-pull-key

  pgConfig:
    # PostgreSql 实例主机名
    host: "postgresql"
    # PostgreSql 数据库名称
    dbName: "my-database"
    # PostgreSql 用户名
    userName: "postgres"
    # PostgreSql 密码在 Kubernetes 密钥中的坐标 
    password:
      secretName: "postgresql"
      secretKey: "postgresql-password"

  redisConfig:
    # Redis 连接字符串
    host: redis://host:port/db

  # extraEnvironmentVars 是要设置在部署中的额外环境变量列表，默认空
  extraEnvironmentVars: {}
  # extraEnvironmentSecrets 是要设置在部署中的额外环境密钥列表，默认空
  extraEnvironmentSecrets: {}

enterprise:
   enabled: true
   # 此值指的是你创建的包含企业许可证的 Kubernetes 密钥
   enterpriseLicense:
      secretName: "lse-license"
      secretKey: "license"

app:
  # 高可用性 (HA) 模式：根据你的资源进行调整
  replicas: 1
  # Label Studio 的 Ingress 配置
  ingress:
    enabled: true
    host: studio.yourdomain.com
    # 你可能需要将 path 设置为 '/*' 以便与 ALB ingress 控制器一起使用。
    path: /
    # 你的 ingress 控制器所需的注解，默认空 
    annotations: {}
# 如果你有 cert-manager，取消注释下一部分
#    tls:
#      - secretName: ssl-cert-studio.yourdomain.com
#        hosts:
#          - studio.yourdomain.com

# 默认计算资源运行基本的 Label Studio Enterprise 安装。根据你的业务需求进行调整
  resources:
    requests:
      memory: 1024Mi
      cpu: 1000m
    limits:
      memory: 6144Mi
      cpu: 4000m

rqworker:
   # HA 模式：根据你的业务需求/资源进行调整
   queues:
      high:
         replicas: 2
      low:
         replicas: 2
      default:
         replicas: 2
      critical:
         replicas: 2

postgresql:
  enabled: false

redis:
  enabled: false
```

根据你环境调整所包含的默认值，并将其复制到新文件中并保存为 `ls-values.yaml`。


!!! note 
    对于更复杂的配置，你可以根据[所有可用 Helm 值的列表](helm_values.html) 创建自己的文件。

</div>

## 可选：为 PostgreSQL 设置 TLS

要配置 Label Studio Enterprise 以对与 PostgreSQL 的端客户端连接使用 TLS，请执行以下操作：

1. 为你的 PostgreSQL 实例启用 TLS，并保存根 TLS 证书、客户端证书及其密钥以用于后续步骤。
2. 使用你的证书创建 Kubernetes 密钥，将 `<PATH_TO_CA>`、`<PATH_TO_CLIENT_CRT>` 和 `<PATH_TO_CLIENT_KEY>` 替换为你的证书路径：

```shell
kubectl create secret generic <YOUR_SECRET_NAME> --from-file=ca.crt=<PATH_TO_CA> --from-file=client.crt=<PATH_TO_CLIENT_CRT> --from-file=client.key=<PATH_TO_CLIENT_KEY>
```
3. 使用你新创建的 Kubernetes 密钥更新你的 `ls-values.yaml` 文件：

!!! note 
    如果 `POSTGRE_SSL_MODE: verify-ca`，则通过检查证书链直到客户端存储的根证书来验证服务器。如果 `POSTGRE_SSL_MODE: verify-full`，则将验证服务器主机名，以确保它与服务器证书中存储的名称匹配。如果无法验证服务器证书，SSL 连接将失败。在大多数安全敏感的环境中，建议使用 `verify-full`。

```yaml
global:
  pgConfig:
    ssl:
      pgSslMode: "verify-full"
      pgSslSecretName: "<YOUR_SECRET_NAME>"
      pgSslRootCertSecretKey: "ca.crt"
      pgSslCertSecretKey: "client.crt"
      pgSslKeySecretKey: "client.key"
```

4. 使用 Helm 安装或升级 Label Studio Enterprise。

## 可选：为 Redis 设置 TLS

要配置 Label Studio Enterprise 以对与 Redis 的端客户端连接使用 TLS，请执行以下操作：

1. 为你的 Redis 实例启用 TLS，并保存根 TLS 证书、客户端证书及其密钥以用于后续步骤。
2. 使用你的证书创建 Kubernetes 密钥，将 `<PATH_TO_CA>`、`<PATH_TO_CLIENT_CRT>` 和 `<PATH_TO_CLIENT_KEY>` 替换为你的证书路径：

```shell
kubectl create secret generic <YOUR_SECRET_NAME> --from-file=ca.crt=<PATH_TO_CA> --from-file=client.crt=<PATH_TO_CLIENT_CRT> --from-file=client.key=<PATH_TO_CLIENT_KEY>
```
3. 使用你新创建的 Kubernetes 密钥更新你的 `ls-values.yaml` 文件：

!!! note 
    如果你使用的是主机无法验证的自签名证书，你必须将 `redisSslCertReqs` 设置为 `None`

```yaml
global:
  redisConfig:
    ssl:
      redisSslCertReqs: "required"
      redisSslSecretName: "<YOUR_SECRET_NAME>"
      redisSslCaCertsSecretKey: "ca.crt"
      redisSslCertFileSecretKey: "client.crt"
      redisSslKeyFileSecretKey: "client.key"
```

4. 使用 Helm 安装或升级 Label Studio Enterprise。


## 可选：为 Redis 设置用户名和密码

使用以下选项之一为 Redis 设置密码和用户名：

**1. 通过 Kubernetes 密钥设置密码**。当你处于以下情况时，请使用此选项：
* 你想避免在 `values.yaml` 中嵌入凭据
* 你已经在集群中管理 Secrets
* 你需要不带多个 Redis 用户且没有用户名的简单身份验证

```yaml
global:
  redisConfig:
    host: "redis://redis.example.com:6379/1"
    password:
      secretName: "my-redis-secret"   # Kubernetes 密钥名称
      secretKey: "redis-password"      # 密钥内的键
```

**2. URL 中的用户名 + 密码**。当你处于以下情况时，请使用此选项：
* Redis v.7 或更高版本，并且启用了 ACL 的用户
* 你需要一个专用的 Redis 用户以进行权限范围划分
* 你需要快速、一次性的设置或本地测试

```yaml
global:
  redisConfig:
    host: "redis://myuser:mypassword@redis.example.com:6379/1"
```

 **3. 环境变量中的用户名 + 密钥中的密码**。当你处于以下情况时，请使用此选项：
* Redis v.7 或更高版本，并且启用了 ACL 的用户
* 你想对密码保密，但仍指定用户名

```yaml
global:
  redisConfig:
    host: "redis://redis.example.com:6379/1"
    password:
      secretName: "my-redis-secret"   # Kubernetes 密钥名称
      secretKey: "redis-password"      # 密钥内的键
  extraEnvironmentVars:
    REDIS_USERNAME: "myuser"           # 注入到 pod 环境中
```

## 使用 Helm 在你的 Kubernetes 集群上安装 Label Studio Enterprise

使用 Helm 在你的 Kubernetes 集群上安装 Label Studio Enterprise。提供你的自定义资源定义 YAML 文件。使用 `helm install` 命令的 `--set` 参数指定你需要为 Label Studio Enterprise 安装设置的任何环境变量。

!!! note
    如果你正在部署到生产环境，你应该设置 `SSRF_PROTECTION_ENABLED: true` 环境变量。请参阅 [保护 Label Studio](security#Enable-SSRF-protection-for-production-environments)。

从命令行运行以下命令：
```shell
helm install <RELEASE_NAME> heartex/label-studio -f ls-values.yaml
```

安装后，检查 Kubernetes pod 创建的状态：
```shell
kubectl get pods
```

## 使用 Helm 重启 Label Studio Enterprise

通过从命令行执行以下操作来重启你的 Helm release：

1. 识别最新 Label Studio Enterprise release 的 &lt;RELEASE_NAME&gt;：
```shell
helm list
```
2. 重启 Label Studio 的 rqworker：
```shell
kubectl rollout restart deployment/<RELEASE_NAME>-ls-rqworker
```
3. 重启 Label Studio Enterprise 应用：
```shell
kubectl rollout restart deployment/<RELEASE_NAME>-ls-app
```


## 使用 Helm 卸载 Label Studio Enterprise

要使用 Helm 卸载 Label Studio Enterprise，请删除配置。

从命令行运行以下命令：
```shell
helm delete <RELEASE_NAME>
```
