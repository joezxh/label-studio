---
title: 用于野生动物保护的基于多边形的语义分割
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过多边形执行语义分割的模板。
---

![标注界面截图](/images/templates-misc/wildlife.png)

在野生动物保护中，基于多边形标注的语义分割数据对于在多样环境中准确识别和分类物种至关重要，它使 AI 模型能够执行栖息地分析、种群监测和威胁检测等任务。高质量的标注数据集使这些模型能够辨别复杂生态系统中的精细模式，从而推动有效的保护策略。

然而，野生动物图像的标注过程可能充满挑战，包括耗时费力、因专业知识不一导致的标注质量不一致，以及需要领域专家进行综合审查。Label Studio 通过其 AI 辅助预标注能力应对这些障碍，显著减少了启动标注过程所需的时间。通过专家验证，每个预标注的数据集都经过细致审查，确保准确性和一致性。此外，我们的协作工具使团队能够无缝协作，而可定制的模板则简化了专门针对野生动物保护需求的标注工作流。这些功能共同带来了改善的模型性能、提升的运营效率，以及处理对保护地球生物多样性至关重要的大型数据集所需的可扩展性。

<a href="https://app.humansignal.com/b/NTM4"
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
                 opacity="0.5">
    <Label value="Elephant" background="green"/>
    <Label value="Lion" background="orange"/>
    <Label value="Rhinoceros" background="gray"/>
    <Label value="Zebra" background="blue"/>
    <Label value="Giraffe" background="yellow"/>
  </PolygonLabels>
</View>
```

该配置允许标注人员选择与野生动物保护相关的标签，并通过在动物或特征周围绘制多边形来标记图像区域。该界面包含一个启用了缩放功能的图像查看器，用于详细识别，以及经过样式调整以提升可见性和可用性的多边形工具。

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

你可以添加一个 <a href="https://labelstud.io/tags/header">header</a> 来为标注人员提供说明：

```xml
<Header value="Select label and click the image to start"/>
```

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定图像数据，并允许标注人员缩放图像：

```xml
<Image name="image" value="$image" zoom="true"/>
```

使用 <a href="https://labelstud.io/tags/polygonlabels">PolygonLabels</a> 控制标签，让标注人员为特定标签创建多边形。

```xml
<PolygonLabels name="label" toName="image"
               strokeWidth="3" pointSize="small"
               opacity="0.9">
  <Label value="Elephant" background="green"/>
  <Label value="Lion" background="orange"/>
  <Label value="Rhinoceros" background="gray"/>
  <Label value="Zebra" background="black"/>
  <Label value="Giraffe" background="yellow"/>
</PolygonLabels>
```

标注人员可以使用 <code>opacity</code> 参数控制多边形的不透明度，并使用 <code>pointSize</code> 和 <code>strokeWidth</code> 参数设置多边形工具的样式。使用 <a href="https://labelstud.io/tags/label">Label</a> 控制标签的 <code>background</code> 参数来控制每个多边形的颜色。
