---
title: Classify text with a BERT model
type: guide
tier: all
order: 35
hide_menu: true
hide_frontmatter_title: true
meta_title: BERT-based text classification
meta_description: Tutorial on how to use BERT-based text classification with your Label Studio project
categories:
    - Natural Language Processing
    - Text Classification
    - BERT
    - Hugging Face
image: "/guide/ml_tutorials/bert.png"
---

# 基于 BERT 的文本分类

NewModel 是一个基于 BERT 的文本分类模型，专为与 Label Studio 协同工作而设计。该模型使用 Hugging Face Transformers 库对 BERT 模型进行微调以用于文本分类。模型在 Label Studio 的标注数据上进行训练，然后用于对新数据进行预测。将此模型连接到 Label Studio 后，你可以：

- 直接在 Label Studio 中基于你的标注数据训练 BERT 模型。
- 使用 Hugging Face 模型中心里的任何用于 [AutoModelForSequenceClassification](https://huggingface.co/transformers/v3.0.2/model_doc/auto.html#automodelforsequenceclassification) 的模型。
- 针对你的特定任务对模型进行微调，并使用它对新数据进行预测。
- 自动从 Label Studio 下载已标注任务并为训练准备数据。
- 自定义训练参数，例如学习率、训练轮数和权重衰减。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`bert_classifier` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/bert_classifier)。

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

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **Model（模型）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。

> 警告！请注意 ML 后端的当前限制：模型是动态从 huggingface.co 加载的。你可能需要环境中提供 `HF_TOKEN` 环境变量。因此，第一次预测请求可能会有较慢的响应时间。如果你在 Label Studio 端遇到超时（即打开任务时看不到预测），请检查 ML 后端的日志中是否有任何错误，并在几分钟后刷新页面。

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

## 标注配置

在项目 `Settings > Labeling Interface > Browse Templates > Natural Language Processing > Text Classification（设置 > 标注界面 > 浏览模板 > 自然语言处理 > 文本分类）` 中，你可以找到 Label Studio 中文本分类的默认标注配置。此配置包含单个 `<Choices>` 输出和单个 `<Text>` 输入。
随意修改 `<Choices>` 标签中的标签集以匹配你的特定任务，例如：

```xml
<View>
  <Text name="text" value="$text" />
  <Choices name="label" toName="text" choice="single" showInLine="true">
    <Choice value="label one" />
    <Choice value="label two" />
      <Choice value="label three" />
  </Choices>
</View>
```

## 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。

提供以下常用参数：

- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量
- `BASELINE_MODEL_NAME`：用于训练的基线模型名称。默认值为 `bert-base-multilingual-cased`。

## 训练

以下参数可用于训练：

- `LABEL_STUDIO_HOST`（必填）：Label Studio 实例的 URL。默认值为 `http://localhost:8080`。
- `LABEL_STUDIO_API_KEY`（必填）：Label Studio 实例的 [API 密钥](https://labelstud.io/guide/user_account#Access-token)。
- `START_TRAINING_EACH_N_UPDATES`：在开始训练之前从 Label Studio 下载的已标注任务数量。默认值为 10。
- `LEARNING_RATE`：模型训练的学习率。默认值为 2e-5。
- `NUM_TRAIN_EPOCHS`：模型训练的训练轮数。默认值为 3。
- `WEIGHT_DECAY`：模型训练的权重衰减。默认值为 0.01。
- `FINETUNED_MODEL_NAME`：微调模型的名称。默认值为 `finetuned_model`。检查点将以该名称保存。

> 注意：`LABEL_STUDIO_API_KEY` 是训练模型所必需的。你可以在 Label Studio 的 [**账户与设置**页面](https://labelstud.io/guide/user_account#Access-token) 中找到 API 密钥。

# 自定义

可以通过在 `./bert_classifier` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
