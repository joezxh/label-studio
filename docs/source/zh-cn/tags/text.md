---
title: Text
type: tags
order: 309
meta_title: 用于文本对象的 Text 标签
meta_description: 使用 Text 标签自定义 Label Studio，为 NLP 和 NER 的机器学习和数据科学项目标注文本。
---

`Text` 标签用于显示可标注的文本。可在标注界面上显示任意类型的文本。
你可以使用 `<Style>.htx-text{ white-space: pre-wrap; }</Style>` 来保留文本中的所有空格，否则在显示和保存结果时空格会被裁剪。

在计算结果偏移量（例如 NER 标注任务）时，文本样本中的每一处空格都会被计入。

与以下数据类型配合使用：text（文本）。

### 如何在 Python 中读取文本文件？
Label Studio 编辑器将 `\r\n` 视为两个不同的符号，显示为 `\n\n`，使得行与行之间看起来有多余的间距。
你应当预处理文件，将 `\r\n` 完全替换为 `\n`，或者在 Python 中使用 `newline=''` 打开文件，以避免将 `\r\n` 转换为 `\n`：
`with open('my-file.txt', encoding='utf-8', newline='') as f: text = f.read()`
当你进行 span NER 标注并需要获取正确的偏移量时，这一点尤为重要：
`text[start_offset:end_offset]`

{% insertmd zh-cn/includes/tags/text.md %}

### 示例

用于以单词级粒度标注 NER 任务文本的标注配置

```html
<View>
  <Text name="text-1" value="$text" granularity="word" highlightColor="#ff0000" />
  <Labels name="ner" toName="text-1">
    <Label value="Person" />
    <Label value="Location" />
  </Labels>
</View>
```
### 示例
```html
<Text name="p1">Some simple text with explanations</Text>
```
