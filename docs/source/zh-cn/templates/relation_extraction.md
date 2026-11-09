---
title: 关系抽取
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 215
meta_title: 关系抽取数据标注模板
meta_description: 用于使用 Label Studio 在自然语言处理文本任务中执行关系抽取的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/relation-extraction.png" alt="" class="gif-border" width="552px" height="408px" />

如果你需要训练一个自然语言处理模型来执行关系抽取任务，请使用本模板来创建数据集。本模板提示标注人员标注文本片段，并识别片段之间的关系。例如，识别人物和组织，并添加关系箭头和标签来指明谁创立了某个组织。

<!--由于预览中关系选项不可见，故有意移除交互式模板-->

## 标注配置

```html
<View>
   <Relations>
    <Relation value="org:founded_by"/>
    <Relation value="org:founded"/>
  </Relations>
  <Labels name="label" toName="text">
    <Label value="Organization" background="orange"/>
    <Label value="Person" background="green"/>
    <Label value="Datetime" background="blue"/>
  </Labels>
  <Text name="text" value="$text"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Relations](/tags/relations.html) 控制标签来提供可应用于文本片段之间关系的标签：
```xml
<Relations>
    <Relation value="org:founded_by"/>
    <Relation value="org:founded"/>
</Relations>
```

使用 [Labels](/tags/labels.html) 控制标签来指定应用于文本片段的标签：
```xml
<Labels name="label" toName="text">
    <Label value="Organization" background="orange"/>
    <Label value="Person" background="green"/>
    <Label value="Datetime" background="blue"/>
</Labels>
```

使用 [Text](/tags/text.html) 对象标签在标注界面上显示文本：
```xml
<Text name="text" value="$text"/>
```

## 相关标签

- [Relations](/tags/relations.html)
- [Labels](/tags/labels.html)
- [Text](/tags/text.html)

## 相关模板

- [共指消解与实体链接](coreference_entity_linking.html)
