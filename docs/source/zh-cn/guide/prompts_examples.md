---
title: Prompts examples
short: Examples
tier: enterprise
type: guide
order: 0
order_enterprise: 236
meta_title: Prompts examples
meta_description: Example use cases for Prompts
section: Prompts
date: 2025-01-15 12:11:22
---

## 示例项目类型

### 文本分类（Text classification）

文本分类是基于文本内容为文本片段分配预定义类别或标签的过程。这涉及分析文本并确定哪个类别或标签最能描述其主题、情感或目的。目标是以一种使文本数据更易于分析、搜索和利用的方式来组织和分类文本数据。

文本分类标注任务在许多应用中都是基础性的，它能够实现高效的数据组织、改善可搜索性，并通过数据分析提供有价值的洞察。一些示例包括：

* **垃圾邮件检测（Spam Detection）**：将电子邮件分类为“spam（垃圾邮件）”或“ham（非垃圾邮件）”。
* **情感分析（Sentiment Analysis）**：将用户评论分类为“positive（正面）”、“negative（负面）”或“neutral（中性）”。
* **主题分类（Topic Categorization）**：将文章分配到“politics（政治）”、“sports（体育）”、“technology（科技）”等类别。
* **支持工单分类（Support Ticket Classification）**：根据问题类型（如“billing（账单）”、“technical support（技术支持）”或“account management（账户管理）”）对客户支持工单进行标注。
* **内容审核（Content Moderation）**：识别并标注社交媒体平台上的不当内容，例如“offensive language（攻击性语言）”、“hate speech（仇恨言论）”或“harassment（骚扰）”。

### 命名实体识别（NER）

命名实体识别（NER）标注任务涉及识别并分类文本中的命名实体，例如人物、组织、地点、日期以及其他专有名词。目标是用预定义的类别标注这些实体，使文本更易于分析和理解。NER 常用于信息抽取、文本摘要和内容分类等任务。

例如，在句子“Heidi Opossum goes grocery shopping at Aldi in Miami”中，NER 任务将涉及将“Aldi”识别为地点或组织，“Heidi Opossum”识别为人（尽管严格来说，她是一只标志性的负鼠），以及将“Miami”识别为地点。一旦完成标注，这些结构化数据可用于多种用途，例如改善搜索功能、组织信息，或为更复杂的自然语言处理任务训练机器学习模型。

NER 标注对于金融、医疗和法律服务等行业至关重要，在这些行业中，准确的实体识别有助于从大量文本中提取关键信息、改善决策并自动化工作流。

一些示例包括：

* **新闻与媒体监测**：媒体机构使用 NER 自动标记和分类新闻文章中的人物、组织和地点等实体。这有助于组织新闻内容，实现高效的搜索和检索，并生成摘要或报告。
* **情报与风险分析**：通过从可疑活动报告或通信中提取人物姓名、组织、IP 地址和金融交易等实体，组织可以更好地评估风险并检测欺诈或犯罪活动。
* **专业文档审查**：一旦完成训练，NER 可以帮助提取行业特定的关键实体，以便更好地审查、搜索和分类文档。
* **客户反馈与产品评论**：从客户反馈或评论中提取产品名称、公司或服务等命名实体。这使 businesses 能够基于特定产品、人员或地区对反馈进行分类和分析，帮助他们做出数据驱动的改进。

### 文本摘要（Text summarization）

文本摘要涉及将大量信息浓缩成简洁、有意义的摘要。

可以训练或微调模型以识别文档中的关键信息，并生成保留核心思想而省略不太关键细节的摘要。这种能力在当今信息密集的环境中尤其有价值，各领域的专业人员常常被海量文本数据所淹没。

一些示例包括：

* **客户支持与反馈分析**：公司会收到大量客户支持工单、评论和反馈，这些内容往往重复或冗长。自动标注可以帮助总结这些输入，聚焦于核心问题或主题，例如“billing issues（账单问题）”或“technical support（技术支持）”。
* **新闻聚合与媒体监测**：新闻机构和媒体监测平台需要高效处理和分发新闻故事。自动标注可以在为文章打上“politics（政治）”、“economy（经济）”或“health（健康）”等标签的同时总结文章，使用户更容易找到相关故事。
* **文档摘要**：专业人员常常需要快速理解冗长合同、研究论文和文件的关键点。
* **教育内容摘要**：教育者和电子学习平台需要将复杂材料提炼成学生易懂的摘要。自动标注可以总结关键主题，并将其分类到“concept（概念）”、“example（示例）”或“important fact（重要事实）”等标签下。

