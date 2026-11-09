---
title: 用于体育分析的边界框目标检测
type: templates
hide_menu: true
category: Computer Vision
cat: computer-vision
order: 1103
meta_description: 使用 Label Studio 通过矩形边界框执行体育分析目标检测的模板。
---

![标注界面截图](/images/templates-misc/sports-bbox.png)

带边界框标注的目标检测数据对于体育分析中的 AI 至关重要，因为它使模型能够准确跟踪球员动作、分析比赛策略并增强表现评估。这些模型依赖精确标注的数据集，在实时视频片段中识别球员、球和其他关键的比赛元素，从而帮助教练和分析师做出数据驱动的决策。

然而，体育分析中的数据标注存在重大挑战，包括任务的耗时性质、标注准确性的不一致，以及需要领域专业知识以确保对复杂运动动作的正确解读。Label Studio 通过一种将 AI 辅助预标注与人工专家验证相结合的创新混合方法来应对这些障碍。这实现了快速的初始标注，随后是简化的审查过程，确保标签达到高质量标准。我们可定制的模板和协作工具提升了标注人员效率，使团队能够有效扩展工作流。借助 Label Studio，你可以显著缩短标注时间，同时改善模型性能，使你的体育分析 AI 应用不仅可行，而且无可匹敌。

<a href="https://app.humansignal.com/b/NTM0"
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
    <Label value="Player" background="green"/>
    <Label value="Ball" background="blue"/>
    <Label value="Referee" background="orange"/>
    <Label value="Goalpost" background="purple"/>
    <Label value="Coach" background="red"/>
  </RectangleLabels>
</View>
```

所有标注配置都必须包裹在 <a href="https://labelstud.io/tags/view">View</a> 标签中。

使用 <a href="https://labelstud.io/tags/image">Image</a> 对象标签指定待标注的体育图像：

```xml
<Image name="image" value="$image"/>
```

使用 <a href="https://labelstud.io/tags/rectanglelabels">RectangleLabels</a> 控制标签，可同时向你的体育图像添加标签和矩形边界框。使用 <a href="https://labelstud.io/tags/label">Label</a> 标签控制框的颜色：

```xml
<RectangleLabels name="label" toName="image">
  <Label value="Player" background="green"/>
  <Label value="Ball" background="blue"/>
  <Label value="Referee" background="orange"/>
  <Label value="Goalpost" background="purple"/>
  <Label value="Coach" background="red"/>
</RectangleLabels>
```

如果你想为体育分析中带边界框的目标检测任务添加更多上下文，可以在标注配置中加入一些<strong>逐区域（per-region）</strong>条件标注参数。

例如，要提示标注人员为检测到的体育实体添加描述，可以在标注配置中添加以下内容：

```html
<View visibleWhen="region-selected">
  <Header value="Describe detected object" />
  <TextArea name="answer" toName="image" editable="true"
            perRegion="true" required="true" />
  <Choices name="choices" toName="image"
           perRegion="true">
    <Choice value="Active" />
    <Choice value="Injured" />
    <Choice value="Benched" />
  </Choices>
</View>
```

<a href="https://labelstud.io/tags/view">View</a> 标签的 <code>visibleWhen</code> 参数会将对描述提示的显示隐藏起来，直到选中某个边界框为止。

标注人员选中边界框后，<a href="https://labelstud.io/tags/header">Header</a> 会出现并为标注人员提供说明。

<a href="https://labelstud.io/tags/textarea">TextArea</a> 控制标签显示一个可编辑的文本框，应用于所选的边界框，由 <code>perRegion="true"</code> 参数指定。你还可以添加 <code>placeholder</code> 参数为标注人员提供建议文本。

此外，你可以通过带有 <code>perRegion</code> 参数的 <a href="https://labelstud.io/tags/choices">Choices</a> 标签，提示标注人员提供有关边界框内容的额外反馈，例如框内球员或物体的状态。
