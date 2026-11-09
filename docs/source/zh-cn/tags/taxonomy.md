---
title: Taxonomy
type: tags
order: 426
meta_title: 用于层级标签的 Taxonomy 标签
meta_description: 使用 Taxonomy 标签自定义 Label Studio，为机器学习和数据科学项目使用层级标签。
---

`Taxonomy` 标签用于创建一个或多个层级分类，在结果中同时存储选项选择及其祖先。与 `Choice` 标签配合用于嵌套分类任务。

你可以使用 `Choice` 标签定义嵌套分类，或使用 `apiUrl` 参数检索外部分类。有关这些选项的更多信息，请参阅 [分类法模板页面](/templates/taxonomy)。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）。

{% insertmd zh-cn/includes/tags/taxonomy.md %}

### 示例

用于针对一段文本提供分类选项树的标注配置

```html
<View>
  <Taxonomy name="media" toName="text">
    <Choice value="Online">
      <Choice value="UGC" />
      <Choice value="Free" />
      <Choice value="Paywall">
        <Choice value="NY Times" />
        <Choice value="The Wall Street Journal" />
      </Choice>
    </Choice>
    <Choice value="Offline" />
  </Taxonomy>
  <Text name="text" value="You'd never believe what he did to the country" />
</View>
```
