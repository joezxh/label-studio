---
title: PDF
type: tags
order: 307
meta_title: 用于加载 PDF 文档的 PDF 标签
meta_description: Label Studio 的 PDF 标签用于加载 PDF 文档，用于机器学习和数据科学项目。
---

`Pdf` 标签在标注界面上显示 PDF 文档。你可以使用此标签来：

- 执行文档级标注，例如分类、转写和摘要。
- 在支持的 PDF 上执行 OCR 校验。<span class="badge"></span>

支持：
* 缩放
* 旋转
* 最多 100 页的 PDF

与以下数据类型配合使用：PDF。

!!! error Enterprise
    你还可以将 PDF 标签与 [Prompts](https://docs.humansignal.com/guide/prompts_overview) 配合使用，执行自动标注工作，例如 PDF 摘要、分类、信息提取和文档智能。

{% insertmd zh-cn/includes/tags/pdf.md %}

## 示例：PDF 分类

用于为 PDF 文档应用文档级分类的标注配置：

```html
<View>
  <Pdf name="pdf" value="$pdf" />
  <Choices name="choices" toName="pdf">
    <Choice value="Legal" />
    <Choice value="Financial" />
    <Choice value="Technical" />
  </Choices>
</View>
```

#### 示例输入数据：

```json
{
  "pdf": "https://app.humansignal.com/static/samples/opossum-cuteness.pdf"
}
```

## 示例：OCR <span class="badge"></span>

!!! error Enterprise
    仅限 Label Studio Enterprise。

    对于希望为 OCR 任务应用标签的 Community 和 Starter Cloud 用户，你需要先将 PDF 转换为图像，然后使用类似于 [多页文档标注](/templates/multi-page-document-annotation) 模板的标注配置。

用于 PDF 的标注配置：

```xml
<View>
  <OcrLabels name="ocr" toName="pdf">
    <Label value="Typo"/>
    <Label value="Incorrect amount"/>
    <Label value="Incorrect name"/>
  </OcrLabels>

  <Pdf name="pdf" value="$pdf"/>
</View>
```

#### 示例输入数据：

```json
{
  "pdf": "https://app.humansignal.com/static/samples/opossum-cuteness.pdf"
}
```

#### PDF 样式

PDF 会渲染当前页面的完整高度。如果你想限制它，可以对 `.htx-pdf` 类应用样式来设置高度。一个好的默认值是 `calc(100vh - 250px)`，但你可能需要根据配置中的额外元素调整像素数：
```xml
<Style>
  .htx-pdf { height: calc(100vh - 250px); }
</Style>
```

### OcrLabels 

此标签为 PDF 添加边界框，并允许你为它们分配标签。

此标签必须包含一个或多个 `Label` 标签子元素，并支持标准参数，例如 `maxUsages`（参见 [RectangleLabels](rectanglelabels) 作为示例）。

#### 支持的 PDF

与新的 OCR 标注配合效果最好的 PDF 是那些已经包含可选中文本层（文本叠加）的 PDF。

在这些 PDF 中，当你绘制边界框时，工具可以读取并高亮显示该层下方的底层文本（见下方视频）。

仅含图像的 PDF（如扫描件或没有文本层的手机照片）不会返回文本。对于这些情况，你可能需要先使用外部 OCR 工具添加文本层。如果 PDF 的文本层错位或质量较低，捕获的文本可能不完整或不正确，而此功能可以帮助你审计并改进这些叠加层。

**结果：**

| Result | Type | Description |
| --- | --- | --- |
| `x`, `y`, `width`, `height` | Number | 范围 0 到 1 的数字，相对于页面尺寸。 |
| `rotation`| Number | 顺时针 0–360 度的数字。旋转以 `(x, y)`（区域的左上角）为原点计算。 |
| `pageIndex` | Number | 页码，从 1 开始。 |
| `ocrtext` | String | 捕获的文本。选中区域后可在 **Info**（信息）面板中编辑文本。 |

!!! note
    当你在界面中旋转时，看起来像是从区域的中心开始。然而，我们存储的原点是 `(x, y)`——即区域的左上角。

<br/>
<br/>

<video style="max-width: 800px;" class="gif-border" autoplay loop muted>
  <source src="/images/tags/pdf-ocr.mp4">
</video>
