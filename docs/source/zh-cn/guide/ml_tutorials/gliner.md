---
title: Use GLiNER for NER annotation
type: guide
tier: all
order: 37
hide_menu: true
hide_frontmatter_title: true
meta_title: Use GLiNER for NER annotation
meta_description: Tutorial on how to use GLiNER with your Label Studio project to complete NER tasks
categories:
    - Natural Language Processing
    - Named Entity Recognition
    - GLiNER
    - BERT
    - Hugging Face
image: "/guide/ml_tutorials/gliner.png"
---

# 使用 GLiNER 进行 NER 标注

GLiNER 模型是一个用于通用 NER 的 BERT 系列模型。我们从 HuggingFace 下载该模型，但原始模型可在 [GitHub](https://github.com/urchade/GLiNER) 上获取。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`gliner` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/gliner)。

## 使用 Docker 运行（推荐）

1. 使用预构建镜像在 `http://localhost:9090` 上启动机器学习后端：

```bash
docker-compose up
```

2. 验证后端是否正在运行

```bash
$ curl http://localhost:9090/
{"status":"UP"}
```

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **Model（模型）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。

## 从源代码构建（高级）

要从源代码构建 ML 后端，你必须克隆仓库并构建 Docker 镜像：

```bash
docker-compose build
```

## 不使用 Docker 运行（高级）

要在不使用 Docker 的情况下运行 ML 后端，你必须克隆仓库并使用 pip 安装所有依赖项：

```bash
python -m venv ml-backend
source ml-backend/bin/activate
pip install -r requirements.txt
```

然后你可以启动 ML 后端：

```bash
label-studio-ml start ./dir_with_your_model
```

## 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。

提供以下常用参数：
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户。
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码。
- `LOG_LEVEL` - 设置模型服务器的日志级别。
- `WORKERS` - 指定模型服务器的 worker 数量。
- `THREADS` - 指定模型服务器的线程数量。
- `LABEL_STUDIO_URL` - 指定你的 Label Studio 实例的 URL。请注意，如果你在另一个 Docker 容器上运行 Label Studio，这可能需要是 `http://host.docker.internal:8080`。
- `LABEL_STUDIO_API_KEY`- 指定用于对你的 Label Studio 实例进行身份验证的 API 密钥。你可以通过登录 Label Studio 并 [转到 **账户与设置**页面](https://labelstud.io/guide/user_account#Access-token) 来找到它。
