---
title: 启动 Label Studio
type: guide
tier: opensource
order: 93
order_enterprise: 0
meta_title: Label Studio 的启动命令
meta_description: 关于启动 Label Studio 以及配置环境以将 Label Studio 用于你的机器学习或数据科学项目的文档。
section: "安装与配置"
---

安装 Label Studio 后，启动服务器以开始使用。

```bash
label-studio start
```

默认情况下，Label Studio 使用 SQLite 数据库来启动，以存储标注任务和标注结果。你可以使用 Label Studio UI 或 API 为标注任务和标注结果指定不同的源存储和靶标存储。有关更多信息，请参阅[数据库存储](storedata.html)。

## 启动 Label Studio 的命令行参数

你可以使用命令行界面指定机器学习后端和其他选项。运行 `label-studio --help` 以查看所有可用选项，或参考以下表格。

Label Studio 提供一些可用命令来获取信息或启动 Label Studio 服务器：

| 命令 | 说明 |
| --- | ---- |
| `label-studio` | 启动 Label Studio 服务器。 |
| `label-studio -h` `label-studio --help` | 显示可用的命令行参数。 |
| `label-studio init <project_name> <optional_arguments>` | 在 Label Studio 中初始化特定项目。 |
| `label-studio start <project_name> --init <optional_arguments>` | 启动 Label Studio 服务器并初始化特定项目。 |
| `label-studio reset_password` | 重置特定 Label Studio 用户名的密码。请参阅[为 Label Studio 创建用户账户](signup.html)。 |
| `label-studio shell` | 获取 Label Studio 的 shell 以直接操作数据。请参阅 Django [shell-plus 命令](https://django-extensions.readthedocs.io/en/latest/shell_plus.html) 的文档。 |
| `label-studio version` | 显示 Label Studio 的版本，然后终止。 |
| `label-studio user --username <email>` | 显示带有令牌的用户信息。 |

以下命令行参数为可选参数，必须与 `label-studio start <argument> <value>` 一起指定，或在你设置用于托管 Label Studio 的环境时作为环境变量指定：

| 命令行参数 | 环境变量 | 默认值 | 说明 |
| --- | ---- | --- | ---- |
| `-b`, `--no-browser` | N/A | `False` | 启动 Label Studio 时不自动打开 Web 浏览器。 |
| `-db` `--database` | `LABEL_STUDIO_DATABASE` | `label_studio.sqlite3` | 指定用于存储标注任务和标注结果的数据库文件路径。请参阅[数据库存储](install.html#Database_storage)。 |
| `--data-dir` | `LABEL_STUDIO_BASE_DATA_DIR` | 因操作系统而异 | 用于存储所有应用程序相关数据的目录。 |
| `-d` `--debug` | N/A | `False` | 启用调试模式以排查 Label Studio 问题。 |
| `-c` `--config` | `CONFIG_PATH` | `default_config.json` | 已弃用，请勿使用。指定 Label Studio 的服务器配置路径。 |
| `-l` `--label-config` | `LABEL_STUDIO_LABEL_CONFIG` | `None` | 特定 Label Studio 项目的标签配置文件路径。请参阅[设置你的标注项目](setup.html)。 |
| `--ml-backends` | N/A | `None` | 命令行参数已弃用。指定一个或多个机器学习后端的 URL。请参阅[为你的标注流程设置机器学习](ml.html)。 |
| `--sampling` | N/A | `sequential` | 指定 sequential（顺序）或 uniform（均匀）之一，以定义标注任务的顺序。请参阅本页的[为你的项目设置任务采样](start.html#Set_up_task_sampling_for_your_project)。 |
| `--log-level` | N/A | `ERROR` | DEBUG、INFO、WARNING 或 ERROR 之一。用于指定 Label Studio 服务器的日志级别。 |
| `-p` `--port` | `LABEL_STUDIO_PORT` | `8080` | 指定 Label Studio 的 Web 服务器端口。默认为 8080。请参阅本页的[在本地主机上使用不同端口运行 Label Studio](start.html#Run-Label-Studio-on-localhost-with-a-different-port)。 |
| `--host` | `LABEL_STUDIO_HOST` | `''` | 指定用于为导入的标注任务或静态加载需求生成链接的主机名。留空可使所有路径相对于根域名。例如，指定 `"https://77.42.77.42:1234"` 或 `"http://ls.example.com/subdomain/"`。请参阅本页的[使用外部域名运行 Label Studio](start.html#Run-Label-Studio-with-an-external-domain-name)。 |
| `--cert` | `LABEL_STUDIO_CERT_FILE` | `None` | 已弃用，请勿使用。用于通过 HTTPS 访问 Label Studio 的证书文件。必须为 PEM 格式。请参阅本页的[使用 HTTPS 运行 Label Studio](start.html#Run-Label-Studio-with-HTTPS)。 |
| `--key` | `LABEL_STUDIO_KEY_FILE` | `None` | 已弃用，请勿使用。HTTPS 连接的私钥文件。必须为 PEM 格式。请参阅本页的[使用 HTTPS 运行 Label Studio](start.html#Run-Label-Studio-with-HTTPS)。 |
| `--initial-project-description` | `LABEL_STUDIO_PROJECT_DESC` | `''` | 指定 Label Studio 项目的项目描述。请参阅[设置你的标注项目](setup.html)。 |
| `--password` | `LABEL_STUDIO_PASSWORD` | `None` | 默认用户使用的密码。请参阅[设置用户账户](signup.html)。 |
| `--username` | `LABEL_STUDIO_USERNAME` | `default_user@localhost` | 默认用户使用的用户名。请参阅[设置用户账户](signup.html)。 |
| `--user-token` |  `LABEL_STUDIO_USER_TOKEN` | 自动生成。 | 用户用于 API 的身份验证令牌。必须与用户名一起设置，否则会自动生成。请参阅[设置用户账户](signup.html)。 |
| `--agree-fix-sqlite` | N/A | `False` | 在 Windows 操作系统上使用 Python 3.6–3.8 时，自动同意让 Label Studio 修复 SQLite 问题。 |
| `--enable-legacy-api-token` | `LABEL_STUDIO_ENABLE_LEGACY_API_TOKEN` | `False` | 启用旧版 API 令牌身份验证。便于通过 `--user-token` 使用预先存在的令牌运行。 |
| N/A | `LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED` | `False` | 允许 Label Studio 访问本地文件目录以导入存储。请参阅[在 Docker 上运行 Label Studio 并使用本地存储](start.html#Run_Label_Studio_on_Docker_and_use_local_storage)。 |
| N/A | `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` | `/` | 指定 Label Studio 访问本地文件目录时使用的根目录。请参阅[在 Docker 上运行 Label Studio 并使用本地存储](start.html#Run_Label_Studio_on_Docker_and_use_local_storage)。 |

### 设置环境变量

设置环境变量的方式取决于操作系统以及部署 Label Studio 的环境。

在 *nix 操作系统中，你可以从命令行或使用环境设置文件来设置环境变量。例如：
```bash
export LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true
```

!!! note
    如果你使用的是 Docker，可以将所有[环境变量写入 `.env`](https://docs.docker.com/compose/env-file/) 文件。

在 Windows 上，你可以使用以下语法：
```bash
set LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true
```

要检查你是否成功设置了环境变量，请在 *nix 操作系统上运行以下命令：
```bash
echo $LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED
```

或在 Windows 操作系统上运行以下命令：
```bash
echo %LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED%
```

## 在本地主机上使用不同端口运行 Label Studio

默认情况下，Label Studio 在端口 8080 上运行。如果该端口已被占用，或者你想指定不同的端口，请使用以下命令启动 Label Studio：
```bash
label-studio start --port <port>
```

例如，在端口 9001 上启动 Label Studio：
```bash
label-studio start --port 9001
```

或者，设置以下环境变量：
```
LABEL_STUDIO_PORT = 9001
```

## 在 Docker 上使用不同端口运行 Label Studio

要在 Docker 上使用 8080 以外的端口运行 Label Studio，请在启动 Docker 上的 Label Studio 时使用端口参数。例如，要在可通过端口 9001 访问的 Docker 容器中启动 Label Studio，请运行以下命令：
```bash
docker run -it -p 9001:8080 -v $(pwd)/mydata:/label-studio/data heartexlabs/label-studio:latest label-studio
```

!!! attention "important"
    由于这是一个非 root 容器，挂载的文件和目录必须具有 `UID 1001` 的适当权限。

或者，如果你使用的是 Docker Compose，请更新你正在使用的 `docker-compose.yml` 文件，以暴露用于代理连接到 Label Studio 的 NGINX 服务器的不同端口。例如，[`docker-compose.yml`](https://github.com/HumanSignal/label-studio/blob/develop/docker-compose.yml) 文件的这部分内容将代理 Label Studio 的端口从 80 暴露为 9001：
```
...
nginx:
    image: nginx:latest
    ports:
      - 9001:80
    depends_on:
      - app
...
```

## 在 Docker 上以主机和子路径运行 Label Studio

要在 Docker 上以主机和子路径运行 Label Studio，只需将 `LABEL_STUDIO_HOST` 环境变量（带子路径）传递给 docker/docker-compose：
```
LABEL_STUDIO_HOST=http://localhost:8080/foo docker-compose up -d
```

## 使用 ngrok 将本地 Label Studio 实例暴露到外部

有时，让你在本地机器上运行的 LabelStudio 实例能够通过互联网访问是很有用的。例如，如果你想与团队成员或客户共享你的 Label Studio 实例。

一种方法是使用 [ngrok](https://ngrok.io/)，这是一个反向代理，允许你将实例暴露到互联网。

1. 如果你正在运行 Label Studio，请停止它（`Ctrl+C`）。
2. 在 [ngrok.com](https://dashboard.ngrok.com/signup) 注册一个免费的 ngrok 账户。
3. 当你登录 ngrok 账户时，会打开[一个带有安装和认证说明的仪表板](https://dashboard.ngrok.com/get-started/setup)。完成这两个步骤：

    ![Ngrok 认证](images/install/ngrok-dashboard.png)

4. 启动 ngrok 并将其指向 Label Studio：

    ```bash
    ngrok http --host-header=rewrite 8080
    ```
5. 这将输出一个随机生成的 URL。复制此 URL：

    ![Ngrok URL](images/install/ngrok-url.png)

5. 运行以下命令（将 `your-subdomain.ngrok-free.app` 替换为你在第 5 步中复制的实际 ngrok URL）：

<div class="code-tabs">
<div data-name="Native - Mac/Unix">

```bash
# 避免 CSRF 错误
# 必须完全匹配 ngrok HTTPS URL，不带结尾斜杠
export CSRF_TRUSTED_ORIGINS=https://your-subdomain.ngrok-free.app
# 启动 Label Studio
LABEL_STUDIO_HOST=https://your-subdomain.ngrok-free.app label-studio start
```
</div>

<div data-name="Native - Windows">

```bash
# 避免 CSRF 错误
# 必须完全匹配 ngrok HTTPS URL，不带结尾斜杠
set CSRF_TRUSTED_ORIGINS=https://your-subdomain.ngrok-free.app
# 启动 Label Studio
LABEL_STUDIO_HOST=https://your-subdomain.ngrok-free.app label-studio start
```
</div>

<div data-name="Docker Container">

```bash
# 避免 CSRF 错误
# 必须完全匹配 ngrok HTTPS URL，不带结尾斜杠
docker run -it -p 8080:8080 \
-e CSRF_TRUSTED_ORIGINS=https://your-subdomain.ngrok-free.app \
-e LABEL_STUDIO_HOST=https://your-subdomain.ngrok-free.app \
-v <yourvolume>:/label-studio/data \
heartexlabs/label-studio:latest
```
<div class="admonition attention"><p class="admonition-title">important</p>
<p>由于这是一个非 root 容器，挂载的文件和目录必须具有 <code>UID 1001</code> 的适当权限。</p>
</div>

</div>

<div data-name="Docker Compose">

```bash
# 避免 CSRF 错误
# 必须完全匹配 ngrok HTTPS URL，不带结尾斜杠
CSRF_TRUSTED_ORIGINS=https://your-subdomain.ngrok-free.app \
LABEL_STUDIO_HOST=https://your-subdomain.ngrok-free.app docker compose up -d
```
</div>
</div>

现在你可以在浏览器中打开 ngrok URL，以确认你看到了自己的 Label Studio 实例。

## 在 Docker 上运行 Label Studio 并使用本地存储

要在 Docker 上运行 Label Studio 并引用持久的本地存储目录，请在启动 Label Studio 时将这些目录挂载为卷，并指定你需要的任何环境变量。

以下命令使用最新镜像在端口 8080 上启动一个 Docker 容器，并带有一个允许 Label Studio 访问本地文件的环境变量。在此示例中，本地目录 `./myfiles` 被挂载到 `/label-studio/files` 位置。
```bash
docker run -it -p 8080:8080 -v $(pwd)/mydata:/label-studio/data \
--env LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true \
--env LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=/label-studio/files \
-v $(pwd)/myfiles:/label-studio/files \
heartexlabs/label-studio:latest label-studio
```

!!! attention "important"
    由于这是一个非 root 容器，挂载的文件和目录必须具有 `UID 1001` 的适当权限。

通过指定环境变量 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=/label-studio/files`，Label Studio 仅扫描此目录以查找本地文件。强烈建议显式指定 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 路径，以保护从 Docker 容器到你本地机器的卷访问。

将文件放入指定的源目录（本示例中为 `./myfiles`），并在设置[本地存储](storage.html#Local_storage) 时引用该目录。有关在 Docker 中使用卷挂载的更多信息，请参阅 [Docker 关于卷的文档](https://docs.docker.com/storage/volumes/)。

如果你使用的是 Docker Compose，请在 Docker Compose YAML 文件中指定卷，并将相关的环境变量添加到 app 容器。有关在 Docker Compose 中指定卷的更多信息，请参阅 [Docker Compose 文件文档](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes) 的 volumes 部分。

## 使用 HTTPS 运行 Label Studio

要使用 HTTPS 运行 Label Studio 并在浏览器中通过 HTTPS 访问 Web 服务器，请使用 NGINX 或其他 Web 服务器来为 Label Studio 运行 HTTPS。

## 在云端使用 Heroku 运行 Label Studio

要在云端使用 Heroku 运行 Label Studio，请指定一个环境变量以便 Label Studio 加载。

```
LABEL_STUDIO_HOST
```

如果需要，你可以为 Label Studio 指定不同的主机名，但这不是必需的。

要在 Heroku 上运行 Label Studio 并使用 PostgreSQL 作为[数据库存储](storedata.html)，请将所需的 PostgreSQL 环境变量指定为 Heroku 环境变量 `DATABASE_URL` 的一部分。例如，要指定托管在 Amazon 上的 PostgreSQL 数据库：
```
DATABASE_URL = postgres://username:password@hostname.compute.amazonaws.com:5432/dbname
```
然后，你可以将 PostgreSQL 连接所需的环境变量指定为配置变量。请参阅[数据库存储](storedata.html)。

我们的 Heroku manifest 开箱即用地使用了 [postgresql addon](https://elements.heroku.com/addons/heroku-postgresql)。
请注意，存储容量是有限的。

[<img src="https://www.herokucdn.com/deploy/button.svg" height="30px">](https://heroku.com/deploy?template=https://github.com/HumanSignal/label-studio/tree/master)

请注意，由于[文件系统是临时的](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem)，在 dyno 替换后，通过导入上传的所有数据都会丢失。
建议使用 S3 存储。

## 使用外部域名运行 Label Studio

如果你想让多个人在一个项目上协作，你可能希望使用外部域名运行 Label Studio。

要这样做，请在启动 Label Studio 时使用 `host` 参数。这些参数确保在使用 `host` 参数时，在导入资源文件（图像、音频等）和生成标注任务时创建正确的 URL。

有几种可能的方式可以使用外部域名运行 Label Studio：

- 替换你使用 `--config` 选项指定的文件中的 `host` 参数。如果你不使用 `--config`，则编辑 Label Studio 包目录中的 `label_studio/utils/schema/default_config.json`。
- 在启动 Label Studio 时指定参数：`label-studio start --host http://your.domain.com/ls-root`。
- 将参数指定为环境变量 `HOST`，尤其是在设置 Docker 时：`HOST=https://your.domain.com:7777`。

或者，你可以使用环境变量：
```
LABEL_STUDIO_HOST = https://subdomain.example.com:7777
```

你必须指定域名的协议：`http://` 或 `https://`

如果你的外部主机有端口，请将端口作为主机名的一部分指定。

## 为你的项目设置任务采样

当你启动 Label Studio 时，可以控制任务展示给标注人员的顺序。

例如，要创建一个对标注人员使用顺序任务排序的项目：
```bash
label-studio start <project_name> --sampling sequential
```

下表列出了可用的采样选项：

| 选项 | 说明 |
| --- | --- |
| sequential（顺序） | 默认值。任务按 `id` 字段升序展示给标注人员。 |
| uniform（均匀） | 任务以相等的概率被采样。 |
| prediction-score-min | 将平均预测得分最低的任务展示给标注人员。要使用此选项，你还必须在导入 Label Studio 的任务数据中包含预测数据。 |

你也可以使用 API 为特定项目设置采样。向 `/api/projects/<project_id>` 端点发送 PATCH 请求，以为指定项目设置采样。请参阅[项目的 API 参考](/api#operation/projects_partial_update)。

单个标注人员也可以通过调整 Label Studio UI 中标注任务的筛选和排序来控制其标注任务的顺序。请参阅[设置你的标注项目](setup.html)。
