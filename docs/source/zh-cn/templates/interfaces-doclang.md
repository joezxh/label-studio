---
title: Doclang 🔒
type: templates
category: Interfaces
order: 378
is_new: t
meta_title: Doclang 文档标注界面模板
meta_description: 将文档图像标注为 DoclingDocument，包含版面区域、阅读顺序、表格结构、浏览器内 OCR 以及实时的 DocLang XML 预览。
---


本模板创建一个 Doclang 文档标注界面，用于将文档图像转换为结构化的 `DoclingDocument`——版面区域、阅读顺序、表格结构以及键值对——并支持浏览器内 OCR 和实时的 DocLang XML 预览。

标注人员绘制版面区域（文本、章节标题、列表、表格、图片、公式、代码、键值对等），通过路径设置阅读顺序及其他元素之间的关系，标注表格网格与语义结构，使用一键浏览器内 OCR 转录文本，并实时查看生成的 `<doclang>` XML——从而产出文档转换和 Document AI 团队构建 DoclingDocument 数据集所需的结构化输出。

!!! info 属于 Docling 生态的一部分
    [Docling](https://docling.ai) 是一个开源工具包，可将文档（PDF、图像等）解析为结构化的 `DoclingDocument`。本界面是该格式的人工参与（human-in-the-loop）标注与审阅层。

    若要在审阅前自动预标注文档，可将其与 [Docling ML 后端](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/docling) 搭配使用。它会将每个文档发送给 [**IBM Docling SaaS**](https://www.ibm.com/products/docling)——即通过 Docling Workbench 的租户 URL 和 API 密钥连接的托管 Docling 转换服务——并将版面作为本界面所读取的 `rectanglelabels` / `polygonlabels` 预测结果返回，从而让标注人员修正 Docling 的输出，而不是从空白页开始。

![Screenshot](/images/templates-misc/interface-doclang.png)

!!! error 需要修改允许列表
    本界面在运行时从公共 CDN 加载两个第三方库，因此在 **Owner（所有者）或 Admin（管理员）将这两个 CDN 主机添加到你组织的 Interfaces 允许列表**之前，它将**无法工作**。请参阅下面的 [开始之前：将所需域名加入允许列表](#开始之前将所需域名加入允许列表)——这是首先要做的事，也是预览或 OCR 显示不正常最常见的原因。

示例界面包含：

- **文档图像查看器**：支持动态缩放和平移，适用于大型高分辨率页面。
- **版面标签**：按用途分组——常用（文本、章节标题、列表项、表格、图片、题注）、其他（脚注、公式、代码、表单、索引、手写文本）、页面（页眉/页脚）、表格结构、表格区域语义、键值对以及复选框——最常用标签设有单键快捷键。
- **阅读顺序与关系路径**：在各区域之间绘制 `reading_order`、`merge`、`group` 以及容器/链接路径（`to_caption`、`to_footnote`、`to_value`）。
- **浏览器内 OCR**：通过 Tesseract.js 实现——无需搭建 OCR 服务；承载文本的区域在绘制完成后即可自动转录。
- **实时 DocLang 预览**：包含两个选项卡：**xml**（带语法高亮的原始 `<doclang>` XML 标记）和 **Reading view（阅读视图）**（渲染后可供人类阅读的文档），两者均由官方 DocLang 查看器驱动。
- **可配置的 OCR 语言与模型**、配色主题、默认内容层以及默认图片类型，均通过界面参数设置。

!!! error Enterprise
    Interfaces 仅可在 Label Studio Enterprise 和 Starter Cloud 中使用。


!!! note
    要使用界面模板，你必须先创建该界面的可编辑副本。在 **Interfaces > Templates** 中，选择要使用的模板旁边的溢出菜单，点击 **Duplicate（复制）**。

## 开始之前：将所需域名加入允许列表

与大多数模板不同，本界面依赖于两个库，这些库在**标注 iframe 中运行时**从公共 CDN 加载。Interfaces 沙箱默认阻止所有出站网络（通过内容安全策略，即 CSP），因此必须先将这些 CDN 主机添加到你组织的允许列表中，界面才能渲染其预览或运行 OCR。

无需安装任何东西——整个渲染和 OCR 流程都在浏览器中运行——但下面这两个主机必须可达。

| 主机 | 提供的内容 | 为何需要 | 大致大小 |
| --- | --- | --- | --- |
| `https://cdn.jsdelivr.net` | [DocLang 查看器](https://github.com/docling-project/docling)（官方查看器的 SHA 固定镜像） | 渲染 **xml** 和 **Reading view** 预览选项卡。**没有它，预览将无法渲染。** | 约 165 KB 的 JS + CSS，每次渲染都会加载但会永久缓存（URL 为 SHA 固定，jsDelivr 以 `immutable` 形式提供）。 |
| `https://unpkg.com` | [Tesseract.js](https://github.com/naptha/tesseract.js)（JS + WASM + 语言模型） | 运行**浏览器内 OCR** 以转录区域。**没有它，OCR 将无法运行。** | 约 3–11 MB，首次点击 OCR（或切换 OCR 语言/模型）时下载一次，并在会话期间缓存。 |

这是本界面仅有的两个外部主机要求。你自己的 Label Studio 服务器来源始终自动被允许，因此无需添加它。

### 在哪里添加

两个主机都必须在 **Organization > Settings > Interfaces** 页面的**两处**添加，因为浏览器将「加载脚本」和「获取 WASM/模型文件」视为两种不同的权限：

1. **Advanced: external scripts（高级：外部脚本）**——启用 **Allow external scripts / stylesheets（允许外部脚本/样式表）**，然后添加 `https://cdn.jsdelivr.net` 和 `https://unpkg.com`。这允许界面以 `<script>`/`<style>` 标签形式加载查看器和 OCR 库（CSP 的 `script-src` 指令）。
2. **API origins（API 来源）**——在此同样添加 `https://cdn.jsdelivr.net` 和 `https://unpkg.com`。这允许界面 `fetch` 查看器资源和 OCR WASM/模型文件（CSP 的 `connect-src` 指令）。

只有 Owner 和 Admin 可以更改这些设置，它们适用于组织内的每个界面。请使用确切的来源（协议 + 主机，不含路径或通配符）。有关每个部分的完整详情，请参阅 [界面管理设置](https://docs.humansignal.com/guide/admin-interfaces) 和 [使用外部库与服务](https://docs.humansignal.com/guide/interfaces-libraries)。

!!! info 如何判断是允许列表问题
    如果预览窗格显示 *"Failed to load DocLang viewer … from cdn.jsdelivr.net … has not been added to the LSE org allowlist"*，或者点击 OCR 后始终不返回文本，那么几乎可以确定上述两个主机中至少有一个未添加到这两个部分之一。请将它们添加到**两处**并重新加载。

## 界面 UI

界面分为左侧的标签轨道、中央的文档画布以及右侧的实时 DocLang 预览。

#### 标签轨道

版面标签分组为可折叠的类别（Common、Other、Page、Table structure、Table regions、Key-Value、Checkboxes）。选择某个标签会设定你接下来绘制的区域将被标记为何种类型；最常用标签设有单键快捷键（例如 `1` 文本、`2` section_header、`3` list_item、`4` table）。另一组路径工具用于绘制区域之间的关系——`reading_order`（`r`）、`merge`（`m`）、`group`（`g`），以及 `to_caption` / `to_footnote` / `to_value` 链接路径。

#### 文档画布

主标注界面。

- 源文档图像（来自 `image` 字段）以动态缩放和平移方式渲染，适用于大型页面。
- 绘制一个框来创建版面区域；包含文本的标签（text、section_header、list_item、caption、footnote 等）在松开鼠标时会自动运行 OCR，从而为你转录出该区域。容器标签（table、picture、form）和结构叠加层被刻意排除，因此 OCR 不会在非文本区域触发。
- 表格结构通过网格标签（`table_row`、`table_column`、`table_merged_cell`）和语义标签（`row_header`、`column_header`、`row_section`、`body`）捕获。
- 阅读顺序及其他路径以点对点的方式在区域间绘制，并在绘制过程中进行校验。

#### DocLang 预览

右侧面板，包含两个选项卡，均由从 jsDelivr 加载的官方 DocLang 查看器渲染：

- **xml**——当前标注的原始序列化 `<doclang>` XML，带语法高亮。这是界面保存的 DoclingDocument 快照。
- **Reading view（阅读视图）**——同一文档渲染为可供人类阅读的页面，以便标注人员确认其区域和阅读顺序生成了一个合理的文档。

## React 代码

完整的 `Screen.jsx` 源代码约有 9,300 行，因此下面的代码片段重点展示你最可能自定义的部分：

* 连接到你任务数据和 OCR 设置的参数，
* 定义区域标签及其快捷键的标签目录，
* `customRenderer` / `customOcr` 流水线钩子，
* 写回 Label Studio 的结果结构。

### 界面参数

在界面配置上设置或重命名某个参数，以指向不同的任务字段，或更改 OCR 和预览行为。默认值与下面的示例输入一致。

```js
const paramsSchema = {
  type: "object",
  properties: {
    imageField: {
      type: "string",
      title: "Image field",
      description: "Key inside task.data that holds the document image URL.",
      default: "image",
    },
    doclangViewerRef: {
      type: "string",
      title: "DocLang viewer ref (commit, tag, or branch)",
      description:
        "Which version of the DocLang viewer to load in the preview tabs. " +
        "A commit SHA is strongly preferred (jsDelivr caches it forever). " +
        "Change this to ship a viewer fix without re-publishing the Interface.",
      default: DOCLANG_VIEWER_DEFAULT_REF,
    },
    tesseractLanguage: {
      type: "string",
      enum: TESSERACT_LANGUAGE_DISPLAY_NAMES,
      title: "OCR language",
      default: TESSERACT_DEFAULT_LANGUAGE_DISPLAY,
    },
    tesseractModel: {
      type: "string",
      enum: TESSERACT_MODEL_DISPLAY_NAMES,
      title: "OCR model variant",
      default: TESSERACT_DEFAULT_MODEL_DISPLAY,
    },
    darkMode: { type: "string", enum: ["auto", "on", "off"], default: "auto" },
    defaultContentLayer: { type: "string", enum: CONTENT_LAYERS, default: "BODY" },
    defaultPictureType: { type: "string", enum: PICTURE_TYPES, default: "OTHER" },
  },
};
```

### 标签目录

`LABEL_CATEGORIES` 是版面标签、其颜色和快捷键的权威来源。编辑它即可添加、删除或重新着色标签——保持 `name` 值与你想生成的 DoclingDocument 元素类型一致。

```js
const LABEL_CATEGORIES = {
  common: {
    title: "📝 Common",
    labels: [
      { name: "text",           color: "#FFFF99", hotkey: "1" },
      { name: "section_header", color: "#FF9999", hotkey: "2" },
      { name: "list_item",      color: "#9999FF", hotkey: "3" },
      { name: "table",          color: "#FFCCCC", hotkey: "4" },
      { name: "picture",        color: "#FFCCA4", hotkey: "5" },
      { name: "caption",        color: "#FFCC99", hotkey: "6" },
    ],
  },
  // other, page, tableStructure, tableRegion, keyValue, checkboxes ...
};

const PATH_TYPES = [
  { name: "reading_order", color: "#FF0000", hasLevel: true, hotkey: "r" },
  { name: "merge",         color: "#FF00FF", hotkey: "m" },
  { name: "group",         color: "#FFFF00", hotkey: "g" },
  { name: "to_caption",    color: "#00FF00" },
  { name: "to_footnote",   color: "#00FF00" },
  { name: "to_value",      color: "#00FF00" },
];
```

### 渲染与 OCR 流水线

预览和 OCR 路径是 `Screen.jsx` 顶部附近的两个模块级 `const` 函数。替换 `customRenderer` 以更改区域如何转换为 DocLang XML，或替换 `customOcr` 以接入不同的 OCR 引擎（例如远程服务或不同的 WASM 模型）。

```js
// regions -> DocLang XML for the live preview + saved snapshot
const customRenderer = async ({ image_url, image_width, image_height, regions }) =>
  ({ doclang_xml });

// image crop -> recognized text (Tesseract.js, in the browser)
const customOcr = async ({ image_data, lang, model_variant }) =>
  ({ text, confidence });
```

### 结果结构

`getResults` 以两个 `from_name` 发出 Label Studio 结果：空间标注位于 `doclang` 下，序列化的 DocLang XML 快照位于 `doclang_xml` 下。框为 `rectanglelabels`，路径（阅读顺序、链接）为 `polygonlabels`，而 DoclingDocument XML 是一个隐藏的 `textarea` 区域。

```js
function getResults(regions, relations) {
  const out = [];
  for (const r of regions || []) {
    if (r._kind === "rectangle") {
      out.push({
        id: r.id, from_name: "doclang", to_name: "doclang",
        type: "rectanglelabels",
        value: {
          x: r._x, y: r._y, width: r._width, height: r._height,
          rectanglelabels: r.labels,
          content_layer: r._content_layer || "BODY",
          picture_type: r._picture_type || null,
          text: r._text || "",
        },
      });
    } else if (r._kind === "polyline") {
      out.push({
        id: r.id, from_name: "doclang", to_name: "doclang",
        type: "polygonlabels",
        value: { points: r._points, polygonlabels: r.labels, closed: false },
      });
    } else if (r._kind === "doclang_xml") {
      out.push({
        id: r.id, from_name: "doclang_xml", to_name: "doclang",
        type: "textarea",
        value: { text: [r._doclang_xml || ""] },
      });
    }
  }
  return out;
}
```

矩形坐标 `x`、`y`、`width` 和 `height` 为相对于图像的百分比（`0`-`100`）；路径 `points` 为 `[x, y]` 百分比对。

## 示例输入

界面期望一个任务 `data` 对象，其中包含文档图像 URL。字段名可通过 `imageField` 配置（默认为 `image`）。对于 PDF，请先将其光栅化为每页的 PNG。

{% details <b>点击展开</b> %}

```json
{
  "data": {
    "image": "https://example.com/scans/invoice-2026-05-13.png"
  }
}
```

{% enddetails %}

## 示例输出

保存的标注在 `from_name: "doclang"` 下包含每个区域一个结果，外加一个 `from_name: "doclang_xml"` 结果，保存序列化的 DoclingDocument XML。

```json
{
  "result": [
    {
      "id": "r1",
      "from_name": "doclang",
      "to_name": "doclang",
      "type": "rectanglelabels",
      "value": {
        "x": 12.5, "y": 8.2, "width": 75.0, "height": 4.8,
        "rectanglelabels": ["section_header"],
        "content_layer": "BODY",
        "picture_type": null,
        "text": "Quarterly Revenue Summary"
      }
    },
    {
      "id": "r2",
      "from_name": "doclang",
      "to_name": "doclang",
      "type": "polygonlabels",
      "value": {
        "points": [[14.0, 10.0], [14.0, 42.0], [86.0, 42.0]],
        "polygonlabels": ["reading_order"],
        "closed": false
      }
    },
    {
      "id": "r3",
      "from_name": "doclang_xml",
      "to_name": "doclang",
      "type": "textarea",
      "value": {
        "text": ["<doclang>\n  <section_header>Quarterly Revenue Summary</section_header>\n  <!-- ... -->\n</doclang>"]
      }
    }
  ]
}
```
