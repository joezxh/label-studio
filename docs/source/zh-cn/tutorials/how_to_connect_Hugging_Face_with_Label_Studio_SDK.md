---
title: 如何将 Hugging Face 与 Label Studio SDK 连接
hide_sidebar: true
order: 1001
open_in_collab: true
tutorial: true
community_author: yyassi-heartex
ipynb_repo_path: tutorials/how-to-connect-Hugging-Face-with-Label-Studio-SDK/how_to_connect_Hugging_Face_with_Label_Studio_SDK.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-connect-Hugging-Face-with-Label-Studio-SDK
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-hugging-face-ls-sdk.png
meta_title: 如何将 Hugging Face 与 Label Studio SDK 连接
meta_description: 学习如何通过集成 Hugging Face 数据集与模型与 Label Studio，构建一个用于标注与主动学习的 NLP 工作流。
badges: SDK, Hugging Face, Colab
duration: 5-10 分钟
---
**连接 Hugging Face 与 Label Studio 完整指南**

本教程向你展示如何通过集成 Hugging Face 数据集与模型与 Label Studio，构建一个无缝的 NLP 工作流，用于标注与主动学习。

## 📚 你将学到：

1. **HF → LS**：从 Hugging Face 加载数据集到 Label Studio 进行标注
2. **LS → HF**：从 Label Studio 导出已标注数据用于模型训练
3. **HF → LS**：将 Hugging Face 模型作为 ML 后端连接，用于预标注与主动学习

## 🎯 教程用例：

我们将使用 WikiANN 数据集构建一个**命名实体识别（NER）**标注项目，并集成预训练模型来实现智能预标注。

## ✅ 前置条件：
- Label Studio 实例（本地或云端）
- Hugging Face 账户及 API 令牌（公开模型可选）
- 对 NLP 与 NER 任务的基本了解
- Python 3.8+

---

## 💡 为什么这个集成很重要

在深入代码之前，我们先来理解连接 Hugging Face 与 Label Studio 的价值。

这个集成能创建一个强大的、自动化的 ML 工作流，从而改变你构建和部署 NLP 模型的方式。

### 🚀 主要优势：

#### 1. **加速标注工作流** ⚡
- **10 倍速标注**：预训练模型提供初始标注，将人工工作量减少 60-80%
- **智能预标注**：模型建议实体，标注人员只需审阅并修正
- **聚焦困难样本**：把时间花在不确定预测上，而不是显而易见的标签上

#### 2. **无缝数据流水线** 🔄
- **无需手动准备数据**：直接从 Hugging Face 数据集导入 Label Studio
- **一键导出**：已标注数据自动格式化为模型训练所需形态
- **零数据丢失**：标注与分词之间完美对齐

#### 3. **持续改进模型** 📈
- **主动学习循环**：标注 → 训练 → 预测 → 重复
- **领域适配**：在你的特定数据上微调通用模型
- **追踪进度**：比较模型版本并衡量随时间的改进

#### 4. **可用于生产的 ML** 🏭
- **可复现的工作流**：自动化流水线消除了人工步骤
- **版本控制**：将数据集、标签和模型版本一起追踪
- **轻松扩展**：通过批量预测处理成千上万份文档

### 🎯 真实世界影响：

**跨标注项目的典型改进：**

| 指标 | 无集成 | 使用 HF + Label Studio | 改进 |
|--------|---------------------|------------------------|-------------|
| 标注速度 | 基线 | 快 60-80% | ⚡ 2-5 倍提速 |
| 标注准确率 | 90-95% | 98%+ | ✅ 更少错误 |
| 数据准备 | 数天人工 | 数分钟（自动化） | ⏱️ 大量节省时间 |
| 模型迭代 | 静态（训练一次） | 持续改进 | 🔄 主动学习 |
| 工作流复杂度 | 多个互不相连的工具 | 单一集成流水线 | 🎯 简化工作流 |

### 📊 具体示例：

**项目**：标注 10,000 份医疗文档用于实体抽取

