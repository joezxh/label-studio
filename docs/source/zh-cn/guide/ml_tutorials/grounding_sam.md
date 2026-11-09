---
title: Zero-shot object detection and image segmentation with Grounding DINO and SAM
type: guide
tier: all
order: 15
hide_menu: true
hide_frontmatter_title: true
meta_title: Image segmentation in Label Studio using a Grounding DINO backend and SAM
meta_description: Label Studio tutorial for using Grounding DINO and SAM for zero-shot object detection in images
categories:
    - Computer Vision
    - Image Annotation
    - Object Detection
    - Zero-shot Image Segmentation
    - Grounding DINO
    - Segment Anything Model
image: "/guide/ml_tutorials/grounding-sam.png"
---

https://github.com/HumanSignal/label-studio-ml-backend/assets/106922533/d1d2f233-d7c0-40ac-ba6f-368c3c01fd36


# 启用了 SAM 的 Grounding DINO 后端集成

此集成将允许你：

* 使用文本提示对图像中的对象进行零样本（zero-shot）检测。
* 指定检测任何对象并获得最先进的结果，而无需任何模型微调。
* 仅使用文本提示即可从 SAM 获得分割预测。

有关预训练 Grounding DINO 模型的更多详细信息，请参阅 [此处](https://github.com/IDEA-Research/GroundingDINO)。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`grounding_sam` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/grounding_sam)。


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
  <Image name="image" value="$image"/>
  <Style>
    .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
  </Style>
  <View className="prompt">
  <TextArea name="prompt" toName="image" editable="true" rows="2" maxSubmissions="1" showSubmitButton="true"/>
  </View>
  <RectangleLabels name="label" toName="image">
    <Label value="cats" background="yellow"/>
    <Label value="house" background="blue"/>
  </RectangleLabels>
  <BrushLabels name="label2" toName="image">
    <Label value="cats" background="yellow"/>
    <Label value="house" background="blue"/>
  </BrushLabels>
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

将 Segment Anything Model 与你的文本输入相结合，以自动生成掩码（mask）预测！

为此，请在运行前设置 `USE_SAM=true`。

> 警告：在没有 GPU 的情况下使用 GroundingSAM 可能会导致性能缓慢，因此不建议使用。如果你必须使用仅支持 CPU 的机器，并且遇到性能缓慢或在标注屏幕上看不到任何预测，请考虑以下方法之一：
> - 增加分配给 Docker 容器的内存（例如 `docker-compose.yml` 中的 `memory: 16G`）
> - 使用 `ML_TIMEOUT_PREDICT=100` 环境变量增加 Label Studio 实例上的预测超时。
> - 使用 "MobileSAM" 作为 "SAM" 的轻量级替代方案。

如果你想使用 [更高效的 SAM 版本](https://github.com/ChaoningZhang/MobileSAM)，请设置 `USE_MOBILE_SAM=true`。


## 批量输入

https://github.com/HumanSignal/label-studio-ml-backend/assets/106922533/79b788e3-9147-47c0-90db-0404066ee43f

> 注意：这是一个实验性功能。

1. 克隆包含实验性批量处理功能的 Label Studio 功能分支。

    `git clone -b feature/dino-support https://github.com/HumanSignal/label-studio.git`

2. 使用 `docker compose up` 运行此分支
3. 执行 [快速开始部分](#quickstart) 中的步骤 2-5，现在使用新克隆的 Label Studio 分支的访问代码和主机 IP 信息。支持 GroundingSAM。
4. 转到项目中的数据管理器，并选择你想要标注的任务。
5. 选择 **操作 > 为 GroundingDINO 添加文本提示（Actions > Add Text Prompt for GroundingDINO）**。
6. 输入你想要获取预测的文本提示，然后点击 **提交（Submit）**。

> 注意：如果你的提示与你已分配的标签值不同，你可以使用下划线为你的提示输出提供正确的标签值。例如，如果你想选择所有棕色的猫，但仍为它们提供来自你的标注配置的标签值 "cats"，你的提示将是 "brown cat_cats"。


## 其他环境变量

如果进行实验，请将 Dockerfile 中的 `BOX_THRESHOLD` 和 `TEXT_THRESHOLD` 值调整为 0 到 1 之间的数字。默认值在 `dino.py` 中设置。有关这些值的更多信息，[请点击此处](https://github.com/IDEA-Research/GroundingDINO#star-explanationstips-for-grounding-dino-inputs-and-outputs)。

如果你想使用从目录保存的 SAM 模型，可以使用 `MOBILESAM_CHECKPOINT` 和 `SAM_CHECKPOINT`，如 Dockerfile 中所示。
