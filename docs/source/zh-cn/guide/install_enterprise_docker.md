---
title: 使用 Docker Compose 本地部署 Label Studio Enterprise
short: 使用 Docker 安装
type: guide
tier: enterprise
order: 0
order_enterprise: 75
meta_title: 使用 Docker 本地部署 Label Studio Enterprise
meta_description: 使用 Docker 安装、备份和升级 Label Studio Enterprise，以在本地创建机器学习和数据科学项目。
section: "安装与设置"
parent_enterprise: "install_enterprise"
---

如果你需要满足严格的隐私法规、法律要求，或者希望使用 Docker 或公有云在自己的基础设施上管理自定义安装，请在本地部署 Label Studio Enterprise。如果你想使用不同的安装方法：
- 你可以使用 Kubernetes 和 Helm 在云中部署 Label Studio Enterprise。请参阅 [使用 Kubernetes 部署 Label Studio Enterprise](install_enterprise_k8s.html)。
- 你可以在气隙环境中运行 Label Studio Enterprise，数据不会离开你的基础设施。请参阅 [在没有公网访问的情况下安装 Label Studio Enterprise](install_k8s_airgapped)。

有关 Label Studio Enterprise 的安全性和加固的更多详细信息，请参阅 [保护 Label Studio](security.html)。

!!! note
    Docker 部署更适用于概念验证构建和小型项目。对于生产环境和更大型的部署，我们强烈建议使用 Kubernetes。Kubernetes 部署提供更好的可扩展性、可靠性以及对高级功能（如 Prompts）的访问。有关更多信息，请参阅 [使用 Kubernetes 部署 Label Studio Enterprise](install_enterprise_k8s.html)。

