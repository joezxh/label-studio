---
title: Label Studio 术语表
short: 术语
tier: all
type: guide
order: 16 
order_enterprise: 16
meta_title: Label Studio 术语表
meta_description: Label Studio 中常见术语的词汇表。 
section: "发现与学习"
date: 2023-10-27 11:38:25
---

 下表描述了你在使用 Label Studio 时可能遇到的一些术语：


| 术语   | 说明   |
|--|-----|
| 标注 (Annotations)  | 标注任务的输出。以前称为"completions"。"annotations" 和 "labels" 这两个术语经常互换使用。 |
| 边界框 (Bounding box) | 图像内的区域。 |
| 数据集 (Dataset) | 你导入 Label Studio 的内容，由单独的项或标注任务组成。 |
| 标签 (Labels) | 在 Label Studio 中标注任务时添加到每个区域的内容。  |
| 标注流 (Label stream) | 当你从数据管理器点击 **Label All Tasks**（标注所有任务）时，你正在标注流中工作。 |
| 标注配置 (Labeling configuration) | 标注配置决定了标注者和审阅者将看到的内容。它在项目设置中配置。 |
| 预测 (Predictions)、<br> 预标注 (Pre-annotations) | 机器学习模型为未标注数据集创建的 Label Studio 格式的标注。请参阅[导入预标注](predictions.html)  |
| 关系 (Relation)   | 两个已标注区域之间定义的关系。  |
| 结果 (Result) | 应用于特定区域的标签，存储在标注或预测中。请参阅[标注任务的 Label Studio JSON 格式](export.html#Label-Studio-JSON-format-of-annotated-tasks)。 |
| 快速视图 (Quick view)   | "快速视图"是当你点击数据管理器中的单个项以打开它时所看到的内容（与在"标注流"中查看不同）。   |
| 记录 (Record) | 数据集中的项。   |
| 区域 (Region) | 为标注而标识的任务部分。例如，处理文本时，这可能是特定的文本跨度或字段。对于图像，示例区域是边界框。对于文本，示例区域是文本跨度。通常分配有标签。         |
| 任务 (Task)  | 当你将数据上传到 Label Studio 时，数据集中的每一项都成为标注 *任务*。任务是数据集中一个独立的项，已准备好被标注、预标注，或已经被标注。例如：文本片段、图像或视频剪辑。  |
| 标签 (Tags)   | 用于自定义标注界面的配置选项。请参阅[有关标签的更多信息](/tags)。  |
| 模板 (Templates) | 你可以用来指定使用数据集执行的标注类型的示例标注配置。请参阅[所有可用模板](/templates) |



