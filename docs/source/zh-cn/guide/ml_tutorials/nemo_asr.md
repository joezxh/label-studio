---
title: Automatic Speech Recognition with NVidia NeMo
type: guide
tier: all
order: 60
hide_menu: true
hide_frontmatter_title: true
meta_title: Automatic Speech Recognition with NeMo
meta_description: Tutorial on how to use set up Nvidia NeMo to use for ASR tasks in Label Studio
categories:
    - Audio/Speech Processing
    - Automatic Speech Recognition
    - NeMo
    - NVidia
image: "/guide/ml_tutorials/nvidia.png"
---

# 使用 NeMo 进行 ASR（自动语音识别）

此示例演示了如何使用 [NeMo](https://github.com/NVIDIA/NeMo/blob/main/nemo/collections/asr/README.md) 在 Label Studio 中执行 ASR（自动语音识别）。

如果你想要转写并修正你的音频数据，请使用此模型。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`nemo_asr` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/nemo_asr)。

## 标注界面

此示例与 Label Studio 预构建的 **音频转写（Audio Transcription）** 模板（位于 **音频处理 > 音频转写（Audio Processing > Audio Transcription）** 下）一起使用。

```xml
<View>
  <Audio name="audio" value="$audio" zoom="true" hotkey="ctrl+enter" />
  <Header value="Provide Transcription" />
  <TextArea name="transcription" toName="audio"
            rows="4" editable="true" maxSubmissions="1" />
</View>
```

但你可以使用任何其他结合了 `<Audio>` 和 `<TextArea>` 元素的标注界面。

> 警告：如果你使用托管在 Label Studio 中的文件（意味着它们是使用导入操作添加的）、托管在云存储中，或通过本地存储连接的文件，那么你必须向 ML 后端提供 `LABEL_STUDIO_URL` 和 `LABEL_STUDIO_API_KEY` 环境变量。有关更多信息，请参阅 [允许 ML 后端访问 Label Studio 数据](https://labelstud.io/guide/ml#Allow-the-ML-backend-to-access-Label-Studio-data)。有关查找你的 Label Studio API 密钥的信息，请参阅 [访问令牌](https://labelstud.io/guide/user_account#Access-token)。

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
label-studio-ml start ./nemo_asr
```

## 配置

参数可以在运行容器之前在 `docker-compose.yml` 中设置。


提供以下常用参数：
- `MODEL_NAME` - 指定用于 ASR 的模型名称。（默认为 `QuartzNet15x5Base-En`）
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量
- `LABEL_STUDIO_HOST`：Label Studio 实例的主机。默认值为 `http://localhost:8080`。
- `LABEL_STUDIO_API_KEY`：Label Studio 实例的 API 密钥。

## 自定义

可以通过在 `./nemo_asr/model.py` 中添加你自己的模型和逻辑来自定义 ML 后端。
