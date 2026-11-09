---
title: HTML 分类
type: templates
category: Structured Data Parsing
cat: structured-data-parsing
order: 520
meta_title: HTML 分类数据标注模板
meta_description: 用于使用 Label Studio 对 HTML 文档进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/html-classification.png" alt="" class="gif-border" width="552px" height="352px" />

对于内容审核，以及你希望对 HTML 内容进行分类的其他使用场景，可以使用本模板。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Choices name="toxicity" toName="web_page" choice="multiple" showInline="true">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
  </Choices>

  <View style="border: 1px solid #CCC;
               border-radius: 10px;
               padding: 5px">
    <HyperText name="web_page" value="$text"/>
  </View>
</View>
```
## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

[Choices](/tags/choices.html) 控制标签指定了用于对网站内容进行分类的选项。
```xml
  <Choices name="toxicity" toName="web_page" choice="multiple" showInline="true">
    <Choice value="Toxic" background="red"/>
    <Choice value="Severely Toxic" background="brown"/>
    <Choice value="Obscene" background="green"/>
    <Choice value="Threat" background="blue"/>
    <Choice value="Insult" background="orange"/>
    <Choice value="Hate" background="grey"/>
  </Choices>
```
`choice` 参数允许标注人员选择多个选项，`showInline` 参数则将所有选项显示在一行内。本模板提供了大量的内容审核选项值，但你可以修改模板以提供不同的选项。

[View](/tags/view.html) 标签上的样式会在网站内容周围添加一个边框，让标注人员清楚地知道哪些是网站内容：
```xml
  <View style="border: 1px solid #CCC;
               border-radius: 10px;
               padding: 5px">
```

[HyperText](/tags/hypertext.html) 对象标签显示网站内容，这些内容以 Label Studio JSON 格式的 `text` 键指定，或作为纯文本导入。
```xml
    <HyperText name="web_page" value="$text"/>
```


## 相关标签
- [Choices](/tags/choices.html)
- [HyperText](/tags/hypertext.html)
- [View](/tags/view.html)
