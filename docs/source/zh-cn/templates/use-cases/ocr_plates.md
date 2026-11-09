---
title: 用于车牌识别的光学字符识别
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 执行光学字符识别（OCR）的模板。
---

![标注界面截图](/images/templates-misc/plates.png)

准确的光学字符识别（OCR）标注数据对于负责识别和解读车牌的 AI 模型至关重要，它使从执法到自动收费等各种应用中的实时车辆识别和管理成为可能。这些模型必须有效地解析各种各样的车牌格式、布局和字体，因此需要尽可能高的标签质量以确保稳健的性能。

然而，车牌识别的数据标注面临重大挑战，包括耗时的手动流程、因标注人员专业知识不一导致的不一致标注标准，以及需要特定领域的知识来有效处理边缘情况。Label Studio 通过其创新的"AI + 人在回路（human-in-the-loop）"混合方法正面应对这些挑战，它将 AI 辅助预标注结合起来以启动标注过程，显著减少标注时间并改善一致性。我们的平台还通过用于实时反馈和验证的协作工具增强主题专家的能力，而可定制的模板确保标注界面专为车牌识别任务量身定制，从而提升标注人员效率并推动可扩展的工作流。通过简化数据标注过程，Label Studio 不仅加快了项目进度，还最大化了模型性能，确保你的 OCR 系统为高风险应用做好了精细调优。

## 标注配置

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="License Plate Number" background="green"/>
    <Label value="State Code" background="blue"/>
    <Label value="Country Code" background="orange"/>
    <Label value="Special Characters" background="purple"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed License Plate Text"
            displayMode="region-list"
            />
</View>
```
该标注配置为车牌识别任务定义了一个框架。它允许标注人员使用矩形或多边形标注图像上的特定区域，然后转写这些区域内的检测车牌文本。

```xml
<Image name="image" value="$ocr"/>
```
使用 `<Image>` 标签指定包含待标注车牌的车辆图像。

```xml
<Labels name="label" toName="image">
    <Label value="License Plate Number" background="green"/>
    <Label value="State Code" background="blue"/>
    <Label value="Country Code" background="orange"/>
    <Label value="Special Characters" background="purple"/>
</Labels>
```
使用 `<Labels>` 标签定义可供标注人员使用的特定车牌组件，例如主车牌号、州或省代码，以及任何国家代码或特殊字符。

```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```
`<Rectangle>` 标签用于围绕图像中的车牌区域绘制未标注的边界框，以隔离每个待转写的区域。

```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```
`<Polygon>` 标签使标注人员能够围绕不规则的车牌形状进行多边形区域标注，或沿着车牌的轮廓进行标注。

```xml
<TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Transcribed License Plate Text"
            displayMode="region-list"
            />
```
`<TextArea>` 标签允许转写每个已标注车牌区域内检测到的文本。该转写是可编辑的，并且在提交时是必填的，每个文本框对应于图像上绘制的一个特定区域。
