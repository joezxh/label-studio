---
title: Transcribe text from images with EasyOCR
type: guide
tier: all
order: 40
hide_menu: true
hide_frontmatter_title: true
meta_title: EasyOCR model connection for transcribing text in images
meta_description: The EasyOCR model connection integrates the capabilities of EasyOCR with Label Studio to assist in machine learning labeling tasks involving Optical Character Recognition (OCR).
categories:
    - Computer Vision
    - Optical Character Recognition
    - EasyOCR
image: "/guide/ml_tutorials/easyocr.png"
---

# EasyOCR 模型连接

[EasyOCR](https://github.com/JaidedAI/EasyOCR) 模型连接是一个强大的工具，它将 EasyOCR 的功能与 Label Studio 集成。它旨在协助机器学习标注任务，特别是那些涉及光学字符识别（OCR）的任务。

此连接的主要功能是识别和提取图像中的文本，这可能是许多机器学习工作流程中的关键步骤。通过自动化此过程，EasyOCR 模型连接可以显著提高效率，减少手动提取文本所需的时间和精力。

在 Label Studio 的上下文中，此连接增强了平台的标注能力，允许用户为图像中的文本自动生成标签。这在数据标注、文档数字化等任务中特别有用。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`easyocr` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/easyocr)。

## 标注配置

EasyOCR 模型连接可以与 Label Studio 中用于 OCR 的默认标注配置一起使用。此配置通常涉及定义要使用的标签类型（例如文本、手写等）以及应应用这些标签的图像区域。

设置标注配置时，选择 **Computer Vision > Optical Character Recognition（计算机视觉 > 光学字符识别）**。此模板已针对 OCR 任务进行了预配置，并包含用于标注图像中文本的必要元素：

```xml
<View>
  <Image name="image" value="$image"/>

  <Labels name="label" toName="image">
    <Label value="Text" background="green"/>
    <Label value="Handwriting" background="blue"/>
  </Labels>

  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>

  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Recognized Text"
            displayMode="region-list"
            />
</View>
```

> 警告！请注意，当前版本的 EasyOCR 模型连接不支持直接上传到 Label Studio 的图像。它设计用于托管在公共互联网上的图像。因此，要使用此连接，你应确保你的图像可以通过 URL 公开访问。

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
label-studio-ml start ./easyocr
```

EasyOCR 模型连接提供了几个可以在 `docker-compose.yml` 文件中设置的配置选项：

- `BASIC_AUTH_USER`：指定模型服务器的基本认证用户。
- `BASIC_AUTH_PASS`：指定模型服务器的基本认证密码。
- `LOG_LEVEL`：设置模型服务器的日志级别。
- `WORKERS`：指定模型服务器的 worker 数量。
- `THREADS`：指定模型服务器的线程数量。
- `MODEL_DIR`：指定模型目录。
- `LANG_LIST`：指定 OCR 模型使用的语言列表，以逗号分隔（默认：`mn,en`）。
- `SCORE_THRESHOLD`：设置分数阈值以过滤掉噪声结果。
- `LABEL_MAPPINGS_FILE`：指定从 COCO 标签到自定义标签的映射文件。
- `DEVICE`：指定要使用的设备（cpu、cuda:0、cuda:1 等）。
- `HEIGHT_THS`：设置框高的最大差值。文本大小差异很大的框不应合并。
- `LABEL_STUDIO_ACCESS_TOKEN`：指定 Label Studio 访问令牌。
- `LABEL_STUDIO_HOST`：指定 Label Studio 主机。

这些选项允许你自定义 EasyOCR 模型连接的行为以满足你的特定需求。

# 自定义

可以通过在 `./easyocr` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
