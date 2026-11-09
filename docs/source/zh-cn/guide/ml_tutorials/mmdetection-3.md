---
title: Object detection with bounding boxes using MMDetection
type: guide
tier: all
order: 65
hide_menu: true
hide_frontmatter_title: true
meta_title: Object detection in images with Label Studio and MMDetection
meta_description: This is a tutorial on how to use the example MMDetection model backend with Label Studio for image segmentation tasks.
categories:
    - Computer Vision
    - Object Detection
    - Image Annotation
    - OpenMMLab
    - MMDetection
image: "/guide/ml_tutorials/openmmlab.png"
---

# 使用 MMDetection 进行边界框目标检测

https://mmdetection.readthedocs.io/en/latest/

本示例演示如何使用 MMDetection 模型与 Label Studio 配合，为图像标注边界框。该模型基于 YOLOv3 架构，使用 MobileNetV2 作为骨干网络（backbone），并在 COCO 数据集上训练。

![screenshot.png](guide/ml_tutorials/screenshot.png)

## 准备工作

开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`mmdetection-3` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/mmdetection-3)。

## 快速使用

如需快速使用，请在工作目录中运行 `docker-compose`：

```bash
docker-compose up -d
```

## 教程参考

有关构建你自己的镜像以及高级用法的文档，请参阅教程：

https://github.com/HumanSignal/label-studio/blob/develop/docs/source/tutorials/object-detector.md


## 标注配置

可以使用两种可能的标注配置变体：

1. 在此示例中，你可以"按原样"提供标签，它们将自动映射到 MMDetection 模型的标签。

    这适用于简单的使用场景。例如，Label Studio 的 `Airplane` 会映射到 MMDetection 的 `airplane`。

    ```
    <View>
      <Image name="image" value="$image"/>
      <RectangleLabels name="label" toName="image">
        <Label value="Airplane" background="green"/>
        <Label value="Car" background="blue"/>
      </RectangleLabels>
    </View>
    ```

2. 使用 `predicted_values` 的更复杂标注配置：

    ```
    <View>
      <Image name="image" value="$image"/>
      <RectangleLabels name="label" toName="image">
        <Label value="Vehicle" predicted_values="airplane,car" background="green"/>
      </RectangleLabels>
    </View>
    ```

在此示例中，你可以将多个标签合并为一个 Label Studio 标注。例如，Label Studio 的 `Vehicle` 会映射到 MMDetection 的 "airplane" 和 "car"。


## 不使用 Docker 运行

**强烈建议使用 Docker，这是避免许多常见问题的最佳方式。**

1. 在你选择的目录中克隆 Label Studio ML 后端仓库：

```
git clone https://github.com/HumanSignal/label-studio-ml-backend
cd label-studio-ml-backend/label_studio_ml/examples/mmdetection-3
```

2. 使用 `venv` 创建虚拟环境，并使用 pip 安装所有依赖：
```
python -m venv ml-backend
source ml-backend/bin/activate
```

3. 安装所有依赖：

```bash

# 设置环境变量
export PYTORCH="1.13.0"
export CUDA="11.6"
export CUDNN="8"

# 修复运行 apt-get update 时的 GPG 密钥错误
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub

# 更新基础操作系统
apt-get update
apt install -y git

# 安装 opencv-python 所需的系统依赖
apt-get install -y libgl1 libglib2.0-0

# 升级 pip
pip install -U pip

# 安装基础依赖
pip install -r requirements-base.txt

# 安装自定义依赖
pip install -r requirements.txt

# Mim 安装命令
pip install mim
mim install mmengine==0.10.3
mim install mmdet==3.3.0
mim download mmdet --config yolov3_mobilenetv2_8xb24-320-300e_coco --dest .
```

4. 设置环境变量

```bash
# 设置模型服务的日志级别
export LOG_LEVEL=DEBUG
# 指定模型目录（你可能无需更改此项）
export MODEL_DIR=
# mmdetection 模型参数
export CHECKPOINT_FILE=yolov3_mobilenetv2_320_300e_coco_20210719_215349-d18dff72.pth
export CONFIG_FILE=yolov3_mobilenetv2_8xb24-320-300e_coco.py
export DEVICE=cpu
export SCORE_THRESHOLD=0.5

# 指定用于访问 Label Studio URL 和 API 密钥
# 上传的、本地存储和云存储文件。
# 不要使用 'localhost'，因为它在 Docker 容器内无法工作。
# URL 始终使用 'http://' 或 'https://' 前缀。
# 使用 'ifconfig'（Linux/Mac）或 'ipconfig'（Windows）确定实际 IP。
export LABEL_STUDIO_URL=<your-ls-hostname>
export LABEL_STUDIO_API_KEY=<your-ls-api-key>
```

4. 运行以下命令启动你的 ML 后端

```
label-studio-ml start --root-dir .. mmdetection-3
```

或者使用 gunicorn 作为 Python Web 应用

```
gunicorn --preload --bind :9090 --workers 1 --threads 1 --timeout 0 _wsgi:app
```

* 使用本指南查找你的访问令牌：https://labelstud.io/guide/api.html
* 当你看到大量不需要的检测结果时，可以调高 `SCORE_THRESHOLD` 参数的值；如果没有看到任何检测结果，则可以调低其值。
