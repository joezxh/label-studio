---
title: Upgrade Label Studio Enterprise
short: Upgrade Label Studio
tier: enterprise
type: guide
order: 0
order_enterprise: 76
meta_title: Upgrade Label Studio Enterprise
meta_description: Steps you should take when upgrading Label Studio Enterprise.
section: "Install & Setup"
parent: "install"
parent_enterprise: "install_enterprise"
date: 2023-09-27 10:57:03
---

如果你使用的是 Label Studio Enterprise Cloud，所有升级和更新都会自动部署。

如果你使用的是 Label Studio 的本地部署版本，则需要采取额外的步骤。

!!! attention "发布支持周期"
    过去 12 个月内的所有发布版本都受支持：你可以针对它们报告错误，我们会在当前版本或即将发布的版本中修复这些错误，因此你可能需要升级才能获得修复。安全补丁仅针对当前次要版本和上一个次要版本发布。为了持续接收安全修复，请停留在最近的两个次要版本之一。如需帮助规划升级，请联系你的 HumanSignal 代表。

## 升级流程概述

1. [备份](backup_enterprise) 你的数据库（开发和生产）。
2. 首先在你的开发服务器上执行升级。
3. 运行健康检查与测试（[见下文](#Checks-after-upgrading)）。
4. 在你的生产服务器上执行升级。

!!! attention "重要"
    在升级之前，请查看 [发布说明](release_notes) 以了解任何破坏性变更。

## 使用 Helm 升级

如果你在 Kubernetes 环境中安装了 Label Studio Enterprise，可以使用 Helm 进行升级：

1. 确定 Label Studio Enterprise 的最新标签版本，并在你的 `ls-values.yaml` 文件中添加/替换以下内容：
   ```yaml
   global:
     image:
       tag: "20210914.154442-d2d1935"
   ```
2. 更新 values 文件后，检索 Helm chart 的最新更新：
   ```shell
   helm repo update heartex
   ```
3. 从命令行运行以下命令以升级你的部署：
   ```shell
   helm upgrade <RELEASE_NAME> heartex/label-studio -f ls-values.yaml
   ```
   如果需要，你可以从命令行指定版本：
   ```shell
   helm upgrade <RELEASE_NAME> heartex/label-studio -f ls-values.yaml --set global.image.tag=20210914.154442-d2d1935
   ```
   此命令会覆盖存储在 `ls-values.yaml` 中的标签值。你必须在升级或重新部署实例时更新标签值，以避免版本降级。

## 使用 Docker Compose 升级

如果你通过 Docker 安装了 Label Studio Enterprise，可以使用以下步骤进行升级：

1. 编辑 `docker-compose.yaml` 以更新 Label Studio Enterprise 版本。
2. 运行 Docker：
   
   ```shell
   docker compose up -d
   ```

## 升级后的检查

#### 测试 1

1. 创建一个新项目，最好使用更复杂的标注配置。
2. 将任务导入到新项目。
3. 从项目中，点击 **Label All Tasks（标注所有任务）**。标注几个任务，然后退出标注流。
4. 使用快速视图模式（点击任务将其打开）标注相同的任务。
5. 审查已标注的任务。
6. 从项目的仪表板中，确保你的工作被准确地反映出来（例如，如果你用两个标注标注了一个任务，仪表板应反映项目的非零统计信息）。
7. 导出任务并验证 JSON 文件是否准确地反映了你所做的工作。

#### 测试 2

1. 选择一个预先存在的项目。
2. 从测试 1 的步骤 #2 开始重复这些步骤。

理想情况下，你会在 3-4 个项目上完成此测试，每个项目具有不同的标注配置和数据类型。
