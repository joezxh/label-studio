---
title: 如何创建 AI 基准并借助 Label Studio 评估你的模型
hide_sidebar: true
order: 1002
open_in_collab: true
tutorial: true
community_author: mcanu
ipynb_repo_path: tutorials/how-to-create-benchmark-and-evaluate-your-models/how_to_create_a_Benchmark_and_Evaluate_your_models_with_Label_Studio.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-create-benchmark-and-evaluate-your-models
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-ai-benchmark-and-eval.png
meta_title: 如何将 Hugging Face 与 Label Studio SDK 连接
meta_description: 学习如何使用 Label Studio SDK 创建高质量的基准数据集，以评估多个 AI 模型
is_enterprise: true
is_starter_cloud: true
badges: SDK, Benchmark, Eval, Prompt, Colab
duration: 5-10 分钟
---
对模型的评估，其质量取决于你用来测试它的基准。  
在本教程中，你将学习如何使用 **Label Studio** 创建一个高质量的基准数据集，用人类专业知识标注它，然后据此评估多个 AI 模型——全程使用 **Label Studio SDK**。  
到结尾时，你将拥有一个可复现的工作流，可以在你自己的数据上**衡量并比较模型性能**——不再依赖直觉，而是基于可衡量的、数据驱动的判断。

## Label Studio 要求

