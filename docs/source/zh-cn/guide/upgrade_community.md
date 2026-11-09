---
title: Upgrade Label Studio
type: guide
tier: opensource
order: 96
order_enterprise: 0
meta_title: Upgrade Label Studio Community Edition
meta_description: Documentation for upgrade paths and commands for Label Studio. 
section: "Install & Setup"
---

升级 Label Studio 时，请牢记以下几点：

- **备份你的数据**：在开始升级之前，请务必备份你现有的项目、数据库和任何自定义配置。
- **查看发布说明**：查看你正在升级到的版本的 [发布说明](https://github.com/HumanSignal/label-studio/releases)。注意任何可能需要的破坏性变更或迁移步骤。
- **Python 兼容性**：确保你的 Python 版本与新的 Label Studio 版本兼容。Label Studio 支持 Python 3.9 至 3.13。使用不兼容的 Python 版本可能会导致安装错误。
- **检查依赖问题**：升级后，验证所有依赖项是否已正确安装。如果你遇到缺少包的错误，可能需要手动安装这些包。在干净的 Python 环境或虚拟环境中运行 Label Studio 可以降低包冲突的可能性。
- **测试你的设置**：升级后，测试你的 Label Studio 实例以确保一切按预期工作。检查关键功能，例如任务加载、标注界面、数据导出以及你使用的任何集成。
- **排查安装问题**：如果在升级过程中遇到任何问题，请参阅 [排查安装问题](install_troubleshoot)。

## 使用 pip 升级

```bash
 pip install --upgrade label-studio
```

## 使用 Docker 升级

1. 停止现有的 Label Studio 容器：
    ```bash
    docker ps  # 查找容器 ID 或名称
    docker stop <container_id_or_name>
    ```
2. 拉取最新的 Label Studio Docker 镜像：
    ```bash
    docker pull heartexlabs/label-studio:latest
    ```
3. 使用最新的镜像启动一个新容器，使用与之前相同的卷映射：
    ```bash
    docker run -it -p 8080:8080 \
    -v /path/to/yourdata:/label-studio/data \
    -v /path/to/yourfiles:/label-studio/files \
    heartexlabs/label-studio:latest
    ```
    将 `/path/to/yourdata` 和 `/path/to/yourfiles` 替换为你之前使用的实际路径。
4. 运行数据库迁移（如有必要）。

    如果你在升级后遇到任何问题，可能需要运行数据库迁移：

    ```bash
    docker exec -it <container_id_or_name> bash
    cd /label-studio
    python manage.py migrate
    ```
5. 在浏览器中打开 `http://localhost:8080` 的 Label Studio，并检查你的项目和数据是否可以访问。

## 从源代码安装后升级

如果你是从 [Github 使用源代码](https://github.com/HumanSignal/label-studio) 安装的 Label Studio，可以使用以下步骤进行升级。

<div class="code-tabs">
  <div data-name="使用 Poetry（推荐）">

  如果你正在使用 Poetry（[请参阅这些说明](install#Install-from-source)），请使用以下步骤进行升级：
  
  1. 导航到你的 Label Studio 目录（你克隆仓库的位置）。
  2. 从仓库获取最新更改：
  ```bash
    git pull
  ```
  3. 如果你想升级到特定版本，列出可用的标签并检出所需的标签。例如，要升级到版本 1.14.0：
  ```bash
    git fetch --tags
    git checkout v1.14.0
  ```
  4. 使用 Poetry 安装更新的依赖项：
  ```bash
    poetry install
  ```
  5. 运行数据库迁移以应用对数据库模式的任何更新：
  ```bash
    poetry run python label_studio/manage.py migrate
  ```
  6. 收集静态文件：
  ```bash
    poetry run python label_studio/manage.py collectstatic
  ```
  7. 重启 Label Studio：
  ```bash
    poetry run python label_studio/manage.py runserver
  ```

  </div>
  <div data-name="使用 pip">
  
  1. 导航到你的 Label Studio 目录（你克隆仓库的位置）。
  2. 从仓库获取最新更改：
  ```bash
    git pull
  ```
  3. 如果你想升级到特定版本，列出可用的标签并检出所需的标签。例如，要升级到版本 1.14.0：
  ```bash
    git fetch --tags
    git checkout v1.14.0
  ```
  4. 安装更新的依赖项：
  ```bash
    pip install -r requirements.txt
  ```
  5. 运行数据库迁移以应用对数据库模式的任何更新：
  ```bash
    python label_studio/manage.py migrate
  ```
  6. 收集静态文件：
  ```bash
    python label_studio/manage.py collectstatic
  ```
  7. 重启 Label Studio：
  ```bash
    python label_studio/manage.py runserver
  ```

  </div>
</div>

## 升级 Kubernetes 安装

请参阅 [使用 Helm 升级 Label Studio](install_k8s#Upgrade-Label-Studio-using-Helm)。
