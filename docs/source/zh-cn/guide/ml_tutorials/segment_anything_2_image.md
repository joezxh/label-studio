---
title: SAM2 with Images
type: guide
tier: all
order: 15
hide_menu: true
hide_frontmatter_title: true
meta_title: Using SAM2 with Label Studio for Image Annotation
categories:
    - Computer Vision
    - Image Annotation
    - Object Detection
    - Segment Anything Model
image: "/guide/ml_tutorials/sam2-images.png"
---

# 将 SAM2 与 Label Studio 一起用于图像标注

Segment Anything 2，即 SAM 2，是 Meta 于 2024 年 7 月发布的模型。作为原始 Segment Anything Model 的更新版本，SAM 2 为图像和视频提供了更好的对象分割。在本指南中，我们将向你展示如何使用 SAM 2 通过 Label Studio 进行更好的图像标注。

点击下面的图像，观看我们的 ML 布道者 Micaela Kaplan 解释如何将 SAM 2 链接到你的 Label Studio 项目。
你需要先按照下面的说明搭建一个 SAM2 实例，然后才能链接你的模型！

[![将 SAM2 模型连接到 Label Studio 进行图像标注](https://img.youtube.com/vi/FTg8P8z4RgY/0.jpg)](https://www.youtube.com/watch?v=FTg8P8z4RgY)

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`segment_anything_2_image` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_2_image)。

请注意，截至 2024 年 8 月 1 日，SAM2 仅在 GPU 上运行。

## 标注配置

Label Studio SAM2 ML 后端的当前实现使用交互式模式。用户引导的输入是：
- `KeypointLabels`（关键点标签）
- `RectangleLabels`（矩形标签）

然后 SAM2 输出 `BrushLabels`（笔刷标签）作为结果。

这意味着所有三个控制标签都应包含在你的标注配置中：

```xml
<View>
<Style>
  .main {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 20px;
  }
  .container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .column {
    flex: 1;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .column .title {
    margin: 0;
    color: #333;
  }
  .column .label {
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 3px;
  }
  .image-container {
    width: 100%;
    height: 300px;
    background-color: #ddd;
    border-radius: 5px;
  }
</Style>
<View className="main">
  <View className="container">
    <View className="column">
      <View className="title">Choose Label</View>
      <View className="label">
        <BrushLabels name="tag" toName="image">



        <Label value="defect" background="#FFA39E"/></BrushLabels>
      </View>
    </View>
    <View className="column">
      <View className="title">Use Keypoint</View>
      <View className="label">
        <KeyPointLabels name="tag2" toName="image" smart="true">



        <Label value="defect" background="#250dd3"/></KeyPointLabels>
      </View>
    </View>
    <View className="column">
      <View className="title">Use Rectangle</View>
      <View className="label">
        <RectangleLabels name="tag3" toName="image" smart="true">



        <Label value="defect" background="#FFC069"/></RectangleLabels>
      </View>
    </View>
  </View>
  <View className="image-container">
    <Image name="image" value="$image" zoom="true" zoomControl="true"/>
  </View>
</View>
</View>
```

## 从源代码运行

1. 要在不使用 Docker 的情况下运行 ML 后端，你必须克隆仓库并使用 pip 安装所有依赖项：

```bash
git clone https://github.com/HumanSignal/label-studio-ml-backend.git
cd label-studio-ml-backend
pip install -e .
cd label_studio_ml/examples/segment_anything_2_image
pip install -r requirements.txt
```

2. 将 [`segment-anything-2` 仓库](https://github.com/facebookresearch/segment-anything-2) 下载到根目录。使用 [Meta 官方文档](https://github.com/facebookresearch/segment-anything-2?tab=readme-ov-file#installation) 安装 SegmentAnything 模型并下载检查点。


3. 然后你可以在默认端口 `9090` 上启动 ML 后端：

```bash
cd ../
label-studio-ml start ./segment_anything_2_image
```

4. 将正在运行的 ML 后端服务器连接到 Label Studio：转到你的项目 `设置 -> 机器学习 -> 添加模型（Settings -> Machine Learning -> Add Model）`，并指定 `http://localhost:9090` 作为 URL。在官方 [Label Studio 文档](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio) 中阅读更多信息。

## 使用 Docker 运行（即将推出）

1. 使用预构建镜像在 `http://localhost:9090` 上启动机器学习后端：

```bash
docker-compose up
```

2. 验证后端是否正在运行

```bash
$ curl http://localhost:9090/
{"status":"UP"}
```

3. 从同一主机上运行的 Label Studio 连接到后端：转到你的项目 `设置 -> 机器学习 -> 添加模型（Settings -> Machine Learning -> Add Model）`，并指定 `http://localhost:9090` 作为 URL。


## 配置
参数可以在运行容器之前在 `docker-compose.yml` 中设置。


提供以下常用参数：
- `DEVICE` - 指定模型服务器的设备（目前仅支持 `cuda`，`cpu` 即将推出）
- `MODEL_CONFIG` - SAM2 模型配置文件（默认为 `sam2_hiera_l.yaml`）
- `MODEL_CHECKPOINT` - SAM2 模型检查点文件（默认为 `sam2_hiera_large.pt`）
- `BASIC_AUTH_USER` - 指定模型服务器的基本认证用户
- `BASIC_AUTH_PASS` - 指定模型服务器的基本认证密码
- `LOG_LEVEL` - 设置模型服务器的日志级别
- `WORKERS` - 指定模型服务器的 worker 数量
- `THREADS` - 指定模型服务器的线程数量

## 自定义

可以通过在 `./segment_anything_2` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
