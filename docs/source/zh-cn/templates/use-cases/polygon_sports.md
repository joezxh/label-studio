---
title: 用于体育分析的基于多边形的语义分割
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过多边形执行语义分割的模板。
---

![标注界面截图](/images/templates-misc/sports-polygon.png)

在体育分析中，基于多边形标注的语义分割数据对于使 AI 模型能够准确分析球员动作、识别阵型并在比赛期间提供实时洞察至关重要。这种精确度有助于战术分析、伤病预测和表现优化等任务，这对于旨在保持竞争力的球队来说是必不可少的。

然而，标注这种复杂的数据面临重大挑战，包括耗时的手动工作、因标注人员技能水平不一导致的标签质量不一致，以及需要领域专业知识以获得可靠结果。Label Studio 通过其先进的 AI 辅助预标注能力有效应对这些问题，它加快了初始标注过程并减少了人工标注人员的工作量。我们的平台还促进了专家验证，以确保高质量的输出，并提供增强团队成员之间沟通与反馈的协作工具。借助专为体育分析定制的模板，Label Studio 不仅简化了标注工作流，还带来了可衡量的收益，例如改善的模型性能、减少的标注时间、提升的专家效率，以及能够适应体育行业不断变化需求的可扩展运营。

<a href="https://app.humansignal.com/b/NTM2"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 标注配置

```html
<View>
  <Header value="Select label and click the image to start"/>
  <Image name="image" value="$image" zoom="true"/>
  <PolygonLabels name="label" toName="image"
                 strokeWidth="3" pointSize="small"
                 opacity="0.9">
    <Label value="Player" background="red"/>
    <Label value="Referee" background="blue"/>
    <Label value="Coach" background="green"/>
    <Label value="Ball" background="orange"/>
    <Label value="Goalpost" background="purple"/>
  </PolygonLabels>
</View>
```

该配置使标注人员能够选择一个标签，然后点击体育图像开始标注。该模板使用多边形勾勒与场上球员、裁判和装备等体育人物和物体相关的区域。

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

你可以添加一个 <a href="https://labelstud.io/tags/header">header</a> 来为标注人员提供说明：

```xml
<Header value="Select label and click the image to start"/>
```

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定体育图像数据，并允许标注人员缩放图像：

```xml
<Image name="image" value="$image" zoom="true"/>
```

使用 <a href="https://labelstud.io/tags/polygonlabels">PolygonLabels</a> 控制标签，让标注人员为特定的体育相关标签创建多边形。

```xml
<PolygonLabels name="label" toName="image"
               strokeWidth="3" pointSize="small"
               opacity="0.9">
  <Label value="Player" background="red"/>
  <Label value="Referee" background="blue"/>
  <Label value="Coach" background="green"/>
  <Label value="Ball" background="orange"/>
  <Label value="Goalpost" background="purple"/>
</PolygonLabels>
```

标注人员可以使用 `opacity` 参数调整多边形的不透明度，并使用 `pointSize` 和 `strokeWidth` 参数设置多边形工具的样式。使用 <a href="https://labelstud.io/tags/label">Label</a> 控制标签的 `background` 参数为对应于不同体育元素的每个多边形设置颜色。
