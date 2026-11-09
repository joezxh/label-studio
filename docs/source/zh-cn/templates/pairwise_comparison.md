---
title: 两两分类
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 420
meta_title: 两两分类数据标注模板
meta_description: 用于使用 Label Studio 执行两两分类与比较任务的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/pairwise-classification.png" alt="" class="gif-border" width="552px" height="408px" />

使用本模板通过 Label Studio 对不同对象执行两两分类与比较。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Header>Select one of two items</Header>
  <Pairwise name="pw" toName="text1,text2" />
  <Text name="text1" value="$text1" />
  <Text name="text2" value="$text2" />
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header>Select one of two items</Header>
```

使用 [Pairwise](/tags/pairwise.html) 控制标签对两个文本样本应用两两选择：
```xml
<Pairwise name="pw" toName="text1,text2" />
```

使用 [Text](/tags/text.html) 对象标签指定两个名称不同的文本样本：
```xml
<Text name="text1" value="$text1" />
<Text name="text2" value="$text2" />
```

## 相关标签
- [Header](/tags/header.html)
- [Pairwise](/tags/pairwise.html)
- [Text](/tags/text.html)
