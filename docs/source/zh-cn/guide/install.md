---
title: 安装
type: guide
tier: opensource
order: 60
order_enterprise: 0
meta_title: 安装与升级 Label Studio
meta_description: "Label Studio 文档：使用 Docker、pip 和 Anaconda 为你的机器学习与数据科学项目安装和升级 Label Studio。"
section: "安装与配置"
---

在本地或云端安装 Label Studio。请根据你的环境选择最合适的安装方式：

- [使用 pip 安装](#Install-using-pip)
- [使用 Docker 安装](#Install-with-Docker)
- [在 Ubuntu 上安装](#Install-on-Ubuntu)
- [从源代码安装](#Install-from-source)
- [使用 Anaconda 安装](#Install-with-Anaconda)
- [升级 Label Studio](#Upgrade-Label-Studio)

Label Studio 也提供 [企业版产品](https://heartex.com/)，你可以通过 [免费试用](https://humansignal.com/free-trial) 立即体验。

{% insertmd zh-cn/includes/deploy.md %}

### 支持的 Web 浏览器

Label Studio 已使用最新版本的 Google Chrome 进行测试。

如果使用其他 Web 浏览器，或受支持浏览器的较旧版本，可能会出现意外行为。

## 安装前提条件

请在干净的 Python 环境中安装 Label Studio。我们强烈建议使用虚拟环境（venv 或 conda），以降低包冲突或缺少依赖包的可能性。

## 使用 pip 安装

若要使用 pip 和虚拟环境安装 Label Studio，你需要 Python 3.8 或更高版本。运行以下命令：

```bash
python3 -m venv env
source env/bin/activate
python -m pip install label-studio
```

若要直接使用 pip 安装 Label Studio，你需要 Python 3.8 或更高版本。运行以下命令：

```bash
pip install label-studio
```

安装 Label Studio 后，使用以下命令启动服务器：

```bash
label-studio
```

默认 Web 浏览器会自动打开 [http://localhost:8080](http://localhost:8080) 并加载 Label Studio。有关启动 Label Studio 的更多选项，请参阅[启动 Label Studio](/guide/start)。

## 使用 Homebrew 安装

若要使用 Brew 安装 Label Studio，你需要在系统上安装 Brew 包管理器。如果尚未安装 Brew，请访问 [brew.sh](https://brew.sh/) 获取安装说明。

执行以下命令以添加 Heartexlabs tap：

```bash
brew tap humansignal/tap
```

执行以下命令安装 Label Studio：

```bash
brew install humansignal/tap/label-studio
```

安装完成后，使用以下命令启动服务器：

```bash
label-studio
```

默认 Web 浏览器会自动打开 [http://localhost:8080](http://localhost:8080) 并加载 Label Studio。有关启动 Label Studio 的更多选项，请参阅[启动 Label Studio](/guide/start)。

!!! note
    如果你之前从已弃用的组织名 `heartexlabs/tap` 添加了 brew tap，好消息是：你无需立即迁移。`heartexlabs/tap` 已被设置为 `humansignal/tap` 的镜像，以确保现有用户的连续性并尽量减少中断。

## 使用 Docker 安装

Label Studio 也提供 Docker 容器版本。请确保你的机器上已安装 [Docker](https://www.docker.com/)。

### 在 \*nix 系统上使用 Docker 安装

要在 [http://localhost:8080](http://localhost:8080) 安装并启动 Label Studio，并将所有标注数据存储在 `./mydata` 目录中，请运行以下命令：

```bash
docker run -it -p 8080:8080 -v $(pwd)/mydata:/label-studio/data heartexlabs/label-studio:latest
```

!!! attention "important"
    由于这是一个非 root 容器，挂载的文件和目录必须具有 `UID 1001` 的适当权限。

### 在 Windows 上使用 Docker 安装

对于 Windows，你需要修改 `-v` 选项设置的卷路径。

#### 覆盖默认的 Docker 安装

你可以通过追加新的参数来覆盖默认的 Docker 安装。

在 Windows 命令行（cmd）中：

```bash
docker run -it -p 8080:8080 -v %cd%/mydata:/label-studio/data heartexlabs/label-studio:latest label-studio --log-level DEBUG
```

在 PowerShell 中：

```bash
docker run -it -p 8080:8080 -v ${PWD}/mydata:/label-studio/data heartexlabs/label-studio:latest label-studio --log-level DEBUG
```

### 使用 Docker 构建本地镜像

如果你想构建本地镜像，请运行：

```bash
docker build -t heartexlabs/label-studio:latest .
```

### 使用 Docker Compose 运行

使用 Docker Compose 在 `http://localhost:8080` 提供 Label Studio 服务。你必须使用 1.25.0 或更高版本的 Docker Compose。

启动 Label Studio：

```bash
docker-compose up -d
```

这将使用 PostgreSQL 数据库后端启动 Label Studio。你也可以在不使用 Docker Compose 的情况下使用 PostgreSQL 数据库。请参阅[设置数据库存储](/guide/storedata)。

### 在无互联网访问的情况下安装 Label Studio

下载 label-studio docker 镜像（在具备互联网访问和 docker 的主机上）：

```bash
docker pull heartexlabs/label-studio:latest
```

将其导出为 tar 归档文件：

```bash
docker save heartexlabs/label-studio:latest | gzip > label_studio_latest.tar.gz
```

将其传输到另一台虚拟机：

```bash
scp label_studio_latest.tar.gz <ANOTHER_HOST>:/tmp
```

通过 SSH 登录 `<ANOTHER_HOST>` 并从归档文件加载镜像：

```bash
docker load --input /tmp/label_studio_latest.tar.gz
```

请按照[安装与升级以运行 LS](/guide/install#Install-with-Docker) 中的步骤操作。

## 在 Ubuntu 上安装

要在 Ubuntu 上安装 Label Studio 并在虚拟环境中运行，请运行以下命令：

```bash
python3 -m venv env
source env/bin/activate
sudo apt install python3.9-dev
python -m pip install label-studio
```

## 从源代码安装

如果你想使用每日构建版本或扩展其功能，可以考虑使用 Git 下载源代码并在本地运行 Label Studio：

```bash
git clone https://github.com/HumanSignal/label-studio.git

# 安装依赖
cd label-studio
pip install poetry
poetry install

# 运行数据库迁移
poetry run python label_studio/manage.py migrate

# 收集静态文件
poetry run python label_studio/manage.py collectstatic

# 在开发模式下于 http://localhost:8080 启动服务器
poetry run python label_studio/manage.py runserver

```

## 使用 Anaconda 安装

```bash
conda create --name label-studio
conda activate label-studio
conda install psycopg2  # 仅 LS 1.7.2 需要
pip install label-studio
```

## 升级 Label Studio

要升级到最新版本的 Label Studio，请使用 pip 重新安装或升级。

```bash
pip install --upgrade label-studio
```

当你从 0.9.1 或更早版本升级到 1.0.0 版本时，将运行迁移脚本。

为确保现有项目完成迁移，请在[启动 Label Studio](/guide/start) 时运行以下命令：

```bash
label-studio start path/to/old/project
```

需要了解的最重要变更是将 “completions” 重命名为 “annotations”。请参阅[已完成任务的更新后 JSON 格式](/guide/export#Raw_JSON_format_of_completed_tasks)。

如果你自定义了 Label Studio 前端，请参阅[前端参考指南](/guide/frontend_reference)，了解为保持与 1.0.0 版本兼容所需的更新。
