---
title: Document AI 🔒
type: templates
category: Interfaces
order: 369
is_new: t
meta_title: 文档 AI 标注界面模板
meta_description: 使用区域、转录文本、表格结构以及文档/页面级别的分类来标注文档页面。
---


本模板创建一个文档理解界面，用于为 PDF 和文档图像标注区域标签、转录文本、表格结构，以及文档级或页面级的分类。

标注人员在文档区域周围绘制边界框，选择由 hOCR 单词位置支撑的文本片段，使用可编辑的行和列分隔线标注表格结构，对捕获的文本进行转录，将相关区域相互链接，并对文档整体或逐页进行分类——从而产出丰富的结构化输出，满足 Document AI 团队在版面、OCR 和字段抽取工作流中的需求。

![Screenshot](/images/templates-misc/interface-document-ai.png)

示例界面包含：

- **PDF 和图像查看器**：支持多页导航、缩放、平移，以及由 hOCR 驱动的文本层以实现单词级选择。
- **标注工具**：选择、平移、边界框、文本片段（拖拽选择）、单词选取器、表格——每个工具都有单键快捷键。
- **实体标签**：用于标记区域（Title、Author、Abstract、Section Header、Figure、Table、Citation 等），前九个标签设有快捷键 `1`-`9`。
- **表格编辑器**：带有可拖拽的行和列分隔线、每单元格标签、合并单元格支持，以及自动提取的单元格转录。
- **分类面板**：用于文档级和页面级的类型分配。
- **区域链接**：标注人员可以连接相关区域（例如，将图注链接到其对应的图，或将引用链接到其参考文献）。
- **字段抽取模式（schema）**：将标注区域绑定到结构化的字段集合（论文标题、作者、出处、年份等）。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces > Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 界面 UI

界面分为左侧的工具/实体轨道、中央的文档视口，以及右侧带选项卡的检视器面板。

#### 工具与实体轨道

一个垂直轨道，包含两组堆叠：

- **Tools（工具）**：选择（`V`）、平移（`H`）、边界框（`B`）、文本片段（`T`）、单词（`P`）、表格（`R`）。当前激活的工具决定在视口中点击并拖拽时的行为。
- **Entity labels（实体标签）**：`entityTypes` 中的每个条目对应一个按钮。前九个条目拥有快捷键 `1`-`9`。选择一个实体会设定应用于你创建的下一个标注的标签。

#### 文档视口

主阅读列。

- 对于 PDF，页面通过 PDF.js 渲染，支持连续滚动、当前页面指示、缩放控制和跳页导航。
- 对于图像，单页视口渲染源 `image` 字段。
- 当提供 `hocr` 字段时，会叠加单词级位置，以便 **Text span（文本片段）** 和 **Words（单词）** 工具能够选择真实文本——绘制在文本之上的边界框也会自动捕获一个 `transcription`（转录）。
- 现有标注渲染为彩色叠加层。选中的区域在所有八个位置显示缩放手柄。
- 表格渲染时带有可拖拽的行和列分隔线。右键单击单元格会打开每单元格标签菜单，并提供合并操作。

#### 检视器面板

右侧轨道，包含五个选项卡：

- **Annotations（标注）**：列出每个区域及其实体标签、页码范围、转录预览，以及每行一个删除控件。
- **Transcription（转录）**：所选区域可编辑的转录文本，当沙箱包提供 `documentAI.recognizeImage` 时带有 OCR 按钮。
- **Classifications（分类）**：用于**文档类型**（来自 `documentTypes`）和逐页的**页面类型**（来自 `pageTypes`）的可切换芯片。
- **Links（链接）**：查看并在区域之间创建链接。每个链接以 `linkedTo: [targetId, ...]` 的形式存储在源区域上。
- **Extraction（抽取）**：一个可配置的 schema，将实体类型绑定到命名字段（例如，`Authors` → 所有标记为 `Author` 的区域）。在保存前预览生成的结构化对象。

面板上方有一个搜索栏，可按转录文本或实体标签筛选区域。

## React 代码

