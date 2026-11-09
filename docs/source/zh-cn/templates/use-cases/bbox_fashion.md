---
title: 用于时尚零售的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行时尚零售目标检测的模板。
---

![标注界面截图](/images/templates-misc/fashion.png)

带边界框的目标检测对于时尚零售中的 AI 至关重要，它使模型能够准确识别和分类图像中的各类服装单品。通过成功检测商品，AI 可以显著增强库存管理、视觉搜索和个性化推荐等任务，从而推动销售并改善客户体验。

然而，时尚零售的数据标注过程充满挑战，包括耗时的标注任务、大型数据集间的一致性问题，以及需要具备时尚术语和风格方面的领域专业知识。Label Studio 通过其混合 AI 辅助预标注功能有效应对这些挑战，它加速了初始标注过程并改善了一致性。该平台还集成了专家验证，确保保持高质量的标注。借助促进标注人员与审查人员之间无缝协作的协作工具，以及专为时尚应用定制的可定制模板，Label Studio 提升了标注效率并支持可扩展的工作流，最终为时尚 AI 解决方案带来更高的模型性能和更快的上市时间。

<a href="https://app.humansignal.com/b/NTMx"
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
    <Label value="T-Shirt" background="coral"/>
    <Label value="Jeans" background="royalblue"/>
    <Label value="Jacket" background="seagreen"/>
    <Label value="Sneakers" background="orange"/>
    <Label value="Hat" background="purple"/>
  </RectangleLabels>
</View>
```
标注配置必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 标签指定你想要标注的时尚图像：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 标签，可同时向你的时尚产品图像添加标签和矩形边界框。<a href="https://labelstud.io/tags/label">Label</a> 标签控制每个边界框的颜色：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="T-Shirt" background="coral"/>
  <Label value="Jeans" background="royalblue"/>
  <Label value="Jacket" background="seagreen"/>
  <Label value="Sneakers" background="orange"/>
  <Label value="Hat" background="purple"/>
</RectangleLabels>
```

如果你旋转边界框，保存的 JSON 会表明旋转是围绕左上角进行的，无论旋转在标注界面中是如何执行的：

```json
{
  "x": 50,  # 边界框左上角，取值为图像宽度的 0% 到 100%
  "y": 60,  # 边界框左上角，取值为图像高度的 0% 到 100%
  "width": 10,  # 边界框宽度，取值为图像宽度的 0% 到 100%
  "height": 20,  # 边界框高度，取值为图像高度的 0% 到 100%
  "rotation": 45  # 围绕边界框左上角的旋转角度（度）
}
```

你可以通过三次点击在时尚单品上创建旋转边界框：
- 第一次点击设置边界框的起始位置。
- 第二次点击定义旋转角度和宽度。
- 第三次点击设置框的高度。

这样可以对倾斜的服装或配饰进行精确标注。

下面是一个配置示例，让标注人员额外描述每个检测到的时尚单品并指定其状况：

```html
<View visibleWhen="region-selected">
  <Header value="Describe the fashion item" />
  <TextArea name="description" toName="image" editable="true" perRegion="true" required="true" placeholder="Enter details about the clothing or accessory here..." />
  <Choices name="condition" toName="image" perRegion="true">
    <Choice value="New"/>
    <Choice value="Used"/>
    <Choice value="Defective"/>
  </Choices>
</View>
```
<code>visibleWhen</code> 属性会将该面板隐藏，直到选中某个边界框为止。

<a href="https://labelstud.io/tags/header">Header</a> 为标注人员提供清晰的说明，<a href="https://labelstud.io/tags/textarea">TextArea</a> 收集每个边界框的描述性细节，而 <a href="https://labelstud.io/tags/choices">Choices</a> 标签则捕获边界框内时尚单品的状况。