### 图像描述与分类（Image captioning and classification）

图像描述涉及为图像应用描述性文本。这在各个行业都有宝贵的应用，特别是在需要对视觉内容进行系统化组织、分析或使其可访问的情况下。

你也可以使用 Prompts 自动将图像分类到预定义的类别中，确保大型图像数据集的标注一致性。

一些示例包括：

* **电子商务产品目录**：在线零售商经常处理数千张需要描述其外观、特征或类别的产品图片。
* **数字资产管理（DAM）**：管理大型图像库的公司（如营销团队、媒体机构或创意机构）可以使用自动标注为其资产添加描述、标签和分类。
* **内容审核与分析**：托管用户生成内容的平台可以使用图像描述来分析和描述上传的视觉内容。这有助于检测不当内容、对帖子进行分类（例如“带有日落效果的户外风景”），并向用户展示相关内容。你可能还希望训练一个模型将图像上传分类到“safe（安全）”、“explicit（露骨）”或“spam（垃圾邮件）”等类别。
* **视障用户的可访问性**：图像描述为视障用户提供了图片的描述性替代文本（alt-text），使网站、应用程序或文档上的数字内容更易于访问。例如，一张猫玩毛线球的图片可能会生成描述：“一只毛茸茸的橙色猫在玩蓝色的毛线球”。

!!! info 提示
    你可以使用 `valueList` 参数在每个任务中包含一个图像系列。有关 `valueList` 的使用示例，请参阅 [此模板](/templates/multi-page-document-annotation)。

## 示例演练

### 自动标注图像描述

此示例演示如何设置 Prompts 来预测图像描述。

