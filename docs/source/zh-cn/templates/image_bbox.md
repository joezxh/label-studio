---
title: 使用边界框进行目标检测
type: templates
category: Computer Vision
cat: computer-vision
order: 110
meta_title: 图像目标检测数据标注模板
meta_description: 用于使用矩形边界框进行目标检测的模板，适用于你的机器学习和数据科学项目。
---


如果你要进行目标检测，需要创建一个带标签的数据集。使用以下模板为图像添加矩形边界框，并对边界框内的内容打标签。

<a href="https://app.humansignal.com/b/MjAz"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

<br>
<img src="/images/templates/object-detection-with-bounding-boxes.png" alt="" class="gif-border" width="552px" height="408px" />

<i>图 1：使用边界框进行目标检测。</i>

## 旋转与锚点

请注意，当你旋转矩形（边界框）时，根据旋转方式的不同，锚点也会不同。

### 在 Label Studio UI 中旋转边界框

如果你在标注界面中使用鼠标旋转边界框，旋转的锚点是矩形的**中心**。

![展示鼠标旋转的图示](../images/rectangle_ui_rotation.jpg)

### 在 Label Studio 结果中旋转边界框

如果你通过在标注界面的 **信息（Info）** 面板中直接编辑旋转角度来进行旋转，旋转锚点是矩形的**左上角**。这也是 Label Studio `annotation.result[]['value']` 中保存的方式（无论你以何种方式执行了旋转）：

```json
 { 
  "x": 50,  # 边界框左上角的 x 坐标，范围为图像宽度的 0 到 100%
  "y": 60,  # 边界框左上角的 y 坐标，范围为图像高度的 0 到 100%
  "width": 10,  # 边界框的宽度，范围为图像宽度的 0 到 100%
  "height": 20,  # 边界框的高度，范围为图像高度的 0 到 100%
  "rotation": 45  # 围绕边界框左上角旋转的的角度（单位：度）
}
```

![展示结果旋转的图示](../images/rectangle_db_rotation.jpg)

## 创建旋转边界框

作为标注人员，你可以使用「三点点击」或「两点点击」功能来创建旋转的边界框以标注图像。

  - 第一次点击 - 绘制边界框的起始位置点。
  - 第二次点击 - 确定边界框的旋转角度和宽度。
  - 第三次点击 - 绘制边界框的高度。

!!! note
    三点点击操作仅在使用了 `<Rectangle>` 标签时可用。对 `<RectangleLabels>` 不可用。

起始锚点 `0,0` 在第一次点击时放置，与基础边界框类似。第二个锚点将指示 `0,1` 边所在的角度以及边界框的宽度。第三个也是最后一个锚点 `1,1` 将确定边界框的高度或最终尺寸。创建一个旋转的边界框需要三次点击。

1. **绘制边界框的起始位置点**：选中标签并将鼠标移到画布上，点击以在画布上的任意位置放置第一个锚点 `0,0`。

!!! note 
    - 画布参考线会指示十字光标 x 轴和 y 轴的方向和位置。
    - 边界框标签指示正在画布中创建的框的顶部和中心位置。它不指示方向。

2. **确定边界框的旋转角度和宽度**：移动鼠标到放置第二个锚点的位置。

!!! note 
    画布参考线会显示光标所在的位置，并指示方向。

要完成框的顶边，请 `点击` 并 `松开` 以放置第二个光标。

3. **绘制边界框的高度**：再次移动光标以放置边界框的最终锚点并完成创建流程。此时，边界框的底边将跟随光标以显示高度。

4. **选择并旋转矩形**：现在，你可以在不移动光标的情况下选择并旋转矩形。

框创建完成后将保持选中状态，除非另有指定。


  <br>
  <div style="margin:auto; text-align:center;"><img src="/images/two-point-click.png" style="opacity: 0.8"/></div>
  <i>图 2：两点点击矩形。</i>

    
  <br>
  <div style="margin:auto; text-align:center;"><img src="/images/three-point-click.png" style="opacity: 0.8"/></div>
  <i>图 3：三点点击矩形。</i>

  创建边界框后，你可以执行以下操作： 
    - 通过将锚点或边缘移动到画布上的所需位置来调整它。
    - 确定边界框的方向是否受到影响。
    - 查看边界框的方向并在创建过程中确定方向。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签指定要标注的图像：
```xml
<Image name="image" value="$image"/>
```
  
使用 [RectangleLabels](/tags/rectanglelabels.html) 控制标签，同时为你的图像添加标签和矩形边界框。使用 [Label](/tags/label.html) 标签控制框的颜色：
```xml
  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>
```

## 增强此模板

### 为检测到的对象添加描述

如果你想为带边界框的目标检测任务添加更多上下文，可以在标注配置中添加一些**逐区域（per-region）**的条件标注参数。

例如，要提示标注人员为检测到的对象添加描述，可以在标注配置中添加以下内容：
```xml
  <View visibleWhen="region-selected">
    <Header value="Describe object" />
    <TextArea name="answer" toName="image" editable="true"
              perRegion="true" required="true" />
    <Choices name="choices" toName="image"
             perRegion="true">
      <Choice value="Correct"/>
      <Choice value="Broken"/>
    </Choices>
  </View>
```
[View](/tags/view.html) 标签的 `visibleWhen` 参数会向标注人员隐藏描述提示，直到选中某个边界框为止。

标注人员选中边界框后，[Header](/tags/header.html) 会出现并为标注人员提供说明。

[TextArea](/tags/textarea.html) 控制标签显示可编辑的文本框，应用于所选的边界框，由 `perRegion="true"` 参数指定。你还可以添加 `placeholder` 参数为标注人员提供建议文本。

此外，你可以使用带有 `perRegion` 参数的 [Choices](/tags/choices.html) 标签，提示标注人员提供关于边界框内容的额外反馈，例如框中物品的状态。

## 相关标签

- [Image](/tags/image.html)
- [RectangleLabels](/tags/rectanglelabels.html)
- [Rectangle](/tags/rectangle.html)
- [Label](/tags/label.html)
