---
title: Relations
type: tags
order: 424
meta_title: 用于多个关系的 Relations 标签
meta_description: 通过为已标注区域之间的关系添加标签来自定义 Label Studio，用于机器学习和数据科学项目。
---

`Relations` 标签用于在区域之间创建标签关系。可用于提供多个值，以应用到两个已标注区域之间的关系。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）。

{% insertmd zh-cn/includes/tags/relations.md %}

### 示例

用于为两段已标注文本区域之间识别出的关系应用 "similar" 或 "dissimilar" 标签的基础标注配置

```html
<View>
  <Relations>
    <Relation value="similar" />
    <Relation value="dissimilar" />
  </Relations>

  <Text name="txt-1" value="$text" />
  <Labels name="lbl-1" toName="txt-1">
    <Label value="Relevant" />
    <Label value="Not Relevant" />
  </Labels>
</View>
```
