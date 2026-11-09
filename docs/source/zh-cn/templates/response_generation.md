---
title: 回答生成
type: templates
category: Conversational AI
cat: conversational-ai
order: 801
meta_title: 回答生成数据标注模板
meta_description: 用于使用 Label Studio 在对话式 AI 使用场景中生成回答的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/response-generation.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个机器学习模型来为聊天机器人或其他对话式 AI 使用场景生成回答，请使用本模板来提供一段对话，并输入一个回答以创建训练数据集。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>  
  <Paragraphs name="chat" value="$dialogue" layout="dialogue" />
  <Header value="Provide response" />
  <TextArea name="response" toName="chat" rows="4" editable="true" maxSubmissions="1" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Paragraphs](/tags/paragraphs.html) 对象标签向标注人员显示对话：
```xml
<Paragraphs name="chat" value="$dialogue" layout="dialogue" />
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Provide response" />
```

使用 [TextArea](/tags/textarea.html) 控制标签为标注人员提供一个位置，以便针对聊天对话样本提供回答：
```xml
<TextArea name="response" toName="chat" rows="4" editable="true" maxSubmissions="1" />
```
`editable="true"` 参数允许标注人员编辑自己的回答，而 `maxSubmissions="1"` 确保标注人员只提供一个回答。

## 相关标签

- [Paragraphs](/tags/paragraphs.html)
- [Header](/tags/header.html)
- [TextArea](/tags/textarea.html)
