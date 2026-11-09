---
title: Filter
type: tags
order: 502
meta_title: 用于筛选搜索的 Filter 标签
meta_description: 使用 Filter 标签自定义 Label Studio，筛选标签以加速机器学习和数据科学项目的标注。
---

使用 Filter 标签为大量标签或选项添加筛选搜索。与 Labels 标签或 Choices 标签配合使用。

{% insertmd zh-cn/includes/tags/filter.md %}

### 示例

为命名实体识别任务的标签添加筛选器

```html
<View>
  <Filter name="filter" toName="ner"
          hotkey="shift+f" minlength="0"
          placeholder="Filter" />
  <Labels name="ner" toName="text" showInline="false">
    <Label value="Person" />
    <Label value="Organization" />
  </Labels>
  <Text name="text" value="$text" />
</View>
```
