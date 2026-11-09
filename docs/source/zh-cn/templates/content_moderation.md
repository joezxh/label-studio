---
title: 内容审核
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 235
meta_title: 内容审核标注模板
meta_description: 用于执行内容审核标注任务的模板。
---

<img src="/images/templates/content-moderation.png" alt="" class="gif-border" width="552px"  />

你可以将此模板用于内容审核项目。

本模板会显示来自源数据的文本，然后允许标注人员选择任意组合的内容审核标签。如果预设的选项不够用，他们可以在提供的文本域中添加上下文或评论。

## 标注配置

```xml
<View>
  <Text name="text" value="$text"/>
  <Choices name="content_moderation" toName="text" choice="multiple" showInline="false">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
  </Choices>
  <View style="margin: var(--spacing-tight); box-shadow: 0 4px 8px rgba(var(--color-neutral-shadow-raw) / 10%); padding: var(--spacing-tight) var(--spacing-base); border-radius: var(--corner-radius-small); background-color: var(--color-neutral-background); border: 1px solid var(--color-neutral-border);">
    <Header value="Please provide additional comments"/>
    <TextArea name="comments" toName="text" required="false"/>
  </View>
</View>
```

## 关于此标注配置

#### 文本

```xml
<Text name="text" value="$text"/>
```

这会显示需要审核的文本。导入文本文件有多种方式。请参阅 [Text 标签文档](/tags/text.html) 以及我们的[导入文档](/guide/tasks#Types-of-data-you-can-import-into-Label-Studio)。

#### 选项

```xml
<Choices name="content_moderation" toName="text" choice="multiple" showInline="false">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
</Choices>
```

`<Choices>` 标签为文本提供了一组六个类别标签。由于 `choice="multiple"`，标注人员可以在适用时选择多个标签。`showInline="false"` 参数将每个选项放在单独的一行，而不是并排显示。


#### 文本域

```xml
<TextArea name="comments" toName="text" required="false"/>
```

文本域区块（包裹在一个带样式的 `<View>` 中）提示标注人员针对他们选择某些标签的原因，或任何其他想要补充的观察，写下可选的评论。


## 相关标签

- [Text](/tags/text.html)
- [Choices](/tags/choices.html)
- [TextArea](/tags/textarea.html)
