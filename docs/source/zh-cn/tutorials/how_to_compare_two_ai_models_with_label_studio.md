---
title: "如何用 Label Studio 比较两个 AI 模型"
hide_sidebar: true
order: 1003
open_in_collab: true
tutorial: true
community_author: nass600
ipynb_repo_path: tutorials/how-to-compare-two-ai-models-with-label-studio/how_to_compare_two_ai_models_with_label_studio.ipynb
repo_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/tree/main/tutorials/how-to-compare-two-ai-models-with-label-studio
report_bug_url: https://github.com/HumanSignal/awesome-label-studio-tutorials/issues/new
thumbnail: /images/tutorials/tutorials-compare-ai-models.png
meta_title: 如何用 Label Studio 比较两个 AI 模型
meta_description: 学习如何用 Label Studio SDK 比较和评估两个 AI 模型。
badges: SDK, Agreement, Colab
duration: 5-10 分钟
---

## 为什么这很重要

团队无时无刻不在比较模型，而「谁胜出？」会因使用场景而异：
- **前沿模型对决**：早期阶段，你在用自己的数据比较来自不同实验室的模型，以选定一个默认模型。
- **成本 vs 质量**：比较同一实验室的廉价与昂贵模型变体，看看质量损失是否值得省下的开销。
- **生产版 vs 挑战者**：针对当前生产模型，测试一个微调模型、新的护栏，或改进过的 RAG 流水线。

人工评估能告诉你哪个模型胜出，更重要的是知道它在哪里胜出（按领域或问题类型），这样你就能选择正确的模型、进行智能路由，或迭代你的提示词/RAG。

## 你将构建什么

- 一个带有评分标准的 Label Studio 项目：胜者（A/B/平局）+ 质量（1–5）+ 备注
- 一个小型演示数据集，你可以替换成自己的
- 一个 Colab，用于创建项目、导入任务、拉取标注并分析结果

> 适用于 Label Studio OSS 版或 Enterprise 版（我们会标注可选的 Enterprise 功能）。

## 前置条件

- 一个你可从 Colab 或本地 Python 访问的、正在运行的 Label Studio（OSS 或 Enterprise）
   - LS_URL（例如 http://localhost:8080 或你的团队 URL）
   - LS_API_KEY（个人令牌）
- Python 3.10+（Colab 即可）
- 约 20–30 分钟来标注 20 条数据（独自或与同事协作）

## 0. 环境准备

我们将在整个项目中依赖 Label Studio SDK，因此你需要准备好两条重要信息：

1. 你的 Label Studio 实例运行的基础 URL（`LS_URL`）。
2. 用于鉴权请求的 `LS_API_KEY`。