要安装 Label Studio 社区版，请参阅 [安装 Label Studio](https://labelstud.io/guide/install)。本页专门针对 Label Studio 的企业版。

!!! note
    Label Studio Enterprise 的本地部署不支持学术许可证。  

{% insertmd zh-cn/includes/deploy.md %}

## 使用 Docker 安装 Label Studio Enterprise

1. 登录 Docker 仓库。
2. 添加许可证文件。
3. 使用 Docker Compose 启动服务器。

### 先决条件

确保你拥有用于检索 Docker 镜像的授权令牌和当前的许可证文件。如果你是 Label Studio Enterprise 客户但没有访问权限，请[发送邮件给支持团队](mailto:support@humansignal.com) 或通过我们的[支持门户](https://support.humansignal.com/) 提交工单，以获取授权令牌和你的许可证文件副本。

确保你的系统上安装了 [Docker Compose](https://docs.docker.com/compose/install/)。

安装 Label Studio Enterprise 后，应用会自动连接到以下正在运行的服务：
- PostgresSQL（版本 >=13）
- Redis（版本 >=6.0）

### 登录 Docker 仓库

你必须获得访问 Label Studio Enterprise 镜像的授权。 

设置 Docker 登录以检索最新的 Docker 镜像：
```bash
docker login --username heartexlabs
```
当提示输入密码时，请输入令牌。如果登录成功，将创建带有授权设置的 `~/.docker/config.json` 文件。  

!!! note 
    如果在登录 Docker 时指定了默认仓库，你可能需要显式指定仓库：`docker login --username heartexlabs docker.io`。

### 添加许可证文件 

检索最新的 Label Studio Enterprise 镜像后，添加许可证文件。没有许可证文件，你无法启动 Docker 镜像。 

1. 创建一个名为 `label-studio-enterprise` 的工作目录并将许可证文件放在其中。
```bash
mkdir -p label-studio-enterprise
cd label-studio-enterprise
```
2. 将许可证文件 `license.txt` 移动到 `label-studio-enterprise` 目录。

### 使用 Docker Compose 启动

要在生产环境中运行 Label Studio Enterprise，请使用 [Docker compose](https://docs.docker.com/compose/) 启动它。此配置允许你将 Label Studio 连接到外部数据库和服务。

1. 创建包含所需环境变量的文件 `label-studio-enterprise/env.list`：
```
# 指定许可证文件的路径。 
LICENSE=/label-studio-enterprise/license.txt

# 指定 FQDN 名称，如果与 80 不同则包含端口
LABEL_STUDIO_HOST=http://localhost/

# 数据库引擎（默认 PostgreSQL）
DJANGO_DB=default

# 默认配置
DJANGO_SETTINGS_MODULE=htx.settings.label_studio

# PostgreSQL 数据库名称
POSTGRE_NAME=postgres

# PostgreSQL 数据库用户
POSTGRE_USER=postgres

# PostgreSQL 数据库密码
POSTGRE_PASSWORD=

# PostgreSQL 数据库主机
POSTGRE_HOST=db

# PostgreSQL 数据库端口
POSTGRE_PORT=5432

# 可选：PostgreSQL SSL 模式
# POSTGRE_SSL_MODE=require

# 可选：指定 Postgre SSL 证书
# POSTGRE_SSLROOTCERT=postgre-ca-bundle.pem

# 可选：客户端证书和密钥
# POSTGRE_SSLCERT=client.crt
# POSTGRE_SSLKEY=client.key

# Redis 位置，例如 redis[s]://[:password]@localhost:6379/1
# 要使用 SSL，rediss:// 方案是必需的  
REDIS_LOCATION=redis://redis:6379/1

# 可选：Redis 数据库
# REDIS_DB=1

# 可选：Redis 密码
# REDIS_PASSWORD=12345

# 可选：Redis 套接字超时
# REDIS_SOCKET_TIMEOUT=3600

# 可选：要求证书
# REDIS_SSL_CERTS_REQS=required

# 可选：指定 Redis SSL 证书
# REDIS_SSL_CA_CERTS=redis-ca-bundle.pem

# 可选：客户端证书和密钥
# REDIS_SSL_CERTFILE=client.crt
# REDIS_SSL_KEYFILE=client.key

# 可选：指定 SSL 终止证书和密钥
# 文件应放在与 docker-compose.yml 文件相同目录的 "certs" 目录中
# NGINX_SSL_CERT=/certs/cert.pem
# NGINX_SSL_CERT_KEY=/certs/cert.key
```

2. 设置所有环境变量后，创建以下 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  nginx:
    image: heartexlabs/label-studio-enterprise:VERSION
    ports:
      - "80:8085"
      - "443:8086"
    depends_on:
      - app
    restart: on-failure
    env_file:
      - env.list
    command: nginx
    volumes:
      - ./certs:/certs:ro
    working_dir: /label-studio-enterprise

  app:
    image: heartexlabs/label-studio-enterprise:VERSION
    restart: on-failure
    env_file:
      - env.list
    command: label-studio-uwsgi
    volumes:
      - ./mydata:/label-studio/data:rw
      - ./license.txt:/label-studio-enterprise/license.txt:ro
    working_dir: /label-studio-enterprise

  rqworkers_low:
    image: heartexlabs/label-studio-enterprise:VERSION
    depends_on:
      - app
    env_file:
      - env.list
    volumes:
      - ./mydata:/label-studio/data:rw
      - ./license.txt:/label-studio-enterprise/license.txt:ro
    working_dir: /label-studio-enterprise
    command: [ "python3", "/label-studio-enterprise/label_studio_enterprise/manage.py", "rqworker", "--with-scheduler", "low" ]

  rqworkers_default:
    image: heartexlabs/label-studio-enterprise:VERSION
    depends_on:
      - app
    env_file:
      - env.list
    volumes:
      - ./mydata:/label-studio/data:rw
      - ./license.txt:/label-studio-enterprise/license.txt:ro
    working_dir: /label-studio-enterprise
    command: [ "python3", "/label-studio-enterprise/label_studio_enterprise/manage.py", "rqworker", "--with-scheduler", "default" ]

  rqworkers_high:
    image: heartexlabs/label-studio-enterprise:VERSION
    depends_on:
      - app
    env_file:
      - env.list
    volumes:
      - ./mydata:/label-studio/data:rw
      - ./license.txt:/label-studio-enterprise/license.txt:ro
    working_dir: /label-studio-enterprise
    command: [ "python3", "/label-studio-enterprise/label_studio_enterprise/manage.py", "rqworker", "--with-scheduler", "high"]

  rqworkers_critical:
    image: heartexlabs/label-studio-enterprise:VERSION
    depends_on:
      - app
    env_file:
      - env.list
    volumes:
      - ./mydata:/label-studio/data:rw
      - ./license.txt:/label-studio-enterprise/license.txt:ro
    working_dir: /label-studio-enterprise
    command: [ "python3", "/label-studio-enterprise/label_studio_enterprise/manage.py", "rqworker", "--with-scheduler", "critical" ]
```

3. 运行 Docker Compose：

```bash
docker-compose up
```

!!! note 
    如果你暴露端口 80，必须使用 `sudo` 启动 Docker。

### 获取 Docker 镜像版本

要检查 Label Studio Enterprise Docker 镜像的版本，请使用主机上的 [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/) 命令。 

从命令行以 root 身份或使用 `sudo` 运行以下命令并查看输出：
```bash
$ docker ps
03b88eebdb65   heartexlabs/label-studio-enterprise:2.2.8-1   "uwsgi --ini deploy/…"   36 hours ago   Up 36 hours   0.0.0.0:80->8000/tcp   label-studio-enterprise_app_1
```
在此示例输出中，镜像列显示 Docker 镜像和版本号。镜像 `heartexlabs/label-studio-enterprise:2.2.8-1` 使用的版本是 `2.2.8-1`。