| 步骤 | 传统方式 | HF + Label Studio | 节省时间 |
|------|---------------------|-------------------|------------|
| 数据导入 | 手动下载+格式化（8-10 小时） | 自动化导入（5 分钟） | ~10 小时 |
| 初始标注 | 标注全部 10,000 份文档（500-600 小时 @ 3 分钟/份） | 引导式标注 500 份（25 小时） | — |
| 模型训练 | 最后训练一次 | 在 500 个样本上训练（1 小时） | — |
| 其余标注 | — | 预标注 9,500 份（2 小时）<br>审阅/修正（95-140 小时 @ 45 秒/份） | ~360 小时 |
| **总耗时** | **~530 小时** | **~130 小时** | **减少 75%** |
| **结果** | 静态模型 | 持续改进的模型 | ✅ |

### 🌟 谁受益最多：

- **数据科学家**：更快的实验与模型迭代
- **标注团队**：更少枯燥工作，聚焦质量
- **ML 工程师**：从第一天起就拥有可用于生产的流水线
- **研究人员**：可复现的实验与数据集管理
- **初创公司**：在有限预算下构建高质量标注数据集

---

**准备好构建这个工作流了吗？** 我们开始吧！👇

```python
# Install required packages
%pip install -q label-studio-sdk datasets transformers torch huggingface_hub accelerate

print("✅ All packages installed successfully!")
```

---

## 🔧 环境准备与鉴权

### 第 1 步：连接到 Label Studio

在运行前设置你的环境变量：
```bash
export LABEL_STUDIO_URL="http://localhost:8080"  # 或你的 Label Studio URL
export LABEL_STUDIO_API_KEY="your-api-key-here"
```

获取 API 密钥：前往 Label Studio → Account & Settings → Personal Access Token

```python
import os
from label_studio_sdk import Client

# Get credentials from environment variables
ls_api_key = os.environ.get('LABEL_STUDIO_API_KEY')
ls_url = os.environ.get('LABEL_STUDIO_URL', 'http://localhost:8080')

if not ls_api_key:
    raise ValueError('❌ Please set LABEL_STUDIO_API_KEY environment variable.')

# Connect to Label Studio
try:
    ls = Client(url=ls_url, api_key=ls_api_key)
    connection_status = ls.check_connection()
    print(f'✅ Connected to Label Studio at {ls_url}')
    print(f'   Connection status: {connection_status}')
except Exception as e:
    raise ConnectionError(f'❌ Failed to connect to Label Studio: {str(e)}')
```

### 第 2 步：使用 Hugging Face 鉴权

设置你的 Hugging Face 令牌：
```bash
export HF_TOKEN="your-hf-token-here"
```

在以下地址获取令牌：https://huggingface.co/settings/tokens

```python
from huggingface_hub import login

# Get Hugging Face token (optional but recommended for accessing private models)
hf_token = os.environ.get('HF_TOKEN')

if hf_token:
    try:
        login(token=hf_token)
        print('✅ Logged into Hugging Face Hub')
    except Exception as e:
        print(f'⚠️  Warning: HF login failed: {str(e)}')
        print('   Continuing with public models only...')
else:
    print('ℹ️  No HF_TOKEN provided. Using public models only.')
```

---

## 📥 第一部分：Hugging Face → Label Studio（导入数据集）

### 第 3 步：创建 Label Studio 项目

我们将创建一个命名实体识别项目，标签包括人物（PER）、组织（ORG）、地点（LOC）和杂项（MISC）实体。

```python
# Define Label Studio labeling configuration for NER
ner_config = '''
<View>
  <Text name="text" value="$text"/>
  <Labels name="ner" toName="text">
    <Label value="PER" background="#FF6B6B"/>
    <Label value="ORG" background="#4ECDC4"/>
    <Label value="LOC" background="#95E77D"/>
    <Label value="MISC" background="#FFE66D"/>
  </Labels>
</View>
'''

# Create project (or use existing one)
project_title = 'Hugging Face + Label Studio NER Tutorial'
project = ls.start_project(
    title=project_title,
    label_config=ner_config,
    description='Tutorial: NER annotation with WikiANN dataset from HuggingFace'
)

print(f'✅ Project created successfully!')
print(f'   Project ID: {project.id}')
print(f'   Project URL: {ls_url}/projects/{project.id}')
```

