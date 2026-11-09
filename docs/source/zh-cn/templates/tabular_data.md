---
title: 表格数据
type: templates
category: Structured Data Parsing
cat: structured-data-parsing
order: 505
meta_title: 表格数据标注模板
meta_description: 使用 Label Studio 为表格数据打标签的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/tabular-data.png" alt="" class="gif-border" width="552px" height="408px" />

如果你需要校验存储在表格中的数据，请使用本模板以表格格式展示数据，并就表格内容提出问题。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <Header value="Table with {key: value} pairs"/>
    <Table name="table" value="$item"/>
    <Choices name="choice" toName="table">
        <Choice value="Correct"/>
        <Choice value="Incorrect"/>
    </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Header](/tags/header.html) 标签为标注人员提供详情：
```xml
<Header value="Table with {key: value} pairs"/>
```

使用 [Table](/tags/table.html) 对象标签展示表格数据：
```xml
<Table name="table" value="$item"/>
```

使用 [Choices](/tags/choices.html) 控制标签对表格内容进行分类：
```xml
<Choices name="choice" toName="table">
    <Choice value="Correct"/>
    <Choice value="Incorrect"/>
</Choices>
```


## 相关标签

- [Header](/tags/header.html)
- [Table](/tags/table.html)
- [Choices](/tags/choices.html)
