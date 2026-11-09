---
title: View
type: tags
order: 506
meta_title: 用于定义区块显示方式的 View 标签
meta_description: 在 Label Studio 中自定义标注界面上区块的显示方式，用于机器学习和数据科学项目。
---

`View` 元素用于配置区块的显示，类似于 HTML 中的 div 标签。

{% insertmd zh-cn/includes/tags/view.md %}

### 示例

在标注界面上创建两个可伸缩、各占屏幕宽度 50% 的卡片

```html
<View style="display: flex;">
  <!-- 左侧 -->
  <View style="flex: 50%">
    <Header value="Facts:" />
    <Text name="text" value="$fact" />
  </View>
  <!-- 右侧 -->
  <View style="flex: 50%; margin-left: 1em">
    <Header value="Enter your question:" />
    <TextArea name="question" />
  </View>
</View>
```
### 示例
```html
<View>
  <Text name="text" value="$text"/>
  <Choices name="sentiment" toName="text">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Choices>
  <!-- 仅在选中 Positive 或 Negative 时显示 -->
  <View visibleWhen="choice-selected" whenTagName="sentiment"
        whenChoiceValue="Positive,Negative">
    <Header value="Why?"/>
    <TextArea name="why_positive" toName="text"/>
  </View>
</View>
```
### 示例
```html
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>
  <Text name="text" value="$text"/>
  <!-- 仅在选中区域 PER 或 ORG 时显示 -->
  <View visibleWhen="region-selected" whenLabelValue="PER,ORG">
    <Header value="yoho"/>
  </View>
</View>
```
