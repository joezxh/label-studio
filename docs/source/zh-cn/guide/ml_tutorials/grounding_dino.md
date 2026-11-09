---
title: Zero-shot object detection and image segmentation with Grounding DINO
type: guide
tier: all
order: 15
hide_menu: true
hide_frontmatter_title: true
meta_title: Image segmentation in Label Studio using a Grounding DINO backend
meta_description: Label Studio tutorial for using Grounding DINO for zero-shot object detection in images
categories:
    - Computer Vision
    - Image Annotation
    - Object Detection
    - Grounding DINO
image: "/guide/ml_tutorials/grounding-dino.png"
---

https://github.com/HumanSignal/label-studio-ml-backend/assets/106922533/d1d2f233-d7c0-40ac-ba6f-368c3c01fd36


# Grounding DINO 后端集成

此集成将允许你：

* 使用文本提示对图像中的对象进行零样本（zero-shot）检测。
* 指定检测任何对象并获得最先进的结果，而无需任何模型微调。

有关预训练 Grounding DINO 模型的更多详细信息，请参阅 [此处](https://github.com/IDEA-Research/GroundingDINO)。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`grounding_dino` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/grounding_dino)。


## 快速开始

1. 确保已安装 Docker。
2. 编辑 `docker-compose.yml` 以包含以下内容：
   * `LABEL_STUDIO_HOST` 设置 Label Studio 主机的端点。必须以 `http://` 开头
   * `LABEL_STUDIO_ACCESS_TOKEN` 设置 Label Studio 主机的 API 访问令牌。可以通过登录
  Label Studio 并 [转到 **账户与设置** 页面](https://labelstud.io/guide/user_account#Access-token) 找到。

   示例：
   - `LABEL_STUDIO_HOST=http://123.456.7.8:8080`
   - `LABEL_STUDIO_ACCESS_TOKEN=your-api-key`

3. 运行 `docker compose up`
4. 使用 `docker ps` 检查你的后端 IP。在将后端连接到 Label Studio 项目时，你将使用此 URL。通常是 `http://localhost:9090`。

5. 创建一个项目并编辑标注配置（下面提供了一个示例）。编辑标注配置时，请务必将所有矩形标签添加到 `RectangleLabels` 标签下，并将所有相应的笔刷标签添加到 `BrushLabels` 标签下。

```xml
<View>
    <Style>
    .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
    </Style>
    <View className="prompt">
        <Header value="Enter a prompt to detect objects in the image:"/>
    <TextArea name="prompt" toName="image" editable="true" rows="2" maxSubmissions="1" showSubmitButton="true"/>
    </View>
    <Image name="image" value="$image"/>

    <RectangleLabels name="label" toName="image">
        <Label value="cats" background="yellow"/>
        <Label value="house" background="blue"/>
    </RectangleLabels>
</View>
```

6. 从项目设置的 **模型（Model）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。
7. 转到项目中的图像任务。启用 **自动标注（Auto-annotation）**（位于标注界面底部）。然后在提示框中输入内容并按下 **Add（添加）**。之后，你应该会收到你的预测。有关演示，请参阅上面的视频。


## 使用 GPU

为了获得最佳用户体验，建议使用 GPU。为此，你可以更新 `docker-compose.yml` 文件，包含以下行：

```yaml
environment:
  - NVIDIA_VISIBLE_DEVICES=all
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

## 使用 GroundingSAM

如果你正在寻找 GroundingDINO 与 SAM 的集成，[请查看此示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/grounding_sam)。
