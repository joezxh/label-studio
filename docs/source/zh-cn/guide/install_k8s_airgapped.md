---
title: Install Label Studio without public internet access
short: Airgapped Server
tier: all
type: guide
order: 71
order_enterprise: 73
meta_title: Install Label Studio without public internet access
meta_description: Install Label Studio without public internet access to create machine learning and data science projects in an airgapped environment. 
section: "Install & Setup"
parent: "install_k8s"
parent_enterprise: "install_enterprise_k8s"
---

如果你需要在屏蔽互联网访问（使用代理）的服务器上安装 Label Studio，或者在禁止向互联网发起出站连接的离线（airgapped）服务器上安装，请按照以下步骤操作：

- 如果你是通过 HTTPS 代理从服务器访问互联网的，请参阅 [通过 HTTPS 代理安装](#Install-behind-an-HTTPS-proxy)。
- 如果你的服务器无法访问互联网，或使用了不同的代理，请参阅 [无互联网访问或无 HTTPS 代理安装](#Install-without-internet-access-or-HTTPS-proxy)。

### 通过 HTTPS 代理安装

!!! note 
    如果你使用的是 SOCKS 代理，Helm 3 不支持 SOCKS 代理。请参阅 [无互联网访问或无 HTTPS 代理安装](#Install-without-internet-access-or-HTTPS-proxy)。

如果你的组织使用 HTTPS 代理来管理对互联网的访问，请执行以下操作。

<div class="opensource-only">

1. 与你的网络安全团队协作，将 `https://charts.heartex.com` 加入白名单，以便你能访问用于部署的 Helm charts。
2. 在 Label Studio 服务器上，设置一个包含 HTTPS 代理地址的环境变量：
```shell
export HTTPS_PROXY=<your_proxy>
```
3. [使用 Helm 在你的 Kubernetes 集群上安装 Label Studio](install_k8s#Use-Helm-to-install-Label-Studio-on-your-Kubernetes-cluster)。

</div>

<div class="enterprise-only">

1. 与你的网络安全团队协作，将 `https://charts.heartex.com` 加入白名单，以便你能访问用于部署的 Helm charts。
2. 在 Label Studio 服务器上，设置一个包含 HTTPS 代理地址的环境变量：
```shell
export HTTPS_PROXY=<your_proxy>
```
3. [使用 Helm 在你的 Kubernetes 集群上安装 Label Studio](install_enterprise_k8s#Use-Helm-to-install-Label-Studio-Enterprise-on-your-Kubernetes-cluster)。

</div>

### 无互联网访问或无 HTTPS 代理安装

如果你无法通过使用 Helm 支持的代理（或根本无法）来访问互联网，请按照以下步骤下载在离线 Kubernetes 集群上部署 Label Studio 所需的 Helm charts。

!!! note
    你需要你的客户经理提供给你的 Label Studio 凭据才能下载这些 Helm charts。

1. 下载最新版本的 Label Studio Helm chart：
   ```shell
   helm repo add heartex https://charts.heartex.com/
   helm repo update heartex
   helm pull heartex/label-studio
   ```
2. 将下载的 `tar.gz` 压缩包传输到已安装 `kubectl` 和 `helm` 的主机。
3. 解压 `tar.gz` 压缩包。
4. 安装 Label Studio，将 `helm` 命令中的路径更新为指向你解压 Label Studio Helm chart 的文件夹的相对路径。例如，如果你在当前目录下解压了该压缩包，运行以下命令：
```shell
helm install ls ./label-studio -f ls-values.yaml
```
