---
title: Draft and run prompts
short: Draft and run prompts
tier: enterprise
type: guide
order: 0
order_enterprise: 231
meta_title: Draft your Prompt
meta_description: Create and evaluate an LLM prompt
section: Prompts
date: 2024-06-12 14:09:09
---

在 [创建你的 Prompt](prompts_create) 之后，你可以开始起草你的 prompt 内容以对基线任务运行。

## 起草 Prompt 并生成预测

1. 选择你的基础模型。

    出现的模型取决于你为组织配置的 [API 密钥](prompts_keys)。

2. 在 **Prompt** 字段中，输入你的 prompt。请记住以下几点：
    * 你必须包含文本变量。这些变量直接显示在 prompt 字段上方。（在下面的演示中，这是 `review` 变量。）点击文本变量名称以将其插入 prompt 中。
    * 虽然并非严格要求，但你应该为每个类别提供定义，以确保预测准确性并帮助 [添加上下文](#Add-context)。

!!! info "提示"
    你可以通过简单地添加文本变量，然后 [点击 **Enhance Prompt（增强 Prompt）**](#Enhance-prompt) 来生成初始草稿。

3. 选择你的基线：
   * **所有项目任务（All Project Tasks）** - 为项目中的所有任务生成预测。根据你的项目大小，这可能需要一些时间来处理。这不会为 prompt 生成准确度评分。

        请参阅 [使用 Prompts 引导项目（Bootstrapping projects with prompts）](prompts_overview#Bootstrapping-projects-with-Prompts) 用例。
   * **样本任务（Sample Tasks）** - 为项目中的前 20 个任务生成预测。这不会为 prompt 生成准确度评分。

        请参阅 [使用 Prompts 引导项目](prompts_overview#Bootstrapping-projects-with-Prompts) 用例。
   * **真实标签（Ground Truths）** - 为所有具有真实标签标注的任务生成预测和 prompt 准确度评分。仅当你的项目具有真实标签标注时，此选项才可用。

        请参阅 [使用 Prompts 自动标注（Auto-labeling with Prompts）](prompts_overview#Auto-labeling-with-Prompts) 用例以及 [Prompt 评估与微调](prompts_overview#Prompt-evaluation-and-fine-tuning)。
4. 如果这是你的 prompt 的第一个版本，或者你想调整当前版本，请点击 **保存（Save）**。

    如果你想创建 prompt 的新版本以便比较版本之间的评估，请点击 **保存** 旁边的下拉菜单并选择 **另存为（Save As）**。
5. 点击 **评估（Evaluate）**（如果针对真实标签基线运行）或 **运行（Run）**。

!!! warning
    当你点击 **评估** 或 **运行** 时，你将为你所选基线中的每个任务创建预测，并覆盖你用此 prompt 生成的任何先前预测。

    评估你的 Prompts 可能会导致任务上有多个预测：如果你为一个项目提供了多个 Prompts，或者你同时点击了 **评估**/**运行** 和 **从 Prompt 获取所有任务的预测（Get Predictions for All Tasks from a Prompt）**，你将在数据管理器中看到任务有多个预测。

<br><br>
<video src="../images/prompts/prompts.mp4" controls="controls" style="max-width: 800px;" class="gif-border" />

## 评估结果

当你评估一个 prompt 时，你将看到以下指标：

<table>
<thead>
    <tr>
      <th>指标</th>
      <th>任务</th>
      <th>配置</th>
      <th>描述</th>
    </tr>
</thead>
<tr>
<td>

**总体准确度（Overall accuracy）**

</td>
<td>

真实标签（Ground Truths）

</td>
<td>

所有标注配置

</td>
<td>

衡量与真实标签相比有多少预测是正确的指标。

例如，如果有 10 个真实标签，并且你的 Prompt 的预测与其中 7 个匹配，则总体准确度将为 `0.70`。

</td>
</tr>
<tr>
<td>

**输出（Outputs）**

</td>
<td>

所有任务类型

</td>
<td>

所有标注配置

</td>
<td>

评估的任务数量。

</td>
</tr>
<tr>
<td>

**F1 分数（F1 Score）**

</td>
<td>

真实标签（Ground Truths）

</td>
<td>

单个 `<Choices>`


单个 `<Labels>`


</td>
<td>

[F1 分数](https://en.wikipedia.org/wiki/F-score) 是评估机器学习模型准确度的指标。这是根据 **精确率（precision）** 和 **召回率（recall）** 按如下方式衡量的：

`F1 = 2 * (precision * recall) / (precision + recall)`

* **精确率（Precision）**：在所有正类预测中，正确正类预测的比例。这是预测质量的衡量标准，查看有多少预测与真实标签正确对齐。

    此指标对于限制假阳性很有用。它回答了这个问题：“正类预测正确的频率是多少？”或“我能在多大程度上信任一个正类预测？”换句话说，它衡量模型不做出错误预测的能力。

* **召回率（Recall）**：在所有实际正类中，正确正类预测的比例。这是模型找到所有正类预测能力的衡量标准，在可能有多个标签的情况下特别有用。

    此指标对于最大化你获得的阳性预测数量很有用。它回答了问题“实际正类中有多少被成功识别？”换句话说，它衡量模型不遗漏事物的能力。

请注意，“positive（阳性）”预测表示“positive（阳性）”标签（如复选框），或预测中特定选项/标签的存在。

</td>
</tr>
<tr>
<td>

**推理成本（Inference cost）**

</td>
<td>

所有任务类型

</td>
<td>

所有标注配置

</td>
<td>

基于所需 token 数量运行 prompt 的成本。

</td>
</tr>
</table>

### 分类报告

点击 **展开（Expand）** 以查看 Prompt 的分类报告。这些报告告诉你每个类别被识别了多少次。这适用于以下标签：

`Choices`
`Labels`
`Pairwise`
`Rating`

## 增强 Prompt

你可以使用 **增强 Prompt（Enhance Prompt）** 来帮助你构建和自动细化你的 prompts。

至少，你需要先插入文本变量。（点击文本变量名称以将其插入 prompt 中。这些变量显示在 prompts 字段上方）。

在 **增强 Prompt** 窗口中，你需要选择要用于编写 prompt 的 **教师模型（Teacher Model）**。当你自动细化 prompt 时，你将获得以下内容：

* 显示在先前 prompt 旁边的新 prompt。
* 所做更改的解释。
* 自动细化 prompt 所花费的估计成本。

![Screenshot of enhance prompt modal](../images/prompts/enhance.png)

**工作原理**

**任务子集（Task Subset）** 在自动细化 prompt 时用作上下文。如果你有可用的真实标签数据，那将作为任务子集。否则，将使用最多 10 个项目任务的样本。

自动细化将你的初始 prompt 和教师模型应用于在任务子集（将是真实标签任务或样本数据集）上生成预测。如果适用，然后将预测与真实标签进行比较以计算准确性。

你的教师模型根据真实标签（或样本任务输出）评估初始 prompt 的预测，并识别需要改进的领域。然后它建议一个细化的 prompt，旨在与期望的结果实现更紧密的对齐。

## 起草有效的 Prompts

有关起草 prompts 的综合指南，请参阅 [The Prompt Report: A Systematic Survey of Prompting Techniques](https://arxiv.org/abs/2406.06608) 或 OpenAI 的 [提示工程指南（Prompt Engineering）](https://platform.openai.com/docs/guides/prompt-engineering)。

### 文本放置

当你将文本变量放置在 prompt 中时（上面演示中的 `review`），此占位符将被实际文本替换。

根据你的文本的长度和复杂性，将其插入另一个句子或想法的中间可能会潜在地混淆 LLM。

例如，与其使用“*将 `text` 分类为以下之一：*”，不如将其结构化为类似“*给定以下文本：`text`。将此文本分类为以下之一：*。”

### 定义你的目标

撰写有效 prompt 的第一步是清晰定义你想要完成的任务。你的 prompt 应明确说明目标是将给定的文本分类为预定义的类别。这为模型设定了清晰的期望。例如，不要像“分析此文本”这样模糊的请求，而应该说“将以下文本分类为‘spam（垃圾邮件）’或‘not spam（非垃圾邮件）’等类别”。清晰性有助于模型理解确切的任务，并减少响应中的歧义。

### 添加上下文

上下文对于引导模型实现准确分类至关重要。提供背景信息或示例可以显著增强 prompt 的有效性。例如，如果你正在分类客户评论，请包含对什么是正面、负面或中性评论的简要描述。你可以将其构建为“将以下客户评论分类为‘positive（正面）’、‘negative（负面）’或‘neutral（中性）’。正面评论表示客户满意，负面评论表示不满意，中性评论既不是特别正面也不是特别负面。”这一额外的上下文有助于模型将其响应与你的具体要求对齐。

### 具体性

prompt 中的具体性提高了模型输出的精确度。这包括指定你想要的响应格式、任何重要的特定关键字或短语，以及任何其他相关细节。例如，“请分类以下文本，并用一个单词提供类别：‘positive（正面）’、‘negative（负面）’或‘neutral（中性）’。”通过具体说明，你可以帮助确保模型的输出是一致的，并与你的期望对齐。
