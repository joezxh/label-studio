---
title: Set up the database 
type: guide
tier: opensource
order: 84
order_enterprise: 0
meta_title: Database Storage Setup
meta_description: Configure the database storage used by Label Studio to ensure performant and scalable data and configuration storage.
section: "Install & Setup"
---

Label Studio 使用数据库来存储项目数据和配置信息。

## 标注性能

只要你不打算在数据管理器中使用复杂过滤器和其他复杂的多用户流水线，SQLite 数据库对于拥有数万个标注任务的项目可能运行良好。如果你想标注数百万个任务，或者预计会有大量并发用户，或者你计划处理真实项目，请使用 PostgreSQL 数据库。有关更多信息，请参阅 [安装和升级 Label Studio](install.html#PostgreSQL-database)。

例如，如果在标注进行的同时导入数据，标注任务加载可能需要 10 秒以上，并且标注操作也可能需要 10 秒以上才能完成。如果你想标注超过 100,000 个任务并带有 5 个或更多并发用户，请考虑将 PostgreSQL 或其他数据库与 Label Studio 一起使用。

## SQLite 数据库

Label Studio 默认使用 SQLite。你无需配置任何内容。Label Studio 将所有数据存储在管理员用户指定目录中的单个文件中。在你 [启动 Label Studio](start.html) 后，所使用的目录会打印在终端中。

## PostgreSQL 数据库

你也可以将你的任务和完成情况存储在 [PostgreSQL 数据库](https://www.postgresql.org/) 中，而不是默认的 SQLite 数据库。如果你打算频繁导入新的标注任务，或者计划跨项目标注数十万或更多的任务，则建议使用此方式。

### 在启动时创建连接

运行以下命令以启动 Label Studio、配置与你的 PostgreSQL 数据库的连接、扫描现有任务，并将它们加载到应用程序中以供特定项目进行标注。

```bash
label-studio start my_project --init -db postgresql 
```

你必须设置以下环境变量以将 Label Studio 连接到 PostgreSQL：

```
DJANGO_DB=default
POSTGRE_NAME=postgres
POSTGRE_USER=postgres
POSTGRE_PASSWORD=
POSTGRE_PORT=5432
POSTGRE_HOST=db
```

### 使用 Docker Compose 创建连接

当你使用 Docker Compose 启动 Label Studio 时，你使用 PostgreSQL 数据库启动它：
```bash
docker-compose up -d
```

## Minio Blob Storage

MinIO 是一个与 Amazon S3 兼容的 blob 存储解决方案。你可以使用 MinIO 来存储你的标注任务。

### 启动容器

对于本地开发，你可以托管一个本地 MinIO 服务器，以更接近于模拟基于 S3 的生产环境。

可在 [Label Studio 仓库](https://github.com/HumanSignal/label-studio) 中获取此示例 docker-compose 文件。

要与你的 Label Studio 实例一起运行 MinIO，请使用以下命令：
````bash
# 如果你不是 docker 组的成员，请在 Linux 上添加 sudo
docker compose -f docker-compose.yml -f docker-compose.minio.yml up -d
````
MinIO 服务器将在 http://localhost:9000 可访问。
要配置 MinIO 设置，请创建一个 `.env` 文件。请记住覆盖默认凭据。

````.dotenv
MINIO_ROOT_USER=minio_admin_do_not_use_in_production
MINIO_ROOT_PASSWORD=minio_admin_do_not_use_in_production

# 要自动为 minio 选择正确的 compose 文件，你可以添加以下行之一：
# Windows
COMPOSE_FILE=docker-compose.yml;docker-compose.minio.yml
# Linux/Mac
COMPOSE_FILE=docker-compose.yml:docker-compose.minio.yml

# 要使用特定的 minio 版本，你可以设置以下环境变量
# MINIO_VERSION=RELEASE.2025-04-22T22-12-26Z
````

### 将 Label Studio 连接到本地 MinIO

如果你没有静态 IP 地址，请在你的 hosts 文件中创建一个条目，以便 Label Studio 容器和你的浏览器都能以相同的主机名找到 MinIO。

以下条目将所有对 MinIO 的请求重定向到你的本地系统：
```text
127.0.0.1 minio
```

在 Windows 上，你可以在 `C:\Windows\System32\drivers\etc\hosts` 找到你的 hosts 文件。
在 Linux 上，你可以在 `/etc/hosts` 找到你的 hosts 文件。
在 macOS 上，你可以在 `/private/etc/hosts` 找到你的 hosts 文件。

修改 hosts 文件后，你可以通过浏览器在 http://minio:9000 连接到你的 MinIO 服务器。

### 删除 MinIO 数据

你可以通过删除容器和关联的卷来移除你的 MinIO 安装。
此操作具有破坏性，将删除存储在 MinIO 中的所有数据。
```bash
docker-compose -f docker-compose.minio.yml down --volumes
```

## 数据持久化

如果你使用的是 Docker 容器、Heroku 或其他云提供商，你可能希望在关闭 Label Studio 后你的数据能够持久化。你可以 [导出你的数据](export.html) 以持久化你的标注任务数据和标注，但要保留 Label Studio 的状态以及你为标注上传的资源等资产，请设置数据持久化。

### 使用 Docker 持久化数据

挂载你机器上的 Docker 卷，以在终止运行 Label Studio 的 Docker 容器后持久化内部 SQLite 数据库和你上传到 Label Studio 的资产。

如果你从命令行启动 Docker 容器，请使用卷来持久化数据。请参阅 Docker 文档中的 [使用卷](https://docs.docker.com/storage/volumes/)。例如，将 Docker 命令中的现有卷标志替换为你指定的卷：
```bash
docker run -it -p 8080:8080 -v <yourvolume>:/label-studio/data heartexlabs/label-studio:latest
```

!!! attention "重要"
    由于这是一个非 root 容器，挂载的文件和目录必须具有 `UID 1001` 的正确权限。

如果你使用 [Label Studio 仓库中包含的配置](https://github.com/HumanSignal/label-studio/blob/develop/docker-compose.yml) 的 Docker Compose，你可以在 Label Studio 的 `docker-compose.yml` 文件中设置 Docker 卷：
```
version: "3.3"
services:
  label_studio:
    image: heartexlabs/label-studio:latest
    container_name: label_studio
    ports:
      - 8080:8080
    volumes:
      - ./mydata:/label-studio/data

volumes:
  mydata:
```

!!! attention "重要"
    由于这是一个非 root 容器，挂载的文件和目录必须具有 `UID 1001` 的正确权限。

有关在 Docker Compose 中指定卷的更多信息，请参阅 [Docker Compose 文件文档](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes) 的 volumes 部分。

### 使用云提供商持久化数据

托管一个你管理的 PostgreSQL 服务器，并使用 Label Studio 设置 PostgreSQL 环境变量，以从云提供商（如 Heroku、Amazon Web Services、Google Cloud Services 或 Microsoft Azure）持久化数据。
