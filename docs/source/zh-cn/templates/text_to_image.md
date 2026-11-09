---
title: 文本生成图像
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 431
meta_title: 根据文本描述选择最相关的生成图像
meta_description: 
---

基于自然语言提示词，你可以生成一组图像并从中进行选择。
<br/>

<img src="/images/templates/text-to-image.png" alt="文本生成图像示例" class="gif-border" width="552px" height="408px" />

## 标注配置

```xml
  <View>
    <View className="ch-title">
      <Text name="prompt" value="$prompt"/>
    </View>
    <View className="highlight">
      <Choices name="images" toName="prompt" value="$images" choice="multiple" layout="inline"/>
    </View>
    <Style>
    .ch-title {
      font-size: 2em;
      text-align: center;
    }
    .ch-title .lsf-richtext__line:before {
      display: none;
    }
    .highlight .ant-checkbox {
      position: absolute;
      opacity: 0;
    }
    .ant-checkbox+span {
      border: 4px solid transparent;
      border-radius: 8px;
      padding: 8px;
    }
    .ant-checkbox-checked+span {
      border-color: var(--color-primary-border-subtle);
    }
    .ant-checkbox+span sup {
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 2;
      display: block;
      width: 24px;
      line-height: 16px;
      text-align: center;
    }
    </Style>
  </View>
```

## 示例数据

```json
{"data": {
  "prompt": "An astronaut riding a horse in a photorealistic style",
  "images": [{
    "value": "id123#0",
    "style": "margin: 5px",
    "html": "<img width='400' src='https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/0.jpg'/>"
  },
  {
    "value": "id123#1",
    "style": "margin: 5px",
    "html": "<img width='400' src='https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/1.jpg'/>"
  },
  {
    "value": "id123#2",
    "style": "margin: 5px",
    "html": "<img width='400' src='https://cdn.openai.com/dall-e-2/demos/text2im/astronaut/horse/photo/2.jpg'/>"
  }]
}}
```
