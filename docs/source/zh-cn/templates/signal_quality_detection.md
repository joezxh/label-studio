---
title: 信号质量检测
type: templates
category: Audio/Speech Processing
cat: audio-speech-processing
order: 315
meta_title: 信号质量检测数据标注模板
meta_description: 用于使用 Label Studio 检测音频信号质量的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/signal-quality-detection.png" alt="" class="gif-border" width="552px" height="408px" />

对音频片段中某个已定义信号的质量进行评分，例如，在开发用于从嘈杂酒吧中分离语音，或从音频片段中去除其他噪声的机器学习模型时。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Rating name="rating" toName="audio" maxRating="10" icon="star" size="medium" />
  <Audio name="audio" value="$audio"/>
</View>
```

## 关于此标注配置
所有标注配置都必须包裹在 [`View`](/tags/view.html) 标签中。

使用 [Rating](/tags/rating.html) 控制标签向标注人员显示 10 星评分量表：
```xml
<Rating name="rating" toName="audio" maxRating="10" icon="star" size="medium" />
```
由于 Rating 标签出现在 Audio 标签之前，评分量表会显示在标注界面中音频片段之前。

使用 [Audio](/tags/audio.html) 对象标签提供音频片段的基本播放功能：
```xml
<Audio name="audio" value="$audio"/>
```

## 相关标签
- [Rating](/tags/rating.html)
- [Audio](/tags/audio.html)
