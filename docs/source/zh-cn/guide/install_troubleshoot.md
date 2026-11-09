---
title: Troubleshoot installation issues
short: Troubleshooting
tier: opensource
type: guide
order: 81
order_enterprise: 0
meta_title: Troubleshoot Label Studio installation issues
meta_description: Tips for troubleshooting Label Studio installation issues
section: "Install & Setup"
parent: "install"
date: 2023-12-06 10:38:02
---

在安装 Label Studio 时你可能会看到错误。请按照以下步骤解决它们。

## 运行最新版本的 Label Studio

许多 bug 可能已在补丁版本或维护版本中修复。在启动 Label Studio 之前，请确保你运行的是最新版本的 Label Studio，方法是[升级](install#Upgrade-Label-Studio)你的安装。

## 关于缺失包的错误

如果你看到关于缺失包的错误，请安装这些包，然后再次尝试安装 Label Studio。确保你在干净的 Python 环境中运行 Label Studio，例如虚拟环境。

对于 Windows 用户，默认安装可能无法构建 `lxml` 包。请考虑从 [非官方 Windows 二进制文件](https://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) 手动安装它。如果你运行的是 Python 3.8 或更高版本的 Windows 64 位系统，请运行 `pip install lxml‑4.5.0‑cp38‑cp38‑win_amd64.whl` 来安装。

## 来自 Label Studio 的错误

如果你在安装过程中看到任何其他错误，请尝试重新运行安装。

```bash
pip install --ignore-installed label-studio
```

## OpenBLAS blas_thread_init: pthread_create failed for thread X of Y: Operation not permitted

将 Docker Engine 升级到最新的可用版本（>= [20.10.12](https://docs.docker.com/engine/release-notes/#201012)）。

## PermissionError: [Errno 13] Permission denied: `/label-studio/data/media`

!!! warning
    从 Label Studio 1.7.0 版本开始，应用程序使用 ID 为 `1001` 的非 root docker 用户运行。

你可能已经知道，Docker 容器默认通常以 root 权限运行。这种不受限制的容器管理允许执行诸如安装系统包、修改配置文件以及绑定特权端口等操作，这些操作对开发目的都很有用。然而，当容器部署到生产环境时，这可能导致重大风险。

这是因为任何获得对你的以 root 运行的容器访问权限的人，都可能发起不希望出现的进程，例如注入恶意代码。在容器中以 root 身份运行进程还允许在启动容器时更改用户 ID（UID）或组 ID（GID），使你的应用程序更容易受到攻击。

建议使用非 root 容器的原因如下：

- 安全性：非 root 容器天生提供更好的安全性。如果出现容器引擎安全问题，以非特权用户身份运行容器将防止恶意代码在容器主机上获得提升的权限。有关 Docker 安全特性的更多信息，请参阅本指南。

- 平台限制：某些 Kubernetes 发行版（如 [OpenShift](https://www.openshift.com/)）会使用随机 UUID 执行容器。这种方法与非 root 容器不兼容，因为非 root 容器必须始终使用 root 用户的 UUID 运行。在这种情况下，只有非 root 容器镜像才能运行，因此它们是必需的。

我们的 [Dockerfile](https://github.com/HumanSignal/label-studio/blob/develop/Dockerfile) 包含 `USER 1001` 这一行，它将非 root 用户 UID 分配给镜像，使容器能够以非特权用户身份运行。该实现将上文提到的安全增强措施和其他限制应用到了容器上。

### 非 root 用户的文件权限

默认情况下，Label Studio 容器镜像以非 root 身份运行。因此，任何需要写访问权限的目录都必须分配给 root 组（`GID 0`）。这可确保任意用户（默认 `UID 1001`）能够写入该目录，因为该用户始终属于 root 组。为此，只需将本地目录的所有权设置为 root 组（GID 0）即可，无论 UID 是什么都足够：

```bash
mkdir mydata
sudo chown :0 mydata
```

!!! note

    如果你想了解更多关于非 root 容器以及 Docker 和 Kubernetes 安全性的内容，请查看以下文章：

    [Docker 安全文档](https://docs.docker.com/engine/security/security/)

    [Marc Campbell 的《理解 uid 和 gid 在 Docker 容器中的工作原理》](https://medium.com/@mccode/understanding-how-uid-and-gid-work-in-docker-containers-c37a01d01cf)

    [容器中的进程不应以 Root 身份运行](https://medium.com/@mccode/processes-in-containers-should-not-run-as-root-2feae3f0df3b)

    [Daniel J. Walsh 的《对非 root（容器）说不》](https://opensource.com/article/18/3/just-say-no-root-containers)

    [Lucas Willson-Richter 的《以非 root 用户身份运行 Docker 容器》](https://medium.com/redbubble/running-a-docker-container-as-a-non-root-user-7d2e00f8ee15)

    [Dan Wash 的《如何运行更安全的非 root 用户容器》](https://www.projectatomic.io/blog/2016/01/how-to-run-a-more-secure-non-root-user-container/)
