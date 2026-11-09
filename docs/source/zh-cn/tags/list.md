---
title: List
type: tags
order: 305
meta_title: List 标签，用于显示同类项目，如文章、搜索结果等
meta_description: 通过显示任务数据中的同类项目来自定义 Label Studio，用于机器学习和数据科学项目。
---

`List` 标签用于显示同类项目的列表，如文章、搜索结果等。`value` 参数中的任务数据应为包含 `id`、`title`、`body` 和 `html` 字段的对象数组。

使用 `List` 比组合 Text 等其他标签要轻量得多。此外，你可以附加分类标签，以提供关于该列表的额外数据。

`List` 标签可与 `Ranker` 标签配合使用，对列表中的项目进行排序或挑选相关项目。
列表项可在 `Style` 标签中使用 `.htx-ranker-item` 类进行样式设置。

{% insertmd zh-cn/includes/tags/list.md %}

### 示例

可通过 Style 标签使用以下类名更改视觉外观

```html
<View>
  <Style>
    .htx-ranker-column { background: cornflowerblue; }
    .htx-ranker-item { background: lightgoldenrodyellow; }
  </Style>
  <List name="results" value="$items" title="Search Results" />
</View>
```
### 示例

List 标签的示例数据

```json
{
  "items": [
    { "id": "blog", "title": "10 tips to write a better function", "body": "There is nothing worse than being left in the lurch when it comes to writing a function!" },
    { "id": "mdn", "title": "Arrow function expressions", "body": "An arrow function expression is a compact alternative to a traditional function" },
    { "id": "wiki", "title": "Arrow (computer science)", "body": "In computer science, arrows or bolts are a type of class..." }
  ]
}
```
### 示例

List 标签的示例数据

```json
{
  "items": [
     { "id": "blog", "title": "Image 1", "html": "<img src='http://example.com/1.jpg'>" },
     { "id": "mdn", "title": "Image 2", "html": "<img src='http://example.com/2.jpg'>" }
   ]
}
```
