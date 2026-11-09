---
title: Interactive annotation with Segment Anything Model
type: guide
tier: all
order: 10
hide_menu: true
hide_frontmatter_title: true
meta_title: Interactive annotation in Label Studio with Segment Anything Model (SAM)
meta_description: Label Studio tutorial for labeling images with MobileSAM or ONNX SAM. 
categories:
    - Computer Vision
    - Object Detection
    - Image Annotation
    - Segment Anything Model
    - Facebook
    - ONNX
image: "/guide/ml_tutorials/segment-anything.png"
---

# 使用 Segment Anything Model 在 Label Studio 中进行交互式标注

https://github.com/shondle/label-studio-ml-backend/assets/106922533/42a8a535-167c-404a-96bd-c2e2382df99a

将 Facebook 的 Segment Anything Model 与 Label Studio 一起使用！
2024 年 7 月，Facebook 发布了 Segment Anything 模型的更新版本，称为 SAM 2。要使用这个更新的模型进行标注，请参阅 [segment_anything_2_image 仓库](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_2_image)。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`segment_anything_model` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_model)。

## 快速开始

### 使用 Docker Compose（推荐）

要使用 SAM 的轻量级移动版本启动服务器，请运行以下命令：

```bash
docker-compose up
```

### GPU 支持

默认情况下，docker-compose 文件在 CPU 上运行模型。如果你有 GPU，可以通过在 `docker-compose.yml` 中添加以下行来启用它：

```yaml
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    deploy:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

## 关于模型

此仓库中有两个你可以使用的模型：
1. 高级 Segment Anything Model
2. ONNX Segment Anything Model

### 高级 Segment Anything Model

高级 Segment Anything Model 引入了结合多种不同提示以实现预测的能力，以及使用 MobileSAM 的能力。

- 混合一个矩形标签与多个正关键点，以细化你的预测。
- 使用负关键点从预测中移除区域以获得更多控制。
- 使用 MobileSAM，这是 Facebook 重型 Segment Anything Model 的极其轻量的替代方案，以检索预测。这可以在使用笔记本电脑 GPU 的情况下在不到一秒内完成推理。

### ONNX Segment Anything Model

ONNX Segment Anything Model 让你可以使用单个关键点或单个矩形标签来提示原始的 SAM。
- 这比使用原始的 Segment Anything Model 提供更快的预测。
- 缺点是在使用 ONNX 模型之前必须指定图像大小，并且在标注时无法推广到其他图像大小。此外，这还不提供高级 SAM 所具有的混合标注和细化功能。

### 模型配置选项

每个模型都有不同的优缺点。考虑哪一个最适合你的项目：

* AdvancedSAM
  * Mobile SAM 配置
    - 优点：可以在笔记本电脑上运行的轻量级模型，并且可以混合许多不同的输入提示组合来微调预测。
    - 缺点：精度低于 Facebook 原始的 SAM 架构。
  * 原始 SAM 架构
    - 优点：精度高于 MobileSAM，具有混合许多不同输入提示组合以微调预测的能力。
    - 缺点：收集预测需要很长时间（约 2 秒来创建图像的嵌入），需要访问良好的 GPU。

* ONNXSAM
  * 原始 SAM 架构
    - 优点：比在 Advanced SAM 中使用时快得多。
    - 缺点：每次预测只能使用一个智能标签。必须在生成 ONNX 模型之前定义图像大小。无法标注大小不同的图像而不遇到问题。

## 设置

如果为你的项目启用了 [本地存储](https://labelstud.io/guide/storage.html#Local-storage)，Label Studio SAM 后端工作效果最佳。也可以设置共享本地存储，但不推荐。目前，该后端不适用于云存储（S3、Azure、GCP）。

### 设置 Label Studio 服务器

#### 启用本地存储文件服务

你可以通过设置以下变量来启用本地存储文件服务：

```
LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=<path_to_image_data>
LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true
```

例如，如果你使用 Docker 启动 Label Studio，可以使用以下命令启用这些变量：

```
docker run -it -p 8080:8080 \
               -v $(pwd)/mydata:/label-studio/data \
               --env LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true \
               --env LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=/label-studio/data/images \
               heartexlabs/label-studio:latest
