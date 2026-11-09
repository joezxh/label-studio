---
title: 用于交通监控的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行交通监控目标检测的模板。
---

![带交通监控图像的标注界面截图](/images/templates-misc/bbox-traffic.png)

带边界框标注的目标检测数据对于 AI 驱动的交通监控模型至关重要，使它们能够实时准确地识别和分类车辆、行人和交通标志。这一能力对于增强交通管理系统、为自动驾驶协议提供信息以及改善道路安全至关重要。

然而，交通监控的数据标注存在重大挑战。由于交通环境复杂且动态变化，该过程往往耗时费力并容易出现不一致。此外，通常需要专业的领域知识来准确解读和标注物体，这进一步使工作流复杂化。Label Studio 通过其强大的"AI + 人在回路（human-in-the-loop）"混合方法有效应对这些挑战。通过利用 AI 辅助预标注，我们的平台加速了初始标注阶段，让人工标注人员专注于验证和精炼。协作工具促进了团队成员之间的无缝沟通，而可定制的模板确保了一致的特定领域需求。这不仅带来了改进的模型性能，还减少了标注时间并提升了专家效率，从而实现可适应任何交通监控运营需求的可扩展工作流。

<a href="https://app.humansignal.com/b/NjYy"
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
    <Label value="Vehicle" background="blue"/>
    <Label value="Pedestrian" background="green"/>
    <Label value="Traffic Light" background="red"/>
    <Label value="Bicycle" background="orange"/>
    <Label value="Road Sign" background="purple"/>
  </RectangleLabels>
</View>
```

该标注配置包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 标签指定待标注的交通场景图像：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 标签，为图像中不同的交通实体添加标签和矩形边界框。<a href="https://labelstud.io/tags/label">Label</a> 标签定义了不同的交通相关类别，并为其边界框分配了特定颜色以保持清晰：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Vehicle" background="blue"/>
  <Label value="Pedestrian" background="green"/>
  <Label value="Traffic Light" background="red"/>
  <Label value="Bicycle" background="orange"/>
  <Label value="Road Sign" background="purple"/>
</RectangleLabels>
```

如果你想为带边界框的交通监控任务添加更多上下文，可以在标注配置中加入一些<strong>逐区域（per-region）</strong>条件标注参数。

例如，要提示标注人员为检测到的交通物体添加描述，可以在标注配置中添加以下内容：

```html
<View visibleWhen="region-selected">
  <Header value="Describe traffic object" />
  <TextArea name="answer" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="choices" toName="image"
           perRegion="true">
    <Choice value="Operational"/>
    <Choice value="Malfunctioning"/>
    <Choice value="Obstructed"/>
    <Choice value="Damaged"/>
  </Choices>
</View>
```

<a href="https://labelstud.io/tags/view">View</a> 标签的 <code>visibleWhen</code> 参数会将对描述提示的显示隐藏起来，直到选中某个边界框为止。

标注人员选中边界框后，<a href="https://labelstud.io/tags/header">Header</a> 会出现并为标注人员提供说明。

<a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签显示一个可编辑的文本框，应用于所选的边界框，由 <code>perRegion="true"</code> 参数指定。你还可以添加 <code>placeholder</code> 参数为标注人员提供建议文本。

此外，你可以通过带有 <code>perRegion</code> 参数的 <a href="https://labelstud.io/tags/choices">Choices</a> 标签，提示标注人员提供有关边界框内容的额外反馈，例如框内物体的运行状态。
