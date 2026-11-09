---
title: Available Helm values for Label Studio Helm Chart
short: Available Helm values
tier: all
type: guide
order: 72
order_enterprise: 74
meta_title: Available Helm values for Label Studio Helm Chart
meta_description: For cases when you want to customize your Label Studio Kubernetes deployment, review these available Helm values that you can set in your Helm chart.
section: "Install & Setup"
parent: "install_k8s"
parent_enterprise: "install_enterprise_k8s"
---

<!-- Fix for long values in table cells -->
<style>
  td:first-child {
    max-width: 350px;
  }
  td:first-child code {
    white-space: normal;
    word-break: break-word;
    margin-left: 0;
    padding-left: 3px;
  }
  td:nth-child(3) {
    white-space: normal;
    word-break: break-word;
    max-width: 130px;
  }
  td:last-child {
    max-width: 150px;
  }
  td:last-child code {
    white-space: normal;
    word-break: break-all;
  }
</style>

<div class="opensource-only">

在 Kubernetes 上配置你的 Label Studio 部署时，可参考这些表格中可供 `values.yaml` 文件使用的 Helm chart 值。更多内容请参阅 [在 Kubernetes 上部署 Label Studio](install_k8s)。

</div>

<div class="enterprise-only">

在 Kubernetes 上配置你的 Label Studio 部署时，可参考这些表格中可供 `values.yaml` 文件使用的 Helm chart 值。更多内容请参阅 [在 Kubernetes 上部署 Label Studio](install_enterprise_k8s)。

</div>

## 全局参数

Helm chart 的全局参数。

