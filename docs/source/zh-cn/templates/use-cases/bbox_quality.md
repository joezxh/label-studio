---
title: 用于质量控制的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行质量控制目标检测的模板。
---

![标注界面截图](/images/templates-misc/quality-control.png)

带边界框标注的目标检测数据对于质量控制中的 AI 应用至关重要，因为它使模型能够在制造过程中准确识别和定位产品或异常中的缺陷。通过利用这些标注数据，AI 可以执行检测材料瑕疵、确保符合质量标准以及提升整体生产效率等任务。

该领域最大的挑战之一是手动标注海量图像数据耗时费力，这往往会导致不一致和错误，尤其是在需要领域专业知识来识别细微缺陷时。Label Studio 通过其创新的混合方法有效应对这些挑战，该方法将 AI 辅助预标注与人工专家验证相结合。这不仅加快了标注过程，还通过让专业标注人员审查和精炼标签来确保高准确率。此外，该平台提供可定制的模板和协作工具来简化工作流，使团队能够轻松扩展其运营，同时保持精度，最终带来改进的模型性能和标注时间的显著减少。

<a href="https://app.humansignal.com/b/NTM1"
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
    <Label value="Defect" background="red"/>
    <Label value="Wear" background="orange"/>
    <Label value="Contamination" background="yellow"/>
    <Label value="Scratch" background="blue"/>
    <Label value="Crack" background="purple"/>
  </RectangleLabels>
</View>
```

该标注配置包含矩形边界框，用于捕获图像中不同类型的质控问题。使用这些标签来标记产品图像中发现的缺陷、磨损、污染、划痕或裂纹。
