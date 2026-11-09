---
title: OpenMMLab Image object detector or MMDetection
type: guide
hide_menu: true
tier: all
order: 40
meta_title: OpenMMLab Image object detector or MMDetection
meta_description: Label Studio tutorial for OpenMMLab Image object detector or MMDetection
section: "Machine learning"
parent: "ml_tutorials"
parent_enterprise: "ml_tutorials"
parent_page_extension: "html"
---


此 [机器学习后端](/guide/ml.html) 让你能够使用边界框自动预标注你的图像。它由出色的 [OpenMMLab MMDetection 库](https://github.com/open-mmlab/mmdetection) 提供支持，该库让你能够访问许多现有的最先进模型，如 FasterRCNN、RetinaNet、YOLO 等。

遵循此安装指南，然后试用它们，为你的当前数据集挑选最合适的模型！

## 开始使用

1. [在本地安装模型](#Installation)。

2. 运行 Label Studio，然后转到项目设置的 **机器学习（Machine Learning）** 页面。点击 **添加模型（Add Model）**，然后粘贴所选 ML 后端 URL，默认 `http://localhost:9090`。

3. 在 **标注界面（Labeling Interface）** 页面，选择 `COCO annotation` 或 `Bbox object detection` 模板。
   可选地，你可以使用 `predicted_values` 属性修改标签配置。它提供以逗号分隔的 COCO 标签列表。如果对象检测器输出这些标签中的任何一个，它们会被转换为 `value` 属性中的实际标签名称。

    例如，如果你的标注配置包含以下内容：

    ```xml
    <Label value="Airplane" predicted_values="airplane"/>
    <Label value="Car" predicted_values="car,truck"/>
    ```
   对于特定任务，会发生以下情况：
    - 如果 COCO 对象检测器预测带有标签 `"airplane"` 的边界框，你会看到标签 `"Airplane"`。
    - 如果它预测 `"car"` 或 `"truck"`，这些预测中的任何一个都将被合并，以在该任务上显示 `"Car"` 标签。

   有关更多信息，请参阅 [COCO 标签的完整列表](#The-full-list-of-COCO-labels)。


## 安装

1. 按照 [MMDetection 安装指南](https://mmdetection.readthedocs.io/en/v1.2.0/INSTALL.html) 设置 MMDetection 环境。根据你的操作系统，可能会缺少某些依赖项，例如 gcc-c++、mesa-libGL。使用你的包管理器安装它们。

2. 创建并初始化目录 `./coco-detector`：

    ```bash
    label-studio-ml init coco-detector --from label_studio_ml/examples/mmdetection/mmdetection.py
    ```

3. 从 MMDetection 模型库下载 `config_file` 和 `checkpoint_file`（使用 [推荐的 Faster RCNN 进行快速开始](https://mmdetection.readthedocs.io/en/latest/1_exist_data_model.html#inference-with-existing-models)）。将 `config_file` 放在克隆的 [mmdetection 仓库](https://github.com/open-mmlab/mmdetection) 中。

以下部分根据特定用例展示了如何运行此 ML 后端的不同设置。

## 在与 Label Studio 相同的机器上运行 ML 后端

如果你在与 Label Studio 相同的机器上运行 ML 后端，你可以直接将图像上传到 Label Studio，或将它们指定为远程 URL。

#### 图像在 Label Studio UI 中上传
   ```bash
   label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth
   ```
在这种情况下，ML 后端从默认数据上传文件夹读取图像。
如果你更改了默认上传文件夹，例如通过设置 `LABEL_STUDIO_BASE_DATA_DIR=/custom/data/path`，则必须显式指定上传文件夹：

   ```bash
   label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth \
   image_dir=/custom/data/path/media/upload
   ```

#### 图像被指定为远程 URL

   ```bash
   label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth
   ```

## 在与 Label Studio 不同的机器上运行 ML 后端服务器

当在单独的服务器实例上运行 ML 后端并使用远程主机名 URL 将其连接到 Label Studio 时，你必须记住你的 ML 后端服务器必须获取完整的图像 URL。
在这种情况下，你必须在运行 ML 后端之前提供 Label Studio 主机名：

   ```bash
   LABEL_STUDIO_HOSTNAME=http://my.label-studio.com:8080 label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth
   ```

## 其他参数

你还可以在启动此 ML 后端时指定其他参数，以适应你的用例或环境。
另外，请查看我们的 [快速开始](/guide/ml.html#Quickstart-with-an-example-ML-backend)。

#### GPU 支持
如果你有可用的 GPU，可以在启动 ML 后端时使用 `device=gpu:0`（或对于较新版本的 pytorch 和 mmdetection 使用 `cuda:0`）来显著加快图像的预标注速度。例如：

 ```bash
   label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth \
   device=gpu:0
   ```

#### 边界框阈值

你还可以调整 `score_threshold`。较低的值会增加灵敏度，但会产生更多噪声。

   ```bash
   label-studio-ml start coco-detector --with \
   config_file=mmdetection/configs/faster_rcnn/faster_rcnn_r50_fpn_1x_coco.py \
   checkpoint_file=/absolute/path/to/downloaded/checkpoint.pth \
   score_threshold=0.5
   ```


## COCO 标签的完整列表
```text
airplane
apple
backpack
banana
baseball_bat
baseball_glove
bear
bed
bench
bicycle
bird
boat
book
bottle
bowl
broccoli
bus
cake
car
carrot
cat
cell_phone
chair
clock
couch
cow
cup
dining_table
dog
donut
elephant
fire_hydrant
fork
frisbee
giraffe
hair_drier
handbag
horse
hot_dog
keyboard
kite
knife
laptop
microwave
motorcycle
mouse
orange
oven
parking_meter
person
pizza
potted_plant
refrigerator
remote
sandwich
scissors
sheep
sink
skateboard
skis
snowboard
spoon
sports_ball
stop_sign
suitcase
surfboard
teddy_bear
tennis_racket
tie
toaster
toilet
toothbrush
traffic_light
train
truck
tv
umbrella
vase
wine_glass
zebra
```
