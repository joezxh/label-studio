---
title: Text classification with Scikit-Learn
type: guide
hide_menu: true
tier: all
order: 20
meta_title: Text Classification with Scikit-Learn Tutorial
meta_description: Label Studio tutorial for text classification using Scikit-Learn and Label Studio.
section: "Machine learning"
parent: "ml_tutorials"
parent_enterprise: "ml_tutorials"
parent_page_extension: "html"
---


本教程讲解如何使用机器学习（ML）后端与 Label Studio 配合工作，所使用的是一个由 [scikit-learn](https://scikit-learn.org/stable/) 库提供支持的简单文本分类模型。

请在一个文本分类项目中跟随本教程操作，其标注界面使用 `<Choices>` 控制标签配合 `<Text>` 对象标签。以下是你可以使用的标注配置示例：

```xml
<View>
  <Text name="news" value="$text"/>
  <Choices name="topic" toName="news">
    <Choice value="Politics"/>
    <Choice value="Technology"/>
    <Choice value="Sport"/>
    <Choice value="Weather"/>
  </Choices>
</View>
```

### 创建模型脚本


如果你使用 [Label Studio 的 ML SDK](/guide/ml_create.html) 创建 ML 后端，请确保你的 ML 后端脚本完成以下工作：

- 将创建的模型类继承自 `label_studio_ml.LabelStudioMLBase`
- 重写以下 2 个方法：
    - `predict()`，它接收[输入任务](/guide/tasks.html#Basic-Label-Studio-JSON-format)并以 Label Studio 的 JSON 格式输出[预测结果](/guide/predictions.html)。
    - `fit()`，它接收一个[标注](/guide/export.html#Label-Studio-JSON-format-of-annotated-tasks)可迭代对象，并返回一个包含所创建链接与资源的字典。该字典随后用于通过 `self.train_output` 字段加载模型。


创建一个 `model.py` 文件，内容如下：

```python
import pickle
import os
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline

from label_studio_ml.model import LabelStudioMLBase


class SimpleTextClassifier(LabelStudioMLBase):

    def __init__(self, **kwargs):
        # 不要忘记初始化基类……
        super(SimpleTextClassifier, self).__init__(**kwargs)

        # 然后收集配置中的所有键，这些键将用于从任务中提取数据并构造预测
        # 解析后的标注配置只包含 <Choices> 类型的一个输出
        assert len(self.parsed_label_config) == 1
        self.from_name, self.info = list(self.parsed_label_config.items())[0]
        assert self.info['type'] == 'Choices'

        # 模型只有一个文本输入
        assert len(self.info['to_name']) == 1
        assert len(self.info['inputs']) == 1
        assert self.info['inputs'][0]['type'] == 'Text'
        self.to_name = self.info['to_name'][0]
        self.value = self.info['inputs'][0]['value']

        if not self.train_output:
            # 如果没有训练输出，则冷启动一个简单的 TF-IDF 文本分类器
            self.reset_model()
            # 这是一个 <Choice> 标签数组
            self.labels = self.info['labels']
            # 做一些虚拟初始化
            self.model.fit(X=self.labels, y=list(range(len(self.labels))))
            print('Initialized with from_name={from_name}, to_name={to_name}, labels={labels}'.format(
                from_name=self.from_name, to_name=self.to_name, labels=str(self.labels)
            ))
        else:
            # 否则从最新的训练结果中加载模型
            self.model_file = self.train_output['model_file']
            with open(self.model_file, mode='rb') as f:
                self.model = pickle.load(f)
            # 并使用训练输出中的标签
            self.labels = self.train_output['labels']
            print('Loaded from train output with from_name={from_name}, to_name={to_name}, labels={labels}'.format(
                from_name=self.from_name, to_name=self.to_name, labels=str(self.labels)
            ))

    def reset_model(self):
        self.model = make_pipeline(TfidfVectorizer(ngram_range=(1, 3)), LogisticRegression(C=10, verbose=True))

    def predict(self, tasks, **kwargs):
        # 收集输入文本
        input_texts = []
        for task in tasks:
            input_texts.append(task['data'][self.value])

        # 获取模型预测
        probabilities = self.model.predict_proba(input_texts)
        predicted_label_indices = np.argmax(probabilities, axis=1)
        predicted_scores = probabilities[np.arange(len(predicted_label_indices)), predicted_labels_indices]
        predictions = []
        for idx, score in zip(predicted_label_indices, predicted_scores):
            predicted_label = self.labels[idx]
            # 单个任务的预测结果
            result = [{
                'from_name': self.from_name,
                'to_name': self.to_name,
                'type': 'choices',
                'value': {'choices': [predicted_label]}
            }]

            # 为所有任务补充带分数的预测
            predictions.append({'result': result, 'score': score})

        return predictions

    def fit(self, completions, workdir=None, **kwargs):
        input_texts = []
        output_labels, output_labels_idx = [], []
        label2idx = {l: i for i, l in enumerate(self.labels)}

        for completion in completions:
            # 从任务数据中获取输入文本
            print(completion)
            if completion['annotations'][0].get('skipped') or completion['annotations'][0].get('was_cancelled'):
                continue

            input_text = completion['data'][self.value]
            input_texts.append(input_text)

            # 获取一个标注
            output_label = completion['annotations'][0]['result'][0]['value']['choices'][0]
            output_labels.append(output_label)
            output_label_idx = label2idx[output_label]
            output_labels_idx.append(output_label_idx)

        new_labels = set(output_labels)
        if len(new_labels) != len(self.labels):
            self.labels = list(sorted(new_labels))
            print('Label set has been changed:' + str(self.labels))
            label2idx = {l: i for i, l in enumerate(self.labels)}
            output_labels_idx = [label2idx[label] for label in output_labels]

        # 训练模型
        self.reset_model()
        self.model.fit(input_texts, output_labels_idx)

        # 保存输出资源
        model_file = os.path.join(workdir, 'model.pkl')
        with open(model_file, mode='wb') as fout:
            pickle.dump(self.model, fout)

        train_output = {
            'labels': self.labels,
            'model_file': model_file
        }
        return train_output
```

### 创建 ML 后端配置与脚本

Label Studio 可以自动创建运行 ML 后端所需的所有配置和脚本，这些都将基于你新建的模型生成。

将你的 ML 后端命名为 `my_backend`，并在命令行中初始化 ML 后端目录 `./my_backend`：

```bash
label-studio-ml init my_backend
```

最后一条命令会获取你的脚本 `./model.py`，并在同级目录创建 `./my_backend`，复制以开发或生产模式启动 ML 后端所需的配置和脚本。

!!! note
    你可以为模型脚本指定不同的位置，例如：`label-studio-ml init my_backend --script /path/to/my/script.py`。

### 启动 ML 后端服务

#### 开发模式

在开发模式下，训练和推理都在同一个进程中进行，因此在模型训练期间，服务器不会响应 incoming 的预测请求。

要以 Flask 开发模式启动 ML 后端服务，请在命令行中运行以下命令：

```bash
label-studio-ml start my_backend
```

服务器启动在 `http://localhost:9090`，并在控制台输出日志。

#### 生产模式

生产模式由 Redis 服务器和 RQ 任务（job）提供支持，它们负责后台训练进程。这意味着你可以开始训练模型，同时继续向当前模型状态发起预测请求。模型完成训练过程后，新版本的模型会自动更新。

对于生产模式，请确保你的系统上已安装 Docker 和 docker-compose。然后在命令行中运行以下命令：

```bash
cd my_backend/
docker-compose up
```

你可以在 `my_backend/logs/uwsgi.log` 中查看运行时日志，在 `my_backend/logs/rq.log` 中查看 RQ 训练日志。

### 将 ML 后端与 Label Studio 配合使用

初始化并启动一个连接到正在运行的 ML 后端的新 Label Studio 项目：

```bash
label-studio start my_project --init --ml-backends http://localhost:9090
```

#### 获取预测

你应该会在标注界面中看到模型预测。请参阅[在 Label Studio 中设置机器学习](/guide/ml.html)。

#### 模型训练

通过点击项目设置中"机器学习"页面上的 `Start training（开始训练）` 按钮，或使用 API 调用，手动触发模型训练：

```bash
curl -X POST http://localhost:8080/api/models/train
```
