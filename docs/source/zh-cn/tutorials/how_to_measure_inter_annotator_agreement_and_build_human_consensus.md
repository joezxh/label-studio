---
title: "如何用 Label Studio 衡量标注者间一致性并构建人类共识"
hide_sidebar: true
order: 1004
open_in_collab: true
tutorial: true
community_author: hakan458
ipynb_repo_path: tutorials/how-to-measure-inter-annotator-agreement-and-build-human-consensus/how_to_measure_inter_annotator_agreement_and_build_human_consensus.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-measure-inter-annotator-agreement-and-build-human-consensus
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-inter-annotator-agreement-and-consensus.png
meta_title: "如何用 Label Studio 衡量标注者间一致性并构建人类共识"
meta_description: 学习如何使用 Label Studio SDK 衡量标注者间一致性、构建人类共识、建立真实参考并比较模型预测。
is_enterprise: true
is_starter_cloud: true
badges: SDK, Agreement, Colab
duration: 5-10 分钟
---

本教程将带你走通一个实用工作流，用 Label Studio SDK 衡量标注者间一致性（inter-annotator agreement）、构建人类共识、建立真实参考（ground truth），并将模型预测与该共识进行比较。

能够衡量不同标注者、真实参考与模型之间的一致性，可以帮助你了解标注者/模型的性能，并帮助你做出明智的决策，最终在项目里获得更高质量的标签。

**为什么这很重要**
- 减少歧义：低一致性会暴露不清晰的指令和主观的边界案例，便于修复。
- 提升标签质量：共识强度是真实参考的一个实用置信度信号。
- 有的放矢地做 QA：把审阅集中在有争议的任务和标注者组合上，而不是大海捞针。
- 公平的模型评估：将模型与人类共识比较，而不是与单一评分者比较，以避免评估者偏差。
- 更快的迭代：量化可靠性、优先修复、并衡量随时间的改进。

**在本教程中你将**
- 导入带有重叠（overlap）的数据，并（为 demo 起见）模拟多个标注者。
- 计算 IAA 和逐任务共识（多数投票），以建立真实参考。
- 将一个模型与人类共识比较，标记低一致性和分歧项，并将它们批量分配给 QA。
- 可视化结果并总结可靠性，以指导下一步。

**产出**
- 逐任务共识 + 一致率（置信度代理）
- 模型相对人类共识的对齐分数
- 用于重新标注/审阅的有针对性的 QA 任务列表

**说明：**
- 我们在此提供了从零创建数据集的步骤，但你可以跳过这些步骤，直接使用已有的项目。
- 填入你的 Label Studio URL 和 API 密钥。

## Label Studio 要求

