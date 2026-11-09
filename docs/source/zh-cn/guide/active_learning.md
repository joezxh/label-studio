---
title: 使用 Label Studio 设置主动学习
short: 主动学习循环
tier: enterprise
type: guide
order: 0
order_enterprise: 257
meta_title: 使用 Label Studio 设置主动学习循环
meta_description: 使用 Label Studio 和 ML 后端 SDK 与 webhook 设置端到端的主动学习循环，以执行模型训练、预测和标注。
section: "机器学习"
---

按照本教程使用 Label Studio 设置主动学习循环。

使用 Label Studio Enterprise 版与机器学习模型后端构建自动化的主动学习循环。如果你使用 Label Studio 的开源社区版，可以手动排序任务并获取预测来模拟主动学习过程。如果你使用的是 Label Studio 社区版，请参阅如何[手动管理你的主动学习循环](#Set-up-manual-active-learning)。


## 关于主动学习

为有监督机器学习模型创建带标注的训练数据可能既昂贵又耗时。主动学习是机器学习的一个分支，旨在通过**策略性地采样能提供问题新见解的观测数据，来最小化需要标注的数据总量**。

具体而言，主动学习算法旨在从一批未标注数据中，使用**预测分数**选择多样化且信息量大的数据进行标注，而不是随机选择观测数据。有关主动学习的更多实践内容，请阅读[我们的 HumanSignal CTO 在 Towards Data Science 上发表的这篇文章](https://towardsdatascience.com/learn-faster-with-smarter-data-labeling-15d0272614c4)。

## 设置自动化的主动学习循环

使用 Label Studio 持续训练并审查来自已连接机器学习模型的预测。

<br/><img src="/images/LS-active-learning.png" alt="Diagram of the active learning workflow described in surrounding text" class="gif-border" width="800px" height="472px" />

用户在 Label Studio 中创建标注后，配置的 webhook 会将一条包含所创建标注信息的消息发送到机器学习后端。ML 后端的 `fit()` 方法运行以训练模型。当用户继续下一个标注任务时，Label Studio 从 ML 后端获取该任务的最新预测，该后端对任务运行 `predict()` 方法。

要设置此主动学习，请执行以下操作： 
1. [将 ML 模型设置为用于主动学习的 ML 后端](#Set-up-an-ML-model-as-an-ML-backend-for-active-learning)。
2. [将用于获取预测的 ML 后端连接到 Label Studio](#Connect-the-ML-backend-to-Label-Studio-for-active-learning)。
3. [配置 webhook 以向 ML 后端发送训练事件（可选）](#Configure-webhooks-to-send-a-training-event-to-the-ML-backend-(optional))。 
4. [使用预测分数设置任务采样](#Set-up-task-sampling-with-prediction-scores)。
5. [标注任务](#Label-the-tasks)。 

在你标注任务时，Label Studio 会向你的机器学习后端发送 webhook 事件并提示其重新训练。随着模型重新训练，最新模型版本的预测会显示在 Label Studio 中。

## 将 ML 模型设置为用于主动学习的 ML 后端

[将示例机器学习模型设置为 ML 后端](ml#Set-up-an-example-ML-backend)，或[创建自定义机器学习模型](ml_create)。

## 将 ML 后端连接到 Label Studio 用于主动学习

按照步骤[将模型连接到 Label Studio 项目](ml#Connect-the-model-to-Label-Studio)，并确保启用了 **Start model training on annotation submission**（提交标注时开始模型训练）设置。这会在每次标注提交或更新后向后端发送训练请求。

## 配置 webhook 以向 ML 后端发送训练事件（可选）

默认情况下，Label Studio 会在每次创建或更新标注时通知你的 ML 后端，以便其开始训练以响应。

如果你愿意，可以将项目设置为发送 webhook 事件，并使用该事件和负载来驱动 ML 后端中特定于事件的训练逻辑。如果你想自定义发送到 ML 后端的事件和负载，请执行以下操作：

1. 在 Label Studio UI 中，打开你要用于主动学习的项目。
2. 点击 **设置 > Webhooks**。
3. 点击 **添加 Webhook**。 
4. 添加以下 URL 作为你的 **Payload URL（负载 URL）**：`http://localhost:9090/webhook`
5. （可选）保持 **Send payload**（发送负载）选项启用。ML 后端不需要负载，但你可以将其用于代码中以检索项目相关的详细信息，例如可用于检索数据的项目 ID、基于项目设置定义训练超参数、检索项目状态，或其他详细信息。
6. 禁用 **Send for all actions**（为所有操作发送）选项，并启用 **Annotation created**（标注已创建）和 **Annotation updated**（标注已更新）。
7. 点击 **添加 Webhook**。 

有关 webhook 事件负载的更多详细信息，请参阅[标注 webhook 的完整负载详情](webhook_reference.html#Annotation-Created)。

## 使用预测分数设置任务采样

为了最大化机器学习模型的训练效率和效果，你希望标注者专注于标注那些模型预测分数最不自信、或最不确定的任务。为此，请[设置不确定性任务采样](project_settings_lse#task-sampling)。

## 标注任务 

在项目数据管理器上，选择 **Label All Tasks**（标注所有任务）以开始标注。

随着你的模型重新训练并且新版本在 Label Studio 中更新，展示给标注者的任务始终是预测分数最低（即模型确定性最低）的任务。任务的预测对应于最新的模型版本。

## 自定义你的主动学习循环

如果你想更改主动学习循环的行为，可以进行手动更改。

- 通过修改推理调用自定义模型产生的预测分数。有关详细信息和示例代码，请参阅[使用你的 ML 后端进行预测](#Make-predictions-with-your-ML-backend)。 
- 要更改用于向标注者显示预测的模型版本，请在机器学习设置中更新。请参阅[选择要向标注者显示哪些预测](ml#Choose-which-predictions-to-display-to-annotators)。
- 如果你想在模型重新训练后删除所有预测，请参阅如何[删除预测](ml.html#Delete-predictions)。
- 如果需要检索并保存所有任务的预测，请参阅[从模型检索预测](ml.html#Get-predictions-from-a-model)的建议。

### 设置手动主动学习 

如果你使用的是 Label Studio 社区版，数据标注者无法体验实时的主动学习循环。你可以通过执行以下操作来模拟主动学习体验：
1. 手动[从模型检索预测](ml.html#Get-predictions-from-a-model)。
2. [在数据管理器中按预测分数对任务排序](manage_data.html#Example-Sort-by-prediction-score)。
3. 标注任务时选择 **Label Tasks As Displayed**（按显示顺序标注任务）。 

这种手动主动学习循环不会随着 ML 后端在每次新标注时训练并产生新预测而自动更新展示给标注者的任务顺序。因此，你可以执行一种批量形式的主动学习，而不是实时自动化主动学习：你先进行一段时间的标注，停下来训练模型，然后检索新预测并再次开始标注任务。
