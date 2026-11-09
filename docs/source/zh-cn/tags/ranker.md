---
title: Ranker
type: tags
order: 419
meta_title: Ranker 标签
meta_description: 使用 Ranker 标签对列表项进行排序。
---

你可以使用 `Ranker` 从 `List` 中选择相关项并对它们排序。你可以对它们进行排序以排定次序，或者将它们分入不同的桶中（使用嵌套的 `Bucket` 标签定义）。

与以下数据类型配合使用：[`List`](list)。

{% insertmd zh-cn/includes/tags/ranker.md %}

## List + Ranker

当你将 `List` 与 `Ranker`（且不使用桶）配合使用时，列表变为可交互，用户可以对项重新排序。

### 标注配置示例

你可以使用 `Style` 标签对 ranker 布局进行样式设置：

* `.htx-ranker-column` 用于列（桶）

* `.htx-ranker-item ` 用于项

```html
<View>
  <Style>
    .htx-ranker-column { background: cornflowerblue; }
    .htx-ranker-item { background: lightgoldenrodyellow; }
  </Style>
  <List name="results" value="$items" title="Search Results" />
  <Ranker name="rank" toName="results" />
</View>
```

### 示例输入数据

用作输入数据的示例列表：

```json
{
  "items": [
    { "id": "blog", "title": "10 tips to write a better function", "body": "There is nothing worse than being left in the lurch when it comes to writing a function!" },
    { "id": "mdn", "title": "Arrow function expressions", "body": "An arrow function expression is a compact alternative to a traditional function" },
    { "id": "wiki", "title": "Arrow (computer science)", "body": "In computer science, arrows or bolts are a type class..." }
  ]
}
```

### 示例结果

保存的结果是一个字典，包含一个键（Ranker 标签的名称）和一个值，该值是一个按新顺序排列的列表项 ID 数组。

在此示例中，标注员将 `"id": "mdn"` 的列表项移到顶部，将 `"id": "blog"` 移到底部。数据输出如下所示：

```json
[
  {
    "value": {
      "ranker": {
        "rank": [
          "mdn",
          "wiki",
          "blog"
        ]
      }
    },
    "id": "PpwBv_NMxd",
    "from_name": "rank",
    "to_name": "results",
    "type": "ranker",
    "origin": "manual"
  }
]
```

## List + Ranker + Buckets

当你将 `Ranker` 与嵌套的 `Bucket` 配合使用时，可以将列表项分入不同的桶类别中。

### 标注配置示例

有关添加样式的说明，请参阅 [上方示例](#Example-labeling-config)。

```html
<View>
  <List name="results" value="$items" title="Search Results" />
  <Ranker name="rank" toName="results">
    <Bucket name="best" title="Best results" />
    <Bucket name="ads" title="Paid results" />
  </Ranker>
</View>
```

### 示例输入数据

请参阅上方提供的 [示例列表](#Example-input-data)。

### 示例结果

保存的结果是一个字典，其中每个键是桶名称，每个值是该桶中的项 ID 数组，例如：

```json
[
  {
    "value": {
      "ranker": {
        "_": [
          "wiki"
        ],
        "best": [
          "mdn"
        ],
        "ads": [
          "blog"
        ]
      }
    },
    "id": "sjYK7Bcl7g",
    "from_name": "rank",
    "to_name": "results",
    "type": "ranker",
    "origin": "manual"
  }
]
```

注意，`"_"` 数组包含**未**被分入桶中的列表项。

你可以通过指定默认桶来改变此行为。请参阅下方示例。

### 默认桶

你可以通过将 `default="true"` 添加到桶的参数中来标记默认桶：

```html
<View>
  <List name="results" value="$items" title="Search Results" />
  <Ranker name="rank" toName="results">
    <Bucket name="best" title="Best results" default="true" />
    <Bucket name="ads" title="Paid results" />
  </Ranker>
</View>
```

这会实现两件事：

- 隐藏“Search Results”列（该列包含全部未排序的列表项）
- 将未排序的列表项放入默认桶中
  
这也会影响你的结果，使未排序的列表项存储在默认桶键下，例如：

```json
[
  {
    "value": {
      "ranker": {
        "best": [
          "mdn",
          "wiki"
        ],
        "ads": [
          "blog"
        ]
      }
    },
    "id": "8QaNxe4hN3",
    "from_name": "rank",
    "to_name": "results",
    "type": "ranker",
    "origin": "manual"
  }
]
```

## 相关模板

- [Visual Ranker](/templates/generative-visual-ranker)
- [RAG Retrieval](/templates/generative-llm-ranker)