如果 Colab 无法访问你的 localhost，你可以：
1. 用 Jupyter 在本地运行此 notebook
2. 用 ngrok 或 cloudflared 之类的服务做隧道转发（[ngrok 示例](https://dashboard.ngrok.com/get-started/setup/macos)）

你可以在 Label Studio UI 的 Account & Settings（账户与设置）菜单中创建有效的 `API_KEY`（点击右上角的用户头像）。

```python
!pip -q install label-studio-sdk pandas numpy matplotlib scipy

import os
import json
import time
from dataclasses import dataclass
from typing import List, Dict, Any

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import binomtest
from label_studio_sdk import LabelStudio

# For nicer dataframe display in Colab
pd.set_option('display.max_colwidth', 160)

# Configure Label Studio connection
# Note: Colab cannot reach your local http://localhost:8000 unless you tunnel.
# If testing locally, run this notebook in Jupyter, or expose LS via a tunnel.
LS_URL = os.getenv("LS_URL", "http://localhost:8080")  # <-- change if needed
LS_API_KEY = os.getenv("LS_API_KEY", "YOUR_TOKEN")  # <-- set your token

ls = LabelStudio(base_url=LS_URL, api_key=LS_API_KEY)
user = ls.users.whoami()
print("Connected to Label Studio as:", user.username)
print("LS_URL:", LS_URL)

```

## 1. 创建 Label Studio 项目

### 项目长什么样

该项目展示：问题、两个答案（模型 A 与 B），以及一个评分标准：胜者（A/B/平局）、总体质量（1–5），以及可选的备注。

![Labelling](https://github.com/HumanSignal/awesome-label-studio-tutorials/blob/main/tutorials/how-to-compare-two-ai-models-with-label-studio/how-to-compare-two-ai-models-with-label-studio-files/figure_1.png?raw=true)

```python
LABEL_CONFIG = r"""
<View>
  <Style>
    .candidate { border: 1px solid #ccc; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .prompt { background: #fafafa; padding: 12px; border: 1px dashed #ddd; border-radius: 8px; }
  </Style>

  <Header value="Prompt" />
  <Text name="prompt" value="$prompt" className="prompt" />

  <Header value="Compare answers" />
  <View className="two-col">
    <View className="candidate">
      <Header value="Model A (Claude 4.5 Sonnet)" />
      <Text name="answer_a" value="$answer_a" />
    </View>
    <View className="candidate">
      <Header value="Model B (GPT-5)" />
      <Text name="answer_b" value="$answer_b" />
    </View>
  </View>

  <Header value="Pick a winner" />
  <Choices name="winner" toName="prompt" required="true">
    <Choice value="Model A" />
    <Choice value="Model B" />
    <Choice value="Tie" />
  </Choices>

  <Header value="Overall quality (1-5)" />
  <Rating name="quality" toName="prompt" maxRating="5" icon="star" required="true" />

  <Header value="Notes (optional)" />
  <Textarea name="notes" toName="prompt" placeholder="Why did this model win? Any errors or hallucinations?" />
</View>
"""

project = ls.projects.create(
    title="A/B Model Comparison — Movie Science Fact-Check",
    description="Compare two models on science-in-movies questions and collect human judgments.",
    label_config=LABEL_CONFIG
)

print("Project created with id:", project.id, "| title:", project.title)

```

    Project created with id: 36 | title: A/B Model Comparison — Movie Science Fact-Check

### ✨ LabelStudio Enterprise 提示：当规模扩大时

> Enterprise 功能可帮助你运行更大、更快、更高质量的评估：
>
> - **自动分配与队列**：将任务自动分发给标注人员，并行提升吞吐，并监控每个队列的进度。[了解高级配置选项。](https://docs.humansignal.com/guide/setup_project#Configure-high-impact-settings)
> - **重叠与一致性**：每条数据收集多个判断，计算标注者间一致性（IAA），并标记分歧送审。[了解任务一致性与标注共识。](https://docs.humansignal.com/guide/stats.html)
> - **审核与共识**：增加一个审核步骤，解决平局/争议并执行规范。[了解审核者工作流](https://docs.humansignal.com/guide/quality)。
> - **Webhooks 与自动化**：当某个批次或项目达到完成度阈值时，触发导出或下游分析。
>
> 结果：更快地获得信号、更好的标签质量，以及对模型决策的可审计性。

## 2. 准备一个微型数据集和模型输出

为了便于移植，我们虚构了 20 个提示词，并使用了两个 LLM 的输出。请用你真实的模型或加载 CSV 来替换这些函数。

```python
np.random.seed(7)

prompts = [
    "In Interstellar, is the extreme time dilation near the black hole plausible under general relativity? Explain briefly.",
    "In The Martian, is growing potatoes in Martian regolith realistic, and what critical step would be required?",
    "In Jurassic Park, could viable dinosaur DNA survive in amber for ~65 million years? Why or why not?",
    "In Gravity, does the cascading debris scenario (Kessler Syndrome) reflect a real orbital risk? Briefly assess.",
    "In Oppenheimer, was critical mass analysis central to the Manhattan Project’s design decisions? One core point.",
    "In Arrival, does the film’s language-learning premise relate to real concepts in linguistics/information theory?",
    "In Apollo 13, is the CO₂ scrubber ‘square peg in round hole’ fix grounded in real engineering constraints?",
    "In Gattaca, is the portrayed level of genetic screening ethically debated in modern genetics? One concise note.",
    "In Armageddon, could a nuclear device realistically ‘blow up’ a large asteroid to avert impact at the last minute?",
    "In Star Wars space battles, is audible sound propagation realistic in vacuum? Why or why not?",
    "In Interstellar, does the depiction of gravitational lensing align with physics consulted by Kip Thorne?",
    "In The Martian, would Martian perchlorates pose a challenge for agriculture without treatment? One line.",
    "In Jurassic Park, are frogs a plausible DNA patch for reconstructing dinosaurs? Scientific assessment, briefly.",
    "In Gravity, is orbital plane matching as trivial as depicted when transferring between spacecraft? One-liner.",
    "In Oppenheimer, is prompt criticality risk a real safety concern in weapons physics? Short answer.",
    "In Arrival, could non-linear language acquisition plausibly alter human temporal perception? Briefly evaluate.",
    "In Apollo 13, does power budgeting and thermal management match real spacecraft constraints?",
    "In Gattaca, is polygenic screening predictive enough today to determine career suitability? One-liner.",
    "In Armageddon, is landing on an asteroid and drilling a viable mitigation strategy compared to deflection?",
    "In Interstellar, could a near-light-speed trip yield significant relativistic aging differences? Short explanation.",
]

def model_a_answer(prompt: str) -> str:
    """Claude 4.5 Sonnet - 8s"""
    templates = [
      "Yes, extreme time dilation near a black hole is plausible under general relativity. The massive gravitational field warps spacetime significantly, causing time to pass much slower relative to distant observers—an effect accurately depicted with physicist Kip Thorne's consultation.",
      "Growing potatoes in Martian regolith is partially realistic but requires critical preprocessing: the soil must be treated to remove toxic perchlorates and supplemented with organic matter and water. The film glosses over the perchlorate remediation step.",
      "No, viable dinosaur DNA could not survive 65 million years in amber. DNA degrades with a half-life of approximately 521 years; even under ideal preservation conditions, fragments beyond ~6 million years old would be unsequenceable.",
      "Yes, the Kessler Syndrome depicted in Gravity reflects a real orbital risk. Cascading collisions creating debris fields that trigger further collisions is a genuine concern for Earth's orbital environment, though the film's timeline is dramatically compressed.",
      "Yes, determining critical mass—the minimum fissile material needed for a self-sustaining chain reaction—was absolutely central to designing both the gun-type (Little Boy) and implosion-type (Fat Man) weapons.",
      "Yes, the premise relates to the Sapir-Whorf hypothesis (linguistic relativity) and concepts in cognitive linguistics suggesting language structure can influence thought patterns, though the film's extreme interpretation (nonlinear time perception) is highly speculative.",
      "Yes, the CO₂ scrubber fix is based on the actual Apollo 13 mission. Engineers on the ground had to devise a solution using only materials available on the spacecraft to adapt Command Module scrubbers for the Lunar Module's different form factor.",
      "Yes, the genetic screening and discrimination portrayed in Gattaca directly parallels ongoing ethical debates around genetic testing, workplace/insurance discrimination, genetic privacy, and the societal implications of genomic medicine.",
      "No, detonating a nuclear device at the last minute is unrealistic. The physics of asteroid breakup would likely create multiple threatening fragments. Early detection with gentle deflection (kinetic impactor or gravity tractor) over years is the viable approach.",
      "No, audible sound propagation in vacuum is not realistic. Sound requires a medium (air, water, etc.) to travel through; space is a near-perfect vacuum, so explosive sounds and engine roars in Star Wars are purely cinematic license.",
      "Yes, Interstellar's gravitational lensing visualization is remarkably accurate. Kip Thorne provided the relativistic equations, and the rendering team produced scientifically valid images of light bending around the black hole Gargantua, even leading to academic papers.",
      "Yes, Martian perchlorates (ClO₄⁻ salts) are toxic to humans and would inhibit plant growth; they must be washed out or chemically treated before regolith can support agriculture.",
      "No, using frog DNA to patch gaps is not scientifically plausible. The genetic distance between amphibians and dinosaurs is enormous, and arbitrarily filling sequence gaps would not yield functional genes for a viable organism.",
      "No, orbital plane matching is far from trivial—it requires enormous amounts of delta-v (velocity change). The film depicts transfers between different orbits as simple maneuvers, when they'd require fuel reserves the spacecraft wouldn't have.",
      "Yes, prompt criticality (sudden uncontrolled chain reaction) is a genuine safety concern in nuclear weapons physics and was a critical risk during Manhattan Project experiments, notably in 'tickling the dragon's tail' incidents.",
      "Highly speculative. While linguistic relativity suggests language influences cognition, there's no scientific evidence that learning a language could fundamentally alter temporal perception to enable 'seeing' future events as Arrival depicts.",
      "Yes, Apollo 13's depiction of power rationing and thermal management constraints closely matches the real mission. The spacecraft had to operate on minimal power to conserve batteries, while managing heat dissipation without normal systems.",
      "No, current polygenic risk scores have limited predictive power for complex traits like intelligence or career aptitude. Most complex phenotypes involve thousands of genetic variants plus environmental factors, making deterministic predictions impossible.",
      "No, landing, drilling, and detonating is far less viable than early deflection. The logistics are extraordinarily complex, and timing is critical. Kinetic impactors or gravity tractors applied years in advance are more feasible mitigation strategies.",
      "Yes, near-light-speed travel would produce dramatic relativistic time dilation. At 99.5% light speed, time aboard the spacecraft would pass roughly 10 times slower than for stationary observers, enabling significant aging differences over long journeys.",
    ]
    return templates[prompts.index(prompt)]

def model_b_answer(prompt: str) -> str:
    """GPT-5 - 52s"""
    templates = [
        "Largely plausible under general relativity near a fast-spinning supermassive black hole, but it requires extreme proximity and fine-tuned orbits with severe constraints.",
        "Partly—plants need a controlled habitat and nutrients, and the critical step is removing toxic perchlorates from the regolith (e.g., leaching/heating) before fertilizing.",
        "No; DNA degrades chemically and would not remain viable for ~65 million years in amber.",
        "Yes, the Kessler Syndrome is a real risk, though the film compresses timelines and simplifies orbital mechanics.",
        "Yes—critical mass and rapid supercritical assembly (implosion for plutonium to avoid pre-initiation) were central design drivers.",
        "Loosely—it nods to linguistic relativity and information theory, but the strong effects portrayed are speculative.",
        "Yes—the LiOH canister mismatch required a real improvised adapter built from available materials under strict constraints.",
        "Yes—this level of genetic screening is actively debated, touching on eugenics, discrimination, and consent.",
        "Unlikely—energy requirements and fragmentation make last-minute nuclear disruption ineffective and risky; earlier deflection is preferred.",
        "No—sound cannot propagate in vacuum because there’s no medium.",
        "Largely yes—the visuals were produced with GR-based ray tracing under Kip Thorne’s guidance, with minor artistic tweaks.",
        "Yes—perchlorates are toxic/oxidizing and must be removed or neutralized before agriculture.",
        "Unlikely—frog DNA is far too divergent to plausibly patch dinosaur genomes in a scientifically credible way.",
        "No—orbital plane changes are delta‑v expensive and timing-sensitive, not trivial.",
        "Yes—prompt criticality is a real safety hazard in weapons physics (e.g., Demon Core incidents).",
        "Very speculative—there’s no evidence language learning can induce non-linear temporal perception in humans.",
        "Yes—tight power budgets and thermal management constraints were real and are accurately depicted.",
        "No—polygenic scores are not predictive enough today to determine individual career suitability.",
        "Generally no—landing and drilling are high-risk; slow-push or kinetic/gravity-tractor deflection is more viable.",
        "Yes—at relativistic speeds, time dilation makes travelers age less than those on Earth; gravitational fields can add further dilation.",
    ]
    return templates[prompts.index(prompt)]

records = [{"prompt": p, "answer_a": model_a_answer(p), "answer_b": model_b_answer(p)} for p in prompts]
df = pd.DataFrame(records)
df

```

## 3. 将任务导入 Label Studio

使用任务批量创建以提升速度。

```python
tasks: List[Dict[str, Any]] = df.to_dict(orient="records")
resp = ls.projects.import_tasks(id=project.id, request=tasks, return_task_ids=True)
print("Imported tasks:", resp)
```

    Imported tasks: annotation_count=0 could_be_tasks_list=False data_columns=[] duration=0.04078197479248047 file_upload_ids=[] found_formats=[] predictions_count=None task_count=20 prediction_count=0 task_ids=[483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502]

导入任务后，你就能在 LabelStudio UI 中看到它们了。

![Project Tasks](https://github.com/HumanSignal/awesome-label-studio-tutorials/blob/main/tutorials/how-to-compare-two-ai-models-with-label-studio/how-to-compare-two-ai-models-with-label-studio-files/figure_2.png?raw=true)

## 4. 人工标注轮次

- 标注所有条目（独自或拆分）。
- 保持决策简洁：胜者（A/B/平局）+ 质量（1–5）+ 可选备注。

![Labelling](https://github.com/HumanSignal/awesome-label-studio-tutorials/blob/main/tutorials/how-to-compare-two-ai-models-with-label-studio/how-to-compare-two-ai-models-with-label-studio-files/figure_3.png?raw=true)

## 5. 导出标注并展开结果

```python
from label_studio_sdk.core.api_error import ApiError
from pathlib import Path

# Create export job
export_job = ls.projects.exports.create(id=project.id)
export_id = export_job.id
print(f"Created export snapshot: id={export_id}, status={export_job.status}")

# Poll until completed or failed
start = time.time()
timeout_sec = 300
print("Waiting for export snapshot to complete...")

while True:
    job = ls.projects.exports.get(id=project.id, export_pk=export_id)
    elapsed = int(time.time() - start)
    print(f"Export status: {job.status} (elapsed {elapsed}s)")
    if job.status in ("completed", "failed"):
        break
    if time.time() - start > timeout_sec:
        raise TimeoutError(
            f"Export job timed out (id={export_id}, status={job.status})"
        )
    time.sleep(1.0)
if job.status == "failed":
    raise ApiError(status_code=500, body=f"Export failed: {job}")

# Download export as JSON to local file
out_dir = Path("/content")
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / f"project_{project.id}_export_{export_id}.json"

with open(out_path, "wb") as f:
    for chunk in ls.projects.exports.download(
        id=project.id,
        export_pk=export_id,
        export_type="JSON",
        request_options={"chunk_size": 1024},
    ):
        f.write(chunk)

print(f"Export completed. File saved to: {out_path}")

with open(out_path, "rb") as f:
    export_json = json.load(f)

print("Items loaded:", len(export_json))
```

    Created export snapshot: id=5, status=completed
    Waiting for export snapshot to complete...
    Export status: completed (elapsed 0s)
    Export completed. File saved to: /content/project_36_export_5.json
    Items loaded: 20

```python
# Flatten into a DataFrame
rows = []
for item in export_json:
    data = item.get("data", {})
    anns = item.get("annotations", [])
    if not anns:
        continue
    ann = anns[-1]  # latest annotation
    results = ann.get("result", [])

    winner = None
    quality = None
    notes = None
    for r in results:
        if r.get("from_name") == "winner" and r.get("type") == "choices":
            choices = r.get("value", {}).get("choices", [])
            winner = choices[0] if choices else None
        elif r.get("from_name") == "quality" and r.get("type") == "rating":
            quality = r.get("value", {}).get("rating")
        elif r.get("from_name") == "notes" and r.get("type") == "textarea":
            vals = r.get("value", {}).get("text", [])
            notes = vals[0] if vals else None

    rows.append({
        "prompt": data.get("prompt"),
        "answer_a": data.get("answer_a"),
        "answer_b": data.get("answer_b"),
        "winner": winner,
        "quality": quality,
        "notes": notes
    })

res_df = pd.DataFrame(rows)
print("Labeled items:", len(res_df))
res_df.head()
```

## 6. 基础分析：胜率、置信区间与图表

```python
labeled = res_df.dropna(subset=["winner"])
total = len(labeled)
wins_a = (labeled["winner"] == "Model A").sum()
wins_b = (labeled["winner"] == "Model B").sum()
ties   = (labeled["winner"] == "Tie").sum()

print(f"Total labeled: {total}")
print(f"Model A wins: {wins_a}")
print(f"Model B wins: {wins_b}")
print(f"Ties: {ties}")

# Binomial test for A vs B (ignore ties)
decisive = labeled[labeled["winner"].isin(["Model A", "Model B"])]
n = len(decisive)
a = (decisive["winner"] == "Model A").sum()
b = (decisive["winner"] == "Model B").sum()
print(f"\nDecisive votes: {n} | A: {a} B: {b}")

test = binomtest(a, n, p=0.5, alternative="two-sided") if n > 0 else None
if test:
    win_rate_a = a / n
    ci = test.proportion_ci(confidence_level=0.95)
    ci_low, ci_high = ci.low, ci.high
    print("p-value:", test.pvalue)
    print(f"A win-rate: {win_rate_a:.3f} (95% CI: {ci_low:.3f}–{ci_high:.3f})")
else:
    win_rate_a, ci_low, ci_high = float("nan"), float("nan"), float("nan")

```

    Total labeled: 20
    Model A wins: 10
    Model B wins: 6
    Ties: 4
    
    Decisive votes: 16 | A: 10 B: 6
    p-value: 0.454498291015625
    A win-rate: 0.625 (95% CI: 0.354–0.848)

```python
# Bar chart: A vs B vs Tie
plt.figure(figsize=(6,4))
plt.bar(["Model A", "Model B", "Tie"], [wins_a, wins_b, ties])
plt.title("Human Judgments")
plt.xlabel("Outcome")
plt.ylabel("Count")
plt.tight_layout()
plt.show()

# Histogram: Quality ratings
labeled["quality"] = pd.to_numeric(labeled["quality"], errors="coerce")
plt.figure(figsize=(6,4))
labeled["quality"].dropna().astype(int).hist(bins=[1,2,3,4,5,6])
plt.title("Quality Ratings Distribution")
plt.xlabel("Rating (1-5)")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()

```

## 7. 解读总体质量（1–5）与使用备注

**什么是「总体质量」？**

对条目中获胜答案的一个 1–5 评分。它告诉你胜出是否有说服力（4–5）还是勉强（1–3）。

**如何据此行动**

- **大量 1–2 星**：胜者勉强过关 → 收紧提示词、增加检索/事实依据，或提高评分门槛；考虑用重叠/审核来提升标签可靠性。
- **大多 3 星**：可接受但不够好 → 查看备注寻找快速改进点（例如「啰嗦」「漏掉了高氯酸盐」「物理上含糊其辞」）。
- **大多 4–5 星**：强信号 → 可以放心切换模型或进行流量路由。

**为什么要收集备注？**

它们是根因分析的金矿。在 10–20 条数据中，你就会开始看到重复出现的主题：

> 「生物学细节上的幻觉」「混淆了变轨 Δv」「把推测性论断当作事实陈述」「对简短答案来说太啰嗦」。

把这些变成一个迷你分类法（2–6 个标签），下次按标签衡量胜率。这样就形成了「人工反馈 → 具体修复」的闭环。

## 8. 分段分析：每个模型在哪里胜出（以及为什么重要）

> 我们不止问「整体上谁胜出？」我们还想知道一个模型在哪里胜出，这样决策才具有可操作性。

**这些分段来自哪里？**

- **科学领域** 是从每个提示词的电影/主题推断而来（例如 物理/相对论、轨道力学/航空、生物/遗传、语言学/认知科学、核/武器物理）。
- **问题类型** 对所要求的判断种类进行了分类（事实/物理论断、工程判断、推测/概念、伦理/社会）。

**为什么选这些分段？**

它们映射到真实的路由与建模选择：

- 如果模型 A 在物理上胜出但在生物上落败，就把物理类问题路由给 A、生物类给 B，或改进 A 在生物上的事实依据（文档、检索）。
- 如果 A 在事实上胜出但在工程判断上落败，就调整提示词（要求权衡取舍），或者在需要关于约束的推理时优先选 B。

**如何处理结果？**

- 用堆叠柱状图发现每个分段的强项/弱项。
- 对于薄弱分段，抽样示例 → 阅读备注 → 提取失败主题 → 修复（提示词/RAG/训练），然后重新运行一次小型评估以确认。

### 8.1 分段分析 - 按科学领域

```python
def infer_domain(p: str) -> str:
    if "Interstellar" in p:
        # time dilation, lensing, relativistic aging
        return "Physics/Relativity"
    if "The Martian" in p:
        return "Planetary/Astro Engineering"
    if "Jurassic Park" in p or "Gattaca" in p:
        return "Biology/Genetics"
    if "Gravity" in p or "Armageddon" in p or "Apollo 13" in p:
        return "Orbital Mechanics/Aerospace"
    if "Oppenheimer" in p:
        return "Nuclear/Weapons Physics"
    if "Arrival" in p:
        return "Linguistics/CogSci/Info"
    if "Star Wars" in p:
        return "Orbital Mechanics/Aerospace"  # sound-in-space → physics/aero edge
    return "Other"

labeled["domain"] = labeled["prompt"].apply(infer_domain)

seg_domain = (labeled[labeled["winner"].isin(["Model A","Model B"])]
              .groupby("domain")["winner"]
              .value_counts()
              .unstack(fill_value=0)
              .sort_index())

seg_domain["total"] = seg_domain["Model A"] + seg_domain["Model B"]
seg_domain["win_rate_A"] = seg_domain["Model A"] / seg_domain["total"].replace(0, pd.NA)
seg_domain.sort_values("win_rate_A", ascending=False)

```

```python
ax = seg_domain["win_rate_A"].plot(kind="barh", figsize=(8,4))
ax.set_title("Model A win-rate by scientific domain (A over A+B)")
ax.set_xlabel("Win-rate")
ax.set_xlim(0,1)
plt.tight_layout(); plt.show()

```

### 8.2 分段分析 - 按问题类型

```python
def infer_qtype(p: str) -> str:
    if any(k in p for k in ["plausible", "realistic", "feasible", "viable", "real risk"]):
        return "Factual/Physical Claim"
    if any(k in p for k in ["ethically", "debated", "privacy", "discrimination"]):
        return "Ethics/Societal"
    if any(k in p for k in ["speculative", "non-linear", "temporal perception"]):
        return "Speculative/Conceptual"
    if any(k in p for k in ["power", "thermal", "plane matching", "deflection", "scrubber"]):
        return "Engineering Judgment"
    return "General Fact-Check"

labeled["qtype"] = labeled["prompt"].apply(infer_qtype)

seg_qtype = (labeled[labeled["winner"].isin(["Model A","Model B"])]
             .groupby("qtype")["winner"]
             .value_counts()
             .unstack(fill_value=0))

seg_qtype["win_rate_A"] = seg_qtype["Model A"] / (seg_qtype["Model A"] + seg_qtype["Model B"]).replace(0, pd.NA)
seg_qtype.sort_values("win_rate_A", ascending=False)

```

```python
import matplotlib.pyplot as plt
import numpy as np

seg_qtype_counts = seg_qtype[["Model A", "Model B"]].fillna(0).astype(int)
seg_qtype_counts = seg_qtype_counts.sort_index()  # or .reindex(custom_order)

x = np.arange(len(seg_qtype_counts.index))
a_counts = seg_qtype_counts["Model A"].values
b_counts = seg_qtype_counts["Model B"].values

plt.figure(figsize=(9, 4))
plt.bar(x, a_counts, label="Model A")
plt.bar(x, b_counts, bottom=a_counts, label="Model B")
plt.title("Decisive votes by question type")
plt.ylabel("Count")
plt.xticks(x, seg_qtype_counts.index.astype(str), rotation=20, ha="right")
plt.legend()
plt.tight_layout()
plt.show()

```

## 9. Markdown 报告

```python
summary = f"""
# A/B Human Evaluation — Summary

**Total labeled:** {total}
**Model A wins:** {wins_a}
**Model B wins:** {wins_b}
**Ties:** {ties}

**Decisive votes:** {n}
**A win-rate:** {win_rate_a:.3f} (95% CI: {ci_low:.3f}–{ci_high:.3f})
**p-value:** {getattr(test, 'pvalue', float('nan')):.4f}

**Average quality:** {labeled['quality'].mean():.2f}

**Notes**
- 20 prompts focused on science-in-movies; swap for your own domain easily.
- Keep 20–50 items for a fast, meaningful live demo.
- Consider adding rubric tags (e.g., hallucination, factual error, style) for deeper slices.
"""

with open("report.md", "w") as f:
    f.write(summary)

from datetime import datetime
print(summary)
print("\nSaved report.md at", datetime.now())
```

    # A/B Human Evaluation — Summary
    
    **Total labeled:** 20
    **Model A wins:** 10
    **Model B wins:** 6
    **Ties:** 4
    
    **Decisive votes:** 16
    **A win-rate:** 0.625 (95% CI: 0.354–0.848)
    **p-value:** 0.4545
    
    **Average quality:** 3.45
    
    **Notes**
    - 20 prompts focused on science-in-movies; swap for your own domain easily.
    - Keep 20–50 items for a fast, meaningful live demo.
    - Consider adding rubric tags (e.g., hallucination, factual error, style) for deeper slices.
    
    
    Saved report.md at 2025-10-03 10:08:15.757664

## 结论：我们学到了什么 & 下一步

- 我们在几分钟内跑通了一个可复现的 A/B 人工评估：通过 SDK 建项目 → 导入 → 标注 → 导出 → 图表。
- 除了「A 击败 B」，分段图表还展示胜出来自哪里（按领域与问题类型）。
- 质量评分告诉我们胜出有多有说服力；备注则浮现出可修复的失败主题。

团队下一步：

1. 选定一个上线策略（切换默认模型，或按分段路由）。
2. 根据备注落实两项快速修复（提示词微调、RAG 文档补充、护栏）。
3. 重新运行一次小型重叠评估（Enterprise）以确认质量朝正确方向移动。
4. 自动化：webhook → 导出 → 指标 notebook → 分享报告。
