---
title: 用于文档数字化的光学字符识别
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 执行光学字符识别（OCR）的模板。
---

![标注界面截图](/images/templates-misc/doc-digitize.png)

准确的光学字符识别（OCR）标注数据对于 AI 驱动的文档数字化至关重要，因为它使模型能够有效地将各种文档格式转换为机器可读的文本。高质量的标签使 AI 能够执行文本提取、数据分类和信息检索等任务，从而提升从法律到医疗等各个领域的效率。

文档数字化过程面临重大挑战，包括耗时的手动标注、因标注人员技能不一导致的不一致质量，以及需要领域专业知识来理解复杂的术语。Label Studio 通过利用其混合 AI 辅助预标注方法正面应对这些问题，它加速了标注过程并减少了标注人员的工作量。我们的平台通过直观的标注工具和稳健的工作流管理实现了无缝协作，而我们的可定制模板专门适配你的文档类型，确保专家验证融入每一步。这带来了可衡量的收益，例如改善的模型性能、减少的标注时间、提升的专家效率，以及能够适应你不断变化需求的可扩展工作流。

<a href="https://app.humansignal.com/b/NTM5"
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
    <Label value="Printed Text" background="green"/>
    <Label value="Handwritten Notes" background="blue"/>
    <Label value="Stamp or Seal" background="orange"/>
    <Label value="Signature" background="purple"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed Text"
            displayMode="region-list"
            />
</View>
```

该标注配置允许你使用多种形状在文档图像上执行光学字符识别（OCR）任务。你可以识别代表印刷文本、手写笔记、印章或戳记以及签名的区域，然后转写每个所选区域内的文本。

```xml
<Image name="image" value="$ocr"/>
```

使用 `<Image>` 标签指定需要文本区域标注和转写的文档图像。

```xml
<Labels name="label" toName="image">
  <Label value="Printed Text" background="green"/>
  <Label value="Handwritten Notes" background="blue"/>
  <Label value="Stamp or Seal" background="orange"/>
  <Label value="Signature" background="purple"/>
</Labels>
```

`<Labels>` 标签定义了可应用于文档图像上所创建形状的文本相关区域类型，例如区分印刷文本、手写内容、印章和签名。

```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```

`<Rectangle>` 标签使标注人员能够在文档图像上出现文本的区域周围绘制边界框。

```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```

`<Polygon>` 标签通过允许标注人员勾勒文档图像上不规则形状的区域，实现更精确的文本区域划分。

```xml
<TextArea name="transcription" toName="image"
          editable="true"
          perRegion="true"
          required="true"
          maxSubmissions="1"
          rows="5"
          placeholder="Transcribed Text"
          displayMode="region-list"
/>
```

`<TextArea>` 标签提供了可编辑的字段，供标注人员输入每个已标注区域的识别或转写文本。设置 `editable="true"` 允许在提交后进行更正，`perRegion="true"` 将转写与特定区域关联，而 `required="true"` 确保在任务提交前不会遗漏任何转写。
