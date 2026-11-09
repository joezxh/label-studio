---
title: 用于智能家居设备的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行智能家居设备目标检测的模板。
---

![标注界面截图](/images/templates-misc/smart-home.png)

带边界框标注的目标检测数据对于智能家居设备中的 AI 至关重要，因为它能够实时准确地识别和跟踪物体，从而促进家庭安防监控、家用设备自动化和高效的能源管理等任务。准确的标注确保这些模型能够区分各种物品，从而对环境中的用户指令和交互做出可靠响应。

该领域的主要挑战之一在于标注数据的耗时性质，往往会因标注的不一致以及需要领域专业知识来理解多样环境中的复杂物体而加剧。Label Studio 通过一种将 AI 辅助预标注与人工专家验证相结合的强大混合方法来应对这些障碍。这实现了快速的初始标注，同时通过主题专家的审查确保了高准确率。该平台的协作工具实现了高效的工作流，使团队能够无缝沟通，其可定制的模板专为边界框任务而设计，提升了标注人员的效率和可扩展性。这带来了标注时间的明显减少、模型性能的改善，以及随着项目需求增长而轻松扩展的能力。

<a href="https://app.humansignal.com/b/NTMw"
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
    <Label value="Smart Thermostat" background="orange"/>
    <Label value="Security Camera" background="red"/>
    <Label value="Smart Light Bulb" background="yellow"/>
    <Label value="Smart Lock" background="blue"/>
    <Label value="Voice Assistant" background="green"/>
  </RectangleLabels>
</View>
```

该配置定义了可应用于智能家居设备图像的矩形边界框标签。

每个标签对应一种特定类型的智能家居设备，并分配了不同的背景颜色，以便在图像上轻松识别。

```json
{ 
  "x": 50,  # 边界框左上角，取值为图像宽度的 0% 到 100%
  "y": 60,  # 边界框左上角，取值为图像高度的 0% 到 100%
  "width": 10,  # 边界框宽度，取值为图像宽度的 0% 到 100%
  "height": 20,  # 边界框高度，取值为图像高度的 0% 到 100%
  "rotation": 45  # 围绕边界框左上角的旋转角度（度）
}
```

当你通过标注界面的信息面板旋转智能家居设备的边界框时，旋转锚点是矩形的左上角，这也是旋转角度在标注结果中的存储方式。


```html
<View visibleWhen="region-selected">
  <Header value="Describe device"/>
  <TextArea name="description" toName="image" editable="true"
            perRegion="true" required="true" placeholder="Enter device details here..."/>
  <Choices name="status" toName="image"
           perRegion="true">
    <Choice value="Operational"/>
    <Choice value="Faulty"/>
    <Choice value="Needs Maintenance"/>
    <Choice value="Offline"/>
  </Choices>
</View>
```

该视图使描述提示仅在选中某个智能家居设备的边界框之后才会出现。

Header 为标注人员提供描述检测设备的说明。TextArea 允许为每个区域输入详细备注，Choices 则用于选择每个已标注边界框的设备运行状态。

```xml
<Image name="image" value="$image"/>
```

使用 Image 标签指定你想要标注的智能家居设备图像。

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Smart Thermostat" background="orange"/>
  <Label value="Security Camera" background="red"/>
  <Label value="Smart Light Bulb" background="yellow"/>
  <Label value="Smart Lock" background="blue"/>
  <Label value="Voice Assistant" background="green"/>
</RectangleLabels>
```

使用 RectangleLabels 标签添加代表常见智能家居设备的带标签边界框，为每个框分配唯一的颜色以便图像中进行视觉区分。
