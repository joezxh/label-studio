---
title: Prompts overview and use cases
short: Overview and use cases
tier: enterprise
type: guide
order: 0
order_enterprise: 225
meta_title: Prompts overview
meta_description: An overview of the Prompts feature on the HumanSignal platform
section: Prompts
date: 2024-05-15 14:30:14
---

使用 Prompts 来评估和完善你的 LLM prompts，然后生成预测以自动化你的标注流程。

你开始所需的所有内容只是一个 LLM 部署 API 密钥和一个项目。

借助 Prompts，你可以：

* 大幅提高标注的速度和效率，将主题专家（SMEs）转变为高效的数据科学家，同时减少对非主题专家人工标注者的依赖。
* 提升标注吞吐量、准确性和一致性，使流程更快且更具可扩展性。
* 使用户能够充分利用 AI 驱动文本标注的潜力，为数据标注的效率和创新性树立新标准。
* 利用主题专业知识快速引导（bootstrap）项目打上标签，从而缩短通往机器学习开发的时间。
* 让你的主题专家将时间集中在更高级的任务上，而不是被重复的手动工作所拖累。

## 功能、要求与约束

<div class="noheader rowheader">

| 功能 | 支持情况 |
| --- | --- |
| **支持的数据类型** | 文本 <br>图像<br><br>**注意：** 图像仅在你通过云存储上传时才受支持。 |
| **支持的对象标签** | `Text` <br>`HyperText` <br>`Image` |
| **支持的控件标签** | `Choices`（文本和图像）<br>`Labels`（文本）<br>`TextArea`（文本和图像）<br>`Pairwise`（文本和图像）<br>`Number`（文本和图像）<br>`Rating`（文本和图像） |
| **支持的基础模型** | 请参阅 [支持的基础模型](prompts_keys#Supported-base-models) |
| **类别选择** | 多选（LLM 可以为每个任务应用多个标签） |
| **文本兼容性** | 任务文本必须是 utf-8 兼容的 |
| **任务大小** | 每个任务的总大小不能超过 1MB（大约 200-500 页文本） |
| **网络访问** | 如果你使用了防火墙或限制了对 OpenAI 模型的网络访问，你需要允许以下 IP：<br>3.219.3.197 <br>34.237.73.3 <br>4.216.17.242 |
| **所需权限** | **所有者、管理员、经理** —— 可以创建 Prompt 模型并使用自动标注更新项目。经理只能将模型应用于他们已经是成员的项目。<br><br>**审查者和标注者** —— 无权访问 Prompts 工具，但可以在项目内查看 prompts 生成的预测（取决于你的 [项目设置](project_settings_lse)）。 |
| **ML 后端支持** | Prompts 不应与连接到 ML 后端的项目一起使用，因为这会影响某些评估指标的计算方式。 |
| **企业版 vs. 开源版** | Label Studio Enterprise <br />Starter Cloud |

</div>

!!! note
    关于在本地部署（on-prem）环境中安装 Prompts 的信息，请参阅 [安装 Prompts](install_prompts)。

## 用例

### 使用 Prompts 自动标注（Auto-labeling with Prompts）

Prompts 允许你利用 LLM 快速生成准确的预测，从而实现对数千个任务的即时标注。

通过利用 AI 来处理大部分标注工作，你可以显著提高数据标注工作流的效率和速度。在处理需要一致且准确标注的大型数据集时，这一点尤其有价值。将此过程自动化可减少了对人工标注者的依赖，这不仅降低了人力成本，还最大限度地减少了人为错误和偏差。借助 AI 从所提供的真实标签标注中学习的能力，你可以保持数据集的高度准确性和一致性，确保为训练机器学习模型提供高质量的标注数据。

#### 工作流

1. 如果你还没有，请创建一个项目并导入基于文本的数据集。

    * [创建项目](setup_project)
    * [从外部存储同步数据](storage)
2. 标注一部分任务，尽可能多地将它们标记为真实标签标注。用于 prompt 评估的数据越多，你对结果就越有信心。

    如果你想跳过此步骤，请参阅下面概述的 [引导式用例](#Bootstrapping-projects-with-Prompts)。

    * [标注指南](labeling)
    * [为项目定义真实标签标注](quality#Define-ground-truth-annotations-for-a-project)
    * [博客 - 什么是真实标签数据集？](https://humansignal.com/blog/what-s-a-ground-truth-dataset/)
3. 前往 Prompts 页面并创建一个新的 Prompt。如果你还没有，你还需要添加一个 API 密钥以连接到你的模型。

    * [创建一个 Prompt](prompts_create)
    * [模型提供商密钥](prompts_keys)
4. 编写一个 prompt 并针对你的真实标签数据集对其进行评估。

    * [起草一个 prompt](prompts_draft)
5. 当你的 prompt 返回的整体准确度可以接受时，你可以选择将其应用到项目中的其余任务。

    * [从 prompt 生成预测](prompts_predictions)

![Diagram of auto-labeling workflow](/images/prompts/prompter-diagram.png)

### 使用 Prompts 引导项目（Bootstrapping projects with Prompts）

在此用例中，你不需要真实标签标注集。你可以使用 Prompts 为任务生成预测，而无需为其生成的预测返回准确度分数。

此用例非常适合那些希望启动新计划而无需初始创建大量真实标签标注负担的组织，让你能够立即开始分析和利用你的数据。这对于时间紧迫或资源有限的项目尤其有益。

通过生成预测并将其转换为标注，你还可以快速构建一个带标签的数据集，然后可以在主题专家的帮助下随着时间的推移对其进行完善和改进。这种方法加速了项目启动阶段，使实验和迭代更快。

此外，此工作流为持续扩展数据集提供了一种可扩展的解决方案，确保随着项目的发展，新数据可以被高效地集成和标注。

!!! note
    即使你已经拥有真实标签标注，你仍然可以遵循此用例。你将可以选择一个任务样本集而不考虑真实标签数据。

#### 工作流

1. 如果你还没有，请创建一个项目并导入基于文本的数据集。

    * [创建项目](setup_project)
    * [从外部存储同步数据](storage)
2. 前往 Prompts 页面并创建一个新的 Prompt。如果你还没有，你还需要添加一个 API 密钥以连接到你的模型。

    * [创建一个 Prompt](prompts_create)
    * [模型提供商密钥](prompts_keys)
3. 编写一个 prompt 并针对你的任务样本运行它。
    * [起草一个 prompt](prompts_draft)

当你运行你的 prompt 时，会为所选样本创建预测（这可以是项目任务的一部分或全部）。从这里你有几个选项：

* 继续处理你的 prompt，并在每次针对样本运行时生成新的预测。
* 返回项目并开始审查你的预测。如果你将预测转换为标注，你可以使用主题专家和标注者开始与这些标注进行交互。
* 在审查标注时，你可以识别真实标签。有了真实标签数据集，你可以使用其准确度分数进一步完善你的 prompt。

![Diagram of bootstrap workflow](/images/prompts/boostrap-diagram.png)

### Prompt 评估与微调（Prompt evaluation and fine-tuning）

当你针对真实标签标注评估你的 prompt 时，将为你 prompt 的每个版本提供一个准确度分数。你可以使用它来迭代你的 prompt 版本，以提升 [清晰度、具体性和上下文](prompts_draft#Drafting-effective-prompts)。

![Screenshot of accuracy score](/images/prompts/accuracy_score.png)

这个准确度分数提供了一种可衡量的方式来评估和细化你的 prompt 的性能。通过跟踪准确度，你可以确保 LLM 生成的自动标签与真实标签数据一致。

这个反馈循环使你能够迭代地微调你的 prompts，优化预测的准确度并提升数据标注流程的整体可靠性。在数据准确性直接影响决策和运营效率的行业中，这种能力是无价的。

#### 工作流

1. 如果你还没有，请创建一个项目并导入基于文本的数据集。

    * [创建项目](setup_project)
    * [从外部存储同步数据](storage)
2. 标注一部分任务，尽可能多地将它们标记为真实标签标注。用于 prompt 评估的数据越多，你对结果就越有信心。

    * [标注指南](labeling)
    * [为项目定义真实标签标注](quality#Define-ground-truth-annotations-for-a-project)
    * [博客 - 什么是真实标签数据集？](https://humansignal.com/blog/what-s-a-ground-truth-dataset/)
3. 前往 Prompts 页面并创建一个新的 Prompt。如果你还没有，你还需要添加一个 API 密钥以连接到你的模型。

    * [创建一个 Prompt](prompts_create)
    * [模型提供商密钥](prompts_keys)
4. 编写一个 prompt 并针对你的真实标签数据集对其进行评估。

    * [起草一个 prompt](prompts_draft)
5. 继续迭代和细化你的 prompt，直到达到可接受的准确度分数。

![Diagram of fine-tuning workflow](/images/prompts/tuning-diagram.png)
