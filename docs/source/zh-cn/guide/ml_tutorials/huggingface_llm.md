---
title: Hugging Face Large Language Model (LLM)
type: guide
tier: all
order: 20
hide_menu: true
hide_frontmatter_title: true
meta_title: Label Studio tutorial to run Hugging Face Large Language Model backend
meta_description: This tutorial explains how to run Hugging Face Large Language model backend in Label Studio. Hugging Face Large Language Model Backend is a machine learning backend designed to work with Label Studio, providing a custom model for text generation.
categories:
    - Generative AI
    - Large Language Model
    - Text Generation
    - Hugging Face
image: "/guide/ml_tutorials/hf-llm.png"
---

# Hugging Face 大语言模型（LLM）后端

此机器学习后端旨在与 Label Studio 协同工作，为文本生成提供自定义模型。该模型基于 Hugging Face 的 transformers 库，并使用预训练模型。

查看 Hugging Face 上的 [文本生成流水线](https://huggingface.co/tasks/text-generation) 以了解更多详细信息。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`huggingface_llm` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/huggingface_llm)。

## Label Studio XML 标注配置

此 ML 后端兼容使用 `<TextArea>` 标签的 Label Studio 标注配置。以下是一个兼容的标注配置示例：

```xml
<View>
    <Text name="input_text" value="$text"/>
  <TextArea name="generated_text"  toName="input_text"/>
</View>
```

当你在 Label Studio 中打开任务时，文本框将显示基于 `<Text>` 中定义的提示生成的文本。请务必在提示中包含一些指令（例如 _"Summarize the following text: ..."_ 即"总结以下文本：……"），以查看有意义的结果。

## 使用 Docker 运行（推荐）

1. 使用预构建镜像在 `http://localhost:9090` 上启动机器学习后端：

```bash
docker-compose up
```

2. 验证后端是否正在运行：

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
label-studio-ml start ./huggingface_llm
```

# 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。

提供以下常用参数：
- `MODEL_NAME`：用于文本生成的预训练模型的名称。默认值为 `facebook/opt-125m`。
- `MAX_LENGTH`：生成文本的最大长度。默认值为 `50`。
- `BASIC_AUTH_USER`：模型服务器的基本认证用户。
- `BASIC_AUTH_PASS`：模型服务器的基本认证密码。
- `LOG_LEVEL`：模型服务器的日志级别。
- `WORKERS`：模型服务器的 worker 数量。
- `THREADS`：模型服务器的线程数量。

# 自定义

可以通过在 `./huggingface_llm` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