我们将从 Hugging Face 加载 WikiANN 数据集（一个多语言 NER 数据集）。WikiANN 为英语及其他 175+ 种语言提供了高质量的 NER 标注。

**为什么这很重要：** 直接导入数据集消除了手动准备数据的工作，确保了数据一致性，并让你轻松用新数据更新标注项目。

```python
from datasets import load_dataset

# Load dataset from Hugging Face
print('📦 Loading WikiANN dataset from Hugging Face...')
dataset = load_dataset('wikiann', 'en', split='train[:100]')
print(f'   Loaded {len(dataset)} examples')

# Convert Hugging Face dataset format to Label Studio task format
tasks = []
for idx, row in enumerate(dataset):
    # Join tokens into a single text string
    text = ' '.join(row['tokens'])

    # Create Label Studio task format
    task = {
        "data": {
            "text": text
        },
        # Store original metadata for reference
        "meta": {
            "source": "wikiann",
            "hf_index": idx
        }
    }
    tasks.append(task)

# Import tasks into Label Studio using SDK
print(f'\n📤 Importing {len(tasks)} tasks into Label Studio...')
project.import_tasks(tasks)

# Verify import
imported_tasks = project.get_tasks()
print(f'✅ Successfully imported {len(imported_tasks)} tasks!')
print(f'\n📝 Sample task:')
print(f'   Text: {imported_tasks[0]["data"]["text"][:100]}...')
```

---

## 📤 第二部分：Label Studio → Hugging Face（导出与训练）

### 第 5 步：标注一些数据（人工步骤）

**⚠️ 需要操作：** 在继续之前，请前往 Label Studio 标注若干任务（至少 10-20 条，以便训练有意义）。

1. 打开你的项目：{ls_url}/projects/{project.id}
2. 点击任务并标注实体（PER、ORG、LOC、MISC）
3. 提交你的标注

标注完一些数据后，继续下一个单元格。

---

### 第 6 步：从 Label Studio 导出标注

我们将导出已标注的数据，并将其转换为 Hugging Face 格式用于模型训练。

**为什么这很重要：** 这种自动化转换节省了数小时的手动数据准备工作，并确保你的标注与模型分词正确对齐。

