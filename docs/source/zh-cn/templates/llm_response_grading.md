---
title: LLM 回答评分
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 955
is_new: t
meta_description: 基于 LLM 回答符合内部指南的程度对其进行评分。
date: 2024-07-26 14:48:00
---

<img src="/images/templates/response-grading.png" alt="" class="gif-border" width="700px"/>

有时，根据生成文本的质量为 LLM 回答评分是很有用的。

在本示例中，你正在对 LLM 总结文档的能力进行评分。输入数据包含文档和摘要，然后你以 1 到 5 的量级对摘要进行评分。

有关如何将此模板与 Label Studio SDK 配合使用的教程，请参阅 [评估 LLM 回答](https://api.labelstud.io/tutorials/tutorials/evaluate-llm-responses)。

## 配置标注界面

[创建一个项目](/guide/setup_project) 并使用以下标注配置：

```xml
<View>
<Style>
  .root {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  }
  .container {
  display: flex;
  flex: 1;
  }
  .block {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  }
  .scrollable {
  overflow-y: auto;
  height: calc(100vh - 80px); /* Adjust height to accommodate header and footer */
  }
  .long-document {
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  }
  .short-summary {
  background-color: #f1f1f1;
  }
  .summary-rating {
  padding: 20px;
  background-color: #c3bcbc;
  border-top: 1px solid #ddd;
  text-align: center;
  }
  h2 {
  margin-top: 0;
  }
</Style>
<View className="root">
<View className="container">
  <View className="block long-document scrollable">
    <Header value="Long Document"/>
    <Text name="document" value="$document"/>
  </View>
  <View className="block short-summary">
    <Header value="Short Summary"/>
    <Text name="summary" value="$summary"/>
  </View>
</View>
<View className="summary-rating">
  <Header value="Rate the Document Summary:"/>
  <Rating name="rating" toName="summary" required="true"/>
</View>
</View>
</View>
```

该配置包含以下元素：

* `<View>` - 所有标注配置都必须包含基础的 `View` 标签。在此配置中，`View` 标签用于配置区块的显示，类似于 HTML 中的 div 标签。它有助于组织标注界面的布局。
* `<Style>` - `Style` 标签用于定义应用于 `View` 内部元素的 CSS 样式。在此配置中，它为标注界面布局的各个部分设置了样式。
* `<Header>` - `Header` 标签用于在标注界面内显示标题。它接受一个 value 属性来设置标题文本。例如，`<Header value="Long Document"/>` 会显示 "Long Document" 作为标题。
* `<Text>` - `Text` 标签用于显示输入数据提供的文本。根据下面的示例输入数据，文本块显示的是 JSON 中 `document` 或 `summary` 键的信息。你可能需要调整 value 以匹配你自己的 JSON 结构。
* `<Rating>` - 这会显示星级图标，可用于为摘要评分。你可以自定义此标签的属性来更改最高评分。

## 输入数据

使用上述配置，你需要将输入数据结构化为包含 `document` 和 `summary` 元素。例如：

```json
[
  {
    "data": {
      "document": [
        "Opossums, commonly known as possums in North America, are marsupials found primarily in the Americas. The most well-known species is the Virginia opossum (Didelphis virginiana), which ranges from Central America and the eastern United States to southern Canada. These adaptable creatures are known for their ability to thrive in a variety of environments, including both rural and urban areas. Opossums are also found in South America, where different species inhabit a range of ecosystems, from tropical rainforests to temperate forests.",
        "Opossums are highly adaptable in terms of habitat, often residing in woodlands, farmland, and even suburban backyards. They typically seek shelter in hollow trees, abandoned burrows, or any dark, enclosed space they can find. Opossums are nocturnal and omnivorous, with a diet that includes fruits, insects, small animals, and even carrion. Their opportunistic feeding habits contribute to their resilience and ability to live in close proximity to human settlements.",
        "In terms of behavior, opossums are solitary and nomadic, often moving to different locations in search of food. They are known for their unique defense mechanism of 'playing dead' or 'playing possum' when threatened, which involves mimicking the appearance and smell of a sick or dead animal to deter predators. Opossums have relatively short lifespans, typically living only 2 to 4 years in the wild. Despite their short lives, they reproduce quickly, with females giving birth to large litters of up to 20 young, although not all offspring typically survive to maturity.",
        "In popular culture, opossums often appear as symbols of resilience and survival due to their hardy nature and ability to adapt to various environments. They are sometimes depicted in a comical or misunderstood light, given their nocturnal habits and somewhat disheveled appearance. Despite this, they play a crucial role in the ecosystem by controlling insect and rodent populations and cleaning up carrion. Opossums have been featured in various forms of media, from cartoons and children's books to movies, often emphasizing their unique behaviors and survival strategies."
      ],
      "summary": "Opossums, primarily found in the Americas, are adaptable marsupials known for thriving in diverse environments, from rural to urban areas. They are nocturnal and omnivorous, often seeking shelter in dark, enclosed spaces and employing a unique defense mechanism of 'playing dead' to deter predators. In popular culture, opossums symbolize resilience and survival, playing a crucial role in ecosystems by controlling insect and rodent populations and cleaning up carrion."
    }
  }
]
```

## 相关标签

- [View](/tags/view.html)
- [Style](/tags/style.html)
- [Header](/tags/header.html)
- [Text](/tags/text.html)
- [Rating](/tags/rating.html)
