---
title: 用于安防系统的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行安防系统目标检测的模板。
---

![标注界面截图](/images/templates-misc/security.png)

带边界框的目标检测对于安防系统中的 AI 至关重要，因为它能够实时识别和定位潜在威胁，例如入侵者或未经授权的车辆。这一能力对于自动化监控流程和提升威胁检测的准确性必不可少，使安防人员能够快速有效地做出响应。

然而，目标检测的数据标注过程往往充满挑战，包括可能导致不一致的耗时标注任务，以及需要领域专业知识来准确识别和分类视觉上下文中的物体。Label Studio 通过其创新的混合 AI 辅助预标注功能有效应对这些问题，它通过生成初始边界框建议来显著加速标注过程。此外，我们的平台让专家审查人员能够验证和精炼这些标签，确保高质量、一致的结果。借助专为安防领域定制的强大协作工具和可定制标注模板，Label Studio 不仅简化了工作流，还提升了专家效率和可扩展性，最终在减少数据准备所需时间的同时改善模型性能。

<a href="https://app.humansignal.com/b/NTMy"
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
    <Label value="Intruder" background="red"/>
    <Label value="Suspicious Object" background="orange"/>
    <Label value="Authorized Personnel" background="green"/>
    <Label value="Security Vehicle" background="blue"/>
    <Label value="Restricted Area" background="purple"/>
  </RectangleLabels>
</View>
```

该配置包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 元素指定待标注的监控录像或摄像头快照：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 标签定义标签并将矩形边界框附加到安防图像数据上。使用 <a href="https://labelstud.io/tags/label">Label</a> 标签控制不同安防类别的颜色编码：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Intruder" background="red"/>
  <Label value="Suspicious Object" background="orange"/>
  <Label value="Authorized Personnel" background="green"/>
  <Label value="Security Vehicle" background="blue"/>
  <Label value="Restricted Area" background="purple"/>
</RectangleLabels>
```

如果你想为带边界框的目标检测任务添加更多上下文，可以在配置中加入<strong>逐区域（per-region）</strong>条件标注参数，以收集额外的洞察。

例如，要提示分析人员为检测到的安防异常添加评论，可以添加以下片段：

```html
<View visibleWhen="region-selected">
  <Header value="Describe the security concern" />
  <TextArea name="description" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="status" toName="image"
           perRegion="true">
    <Choice value="Clear"/>
    <Choice value="Potential Threat"/>
    <Choice value="Confirmed Threat"/>
  </Choices>
</View>
```

<code>visibleWhen</code> 属性确保描述提示仅在选中边界框时才会出现。

分析人员选中框后，<a href="https://labelstud.io/tags/header">Header</a> 会提供描述检测物品的说明。

<a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签允许为每个所选区域输入文本备注，由 <code>perRegion="true"</code> 指定。你也可以添加 <code>placeholder</code> 属性来提供建议的文本提示。

此外，使用启用了 <code>perRegion</code> 的 <a href="https://labelstud.io/tags/choices">Choices</a> 标签来捕获与边界框内容相关的状态评估。
