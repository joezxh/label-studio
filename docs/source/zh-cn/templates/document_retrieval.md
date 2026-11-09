---
title: 文档检索
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 430
meta_title: 文档检索数据标注模板
meta_description: 用于为文档检索任务标注文档的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/document-retrieval.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想开始训练文档检索或推荐模型，你可能需要构建一个能够识别相似文档的数据集。使用本模板来识别并选择与一个特定查询或现有文档相关的文档。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Text name="query" value="$query" />
  <Header value="Select document related to the query:" />
  <View style="display: flex">
    <View>
    <Text name="text1" value="$text1" />
    <Text name="text2" value="$text2" />
    <Text name="text3" value="$text3" />
    </View>
    <View style="padding: 30px">
    <Choices name="selection" toName="query" required="true" choice="multiple">
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

使用 [Text](/tags/text.html) 对象标签指定要标注的文本数据：
```xml
<Text name="query" value="$query" />
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Select document related to the query:" />
```  

为 [View](/tags/view.html) 标签添加样式，以控制文本样本和选项的显示外观：
```xml
<View style="display: flex">
```

将文本片段包裹在一个新的 [View](/tags/view.html) 标签中，并使用 [Text](/tags/text.html) 对象标签显示另外 3 个文本片段：
```xml
<View>
    <Text name="text1" value="$text1" />
    <Text name="text2" value="$text2" />
    <Text name="text3" value="$text3" />
</View>
```
    
为另一个 [View](/tags/view.html) 标签添加样式，将选项放在文本样本旁边，然后使用 [Choices](/tags/choices.html) 控制标签要求标注人员进行选择，并允许他们选择多个适用的文本片段：
```xml
<View style="padding: 30px">
    <Choices name="selection" toName="query" required="true" choice="multiple">
      <Choice value="One" />
      <Choice value="Two" />
  	  <Choice value="Three" />
    </Choices>
</View>
```

## 相关标签

- [Text](/tags/text.html)
- [View](/tags/view.html)
- [Choices](/tags/choices.html)
