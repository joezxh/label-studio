---
title: Header
type: tags
order: 503
meta_title: 用于显示标题的 Header 标签
meta_description: 使用 Header 标签自定义 Label Studio，在标注任务中显示标题，用于机器学习和数据科学项目。
---

`Header` 标签用于在标注界面上显示标题。

{% insertmd zh-cn/includes/tags/header.md %}

### 示例

根据数据中的字段在标注界面上显示标题

```html
<View>
  <Header value="$text" />
</View>
```
### 示例

在标注界面上显示静态标题

```html
<View>
  <Header value="Please select the class" />
</View>
```