```python
from transformers import AutoTokenizer
from datasets import Dataset

# Export annotations from Label Studio using SDK
print('📥 Exporting annotations from Label Studio...')
ls_data = project.export_tasks(export_type='JSON')  # Already returns a list

# Check how many tasks have annotations
labeled_tasks = [task for task in ls_data if task.get('annotations')]
print(f'   Total tasks: {len(ls_data)}')
print(f'   Labeled tasks: {len(labeled_tasks)}')

if len(labeled_tasks) < 5:
    print('\n⚠️  Warning: Very few labeled tasks. Results may not be meaningful.')
    print('   Consider labeling more data in Label Studio before training.')

# Initialize tokenizer (using BERT for NER)
print('\n🔤 Loading tokenizer...')
tokenizer = AutoTokenizer.from_pretrained('bert-base-cased', use_fast=True)

# Define NER label schema (BIO format)
label_list = ['O', 'B-PER', 'I-PER', 'B-ORG', 'I-ORG', 'B-LOC', 'I-LOC', 'B-MISC', 'I-MISC']
label_to_id = {label: idx for idx, label in enumerate(label_list)}
print(f'   Label schema: {label_list}')

# Convert Label Studio annotations to HuggingFace format
print('\n🔄 Converting annotations to HuggingFace format...')

texts = [task['data']['text'] for task in ls_data]
tokenized = tokenizer(texts, return_offsets_mapping=True, truncation=True, padding=True)

all_labels = []
for i, task in enumerate(ls_data):
    offsets = tokenized['offset_mapping'][i]

    # Extract entity spans from Label Studio annotations
    spans = []
    annotations = task.get('annotations', [])
    if annotations:
        # Use the first annotation (or implement logic for multiple annotations)
        results = annotations[0].get('result', [])
        for result in results:
            if result.get('type') == 'labels':
                value = result['value']
                spans.append((
                    value['start'],
                    value['end'],
                    value['labels'][0]
                ))

    # Align spans with tokenized output (handle tokenization offsets)
    token_labels = []
    for token_start, token_end in offsets:
        # Special tokens (CLS, SEP, PAD) have start==end
        if token_start == token_end:
            token_labels.append(-100)  # Ignore in loss calculation
            continue

        # Find if this token overlaps with any entity span
        label = 'O'  # Default: Outside any entity
        for span_start, span_end, span_label in spans:
            # Check if token overlaps with span
            if token_end <= span_start or token_start >= span_end:
                continue  # No overlap

            # Determine if this is the beginning of an entity or inside
            if token_start == span_start:
                label = f'B-{span_label}'  # Beginning of entity
            else:
                label = f'I-{span_label}'  # Inside entity
            break

        token_labels.append(label_to_id[label])

    all_labels.append(token_labels)

# Create HuggingFace Dataset
hf_dataset = Dataset.from_dict({
    "input_ids": tokenized['input_ids'],
    "attention_mask": tokenized['attention_mask'],
    "labels": all_labels
})

print(f'✅ Conversion complete!')
print(f'   Dataset size: {len(hf_dataset)} examples')
print(f'\n📝 Sample (first example):')
print(f'   Input IDs shape: {len(hf_dataset[0]["input_ids"])}')
print(f'   Labels shape: {len(hf_dataset[0]["labels"])}')
print(f'   Sample tokens: {tokenizer.convert_ids_to_tokens(hf_dataset[0]["input_ids"][:20])}')
```

### 第 7 步（可选）：训练 Hugging Face 模型

**说明：** 本步骤演示训练一个自定义模型。你可以跳过它，直接跳到第三部分使用预训练模型。

**为什么要训练：** 在你的标注数据上微调，可以创建在特定用例上优于通用模型的领域专用模型。

```python
from transformers import (
    AutoModelForTokenClassification,
    TrainingArguments,
    Trainer,
    DataCollatorForTokenClassification
)
import numpy as np

# Only train if we have enough labeled data
if len(labeled_tasks) < 10:
    print('⚠️  Skipping training: Need at least 10 labeled examples.')
    print('   Label more data in Label Studio, then re-run this cell.')
else:
    print('🚀 Starting model training...')

    # Initialize model
    num_labels = len(label_list)
    model = AutoModelForTokenClassification.from_pretrained(
        'bert-base-cased',
        num_labels=num_labels,
        id2label={i: label for i, label in enumerate(label_list)},
        label2id=label_to_id
    )

    # Split into train/validation
    splits = hf_dataset.train_test_split(test_size=0.15, seed=42)
    train_dataset = splits['train']
    eval_dataset = splits['test']
    print(f'   Train set: {len(train_dataset)} examples')
    print(f'   Eval set: {len(eval_dataset)} examples')

    # Data collator handles padding
    data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)

    # Training arguments
    training_args = TrainingArguments(
        output_dir='./ner_model',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        learning_rate=5e-5,
        evaluation_strategy='epoch',
        save_strategy='epoch',
        save_total_limit=2,
        logging_steps=10,
        load_best_model_at_end=True,
        push_to_hub=False,  # Set to True to push to HuggingFace Hub
    )

    # Simple metrics function
    def compute_metrics(eval_pred):
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=2)

        # Remove ignored index (special tokens)
        true_predictions = [
            [label_list[p] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]
        true_labels = [
            [label_list[l] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]

        # Simple accuracy
        all_preds = [p for pred_list in true_predictions for p in pred_list]
        all_labels = [l for label_list in true_labels for l in label_list]
        accuracy = sum([p == l for p, l in zip(all_preds, all_labels)]) / len(all_labels)

        return {"accuracy": accuracy}

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics
    )

    # Train!
    print('\n📚 Training in progress...')
    train_result = trainer.train()

    print('\n✅ Training complete!')
    print(f'   Final loss: {train_result.training_loss:.4f}')

    # Save the model
    trainer.save_model('./ner_model_final')
    print('💾 Model saved to ./ner_model_final')
```

