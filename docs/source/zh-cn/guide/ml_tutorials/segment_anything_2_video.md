---
title: SAM2 with Videos
type: guide
tier: all
order: 15
hide_menu: true
hide_frontmatter_title: true
meta_title: Using SAM2 with Label Studio for Video Annotation
categories:
    - Computer Vision
    - Video Annotation
    - Object Detection
    - Segment Anything Model
image: "/guide/ml_tutorials/sam2-video.png"
---

# 将 SAM2 与 Label Studio 一起用于视频标注

本指南描述了开始使用 **SegmentAnything 2** 与 Label Studio 的最简单方法。

此仓库专门用于视频中的对象跟踪。要处理图像，请参阅 [segment_anything_2_image 仓库](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_2_image)。

![sam2](guide/ml_tutorials/Sam2Video.gif)

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`segment_anything_2_video` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_2_video)。

## 从源代码运行

1. 要在不使用 Docker 的情况下运行 ML 后端，你必须克隆仓库并使用 pip 安装所有依赖项：

```bash
git clone https://github.com/HumanSignal/label-studio-ml-backend.git
cd label-studio-ml-backend
pip install -e .
cd label_studio_ml/examples/segment_anything_2_video
pip install -r requirements.txt
```

2. 将 [`segment-anything-2` 仓库](https://github.com/facebookresearch/segment-anything-2) 下载到根目录。使用 [官方 Meta 文档](https://github.com/facebookresearch/segment-anything-2?tab=readme-ov-file#installation) 安装 SegmentAnything 模型并下载检查点。请确保完成下载检查点文件的步骤！

3. 导出以下环境变量（填入你自己的凭据！）：
- LABEL_STUDIO_URL：你的 Label Studio 实例的 http:// 或 https:// 链接（包含前缀！）
- LABEL_STUDIO_API_KEY：你的 Label Studio API 密钥，可在你的个人资料中找到。

4. 然后你可以在默认端口 `9090` 上启动 ML 后端：

```bash
cd ../
label-studio-ml start ./segment_anything_2_video
```
请注意，如果你在云服务器上运行，你需要在一个暴露的端口上运行。要更改端口，请在上面的启动命令末尾添加 `-p <端口号>`。
5. 将正在运行的 ML 后端服务器连接到 Label Studio：转到你的项目 `设置 -> 机器学习 -> 添加模型（Settings -> Machine Learning -> Add Model）`，并指定 `http://localhost:9090` 作为 URL。在官方 [Label Studio 文档](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio) 中阅读更多信息。
 同样，如果你在云中运行，你需要将此 localhost 位置替换为你容器对外暴露的 IP 地址，以及暴露的端口。

# 标注配置
对于你的项目，你可以使用任何带有视频属性的标注配置。这是一个基本的配置供你开始！

```xml     
<View>
    <Labels name="videoLabels" toName="video" allowEmpty="true">
        <Label value="Player" background="#11A39E"/>
        <Label value="Ball" background="#D4380D"/>
    </Labels>

    <!-- 请仔细指定 FPS，它将用于项目的所有视频 -->
    <Video name="video" value="$video" framerate="25.0"/>
    <VideoRectangle name="box" toName="video" smart="true"/>
</View>
```

## 已知限制
- 截至 2024 年 8 月 11 日，SAM2 仅在 GPU 服务器上运行。
- 目前，我们只支持在视频中跟踪一个对象，尽管 SAM2 可以支持多个。
- 目前，我们不支持视频分割。
- 不支持 Docker

如果你想为这个仓库做贡献以帮助解决其中一些限制，你可以提交一个 PR。

## 自定义

可以通过在 `./segment_anything_2_video` 目录中添加你自己的模型和逻辑来自定义 ML 后端。
