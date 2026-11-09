---
title: 共指消解与实体链接
type: templates
category: Conversational AI
cat: conversational-ai
order: 810
meta_title: 共指实体消解与链接数据标注模板
meta_description: 用于为文本数据标注共指，以执行实体消解与实体链接的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/coreference-resolution-and-entity-linking.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个能够在对话式 AI 语境下进行自然语言理解的机器学习模型，你需要对数据集执行共指消解。

使用本模板，通过关系将共指分配给一段文本中识别出的特定实体。你可以在 Label Studio 中为任何已识别的区域片段添加关系。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Labels name="label" toName="text">
    <Label value="Noun" background="red"/>
    <Label value="Pronoun" background="darkorange"/>
  </Labels>
  <Text name="text" value="$text"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签指定要应用于文本片段的标签：
```xml
<Labels name="label" toName="text">
    <Label value="Noun" background="red"/>
    <Label value="Pronoun" background="darkorange"/>
</Labels>
```

[Text](/tags/text.html) 对象标签指定文本数据的值：
```xml
<Text name="text" value="$text"/>
```

要为你已标注的文本片段添加关系，请使用标注界面。请参阅[在标注之间添加关系](/guide/labeling.html#Add-relations-between-annotations)。如果你想为关系本身添加标签，请使用 [Relations](/tags/relations.html) 标签。更多内容请参阅[关系抽取模板](relation_extraction.html)。

## 相关标签

- [Labels](/tags/labels.html)
- [Text](/tags/text.html)
- [Relations](/tags/relations.html)
