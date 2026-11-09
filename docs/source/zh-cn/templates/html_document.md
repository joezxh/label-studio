---
title: HTML 实体识别
type: templates
category: Structured Data Parsing
cat: structured-data-parsing
order: 515
meta_title: HTML 实体消解数据标注模板
meta_description: 用于使用 Label Studio 对 HTML 文档执行实体消解的模板，适用于你的机器学习和数据科学项目。
---

<br/><img src="/images/templates/html-entity-recognition.png" alt="" class="gif-border" width="552px" height="408px" />

对 HTML 文档执行命名实体识别。使用本模板显示带有 HTML 标记的富文本，并对文本片段进行标注。

<!--由于 playground 中 LSF 版本过旧导致无法正常工作，故移除交互式模板预览-->

## 标注配置

```html
<View>
  <Labels name="ner" toName="text">
    <Label value="Person"></Label>
    <Label value="Organization"></Label>
  </Labels>
  <HyperText name="text" value="$text"></HyperText>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Labels](/tags/labels.html) 控制标签指定你希望标注人员在 HTML 文档上标注的实体：
```xml
<Labels name="ner" toName="text">
    <Label value="Person"></Label>
    <Label value="Organization"></Label>
</Labels>
```

使用 [HyperText](/tags/hypertext.html) 对象标签显示包含 HTML 标记的文本：
```xml
<HyperText name="text" value="$text"></HyperText>
```

## 相关标签

- [Labels](/tags/labels.html)
- [HyperText](/tags/hypertext.html)
