---
title: Paragraphs
type: tags
order: 306
meta_title: 用于段落的 Paragraphs 标签
meta_description: 使用 Paragraphs 标签自定义 Label Studio，为 NLP 和 NER 的机器学习和数据科学项目标注段落。
---

`Paragraphs` 标签在标注界面上显示文本段落。适用于为 NLP 和 NER 项目标注对话记录。
`Paragraphs` 标签期望的任务数据格式为如下形式的对象数组：
[{ $nameKey: "Author name", $textKey: "Text" }, ... ]

与以下数据类型配合使用：text（文本）。

{% insertmd zh-cn/includes/tags/paragraphs.md %}

### 示例

用于标注包含对话的文本段落区域的标注配置

```html
<View>
  <Paragraphs name="dialogue-1" value="$dialogue" layout="dialogue" />
  <ParagraphLabels name="importance" toName="dialogue-1">
    <Label value="Important content"></Label>
    <Label value="Random talk"></Label>
  </ParagraphLabels>
</View>
```
### 示例

带音频的 Paragraphs

```html
<View>
  <Paragraphs audioUrl="$audio" value="$para" name="paragraphs"
              layout="dialogue" textKey="text" nameKey="author"
              showPlayer="true"
              />

  <Choices name="choices" toName="paragraphs" choice="multiple">
      <Choice value="Good quality"/>
      <Choice value="Fast speech"/>
  </Choices>
</View>

<!-- {"data": {
  "para": [
    {"text": "test 1", "author": "A", "start": 0.0, "end": 1.0},
    {"text": "test 2", "author": "B", "start": 1.0, "end": 2.0},
    {"text": "test 3", "author": "A", "start": 2.0, "end": 3.0}
  ],
  "audio": "/static/samples/game.wav"
}}
-->
```
