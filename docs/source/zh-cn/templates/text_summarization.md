---
title: 文本摘要
type: templates
category: Natural Language Processing
cat: natural-language-processing
order: 220
meta_title: 文本摘要数据标注模板
meta_description: 使用 Label Studio 对文本进行摘要的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/text-summarization.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个对文本进行摘要的机器学习模型，请使用本模板创建一个由文本样本一句话摘要组成的数据集。你也可以自定义本模板，以要求不同种类或长度的摘要。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header value="Please read the text" />
  <Text name="text" value="$text" />
  <Header value="Provide one sentence summary" />
  <TextArea name="answer" toName="text"
            showSubmitButton="true" maxSubmissions="1" editable="true"
            required="true" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Please read the text" />
```

使用 [Text](/tags/text.html) 对象标签显示文本：
```xml
<Text name="text" value="$text" />
```

使用 [TextArea](/tags/textarea.html) 控制标签提供一个带提交按钮的文本框，标注人员必须在其中输入摘要，并且可以编辑自己的回答：
```xml
  <TextArea name="answer" toName="text"
            showSubmitButton="true" maxSubmissions="1" editable="true"
            required="true" />
```

## 增强此模板

你可以通过多种方式增强此模板。

### 将文本框显示在待摘要文本旁边

如果你希望将文本框显示在待摘要文本旁边，请执行以下操作：

1. 为标注配置的 [View](/tags/view.html) 标签添加 flex 显示样式：`<View style="display: flex;">`
2. 添加新的 [View](/tags/view.html) 标签来包裹 [Header](/tags/header.html) 和 [Text](/tags/text.html) 样本，使它们显示在左侧。
3. 用带有以下 CSS 样式的 [View](/tags/view.html) 标签包裹 [TextArea](/tags/textarea.html) 和 [Header](/tags/header.html) 标签，使它们整齐地显示在右侧：
```xml
<View style="width: 50%; padding-right: 2em; margin-left: 2em;">
```
完整增强后的标注配置如下所示：
```xml
<View style="display: flex;">
  <View>
    <Header value="Please read the text" />
    <Text name="text" value="$text" />
  </View>
  <View style="width: 50%; padding-right: 2em; margin-left: 2em;">
    <Header value="Provide one sentence summary" />
    <TextArea name="answer" toName="text"
              showSubmitButton="true" maxSubmissions="1" editable="true"
              required="true" />
  </View>
```

### 使用滚动条显示长文本样本

如果你想改变 Label Studio 在标注界面上显示长文本样本的方式，可以使用 [View](/tags/view.html) 标签配合 CSS 样式包裹标注标签。

例如，你可以将文本样本限制在特定高度，从而更容易保持标注人员提供的文本摘要可见。
```xml
<View style="height: 300px; overflow: auto;">
    <Text name="text" value="$longText" />
</View>
```

在这种情况下，完整的标注配置如下所示：
```xml
<View>
  <Header value="Please read the text" />
  <View style="height: 300px; overflow: auto;">
    <Text name="text" value="$longText" />
  </View>
  <Header value="Provide one sentence summary" />
  <TextArea name="answer" toName="text" 
            showSubmitButton="true" maxSubmissions="1" editable="true" 
            required="true" />
</View>
```

## 相关标签

- [Header](/tags/header.html)
- [Text](/tags/text.html)
- [TextArea](/tags/textarea.html)
