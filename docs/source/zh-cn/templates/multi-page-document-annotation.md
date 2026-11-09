---
title: 多页文档标注
type: templates
category: Computer Vision
cat: computer-vision
order: 128
meta_title: 多页文档标注
meta_description: 用于更轻松高效地标注大型多页文档的模板。
---

<img src="/images/templates/multipage.png" alt="" class="gif-border" />

多页文档标注允许你标注由多页组成的文档。通过将每一页表示为一张图像，你可以将它们导入到单个任务中，并在标注每一页的同时保持整个文档的上下文。

如果你只需要对 PDF 文档整体进行分类，也可以使用 [PDF 分类模板](pdf_classification)。

!!! error Enterprise
    如果你正在进行 OCR 标注，并且是 Label Studio Enterprise 用户，请参阅 [PDF 的 OCR 标注](pdf_ocr)。

<a href="https://app.humansignal.com/b/MTk4"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 前置条件

多页文档标注要求你首先将文档预处理为单独的图像。有多种工具可以做到这一点，包括 [Adobe Acrobat](https://helpx.adobe.com/acrobat/using/pdf-to-jpg.html) 中的内置选项。

为了提高性能，我们通过在本地浏览器存储中通过 XHR 下载图像并存储的方式来预加载图像。为了让此功能正常工作，你必须在存放图像的 CDN/存储上设置 CORS 策略。具体来说，必须设置以下响应头：

```
Access-Control-Allow-Origin: https://app.humansignal.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 限制

出于性能考虑，我们建议每个项目的任务数上限限制在约 100,000 个左右。

如果你正在创建包含多张图像的任务，可能需要在每个项目内规划更小的任务上限。例如，一个包含 100 张图像的任务在性能考量上大致相当于 100 个任务。

## 页面导航

在执行多页标注时，你会看到一个新的导航菜单：

![Multi-page navigation](../images/templates-misc/multipage_nav2.png)

!!! info Tip
    * 要跳转到特定页面，点击中央的页码并输入所需的页面。
    * 你也可以使用以下快捷键进行导航：`command + left` / `command + right` 或 `ctrl + left` / `ctrl + right`。

## 标注配置

通过使用 `<Image>` 标签并设置 `valueList` 参数（而不是 `value` 参数）来启用多页标注。

```xml
<View>
  <RectangleLabels name="rectangles" toName="pdf" showInline="true">
    <Label value="Title" background="red"/>
    <Label value="Summary" background="blue"/>
    <Label value="Author" background="green"/>
    <Label value="Table" background="gold"/>
    <Label value="Citation" background="purple"/>
  </RectangleLabels>
  <Image valueList="$pages" name="pdf"/>
</View>
```

与 `value` 类似，`valueList` 参数接受一个变量。此处的不同之处在于你引用的是 JSON 中的一个数组。

例如，以下内容引用了下面[示例输入数据](#输入数据格式)中的 `pages`。

```xml
<Image valueList="$pages" name="pdf"/>
```

!!! note 分类
    本示例使用边界框标注。不过，你可以修改模板以执行分类任务（使用 [`Choices` 标签](/tags/choices)）。使用 `Choices` 标签时，请注意以下几点：

    * 你可以使用 `perItem="true"` 执行逐页分类。
    * 你也可以保持 `perItem="false"`（默认值）来执行逐文档分类。
    * 当在页面上绘制区域时，支持 `perRegion="true"`。

## 输入数据格式

以下示例将上传一个已预处理为 5 张图像的 5 页 PDF。你将使用 `valueList="$pages"` 在标注配置中引用这些页面。

```json
{
	"data": {
		"pages": [
			"https://htx-pub.s3.amazonaws.com/demo/images/demo_stock_purchase_agreement/0001.jpg",
			"https://htx-pub.s3.amazonaws.com/demo/images/demo_stock_purchase_agreement/0002.jpg",
			"https://htx-pub.s3.amazonaws.com/demo/images/demo_stock_purchase_agreement/0003.jpg"
		]
	}
}
```

## 导出格式

导出标注时，`item_index` 属性会返回某个区域所附加的图像的索引。索引从 0 开始，即第一张图像为 `0`，第二张为 `1`，依此类推：

```json
[
  {
    "id": 859,
    "annotations": [
      {
        "id": 25569355,
        "result": [
          {
            "id": "tdS8Of63VJ",
            "type": "rectanglelabels",
            "value": {
              "x": 2.48868778280543,
              "y": 4.807692307692308,
              "width": 52.88461538461539,
              "height": 5.128205128205128,
              "rotation": 0,
              "rectanglelabels": [
                "Title"
              ]
            },
            "origin": "manual",
            "to_name": "pdf",
            "from_name": "choices",
            "item_index": 0,
            "image_rotation": 0,
            "original_width": 2550,
            "original_height": 3300
          },
          {
            "id": "RGGrHm95R7",
            "type": "rectanglelabels",
            "value": {
              "x": 30.693815987933636,
              "y": 12.179487179487179,
              "width": 58.4841628959276,
              "height": 1.2820512820512828,
              "rotation": 0,
              "rectanglelabels": [
                "Citation"
              ]
            },
            "origin": "manual",
            "to_name": "pdf",
            "from_name": "choices",
            "item_index": 1,
            "image_rotation": 0,
            "original_width": 2550,
            "original_height": 3300
          }
        ]
      }
    ]
  }
]
```

## 相关标签
- [Image](/tags/image)
- [Label](/tags/label)
- [RectangleLabels](/tags/rectanglelabels)
