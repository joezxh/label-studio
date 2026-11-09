---
title: 关键点标注
type: templates
category: Computer Vision
cat: computer-vision
order: 120
meta_title: 图像关键点数据标注模板
meta_description: 用于使用 Label Studio 为图像添加关键点的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/keypoints.png" alt="" class="gif-border" width="552px" height="408px"/>

如果你想为人脸识别及其他使用场景识别特定的关键点，请使用本模板对图像执行关键点标注。

<a href="https://app.humansignal.com/b/MTk2"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <KeyPointLabels name="kp-1" toName="img-1">
    <Label value="Face" background="red" />
    <Label value="Nose" background="green" />
  </KeyPointLabels>
  <Image name="img-1" value="$img" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。


使用 [KeyPointLabels](/tags/keypointlabels.html) 控制标签来添加绘制带标签关键点的选项：
```xml
<KeyPointLabels name="kp-1" toName="img-1">
```
  
使用 [Label](/tags/label.html) 控制标签配合 KeyPointLabels，指定关键点的取值和颜色：
```xml
    <Label value="Face" background="red" />
    <Label value="Nose" background="green" />
</KeyPointLabels>
```

使用 [Image](/tags/image.html) 对象标签指定图像键：
```xml
  <Image name="img-1" value="$img" />
```

## 相关标签

- [KeyPointLabels](/tags/keypointlabels.html)
- [Image](/tags/image.html)
