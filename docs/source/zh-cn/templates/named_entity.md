---
title: 命名实体识别
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 201
meta_title: 文本命名实体识别数据标注模板
meta_description: 用于使用 Label Studio 对文本执行命名实体识别的模板，适用于你的机器学习和数据科学项目。
---


<img src="/images/templates/named-entity-recognition.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想对文本样本执行命名实体识别（NER），请使用本模板。本模板支持重叠的文本片段以及非常长的文档。

<a href="https://app.humansignal.com/b/MTk5"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>
  <Text name="text" value="$text"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 Labels 控制标签指定要应用于不同文本片段的相关 NER 标签：
```xml
<Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
</Labels>
```
使用 Label 控制标签的 `background` 参数为标签指定一个 CSS 颜色。

使用 Text 对象标签指定文本数据：
```xml
<Text name="text" value="$text"/>
```

## 增强此模板

你可以通过多种方式增强此模板。

### 在左侧显示标签

如果你想修改标注界面的外观，可以对 [View](/tags/view.html) 标签使用样式。在本示例中，将 NER 标签显示在待标注文本的左侧。

首先，将整个标注界面显示设置为 flex：
```xml
<View style="display: flex;">
```

然后使用一个不同的 [View](/tags/view.html) 标签来包裹标签。由于标签列在文本之前，它们会显示在界面的左侧。
```xml
<View style="width: 250px; margin-right: 1em; padding: 1em; background: #343c7f;">
```
该标签上的样式为包含标签的界面区域设置了宽度，在标签和文本之间添加了右边距，为标签添加了内边距，并为此区域设置了背景色。

然后你可以像往常一样添加 [Labels](/tags/labels.html) 控制标签来显示 NER 标签：
```xml
  <Labels name="label" toName="text" showInline="false">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>
```
关闭包含 Labels 的 [View](/tags/view.html) 标签，并为 Text 标签打开一个新的：
```xml
</View>
<View>
```

[Text](/tags/text.html) 对象标签指定要标注的文本：
```xml
<Text name="text" value="$text"></Text>
```

然后关闭剩余的两个 View 标签。

### 强制词对齐

如果你想只允许标注完整的词，并在标注任务中强制词对齐，可以使用 [Text](/tags/text.html) 对象标签上的 `granularity` 参数，以确保 NER 任务中所有高亮的片段都是完整的词。

例如，按如下方式调整你的 Text 标签：
```xml
<Text name="text" value="$text" granularity="word" />
```

### 为特定 NER 片段添加上下文

如果你想为特定的 NER 片段添加上下文，可以使用 NER 模板设置条件式的**逐区域标注**。

例如，提示标注人员选择文本样本中每个文本片段的相关性：
```xml
<Choices name="relevance" toName="text" perRegion="true">
    <Choice value="Relevant" />
    <Choice value="Non Relevant" />
</Choices>
```
`perRegion` 参数表示这些选项应用于每个文本片段区域。

你也可以结合 [View](/tags/view.html) 标签与 [Rating](/tags/rating.html) 控制标签的 `perRegion` 参数，提示标注人员对他们对每个单独文本片段区域准确性的信心进行评分：
```xml
<View visibleWhen="region-selected">
    <Header value="Your confidence" />
</View>
<Rating name="confidence" toName="text" perRegion="true" />
```
View 标签的 `visibleWhen` 参数表示当选中某个特定区域时，Header 会出现，提示标注人员提供一个适用于该区域的评分。

### 筛选长列表标签

如果你想筛选一个长列表的标签，可以在标注配置中添加 [Filter](/tags/filter.html) 标签。例如，要筛选命名实体识别的标签，请添加以下内容：
```xml
<Filter name="filter" toName="label" hotkey="shift+f" minlength="1" />
<Labels name="label" toName="text" showInline="false">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
</Labels>
```
Filter 标签上的 `toName` 参数引用了 [Labels](/tags/labels.html) 标签的 `name` 参数。你还可以指定用于筛选文本框的 `hotkey`，并设置 `minlength` 参数以指定在筛选标签列表之前必须在筛选框中键入的最小字符数。

## 相关标签

- [View](/tags/view.html)
- [Labels](/tags/labels.html)
- [Text](/tags/text.html)
