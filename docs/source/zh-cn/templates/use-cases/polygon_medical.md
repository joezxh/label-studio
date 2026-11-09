---
title: 用于医学图像分析的基于多边形的语义分割
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过多边形执行语义分割的模板。
---

![标注界面截图](/images/templates-misc/polygon-medical.png)

医学图像分析中使用多边形进行的语义分割，对于在复杂图像（如肿瘤或器官）中准确识别和勾画解剖结构至关重要，这直接影响诊断和治疗规划。AI 模型利用这些数据来自动化医学图像的解读，提升临床医生的效率和患者护理的准确性。

然而，这一过程常常受到耗时手动标注、不同标注人员之间不一致以及需要专业领域知识等挑战的阻碍。Label Studio 通过其 AI 辅助预标注能力应对这些障碍，它基于现有数据提供边界框和建议的分割，显著减少了团队的初始工作量。结合专家验证工作流、用于标注人员反馈的协作工具，以及专为医学影像定制的高度可定制模板，Label Studio 确保了高质量且一致的标注数据，最终带来改善的模型性能、减少的标注时间，以及能够适应医疗领域独特需求的可扩展工作流。

<a href="https://app.humansignal.com/b/NTM3"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="#FFBAAA" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="#FF7557"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 标注配置

```html
<View>
  <Header value="Select tissue type and delineate the region on the medical image to start"/>
  <Image name="image" value="$image" zoom="true"/>
  <PolygonLabels name="label" toName="image"
                 strokeWidth="3" pointSize="small"
                 opacity="0.9">
    <Label value="Tumor" background="red"/>
    <Label value="Healthy Tissue" background="green"/>
    <Label value="Edema" background="yellow"/>
    <Label value="Necrosis" background="purple"/>
  </PolygonLabels>
</View>
```

该配置允许标注人员选择一种组织类型，并在医学图像上准确地勾画出其边界，从而实现对不同解剖和病理区域的精确语义分割。

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

你可以添加一个 <a href="https://labelstud.io/tags/header">header</a> 来为标注人员提供说明：

```xml
<Header value="Select tissue type and delineate the region on the medical image to start"/>
```

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定医学影像数据，并允许标注人员缩放图像：

```xml
<Image name="image" value="$image" zoom="true"/>
```

使用 <a href="https://labelstud.io/tags/polygonlabels">PolygonLabels</a> 控制标签，让标注人员勾画出与特定组织类型或病理区域相对应的多边形区域。

```xml
<PolygonLabels name="label" toName="image"
               strokeWidth="3" pointSize="small"
               opacity="0.9">
  <Label value="Tumor" background="red"/>
  <Label value="Healthy Tissue" background="green"/>
  <Label value="Edema" background="yellow"/>
  <Label value="Necrosis" background="purple"/>
</PolygonLabels>
```

标注人员可以使用 <code>opacity</code> 参数控制多边形的不透明度，并使用 <code>pointSize</code> 和 <code>strokeWidth</code> 参数设置多边形工具的样式。使用 <a href="https://labelstud.io/tags/label">Label</a> 控制标签的 <code>background</code> 参数为每个组织或病理标签分配不同的颜色。
