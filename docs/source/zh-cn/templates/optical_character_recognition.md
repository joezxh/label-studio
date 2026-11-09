---
title: 光学字符识别（OCR）
type: templates
category: Computer Vision
cat: computer-vision
order: 125
meta_title: 光学字符识别（OCR）数据标注模板
meta_description: 用于使用 Label Studio 执行光学字符识别数据标注任务的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/optical-character-recognition.png" alt="" class="gif-border" width="552px" height="408px" />

使用图像上的多种形状执行光学字符识别（OCR）任务。使用本模板识别区域形状，并转写图像特定区域的关联文本。

<a href="https://app.humansignal.com/b/MjAx"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

<!--由于 playground 中 LSF 版本过旧导致交互式模板不可用，故移除-->

## 标注配置

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="Text" background="green"/>
    <Label value="Handwriting" background="blue"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Recognized Text"
            displayMode="region-list"
            />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签指定要标注的图像：
```xml
<Image name="image" value="$ocr"/>
```

使用 [Labels](/tags/labels.html) 控制标签指定可应用于图像上不同形状的标签：
```xml
<Labels name="label" toName="image">
    <Label value="Text" background="green"/>
    <Label value="Handwriting" background="blue"/>
</Labels>
```
你可以更改每个 `Label` 的 `value`，为 OCR 任务中的不同区域分配不同的标签，例如 "Letters"（字母）和 "Numbers"（数字）等。

使用 [Rectangle](/tags/rectangle.html) 控制标签添加不带标签的矩形：
```xml
<Rectangle name="bbox" toName="image" strokeWidth="3"/>
```
使用 Rectangle 标签而不是 [RectangleLabels](/tags/rectanglelabels.html) 标签，意味着你可以让标注人员分三步执行 OCR 标注：首先创建区域来高亮文本，然后将标签与每个区域关联，最后转写每个区域的文本。这也使得为 OCR 任务添加预标注更加容易。

使用 [Polygon](/tags/polygon.html) 控制标签添加不带标签的多边形：
```xml
<Polygon name="poly" toName="image" strokeWidth="3"/>
```
`strokeWidth` 参数控制多边形轮廓线的宽度。

使用 [TextArea](/tags/textarea.html) 控制标签为图像上绘制的每个区域（无论是矩形还是多边形）添加转写文本：
```xml
<TextArea name="transcription" toName="image"
            editable="true"
            perRegion="true"
            required="true"
            maxSubmissions="1"
            rows="5"
            placeholder="Recognized Text"
            displayMode="region-list"
            />
```
`editable="true"` 参数允许标注人员在提交后编辑文本，`displayMode="region-list"` 表示文本框出现在与每个矩形或多边形关联的区域内列表中，以便于更新文本。`perRegion="true"` 表示每个文本框应用于一个特定区域，`required="true"` 表示标注人员必须在提交标注前为每个文本框添加文本。`placeholder` 参数让你可以指定在标注人员编辑文本框之前显示的占位文本。

## 关于标注流程

1. 选择一个标签（例如 "Handwriting"（手写）），创建一个新的边界框并选中它。
2. 如果大纲（Outliner）面板尚未打开，请打开它。通常它位于左侧。
3. 为每个边界框添加文本。否则，你会收到关于缺失文本的警告，因为标注配置使用了 `required="true"`。

<img src="/images/ocr-template-left-panel.png" class="gif-border">

## 相关标签
- [Image](/tags/image.html)
- [Labels](/tags/labels.html)
- [Rectangle](/tags/rectangle.html)
- [Polygon](/tags/polygon.html)
- [TextArea](/tags/textarea.html)
