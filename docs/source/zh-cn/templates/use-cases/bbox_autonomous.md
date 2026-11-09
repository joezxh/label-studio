---
title: 用于自动驾驶车辆的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行自动驾驶车辆目标检测的模板。
---

![标注界面截图](/images/templates-misc/autonomous-vehicles.png)

在自动驾驶车辆领域，带有边界框标注的目标检测数据对于使 AI 模型实时准确地识别和分类行人、骑行者和交通标志等物体至关重要，从而确保安全的导航与决策。这些标签的精度直接影响 AI 模型的性能，因为任何不准确都可能导致不安全或次优的驾驶行为。

该领域的数据标注工作面临重大挑战：过程往往耗时费力、容易出现不一致，并且需要专业的领域知识以减少分类错误。Label Studio 通过集成 AI 辅助预标注来应对这些挑战，它加速了初始标注过程并减少了所需的手动工作量。预标注完成后，专家验证人员可以使用我们直观的协作工具来审查和精炼这些标注，确保高质量、一致的标签。此外，我们可定制的模板允许团队根据其特定需求调整标注界面，从而提高工作流效率和可扩展性。借助这些功能，组织可以显著缩短标注周期、提升专家生产力，并最终改善其 AI 模型的整体可靠性，从而实现更安全的自动驾驶解决方案。

<a href="https://app.humansignal.com/b/NTI5"
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
    <Label value="Pedestrian" background="orange"/>
    <Label value="Traffic Light" background="red"/>
    <Label value="Autonomous Car" background="blue"/>
    <Label value="Cyclist" background="green"/>
    <Label value="Road Sign" background="yellow"/>
  </RectangleLabels>
</View>
```

该标注配置将所有必要元素包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用这里的 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的传感器数据帧或图像。

<a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 标签允许你添加与图像帧绑定的矩形边界框，并为自动驾驶感知任务（如行人、交通灯、车辆及其他相关物体）分配有意义的标签。<a href="https://labelstud.io/tags/label">Label</a> 标签指定了标签名称以及用于边界框可视化的颜色。

```json
{
  "x": 50,  # 边界框左上角，取值为图像宽度的 0% 到 100%
  "y": 60,  # 边界框左上角，取值为图像高度的 0% 到 100%
  "width": 10,  # 边界框宽度，取值为图像宽度的 0% 到 100%
  "height": 20,  # 边界框高度，取值为图像高度的 0% 到 100%
  "rotation": 45  # 围绕边界框左上角的旋转角度（度）
}
```

当手动调整自动驾驶感知系统所检测物体的边界框时，旋转角度会以边界框左上角为参考点保存在生成的标注数据中。坐标 x 和 y 表示左上角，width 和 height 是相对于图像尺寸的百分比，rotation 指定了以度为单位的角向朝向，这有助于定义物体在帧中的姿态。

```html
<View visibleWhen="region-selected">
  <Header value="Describe detected object" />
  <TextArea name="answer" toName="image" editable="true"
            perRegion="true" required="true" placeholder="Add notes about object behavior or conditions..." />
  <Choices name="choices" toName="image"
           perRegion="true">
    <Choice value="Operational"/>
    <Choice value="Faulty"/>
    <Choice value="Occluded"/>
    <Choice value="Unknown"/>
  </Choices>
</View>
```

为了增强感知标注，你可以添加一个条件元素，在选中边界框时提示标注人员提供有关检测物体的额外上下文或描述。<code>visibleWhen</code> 属性确保描述字段仅在选中后才出现。

<a href="https://labelstud.io/tags/header">Header</a> 提供说明，而 <a href="https://labelstud.io/tags/textarea">TextArea</a> 让标注人员能够添加与检测物体相关的自由格式备注，例如环境条件或异常行为。

<a href="https://labelstud.io/tags/choices">Choices</a> 控制标签让标注人员指定检测物体的运行状态，例如它是否正常运行、被遮挡或存在故障，这对于自动驾驶系统的训练和验证至关重要。
