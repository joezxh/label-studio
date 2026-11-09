---
title: 用于教育评估的光学字符识别
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 执行光学字符识别（OCR）的模板。
---

![标注界面截图](/images/templates-misc/education.png)

光学字符识别（OCR）标注数据对于教育评估中的 AI 应用至关重要，它使模型能够准确地从扫描文档中提取和解读书写文本。这一能力促进了考试评分、学生作业分析和行政流程自动化等任务，最终提升了教育评估的质量和效率。

然而，OCR 的数据标注过程面临重大挑战：由于需要处理的文档数量庞大，它往往耗时费力；因笔迹或文本格式各异，容易出现不一致；并且需要领域专业知识以确保对教育内容的准确解读。Label Studio 通过其混合 AI 辅助预标注有效应对这些挑战，它在保持高准确率的同时加速了初始标注工作。该平台的专家验证功能确保标签符合所需标准，使团队能够通过专为教育评估任务定制的可定制模板进行无缝协作。这种方法不仅简化了标注过程，还提升了模型性能和可扩展性，使组织能够高效且有效地处理大量数据。

<a href="https://app.humansignal.com/b/NTQx"
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
    <Label value="Multiple Choice" background="green"/>
    <Label value="Essay" background="blue"/>
    <Label value="True/False" background="orange"/>
    <Label value="Matching" background="purple"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed Question or Answer Text"
            displayMode="region-list"
            />
</View>
```
该标注配置让你能够通过形状识别图像上的区域并转写相应的问题或答案文本，来执行教育评估标注任务。你可以选择标签类型（例如"选择题"），然后高亮相关文本区域，将转写与每个区域关联起来。

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的图像：

```xml
<Image name="image" value="$ocr"/>
```

使用 <a href="https://labelstud.io/tags/labels">Labels</a> 控制标签指定可应用于图像上不同形状的标签：

```xml
<Labels name="label" toName="image">
  <Label value="Multiple Choice" background="green"/>
  <Label value="Essay" background="blue"/>
  <Label value="True/False" background="orange"/>
  <Label value="Matching" background="purple"/>
</Labels>
```

你可以更改每个 <code>Label</code> 的 <code>value</code>，为教育内容图像中的区域分配不同的评估项类型。

使用 <a href="https://labelstud.io/tags/rectangle">Rectangle</a> 控制标签添加未标注的矩形：

```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```

选择 Rectangle 标签而非 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 意味着标注人员可以先创建高亮问题或答案的区域，然后分配标签，再为每个区域转写文本。这一工作流便于在教育评估中进行分步标注。

使用 <a href="https://labelstud.io/tags/polygon">Polygon</a> 控制标签添加未标注的多边形：

```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```

<code>strokeWidth</code> 参数控制多边形轮廓的粗细。

使用 <a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签为图像上绘制的每个区域添加转写：

```xml
<TextArea name="transcription" toName="image"
          editable="true"
          perRegion="true"
          required="true"
          maxSubmissions="1"
          rows="5"
          placeholder="Transcribed Question or Answer Text"
          displayMode="region-list"
/>
```

<code>editable="true"</code> 设置允许标注人员在提交后修改转写，而 <code>displayMode="region-list"</code> 在与每个形状关联的区域的区域列表中显示文本框，便于更新。<code>perRegion="true"</code> 属性表示每个转写属于特定区域，<code>required="true"</code> 在提交前强制要求输入转写。<code>placeholder</code> 文本在编辑前为标注人员提供引导。


相关标签：

- <a href="https://labelstud.io/tags/image">Image</a>
- <a href="https://labelstud.io/tags/labels">Labels</a>
- <a href="https://labelstud.io/tags/rectangle">Rectangle</a>
- <a href="https://labelstud.io/tags/polygon">Polygon</a>
- <a href="https://labelstud.io/tags/textarea">TextArea</a>