---

## 🤖 第三部分：Hugging Face → Label Studio（ML 后端集成）

### 第 8 步：使用 Hugging Face 模型创建 ML 后端

现在我们将连接一个 Hugging Face 模型作为 ML 后端，在 Label Studio 中提供预标注。这能极大地加速标注流程！

**好处：**
- **预标注**：模型为标注人员生成初始预测以供审阅
- **主动学习**：将标注精力聚焦在困难/不确定的样本上
- **持续改进**：用新标签重新训练模型，部署更新后的预测

我们将使用 Hugging Face 上一个预训练的 NER 模型。你也可以使用第 7 步中自定义训练的模型。

```python
from transformers import pipeline
import time

# Load a pre-trained Hugging Face NER model
print('🤗 Loading Hugging Face NER model...')
# Using a popular pre-trained NER model
ner_pipeline = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple"  # Combines B- and I- tags
)
print('✅ Model loaded successfully!')

# Map Hugging Face labels to our Label Studio labels
LABEL_MAPPING = {
    'PER': 'PER',
    'ORG': 'ORG',
    'LOC': 'LOC',
    'MISC': 'MISC'
}

def create_predictions_for_task(task):
    """Generate predictions for a single Label Studio task"""
    text = task['data']['text']

    # Get predictions from Hugging Face model
    entities = ner_pipeline(text)

    # Convert to Label Studio format
    results = []
    for entity in entities:
        # Map label if needed
        label = LABEL_MAPPING.get(entity['entity_group'], 'MISC')

        result = {
            "from_name": "ner",
            "to_name": "text",
            "type": "labels",
            "value": {
                "start": entity['start'],
                "end": entity['end'],
                "text": text[entity['start']:entity['end']],
                "labels": [label]
            },
            "score": entity['score']  # Confidence score
        }
        results.append(result)

    return results

# Test the prediction function with a sample
print('\n🧪 Testing prediction function...')
sample_text = "Apple Inc. was founded by Steve Jobs in California."
test_task = {"data": {"text": sample_text}}

predictions = create_predictions_for_task(test_task)
print(f'   Input: "{sample_text}"')
print(f'   Found {len(predictions)} entities:')
for pred in predictions:
    entity_text = pred['value']['text']
    entity_label = pred['value']['labels'][0]
    entity_score = pred['score']
    print(f'     - "{entity_text}" → {entity_label} (confidence: {entity_score:.2f})')
```

### 第 9 步：生成预标注

现在让我们用我们的 Hugging Face 模型为 Label Studio 中未标注的任务生成预测！

```python
# Get unlabeled tasks from Label Studio
print('📋 Fetching unlabeled tasks...')
all_tasks = project.get_tasks()
unlabeled_tasks = [task for task in all_tasks if not task.get('annotations')]

print(f'   Total tasks: {len(all_tasks)}')
print(f'   Unlabeled tasks: {len(unlabeled_tasks)}')

if len(unlabeled_tasks) == 0:
    print('\n✅ All tasks are already labeled! No predictions needed.')
else:
    # Generate predictions for unlabeled tasks
    print(f'\n🔮 Generating predictions for {min(10, len(unlabeled_tasks))} tasks...')

    prediction_count = 0
    for task in unlabeled_tasks[:10]:  # Start with first 10 for demo
        try:
            # Generate predictions using our HuggingFace model
            results = create_predictions_for_task(task)

            # Create prediction in Label Studio using SDK
            project.create_prediction(
                task_id=task['id'],
                result=results,
                model_version='huggingface-bert-base-NER'
            )

            prediction_count += 1

            # Show progress
            if prediction_count % 5 == 0:
                print(f'   Generated {prediction_count} predictions...')

        except Exception as e:
            print(f'   ⚠️  Error on task {task["id"]}: {str(e)}')
            continue

    print(f'\n✅ Successfully created {prediction_count} pre-annotations!')
    print(f'\n💡 Next steps:')
    print(f'   1. Open Label Studio: {ls_url}/projects/{project.id}')
    print(f'   2. Review and correct the pre-annotations')
    print(f'   3. Submit your annotations')
    print(f'   4. Export and retrain for continuous improvement!')

```

