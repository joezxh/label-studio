---
title: Write your own ML backend
short: Write your own ML backend
type: guide
tier: all
order: 254
order_enterprise: 254
meta_title: Write your own ML backend
meta_description: Set up your machine learning model to output and consume predictions in your data science and data labeling projects. 
section: "Machine Learning"

---

使用 Label Studio ML 后端将 Label Studio 与机器学习模型集成。Label Studio ML 后端是一个 SDK，你可以用它将你的机器学习模型代码包装成一个 Web 服务器。该机器学习服务器使用 [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) 和 [supervisord](http://supervisord.org/)，并使用 [RQ](https://python-rq.org/) 处理后台训练任务。

按照以下步骤使用 Label Studio ML SDK 包装自定义机器学习模型代码，或查看 [我们的示例 ML 后端库](ml_tutorials.html) 以与流行的机器学习框架和工具集成，例如 [Huggingface 的 Transformers](https://huggingface.co/docs/transformers/index)、[OpenAI](https://openai.com/)、[Langchain](https://www.langchain.com/) 等。

有关使用一个 Label Studio 示例后端的信息，请参阅 [设置一个示例 ML 后端](ml#Set-up-an-example-ML-backend)。

<div class="opensource-only">

!!! error enterprise
    Label Studio Enterprise 提供了一项开箱即用的 LLM 辅助标注解决方案。你只需连接我们支持的某个模型即可完成设置。更多信息请参阅 [Prompts](https://docs.humansignal.com/guide/prompts_overview)。

</div>

<div class="enterprise-only">

!!! info 提示
    Prompts 是一项开箱即用的 LLM 辅助标注解决方案。你只需连接我们支持的某个模型即可完成设置。更多信息请参阅 [Prompts](prompts_overview)。

</div>

有关视频教程，请参阅以下内容：

<iframe width="560" height="315" src="https://www.youtube.com/embed/cEwMNOlOUjI?si=sEPTUPOyyzZlA-n5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## 1. 安装 ML 后端仓库

从仓库下载并安装 `label-studio-ml-backend`：

```bash
git clone https://github.com/HumanSignal/label-studio-ml-backend.git
cd label-studio-ml-backend/
pip install -e .
```

## 2. 创建一个空的 ML 后端

```bash
label-studio-ml create my_ml_backend
```

这会创建以下目录结构，你可以修改它以实施你自己的推理逻辑：

```
my_ml_backend/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── model.py
├── _wsgi.py
├── README.md
├── requirements-base.txt
├── requirements-test.txt
├── requirements.txt
└── test_api.py
```

其中：

* `Dockerfile`、`docker-compose.yml` 和 `.dockerignore` 用于通过 Docker 运行 ML 后端。
* `model.py` 是你可以实现自己的训练和推理逻辑的主文件。
* `_wsgi.py` 是一个用于通过 Docker 运行 ML 后端的辅助文件（你无需修改它）。
* `README.md` 必须包含有关如何运行 ML 后端的说明。
* `requirements.txt` 是你放置 Python 依赖项的地方。
* `requirements_base.txt` 和 `requirements_test.txt` 是基本依赖（你无需修改）。
* `test_api.py` 是你放置模型测试的地方。


## 3. 实现预测逻辑

在你的模型目录中，找到 `model.py` 文件（例如 `my_ml_backend/model.py`）。

`model.py` 文件包含一个继承自 `LabelStudioMLBase` 的类声明。这个类为 Label Studio 用于与 ML 后端通信的 API 方法提供了包装器。你可以重写这些方法以实现你自己的逻辑：

```python
def predict(self, tasks, context, **kwargs):
    """Make predictions for the tasks."""
    return predictions
```

`predict` 方法用于对任务进行预测。它使用以下内容：

- `tasks`：[JSON 格式的 Label Studio 任务](task_format)
- `context`：[JSON 格式的 Label Studio 上下文](#Support-interactive-pre-annotations-in-your-ML-backend) —— 用于交互式标注场景
- `predictions`：[JSON 格式的预测数组](export#Raw-JSON-format-of-completed-tasks)

一旦你实现了 `predict` 方法，你就可以在 Label Studio 中看到来自所连接 ML 后端的预测。

### 在你的 ML 后端中支持交互式预标注

如果你想在你的机器学习后端中支持交互式预标注，请使用 `predict()` 方法编写推理调用。有关为文本标注项目执行此操作的示例，请参阅 [这个子串匹配代码示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/interactive_substring_matching)。

完成以下步骤：

1. 如上所述，使用 `predict()` 方法定义推理调用。`predict()` 方法接收任务数据和上下文数据：
  - `tasks` 参数包含有关正在被预标注的任务的详细信息。请参阅 [JSON 格式的 Label Studio 任务](task_format)。
  - `context` 参数包含有关在 Label Studio 中执行的标注操作的详细信息，例如，以 [Label Studio 标注结果格式](export#Label-Studio-JSON-format-of-annotated-tasks) 发送的突出显示文本字符串。

    `context` 具有以下属性。
    - `annotation_id`：标注 ID。
    - `draft_id`：草稿标注 ID。
    - `user_id`：用户 ID。
    - `result`：这是标注结果，但它包含一个可由用户更改的 `is_positive: true` 标志。例如，通过按 **Alt** 键并使用关键点（keypoints）在 UI 中与图像交互。

2. 使用从 Label Studio 接收的任务和上下文数据，构建预测。
3. 返回 [Label Studio 预测格式](predictions.html#Format-pre-annotations-for-Label-Studio) 中的结果，该格式根据所执行的标注类型而有所不同。

有关 NER 标注项目如何执行此操作的更多详细信息，请参阅上面链接的代码示例。

有关启用预标注的更多信息，请参阅 [交互式预标注](ml#Interactive-pre-annotations)。


## 4. 实现训练逻辑（可选）

你还可以实现 `fit` 方法来训练你的模型。`fit` 方法通常用于在已标注数据上训练模型，尽管它也可用于任何需要数据持久化的任意操作（例如，将标注数据存储在数据库中、保存模型权重、保留 LLM prompts 历史记录等）。

默认情况下，每当 Label Studio 中发生数据操作时（例如创建新任务或更新标注）都会调用 `fit` 方法。你可以使用 [Webhooks](webhooks) 修改此行为。

要实现 `fit` 方法，你需要重写 `model.py` 文件中的 `fit` 方法：

```python
def fit(self, event, data, **kwargs):
    """Train the model on the labeled data."""
    old_model = self.get('old_model')
    # write your logic to update the model
    self.set('new_model', new_model)
```

其中：

- `event`：事件类型。可以是 `'ANNOTATION_CREATED'`、`'ANNOTATION_UPDATED'` 等。
- `data`：从事件接收的有效载荷（请参阅 [Webhook 事件参考](webhook_reference)）。

此外，还有两个辅助方法可用于在 ML 后端中存储和检索数据：

- `self.set(key, value)` - 在 ML 后端中存储数据
- `self.get(key)` - 从 ML 后端检索数据

这两个方法都可以在 ML 后端代码的其他地方使用，例如在 `predict` 方法中获取新模型权重。

### 通过 webhooks 触发训练

从 Label Studio 1.4.1 版本开始，当你向项目添加 ML 后端时，Label Studio 会创建一个指向你的 ML 后端的 webhook，以便在每次创建或更新标注时发送事件。

默认情况下，webhook 事件的有效载荷不包含标注本身。你可以 [修改 Label Studio 发送的 webhook 事件](webhooks) 以发送完整有效载荷，或者使用 [按 ID 获取标注的端点](/api#operation/api_annotations_read)、[SDK](sdk.html) 的 [按 ID 获取任务方法](https://labelstud.io/sdk/project.html#label_studio_sdk.project.Project.get_task)，或通过检索你设置的 [目标存储](storage) 中的标注来获取标注。

有关 webhook 事件的更多详细信息，请参阅 [标注 webhook 事件参考](webhook_reference#Annotation-Created)。


### 其他方法和参数

`LabelStudioMLBase` 类中还提供其他方法和参数：

- `self.label_interface` - 返回包含有关标注任务的所有信息的 Label Studio 标注界面（Label Interface）对象。
- `self.model_version` - 返回当前模型版本。

## 4. 确保 ML 后端可以访问 Label Studio 数据

如果你的数据存储在云端、本地目录中，或已导入到 Label Studio，你将需要设置 `LABEL_STUDIO_URL` 和 `LABEL_STUDIO_API_KEY` 环境变量。

更多信息，请参阅 [允许 ML 后端访问 Label Studio 数据](ml#Allow-the-ML-backend-to-access-Label-Studio-data)。

## 5. 运行 ML 后端服务器

要通过 Docker Compose 运行：

   ```bash
   docker-compose up
```

ML 后端服务器可在 `http://localhost:9090` 访问。当你 [将 ML 后端连接到 Label Studio](ml#Connect-the-model-to-Label-Studio) 时，可以使用此 URL。

!!! note
    `localhost` 是一个特殊域名，会直接回环到你的本地环境。对于 Docker 托管的容器，这会回环到容器本身，而不是容器所在的主机。Docker 提供了一个特殊域名作为此问题的变通方案，即 docker.host.internal。如果你在 Docker 内托管 Label Studio 和 ML 后端，请尝试使用该域名而不是 localhost。（`http://host.docker.internal:9090`）


### 不使用 Docker 运行

要在没有 docker 的情况下运行（例如，用于调试目的），你可以使用以下命令：

```bash
pip install -r my_ml_backend
label-studio-ml start my_ml_backend
```

### 修改主机和端口

要修改主机和端口，请使用以下命令行参数：

```bash
label-studio-ml start my_ml_backend -p 9091 --host 0.0.0.0
```

### 测试你的 ML 后端

修改 `my_ml_backend/test_api.py` 以确保你的 ML 后端按预期工作。

## 6. 将 ML 后端连接到 Label Studio

你可以使用 API 或 **设置 > 模型（Settings > Model）**。更多信息，请参阅 [将模型连接到 Label Studio](ml#Connect-the-model-to-Label-Studio)。