1. 通过 [云存储](storage) 导入图像数据，[创建一个新 Label Studio 项目](setup_project)。

    如果你愿意，可以使用 [https://data.heartex.net](https://data.heartex.net) 生成数据集来测试此过程。

!!! note
    Prompts 目前不支持以原始图像形式上传的图像数据。仅支持图像引用（指向图像的 HTTP URI）或通过云存储导入的图像。

2. 为图像描述创建一个 [标注配置](setup)（或让 Ask AI 为你创建一个），例如：

```xml
<View>
  <Image name="image" value="$image"/>
  <Header value="Describe the image:"/>
  <TextArea name="caption" toName="image" placeholder="Enter description here..."
            rows="5" maxSubmissions="1"/>
</View>
```
3. 从侧边栏导航到 **Prompts**，并为该项目 [创建一个 prompt](prompts_create)：

    如果你尚未设置要使用的 API 密钥，请现在设置：[API keys](prompts_keys)。

4. 添加你希望提供给 LLM 用于描述图像的指令。例如：

    *Explain the contents of the following image: `{image}`*

!!! note
    请确保在你的指令中包含 `{image}`。点击指令字段上方的 `image` 以插入它。

!!! info 提示
    你也可以使用 [**增强 Prompt（Enhance Prompt）** 操作](prompts_draft#Enhance-prompt) 自动生成指令。在使用此操作之前，你必须至少添加变量名 `{image}`，然后点击 **保存**。

    ![Screenshot pointing to Enhance Prompt action](/images/prompts/example_enhance_prompt.png)

5. 运行 prompt！查看预测以接受或修正。

    你可以 [阅读更多关于评估指标的内容](prompts_draft#Evaluation-results) 以及评估 prompt 表现的方法。

!!! info 提示
    你可以更改正在使用的数据子集（例如，仅包含真实标签标注的数据，或一小部分记录样本）。

    ![Screenshot pointing to subset dropdown](/images/prompts/example_subset.png)

6. 接受 [将预测作为标注](prompts_predictions#Create-annotations-from-predictions)！

### 评估 LLM 输出的毒性（toxicity）

此示例演示如何设置 Prompts 来评估 LLM 生成的输出文本是否被归类为有害、攻击性或不当。

1. 通过导入 LLM 生成输出的文本数据，[创建一个新 Label Studio 项目](setup_project)。

    例如：你可以使用 [jigsaw_toxicity](https://huggingface.co/datasets/tasksource/jigsaw_toxicity) 数据集作为示例。有关如何预处理（并可选地）下采样此数据集以配合本指南使用，请参阅 [附录](#Appendix-Generate-dataset)。

2. 为毒性检测创建一个 [标注配置](setup)（或让 Ask AI 为你创建一个），例如：

```xml
<View>
  <Header value="Comment" />
  <Text name="comment" value="$comment_text"/>
  
  <Header value="Toxic" size="3"/>
  <Choices name="toxic" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  <Header value="Severely Toxic" size="3"/>
  <Choices name="severe_toxic" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  <Header value="Insult" size="3"/>
  <Choices name="insult" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  <Header value="Threat" size="3"/>
  <Choices name="threat" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  <Header value="Obscene" size="3"/>
  <Choices name="obscene" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  <Header value="Identity Hate" size="3"/>
  <Choices name="identity_hate" toName="comment" choice="single" showInline="true">
    <Choice value="Yes" alias="1"/>
    <Choice value="No" alias="0"/>
  </Choices>
  
  <Header value="Reasoning" size="3"/>
  <TextArea name="reasoning" toName="comment" editable="true" placeholder="Provide reasoning for your choices here..."/>
</View>
```

3. 从侧边栏导航到 **Prompts**，并为该项目 [创建一个 prompt](prompts_create)：

    如果你尚未设置要使用的 API 密钥，请现在设置：[API keys](prompts_keys)。

4. 添加你希望提供给 LLM 以最佳评估文本的指令。例如：

    *Determine whether the following text falls into any of the following categories (for each, provide a "0" for False and "1" for True):*

    *toxic, severe_toxic, insult, threat, obscene, and identity_hate.*

    *Comment:*

    *`{comment_text}`*

!!! note
    请确保在你的指令中包含 `{comment_text}`。点击指令字段上方的 `comment_text` 以插入它。

!!! info 提示
    你也可以使用 [**增强 Prompt（Enhance Prompt）** 操作](prompts_draft#Enhance-prompt) 自动生成指令。在使用此操作之前，你必须至少添加变量名 `{comment_text}`，然后点击 **保存**。

    ![Screenshot pointing to Enhance Prompt action](/images/prompts/example_enhance_prompt.png)

5. 运行 prompt！查看预测以接受或修正。

    你可以 [阅读更多关于评估指标的内容](prompts_draft#Evaluation-results) 以及评估 prompt 表现的方法。

!!! info 提示
    你可以更改正在使用的数据子集（例如，仅包含真实标签标注的数据，或一小部分记录样本）。

    ![Screenshot pointing to subset dropdown](/images/prompts/example_subset.png)

6. 接受 [将预测作为标注](prompts_predictions#Create-annotations-from-predictions)！

#### 附录：预处理 jigsaw toxicity 数据集

下载 jigsaw_toxicity 数据集，然后使用以下脚本进行下采样/格式化（修改 `INPUT_PATH` 和 `OUTPUT_PATH` 以满足你的需要）：

```python
import pandas as pd
import json


def gen_task(row):
    labels = [
        {
            "from_name": field,
            "to_name": "comment",
            "type": "choices",
            "value": {"choices": [str(int(row._asdict()[field]))]},
        }
        for field in [
            "toxic",
            "severe_toxic",
            "insult",
            "threat",
            "obscene",
            "identity_hate",
        ]
    ]
    return {
        "data": {"comment_text": row.comment_text},
        "annotations": [
            {
                "result": labels,
                "ground_truth": True,
                "was_cancelled": False,
            }
        ],
    }


INPUT_PATH = "/Users/pakelley/Downloads/Jigsaw Toxicity Train.csv"
OUTPUT_PATH = "/Users/pakelley/Downloads/toxicity-sample-ls-format.json"

df = pd.read_csv(INPUT_PATH)
sample = df.sample(n=100)
label_studio_tasks = [gen_task(row) for row in sample.itertuples()]
with open(OUTPUT_PATH, "w") as f:
    json.dump(label_studio_tasks, f)
```

如果你愿意，你还可以轻松更改要使用的记录数量（或通过删除采样步骤来使用整个数据集）。

### 生成合成问答（Q&A）数据集

#### 概述

合成数据集是人为生成的数据集，而非从真实世界观察中收集。它们编码了与真实数据相似的特征，但允许在通用应用程序（如模型训练和评估）中扩大数据多样性或弥补数量缺口。合成数据集在增强以无界人类上下文作为输入和输出的 AI 系统（例如聊天机器人问答、用于评估的测试数据集，以及用于上下文检索的丰富知识数据集）方面也表现良好。LLM 在为这些用例生成合成数据集方面特别有效，并允许你通过创建可供学习的多样性来提升 AI 系统的性能。

#### 示例

让我们用上面的 Q&A 用例扩展示例，演示如何使用 Prompts 为聊天机器人 RAG 系统生成合成用户提示。给定一组聊天机器人答案的数据集，我们将生成一些可以返回每个答案的问题。

1. 通过导入作为聊天机器人有意义答案的文本片段，[创建一个新 Label Studio 项目](setup_project)。

    你可以使用 [SQuAD](https://huggingface.co/datasets/rajpurkar/squad) 数据集的预处理样本作为示例。有关其生成方式，请参阅 [附录](#Appendix-Preprocess-SQuAD-Q-A-dataset)。

2. 为问题生成创建一个 [标注配置](setup)（或让 Ask AI 为你创建一个），例如：

```xml
<View>
  <Header value="Context" />
  <Text name="context" value="$context" />
  <Header value="Answer" />
  <Text name="answer" value="$answer" />

  <Header value="Questions" />
  <TextArea name="question1" toName="context" 
            placeholder="Enter question 1" 
            rows="2"
            maxSubmissions="1" />

  <TextArea name="question2" toName="context" 
            placeholder="Enter question 2" 
            rows="2"
            maxSubmissions="1" />

  <TextArea name="question3" toName="context" 
            placeholder="Enter question 3" 
            rows="2"
            maxSubmissions="1" />
</View>
```

3. 从侧边栏导航到 **Prompts**，并为该项目 [创建一个 prompt](prompts_create)：

    如果你尚未设置要使用的 API 密钥，请现在设置：[API keys](prompts_keys)。

4. 添加指令以创建 3 个问题：

    *Using the "context" below as context, come up with 3 questions ("question1", "question2", and "question3") for which the appropriate answer would be the "answer" below:*

    *Context:*

    *---*

    *{context}*

    *---*

    *Answer:*

    *---*

    *{answer}*

    *---*

!!! note
    请确保在你的指令中包含 `{answer}` 和 `{context}`。点击指令字段上方的 `answer`/`context` 以插入它们。

!!! info 提示
    你也可以使用 [**增强 Prompt（Enhance Prompt）** 操作](prompts_draft#Enhance-prompt) 自动生成指令。在使用此操作之前，你必须至少添加一个变量名（例如 `{context}` 或 `{answer}`），然后点击 **保存**。

    ![Screenshot pointing to Enhance Prompt action](/images/prompts/example_enhance_prompt.png)

5. 运行 Prompt！查看预测以接受或修正。

    你可以 [阅读更多关于评估指标的内容](prompts_draft#Evaluation-results) 以及评估 prompt 表现的方法。

!!! info 提示
    你可以更改正在使用的数据子集（例如，仅包含真实标签标注的数据，或一小部分记录样本）。

    ![Screenshot pointing to subset dropdown](/images/prompts/example_subset.png)

6. 接受 [将预测作为标注](prompts_predictions#Create-annotations-from-predictions)！

#### 附录：预处理 SQuAD 问答数据集

此脚本从 Huggingface 下载 SQuAD 数据集并将其格式化为可在 Label Studio 中使用。

```python
import pandas as pd
import json

OUTPUT_PATH = "/Users/pakelley/Downloads/qna-sample-ls-format.json"
N_SAMPLES = 100

splits = {'train': 'plain_text/train-00000-of-00001.parquet', 'validation': 'plain_text/validation-00000-of-00001.parquet'}
df = pd.read_parquet("hf://datasets/rajpurkar/squad/" + splits["train"])

sample = df.sample(n=N_SAMPLES)

sample['answer'] = sample['answers'].map(lambda item: item['text'][0])
label_studio_tasks = [{"context": row.context, "answer": row.answer} for row in sample.itertuples()]
with open(OUTPUT_PATH, "w") as f:
    json.dump(label_studio_tasks, f)
```

如果你愿意，你还可以轻松更改要使用的记录数量（或通过删除采样步骤来使用整个数据集）。
