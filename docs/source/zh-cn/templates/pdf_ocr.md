---
title: 面向 PDF 的 OCR 标注 🔒
type: templates
category: Computer Vision
cat: computer-vision
order: 126
meta_title: PDF OCR 数据标注模板
meta_description: 用于修正 PDF 文档中文本的模板。
---

使用本模板直接在原生 PDF 上执行区域级 OCR。

`Pdf` 标签渲染多页文档（最多 100 页），支持缩放和旋转，而 OcrLabels 让你可以绘制边界框、分配标签，并捕获每个区域可编辑的 OCR 文本。

每个区域存储归一化坐标、旋转角度和页码索引，使其输出对于下游抽取任务而言可靠可用。

非常适合文档智能、OCR 输出质量检查，以及结构化数据捕获工作流。

!!! error Enterprise
    本模板需要 `OcrLabels` 标签，该标签只能在 Label Studio Enterprise 中使用。

![Screenshot](/images/templates-misc/pdf-opossum.png)

## 标注配置

```xml
<View>
  <Style>
    .htx-pdf { calc(100vh - 250px) }
  </Style>
  <Header value="Select text to correct" size="4"/>
  <OcrLabels name="ocr" toName="pdf">
    <Label value="Typo" />
    <Label value="Incorrect Amount" />
    <Label value="Incorrect Name" />
  </OcrLabels>
  <Pdf name="pdf" value="$pdf"/>
</View>

<!-- {
  "data": {
    "pdf": "/static/samples/opossum-cuteness.pdf"
  }
} -->
```

## 关于此标注配置

* **`Pdf`**

    这会在 Label Studio 中原生显示你的 PDF，允许你根据需要缩放和旋转。

    支持最多 100 页的 PDF。

* **`OcrLabels`**
  
    仅与 `Pdf` 标签配合使用，并允许你在文本周围绘制边界框。注意，PDF 必须带有文本叠加层才能正常工作（例如，验证你是否可以用光标在 PDF 中高亮文本）。

    在 **Regions（区域）** 面板中选择文本以修正它。

  <img src="/images/templates-misc/ocrlabels.png" alt="" class="gif-border" style="max-width:400px" />

* **`Style`**

  使用 `.htx-pdf` 为 PDF 应用样式。例如，添加边框或更改尺寸。



## 输入数据

```json
{
    "data": {
      "pdf": "/static/samples/opossum-cuteness.pdf"
    }
}
```

## 相关标签
- [Header](/tags/header.html)
- [Pdf](/tags/pdf.html)
- [Style](/tags/style.html)
