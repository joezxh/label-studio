---
title: Integrate Label Studio into your machine learning pipeline
short: Machine learning integration
type: guide
tier: all
order: 251
order_enterprise: 251
meta_title: Integrate Label Studio into your machine learning pipeline
meta_description: Machine learning frameworks for integrating your model development pipeline seamlessly with your data labeling workflow.
section: "Machine Learning"
---

你可以使用 ML 后端将你的模型开发流程与数据标注工作流集成。有几种用例，包括：

- **预标注/自动标注数据**：让 ML/AI 模型自主预测标签，然后由人工标注者审查。
- **交互式标注**：将 ML 模型集成到平台中，以帮助人类更高效、更准确地标注或注释大型数据集。
- **模型评估与微调**：标注者审查和分析模型输出，以评估模型准确性并优化性能。

<div class="opensource-only">

!!! error enterprise
    Label Studio Enterprise 提供了一项开箱即用的 LLM 辅助自动标注和模型评估解决方案。根据准确性和成本比较 LLM。更多信息请参阅 [Prompts](https://docs.humansignal.com/guide/prompts_overview)。

</div>

<div class="enterprise-only">

!!! info 提示
    Prompts 是一项开箱即用的 LLM 辅助自动标注和模型评估解决方案。更多信息请参阅 [Prompts](prompts_overview)。

</div>

例如，对于图像分类任务，模型预选一个图像类别供数据标注者验证。对于音频转写，模型显示一个可由数据标注者修改的转写结果。

一旦连接了模型，其工作方式如下：

1. 用户打开任务。
2. Label Studio 将请求发送到 ML 后端。
3. ML 后端用其预测作出响应。
4. 预测被加载到 Label Studio UI 中并显示给标注者。

如果你只需要将静态预标注数据加载到 Label Studio，运行 ML 后端可能对你来说有些过度。相反，你可以 [导入预标注数据](predictions)。

!!! info 提示
    你可以使用 [Label Studio Enterprise 构建自动化主动学习循环](https://docs.humansignal.com/guide/active_learning.html) 与机器学习模型后端。如果你使用 Label Studio 的开源社区版（Community Edition），你可以手动对任务进行排序并检索预测来模拟主动学习过程。

## 设置一个示例 ML 后端

Label Studio ML 后端是一个 SDK，它将你的机器学习代码包装起来并将其变成一个 Web 服务器。该 Web 服务器可以连接到一个正在运行的 Label Studio 实例，以自动化标注任务。我们提供了一个 [示例模型库](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#models)，你可以在自己的工作流中使用，或根据需要进行扩展和自定义。

如果你想编写自己的模型，请参阅 [编写你自己的 ML 后端](ml_create)。

### 前提条件

<div class="opensource-only">

* [Label Studio](install)
* [Docker Compose](https://docs.docker.com/compose/install/)

</div>

<div class="enterprise-only">

* [Label Studio](install_enterprise)
* [Docker Compose](https://docs.docker.com/compose/install/)

</div>

### 启动模型

1. 首先，决定你要使用哪个 [模型](#Example-models) 并检查所需参数（点击每个模型的链接查看完整的参数列表）。

    在你的参数位于模型目录内的 `docker-compose.yml` 文件中设置。

2. 然后将下面命令中的 `{MODEL_NAME}` 替换为适当的目录。

    例如，如果你将 SAM 后端与 [SegmentAnything 模型](https://segment-anything.com/) 一起使用，模型名称将是 `segment_anything_model`，它与 [仓库中的目录名称](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_model) 相匹配：

    ```bash
git clone https://github.com/HumanSignal/label-studio-ml-backend.git
cd label-studio-ml-backend/label_studio_ml/examples/segment_anything_model
docker-compose up
    ```

模型应该在 `http://localhost:9090` 开始运行（如果你使用的是 Docker 容器，[请参阅下面的注释](#localhost-and-Docker-containers)）。你可以通过点击模型旁边溢出菜单中的 **发送测试请求（Send Test Request）**，或使用以下命令来验证：

```bash
> curl http://localhost:9090
{"model_class":"SamMLBackend","status":"UP"}
```

<div class="opensource-only">

如果你看到任何错误，请参阅 [ML 后端故障排查](troubleshooting#ML-backends) 以及 [README 中的故障排查部分](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/README.md#troubleshooting)。

</div>

<div class="enterprise-only">

如果你看到任何错误，请参阅 HumanSignal 支持中心的 [ML 后端与预测故障排查](https://support.humansignal.com/hc/en-us/sections/23627938255117-ML-Backend-Predictions)，并查看 [README 中的故障排查部分](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/README.md#troubleshooting)。

</div>

#### localhost 与 Docker 容器

`localhost` 是一个特殊域名，会直接回环到你的本地环境。

如果你在 Docker 容器中运行 Label Studio，`localhost` 会回环到容器本身，而不是容器所在的主机。Docker 提供了一个特殊域名作为此问题的变通方案，即 host.docker.internal。如果你在 Docker 内部托管 Label Studio 和 ML 后端，请尝试使用该域名而不是 localhost（`http://host.docker.internal:9090`）或内部 IP 地址。

### 将模型连接到 Label Studio

<div class="enterprise-only">

在你 [创建项目](setup_project) 后，打开项目设置并选择 [**模型（Model）**](project_settings_lse#Model)。

</div>

<div class="opensource-only">

在你 [创建项目](setup_project) 后，打开项目设置并选择 [**模型（Model）**](project_settings#Model)。

</div>

点击 **连接模型（Connect Model）** 并填写以下字段：

| 字段 | 描述                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| **名称（Name）**   | 输入模型的名称。                        |
| **后端 URL（Backend URL）**  | 输入模型的 URL。<br /><br />如果你按照上述步骤操作，这将是 `http://localhost:9090`。如果你在 Docker 容器中运行 Label Studio，[请参阅上面的注释](#localhost-and-Docker-containers)。 |
| **选择身份验证方法（Select authentication method）**   | 如果访问模型需要用户名和密码，你可以选择 **基本身份验证（Basic Authentication）** 并在此输入它们。                                     |
| **额外参数（Extra params）**  | 输入任何你想传递给模型的额外参数。                                      |
| **交互式预标注（Interactive preannotations）**  | 启用此选项以允许模型通过在进行任务时提供实时预测或建议来辅助标注过程。<br /><br />换句话说，当你与数据交互时（例如，在图像上绘制区域、高亮文本，或向 LLM 提问），ML 后端会接收此输入并返回基于它的预测。更多信息请参阅下面的 [交互式预标注](#Interactive-pre-annotations)。 |

!!! info 提示
    你也可以 [使用 API 添加 ML 后端](https://api.labelstud.io/api-reference/api-reference/ml/create)。你将需要项目 ID 和机器学习后端 URL。

## 示例模型

[ML 后端仓库](https://github.com/HumanSignal/label-studio-ml-backend) 包含各种示例模型，你可以试验并将其适配到自己的工作流中。

其中一些无需任何额外配置即可工作。请查看 **所需参数（Required parameters）** 列，看看你是否需要设置任何额外参数。如果模型有必需参数，你可以在模型目录内的 `docker-compose.yml` 中设置这些参数。

- **预标注（Pre-annotation）** 列表示模型是否可用于 Label Studio 中的预标注：在打开标注页面或为一批数据运行预测后，你可以看到预标注数据。
- **交互模式（Interactive mode）** 列表示模型是否可用于 Label Studio 中的交互式标注：在执行标注页面上的操作时查看交互式预测。
- **训练（Training）** 列表示模型是否可用于 Label Studio 中的训练：基于提交的标注更新模型状态。

| MODEL_NAME                                                                                 | 描述                                                                                                                               | 预标注 | 交互模式 | 训练 | 所需参数                           |
|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-----------------|------------------|----------|-----------------------------------------------|
| [segment_anything_model](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/segment_anything_model)                 | 由 [Meta](https://segment-anything.com/) 提供的图像分割                                                                               | ❌               | ✅                |   ❌       | 无                                          |
| [llm_interactive](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/llm_interactive)                               | 使用 [OpenAI](https://platform.openai.com/)、Azure LLM 的提示工程。                                                               | ✅               | ✅                | ✅        | OPENAI_API_KEY                                |
| [grounding_dino](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/grounding_dino)                                 | 带提示的对象检测。 [详情](https://github.com/IDEA-Research/GroundingDINO)                                                  | ❌               | ✅                | ❌        | 无                                          |
| [tesseract](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/tesseract)                                           | 交互式 OCR。 [详情](https://github.com/tesseract-ocr/tesseract)                                                                    | ❌               | ✅                | ❌        | 无                                          |
| [easyocr](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/easyocr)                                               | 自动化 OCR。 [EasyOCR](https://github.com/JaidedAI/EasyOCR)                                                                             | ✅               | ❌                | ❌        | 无                                          |
| [spacy](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/spacy)                                                   | 由 [SpaCy](https://spacy.io/) 提供的 NER                                                                                                         | ✅               | ❌                | ❌        | 无                                          |
| [flair](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/flair)                                                   | 由 [flair](https://flairnlp.github.io/) 提供的 NER                                                                                               | ✅               | ❌                | ❌        | 无                                          |
| [bert_classifier](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/bert_classifier)                               | 使用 [Huggingface](https://huggingface.co/transformers/v3.0.2/model_doc/auto.html#automodelforsequenceclassification) 的文本分类 | ✅               | ❌                | ✅        | 无                                          |
| [huggingface_llm](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/huggingface_llm)                               | 使用 [Hugging Face](https://huggingface.co/tasks/text-generation) 的 LLM 推理                                                           | ✅               | ❌                | ❌        | 无                                          |
| [huggingface_ner](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/huggingface_ner)                               | 由 [Hugging Face](https://huggingface.co/docs/transformers/en/tasks/token_classification) 提供的 NER                                             | ✅               | ❌                | ✅        | 无                                          |
| [nemo_asr](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/nemo_asr)                                             | 由 [NVIDIA NeMo](https://github.com/NVIDIA/NeMo) 提供的语音 ASR                                                                               | ✅               | ❌                | ❌        | 无                                          |
| [mmdetection](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/mmdetection-3)                                     | 使用 [OpenMMLab](https://github.com/open-mmlab/mmdetection) 的对象检测                                                              | ✅               | ❌                | ❌        | 无                                          |
| [sklearn_text_classifier](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/sklearn_text_classifier)               | 使用 [scikit-learn](https://scikit-learn.org/stable/) 的文本分类                                                                 | ✅               | ❌                | ✅        | 无                                          |
| [interactive_substring_matching](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/interactive_substring_matching) | 简单的关健词搜索                                                                                                                    | ❌               | ✅                | ❌        | 无                                          |
| [langchain_search_agent](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/langchain_search_agent)                 | 使用 Google 搜索和 [Langchain](https://langchain.com/) 的 RAG 管道                                                                   | ✅               | ✅                | ✅        | OPENAI_API_KEY, GOOGLE_CSE_ID, GOOGLE_API_KEY |

## 允许 ML 后端访问 Label Studio 数据

在大多数情况下，你需要设置环境变量以允许 ML 后端访问 Label Studio 中的数据。

Label Studio 任务可以有多个资源文件来源：

* 直接的 `http` 和 `https` 链接。
    示例：`task['data'] = {"image": "http://example.com/photo_1.jpg"}`

* 使用 **导入（Import）** 操作上传到 Label Studio 的文件。
    示例：`task['data'] = {"image": "https://ls-instance/data/upload/42/photo_1.jpg"}`

* 通过 [本地存储连接](storage_local) 添加的文件。
    示例：`task['data'] = {"image": "https://ls-instance/data/local-files/?d=folder/photo_1.jpg"}`

* 通过 [云存储](storage)（S3、GCS、Azure）连接添加的文件。
    示例：`task['data'] = {"image": "s3://bucket/prefix/photo_1.jpg"}`

当 Label Studio 调用 ML 后端上的 `predict(tasks)` 方法时，它会发送包含指向资源文件的链接的 data 子字典的任务。

从直接的 `http` 和 `https` 链接（上面的第一个示例）下载文件很简单。但是，其他三种类型（导入的文件、本地存储文件、云存储文件）更为复杂。

为了解决这个问题，ML 后端使用了来自 `label_studio_tools` 包的 `get_local_path(url, task_id)` 函数（该包随 `label-studio-ml-backend` 预装）：

```python
from label_studio_tools.core.utils.io import get_local_path

class MLBackend(LabelStudioMLBase)
  def predict(tasks):
    task = tasks[0]
    local_path = get_local_path(task['data']['image'], task_id=task['id'])
    with open(local_path, 'r') as f:
      f.read()
```

`get_local_path()` 函数将 URI 解析为 URL，然后下载并缓存该文件。

为此，你必须在使用 `get_local_path` 之前为 ML 后端指定 `LABEL_STUDIO_URL` 和 `LABEL_STUDIO_API_KEY` 环境变量。如果你使用的是 docker-compose.yml，则必须将这些变量添加到 environment 部分。例如：

```yaml
services:
  ml-backend-1:
    container_name: ml-backend-1
    ...
    environment:
      # 指定 Label Studio URL 和 API key 以访问
      # 上传的、本地存储的和云存储的文件。
      # 不要使用 'localhost'，因为它在 Docker 容器内不起作用。
      # 始终为 URL 使用前缀 'http://' 或 'https://'。
      # 使用 'ifconfig' (Linux/Mac) 或 'ipconfig' (Windows) 确定实际 IP。
      - LABEL_STUDIO_URL=http://192.168.42.42:8080/  # 替换为你的 IP！
      - LABEL_STUDIO_API_KEY=<your-label-studio-api-key>
```

请注意以下几点：

* `LABEL_STUDIO_URL` 必须从 ML 后端实例可访问。

* 如果你在 Docker 中运行 ML 后端，`LABEL_STUDIO_URL` 不能包含 `localhost` 或 `0.0.0.0`。请改用完整的 IP 地址，例如 `192.168.42.42`。你可以使用 `ifconfig`（Unix）或 `ipconfig`（Windows）命令获取此地址。

* `LABEL_STUDIO_URL` 必须以 `http://` 或 `https://` 开头。

要找到你的 `LABEL_STUDIO_API_KEY`，请打开 Label Studio 并转到你的 [用户账户页面](user_account#Access-token)。

<div class="enterprise-only">

请注意，你的用户还必须有权访问你连接 ML 后端所指向的项目。

</div>

## 模型训练

训练模型可以让它从提交的标注中学习，并可能改善其对后续任务的预测。

在你将模型作为机器学习后端连接到 Label Studio 并标注了至少一个任务之后，你就可以开始训练模型。你可以使用自动或手动训练。

<div class="enterprise-only">

从项目设置下的 [**模型（Model）** 页面](project_settings_lse#Model)，点击所连接模型旁边的溢出菜单中的 **开始训练（Start Training）**。这会手动启动训练。如果你想控制模型训练发生的时间（例如在收集了特定数量的标注之后或在某些时间间隔），请使用此操作。

</div>

<div class="opensource-only">

从项目设置下的 [**模型（Model）** 页面](project_settings#Model)，点击所连接模型旁边的溢出菜单中的 **开始训练（Start Training）**。这会手动启动训练。如果你想控制模型训练发生的时间（例如在收集了特定数量的标注之后或在某些时间间隔），请使用此操作。

</div>

你也可以通过编程方式使用以下内容启动训练：

* 从 API，指定机器学习后端的 ID 并运行以下命令：
   ```
   curl -X POST http://localhost:8080/api/ml/{id}/train
   ```
  有关更多内容，请参阅 [训练 API 文档](/api/#operation/api_ml_train_create)。
- [通过 webhooks 触发训练](ml_create#Trigger-training-with-webhooks)。

训练日志出现在 stdout 和控制台中。

要查看更详细的日志，请使用 `--debug` 选项启动 ML 后端服务器。

## 预标注/预测

!!! note
    “predictions”和“预标注（pre-annotations）”这两个术语可互换使用。


### 从模型获取预测

在你将模型连接到 Label Studio 之后，如果模型已经过预训练，或者在它完成 [训练](#Model-training) 后立即，你就可以在标注界面中看到模型预测。

* 要手动添加预测，请转到数据管理器（Data Manager），选择你想要获取预测的任务，然后选择 **操作 > 检索预测（Actions > Retrieve predictions）**。
* 要使用预测自动预标注数据，请转到项目设置并启用 **标注 > 使用预测预标注任务（Annotation > Use predictions to prelabel tasks）**，并确保你已从 **选择你要使用的预测或模型（Select which predictions or which model you want to use）** 下拉菜单中选择了适当的模型。


!!! note
    对于大型数据集，检索预测的 HTTP 请求可能会被超时中断。如果你想 **获取所有预测** 以用于数据集中来自所连接机器学习后端的所有任务，请对每个任务向 Label Studio API 的 [预测端点发出 POST 调用](/api/#operation/api_predictions_create)，以提示机器学习后端为任务创建预测。

如果你想仅为任务列表手动检索预测 **并且仅使用 ML 后端**，请向你的 ML 后端的 `/predict` URL 发出 POST 请求，并附带你想要查看预测的任务的有效载荷，格式如下例：

```json
{
  "tasks": [
    {"data": {"text":"some text"}}
  ]
}
```

### 交互式预标注

使用交互式预标注的 ML 辅助标注适用于使用矩形、椭圆、多边形、笔刷掩码（brush masks）和关键点的图像分割与对象检测任务，以及 HTML 和文本命名实体识别任务。你的 ML 后端必须支持你正在执行的标注类型，识别你创建的输入，并能够用相关的输出响应以进行预测。

在添加模型时启用 **交互式预标注（Interactive preannotations）** 选项，或使用项目设置页面的 **编辑（Edit）** 操作来启用/禁用此选项。

#### 智能工具（Smart tools）

智能工具复制你通过标注配置设置使用的工具（例如矩形），以允许与 ML 后端交互。智能工具目前可用于 [`Rectangle`](/tags/rectangle)、[`Ellipse`](/tags/ellipse)、[`Polygon`](/tags/polygon)、[`KeyPoint`](/tags/keypoint) 和 [`Brush`](/tags/brush) 标签。

智能工具是动态的，可以根据上下文改变行为或外观，利用机器学习预测。例如，智能工具可以自动检测并建议图像中对象的标注，标注者随后可以审查和细化。这可以显著加快标注过程，特别是在处理大型数据集时。

智能工具使用 `context` 根据其当前标注环境状态和手头任务的具体需求来调整其行为。例如，它们可能会根据所标注的数据类型或任务中特定的感兴趣区域来改变其功能。当为标注任务启用智能工具时，它们可以通过将数居发送到 `/predict` 端点来与 ML 后端交互以接收预测。然后这些预测用于在标注界面中提供交互式预标注。更多信息请参阅 [在你的 ML 后端中支持交互式预标注](ml_create#Support-interactive-pre-annotations-in-your-ML-backend)。

例如，当标注者开始标注图像时，智能工具可以将图像发送到 ML 后端，ML 后端对其进行处理并返回建议的标注（如边界框或分割掩码），标注者可以接受、拒绝或细化。这个过程通过提供基于模型当前对数据的理解而来的标注起点，帮助简化标注工作流。

要使用智能工具：

* 如果在标注界面中启用了 **自动标注（Auto-annotation）**，智能工具默认出现。
* 你也可以更新你的标注配置，为你正在执行的标注类型包含 `smart="true"` 选项。
* 如果你 *只* 想让智能选项出现，并且根本不想执行手动标注，请使用 `smartOnly="true"`。

例如：

```<Brush name="brush" toName="img" smart="true" showInline="true"/>```

在你开始标注后，启用 **自动标注（Auto-Annotation）** 以查看并使用智能选项来绘制形状、掩码或指定关键点。

对于图像标注，在启用自动标注后，你可以选择是否 **自动接受标注建议（Auto accept annotation suggestions）**。如果你自动接受标注建议，区域会自动出现并立即创建。如果你不自动接受建议，区域会出现，但你可以手动拒绝或批准它们，无论是单独还是一次性全部。

<br/><img src="/images/predict-owl-region.gif" alt="" class="gif-border" width="800px" height="533px" />

### 删除预测

如果你想从 Label Studio 中删除所有预测，你可以使用数据管理器或 API：
- 对于特定项目，选择你想要删除预测的任务，并从下拉菜单中选择 **删除预测（Delete predictions）**。
- 使用 API，从命令行运行以下命令以删除特定项目 ID 的预测：
```
curl -H 'Authorization: Token <user-token-from-account-page>' -X POST \ 
 "<host>/api/dm/actions?id=delete_tasks_predictions&project=<id>"
```

### 选择向标注者显示哪些预测

<div class="opensource-only">

你可以选择默认向标注者显示哪个模型或预测集。这可在项目设置下的 **标注 > 实时预测（Annotation > Live Predictions）** 中获得。

</div>

<div class="enterprise-only">

你可以选择默认向标注者显示哪个模型或预测集。这可在项目设置下的 **标注 > 实时预测（Annotation > Live Predictions）** 中获得。

</div>

使用下拉菜单选择要在你的标注工作流中使用的模型或预测。
