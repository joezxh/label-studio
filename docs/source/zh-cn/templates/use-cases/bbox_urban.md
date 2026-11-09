---
title: 用于城市规划的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行城市规划目标检测的模板。
---

![标注界面截图](/images/templates-misc/urban.png)

带边界框的目标检测对于城市规划中的 AI 至关重要，因为它能够准确识别和定位城市环境中的建筑、道路和绿地等特征。这些标注数据对于基础设施监测、资源分配和城市发展规等任务必不可少，使市政部门能够利用 AI 做出更明智的决策。

然而，规划数据集的标注面临若干挑战，包括标注大量图像的耗时性质、因标注人员标准不一导致的标签不一致，以及需要领域专业知识来准确解读城市特征。Label Studio 通过其混合 AI 辅助预标注有效应对这些问题，它加速了初始标注过程，而专家验证则通过持续的监督确保了高质量的输出。此外，我们的协作工具和可定制模板简化了标注工作流，使团队能够更高效地工作并在不牺牲准确性的前提下扩展其工作量。通过整合这些功能，Label Studio 显著改善了模型性能、减少了标注时间并提升了专家效率，最终带来更优的城市规划成果。

<a href="https://app.humansignal.com/b/NTMz"
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
    <Label value="Residential Zone" background="green"/>
    <Label value="Commercial Area" background="blue"/>
    <Label value="Public Park" background="orange"/>
    <Label value="Industrial Site" background="purple"/>
    <Label value="Transportation Hub" background="red"/>
  </RectangleLabels>
</View>
```

该标注配置包裹在 `<View>` 标签中。它包含一个指定待标注图像的 `<Image>` 标签，而 `<RectangleLabels>` 标签定义了为城市规划量身定制的带标签边界框，例如住宅区和商业区，每个标签分配了不同的颜色。

```xml
<Image name="image" value="$image"/>
```
使用 `<Image>` 标签指定你想要标注的城市规划地图或卫星照片图像。

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Residential Zone" background="green"/>
  <Label value="Commercial Area" background="blue"/>
  <Label value="Public Park" background="orange"/>
  <Label value="Industrial Site" background="purple"/>
  <Label value="Transportation Hub" background="red"/>
</RectangleLabels>
```
使用 `<RectangleLabels>` 标签添加与城市规划相关的带标签矩形边界框，例如住宅区和商业区。每个 `<Label>` 标签控制标签的显示文本和边界框颜色。

```html
<View visibleWhen="region-selected">
  <Header value="Describe area"/>
  <TextArea name="answer" toName="image" editable="true" 
            perRegion="true" required="true" placeholder="Enter description here..."/>
  <Choices name="choices" toName="image" perRegion="true">
    <Choice value="Planned"/>
    <Choice value="Under Construction"/>
    <Choice value="Existing"/>
    <Choice value="Restricted"/>
  </Choices>
</View>
```
该片段为带边界框的城市规划物体添加了逐区域条件标注。带有 `visibleWhen="region-selected"` 的 `<View>` 标签使描述提示仅在选中某个区域时才可见。`<Header>` 提供说明。`<TextArea>` 允许标注人员输入所选区域的特定描述，而 `<Choices>` 提供诸如"已规划""建设中""已存在"或"受限"等状态类别。
