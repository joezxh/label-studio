---
title: ASR Hypotheses Selection
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 435
meta_title: 选择最准确的自动语音识别（ASR）候选文本
meta_description: 用于在多个语音转写候选文本中选择最准确的一个的模板。
---

当你使用自动语音转写器时，会得到多个转写候选文本。现在，你可以从转写候选文本列表中选择其中一个变体。
<br/>

<img src="/images/templates/asr-hypotheses.png" alt="ASR Hypotheses Selection example" class="gif-border" width="552px" height="408px" />

## 标注配置

```xml
<View>
  <Audio name="audio" value="$audio"/>
  <Choices name="transcriptions" toName="audio" value="$transcriptions" selection="highlight"/>
  <Style>
    .lsf-choice__item {
      padding: var(--spacing-tighter) var(--spacing-tight);
      box-shadow: 0 2px 4px rgba(var(--color-neutral-shadow-raw) / calc(16% * var(--shadow-intensity))) ;
      background-color: var(--color-neutral-background);
      border-radius: var(--corner-radius-small);
      margin: 0 var(--spacing-tighter) var(--spacing-tighter) var(--spacing-tighter);
      line-height: 1.6rem;
      transition: all 150ms ease-out;
    }
    
    .lsf-choice__item:hover {
      background-color: var(--color-primary-emphasis-subtle);
    }
  </Style>
</View>
```

## 示例数据

```json
{
  "data": {
    "audio": "https://htx-pub.s3.amazonaws.com/datasets/audio/f2btrop6.0.wav",
    "transcriptions": [{
      "value": "potrostith points out that if school based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "potrostith points out that if school-based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "purporting points out that if school based clinics were established parental permission would be required for students to receive each service offered"
    }, {
      "value": "pork roasted points out that if school based clinics were establish parental permission would be required for students to receive each service offered"
    }, {
      "value": "purpose it points out that if school based clinics war establish parental permission would be required for students to receive each service offered"
    }]
  }
}
```
