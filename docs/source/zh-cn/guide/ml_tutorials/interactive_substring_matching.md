---
title: Interactive substring matching for NER tasks
type: guide
tier: all
order: 30
hide_menu: true
hide_frontmatter_title: true
meta_title: Interactive substring matching for NER tasks
meta_description: Use the interactive substring matching model for labeling NER tasks in Label Studio
categories:
    - Natural Language Processing
    - Named Entity Recognition
    - Interactive matching
image: "/guide/ml_tutorials/interactive-substring-matching.png"
---

# 交互式子串匹配

机器学习（ML）后端旨在提高命名实体识别（NER）任务中自动标注的效率。它通过选择一个关键词并自动在提供的文本中匹配相同的关键词来实现这一点。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`interactive_substring_matching` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/interactive_substring_matching)。

## 推荐的标注配置

此 ML 后端使用 Label Studio 默认的 NER 模板。你可以在配置标注界面时选择 Label Studio 预构建的 NER 模板来找到它。它位于 **自然语言处理 > 命名实体识别（Natural Language Processing > Named Entity Recognition）** 下。

以下是可与此外部 ML 后端一起使用的标注配置示例：

```xml
<View>
  <Labels name="label" toName="text">
    <Label value="ORG" background="orange" />
    <Label value="PER" background="lightgreen" />
    <Label value="LOC" background="lightblue" />
    <Label value="MISC" background="lightgray" />
  </Labels>
  <Text name="text" value="$text" />
</View>
```

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

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **模型（Model）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。


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
label-studio-ml start ./interactive_substring_matching
```

## 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。

提供以下常用参数：
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量

## 自定义

可以通过在 `./interactive_substring_matching` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