本教程展示了 Label Studio 付费产品中才提供的一项或多项功能。我们建议[创建一个 Starter Cloud 试用](https://app.humansignal.com/user/cloud-trial?offer=d9a5&) 来跟随本教程。

## 安装依赖

```python
!pip install -q label-studio-sdk pandas numpy seaborn scikit-learn matplotlib
```

## 导入库

```python
import os
import json
import random
from typing import Dict, List, Any, Tuple
from collections import Counter, defaultdict

import pandas as pd
import numpy as np

import matplotlib.pyplot as plt
import seaborn as sns

from label_studio_sdk import LabelStudio
from label_studio_sdk.types import ImportApiRequest, PredictionRequest
from label_studio_sdk.projects.assignments import AssignmentsBulkAssignRequestSelectedItemsIncluded
```

## 1) 连接到 Label Studio

用你的信息替换占位符

```python
# URL of your Label Studio instance
BASE_URL = "https://app.humansignal.com"

# Your API key (find it in Account & Settings > Personal Access Token)
API_KEY = "YOUR API KEY"

ls = LabelStudio(base_url=BASE_URL, api_key=API_KEY)
```

## 2) 创建项目（或使用已有项目）

我们将创建一个带有主观任务（毒性严重程度）的项目，这类任务受益于多个人类判断。
你可以把这份标注配置换成另一个主观任务，例如讽刺检测、幽默评分，或主题相关性。

```python
LABEL_CONFIG = """
<View>
  <Text name="text" value="$text"/>
  <Choices name="toxicity" toName="text" choice="single" showInLine="true">
    <Choice value="Non-toxic"/>
    <Choice value="Somewhat toxic"/>
    <Choice value="Very toxic"/>
  </Choices>
  <Style> .lsf-labels .lsf-choices__item { padding: 6px 10px; } </Style>
  <Choices name="flag" toName="text" choice="single" showInLine="true" visibleWhen="region-selected=false" perRegion="false">
    <Choice value="Needs QA"/>
  </Choices>
</View>
"""

PROJECT_TITLE = "Agreement & Consensus Tutorial"
```

### 创建项目

```python
project = ls.projects.create(
    title=PROJECT_TITLE,
    label_config=LABEL_CONFIG,
    description=(
        "Subjective toxicity severity labeling with multiple annotators to measure agreement and build consensus."
    ),
    show_collab_predictions=True,
    maximum_annotations=3,  # allow up to 3 annotations per task
    is_published=True,
)
```

### 或者按 ID 获取项目

```python
# Uncomment and replace project ID with the one you wish to use
# project = ls.projects.get(id=1)
```

### 确认我们使用的是正确的项目

```python
print(f"Using project ID {project.id}: {project.title}")
```

## 3) 导入数据（如果是新建项目）

```python
texts = [
    "I can't believe you think that's acceptable.",
    "Great job on the release, really proud of the team!",
    "You're clueless."
    "",
    "This comment is borderline rude, but maybe not intended.",
    "That post was hilarious, I loved it.",
    "This is the worst idea I've ever heard.",
    "Please refrain from using that tone here.",
    "I appreciate your perspective though we disagree.",
    "What a mess; whoever wrote this didn't think it through.",
]

tasks = [{"data": {"text": t}} for t in texts]
```

```python
response = ls.projects.import_tasks(
    id=project.id,
    request=tasks,
    commit_to_project=True,
    return_task_ids=True,
)
```

### 确保任务已创建
如果导入上面的数据，应该有 9 个任务

```python
tasks = [t for t in ls.tasks.list(project=project.id)]
```

```python
print(f"There are {len(tasks)} tasks in project {project.title}")
```

## 4) 创建或获取标注者

### 如需创建标注者用户
如果你的项目中已有标注，跳过此步骤

```python
current_user = ls.users.get_current_user()
org = current_user.active_organization
```

```python
annotator1 = ls.users.create(first_name="Annotator", last_name="1", username="Annotator1", email="annotator1@mycompany.com")
annotator2 = ls.users.create(first_name="Annotator", last_name="2", username="Annotator2", email="annotator2@mycompany.com")
annotator3 = ls.users.create(first_name="Annotator", last_name="3", username="Annotator3", email="annotator3@mycompany.com")
```

```python
ls.organizations.members.update(id=org, user_id=annotator1.id, role="AN")
ls.organizations.members.update(id=org, user_id=annotator2.id, role="AN")
ls.organizations.members.update(id=org, user_id=annotator3.id, role="AN")
```

### 或者获取已有的标注者

```python
# Replace user IDs with annotators from your organization
annotator1 = ls.users.get(id=31228)
annotator2 = ls.users.get(id=13061)
annotator3 = ls.users.get(id=11551)
```

## 5) 为任务创建标注
这将为项目中的每个任务创建 3 个标注。这会模拟出某些任务上的强共识，以及其他任务上的分歧。<br>
__* 如果你使用的是已经带有标注的已有项目，请跳过此步骤。__

```python
annotator_ids = [annotator1.id, annotator2.id, annotator3.id]
# Will be used in agreement matrix step
annotator_id_to_initials = {annotator1.id: annotator1.initials, annotator2.id: annotator2.initials, annotator3.id: annotator3.initials}
```

```python
def to_annotation_result(label: str, from_name: str = "toxicity", to_name: str = "text") -> List[Dict[str, Any]]:
    """
    Helper function that takes a single label and returns a full result dict
    """
    return [
        {
            "from_name": from_name,
            "to_name": to_name,
            "type": "choices",
            "value": {"choices": [label]},
        }
    ]
```

```python
for idx, task in enumerate(tasks):
    # Define label pattern by index
    if idx % 3 == 0:
        # strong consensus
        labels = ["Non-toxic", "Non-toxic", "Non-toxic"]
    elif idx % 3 == 1:
        # no consensus (all different)
        labels = ["Non-toxic", "Somewhat toxic", "Very toxic"]
    else:
        # weak consensus (2 vs 1)
        labels = ["Somewhat toxic", "Very toxic", "Very toxic"]

    for i, lab in enumerate(labels):
        kwargs: Dict[str, Any] = {"result": to_annotation_result(lab)}
        if annotator_ids:
            kwargs["completed_by"] = annotator_ids[i % len(annotator_ids)]
        ls.annotations.create(id=task.id, **kwargs)
```

## 6) 衡量并分析一致性
Label Studio Starter Cloud 和 Label Studio Enterprise 提供了多种功能，让你在不同层级查看一致性。我们将从项目级统计开始，逐步深入到更详细统计。

### 获取项目级一致性
这是项目中所有任务的平均一致分<br>
让你从高层获得整体一致性的直观感受

```python
response = ls.projects.stats.total_agreement(id=project.id)
print(f"Total Agreement for Project: {response.total_agreement*100:.2f}%")
```

### 获取标注者级一致性
这是某个特定标注者跨所有任务的平均一致分。<br>
这可以告诉你单个标注者与项目中其他人的一致程度。<br>
例如这里我们可以看到标注者 2 与其他所有标注者之间的一致性更高。

```python
response = ls.projects.stats.agreement_annotator(id=project.id, user_id=annotator1.id)
print(f"Annotator Agreement for {annotator1.email}: {response.agreement_per_annotator*100:.2f}%")
```

```python
response = ls.projects.stats.agreement_annotator(id=project.id, user_id=annotator2.id)
print(f"Annotator Agreement for {annotator2.email}: {response.agreement_per_annotator*100:.2f}%")
```

### 标注者一致性矩阵
使用 IAA（标注者间一致性）可以获取项目中标注者的矩阵，并查看特定标注者之间彼此的一致程度。

```python
response = ls.projects.stats.iaa(id=project.id)
```

```python
# Plot the matrix as a table
iaa_matrix = np.array(response.iaa, dtype=float)
user_labels = [annotator_id_to_initials[u] for u in (response.users or list(range(1, iaa_matrix.shape[0] + 1)))]

# Create percentage text, hide diagonal (self-agreement)
cell_text = []
for i in range(iaa_matrix.shape[0]):
    row = []
    for j in range(iaa_matrix.shape[1]):
        row.append("—" if i == j else f"{iaa_matrix[i, j] * 100:.0f}%")
    cell_text.append(row)

fig_w = 1.5 + 0.9 * len(user_labels)
fig_h = 1.2 + 0.7 * len(user_labels)
fig, ax = plt.subplots(figsize=(fig_w, fig_h))
ax.axis("off")

table = ax.table(
    cellText=cell_text,
    rowLabels=user_labels,
    colLabels=user_labels,
    cellLoc="center",
    loc="center",
)
table.auto_set_font_size(True)
#table.set_fontsize(15)
table.scale(1.5, 2)

ax.set_title("Inter-Annotator Agreement (IAA)")
plt.show()
```

通过这里，我们可以看到不同标注者之间彼此的一致程度，哪些标注者共识更强、哪些则不强。这可以让你了解标注者性能，并让你基于这些数据做出决策，例如将某些标注者从项目中移除，或者将更多任务分配给一致性高的标注者。

## 7) 将低一致性任务路由给进一步标注
使用任务级一致性值来识别低于可配置阈值的条目，并将它们批量分配给额外的标注（AN）。这对于在模糊条目上强化共识很有用。

```python
tasks = ls.tasks.list(project=project.id)
```

```python
# Set a threshold for low agreement to filter tasks that we want to re-annotate - 50% for this example but in a real world project it would likely be higher
low_agreement_threshold = 0.5
```

```python
tasks_to_reannotate = []
for task in tasks:
    if task.agreement < low_agreement_threshold:
        tasks_to_reannotate.append(task.id)
```

**说明**：这个批量分配调用要求我们要分配到的用户已经登录并使用过平台。如果你是用上面的编程流程创建用户，我们只能分配给 current_user。如果你获取的是已有的标注者，我们可以分配给其中之一（annotator1、annotator2、annotator3）<br>
为了让这个调用对所有使用本教程的人都可用，我们将把它们分配给当前用户

```python
current_user_id = ls.users.get_current_user().id
selected = AssignmentsBulkAssignRequestSelectedItemsIncluded(all_=False, included=tasks_to_reannotate)
resp = ls.projects.assignments.bulk_assign(
    id=project.id,
    type="AN",  # assign for additional annotation , also possible to assign for review using "RE"
    users=[current_user_id],
    selected_items=selected,
)
```

## 8) 获取任务级一致性并建立真实参考
我们可以获取任务级的一致性，它将帮助我们基于标注者共识来建立真实参考

```python
tasks = ls.tasks.list(project=project.id)
```

```python
# Configure threshold to consider a task as high consensus and add an annotation as ground truth - for this example we will use 100%
gt_threshold = 1.0
for task in tasks:
    if task.agreement >= gt_threshold:
        annotations = ls.annotations.list(id=task.id)
        # Add new GT annotation so we can compare each annotator to GT individually
        ls.annotations.create(id=task.id, result=annotations[0].result, ground_truth=True)
```

## 9) 标注者-真实参考一致性
无论你选择如何往项目中添加真实参考——将标注者与真实参考比较，能让你真正理解标注者的性能。<br>
将某个标注者与其他标注者比较，可以让你了解其性能，但与真实参考比较是标注者最有价值的指标之一。<br>
例如，这可以让你知道哪些标注者可能需要更多关于如何在本项目中正确标注任务的培训或教育。

```python
# Ensure we have the latest stats calculated
response = ls.projects.stats.update_stats(id=project.id, stat_type="stats")
```

```python
response = ls.projects.stats.user_ground_truth_agreement(id=project.id, user_pk=annotator1.id)
print(f"Annotator-Ground Truth Agreement for {annotator1.email}: {response.agreement*100:.2f}%")
```

```python
response = ls.projects.stats.user_ground_truth_agreement(id=project.id, user_pk=annotator2.id)
print(f"Annotator-Ground Truth Agreement for {annotator2.email}: {response.agreement*100:.2f}%")
```

```python
response = ls.projects.stats.user_ground_truth_agreement(id=project.id, user_pk=annotator3.id)
print(f"Annotator-Ground Truth Agreement for {annotator3.email}: {response.agreement*100:.2f}%")
```

## 10) 模型-标注者一致性
将模型预测与标注者和/或真实参考进行比较，是了解你的模型表现如何的有用方法。<br>

### 添加预测
在 Label Studio 中有很多方式为项目添加预测，例如连接模型、使用提示词，或手动导入。<br>
在本例中，我们将直接导入到项目中。
我们将为每个任务添加一个预测

```python
# Get all tasks
tasks = ls.tasks.list(project=project.id)
```

```python
# Possible predictions
labels = ["Non-toxic", "Somewhat toxic", "Very toxic"]
```

```python
model_version1 = "model-v1"
model_version2 = "model-v2"
```

```python
# For each task, create a prediction from model-v1 , always outputting "Non-Toxic"
for task in tasks:
    ls.predictions.create(
        task=task.id,
        model_version=model_version1,
        result=to_annotation_result(labels[0])
    )

# For each task, create a prediction from model-v2 , always outputting "Somewhat toxic"
for task in tasks:
    ls.predictions.create(
        task=task.id,
        model_version=model_version2,
        result=to_annotation_result(labels[2])
    )
```

### 获取模型与真实参考之间的一致性
帮助你轻松理解你的模型相对真实参考任务的表现<br>

```python
response = ls.projects.stats.model_version_ground_truth_agreement(id=project.id, model_version=model_version1)
print(f"Agreement between {model_version1} and ground truth: {response.agreement*100:.2f}%")
```

```python
response = ls.projects.stats.model_version_ground_truth_agreement(id=project.id, model_version=model_version2)
print(f"Agreement between {model_version2} and ground truth: {response.agreement*100:.2f}%")
```

### 获取模型与所有标注者之间的一致性
帮助你了解你的模型与标注者的一致程度<br>

```python
response = ls.projects.stats.model_version_annotator_agreement(id=project.id, model_version=model_version1)
print(f"Agreement between {model_version1} and all annotators: {response.agreement*100:.2f}%")
```

```python
response = ls.projects.stats.model_version_annotator_agreement(id=project.id, model_version=model_version2)
print(f"Agreement between {model_version2} and all annotators: {response.agreement*100:.2f}%")
```

### 获取一个模型与所有其他模型之间的一致性
帮助你理解模型之间的一致性<br>
在本例中，我们创建了来自 2 个不同模型的预测，且两个模型每个任务输出的标签都不同，因此一致率将为 0%

```python
response = ls.projects.stats.model_version_prediction_agreement(id=project.id, model_version=model_version1)
print(f"Agreement between {model_version1} and all other models: {response.average_prediction_agreement_per_model*100:.2f}%")
```
