---
title: PDF 分类
type: templates
category: Structured Data Parsing
cat: structured-data-parsing
order: 510
meta_title: PDF 分类数据标注模板
meta_description: 用于使用 Label Studio 对 PDF 数据进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/pdf-classification.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想执行 PDF 分类，请使用本模板。本模板提示标注人员用 10 星量级为一份 PDF 评分，然后对其进行分类。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <Header value="Rate this article"/>
    <Rating name="rating" toName="pdf" maxRating="10" icon="star" size="medium" />
     <Choices name="choices" choice="single-radio" toName="pdf" showInline="true">
        <Choice value="Important article"/>
        <Choice value="Yellow press"/>
    </Choices>
    <Pdf name="pdf" value="$pdf"/>
</View>

<!-- {
    "pdf": "/static/samples/sample.pdf"
} -->
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Rate this article"/>
```

使用 [Rating](/tags/rating.html) 控制标签对 PDF 应用一个 10 星的星级评分：
```xml
<Rating name="rating" toName="pdf" maxRating="10" icon="star" size="medium" />
```
  
使用 [Choices](/tags/choices.html) 控制标签向标注人员呈现分类选项：
```xml
<Choices name="choices" choice="single-radio" toName="pdf" showInline="true">
    <Choice value="Important article"/>
    <Choice value="Yellow press"/>
  </Choices>
```

使用 [Pdf](/tags/pdf.html) 标签渲染 PDF 数据的行内版本：
```xml
<Pdf name="pdf" value="$pdf"/>
```

### 输入数据

Label Studio 不支持直接标注 PDF 格式的文件。你应该在数据中为 pdf 加载使用 `embed` 标签：

```
{
    "pdf": "<embed src='https://app.heartex.ai/static/samples/sample.pdf' width='100%' height='600px'/>"
}
```

## 相关标签
- [Rating](/tags/rating.html)
- [Choices](/tags/choices.html)
- [Pdf](/tags/pdf.html)
