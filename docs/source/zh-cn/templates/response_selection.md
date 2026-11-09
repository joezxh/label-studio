---
title: 回答选择
type: templates
category: Conversational AI
cat: conversational-ai
order: 805
meta_title: 回答选择数据标注模板
meta_description: 用于使用 Label Studio 在对话式 AI 使用场景中筛选相关回答的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/response-selection.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想精炼出对话式 AI 使用场景中最佳的回答，可以向标注人员提供已经生成好的回答，让他们从中选择最好的一个。

使用本模板来提供一段对话以及针对该对话的三个文本回答。随后标注人员选择与最合适文本回答相对应的选项。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>  
  <Paragraphs name="prg" value="$dialogue" layout="dialogue" />
  <Header value="Choose a response" />
  <View style="display: flex">
    <View>
    <Text name="resp1" value="$respone" />
    <Text name="resp2" value="$resptwo" />
    <Text name="resp3" value="$respthree" />
    </View>
    <View style="padding: 50px;">
    <Choices name="resp" toName="prg" required="true">
      <Choice value="One" />
      <Choice value="Two" />
  	  <Choice value="Three" />
    </Choices>
    </View>
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Paragraphs](/tags/paragraphs.html) 对象标签向标注人员显示对话：
```xml
<Paragraphs name="prg" value="$dialogue" layout="dialogue" />
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Choose a response" />
```

使用一个新的 [View](/tags/view.html) 标签来控制文本和选择在标注界面上的显示：
```xml
  <View style="display: flex">
```

使用 [Text](/tags/text.html) 对象标签显示 3 个不同的文本样本，由 `value` 参数中的变量指定：
```xml
<View>
    <Text name="resp1" value="$respone" />
    <Text name="resp2" value="$resptwo" />
    <Text name="resp3" value="$respthree" />
</View>
```

对包裹选项的 [View](/tags/view.html) 标签进行样式设置，以确保文本样本与相应选项之间留有空间：
```xml
    <View style="padding: 50px;">
    <Choices name="resp" toName="prg" required="true">
      <Choice value="One" />
      <Choice value="Two" />
  	  <Choice value="Three" />
    </Choices>
    </View>
```
使用 [Choices](/tags/choices.html) 控制标签让标注人员选择哪个文本样本是对该对话的最佳回答。

## 相关标签

- [Paragraphs](/tags/paragraphs.html)
- [Header](/tags/header.html)
- [View](/tags/view.html)
- [Text](/tags/text.html)
- [Choices](/tags/choices.html)
