---
title: 用于医学影像的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行医学影像目标检测的模板。
---

![带医学影像的标注界面截图](/images/templates-misc/bbox-medical.png)

带边界框的目标检测在医学影像中至关重要，因为它使 AI 模型能够在 X 光和 MRI 等影像扫描中准确识别和定位肿瘤或病变等异常。高质量的标注数据对于训练这些模型以执行直接影响诊断准确性和治疗决策的任务是必需的。

然而，医学影像中的数据标注过程充满重大挑战，包括手动标注的耗时性质、不同标注人员之间标注不一致的风险，以及需要广泛的领域专业知识以确保准确性。Label Studio 通过混合 AI 辅助方法有效应对这些挑战，利用预标注能力加速初始标注过程，同时确保由专业的专家审查人员对标注进行验证。该平台的协作工具促进了标注人员与领域专家之间的无缝沟通，其可定制模板允许调整工作流以提升标注效率和可扩展性。通过将自动化与人工监督相结合，Label Studio 不仅缩短了标注时间，还显著改善了标注数据的整体质量，从而在关键的医学应用中带来更优的模型性能。

<a href="https://app.humansignal.com/b/NjYx"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 标注界面

```html
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Tumor" background="red"/>
    <Label value="Organ" background="blue"/>
    <Label value="Lesion" background="orange"/>
    <Label value="Calcification" background="yellow"/>
    <Label value="Nodule" background="green"/>
  </RectangleLabels>
</View>
```

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的医学影像扫描：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 控制标签，可同时向你的医学图像添加标签和矩形边界框。使用 <a href="https://labelstud.io/tags/label">Label</a> 标签控制框的颜色：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Tumor" background="red"/>
  <Label value="Organ" background="blue"/>
  <Label value="Lesion" background="orange"/>
  <Label value="Calcification" background="yellow"/>
  <Label value="Nodule" background="green"/>
</RectangleLabels>
```

如果你想为医学影像中带边界框的目标检测任务添加更多上下文，可以在标注配置中加入一些<strong>逐区域（per-region）</strong>条件标注参数。

例如，要提示标注人员为检测到的异常添加描述，可以在标注配置中添加以下内容：

```html
<View visibleWhen="region-selected">
  <Header value="Describe abnormality"/>
  <TextArea name="answer" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="choices" toName="image"
           perRegion="true">
    <Choice value="Benign"/>
    <Choice value="Malignant"/>
    <Choice value="Indeterminate"/>
  </Choices>
</View>
```

<a href="https://labelstud.io/tags/view">View</a> 标签的 <code>visibleWhen</code> 参数会将对描述提示的显示隐藏起来，直到选中某个边界框为止。

标注人员选中边界框后，<a href="https://labelstud.io/tags/header">Header</a> 会出现并为标注人员提供说明。

<a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签显示一个可编辑的文本框，应用于所选的边界框，由 <code>perRegion="true"</code> 参数指定。你还可以添加 <code>placeholder</code> 参数为标注人员提供建议文本。

此外，你可以通过带有 <code>perRegion</code> 参数的 <a href="https://labelstud.io/tags/choices">Choices</a> 标签，提示标注人员提供有关边界框内容的额外反馈，例如框内异常的诊断状态。