```

记下你运行 Label Studio 实例的 IP 地址作为 `LABEL_STUDIO_HOST`。这对于设置与你的 SAM 模型的连接是必要的。

_因为你是在 Docker 容器中同时托管 Label Studio 和 ML 后端，主机名 `localhost` 将无法解析到正确的地址。_ 有多种方法可以确定你的主机 IP 地址。这些可以包括从命令行调用 `ip a` 或 `ifconfig` 并检查输出，或者查找通过系统网络配置设置分配给你的计算机的地址。

#### 获取你的 API 令牌

登录 Label Studio 界面（在上面的示例中，位于 `http://<LABEL_STUDIO_HOST>:8080`）。

转到 [**账户与设置** 页面](https://labelstud.io/guide/user_account#Access-token)，并记下访问令牌，我们稍后将使用它作为 `LABEL_STUDIO_ACCESS_TOKEN`。

### 设置 SAM 后端

#### 克隆仓库

在你的主机系统上克隆此仓库，并将其移动到工作目录。

```
git clone https://github.com/humansignal/label-studio-ml-backend
cd label-studio-ml-backend/label_studio_ml/examples/segment_anything_model
```

#### 使用 Docker Compose（推荐）

我们建议使用 [Docker Compose](https://docs.docker.com/compose/) 来托管和运行后端。对于 GPU 支持，请查阅 [Docker Compose GPU 访问指南](https://docs.docker.com/compose/gpu-support/) 以了解如何将 GPU 资源传递给服务。

编辑 `docker-compose.yml` 文件，并为你特定的安装填写 `LABEL_STUDIO_HOST` 和 `LABEL_STUDIO_ACCESS_TOKEN` 变量的值。务必在 `LABEL_STUDIO_HOST` 变量中附加 Label Studio 运行的端口，例如，如果 Label Studio 在端口 8080 上运行，则为 `http://192.168.1.36:8080`。

运行命令 `docker compose up --build` 以在本地构建并运行容器。

### 手动设置后端

#### 下载模型权重

此步骤仅在你不使用此模型的 Docker 构建时才需要。

- 对于 MobileSAM，使用 [此链接](https://cdn.githubraw.com/ChaoningZhang/MobileSAM/01ea8d0f/weights/mobile_sam.pt) 安装权重，并将其放在一个文件夹中（以及 advanced_sam.py 和 onnx_sam.py 文件旁边）

- 对于使用常规 SAM 和/或 ONNX —— 按照 [带 pip 的 SAM 安装说明](https://github.com/facebookresearch/segment-anything) 进行操作。然后，安装 [ViT-H SAM 模型](https://github.com/facebookresearch/segment-anything)

- 对于 ONNX 模型，使用 `python onnxconverter.py` 进行安装

你可以使用以下命令下载所有的权重和模型：

```bash
./download_models.sh
```

#### 安装依赖

将目录更改为此文件夹，然后安装所有的 python 依赖项。

```
pip install -r requirements.txt
```

#### 根据你选择的模型调整变量和 `_wsgi.py`

你可以设置以下环境变量来更改模型的行为。

* `LABEL_STUDIO_HOST` 设置 Label Studio 主机的端点。必须以 `http://` 开头
* `LABEL_STUDIO_ACCESS_TOKEN` 设置 Label Studio 主机的 API 访问令牌。
* `SAM_CHOICE` 选择要使用的模型。
    * `SAM_CHOICE=MobileSAM` 使用 MobileSAM（默认）
    * `SAM_CHOICE=SAM` 使用原始的 SAM 模型。
    * `SAM_CHOICE=ONNX` 使用 ONNX 模型。

#### 启动后端

你现在可以手动启动 ML 后端。

```
python _wsgi.py
```

或

```bash
docker-compose up
```

以在 Docker 容器中启动后端

或

```bash
MOBILESAM_CHECKPOINT=path/to/mobile_sam.pt label-studio-ml start segment_anything_model/
```

> 注意：如果你在 MacOS 上看到错误，请尝试设置环境变量 `KMP_DUPLICATE_LIB_OK=True`

## 在 Label Studio 中为 Segment Anything 设置项目

登录你的 Label Studio 实例并执行以下步骤。

1. 创建一个新项目。
2. 在创建项目的 **标注设置（Labeling Setup）** 步骤下，或在项目设置中的 **标注界面（Labeling Interface）** 下，将 [示例模板](#labeling-configs) 粘贴到代码对话框中。保存界面。
3. 转到项目设置中的 **模型（Model）** 页面，然后点击 **连接模型（Connect Model）**。
4. 输入模型的标题，以及你刚刚创建的模型实例的 URL。

   如果你在 Docker 中或在另一台主机上运行 Label Studio，你应该使用该模型托管位置的直接 IP 地址（`localhost` 将不起作用）。务必包含模型托管的端口号（默认为 `9090`）。例如，如果模型托管在 `192.168.1.36`，则模型的 URL 将是 `http://192.168.1.36:9090`
5. 点击 **验证并保存（Validate and Save）**。

你现在可以将图像上传到你的项目并开始标注。

[此视频](https://drive.google.com/file/d/1OMV1qLHc0yYRachPPb8et7dUBjxUsmR1/view?usp=sharing) 也涵盖了此过程，但部分操作是在新创建的项目菜单中进行的。

## 创建标注

请参阅 [此视频教程](https://drive.google.com/file/d/1OMV1qLHc0yYRachPPb8et7dUBjxUsmR1/view?usp=sharing) 以更好地了解使用 SAM 标注时的工作流程。

使用 `Alt` 快捷键来更改关键点的正负标签。

### AdvancedSAM 的注意事项

* _**请先观看 [此视频](https://drive.google.com/file/d/1OMV1qLHc0yYRachPPb8et7dUBjxUsmR1/view?usp=sharing)**_
* 为了获得最佳体验，请按照上面的视频教程操作，并在运行预测时 _**取消勾选 '自动接受标注建议（Auto accept annotation suggestions）'**_。
* 在从各种输入生成预测后，请务必 _**点击图像外部的对勾**_ 以最终确定区域（这应该在图像的上方或下方。观看 [视频](#creating-annotations) 以获取视觉指南）。
* 在生成的预测旁边，图像内部可能有一个对勾，但 _不要使用那个_。

    由于某种原因，不在图像本身上的对勾会清理用于生成区域的输入提示，并在被点击后仅保留预测区域（这是使用后端最兼容的方式）。
* 如果你点击了图像上的对勾并且它保留了用于引导区域的标签，你可能会在创建相同类的实例时遇到问题。
* 标注你的对象后，在菜单中选择标签，并在图像下方标签键的顶部选择你想要赋予它的笔刷标签类型。这允许你更改预测的类。请参阅 [视频](#creating-annotations) 以获得更好的解释。
* _**只有负关键点可用于从预测区域中减去**_ 用于模型。正关键点和矩形告诉模型感兴趣的区域以进行正向预测。

* 可以使用多个关键点来为模型提供应扩展预测的区域。_**只能使用一个矩形标签**_ 来生成预测，作为模型预测应发生/扩展的区域。

  如果你放置了多个矩形标签，模型将使用最新的矩形标签以及所有其他关键点来辅助模型预测。

### ONNX 的注意事项

* ONNX 模型使用 `onnx_converter.py` 中的 `orig_img_size`，它定义了 ONNX 模型的图像比例。在生成模型之前，将此更改为你要标注的图像的比例。如果你正在标注大小不同的图像，请改用 Advanced SAM，或者为具有不同大小的不同图像组生成新的 ONNX 模型。如果你不调整 `orig_img_size`，并且你的图像宽高比与已定义的不匹配，那么你的预测将从图像偏移。如果使用 `docker compose` 启动模型，请务必重建主机容器。
* 在使用 `onnx_converter.py` 时，请务必在生成 ONNX 模型之前调整 `orig_img_size`
* 更改代码的指南 - `"orig_im_size": torch.tensor([#heightofimages, #widthofimages], dtype=torch.float),`

### 导出的注意事项

* 不支持 COCO 和 YOLO 格式（此项目使用笔刷标签导出，因此请尝试使用 NumPy 或 PNG 导出）

## 标注配置

### 使用 AdvancedSAM 时

- 为你想要标注的每个类提供一个笔刷标签。
- 按住 `Alt` 快捷键以创建负关键点。
- 为你想要标注的每个类添加一个矩形标签。
- [视频](#creating-annotations) 也回顾了这些要点，如果你在阅读后仍感到困惑的话。

基础示例：
```xml
<View>
<Style>
  .main {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 40px 5px 5px 5px;
  }
  .container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .column {
    flex: 1;
    padding: 10px;
  	margin: 5px; 
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
    padding-bottom: 7px; 
    background-color: #f9f9f9;
    border-radius: 3px;
  }
  .lsf-labels {
    margin: 5px 0 0 0; 
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
      <HyperText value="" name="h1" className="help" inline="true">
        用于手动标注的笔刷
      </HyperText>
      <View className="label">        
        <BrushLabels name="tag" toName="image">
          <Label value="Foreground" background="#FF0000" />
          <Label value="Background" background="#0d14d3" />
        </BrushLabels>
      </View>
    </View>
    
    <View className="column">
      <HyperText value="" name="h2" className="help" inline="true">
        <span title="1. 点击工具栏上的紫色自动关键点/矩形图标。2. 在此处点击前景/背景标签">
          用于自动标注的关键点
        </span>
      </HyperText>
      <View className="label">
        <KeyPointLabels name="tag2" toName="image" smart="true">
          <Label value="Foreground" smart="true" background="#FFaa00" showInline="true" />
          <Label value="Background" smart="true" background="#00aaFF" showInline="true" />
        </KeyPointLabels>
      </View>
    </View>
    
    <View className="column">
      <HyperText value="" name="h3" className="help" inline="true">
        <span title="1. 点击工具栏上的紫色自动关键点/矩形图标。2. 在此处点击前景/背景标签">
          用于自动标注的矩形
        </span>
      </HyperText>
      <View className="label">
        <RectangleLabels name="tag3" toName="image" smart="true">
          <Label value="Foreground" background="#FF00FF" showInline="true" />
          <Label value="Background" background="#00FF00" showInline="true" />
        </RectangleLabels>
      </View>
    </View>
    
  </View>
  
  <View className="image-container">
    <Image name="image" value="$image" zoom="true" zoomControl="true" />
  </View>
  
</View>
</View>
```

### 使用 ONNX 模型时

关键点、矩形和笔刷标签的标签值必须对应。除此之外，请确保每个关键点标签和矩形标签的 `smart="True"`。

对于 ONNX 模型：

```
<View>
  <Image name="image" value="$image" zoom="true"/>
  <BrushLabels name="tag" toName="image">
  	<Label value="Banana" background="#FF0000"/>
  	<Label value="Orange" background="#0d14d3"/>
  </BrushLabels>
  <KeyPointLabels name="tag2" toName="image" smart="true">
    <Label value="Banana" smart="true" background="#000000" showInline="true"/>
    <Label value="Orange" smart="true" background="#000000" showInline="true"/>
  </KeyPointLabels>
  <RectangleLabels name="tag3" toName="image" smart="true">
    <Label value="Banana" background="#000000" showInline="true"/>
    <Label value="Orange" background="#000000" showInline="true"/>
  </RectangleLabels>
</View>
```

## 致谢

原始的 Segment Anything Model 论文 -
```
@article{kirillov2023segany,
  title={Segment Anything},
  author={Kirillov, Alexander and Mintun, Eric and Ravi, Nikhila and Mao, Hanzi and Rolland, Chloe and Gustafson, Laura and Xiao, Tete and Whitehead, Spencer and Berg, Alexander C. and Lo, Wan-Yen and Doll{\'a}r, Piotr and Girshick, Ross},
  journal={arXiv:2304.02643},
  year={2023}
}
```

MobileSAM 论文 -
```
@article{mobile_sam,
  title={Faster Segment Anything: Towards Lightweight SAM for Mobile Applications},
  author={Zhang, Chaoning and Han, Dongshen and Qiao, Yu and Kim, Jung Uk and Bae, Sung-Ho and Lee, Seungkyu and Hong, Choong Seon},
  journal={arXiv preprint arXiv:2306.14289},
  year={2023}
}
```
