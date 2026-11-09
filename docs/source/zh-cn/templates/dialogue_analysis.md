---
title: 对话分析
type: templates
category: Conversational AI
cat: conversational-ai
order: 815
meta_title: 对话分析数据标注模板
meta_description: 用于针对对话式 AI 使用场景在 Label Studio 中执行对话分析的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/dialogue-analysis.png" alt="" class="gif-border" width="600px" height="512px" />

如果你想评估并分析一段已发生对话中出现的回答，并（可选）对其进行修正，请使用本模板。

使用本模板提供一段对话并对其进行分类。随后标注人员为该段对话提供最佳回答。

## 交互式模板预览

<div id="main-preview"></div>


## 标注配置

```html
<View>
  <HyperText name="dialog" value="$dialogs"></HyperText>
  <Header value="Rate last answer:"></Header>
  <Choices name="chc-1" choice="single-radio" toName="dialog" showInline="true">
    <Choice value="Bad answer"></Choice>
    <Choice value="Neutral answer"></Choice>
    <Choice value="Good answer"></Choice>
  </Choices>
  <Header value="Your answer:"></Header>
  <TextArea name="answer"></TextArea>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [HyperText](/tags/hypertext.html) 对象标签显示对话数据，这些数据以 Label Studio 的 JSON 格式导入，使用 `"dialogs"` 作为键：
```xml
<HyperText name="dialog" value="$dialogs"></HyperText>
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Rate last answer:"></Header>
```

使用 [Choices](/tags/choices.html) 控制标签配合 [Choice](/tags/choice.html) 标签，让标注人员对对话回答进行分类。使用相关参数来控制选项在界面上的显示方式：
```xml
<Choices name="chc-1" choice="single-radio" toName="dialog" showInline="true">
    <Choice value="Bad answer"></Choice>
    <Choice value="Neutral answer"></Choice>
    <Choice value="Good answer"></Choice>
</Choices>
```
你可以修改 choice 的 `value` 值，以提供更多不同的分类选项。

使用 [TextArea](/tags/textarea.html) 控制标签为标注人员提供一个自由文本输入框，以提交他们自己对对话的回答。添加 `editable=true` 参数可以让他们编辑自己的回答，或添加 `required=true` 参数以强制标注人员提供一个替代回答：
```xml
<TextArea name="answer"></TextArea>
```


## 相关标签

- [HyperText](/tags/hypertext.html)
- [Choices](/tags/choices.html)
- [TextArea](/tags/textarea.html)
