---
title: Sklearn Text Classifier model
type: guide
tier: all
order: 50
hide_menu: true
hide_frontmatter_title: true
meta_title: Sklearn Text Classifier model for Label Studio
meta_description: Tutorial on how to use an example ML backend for Label Studio with Scikit-learn logistic regression
categories:
    - Natural Language Processing
    - Text Classification
    - Scikit-learn
image: "/guide/ml_tutorials/scikit-learn.png"
---

# Label Studio 的 Sklearn 文本分类器模型

Sklearn 文本分类器模型是 Label Studio 的自定义机器学习后端。它使用 [Scikit-learn](https://scikit-learn.org/) 库中的 [逻辑回归模型](https://scikit-learn.org/) 对文本数据进行分类。该模型对于 Label Studio 中的文本分类任务特别有用，提供了一种基于模型预测生成预标注的高效方法。

该模型在从 Label Studio 收集的已标注文本上进行训练，并使用 Label Studio API 获取已标注的任务用于训练。这种与 Label Studio 的集成实现了无缝高效的标注工作流，因为随着新的标注数据变得可用，模型可以重新训练和更新。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`sklearn_text_classifier` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/sklearn_text_classifier)。

## 标注配置

Sklearn 文本分类器模型设计用于与 Label Studio 中文本分类的默认标注配置一起工作。此配置包含单个 `<Choices>` 输出和单个 `<Text>` 输入。该模型从标注配置中检索这些标签的第一次出现，并将其用于其预测：

```xml
<View>
  <Text name="text" value="$text" />
  <Choices name="label" toName="text" choice="single" showInLine="true">
    <Choice value="positive" />
    <Choice value="negative" />
  </Choices>
</View>
```

> 请注意，你必须指定 `LABEL_STUDIO_HOST` 和 `LABEL_STUDIO_API_KEY` 环境变量，以便下载用于训练模型的示例。这些变量应分别指向你的 Label Studio 实例及其 API 密钥。有关查找你的 Label Studio API 密钥的更多信息，[请参阅我们的文档](https://labelstud.io/guide/user_account#Access-token)。

对于训练，你必须标注至少 2 个具有不同标签的示例。

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
label-studio-ml start ./dir_with_your_model
```

# 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。

提供以下常用参数：

- `LOGISTIC_REGRESSION_C`：这是逻辑回归的逆正则化强度。它是一个浮点值，可以通过环境变量 "LOGISTIC_REGRESSION_C" 设置。如果未设置，则默认为 `10`。
- `LABEL_STUDIO_HOST`：这是 Label Studio 的主机 URL，用于训练。可以通过环境变量 "LABEL_STUDIO_HOST" 设置。如果未设置，则默认为 `http://localhost:8080`。
- `LABEL_STUDIO_API_KEY`：这是 Label Studio 的 API 密钥，用于训练。可以通过环境变量 "LABEL_STUDIO_API_KEY" 设置。没有默认值，因此必须设置。
- `START_TRAINING_EACH_N_UPDATES`：这是开始训练后经过的更新次数。它是一个整数值，可以通过环境变量 "START_TRAINING_EACH_N_UPDATES" 设置。如果未设置，则默认为 `10`。
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量

# 自定义

可以通过在 `./dir_with_your_model` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
