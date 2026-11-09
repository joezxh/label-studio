---
title: Task agreement
short: Agreement
tier: enterprise
type: guide
order: 0
order_enterprise: 307
meta_title: Task agreement in Label Studio Enterprise
meta_description: Task agreement, or labeling consensus, and other data annotation statistics for data labeling and machine learning projects.
section: "Review & Measure Quality"
---

在 Label Studio Enterprise 中，你可以应用不同的指标来衡量标注员之间的一致性（agreement）。

任务一致性（Task agreement），也称为 "labeling consensus（标注共识）" 或 "annotation consensus（标注共识）"，显示了多个标注员在标注同一任务时的一致性程度。

一致性可帮助你确定数据集的质量、其用于训练模型的准备情况，并评估你的标注员和审核员的表现。

<iframe class="video-border" style="width: 560px; display: block; margin-left: auto; margin-right: auto;" src="https://www.youtube.com/embed/ivT4UN5LzFw?si=UK88TAuE_iNOEkhj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 查看一致性

你可以通过以下方式查看一致性：
- **Data Manager（数据管理器）** - 显示每个任务的一致性和每个任务的标注员间一致性。请参阅 [数据管理器中的一致性列](manage_data#Agreement-columns)。
- **Data quality dashboard（数据质量仪表板）** - 显示任务一致性分布、按维度的一致性、首要混淆对和混淆矩阵。请参阅 [数据质量仪表板](dashboard_data_quality)。
- **Members dashboard（成员仪表板）** - 显示成员和模型一致性矩阵。请参阅 [成员仪表板](dashboard_members)。

!!! note
    成员仪表板中显示的所有一致性分数都是使用 **Pairwise（配对）** 方法计算的。

## 整体一致性 vs 每个控制标签一致性

一致性在两个层级计算：

* 每个控制标签的一致性（也称为 "question-level agreement（问题级一致性）"）
* 整体一致性

![Screenshot](/images/review/agreement-annotated.png)

### 每个控制标签的一致性

控制标签是你用来标注数据的标签。对象标签是你用来标识要标注的数据的标签，例如 `Image`、`Text` 和 `Audio`。

例如，如果你的标注配置涉及使用 `RectangleLabels`、`Choices` 和 `Rating` 来标注图像，那么你将有三个控制标签。

一致性是针对每个控制标签单独计算的，你可以配置用于计算每个控制标签一致性的指标。请参阅 [内置一致性指标参考](agreement_metrics)。

在数据管理器中，你可以分别查看每个控制标签的一致性分数。这可以让你看到任务的哪些部分具有较高或较低的一致性（例如，边界框上的一致性良好，但选择字段上的一致性较低）。

### 整体一致性

Label Studio 将每个控制标签的分数聚合为单个任务级分数。

默认情况下，这被计算为所有控制标签分数的平均值。这就是当你不按控制标签过滤时，主 **Agreement（一致性）** 列中显示的内容。

你可以通过在计算一致性时设置不同控制标签的 **权重（weight）** 来自定义整体一致性的计算方式。

这确保了关键的控制标签比较不重要的控制标签对整体一致性分数有更大的影响。请参阅 [配置整体一致性的权重](#Configure-weight-for-the-overall-agreement)。

## 分类 vs 非分类控制标签

一致性计算的方式，根据控制标签是 *分类（categorical）* 还是 *非分类（non-categorical）*（也称为 *离散（discrete）* 和 *连续（continuous）*）而有显著不同。

这种区别会影响提取、比较指标和评分方式。

### 分类控制标签

分类控制标签产生离散的、有限的值。标注员从一组定义的选项中进行选择。

示例包括：

- **Choices（选择）**（例如 "Small"、"Medium"、"Large"）
- **Rating（评分）**（例如 1-5 星）

由于分类值是离散的，典型的指标是 **Exact Match（精确匹配）** —— 两个值要么匹配（分数 = `1.0`），要么不匹配（分数 = `0.0`）。

但是，诸如 **Rating** 或 **Number** 之类的标签也可以使用 [**Numeric Difference with Threshold（带阈值的数值差异）**](agreement_metrics#Numeric-Difference)，你可以定义可容忍的数值偏差量（例如，阈值为 `0` 意味着只有相同的评分才计为匹配）。

分类比较本质上产生二进制分数（`0` 或 `1`）。这意味着它们适用于两种一致性方法：

- [**Pairwise Average（配对平均）**](#Pairwise)：跨标注员对平均所有的 0 和 1。
- [**Consensus（共识）**](#Consensus)：由于分数已经是二进制的，因此不需要阈值转换。共识方法自然反映了多数一致性。

请参阅 [分类示例](#Categorical-examples)，了解如何为分类控制标签计算一致性的示例。

### 非分类控制标签

非分类控制标签产生空间、几何或结构数据。标注员绘制区域、高亮跨度或定位元素。

例如：

- **RectangleLabels（矩形标签）**（对象周围的边界框）
- **Labels（标签）**（文本跨度 / NER 标注）
- **PolygonLabels（多边形标签）**、**EllipseLabels（椭圆标签）**、**KeyPointLabels（关键点标签）** 等。

由于两个标注员很少绘制完全相同的区域，系统使用测量重叠程度的连续相似度指标。例如：

- 用于边界框和多边形的 [**IoU（交并比）**](agreement_metrics#Intersection-over-Union-for-bounding-boxes)。返回 `0.0`（无重叠）到 `1.0`（完美重叠）之间的浮点数
- 用于文本跨度的 [**Span Overlap（跨度重叠）**](agreement_metrics#Span-Overlap)。测量两个高亮文本区域重叠的程度

请参阅 [非分类示例](#Non-categorical-examples)，了解如何为非分类控制标签计算一致性的示例。

##### 差异总结

| 方面 | 分类标签 | 非分类标签 |
|---|---|---|
| **输出类型** | 离散值（标签、评分） | 空间/结构数据（框、跨度） |
| **典型指标** | 精确匹配、数值差异 | IoU、跨度重叠 |
| **分数类型** | 二进制（`0` 或 `1`） | 连续（`0.0` 到 `1.0`） |
| **Pairwise** | 直接适用；平均二进制分数 | 直接适用；平均连续分数 |
| **Consensus** | 直接适用；不需要阈值 | 需要用户定义的阈值先将分数二值化 |

## 方法论

你可以在 **Settings > Quality > Agreement（设置 > 质量 > 一致性）** 部分下为每个项目配置要使用的方法论。

<img src="/images/review/agreement-methodology.png" class="gif-border" style="max-width:600px">

你可以从以下方法论中进行选择：

* **Consensus（共识）**：共识衡量 *"选择最常见答案的标注员百分比是多少？"*

  ![Consensus example](/images/review/consensus-categorical.png)

* **Pairwise（配对）**：配对衡量 *"所有标注员对之间的平均一致性分数是多少？"*

  ![Pairwise example](/images/review/pairwise-categorical.png)

!!! info 提示
    你可以随时在方法论之间切换。

### Consensus（共识）

一致性跨所有标注员一次性计算，衡量他们向共同答案收敛的程度。

<img src="/images/review/consensus-1.png" alt="Screenshot" style="display: block; margin: 0 auto; max-width: 300px" />

有两种同样有效的方式来理解共识：

* *有多少标注员达成一致？*

以及

* *有多少标注员选择了最常见的答案？*

说明这一点最简单的方法是举一个每个标注员选择不同选择的示例：

* 标注员 1 选择 A
* 标注员 2 选择 B
* 标注员 3 选择 C

即使没有任何标注员彼此达成一致，一致性仍然为 `1/3 = 33.33%`。

* *有多少标注员达成一致？*

  给定三个标注员，每个选择各有 1/3 的人选择：`1/3 = 33.33%`

* *有多少标注员选择了最常见的答案？*

  在这种情况下，A、B 和 C 各被选择了一次，因此同样常见。

  所以 3 个标注员中有 1 个选择了最常见的答案：`1/3 = 33.33%`

如果你切换到 Pairwise 方法论，同一个任务的一致性分数将为 `0%`，因为 Pairwise 更关注标注员对之间的一致性程度。

#### 共识中的二进制评分

共识使用二进制分数来衡量一致性 —— 每对标注员要么匹配（`1`），要么不匹配（`0`）。

* 对于像 **Choices** 或 **Rating** 这样的分类标签，这种二进制结果自然发生：两个标注员要么选择了相同的值，要么没有。

* 对于像边界框或文本跨度这样的非分类标签，原始比较产生一个连续分数（例如 IoU 为 `0.82`）。因此，对于非分类标签，你必须定义一个阈值来确定连续分数是否高到足以被视为匹配，从而允许 Label Studio 将其转换为二进制决策。

  在阈值或以上计为匹配（`1`），低于阈值则不计（`0`）。

一旦标注被简化为 `1` 或 `0`，共识就会计算该组总体上收敛的程度。

### Pairwise（配对）

正如 "Pairwise" 这个名字所示，Pairwise 查看每对 *唯一* 标注员之间的一致性，然后对这些一致性进行平均。

<img src="/images/review/pairwise-1.png" alt="Screenshot" style="display: block; margin: 0 auto; max-width: 300px" />

Pairwise 通过比较每对唯一的标注员、为每个配对计算分数，然后将所有这些分数平均在一起来衡量一致性。

给定前面相同的示例：

* 标注员 1 选择 A
* 标注员 2 选择 B
* 标注员 3 选择 C

虽然共识一致性分数为 `33.33%`，但 Pairwise 一致性分数为 `0%`。

* 标注员 1 与标注员 2 比较（不匹配 = `0`）
* 标注员 1 与标注员 3 比较（不匹配 = `0`）
* 标注员 2 与标注员 3 比较（不匹配 = `0`）

`(0 + 0 + 0)/3 = 0`

对于分类标签，每个配对产生一个二进制结果：匹配计 `1`，不匹配计 `0`。这些二进制值的平均值成为整体一致性。

对于像边界框这样的非分类标签，每个配对产生一个连续分数（例如 IoU 为 `0.82`），这些原始分数被直接平均，无需任何阈值转换。

这意味着 Pairwise 保留了非分类比较的完整粒度，奖励部分重叠，而不是将其简化为全有或全无。

!!! info 提示
    对于使用 Consensus 方法论的非分类标签，你必须使用精确匹配或具有阈值的连续指标。对于 Pairwise，你可以使用精确匹配、没有阈值的连续指标，或带有阈值的连续指标。

### Consensus vs. Pairwise 一览

| | **Pairwise** | **Consensus** |
|---|---|---|
| **工作原理** | 比较每对唯一的标注员，为每个配对评分，并平均所有配对分数 | 使用二进制匹配/不匹配来衡量整个小组向共同答案收敛的程度 |
| **使用的分数类型** | 直接使用原始分数（分类为二进制，非分类为连续） | 始终需要二进制分数（匹配或不匹配） |
| **需要阈值吗？** | 否 —— 按原样使用原始分数 | 仅针对非分类标签；分类标签已经是二进制 |
| **部分得分** | 是 —— 0.6 的边界框重叠为平均值贡献 0.6 | 否 —— 重叠要么高于阈值（匹配），要么低于阈值（不匹配） |
| **对异常值的敏感性** | 高 —— 一个持不同意见的标注员会产生多个低分配对，拉低平均值 | 低 —— 一个持不同意见的标注员被多数票否决 |
| **3 个标注员，2 个一致（分类）** | 33%（3 个配对中只有 1 个匹配） | 66%（识别出多数一致性） |
| **3 个标注员，全部一致** | 100% | 100% |
| **3 个标注员，无一致** | 0% | 33%（3 个标注员中有 1 个选择了最常见的答案） |
| **最适合** | 每个任务有 2 个标注员的项目，或者当你想要细粒度的连续分数时 | 每个任务有 3 个或更多标注员的项目，或者当多数一致性最重要时 |

#### 何时选择 Pairwise 与 Consensus

用极其简单的话来说：

* 如果你更关注你的标注员，Pairwise 是最佳选择。
* 如果你更关注多数标注员是否同意某个特定答案，Consensus 是最佳选择。

##### Pairwise

**Pairwise** 告诉你标注员总体上彼此一致的程度。

* 最适合当你关注评估你的标注员、想要了解标注群体中的不一致/碎片化，并发现你的任务和/或指令中的歧义时。

* 可能对异常值更敏感，这可能是所需的（单个持不同意见的标注员会显著降低分数）

* Pairwise 不需要你为非分类控制标签（例如 `RectangleLabels` 和 `TextArea`）定义阈值，因此在这种情况下可能更简单设置。

##### Consensus

**Consensus** 告诉你任务在单个答案上收敛的强度。

* 更好地反映多数一致性，并且对大多数用户来说更直观。

* 对异常值更稳健（单个持不同意见的标注员影响较小）。

* 共识测量是标签稳定性和任务收敛性的一个很好的代理。

* 需要为非分类控制标签设置阈值。阈值定义了你所说的 "足够接近" 的含义。请参阅 [非分类示例](#Non-categorical-examples)，了解使用阈值的共识计算示例。

### 示例

#### 分类示例

[分类控制标签](#Categorical-control-tags) 是具有固定选项集的控制标签。例如，具有 "Opossum"、"Cat"、"Hamster" 选项的控制标签。

<div class="code-tabs">
  <div data-name="Pairwise">

假设你有 3 个标注员在 3 个不同的选择 "A"、"B"、"C" 之间进行选择。

![Pairwise example](/images/review/pairwise-categorical-0.png)

如果所有三个标注员都选择不同的选择，Pairwise 为 `0`：

* 标注员 1 与标注员 2 比较（不匹配 = `0`）
* 标注员 1 与标注员 3 比较（不匹配 = `0`）
* 标注员 2 与标注员 3 比较（不匹配 = `0`）

`(0 + 0 + 0)/3 = 0`

![Pairwise example](/images/review/pairwise-categorical-1.png)

如果标注员 2 改变其选择以与标注员 1 一致，一致性将变为 `33.33%`：

* 标注员 1 与标注员 2 比较（匹配 = `1`）
* 标注员 1 与标注员 3 比较（不匹配 = `0`）
* 标注员 2 与标注员 3 比较（不匹配 = `0`）

`(1 + 0 + 0)/3 = .33`

![Pairwise example](/images/review/pairwise-categorical-2.png)

如果标注员 3 改变其选择以与标注员 1 和标注员 2 一致，一致性将变为 `100%`：

* 标注员 1 与标注员 2 比较（匹配 = `1`）
* 标注员 1 与标注员 3 比较（匹配 = `1`）
* 标注员 2 与标注员 3 比较（匹配 = `1`）

`(1 + 1 + 1)/3 = 1`

如你所见，Pairwise 可能不如 Consensus 直观（例如，当标注员 3 改变其选择时，从 33.33% 变为 100%），但它对异常值更敏感。

</div>

<div data-name="Consensus">

假设你有 3 个标注员在 3 个不同的选择 "A"、"B"、"C" 之间进行选择。

![Consensus example](/images/review/consensus-categorical-0.png)

如果所有三个标注员都选择不同的选择，Consensus 为 `33.33%`：

* 标注员 1 选择 "A"
* 标注员 2 选择 "B"
* 标注员 3 选择 "C"

在 Consensus 中，我们查看最常见的答案。在这种情况下，`A`、`B` 和 `C` 各被选择了一次，因此同样常见。

所以 3 个标注员中有 1 个选择了最常见的答案（`1/3 = .33`）。

* 他们的选择值是什么并不重要，只是有 3 个选择，并且标注员之间没有重叠的选择。
* 在这种情况下，任何一个选择都会成为 "最常见的答案"，因为它们都同样常见（都只被选择了一次）。

![Consensus example](/images/review/consensus-categorical-1.png)

如果标注员 2 改变其选择以与标注员 1 一致，一致性将增加到 `66.67%`：

* 标注员 1 选择 "A"
* 标注员 2 选择 "A"
* 标注员 3 选择 "C"

在这种情况下，`A` 被选择了两次，`C` 被选择了一次。

所以 3 个标注员中有 2 个选择了最常见的答案（`2/3 = .66`）。

![Consensus example](/images/review/consensus-categorical-2.png)

如果标注员 3 改变其选择以与标注员 1 和标注员 2 一致，一致性将增加到 `100%`。

所有 3 个标注员都选择了最常见的答案（`3/3 = 1.0`）。

</div>
</div>

#### 非分类示例

[非分类控制标签](#Non-categorical-control-tags) 是具有连续值的控制标签，不像 "匹配" 或 "不匹配" 那样简单量化。例如，**RectangleLabels**、**PolygonLabels** 和 **Labels**。

##### 边界框

当你使用边界框标注图像时，可以使用 **Exact Match（精确匹配）**、**Intersection over Union (IoU)（交并比）** 或 **Intersection over Union (IoU) (Threshold)（交并比（阈值））** 指标。

在此示例中，我们将查看 **Intersection over Union (IoU)（交并比）** 和 **Intersection over Union (IoU) (Threshold)（交并比（阈值））**。

Intersection over Union，即 IoU，是一种说明两个边界框有多相似的方法。

其思想是：

- **Intersection（交集）**：两个框共享的区域
- **Union（并集）**：两个框一起覆盖的总区域

有关 IoU 如何计算的更多信息，请参阅 [Intersection over Union (IoU)（交并比）](agreement_metrics#Intersection-over-Union-for-bounding-boxes)。

有关阈值的更多信息，请参阅以下视频：

<iframe class="video-border" style="width: 560px; display: block; margin-left: auto; margin-right: auto;" src="https://www.youtube.com/embed/j5xsZQHQ_s0?si=k0QqWNpKBdJD_FW2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<div class="code-tabs">
  <div data-name="Pairwise">

假设你有 3 个标注员使用 **RectangleLabels** 绘制框。你使用 **Intersection over Union (IoU)（交并比）** 指标来计算一致性。

![Pairwise example](/images/review/pairwise-non-categorical-bbox.png)

如果所有三个标注员在图像完全不同的区域绘制其框，没有重叠，Pairwise 为 `0%`：

* 标注员 1 与标注员 2 比较（无重叠，IoU = `0`）
* 标注员 1 与标注员 3 比较（无重叠，IoU = `0`）
* 标注员 2 与标注员 3 比较（无重叠，IoU = `0`）

`(0 + 0 + 0) / 3 = 0`

现在标注员调整他们的框，使它们之间有一些重叠。在这种情况下，一致性为 `40.67%`：

- 标注员 1 vs 标注员 2（IoU = `.53`）
- 标注员 1 vs 标注员 3（IoU = `.24`）
- 标注员 2 vs 标注员 3（IoU = `.45`）

`(.53 + .24 + .45) / 3 = 40.67%`

</div>

<div data-name="Consensus">

假设你有 3 个标注员使用 **RectangleLabels** 绘制框。

然而，Consensus 需要二进制（`0` 或 `1`）分数。所以这次，你使用 **Intersection over Union (IoU) (Threshold)（交并比（阈值））** 指标来计算一致性。

这与 Pairwise 示例中使用的 **Intersection over Union（交并比）** 指标相同，但应用了阈值。阈值是必要的，以确定什么被视为匹配（`1`），什么不被视为匹配（`0`）。

假设你将阈值设置为 `50%`：任何 IoU >= 0.50 的配对计为匹配（`1`），低于该值的计为不匹配（`0`）。

![Consensus example](/images/review/consensus-non-categorical-bbox.png)

你有以下原始 IoU 分数：

- 标注员 1 vs 标注员 2（IoU = `.53`）
- 标注员 1 vs 标注员 3（IoU = `.24`）
- 标注员 2 vs 标注员 3（IoU = `.45`）

**使用阈值（50%）二值化：**

- 标注员 1 vs 标注员 2：`.53` >= `.50` → 匹配 = 1
- 标注员 1 vs 标注员 3：`.24` <= `.50` → 不匹配 = 0
- 标注员 2 vs 标注员 3：`.45` <= `.50` → 不匹配 = 0

标注员 1 和标注员 2 一致，给出的共识分数为 `2/3 = .66`。

**更强的 IoU 一致性**

会出现这样的情况：一致性高于简单的 2 个标注员一致，但低于全部三个一致。

例如，在以下图像中：

![Screenshot of opossum bboxes](/images/review/agreement-bbox-opossum.png)

* 标注员 1 和标注员 2 有强重叠
* 标注员 2 和标注员 3 有强重叠
* 标注员 1 和 3 有弱重叠

在这些情况下，一致性会更高，以反映一致性比简单的 2/3 共识更强。（在上面的示例中，一致性分数为 `80.47%`。）

  </div>
</div>

##### 文本跨度

当你标注文本跨度时，可以使用 **Exact Match（精确匹配）**、**Span Overlap（跨度重叠）** 或 **Span Overlap (Threshold)（跨度重叠（阈值））** 指标。

在此示例中，我们将查看 **Span Overlap（跨度重叠）** 和 **Span Overlap (Threshold)（跨度重叠（阈值））**。

Span Overlap 衡量标注员高亮区域重合的程度。有关其计算方式的更多信息，请参阅 [Span Overlap（跨度重叠）](agreement_metrics#Span-Overlap)。

<div class="code-tabs">
  <div data-name="Pairwise">

你有三个标注员高亮文本跨度，将其标注为 "Positive" 或 "Negative"。

![Pairwise example](/images/review/pairwise-non-categorical-text.png)

* 标注员 1 选择 "Positive" 并高亮跨度 `Excellent tool` = 字符 0-14
* 标注员 2 选择 "Positive" 并高亮跨度 `tool` = 字符 10-14
* 标注员 3 选择 "Negative" 并高亮跨度 `tool` = 字符 10-14

标注员 3 的重叠被抵消，因为她为她的文本跨度选择了不同的标签。

* 标注员 1 与标注员 2 比较：重叠为 `4/14 = .29`
* 标注员 1 与标注员 3 比较：重叠为 `0`，因为他们选择了不同的标签
* 标注员 2 与标注员 3 比较：重叠为 `0`，因为他们选择了不同的标签

`(.29 + 0 + 0) / 3 = 0.0966`

</div>

<div data-name="Consensus">

你有三个标注员高亮文本跨度，将其标注为 "Positive" 或 "Negative"。

![Consensus example](/images/review/consensus-non-categorical-text.png)

* 标注员 1 选择 "Positive" 并高亮跨度 `Excellent tool` = 字符 0-14
* 标注员 2 选择 "Positive" 并高亮跨度 `tool` = 字符 10-14
* 标注员 3 选择 "Negative" 并高亮跨度 `tool` = 字符 10-14

标注员 3 的重叠被抵消，因为她为她的文本跨度选择了不同的标签。

标注员 1 和 2 有 29% 的重叠（`4/14 = .29`）。

然而，Consensus 需要二进制（`0` 或 `1`）分数来确定匹配，这就是为什么你必须为非分类标签选择阈值。

在这种情况下，阈值设置得相当低，为 `25%`，这意味着标注员 1 和标注员 2 提交的标注被视为匹配。

因此，3 个标注员中有 2 个一致，这给出的分数一致为（`2/3 = .66`）。

  </div>
</div>

你可以在 [内置指标参考](agreement_metrics#Examples) 中找到其他示例。

## 其他一致性设置

选择方法论后，你可以在 **Settings > Quality > Agreement（设置 > 质量 > 一致性）** 下配置一致性的其他设置

### 内置 vs 自定义指标

在 **Built-in Metrics vs Custom（内置指标 vs 自定义）** 下，你可以选择是想要自定义自己的一致性指标，还是使用内置指标。

* **Built-In Agreement Metrics（内置一致性指标）** - 如果你选择 **Built-in metrics（内置指标）**，你将看到 [内置指标参考](agreement_metrics) 中列出的内置指标。

* **Custom Agreement Metrics（自定义一致性指标）** - 如果你选择 **Custom metrics（自定义指标）**，你将能够通过文本框中编写代码来创建自己的一致性指标。请参阅 [向 Label Studio 添加自定义一致性指标](custom_metric)。

### 配置整体一致性的权重

整体一致性是所有控制标签一致性分数的平均值。它显示在数据管理器的主 **Agreement（一致性）** 列中。

在 **Settings > Quality > Agreement > Overall Agreement（设置 > 质量 > 一致性 > 整体一致性）** 下，你可以通过在计算一致性时设置不同控制标签的 **权重（weight）** 来自定义整体一致性的计算方式。

这确保了关键的控制标签比较不重要的控制标签对整体一致性分数有更大的影响。

<img src="/images/review/agreement-overall.png" class="gif-border" style="max-width:600px">

例如，如果你有一个包含以下控制标签和权重的项目：
- RectangleLabels: 1.0
- Choices: 0.3
- Rating: 0.2

以及某个任务以下每个控制标签的一致性分数：
- RectangleLabels: 83%
- Choices: 33%
- Rating: 33%

那么整体一致性计算为：

`(1.0 * 83% + 0.3 * 33% + 0.2 * 33%) / (1.0 + 0.3 + 0.2) = 60.67%`

### 配置每个控制标签的一致性

在 **Settings > Quality > Agreement > Agreement Columns（设置 > 质量 > 一致性 > 一致性列）** 下，你可以自定义如何为每个控制标签计算一致性。

<img src="/images/review/agreement-column-settings.png" class="gif-border" style="max-width:600px">

你的选项取决于你选择的一致性方法论以及你正在配置的控制标签类型。

有关每个控制标签可用的不同指标的更多信息，请参阅 [内置指标参考](agreement_metrics)。