完整的 `Screen.jsx` 源代码约有 9,400 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务数据的参数，
* 视口和大纲（Outliner）使用的实体颜色映射，
* 包含工具、功能和抽取 schema 的内部 `PROJECT_CONFIG` 块，
* 写回 Label Studio 的结果结构。

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段，或替换三组标签集（区域标签、文档类型、页面类型）中的任何一组。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  title: "Document AI Parameters",
  properties: {
    pdfField: {
      type: "dataField",
      default: "pdf",
      description: "Task data field containing the PDF URL",
    },
    entityTypes: {
      type: "labels",
      description: "Labels available for annotating document regions",
      default: [
        { name: "Title",          color: "#10b981" },
        { name: "Author",         color: "#8b5cf6" },
        { name: "Abstract",       color: "#06b6d4" },
        { name: "Section Header", color: "#f59e0b" },
        { name: "Paragraph",      color: "#64748b" },
        { name: "Figure",         color: "#10b981" },
        { name: "Table",          color: "#f97316" },
        { name: "Citation",       color: "#6366f1" },
        // ...
      ],
    },
    documentTypes: {
      type: "labels",
      description: "Document-level classification labels",
      default: [
        { name: "Research Paper",   color: "#3b82f6" },
        { name: "Review Article",   color: "#8b5cf6" },
        { name: "Technical Report", color: "#10b981" },
        // ...
      ],
    },
    pageTypes: {
      type: "labels",
      description: "Page-level classification labels",
      default: [
        { name: "Title Page", color: "#10b981" },
        { name: "Abstract",   color: "#06b6d4" },
        { name: "Content",    color: "#3b82f6" },
        { name: "Tables",     color: "#f97316" },
        // ...
      ],
    },
  },
};
```

界面还会从输入 schema 中读取 `imageField` 和 `hocrField`，分别默认为 `image` 和 `hocr`。必须提供 `pdf` 或 `image` 其中之一。

### 实体颜色映射

`ENTITY_COLORS` 是模块级的颜色表，由 `getEntityColor`、`toScreenRegionFromAnn` 和视口叠加层使用。如果你重命名或新增标签，请使其与 `entityTypes` 保持同步——此处的条目使用实体的内部 `id`（小写、蛇形命名），而非面向用户的 `label`。

```js
const ENTITY_COLORS = {
  title: "#10b981",          author: "#8b5cf6",          affiliation: "#a855f7",
  abstract: "#06b6d4",       section: "#f59e0b",         paragraph: "#64748b",
  figure: "#10b981",         figure_caption: "#34d399",  table: "#f97316",
  table_caption: "#fb923c",  equation: "#ec4899",        citation: "#6366f1",
  reference: "#818cf8",      list: "#14b8a6",            footnote: "#78716c",
  header: "#9ca3af",         footer: "#6b7280",          page_number: "#525252",
  classifications: "#94a3b8", classificationMetadata: "#94a3b8",
};

function getEntityColor(entityType) {
  return ENTITY_COLORS[entityType] || "#94a3b8";
}
```

### 工具、功能与抽取 schema

在 `DocumentLabelingInterface` 内部，`PROJECT_CONFIG` 是工具面板、功能开关和默认字段抽取 schema 的唯一权威来源。来自界面设置的 `params` 会覆盖 `entityTypes`、`documentTypes` 和 `pageTypes`；其余部分（工具、功能、`fields`）在此处编辑。

```js
const PROJECT_CONFIG = {
  name: "Scientific Paper Labeling",
  contentType: "pdf",
  tools: {
    select: true,  // Selection tool (V)
    pan: true,     // Pan/hand tool (H)
    box: true,     // Bounding box tool (B)
    span: true,    // Text span selection (T)
    words: true,   // Word selection tool (P)
    table: true,   // Table annotation (R)
  },
  features: {
    documentClassification: true,
    pageClassification: true,
    linking: true,
    transcription: true,
    tableEditing: true,
    search: true,
    extraction: true,
  },
  // entityTypes, documentTypes, pageTypes are seeded here but
  // are overridden by params when the Interface is configured.
  fields: [
    { id: "paper_title", label: "Paper Title",   type: "string" },
    { id: "authors",     label: "Authors",       type: "string" },
    { id: "venue",       label: "Venue/Journal", type: "string" },
    { id: "year",        label: "Year",          type: "string" },
  ],
};
```

### 结果结构

`getResults` 为每个区域发出一个 Label Studio 结果。每个结果都使用 `from_name: "documentai"` 和 `type: "documentai"`，并将完整的标注负载——包括任何特定于种类的字段——序列化到 `value` 中。`value` 内部的标注 `type` 字段区分界面产生的四种形态。

```js
function getResults(regions, _relations) {
  return regions
    .filter(r => r._documentAI)
    .map(r => ({
      id: r.id,
      from_name: "documentai",
      to_name: "document",
      type: "documentai",
      value: { ...r._documentAI },
      origin: "manual",
    }));
}
```

`value` 内部的四种标注形态是：

- **Bounding box（边界框）** — `{ type: "boundingBox", entityType, x, y, w, h, page, startPage, endPage, transcription, linkedTo? }`
- **Text span（文本片段）** — `{ type: "textSpan", entityType, x, y, w, h, highlightRects, selectedText, transcription, spans, page, startPage, endPage }`
- **Table（表格）** — `{ type: "table", entityType: "table", x, y, w, h, tableData: { rows, cols, headerRows, headerCols, cellLabels, mergedCells, cellTranscriptions } }`
- **Classification metadata（分类元数据）** — `{ type: "classificationMetadata", entityType: "classifications", documentClassification, pageClassifications }`

坐标 `x`、`y`、`w` 和 `h` 为相对于页面的百分比（`0`-`100`）。

## 示例输入

界面期望一个任务 `data` 对象，其中包含文档来源——可以是 `pdf`（PDF URL）或 `image`（图像 URL）——以及可选的 `hocr` 字符串，用于提供文本片段和单词选取器选择的单词级位置。字段名可通过 `pdfField`、`imageField` 和 `hocrField` 配置。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "pdf": "https://example.com/papers/2026-05-attention-is-all-you-still-need.pdf",
    "hocr": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n  <body>\n    <div class=\"ocr_page\" id=\"page_1\" title=\"bbox 0 0 800 1000\">\n      <span class=\"ocrx_word\" title=\"bbox 80 140 480 188\">Attention</span>\n      <span class=\"ocrx_word\" title=\"bbox 490 140 560 188\">Is</span>\n      <span class=\"ocrx_word\" title=\"bbox 570 140 670 188\">All</span>\n      <!-- ... more ocrx_word entries ... -->\n    </div>\n  </body>\n</html>"
  }
}
```

