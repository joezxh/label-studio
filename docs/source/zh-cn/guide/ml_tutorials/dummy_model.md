---
title: Create the simplest Machine Learning backend
short: Create a simple ML backend
type: guide
hide_menu: true
tier: all
order: 10
meta_title: Integrating with Machine Learning Backend Tutorial
meta_description: Label Studio tutorial for creating and integrating your Machine Learning backend with Label Studio.
section: "Machine learning"
parent: "ml_tutorials"
parent_enterprise: "ml_tutorials"
parent_page_extension: "html"
---

本教程解释了将机器学习（ML）后端与 Label Studio 一起使用的基础知识。为简单起见，本教程依赖于一个仅生成随机预测的 _虚拟模型（dummy model）_。
该模型与任何分类任务兼容，例如使用 `<Choices>` 标签的项目。

例如，让我们考虑以下标注配置：
```
<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image" showInLine="true">
    <Choice value="Boeing" background="blue"/>
    <Choice value="Airbus" background="green" />
  </Choices>
</View>
```

### 创建虚拟模型脚本

如果你使用 [Label Studio 的 ML SDK](/guide/ml_create.html) 创建 ML 后端，请确保你的 ML 后端脚本执行以下操作：

- 将创建的模型类继承自 `label_studio_ml.LabelStudioMLBase`
- 重写 2 个方法：
    - `predict()`，它接收 [输入任务](/guide/tasks.html#Basic-Label-Studio-JSON-format) 并以 Label Studio JSON 格式输出 [预测](/guide/predictions.html)。
    - `fit()`，它接收 [标注](/guide/export.html#Label-Studio-JSON-format-of-annotated-tasks) 可迭代对象，并返回一个包含所创建链接和资源的字典。该字典稍后用于通过 `self.train_output` 字段加载模型。

创建一个包含以下内容的文件 `model.py`：

```python
from label_studio_ml.model import LabelStudioMLBase


class DummyModel(LabelStudioMLBase):

    def __init__(self, **kwargs):
        # 不要忘记调用基类的构造函数
        super(DummyModel, self).__init__(**kwargs)
    
        # 你可以预先初始化变量，其中包含从任务和标注中提取信息并生成预测所需的键
        from_name, schema = list(self.parsed_label_config.items())[0]
        self.from_name = from_name
        self.to_name = schema['to_name'][0]
        self.labels = schema['labels']

    def predict(self, tasks, **kwargs):
        """ 这里是推理发生的地方：模型根据输入任务列表返回
            预测列表
        """
        predictions = []
        for task in tasks:
            predictions.append({
                'score': 0.987,  # 预测总体分数，在数据管理器列中可见
                'model_version': 'delorean-20151021',  # 所有预测都将通过模型版本进行区分
                'result': [{
                    'from_name': self.from_name,
                    'to_name': self.to_name,
                    'type': 'choices',
                    'score': 0.5,  # 每个区域的分数，在编辑器中可见
                    'value': {
                        'choices': [self.labels[0]]
                    }
                }]
            })
        return predictions

    def fit(self, annotations, **kwargs):
        """ 这里是训练发生的地方：根据标注列表训练你的模型，
            然后返回包含所创建链接和资源的字典
        """
        return {'path/to/created/model': 'my/model.bin'}
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

你可以在 `my_backend/logs/uwsgi.log` 中查看运行时日志，在 `my_backend/logs/rq.log` 中查看 RQ 训练日志。

### 将 ML 后端与 Label Studio 一起使用

初始化并启动一个连接到正在运行的 ML 后端的新 Label Studio 项目：

```bash
label-studio start my_project --init --ml-backends http://localhost:9090
```

#### 获取预测

你应该会在标注界面中看到模型预测。请参阅 [在 Label Studio 中设置机器学习](/guide/ml.html)。

#### 模型训练

通过按下项目设置的机器学习页面上的 `Start training（开始训练）` 按钮，或使用 API 调用来手动触发模型训练：

```bash
curl -X POST http://localhost:8080/api/models/train
```