| 参数                                                                        | 描述                                                                                                  | 默认值                     |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| `global.imagePullSecrets`                                                   | 以数组形式指定的全局 Docker 仓库密钥名称                                                                 | `[]`                       |
| `global.image.repository`                                                   | 镜像仓库（repository）                                                                                                                  | `heartexlabs/label-studio` |
| `global.image.pullPolicy`                                                   | 镜像拉取策略（pull policy）                                                                                                             | `IfNotPresent`             |
| `global.image.tag`                                                          | 镜像标签（建议使用不可变标签）                                                                                                          | `develop`                  |
| `global.pgConfig.host`                                                      | PostgreSQL 主机名                                                                                                                      | `""`                       |
| `global.pgConfig.port`                                                      | PostgreSQL 端口                                                                                                                        | `5432`                     |
| `global.pgConfig.dbName`                                                    | PostgreSQL 数据库名                                                                                                                    | `""`                       |
| `global.pgConfig.userName`                                                  | PostgreSQL 数据库用户账号                                                                                                              | `""`                       |
| `global.pgConfig.password.secretName`                                       | 持有 PostgreSQL 数据库用户账号密码的现有 Secret 名称                                                                                    | `""`                       |
| `global.pgConfig.password.secretKey`                                        | 持有 PostgreSQL 数据库用户账号密码的现有 Secret 键                                                                                      | `""`                       |
| `global.pgConfig.ssl.pgSslMode`                                             | [PostgreSQL SSL 模式](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-SSLMODE) | `""`                       |
| `global.pgConfig.ssl.pgSslSecretName`                                       | 持有 PostgreSQL 主机 SSL 证书的现有 Secret 名称                                                                                         | `""`                       |
| `global.pgConfig.ssl.pgSslRootCertSecretKey`                                | 持有 PostgreSQL 主机 SSL 证书的现有 Secret 键                                                                                           | `""`                       |
| `global.pgConfig.ssl.pgSslCertSecretKey`                                    | 持有 PostgreSQL 主机 SSL 证书私钥的现有 Secret 键                                                                                       | `""`                       |
| `global.pgConfig.ssl.pgSslKeySecretKey`                                     | 持有 PostgreSQL 主机 SSL 证书私钥的现有 Secret 键                                                                                       | `""`                       |
| `global.redisConfig.host`                                                   | Redis 连接字符串，格式为：redis://[:password]@localhost:6379/1                                                                          | `""`                       |
| `global.redisConfig.password.secretName`                                    | 持有 Redis 数据库密码的现有 Secret 名称                                                                                                | `""`                       |
| `global.redisConfig.password.secretKey`                                     | 持有 Redis 数据库密码的现有 Secret 键                                                                                                  | `""`                       |
| `global.redisConfig.ssl.redisSslCertReqs`                                   | 是否校验服务器公钥或忽略它。接受（`""`、`"optional"`、`"required"`）。                                                                   | `""`                       |
| `global.redisConfig.ssl.redisSslSecretName`                                 | 持有 Redis 主机 SSL 证书的现有 Secret 名称                                                                                             | `""`                       |
| `global.redisConfig.ssl.redisSslCaCertsSecretKey`                           | 持有 Redis 主机 SSL 证书的现有 Secret 键                                                                                              | `""`                       |
| `global.redisConfig.ssl.redisSslCertFileSecretKey`                          | 持有 Redis 主机 SSL 证书私钥的现有 Secret 键                                                                                          | `""`                       |
| `global.redisConfig.ssl.redisSslKeyFileSecretKey`                           | 持有 Redis 主机 SSL 证书私钥的现有 Secret 键                                                                                          | `""`                       |
| `global.extraEnvironmentVars`	                                              | 额外环境变量的键值映射，例如 `PYTHONUNBUFFERED: 1`                                                                                     | `{}`                       |
| `global.extraEnvironmentSecrets`                                            | 额外 Secret 的键值映射                                                                                                                | `{}`                       |
| `global.persistence.enabled`                                                | 启用持久化存储。[关于配置持久化存储的更多内容](https://labelstud.io/guide/persistent_storage.html)                                      | `true`                     |
| `global.persistence.type`                                                   | 持久化存储类型                                                                                                                        | `volume`                   |
| `global.persistence.config.s3.accessKey`                                    | 访问 AWS S3 所用的访问密钥                                                                                                            | `""`                       |
| `global.persistence.config.s3.secretKey`                                    | 访问 AWS S3 所用的私有密钥                                                                                                            | `""`                       |
| `global.persistence.config.s3.accessKeyExistingSecret`                      | 用于提取 AWS S3 访问密钥的现有 Secret 名称                                                                                            | `""`                       |
| `global.persistence.config.s3.accessKeyExistingSecretKey`                   | 用于提取 AWS S3 访问密钥的现有 Secret 键                                                                                              | `""`                       |
| `global.persistence.config.s3.secretKeyExistingSecret`                      | 用于提取 AWS S3 私有密钥的现有 Secret 名称                                                                                            | `""`                       |
| `global.persistence.config.s3.secretKeyExistingSecretKey`                   | 用于提取 AWS S3 私有密钥的现有 Secret 键                                                                                              | `""`                       |
| `global.persistence.config.s3.region`                                       | AWS S3 区域                                                                                                                          | `""`                       |
| `global.persistence.config.s3.bucket`                                       | AWS S3 存储桶名称                                                                                                                    | `""`                       |
| `global.persistence.config.s3.folder`                                       | AWS S3 文件夹名称                                                                                                                    | `""`                       |
| `global.persistence.config.s3.urlExpirationSecs`                            | 预签名 URL 的有效秒数                                                                                                                | `86400`                    |
| `global.persistence.config.s3.endpointUrl`                                  | 连接 S3 时使用的自定义 S3 URL（包含协议方案）                                                                                        | `""`                       |
| `global.persistence.config.volume.storageClass`                             | 持久卷（Persistent Volume）的存储类                                                                                                   | `""`                       |
| `global.persistence.config.volume.size`                                     | 持久卷大小                                                                                                                            | `10Gi`                     |
| `global.persistence.config.volume.accessModes`                              | PVC 访问模式                                                                                                                         | `[ReadWriteOnce]`          |
| `global.persistence.config.volume.annotations`	                             | 持久卷的额外注解                                                                                                                      | `{}`                       |
| `global.persistence.config.volume.existingClaim`                            | 要使用的现有 PVC 名称                                                                                                                | `""`                       |
| `global.persistence.config.volume.resourcePolicy`                           | PVC 资源策略                                                                                                                         | `""`                       |
| `global.persistence.config.volume.annotations`                              | 持久卷的额外注解                                                                                                                      | `{}`                       |
| `global.persistence.config.azure.storageAccountName`                        | 访问 Azure Blob Storage 所用的 Azure 存储账号名称                                                                                     | `""`                       |
| `global.persistence.config.azure.storageAccountKey`                         | 访问 Azure Blob Storage 所用的 Azure 存储账号密钥                                                                                     | `""`                       |
| `global.persistence.config.azure.storageAccountNameExistingSecret`          | 用于提取 Azure 存储账号名称（以访问 Azure Blob Storage）的现有 Secret 名称                                                            | `""`                       |
| `global.persistence.config.azure.storageAccountNameExistingSecretKey`       | 用于提取 Azure 存储账号名称的现有 Secret 键                                                                                          | `""`                       |
| `global.persistence.config.azure.storageAccountKeyExistingSecret`           | 用于提取 Azure 存储账号密钥的现有 Secret 名称                                                                                        | `""`                       |
| `global.persistence.config.azure.storageAccountKeyExistingSecretKey`        | 用于提取 Azure 存储账号密钥的现有 Secret 键                                                                                          | `""`                       |
| `global.persistence.config.azure.containerName`                             | Azure 存储容器名称                                                                                                                    | `""`                       |
| `global.persistence.config.azure.folder`                                    | Azure 存储文件夹名称                                                                                                                  | `""`                       |
| `global.persistence.config.azure.urlExpirationSecs`                         | 预签名 URL 的有效秒数                                                                                                                | `86400`                    |
| `global.persistence.config.gcs.projectID`                                   | 要使用的 GCP 项目 ID                                                                                                                 | `""`                       |
| `global.persistence.config.gcs.applicationCredentialsJSON`                  | 访问 GCS 的服务账号密钥                                                                                                              | `""`                       |
| `global.persistence.config.gcs.applicationCredentialsJSONExistingSecret`    | 用于提取 GCS 服务账号密钥的现有 Secret 名称                                                                                          | `""`                       |
| `global.persistence.config.gcs.applicationCredentialsJSONExistingSecretKey` | 用于提取 GCS 服务账号密钥的现有 Secret 键                                                                                            | `""`                       |
| `global.persistence.config.gcs.bucket`                                      | GCS 存储桶名称                                                                                                                       | `""`                       |
| `global.persistence.config.gcs.folder`                                      | GCS 文件夹名称                                                                                                                       | `""`                       |
| `global.persistence.config.gcs.urlExpirationSecs`                           | 预签名 URL 的有效秒数                                                                                                                | `86400`                    |
| `global.featureFlags`                                                       | 功能开关（Feature Flags）的键值映射                                                                                                  | `{}`                       |
| `global.envInjectSources`                                                   | 用于加载额外环境变量的 shell 脚本文件名列表。在使用 Vault Agent Injector 时非常有用                                                       | `[]`                       |
| `global.cmdWrapper`                                                         | 在启动 App 之前运行的额外命令。适合在启动命令前执行包装脚本                                                                           | `""`                       |
| `global.customCaCerts`                                                      | 要加入信任链的 SSL 证书文件名列表                                                                                                    | `[]`                       |

## App 参数

专属于 Label Studio 部署中 `app` 部分的参数。

| 参数                                         | 描述                                                                                                          | 默认值                   |
|------------------------------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------|
| `app.args`                                     | 覆盖默认容器参数（使用自定义镜像时有用）	                                                                   | `["label-studio-uwsgi"]` |
| `app.deploymentStrategy.type`                  | 部署策略类型                                                                                                 | `RollingUpdate`          |
| `app.replicas`                                 | app Pod 副本数量                                                                                             | `1`                      |
| `app.NameOverride`                             | 部分覆盖 release 模板名称的字符串                                                                           | `""`                     |
| `app.FullnameOverride`                         | 完全覆盖 release 模板名称的字符串                                                                           | `""`                     |
| `app.resources.requests.memory`                | App 容器请求的内存资源                                                                                      | `384Mi`                  |
| `app.resources.requests.cpu`                   | App 容器请求的 CPU 资源                                                                                     | `250m`                   |
| `app.resources.limits.memory`                  | App 容器的内存资源限制                                                                                      | `""`                     |
| `app.resources.limits.cpu`                     | App 容器的 CPU 资源限制                                                                                     | `""`                     |
| `app.initContainer.resources.requests`         | 初始化容器（db-migrations）的资源请求                                                                       | `{}`                     |
| `app.initContainer.resources.limits`           | 初始化容器（db-migrations）的资源限制                                                                       | `{}`                     |
| `app.readinessProbe.enabled`                   | 启用就绪探针（readinessProbe）                                                                              | `false`                  |
| `app.readinessProbe.path`                      | 就绪探针路径                                                                                                | `/version`               |
| `app.readinessProbe.failureThreshold`          | 探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                                                   | `2`                      |
| `app.readinessProbe.initialDelaySeconds`       | 容器启动后到探针开始前的秒数                                                                                | `60`                     |
| `app.readinessProbe.periodSeconds`             | 执行探针的间隔（秒）                                                                                        | `10`                     |
| `app.readinessProbe.successThreshold`          | 探针在失败后被认为成功所需的最小连续成功次数                                                                | `1`                      |
| `app.readinessProbe.timeoutSeconds`            | 探针超时前的秒数                                                                                            | `5`                      |
| `app.livenessProbe.enabled`                    | 启用存活探针（livenessProbe）                                                                               | `true`                   |
| `app.livenessProbe.path`                       | 存活探针路径                                                                                                | `/health`                |
| `app.livenessProbe.failureThreshold`           | 探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                                                   | `3`                      |
| `app.livenessProbe.initialDelaySeconds`        | 容器启动后到探针开始前的秒数                                                                                | `60`                     |
| `app.livenessProbe.periodSeconds`              | 执行探针的间隔（秒）                                                                                        | `10`                     |
| `app.livenessProbe.successThreshold`           | 探针在失败后被认为成功所需的最小连续成功次数                                                                | `1`                      |
| `app.livenessProbe.timeoutSeconds`             | 探针超时前的秒数                                                                                            | `5`                      |
| `app.extraEnvironmentVars`                     | 要设置的额外环境变量映射                                                                                    | `{}`                     |
| `app.extraEnvironmentSecrets`                  | 要设置的额外 Secret 映射                                                                                    | `{}`                     |
| `app.nodeSelector`                             | Pod 分配的标签，以多行字符串或 YAML 映射格式提供                                                            | `{}`                     |
| `app.annotations`                              | 附加到 app Pod 的 k8s 注解                                                                                  | `{}`                     |
| `app.extraLabels`                              | 附加的额外 k8s 标签                                                                                         | `{}`                     |
| `app.affinity`                                 | Pod 分配的亲和性（affinity）                                                                                | `{}`                     |
| `app.tolerations`                              | Pod 的容忍度（toleration）设置                                                                              | `[]`                     |
| `app.nginx.resources.requests`                 | Nginx sidecar 容器：资源请求                                                                                | `{}`                     |
| `app.nginx.resources.limits`                   | Nginx sidecar 容器：资源限制                                                                                | `{}`                     |
| `app.dnsPolicy`                                | Pod DNS 策略                                                                                               | `ClusterFirst`           |
| `app.enableServiceLinks`                       | 服务环境变量                                                                                                | `false`                  |
| `app.shareProcessNamespace`                    | 在 Pod 中启用共享进程命名空间                                                                               | `false`                  |
| `app.automountServiceAccountToken`             | 为服务器 ServiceAccount 自动挂载服务账号令牌                                                               | `true`                   |
| `app.serviceAccount.create`                    | 为 app Pod 创建 ServiceAccount                                                                              | `true`                   |
| `app.serviceAccount.name`                      | 所创建 ServiceAccount 的名称                                                                                |                          |
| `app.serviceAccount.annotations`               | app ServiceAccount 的自定义注解                                                                            | `{}`                     |
| `app.podSecurityContext.enabled`               | 启用 Pod 安全上下文                                                                                         | `true`                   |
| `app.podSecurityContext.fsGroup`               | Pod 的组 ID                                                                                                | `1001`                   |
| `app.containerSecurityContext.enabled`         | 启用容器安全上下文                                                                                          | `true`                   |
| `app.containerSecurityContext.runAsUser`       | 容器的用户 ID                                                                                              | `1001`                   |
| `app.containerSecurityContext.runAsNonRoot`    | 避免权限提升到 root 用户                                                                                    | `true`                   |
| `app.extraVolumes`                             | 添加额外卷的数组                                                                                            | `[]`                     |
| `app.extraVolumeMounts`                        | 添加额外挂载的数组（通常与 extraVolumes 配合使用）                                                         | `[]`                     |
| `app.topologySpreadConstraints`                | Pod 分配的拓扑分布约束                                                                                      | `[]`                     |
| `app.nginx.args`                               | 覆盖默认容器参数（使用自定义镜像时有用）	                                                                   | `["nginx"]`              |
| `app.nginx.livenessProbe.enabled`              | Nginx sidecar 容器：启用存活探针                                                                           | `true`                   |
| `app.nginx.livenessProbe.path`                 | Nginx sidecar 容器：存活探针路径                                                                           | `/nginx_health`          |
| `app.nginx.livenessProbe.failureThreshold`     | Nginx sidecar 容器：探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                             | `2`                      |
| `app.nginx.livenessProbe.initialDelaySeconds`  | Nginx sidecar 容器：容器启动后到探针开始前的秒数                                                           | `60`                     |
| `app.nginx.livenessProbe.periodSeconds`        | Nginx sidecar 容器：执行探针的间隔（秒）                                                                   | `5`                      |
| `app.nginx.livenessProbe.successThreshold`     | Nginx sidecar 容器：探针在失败后被认为成功所需的最小连续成功次数                                           | `1`                      |
| `app.nginx.livenessProbe.timeoutSeconds`       | Nginx sidecar 容器：探针超时前的秒数                                                                       | `3`                      |
| `app.nginx.readinessProbe.enabled`             | Nginx sidecar 容器：启用就绪探针                                                                           | `true`                   |
| `app.nginx.readinessProbe.path`                | Nginx sidecar 容器：就绪探针路径                                                                           | `/version`               |
| `app.nginx.readinessProbe.failureThreshold`    | Nginx sidecar 容器：探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                             | `2`                      |
| `app.nginx.readinessProbe.initialDelaySeconds` | Nginx sidecar 容器：容器启动后到探针开始前的秒数                                                           | `60`                     |
| `app.nginx.readinessProbe.periodSeconds`       | Nginx sidecar 容器：执行探针的间隔（秒）                                                                   | `10`                     |
| `app.nginx.readinessProbe.successThreshold`    | Nginx sidecar 容器：探针在失败后被认为成功所需的最小连续成功次数                                           | `1`                      |
| `app.nginx.readinessProbe.timeoutSeconds`      | Nginx sidecar 容器：探针超时前的秒数                                                                       | `5`                      |
| `app.service.type`                             | k8s 服务类型                                                                                               | `ClusterIP`              |
| `app.service.port`                             | k8s 服务端口                                                                                               | `80`                     |
| `app.service.targetPort`                       | k8s 服务目标端口                                                                                           | `8085`                   |
| `app.service.portName`                         | k8s 服务端口名称                                                                                           | `service`                |
| `app.service.annotations`	                     | app 服务的自定义注解                                                                                       | `{}`                     |
| `app.service.sessionAffinity`                  | app 服务的自定义注解                                                                                       | `None`                   |
| `app.service.sessionAffinityConfig`	           | 会话亲和性（sessionAffinity）的额外设置                                                                    | `{}`                     |
| `app.ingress.enabled`                          | 设为 true 以启用 Ingress 记录生成	                                                                         | `false`                  |
| `app.ingress.className`                        | 用于实现 Ingress 的 IngressClass（Kubernetes 1.18+）                                                      | `""`                     |
| `app.ingress.host`                             | Ingress 资源的默认主机	                                                                                   | `""`                     |
| `app.ingress.path`                             | 指向 LabelStudio 的路径。配合 ALB Ingress 控制器使用时，可能需要将其设置为 `/*`。                         | `/`                      |
| `app.ingress.extraPaths`                       | 要前置到主机配置的额外路径                                                                                  | `[]`                     |
| `app.ingress.tls`                              | TLS secret 定义                                                                                            | `[]`                     |
| `app.ingress.annotations`                      | 额外的 Ingress 注解                                                                                        | `{}`                     |
| `app.rbac.create`                              | 指定是否为 app 服务创建 RBAC 资源                                                                          | `false`                  |
| `app.rbac.rules`                               | 为 app 服务设置的自定义 RBAC 规则		                                                                       | `[]`                     |
| `app.contextPath`                              | 附加到健康检查/就绪检查的路径                                                                              | `/`                      |
| `app.cmdWrapper`                               | 在启动 App 之前运行的额外命令。适合在启动命令前执行包装脚本                                                | `""`                     |


## Rqworker 参数

专属于 Label Studio Enterprise 部署中 `rqworkers` 服务的参数。

| 参数                                               | 描述                                                                                       | 默认值                                  |
|--------------------------------------------------|-------------------------------------------------------------------------------------------|----------------------------------------|
| `rqworker.enabled`                               | 启用 rqworker Pod                                                                         | `true`                                 |
| `rqworker.NameOverride`                          | 部分覆盖 release 模板名称的字符串                                                          | `""`                                   |
| `rqworker.FullnameOverride`                      | 完全覆盖 release 模板名称的字符串                                                          | `""`                                   |
| `rqworker.deploymentStrategy.type`               | 部署策略类型                                                                              | `Recreate`                             |
| `rqworker.extraEnvironmentVars`                  | 要设置的额外环境变量映射                                                                  | `{}`                                   |
| `rqworker.extraEnvironmentSecrets`               | 要设置的额外 Secret 映射                                                                  | `{}`                                   |
| `rqworker.nodeSelector`                          | Pod 分配的标签，以多行字符串或 YAML 映射格式提供                                          | `{}`                                   |
| `rqworker.annotations`                           | 附加到 rqworker Pod 的 k8s 注解                                                           | `{}`                                   |
| `rqworker.extraLabels`                           | 附加的额外 k8s 标签                                                                       | `{}`                                   |
| `rqworker.affinity`                              | Pod 分配的亲和性                                                                          | `{}`                                   |
| `rqworker.tolerations`                           | Pod 的容忍度设置                                                                          | `[]`                                   |
| `rqworker.queues.high.replicas`                  | rqworker 队列 "high" 的副本数量                                                          | `1`                                    |
| `rqworker.queues.high.args`                      | rqworker 队列 "high" 的启动参数                                                          | `"high"`                               |
| `rqworker.queues.low.replicas`                   | rqworker 队列 "low" 的副本数量                                                           | `1`                                    |
| `rqworker.queues.low.args`                       | rqworker 队列 "low" 的启动参数                                                           | `"low"`                                |
| `rqworker.queues.default.replicas`               | rqworker 队列 "default" 的副本数量                                                       | `1`                                    |
| `rqworker.queues.default.args`                   | rqworker 队列 "default" 的启动参数                                                       | `"default"`                            |
| `rqworker.queues.critical.replicas`              | rqworker 队列 "critical" 的副本数量                                                      | `1`                                    |
| `rqworker.queues.critical.args`                  | rqworker 队列 "critical" 的启动参数                                                      | `"critical"`                           |
| `rqworker.queues.all.replicas`                   | rqworker 队列 "all" 的副本数量                                                           | `1`                                    |
| `rqworker.queues.all.args`                       | rqworker 队列 "all" 的启动参数                                                           | `"low", "default", "critical", "high"` |
| `rqworker.dnsPolicy`                             | Pod DNS 策略                                                                              | `ClusterFirst`                         |
| `rqworker.enableServiceLinks`                    | 服务环境变量                                                                              | `false`                                |
| `rqworker.shareProcessNamespace`                 | 在 Pod 中启用共享进程命名空间                                                            | `false`                                |
| `rqworker.automountServiceAccountToken`          | 为服务器 ServiceAccount 自动挂载服务账号令牌                                             | `true`                                 |
| `rqworker.readinessProbe.enabled`                | 启用就绪探针                                                                              | `false`                                |
| `rqworker.readinessProbe.path`                   | 就绪探针路径                                                                              | `/version`                             |
| `rqworker.readinessProbe.failureThreshold`       | 探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                                | `2`                                    |
| `rqworker.readinessProbe.initialDelaySeconds`    | 容器启动后到探针开始前的秒数                                                              | `60`                                   |
| `rqworker.readinessProbe.periodSeconds`          | 执行探针的间隔（秒）                                                                      | `5`                                    |
| `rqworker.readinessProbe.successThreshold`       | 探针在失败后被认为成功所需的最小连续成功次数                                              | `1`                                    |
| `rqworker.readinessProbe.timeoutSeconds`         | 探针超时前的秒数                                                                          | `3`                                    |
| `rqworker.livenessProbe.enabled`                | 启用存活探针                                                                              | `false`                                |
| `rqworker.livenessProbe.path`                   | 存活探针路径                                                                              | `/health`                              |
| `rqworker.livenessProbe.failureThreshold`        | 探针失败时，Kubernetes 会在放弃前尝试 failureThreshold 次                                | `2`                                    |
| `rqworker.livenessProbe.initialDelaySeconds`     | 容器启动后到探针开始前的秒数                                                              | `60`                                   |
| `rqworker.livenessProbe.periodSeconds`           | 执行探针的间隔（秒）                                                                      | `5`                                    |
| `rqworker.livenessProbe.successThreshold`       | 探针在失败后被认为成功所需的最小连续成功次数                                              | `1`                                    |
| `rqworker.livenessProbe.timeoutSeconds`          | 探针超时前的秒数                                                                          | `3`                                    |
| `rqworker.serviceAccount.create`                 | 为 rqworker Pod 创建 ServiceAccount                                                      | `true`                                 |
| `rqworker.serviceAccount.name`                   | 所创建 ServiceAccount 的名称                                                              | `""`                                   |
| `rqworker.podSecurityContext.enabled`            | 启用 Pod 安全上下文                                                                       | `true`                                 |
| `rqworker.podSecurityContext.fsGroup`            | Pod 的组 ID                                                                               | `1001`                                 |
| `rqworker.containerSecurityContext.enabled`      | 启用容器安全上下文                                                                        | `true`                                 |
| `rqworker.containerSecurityContext.runAsUser`    | 容器的用户 ID                                                                             | `1001`                                 |
| `rqworker.containerSecurityContext.runAsNonRoot` | 避免权限提升到 root 用户                                                                  | `true`                                 |
| `rqworker.serviceAccount.annotations`            | app ServiceAccount 的自定义注解                                                          | `{}`                                   |
| `rqworker.extraVolumes`                          | 添加额外卷的数组                                                                          | `[]`                                   |
| `rqworker.extraVolumeMounts`                     | 添加额外挂载的数组（通常与 extraVolumes 配合使用）                                       | `[]`                                   |
| `rqworker.topologySpreadConstraints`             | Pod 分配的拓扑分布约束                                                                    | `[]`                                   |
| `rqworker.rbac.create`                           | 指定是否为 rqworker 服务创建 RBAC 资源                                                   | `false`                                |
| `rqworker.rbac.rules`                            | 为 rqworker 服务设置的自定义 RBAC 规则		                                               | `[]`                                   |
| `rqworker.cmdWrapper`                           | 在启动 App 之前运行的额外命令。适合在启动命令前执行包装脚本                            | `""`                                   |

<div class="enterprise-only">

## Label Studio Enterprise 参数

| 参数                                 | 描述                                                                          | 默认值   |
|-------------------------------------|------------------------------------------------------------------------------|-----------|
| `enterprise.enabled`                | 启用 Enterprise 功能                                                         | `false`   |
| `enterprise.enterpriseLicense.secretName` | 持有 Label Studio Enterprise 许可证信息的现有 Secret 名称               | `""`      |
| `enterprise.enterpriseLicense.secretKey`  | 持有 Enterprise 许可证信息的现有 Secret 键                               | `license` |

</div>

## 子 chart 参数

| 参数                  | 描述                                                                                       | 默认值       |
|----------------------|-------------------------------------------------------------------------------------------|---------------|
| `postgresql.enabled`       | 启用 Postgresql 子 chart                                                                 | `true`        |
| `postgresql.architecture`  | PostgreSQL 架构（standalone 或 replication）                                             | `standalone`  |
| `postgresql.image.tag`     | PostgreSQL 镜像标签                                                                      | `13.8.0`      |
| `postgresql.auth.username` | 要创建的自定义用户名	                                                                   | `labelstudio` |
| `postgresql.auth.password` | 要创建的自定义用户密码。如果提供了带有 password 键的 `auth.existingSecret`，则忽略此值	 | `labelstudio` |
| `postgresql.auth.database` | 要创建的自定义数据库名	                                                                 | `labelstudio` |
| `redis.enabled`            | 启用 Redis 子 chart                                                                      | `false`       |
| `redis.architecture`       | Redis 架构。允许的值：`standalone` 或 `replication`	                                    | `standalone`  |
| `redis.auth.enabled`       | 启用密码认证	                                                                           | `false`       |

## 其他参数
| 参数                 | 描述                                        | 默认值         |
|---------------------|--------------------------------------------|-----------------|
| upgradeCheck.enabled      | 启用 upgradecheck                          | `false`         |
| ci                        | 表示部署是否用于 CI 目的                   | `false`         |
| clusterDomain             | Kubernetes 集群域名                       | `cluster.local` |
| checkConfig.skipEnvValues | 跳过对环境变量的校验                      | `false`         |

## `global.extraEnvironmentVars` 的用法

`global.extraEnvironmentVars` 区块可用于配置 Label Studio 的环境属性。

在此区块下放置的任何键值对都会转化为用于控制 Label Studio 配置的环境变量。每个键在设置为环境变量之前都会被转换为大写。

示例：

```yaml
global:
  extraEnvironmentVars:
     PG_USER: labelstudio
```

!!! note
    如果你要部署到生产环境，应设置 `SSRF_PROTECTION_ENABLED: true`。请参阅 [保护 Label Studio 安全](security#Enable-SSRF-protection-for-production-environments)。

<div class="enterprise-only">

### 降低许可证的席位上限

设置 `LICENSE_MAX_USERS_OVERRIDE` 以使用少于许可证所允许的席位数，例如为了让一个预发（staging）部署保持在更小的预算内：

```yaml
global:
  extraEnvironmentVars:
     LICENSE_MAX_USERS_OVERRIDE: 50
```

默认情况下该变量未设置，适用的是许可证中的席位数。它只能*降低*该数值：如果你将其设置得高于许可证的席位数，或低于 `1`，部署将启动失败。许可证本身不会被修改，因此移除该变量并重启即可恢复许可证的席位数。

由于本地部署（on-premise）的席位是在部署内的所有组织之间统一计数的，该覆盖值适用于整个部署，而非单个组织。当你的许可证未显式设置免费“仅查看（View-Only）”席位时，它也会降低免费“仅查看”席位的数量。请参阅 [用量与许可证](admin_usage#Seats-in-use)。

</div>
