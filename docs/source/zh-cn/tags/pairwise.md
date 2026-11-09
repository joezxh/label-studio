---
title: Pairwise
type: tags
order: 415
meta_title: 用于比较对象的 Pairwise 标签
meta_description: 使用 Pairwise 标签自定义 Label Studio，用于机器学习和数据科学项目的对象比较任务。
---

`Pairwise` 标签用于比较两个不同的对象并从列表中选择一项。如果你希望标注员比较两个对象并判断它们是否相似，请使用 `Choices` 标签。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）。

{% insertmd zh-cn/includes/tags/pairwise.md %}

### 示例

用于比较两段文本的基础标注配置

```html
<View>
  <Header value="Select the more accurate summary"/>
  <Pairwise name="pairwise" leftClass="text1" rightClass="text2" toName="txt-1,txt-2"></Pairwise>
  <Text name="txt-1" value="Text 1" />
  <Text name="txt-2" value="Text 2" />
</View>
```
### 示例

你也可以使用 View 标签设置外观：

```html
<View>
  <Pairwise name="pw" toName="txt-1,txt-2"></Pairwise>
  <View style="display: flex;">
    <View style="margin-right: 1em;"><Text name="txt-1" value="$text1" /></View>
    <View><Text name="txt-2" value="$text2" /></View>
  </View>
</View>
```
