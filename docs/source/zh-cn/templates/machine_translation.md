---
title: 机器翻译
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 225
meta_title: 机器翻译数据标注模板
meta_description: 用于使用 Label Studio 提供文本翻译的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/machine-translation.png" alt="" class="gif-border" width="552px" height="408px" />

如果你希望改进现有的机器翻译能力，你需要提供一个包含稳健且准确翻译示例的数据集。使用本模板阅读一种语言的文本并存储另一种语言的翻译。

<!--由于 LSF 版本过旧，移除交互式预览-->

## 标注配置

```html
<View>
  <View style="display: grid; grid-template: auto/1fr 1fr; column-gap: 1em">
    <Header value="Read the text in English" />
    <Header value="Provide translation in Spanish" />
  <Text name="english" value="$english" />
  <TextArea name="spanish" toName="english" transcription="true" 
            showSubmitButton="true" maxSubmissions="1" editable="true"
            required="true" rows="5"/>
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 View 标签上的样式将两段文本样本和标题并排放置：
```xml
<View style="display: grid; grid-template: auto/1fr 1fr; column-gap: 1em">
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Read the text in English" />
<Header value="Provide translation in Spanish" />
```

使用 Text 对象标签指定要翻译的文本：
```xml
<Text name="english" value="$english" />
```
  
使用 TextArea 控制标签提供一个可编辑的、必填的文本框，用于提供文本的翻译，并为标注人员包含一个提交按钮：
```xml
<TextArea name="spanish" toName="english" transcription="true" 
            showSubmitButton="true" maxSubmissions="1" editable="true"
            required="true" rows="5"/>
```

## 相关标签

- [View](/tags/view.html)
- [Header](/tags/header.html)
- [Text](/tags/text.html)
- [TextArea](/tags/textarea.html)