本教程展示了 Label Studio 付费产品中才提供的一项或多项功能。我们建议[创建一个 Starter Cloud 试用](https://app.humansignal.com/user/cloud-trial?offer=d9a5&) 来跟随本教程。

## 🧠 什么是基准？

**基准（benchmark）** 是一个受信任的、已标注的数据集，作为评估模型性能的真实参考（ground truth）。  
把它看作你的*现实检验*——它能让你看清一个模型到底在多大程度上真正理解了你的领域与任务。  
与公开排行榜或现成的测试集不同，**自定义基准**反映的是*你的数据、你的领域，以及你对成功的定义*。  
例如，如果你在检测钓鱼邮件，你的基准应当包含与你的场景相关的、真实合法与恶意邮件样本。

👉 想深入了解基准在 AI 评估中的作用，请参阅 [**Why Benchmarks Matter for Evaluating LLMs**](https://labelstud.io/blog/why-benchmarks-matter-for-evaluating-llms/)。

## ⚖️ 为什么基准很重要？

基准是**模型评估与持续改进**的支柱。没有它，你很难知道一个新模型或新提示词版本是否真的表现得更好——还是仅仅看起来更好。  
一个好的基准能让你：
- 🔁 在*同一份数据*上比较来自不同提供商的模型
- 🧩 识别跨标签或跨类别的优势与劣势
- 📈 随着模型演进追踪随时间的进展
- ✅ 通过可衡量的准确率，建立对你模型预测的信任

换句话说，基准把主观的「它看起来更好」论断变成了**客观证据**。  
想更深入理解这个观点，请查看 [**How to Build AI Benchmarks That Evolve with Your Models**](https://labelstud.io/blog/how-to-build-ai-benchmarks-that-evolve-with-your-models/)。

## ⚙️ 我如何用 Label Studio 创建我的基准？

Label Studio 为你提供在单一平台上创建、管理和演进基准所需的一切。  
借助它，你可以：
- 📥 **导入并标注你的数据**——协作式或编程式
- 🧭 **对基准进行版本管理与精炼**——随着理解的深入不断完善
- 🤖 **直接运行模型评估**——使用 SDK 与内置的提示词管理工具

这让你的基准成为会随数据与模型增长而适应演进的*活资产*。  
想获得灵感，可看看其他人如何在 [**How LegalBenchmarks.AI Built a Domain-Specific AI Benchmark**](https://labelstud.io/blog/how-legalbenchmarks-ai-built-a-domain-specific-ai-benchmark/) 中构建领域专用基准。

## 🎓 本教程将教我什么？

在本教程中，你将学习如何：
1. 🏗️ 使用 SDK 在 Label Studio 中创建一个基准项目
2. 📊 导入并标注你自己的数据集
3. 💬 定义要评估的提示词与模型版本
4. 📉 运行评估并可视化结果

我们还会走一个示例：在钓鱼邮件分类任务上比较若干模型——类似于我们如何在 [**Evaluating the GPT-5 Series on Custom Benchmarks**](https://labelstud.io/blog/evaluating-the-gpt-5-series-on-custom-benchmarks/) 中评估模型。  
到结尾时，你将拥有一个可重复的工作流，可以在**任何数据集**上**评估任何模型**——以你自己的基准为基础。

## 🚀 开始之前

在深入代码之前，我们先确保你已经把所有设置都准备好，以便顺利跟随。  
你只需要少量的东西就能开始 👇

### 🧰 前置条件
> **说明：** 本教程面向 **Label Studio Enterprise** 与 **Starter Cloud** 用户开放，因为它用到了**提示词（Prompts）**与**一致性指标（Agreement Metrics）**等开源版本不具备的功能。

如果你使用的是开源版本的 Label Studio，你仍可以从概念上跟随本教程。  
👉 在 [**humansignal.com**](https://humansignal.com/) 了解更多或申请访问权限。

你需要：
- 一个 [app.humansignal.com](https://app.humansignal.com/) 上的 **Label Studio 账户**  
  _（需要 Starter Cloud 或 Enterprise 版本）_
- 你用户设置中的 **API 密钥**（你将通过它用 SDK 连接）
- 一个你可以创建项目的 **工作区（workspace）** 的访问权限

### 🧩 你将用到什么
我们将使用 **Label Studio SDK** 来：
- 连接到你的 Label Studio 实例
- 创建项目并导入数据
- 定义提示词与模型版本
- 运行模型评估并可视化结果

一切都通过编程完成——无需在 UI 中点击（尽管你可以随时打开 Label Studio 看看发生了什么 👀）。

让我们开始吧 🚀

### ⚙️ 安装 SDK 并连接到 Label Studio

让我们先安装 SDK、配置你的连接信息，并测试连接。

```python
# Run this cell to install the Label Studio SDK
!pip install label-studio-sdk>=2.0.11
```

```python
# Configure your connection details

# URL of your Label Studio instance
LABEL_STUDIO_URL = 'https://app.humansignal.com/'

# Your API key (find it in Account & Settings > Personal Access Token)
API_KEY = '<Token>'

# ID of the workspace to create the project (make sure it's not the Personal Sandbox)
# Find the Workspace ID in the URL when you click on it in the sidebar
WORKSPACE_ID = 0
```

```python
# Check you can connect to Label Studio
from label_studio_sdk import LabelStudio

ls = LabelStudio(base_url=LABEL_STUDIO_URL, api_key=API_KEY)
user = ls.users.whoami()
print(f'Connected as {user.email}')
```

### 创建项目并导入邮件数据集

1. 我们将从创建一个 **Label Studio 项目** 开始，其标注配置允许我们将每封邮件分类为 **钓鱼邮件（Phishing）** 或 **合法邮件（Legitimate）**。  
   - 如果选中了 **Phishing（钓鱼）**，标注人员还可以选择一个或多个 **钓鱼类型（phishing type）** 和 **指标（indicators）** 来描述攻击。

2. 接下来，我们将**下载一个原始邮件数据集**，用作基准数据。

3. 最后，我们将**把数据集作为任务导入 Label Studio**，以便我们开始标注并构建我们的基准。

```python
label_config = '''
<View>
  <View className="section">
    <Text name="body" value="$raw_email" />
  </View>

  <View className="section">
    <Header value="Overall classification" size="3" />
    <Choices name="classification" toName="body" choice="single" showInline="true" required="true">
      <Choice value="Phishing" />
      <Choice value="Legitimate" />
    </Choices>
  </View>

  <View className="section" visibleWhen="choice-selected" whenTagName="classification" whenChoiceValue="Phishing,Suspicious">
    <Header value="Phishing type" size="3" />
    <Choices name="phishing_type" toName="body" choice="multiple" showInline="false">
      <Choice value="Credential Harvesting - Fake login page" />
      <Choice value="Malware Delivery - Link to download malware" />
      <Choice value="Malware Delivery - Malicious Link / Phishing Site" />
      <Choice value="Financial Fraud - Gift Card Scam" />
      <Choice value="Financial Fraud - BEC (Impersonation/CEO Fraud)" />
      <Choice value="Extortion/Blackmail" />
      <Choice value="Account Suspension Notice" />
      <Choice value="Social Engineering - Romance / Dating Scam" />
      <Choice value="Other" />
    </Choices>

    <Header value="Indicators observed" size="3" />
    <Choices name="indicators" toName="body" choice="multiple" showInline="false">
      <Choice value="Sender anomalies - Display name spoofing" />
      <Choice value="Sender anomalies - Lookalike domain" />
      <Choice value="Sender anomalies - Spoofed IP / Email headers indicate fraud" />
      <Choice value="Content signals - Urgency/Threats" />
      <Choice value="Content signals - Requests money/gift cards" />
      <Choice value="Content signals - Poor grammar/spelling" />
      <Choice value="Content signals - Unexpected attachment" />
      <Choice value="Content signals - Generic greeting (Dear user, etc.)" />
      <Choice value="Link issues - Obfuscated/shortened URL" />
      <Choice value="Link issues - Domain mismatch with brand" />
      <Choice value="Link issues - IP-based URL" />
      <Choice value="Other - Request for personal info unrelated to workflow" />
    </Choices>
  </View>
</View>
'''
# Creating project in the configured workspace
project = ls.projects.create(
    title='Phishing Benchmark Tutorial',
    workspace=WORKSPACE_ID,
    is_published=True,
    label_config=label_config
)
```

```python
# Download emails dataset
import pandas as pd
DATASET_URL = 'https://gist.githubusercontent.com/mcanu/95507352bfc4557d0ff0430117758abe/raw/eb86433f4c40645d0b1b717877d3468456ab687a/raw_emails.csv'
raw_emails = pd.read_csv(DATASET_URL)
raw_emails.head()
```

```python
# Import raw emails as tasks to Label Studio
ls.projects.import_tasks(project.id, request=raw_emails.to_dict(orient='records'))
```

    ProjectsImportTasksResponse(annotation_count=None, could_be_tasks_list=None, data_columns=None, duration=None, file_upload_ids=None, found_formats=None, predictions_count=None, task_count=None, import=3058032)

### 标注你的基准

现在，如果你前往 **Label Studio**，你应该能在**数据管理器（Data Manager）** 中看到你新导入的任务。  
点击 **Label All Tasks**（标注全部任务）开始标注你的基准。  
这些已标注的任务将作为你的**真实参考（ground truth）**——评估不同模型表现如何的基础。  
（你可以参考下面的截图来跟随操作。）

![image](https://github.com/HumanSignal/awesome-label-studio-tutorials/blob/main/tutorials/how-to-create-benchmark-and-evaluate-your-models/how_to_create_a_Benchmark_and_Evaluate_your_models_with_Label_Studio_files/figure_1.png?raw=true)

#### 将标注设为真实参考

将你完成的标注标记为 **真实参考（ground truth）**。  
这告诉 Label Studio 哪些标注要被视为**事实来源（source of truth）**——从而在将模型预测与人类标签比较时，能够计算出更准确、更有意义的一致性指标。

```python
# Set your annotations as ground truth
ls.actions.create(id='set_ground_truths', project=project.id, request_options={'additional_body_parameters': {'annotator': user.id}})
```

    None

### 为模型预测配置提示词

**提示词（Prompts）** 让你能够直接从 Label Studio 连接并评估不同的 AI 模型——使用共享的提示词模板来生成一致的预测。  
在运行评估之前，请前往 [app.humansignal.com/prompts](https://app.humansignal.com/prompts) 并为你想要测试的模型配置 **API 密钥**。  
你也可以添加 **自定义模型连接** 来评估你自己的或第三方模型。  
更多细节，请参阅 [Prompts 配置指南](https://docs.humansignal.com/guide/prompts_keys)。

![image](https://github.com/HumanSignal/awesome-label-studio-tutorials/blob/main/tutorials/how-to-create-benchmark-and-evaluate-your-models/how_to_create_a_Benchmark_and_Evaluate_your_models_with_Label_Studio_files/figure_2.png?raw=true)

### 用 SDK 创建并运行模型版本

接下来，我们将使用 **Label Studio SDK** 来自动化模型评估的过程。  
我们将创建一个与项目关联的 **提示词**，然后为我们想要测试的每一个模型生成一个 **模型版本**。  
每个模型版本都将对**项目中的所有任务**执行推理，产生**每个模型每个任务一条预测**——已可用于与真实参考进行比较。

```python
# Create new prompt for our project
prompt = ls.prompts.create(
    title='Phishing Benchmark Tutorial Prompt',
    associated_projects=[project.id],
    input_fields=['raw_email'],
)
```

```python
# We will be testing with 4 models from 2 different providers
models = {
    'OpenAI': {
        'id': None,
        'models': ['gpt-5-mini', 'gpt-4.1-mini'],
      },
    'Gemini': {
        'id': None,
        'models': ['gemini-2.0-flash-lite', 'gemini-2.5-flash-lite']
    }
}
providers = ls.model_providers.list()

# Assign provideer ids to models
for provider in providers:
    model_info = models.get(provider.provider)
    if model_info:
      model_info['id'] = provider.id
      models[provider.provider] = model_info

```

```python
PROMPT = '''
Analyze the provided email content and classify it as either 'Phishing' or 'Legitimate'.

If the email is classified as 'Phishing', identify the specific phishing type(s) and indicators from the options.
If the email is legitimate, classify it as 'Legitimate' with no additional phishing type or indicators.

Use the following variable in your analysis:
"{raw_email}"

Provide the output in JSON format with the keys:
- classification: 'Phishing' or 'Legitimate'
- phishing_type: list of strings (if applicable)
- indicators: list of strings (if applicable)

Ensure the response adheres to the provided JSON schema.
'''

# Create one prompt version for each model
versions = []
for provider, info in models.items():
    for model_name in info['models']:
      version = ls.prompts.versions.create(
          prompt_id=prompt.id,
          prompt=PROMPT,
          provider_model_id=model_name,
          title=f'{provider} - {model_name}',
          model_provider_connection=info['id'],

      )
      versions.append(version)

```

```python
# Run inference for each version
import time

# Function to wait for runs to complete
def wait_for_runs_to_complete(versions):
  completed_versions = []
  while len(completed_versions) != len(versions):
    for version in versions:
      if version in completed_versions:
        continue
      runs = ls.prompts.runs.list(prompt_id=prompt.id, version_id=version.id)
      if runs:
        last_run = runs[-1]
        if last_run.status == 'Completed':
          print('version ', version.id, ' completed')
          completed_versions.append(version)
    time.sleep(10)

# Launch runs for all versions
for version in versions:
  ls.prompts.runs.create(prompt_id=prompt.id, version_id=version.id, project=project.id, project_subset='All')

# Wait for runs to complete
wait_for_runs_to_complete(versions)
```

    version  46550  completed
    version  46551  completed
    version  46552  completed
    version  46549  completed

### 收集运行成本

让我们检索**每次模型运行的成本**，将其作为额外的数据点纳入。  
将运行成本与性能指标一起追踪，有助于你理解每个模型在**准确率与效率之间的权衡**。

```python
# Collect costs from each run
costs = {}
for version in versions:
  runs = ls.prompts.runs.list(prompt_id=prompt.id, version_id=version.id)
  last_run = runs[-1]
  cost = ls.prompts.indicators.get(id=last_run.id, indicator_key='inference_cost')
  costs[version.title] = {
      'Total Cost': cost.values.get('total_cost'),
      'Completions Token Count': cost.values.get('completion_tokens_count'),
      'Prompt Token Count': cost.values.get('prompt_tokens_count'),
  }
```

```python
import pandas as pd

# Use the existing costs dictionary to create the DataFrame
cost_df = pd.DataFrame.from_dict(costs, orient='index')
cost_df = cost_df.reset_index().rename(columns={'index': 'Model Version'})

display(cost_df)
```

# 📈 分析结果

既然所有模型的预测都已完成，我们可以使用 Label Studio 提供的**一致性指标**来衡量性能。  
让我们先看看每个模型相对真实参考标注所达到的**整体一致性**。  
该指标展示了每个模型的预测与你的基准标签之间的**一致百分比**——快速呈现模型准确率的概览。

```python
def get_version_name(prompt, version):
  return f'{prompt.title}__{version.title}'


gt_agreements = []
for version in versions:
  version_name = get_version_name(prompt, version)
  agreement = ls.projects.stats.model_version_ground_truth_agreement(id=project.id, model_version=version_name)
  gt_agreements.append(agreement)
```

```python
import matplotlib.pyplot as plt
import pandas as pd

# Assuming 'versions' and 'prompt' are available from previous cells
version_names = [version.title for version in versions]
agreement_values = [item.agreement * 100 for item in gt_agreements]

gt_agreement_df = pd.DataFrame({
    'Model Version': version_names,
    'Agreement (%)': agreement_values
})

gt_agreement_df = gt_agreement_df.sort_values('Agreement (%)', ascending=False)

ax = gt_agreement_df.plot.bar(x='Model Version', y='Agreement (%)', legend=False, rot=45, color=plt.cm.viridis(gt_agreement_df.index / len(gt_agreement_df)))
plt.ylabel('Agreement with Ground Truth (%)')
plt.xlabel('Model Version')
plt.title('Model Version Agreement with Ground Truth (Label Studio Stats)')

# Add agreement percentages on top of the bars
for container in ax.containers:
    ax.bar_label(container, fmt='%.1f%%')

plt.tight_layout()
plt.show()
```

## 每个标签的一致性

接下来，让我们探究**每个标签的一致性**，看看每个模型在不同类别上的表现。  
这个视图能突出模型在哪里**与基准一致**或**偏离基准**——无论是主邮件分类，还是具体的**钓鱼类型**与**指标**。  
这些洞察对于识别**模型在何处表现吃力**，以及微调以获得更好结果时**该聚焦哪些领域**极具价值。

```python
# Agreement per label

per_label_agreements = []
for version in versions:
  version_name = get_version_name(prompt, version)
  agreement = ls.projects.stats.model_version_ground_truth_agreement(id=project.id, model_version=version_name, per_label=True)
  per_label_agreements.append(agreement)
```

```python
import pandas as pd

per_label_data = {'Total Cost': {}}
for i, version_agreement in enumerate(per_label_agreements):
    version_name = versions[i].title
    for label, agreement in version_agreement.agreement.items():
        if label not in per_label_data:
            per_label_data[label] = {}
        per_label_data[label][version_name] = agreement * 100 # Convert to percentage
    per_label_data['Total Cost'][version_name] = costs[version_name]['Total Cost']

per_label_df = pd.DataFrame.from_dict(per_label_data, orient='index')
per_label_df = per_label_df.fillna(0) # Fill missing values with 0 if a label doesn't appear for a model

# Add color to the table and format percentages, excluding the 'Total Cost' row
per_label_df.style.background_gradient(cmap='Pastel1', subset=pd.IndexSlice[per_label_df.index != 'Total Cost', :]).format("{:.1f}%", subset=pd.IndexSlice[per_label_df.index != 'Total Cost', :])
```

## 🎯 总结

恭喜——你刚刚使用 **Label Studio** 为钓鱼邮件分类构建了自己的**基准**！  
只需几步，你就搭建起了一套可以让你：
- 🧠 评估一个 LLM 将钓鱼邮件与合法邮件分类得有多好
- 📊 以结构化、可重复的方式可视化并比较模型输出
- 🔄 构建一个能随模型改进而演进的基础

### 💡 为什么基准很重要

基准对于理解你的模型*如何*表现至关重要——而不仅仅是它们是否「能用」。  
它们帮助你：
- 识别模型推理中的**优势与劣势**
- 随着系统改进**追踪随时间的进展**
- 围绕性能建立**信任与透明度**

基准不是静态的——它们会演进。  
随着需求的增长，你可以持续地用新示例或新类别扩展这个基准。

### 🧩 为什么选择 Label Studio

Label Studio 让这个过程变得简单且协作友好：
- 创建、管理与对**自定义基准**进行版本管理
- 在**同一数据集上评估多个模型**
- 直接从你的标注数据**可视化指标与洞察**
- 将结果集成进你现有的 ML 流水线以实现持续改进

这正是像 [*LegalBenchmarks.AI*](https://labelstud.io/blog/how-legalbenchmarks-ai-built-a-domain-specific-ai-benchmark/) 这样的团队，跨领域构建可靠、可演进基准的方式。

### 🚀 下一步

持续迭代你今天构建的东西：
- 🧪 添加更多数据或扩展你的标签体系
- 🤖 比较不同的 LLM 或提示词变体
- 📈 分析你的模型在何处表现吃力——以及为什么
- 🔗 与你的团队分享或将评估过程自动化

### 📚 了解更多

- [Label Studio 文档](https://docs.humansignal.com/guide/)
- [Label Studio SDK](https://humansignal.github.io/label-studio-sdk/)
- [博客：Why Benchmarks Matter for Evaluating LLMs](https://labelstud.io/blog/why-benchmarks-matter-for-evaluating-llms/)
- [博客：How to Build AI Benchmarks That Evolve with Your Models](https://labelstud.io/blog/how-to-build-ai-benchmarks-that-evolve-with-your-models/)
- [博客：Evaluating the GPT-5 Series on Custom Benchmarks](https://labelstud.io/blog/evaluating-the-gpt-5-series-on-custom-benchmarks/)
- [博客：How LegalBenchmarks.AI Built a Domain-Specific AI Benchmark](https://labelstud.io/blog/how-legalbenchmarks-ai-built-a-domain-specific-ai-benchmark/)
