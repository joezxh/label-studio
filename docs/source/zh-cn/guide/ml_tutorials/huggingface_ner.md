---
title: Hugging Face NER
type: guide
tier: all
order: 25
hide_menu: true
hide_frontmatter_title: true
meta_title: Label Studio tutorial to run Hugging Face NER backend
meta_description: This tutorial explains how to run a Hugging Face NER backend in Label Studio. 
categories:
    - Natural Language Processing
    - Named Entity Recognition
    - Hugging Face
image: "/guide/ml_tutorials/hf-ner.png"
---

# Label Studio 的 Hugging Face NER 模型

本项目使用自定义的机器学习后端模型，通过 Hugging Face 的 transformers 和 Label Studio 进行命名实体识别（NER）。

该模型从 Hugging Face 的 transformers 库实例化 `AutoModelForTokenClassification`，并在 NER 任务上对其进行微调。

- 如果你只想在推理模式下使用此模型，它会从预训练模型中提供预测。
- 如果你想微调模型，可以使用 Label Studio 界面提供训练数据并训练模型。

从 [Hugging Face 官方文档](https://huggingface.co/docs/transformers/en/tasks/token_classification) 阅读有关兼容模型的更多信息。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`huggingface_ner` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/huggingface_ner)。


## 标注配置

此 ML 后端使用 Label Studio 默认的 NER 模板。你可以在配置标注界面时选择 Label Studio 预构建的 NER 模板来找到它。它位于 **自然语言处理 > 命名实体识别（Natural Language Processing > Named Entity Recognition）** 下：

```xml
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>

  <Text name="text" value="$text"/>
</View>
```

然后你可以根据需要自定义模板（例如，修改标签名称）。但是，请注意模型的输出兼容性：

> 如果你打算仅将你的模型用于推理，请确保输出标签名称与 XML 标注配置中列出的名称兼容。如果你打算训练模型，则必须提供可以进行微调的基线预训练模型（即最后一层可以训练，例如 `distilbert/distilbert-base-uncased`）。否则，你可能会在训练期间看到有关张量大小不匹配的错误。

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
label-studio-ml start ./huggingface_ner
```

# 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。


提供以下常用参数：
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量
- `BASELINE_MODEL_NAME`：要使用的基线模型的名称。默认值为 `dslim/bert-base-NER`。
- `FINETUNED_MODEL_NAME`：微调模型的名称。默认值为 `finetuned_model`。
- `LABEL_STUDIO_HOST`：Label Studio 实例的主机。默认值为 'http://localhost:8080'。
- `LABEL_STUDIO_API_KEY`：Label Studio 实例的 API 密钥。
- `START_TRAINING_EACH_N_UPDATES`：在开始训练之前经过的更新次数。默认值为 `10`。
- `LEARNING_RATE`：模型的学习率。默认值为 `1e-3`。
- `NUM_TRAIN_EPOCHS`：训练轮数。默认值为 `10`。
- `WEIGHT_DECAY`：模型的权重衰减。默认值为 `0.01`。
- `MODEL_DIR`：模型存储的目录。默认值为 `'./results'`。

> 注意：`LABEL_STUDIO_API_KEY` 是训练模型所必需的。可以通过登录
  Label Studio 并 [转到 **账户与设置** 页面](https://labelstud.io/guide/user_account#Access-token) 找到它。

# 自定义

可以通过在 `./huggingface_ner/model.py` 中添加你自己的模型和逻辑来自定义 ML 后端。

修改 `predict()` 和 `fit()` 方法以实现你自己的逻辑。
