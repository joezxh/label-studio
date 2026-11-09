---
title: Install Prompts in an on-prem environment (optional)
short: Install Prompts
type: guide
tier: enterprise
order: 0
order_enterprise: 71
meta_title: Install Prompts
meta_description: Install Prompts in a Label Studio Enterprise on-prem environment
section: "Install & Setup"
parent: "install_k8s"
parent_enterprise: "install_enterprise_k8s"
---

在本地部署（on-prem）环境中安装 Prompts 需要安装 Adala，即我们的数据标注智能体（agent）微服务。

只有在你想使用 Prompts 时才需要完成这些步骤。更多信息请参阅我们的 [Prompts 概述](prompts_overview)。

!!! note
    Prompts 仅支持 Kubernetes 部署。如果你使用的是 Docker，需要迁移到 Kubernetes 部署才能使用 Prompts。更多信息请参阅 [在 Kubernetes 上部署 Label Studio Enterprise](install_enterprise_k8s.html)。


## 前提条件

- Kubernetes 集群 **v1.24** 或更高版本
- Helm **v3.8.0** 或更高版本
- Docker CLI（用于登录 Docker Hub）

## 资源要求

在安装之前，请确保你的 Kubernetes 集群能够为 Adala 提供以下最低资源：

| 资源 | 要求 |
| --- | --- |
| CPU | 6 核 |
| 内存 | 12 GB |

## 1. 登录 Docker Hub 并验证访问权限

你需要你的 Docker Hub 用户名和密码。如果你没有，请[向 HumanSignal 团队申请访问权限](mailto:support@humansignal.com)。

登录 DockerHub 以访问私有 OCI 仓库：

```bash

docker login -u CUSTOMER_USERNAME
```

按照提示输入你的 Docker Hub 密码。

然后验证你的凭据与访问权限：

```bash
helm pull oci://registry-1.docker.io/heartexlabs/adala
```

预期输出：

```bash
Pulled: registry-1.docker.io/heartexlabs/adala:X.X.X
Digest: sha256:***************************************************
```

## 2. 创建用于拉取镜像的 Kubernetes Secret

创建一个 Kubernetes Secret，使你的集群能够拉取私有的 Adala 镜像：

```bash
kubectl create secret docker-registry heartex-pull-key \
  --docker-server=https://index.docker.io/v2/ \
  --docker-username=CUSTOMER_USERNAME \
  --docker-password=CUSTOMER_PASSWORD
```

## 3. 准备你的自定义 values 文件

创建一个名为 `custom.values.yaml` 的文件，内容如下：

```yaml
adala-app:
  deployment:
    image:
      tag: 20260409.063233-main-6b619568
      pullSecrets:
        - heartex-pull-key
adala-worker:
  deployment:
    image:
      tag: 20260409.063233-main-6b619568
      pullSecrets:
        - heartex-pull-key
```

!!! note
    如有必要，请将 `image.tag` 替换为合适的版本。


## 4. 为 Adala 创建专用命名空间

为 Adala 创建一个专用命名空间 `prompt`：

```bash
kubectl create namespace prompt
```

## 5. 安装 Adala Helm chart

运行以下命令，使用你的自定义 values 安装 **Adala**：

```bash
helm install lse oci://registry-1.docker.io/heartexlabs/adala --values custom.values.yaml
```

## 6. 验证 Adala 是否正在运行

检查 `prompt` 命名空间中的所有 Pod 是否处于 **Running** 或 **Completed** 状态：

```bash
kubectl get pods -n prompt
```

你应该看到所有 Pod 的 `STATUS` 都为 `Running` 的输出，例如：

```
NAME                                  READY   STATUS    RESTARTS       AGE
adala-adala-app-d4564ffd7-gtmhx       1/1     Running   0              100m
adala-adala-kafka-controller-0        1/1     Running   0              110m
adala-adala-kafka-controller-1        1/1     Running   0              111m
adala-adala-kafka-controller-2        1/1     Running   0              113m
adala-adala-redis-master-0            1/1     Running   0              125m
adala-adala-worker-5d87f97f76-mq952   1/1     Running   0              111m

```

如果有任何 Pod 未处于运行状态，你可以进一步排查：

```bash

kubectl describe pod <pod-name> -n prompt
```

或

```bash
kubectl logs <pod-name> -n prompt
```

## 7. 更新 Label Studio 的 `values.yaml` 文件

你需要更新 Label Studio Enterprise `values.yaml` 文件的 `global` 区块，添加以下内容：

* 添加 Adala 端点，使 Label Studio 能够连接到 Adala。
* 添加 Prompts 功能开关（feature flag），以在 Label Studio 内启用 Prompts 可见性。


```yaml
global:
  extraEnvironmentVars:
    PROMPTER_ADALA_URL: http://adala-adala-app.prompt:8000
  featureFlags:
    fflag_feat_all_dia_835_prompter_workflow_long: true
```

关于 `PROMPTER_ADALA_URL`，请注意以下几点：

- `prompt` 是 Adala 安装所在的命名空间。
- `adala-adala-app` 是由 Helm release 自动创建的 Adala 服务名称。
- 端口 `8000` 是 Adala 监听的默认端口。

更新 values 文件后，重新部署 Label Studio 以应用这些更改。

## 8. 可选：添加自定义 CA 证书包

如果你的环境需要自定义 CA 证书包（例如，在与位于企业代理之后、使用自签名证书的 LLM 提供商通信时），你必须让 Adala Pod 能够访问该 CA 证书。

由于 Label Studio Enterprise 和 Adala（Prompts）部署在独立的命名空间中，Kubernetes Secret 无法在它们之间共享。即使你已经在 Label Studio 命名空间中有 CA 证书包 Secret，你也必须在 `prompt` 命名空间中创建一个新的 Secret：

```bash
kubectl create secret generic custom-ca-bundle \
  --from-file=ca.crt=my.cert \
  -n prompt
```

将 `my.cert` 替换为你的 CA 证书文件路径。键名（`ca.crt`）必须与下方 values 文件中引用的 `key` 相匹配。

然后将以下内容添加到你的 `custom.values.yaml` 中，并重新运行第 5 步中的 `helm install`/`helm upgrade` 命令：

```yaml
adala-app:
  deployment:
    extraEnvVars:
      REQUESTS_CA_BUNDLE: /etc/ssl/custom/ca.crt
      SSL_CERT_FILE: /etc/ssl/custom/ca.crt
    extraVolumeMounts:
      - mountPath: /.cache
        name: cache-dir
      - mountPath: /etc/ssl/custom
        name: custom-ca
        readOnly: true
    extraVolumes:
      - name: cache-dir
        emptyDir: {}
      - name: custom-ca
        secret:
          secretName: custom-ca-bundle
          items:
            - key: ca.crt
              path: ca.crt

adala-worker:
  deployment:
    extraEnvVars:
      REQUESTS_CA_BUNDLE: /etc/ssl/custom/ca.crt
      SSL_CERT_FILE: /etc/ssl/custom/ca.crt
    extraVolumeMounts:
      - mountPath: /.cache
        name: cache-dir
      - mountPath: /etc/ssl/custom
        name: custom-ca
        readOnly: true
    extraVolumes:
      - name: cache-dir
        emptyDir: {}
      - name: custom-ca
        secret:
          secretName: custom-ca-bundle
          items:
            - key: ca.crt
              path: ca.crt
```