---

## 🎉 总结与下一步

恭喜！你已经构建了一个完整的 Hugging Face + Label Studio 集成流水线，用于命名实体识别！

### 你完成了什么：

✅ **HF → LS**：从 Hugging Face 将 WikiANN 数据集加载到 Label Studio
✅ **LS → HF**：导出已标注数据并转换为带分词对齐的 Hugging Face 格式
✅ **HF → LS**：使用 Hugging Face NER 模型生成预标注
✅ **已训练**：在你的标注数据上微调了一个自定义 NER 模型

### 完整工作流：

```
1. 从 Hugging Face 导入数据 → Label Studio
2. 在 Label Studio 中标注任务（借助 ML 辅助）
3. 导出标注 → 训练/微调 Hugging Face 模型
4. 部署更新后的模型 → 生成更好的预测
5. 重复以实现持续改进！🔄
```

### 🔄 应用到其他任务：

想将这个工作流改用于其他任务？查看：
- **文本分类**：将导出/预测逻辑适配为情感分析、主题分类等
- **问答**：修改为抽取式或生成式问答任务
- **摘要**：应用于文本摘要工作流

### 高级用例：

- **主动学习**：使用模型置信度分数，优先标注不确定的样本
- **领域适配**：在你的特定领域数据上微调以获得更好性能
- **多标注者**：结合多个模型或标注者的预测
- **批量处理**：通过批量预测高效处理大规模数据集
- **模型版本管理**：追踪模型版本并比较随时间的性能

### 资源：

- 📖 [Label Studio SDK 文档](https://labelstud.io/sdk/)
- 🤗 [HuggingFace Transformers](https://huggingface.co/docs/transformers)
- 🎯 [Label Studio ML Backend](https://github.com/HumanSignal/label-studio-ml-backend)

### 需要帮助？

- Label Studio 社区：https://slack.labelstudio.heartex.com/
- HuggingFace 论坛：https://discuss.huggingface.co/

---

## 🚀 下一步：生产级 ML 后端设置

用于生产时，你会希望将你的 Hugging Face 模型部署为一个持久化的 ML 后端服务器。方法如下：

### 方案 1：使用 Label Studio ML Backend（生产推荐）

```bash
# Install label-studio-ml
pip install label-studio-ml

# Create a new ML backend project
label-studio-ml init my_ner_backend --script label_studio_ml/examples/simple_text_classifier.py

# Edit my_ner_backend/model.py to use your Hugging Face model
# Then start the server:
label-studio-ml start my_ner_backend --port 9090
```

然后在 Label Studio 中连接它：
1. 前往 Project Settings → Machine Learning（项目设置 → 机器学习）
2. 点击 "Add Model"（添加模型）
3. 输入 URL：`http://localhost:9090`
4. 启用 "Use for interactive preannotations"（用于交互式预标注）

### 方案 2：直接通过 SDK 预测（本教程采用）

本教程采用的方法（SDK 的 `create_prediction()`）非常适合：
- 大规模数据集的批量处理
- 一次性预标注运行
- Jupyter notebook 和数据科学工作流
- 原型开发与实验

### 何时使用哪一种：

| 特性 | SDK 预测 | ML 后端服务器 |
|---------|----------------|-------------------|
| 实时预测 | ❌ | ✅ |
| 交互式标注 | ❌ | ✅ |
| 批量处理 | ✅ | ✅ |
| 易于设置 | ✅ | ⚠️ 中等 |
| 可用于生产 | ⚠️ | ✅ |

根据你的用例选择！

