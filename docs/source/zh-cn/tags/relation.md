---
title: Relation
type: tags
order: 423
meta_title: 用于单个关系的 Relation 标签
meta_description: 使用 Relation 标签自定义 Label Studio，为机器学习和数据科学项目中区域之间的关系添加单一一致的标签。
---

`Relation` 标签表示一个单独的关系标签。与 `Relations` 标签配合使用，以指定要应用于区域之间关系的标签值。

{% insertmd zh-cn/includes/tags/relation.md %}

### 示例

用于为两段已标注文本区域之间识别出的关系应用 "similar" 标签的基础标注配置

```html
<View>
  <Relations>
    <Relation value="similar" />
  </Relations>

  <Text name="txt-1" value="$text" />
  <Labels name="lbl-1" toName="txt-1">
    <Label value="Relevant" />
    <Label value="Not Relevant" />
  </Labels>
</View>
```
