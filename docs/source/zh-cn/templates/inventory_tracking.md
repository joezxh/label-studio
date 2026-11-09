---
title: 库存追踪
type: templates
category: Computer Vision
cat: computer-vision
order: 150
meta_title: 标注货架上的具体商品
meta_description: 
---

<!-- 对于库存追踪系统，你可以基于商品的视觉分析来标注库存物品。例如，如果你想基于一张可口可乐图像来标注商品货架，那么你可以开始在所选图像周围绘制标注。 -->

库存追踪系统允许你根据品牌名称（由相关的示例照片示意）来标注具体的商品。每个带有货架照片的任务都带有一个需要标注的关联品牌列表。
<br/>

<img src="/images/templates/inventory-tracking.png" alt="Inventory Tracking example" class="gif-border" width="552px" height="408px" />

## 标注配置

```xml
<View>
  <View style="display:flex;justify-content:center">
    <PolygonLabels name="objects" toName="image" value="$objects"/>
  </View>
  <Image name="image" value="$image"/>
</View>
```

我们来过一遍配置。`View` 仅用于布局目的。这里的关键点是 `PolygonLabels` 中的 `value`，它允许我们从任务数据中相关的数组为每个任务动态加载标签，每个条目对应一个 `Label`。数据中此类条目的每个参数都会作为生成的 `Label` 标签中的参数出现。

此外，`Label` 标签还有一个新的 `html` 参数，允许将富文本内容显示为标签。该内容应当进行 HTML 转义：
- `<` &rarr; `&lt;`
- `"` &rarr; `&quot;`
- `>` &rarr; `&gt;`
- 等等。

存储的值仍然来自 `value` 参数，该参数是必填的。

你也可以将通常的静态 `Label` 与动态标签结合使用在 `Labels` 标签内——静态标签会首先显示。

## 示例数据

我们使用了 `value=$objects`，因此应该在任务数据中设置 `objects` 字段，作为生成标签的来源，每个条目都包含此类标签的参数，这些参数对于每个标签可以不同，唯一的必填项是 `value`。`html` 内容应当进行字符串转义，因此此处最好使用单引号。

```json
{
  "data": {
    "image": "https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/shelf.jpeg",
    "objects": [{
      "value": "CocaCola",
      "html": "<img width='100' src='https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/cocacola.png'/>"
    }, {
      "value": "RedBull",
      "html": "<img width='100' src='https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/redbull.png'/>"
    }, {
      "value": "Burn",
      "html": "<img width='100' src='https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/burn.png'/>"
    }, {
      "value": "Breezer",
      "html": "<img width='100' src='https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/breezer.png'/>"
    }, {
      "value": "Monster",
      "html": "<img width='100' src='https://htx-pub.s3.amazonaws.com/templates/inventory-tracking/monster.png'/>"
    }]
  }
}
```
