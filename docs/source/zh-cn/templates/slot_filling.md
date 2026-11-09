---
title: 槽填充与意图分类
type: templates
category: Conversational AI
cat: conversational-ai
order: 820
meta_title: 槽填充与意图分类数据标注模板
meta_description: 用于对话式自然语言理解使用场景的槽填充与意图分类模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/intent-classification-and-slot-filling.png" alt="" class="gif-border" width="552px" height="408px" />

在自然语言理解场景中，当你需要检测对话中说话人的意图时，请执行意图分类和槽填充，以识别与对话意图相关的实体，并对这些实体进行分类。

使用本模板来提供一段对话，为对话中的文本片段分配标签，并对对话的意图进行分类。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <ParagraphLabels name="entity_slot" toName="dialogue">
    <Label value="Person" background="#ff0012"/>
    <Label value="Organization" background="#2311de" />
    <Label value="Location" background="#00ff01"/>
    <Label value="Datetime" />
    <Label value="Quantity" />
  </ParagraphLabels>
  <Paragraphs name="dialogue" value="$dialogue" layout="dialogue" />
    <Choices name="intent" toName="dialogue"
         choice="single" showInline="true">
        <Choice value="Greeting"/>
        <Choice value="Customer request"/>
        <Choice value="Small talk"/>
    </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [ParagraphLabels](/tags/paragraphlabels.html) 控制标签将标签应用于特定的对话片段：
```xml
<ParagraphLabels name="entity_slot" toName="dialogue">
    <Label value="Person" background="#ff0012"/>
    <Label value="Organization" background="#2311de" />
    <Label value="Location" background="#00ff01"/>
    <Label value="Datetime" />
    <Label value="Quantity" />
</ParagraphLabels>
```

使用 [Paragraphs](/tags/paragraphs.html) 对象标签显示对话：
```xml
<Paragraphs name="dialogue" value="$dialogue" layout="dialogue" />
```
  
使用 [Choices](/tags/choices.html) 控制标签为对话选择一个单一的分类标签，让标注人员对对话的意图进行分类：
```xml
<Choices name="intent" toName="dialogue" 
         choice="single" showInline="true">
    <Choice value="Greeting"/>
    <Choice value="Customer request"/>
    <Choice value="Small talk"/>
</Choices>
```
`choice="single"` 参数将标注人员限制为只能选择一个选项，而 `showInline="true"` 控制选项在标注界面上的显示方式。

## 相关标签

- [ParagraphLabels](/tags/paragraphlabels.html)
- [Label](/tags/label.html)
- [Paragraphs](/tags/paragraphs.html)
- [Choices](/tags/choices.html)
