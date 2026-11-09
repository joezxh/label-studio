---
title: Transfer learning for images with PyTorch
type: guide
hide_menu: true
tier: all
order: 30
meta_title: Computer Vision PyTorch Tutorial
meta_description: Label Studio tutorial for computer vision that showcases transfer learning for images using PyTorch and Label Studio.
section: "Machine learning"
parent: "ml_tutorials"
parent_enterprise: "ml_tutorials"
parent_page_extension: "html"
---


此示例解释了使用 Label Studio 和 [PyTorch](https://pytorch.org/) 的计算机视觉基础知识。
所提出的模型使用流行的 ResNet 图像分类器的迁移学习，并且可以针对你自己的数据进行微调。

你可以使用此示例标注配置：

```xml
<View>
  <Image name="image_object" value="$image_url"/>
  <Choices name="image_classes" toName="image_object">
    <Choice value="Cat"/>
    <Choice value="Dog"/>
  </Choices>
</View>
```

### 创建模型脚本

如果你使用 [Label Studio 的 ML SDK](/guide/ml_create.html) 创建 ML 后端，请确保你的 ML 后端脚本执行以下操作：

- 将创建的模型类继承自 `label_studio_ml.LabelStudioMLBase`
- 重写 2 个方法：
    - `predict()`，它接收 [输入任务](/guide/tasks.html#Basic-Label-Studio-JSON-format) 并以 Label Studio JSON 格式输出 [预测](/guide/predictions.html)。
    - `fit()`，它接收 [标注](/guide/export.html#Label-Studio-JSON-format-of-annotated-tasks) 可迭代对象，并返回带有创建的链接和资源的字典。此字典稍后用于通过 `self.train_output` 字段加载模型。

创建一个包含用于训练和推理的 PyTorch 模型的 `model.py` 文件。

首先，创建一个 `Dataset` 类，它接受图像 URL 列表作为输入，并生成一批经过预处理的图像和相应的标签：

```python
import torch
import torch.nn as nn
import torch.optim as optim
import time

from torch.utils.data import Dataset, DataLoader
from torchvision import datasets, models, transforms

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')


class ImageClassifierDataset(Dataset):
        
    def __init__(self, image_urls, image_classes):
        self.images = []
        self.labels = []
        
        self.classes = list(set(image_classes))
        self.class_to_label = {c: i for i, c in enumerate(self.classes)}
        
        self.image_size = 224
        self.transforms = transforms.Compose([
            transforms.Resize(self.image_size),
            transforms.CenterCrop(self.image_size),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        
        for image_url, image_class in zip(image_urls, image_classes):
            image = self._get_image_from_url(image_url)
            transformed_image = self.transforms(image)
            self.images.append(transformed_image)
            
            label = self.class_to_label[image_class]
            self.labels.append(label)
            
    def _get_image_from_url(self, url):
        pass
    
    def __getitem__(self, index):
        return self.images[index], self.labels[index]
    
    def __len__(self):
        return len(self.images)
```

接下来，为预训练的 ResNet 模型制作一个简单的包装器：

```python
class ImageClassifier(object):
    
    def __init__(self, num_classes):
        self.model = models.resnet18(pretrained=True)
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Linear(num_ftrs, num_classes)
        
        self.model = self.model.to(device)
        
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.SGD(self.model.parameters(), lr=0.001, momentum=0.9)
        
        # 每 7 个周期将 LR 衰减 0.1 倍
        self.scheduler = optim.lr_scheduler.StepLR(self.optimizer, step_size=7, gamma=0.1)
    
    def save(self, path):
        torch.save(self.model.state_dict(), path)
    
    def load(self, path):
        self.model.load_state_dict(torch.load(path))
        self.model.eval()
        
    def train(self, dataloader, num_epochs=25):
        since = time.time()

        self.model.train()
        for epoch in range(num_epochs):
            print('Epoch {}/{}'.format(epoch, num_epochs - 1))
            print('-' * 10)
            
            running_loss = 0.0
            running_corrects = 0    
            # 迭代数据。
            for inputs, labels in dataloader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                self.optimizer.zero_grad()
                outputs = self.model(inputs)
                _, preds = torch.max(outputs, 1)
                loss = self.criterion(outputs, labels)
                loss.backward()
                self.optimizer.step()

                # 统计信息
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
                self.scheduler.step()

            epoch_loss = running_loss / len(dataloader.dataset)
            epoch_acc = running_corrects.double() / len(dataloader.dataset)

            print('Train Loss: {:.4f} Acc: {:.4f}'.format(epoch_loss, epoch_acc))

        print()
    
        time_elapsed = time.time() - since
        print('Training complete in {:.0f}m {:.0f}s'.format(time_elapsed // 60, time_elapsed % 60))

        return self.model
```

最后，重写 API 方法：

```python
from label_studio_ml.model import LabelStudioMLBase

class ImageClassifierAPI(LabelStudioMLBase):
    
    def __init__(self, **kwargs):
        self.model = ImageClassifier(resources['num_classes'])
        self.model.load(resources['model_path'])
        self.labels = resources['labels']
        
    def predict(self, tasks, **kwargs):
        pass

    def fit(self, completions, **kwargs):
        pass
```

### 创建 ML 后端配置与脚本

Label Studio 可以自动创建从你新建模型运行 ML 后端所需的所有配置和脚本。

将你的 ML 后端命名为 `my_backend`，并在命令行中初始化 ML 后端目录 `./my_backend`：

```bash
label-studio-ml init my_backend
```

上一条命令会获取你的脚本 `./model.py` 并在同一层级创建一个 `./my_backend` 目录，复制在开发或生产模式下启动 ML 后端所需的配置和脚本。

!!! note
    你可以为你的模型脚本指定不同的位置，例如：`label-studio-ml init my_backend --script /path/to/my/script.py`

### 启动 ML 后端服务器

#### 开发模式

在开发模式下，训练和推理在单个进程中完成，因此服务器在模型训练时不会响应传入的预测请求。

要在 Flask 开发模式下启动 ML 后端服务器，请从命令行运行以下命令：

```bash
label-studio-ml start my_backend
```

服务器在 `http://localhost:9090` 上启动，并在控制台输出日志。

#### 生产模式

生产模式由 Redis 服务器和 RQ 作业提供支持，负责后台训练进程。这意味着你可以开始训练你的模型，并继续从当前模型状态请求预测。
在模型完成训练过程后，新的模型版本会自动更新。

对于生产模式，请确保你的系统上已安装 Docker 和 docker-compose。然后从命令行运行以下命令：

```bash
cd my_backend/
docker-compose up
```

你可以在 `my_backend/logs/uwsgi.log` 中查看运行时日志，在 `my_backend/logs/rq.log` 中查看 RQ 训练日志

### 将 ML 后端与 Label Studio 一起使用

初始化并启动一个连接到正在运行的 ML 后端的新 Label Studio 项目：

```bash
label-studio start my_project --init --ml-backends http://localhost:9090
```

#### 获取预测

你应该会在标注界面中看到模型预测。请参阅 [在 Label Studio 中设置机器学习](/guide/ml.html)。

#### 模型训练

通过按下项目设置的机器学习页面上的 `开始训练（Start training）` 按钮，或使用 API 调用来手动触发模型训练：

```bash
curl -X POST http://localhost:8080/api/models/train
```
