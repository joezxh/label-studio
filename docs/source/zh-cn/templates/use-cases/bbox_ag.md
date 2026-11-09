---
title: 用于智慧农业的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行智慧农业目标检测的模板。
---

![标注界面截图](/images/templates-misc/agriculture.png)

带有边界框标注的目标检测数据对于智慧农业中的 AI 应用至关重要，因为它使模型能够实时准确地识别和跟踪各种作物、杂草和害虫。通过辅助作物监测、产量预测和病虫害防治等任务，这些 AI 模型可以显著优化农业实践并提升生产力。

然而，该领域的数据标注过程存在若干挑战，包括耗时费力的标注工作、标注质量的不一致，以及需要领域专业知识以确保准确性。Label Studio 通过其创新的"AI + 人在回路（human-in-the-loop）"混合方法正面应对这些问题。借助 AI 辅助的预标注，标注人员可以在保持高准确率的同时大幅减少工作量。该平台还包含专为农业数据集定制的可定制标注模板，从而实现高效处理。专家验证确保最终标签符合严格的质量标准，而协作工具则简化了团队之间的沟通，最终缩短标注时间并提升工作流的可扩展性。通过选择 Label Studio，组织可以改进模型性能、节省宝贵资源，并充满信心地利用 AI 来变革其农业实践。

<a href="https://app.humansignal.com/b/NDk3"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 标注配置

```html
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Corn Field" background="green"/>
    <Label value="Irrigation System" background="blue"/>
    <Label value="Drone Survey" background="orange"/>
    <Label value="Pest Infestation" background="red"/>
    <Label value="Soil Sampling Area" background="purple"/>
  </RectangleLabels>
</View>
```

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的航拍或卫星图像：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 控制标签，可同时向你的农业图像添加标签和矩形边界框。使用 <a href="https://labelstud.io/tags/label">Label</a> 标签控制框的颜色：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Corn Field" background="green"/>
  <Label value="Irrigation System" background="blue"/>
  <Label value="Drone Survey" background="orange"/>
  <Label value="Pest Infestation" background="red"/>
  <Label value="Soil Sampling Area" background="purple"/>
</RectangleLabels>
```

如果你想为带边界框的目标检测任务添加更多上下文，可以在标注配置中加入一些<strong>逐区域（per-region）</strong>条件标注参数。

例如，要提示标注人员为检测到的农业特征添加描述，可以在标注配置中添加以下内容：

```html
<View visibleWhen="region-selected">
  <Header value="Describe agricultural feature" />
  <TextArea name="description" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="health_status" toName="image"
           perRegion="true">
    <Choice value="Healthy"/>
    <Choice value="Diseased"/>
    <Choice value="Needs Irrigation"/>
    <Choice value="Harvest Ready"/>
  </Choices>
</View>
```

<a href="https://labelstud.io/tags/view">View</a> 标签的 <code>visibleWhen</code> 参数会将对描述提示的显示隐藏起来，直到选中某个边界框为止。

标注人员选中边界框后，<a href="https://labelstud.io/tags/header">Header</a> 会出现并为标注人员提供说明。

<a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签显示一个可编辑的文本框，应用于所选的边界框，由 <code>perRegion="true"</code> 参数指定。

此外，你可以通过带有 <code>perRegion</code> 参数的 <a href="https://labelstud.io/tags/choices">Choices</a> 标签，提示标注人员提供有关边界框内容的额外反馈，例如边界框内的作物健康状态或灌溉状况。