一个仅含图像的任务将 `pdf` 替换为 `image` URL：

```json
{
  "data": {
    "image": "https://example.com/scans/invoice-2026-05-13.png",
    "hocr": "<?xml version=\"1.0\" encoding=\"UTF-8\"?> ... </html>"
  }
}
```

{% enddetails %}

## 示例输出

保存的标注包含每个区域一个结果。下面的示例展示了全部四种标注形态——标题周围的边界框（带有 `linkedTo` 引用）、摘要上方的文本片段、第 3 页的表格，以及一条保存文档和逐页类型的分类元数据条目。

```json
{
  "result": [
    {
      "id": "1747156800000",
      "from_name": "documentai",
      "to_name": "document",
      "type": "documentai",
      "value": {
        "id": 1747156800000,
        "type": "boundingBox",
        "entityType": "title",
        "x": 12.5, "y": 8.2, "w": 75.0, "h": 4.8,
        "page": 1, "startPage": 1, "endPage": 1,
        "transcription": "Attention Is All You Still Need",
        "linkedTo": [1747156800001]
      }
    },
    {
      "id": "1747156800002",
      "from_name": "documentai",
      "to_name": "document",
      "type": "documentai",
      "value": {
        "id": 1747156800002,
        "type": "textSpan",
        "entityType": "abstract",
        "x": 12.4, "y": 18.6, "w": 75.3, "h": 11.2,
        "highlightRects": [
          { "x": 12.4, "y": 18.6, "w": 75.3, "h": 1.6 },
          { "x": 12.4, "y": 20.4, "w": 75.3, "h": 1.6 }
        ],
        "selectedText": "We revisit the original Transformer architecture and find that...",
        "transcription": "We revisit the original Transformer architecture and find that...",
        "spans": ["w_42", "w_43", "w_44", "w_45"],
        "page": 1, "startPage": 1, "endPage": 1
      }
    },
    {
      "id": "1747156800003",
      "from_name": "documentai",
      "to_name": "document",
      "type": "documentai",
      "value": {
        "id": 1747156800003,
        "type": "table",
        "entityType": "table",
        "x": 14.0, "y": 42.0, "w": 72.0, "h": 22.0,
        "page": 3, "startPage": 3, "endPage": 3,
        "tableData": {
          "rows": [0, 18, 36, 54, 72, 100],
          "cols": [0, 30, 55, 78, 100],
          "headerRows": [0],
          "headerCols": [0],
          "mergedCells": [],
          "cellLabels": { "0,0": "Model", "0,1": "Params", "0,2": "BLEU", "0,3": "Notes" },
          "cellTranscriptions": {
            "1,0": "Baseline", "1,1": "65M",  "1,2": "26.4",
            "2,0": "Ours",     "2,1": "65M",  "2,2": "27.9",
            "3,0": "Ours-Big", "3,1": "213M", "3,2": "29.1"
          }
        }
      }
    },
    {
      "id": "1747156800004",
      "from_name": "documentai",
      "to_name": "document",
      "type": "documentai",
      "value": {
        "id": 1747156800004,
        "type": "classificationMetadata",
        "entityType": "classifications",
        "documentClassification": "research_paper",
        "pageClassifications": {
          "1": "title_page",
          "2": "abstract",
          "3": "tables",
          "4": "content",
          "5": "references"
        }
      }
    }
  ]
}
```
