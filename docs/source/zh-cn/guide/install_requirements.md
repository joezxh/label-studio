---
title: Requirements to Install and upgrade Label Studio
short: Requirements
tier: opensource
section: "Install & Setup"
order: 61 
meta_title: Requirements to Install and Upgrade
meta_description: "Label Studio documentation: Requirements to install and upgrade Label Studio." 
---

{% insertmd zh-cn/includes/deploy.md %}

## 安装前提条件

在干净的 Python 环境中安装 Label Studio。Heartex 强烈建议使用虚拟环境（venv 或 conda），以降低出现包冲突或缺失包的可能性。


## 使用 pip 安装

要使用 pip 与虚拟环境安装 Label Studio，你需要 Python 3.8 或更高版本。运行以下命令：
```bash
python3 -m venv env
source env/bin/activate
python -m pip install label-studio
```

要使用 pip 安装 Label Studio，你需要 Python 3.8 或更高版本。运行以下命令：
```bash
pip install label-studio
```

安装 Label Studio 之后，使用以下命令启动服务器：
```bash
label-studio
```
默认 Web 浏览器会自动在 [http://localhost:8080](http://localhost:8080) 打开 Label Studio。有关启动 Label Studio 时的更多选项，请参阅 [启动 Label Studio](start.html)。

## 使用 Docker 安装

Label Studio 也以 Docker 容器的形式提供。请确保你的机器上已安装 [Docker](https://www.docker.com/)。

### 在 *nix 系统上使用 Docker 安装
要在 [http://localhost:8080](http://localhost:8080) 安装并启动 Label Studio，并将所有标注数据存储在 `./my_project` 目录中，运行以下命令：
```bash
docker run -it -p 8080:8080 -v $(pwd)/mydata:/label-studio/data heartexlabs/label-studio:latest
```

!!! attention "重要"
    由于这是一个非 root 容器，挂载的文件和目录必须对 `UID 1001` 具有正确的权限。

### 在 Windows 上使用 Docker 安装
或者在 Windows 上，你必须修改由 `-v` 选项设置的卷路径。

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
如果你想构建本地镜像，运行：
```bash
docker build -t heartexlabs/label-studio:latest .
```

### 使用 Docker Compose 运行
使用 Docker Compose 在 `http://localhost:8080` 提供 Label Studio 服务。你必须使用 Docker Compose 1.25.0 或更高版本。

启动 Label Studio：
```bash
docker-compose up -d
```

这会使用 PostgreSQL 数据库后端启动 Label Studio。你也可以在没有 Docker Compose 的情况下使用 PostgreSQL 数据库。请参阅 [配置数据库存储](storedata.html)。

### 在没有互联网访问的情况下安装 Label Studio
下载 label-studio docker 镜像（在有互联网访问和 docker 的主机上）：
```bash 
docker pull heartexlabs/label-studio:latest
```

将其导出为 tar 压缩包：
```bash
docker save heartexlabs/label-studio:latest | gzip > label_studio_latest.tar.gz
```

将其传输到另一台虚拟机：
```bash
scp label_studio_latest.tar.gz <ANOTHER_HOST>:/tmp
```

通过 SSH 登录 <ANOTHER_HOST> 并导入该压缩包：
```bash
docker image import /tmp/label_studio_latest.tar.gz
```

按照 [安装并升级以运行 LS](install.html#Install-with-Docker) 中的步骤操作。

## 在 Ubuntu 上安装

要在 Ubuntu 上安装 Label Studio 并在虚拟环境中运行它，运行以下命令：

```bash
python3 -m venv env
source env/bin/activate
sudo apt install python3.9-dev
python -m pip install label-studio
```

## 从源码安装

如果你想使用每日构建（nightly builds）或扩展功能，请考虑使用 Git 下载源码并在本地运行 Label Studio：

```bash
git clone https://github.com/HumanSignal/label-studio.git
cd label-studio
# 安装所有包依赖
pip install -e .
# 运行数据库迁移
python label_studio/manage.py migrate
# 在开发模式下于 http://localhost:8080 启动服务器
python label_studio/manage.py runserver
```

## 使用 Anaconda 安装

```bash
conda create --name label-studio
conda activate label-studio
pip install label-studio
```


## 升级 Label Studio

要升级到最新版本的 Label Studio，请使用 pip 重新安装或升级。

```bash
pip install --upgrade label-studio
```

当你从 0.9.1 或更早版本升级到 1.0.0 版本时，会运行迁移脚本。

为了确保现有项目得到迁移，当你[启动 Label Studio](start.html)时，运行以下命令：

```bash
label-studio start path/to/old/project 
```

最需要注意的重要变更是将 "completions" 重命名为 "annotations"。请参阅[已完成任务的更新后 JSON 格式](export.html#Raw_JSON_format_of_completed_tasks)。

如果你自定义了 Label Studio 前端，请参阅 [前端参考指南](frontend_reference.html) 以了解维护与 1.0.0 版本兼容性所需的更新。
