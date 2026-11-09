---
title: 用于市场调研问卷的光学字符识别
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 执行光学字符识别（OCR）的模板。
---

![标注界面截图](/images/templates-misc/market-research.png)

在市场调研问卷领域，光学字符识别（OCR）标注数据对于使 AI 模型能够从大量非结构化的问卷回复中高效地提取和分析文本洞察至关重要。这些模型旨在自动化情感分析、趋势识别和客户反馈解读，直接影响商业战略中的数据驱动决策。

然而，该领域的障碍是显著的；标注大量问卷数据往往耗时费力，可能导致标注准确性的潜在不一致。此外，对领域专业知识的需求增加了复杂性，因为标注人员不仅必须准确识别相关文本，还要理解细微的情感和意图。Label Studio 通过其"AI + 人在回路（human-in-the-loop）"混合方法有效应对这些挑战。该平台利用 AI 辅助预标注来加速初始数据处理，而自定义模板和审查工作流则简化了标注过程。此外，内置的协作工具促进了标注人员与专家之间的无缝沟通，确保最终的标签达到高精度和相关性的标准，最终提升模型性能和可扩展性。

<a href="https://app.humansignal.com/b/NTQw"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 标注配置

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="Customer Feedback" background="green"/>
    <Label value="Product Feature Mention" background="blue"/>
    <Label value="Competitor Reference" background="orange"/>
    <Label value="Pricing Comment" background="purple"/>
    <Label value="Service Satisfaction" background="red"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed Feedback Text"
            displayMode="region-list"
            />
</View>
```

该配置使用多种形状对问卷回复图像执行文本提取任务。使用本模板选择带有形状的区域，并转写每个区域对应的问卷反馈文本。

所有市场调研问卷文本提取配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的问卷回复图像：

```xml
<Image name="image" value="$ocr"/>
```

使用 <a href="https://labelstud.io/tags/labels">Labels</a> 标签定义可用于标注问卷图像中不同区域的标注类别：

```xml
<Labels name="label" toName="image">
  <Label value="Customer Feedback" background="green"/>
  <Label value="Product Feature Mention" background="blue"/>
  <Label value="Competitor Reference" background="orange"/>
  <Label value="Pricing Comment" background="purple"/>
  <Label value="Service Satisfaction" background="red"/>
</Labels>
```

你可以修改每个 <code>Label</code> 的 <code>value</code>，将特定的问卷相关文本类别标签（如"客户反馈"或"定价评论"）分配给图像的各个片段。

使用 <a href="https://labelstud.io/tags/rectangle">Rectangle</a> 标签添加用于标注的未标注矩形区域：

```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```

使用 Rectangle 标签（而非 RectangleLabels）允许标注人员先绘制高亮文本区域的框，然后再分配标签，接着为每个所选区域转写文本。这一工作流契合典型的市场调研问卷文本转写，并便于预标注。

使用 <a href="https://labelstud.io/tags/polygon">Polygon</a> 标签添加未标注的多边形区域：

```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```

<code>strokeWidth</code> 属性控制多边形轮廓的粗细。

使用 <a href="https://labelstud.io/tags/textarea">TextArea</a> 标签为图像上每个已标注区域（无论是矩形还是多边形）添加转写输入框：

```xml
<TextArea name="transcription" toName="image"
          editable="true"
          perRegion="true"
          required="true"
          maxSubmissions="1"
          rows="5"
          placeholder="Transcribed Feedback Text"
          displayMode="region-list"
          />
```

<code>editable="true"</code> 属性让标注人员在提交后修改转写的文本。<code>displayMode="region-list"</code> 显示与每个区域关联的文本区域以便更新。设置 <code>perRegion="true"</code> 意味着每个文本框对应于一个特定的已标注区域，而 <code>required="true"</code> 在提交前强制要求输入文本。<code>placeholder</code> 设置输入前显示在文本框中的示例提示文本。
