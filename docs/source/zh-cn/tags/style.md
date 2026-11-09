---
title: Style
type: tags
order: 505
meta_title: 用于使用 CSS 样式的 Style 标签
meta_description: 使用 CSS 样式自定义 Label Studio，以修改机器学习和数据科学项目的标注界面。
---

`Style` 标签与 View 标签配合使用，向标注界面应用自定义 CSS 属性。有关可引用的全部可用属性列表，请参阅 MDN 页面上的 [CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)。你也可以调整 Label Studio 的默认 CSS 类。使用浏览器开发者工具检查界面上的元素并找到类名，然后在 `Style` 标签中指定该类名。

{% insertmd zh-cn/includes/tags/style.md %}

### 示例

使用 CSS 样式让标注界面上的标题以红色背景显示

```html
<View>
  <Style> .cls-name { background: red; }</Style>
  <View className="cls-name">
    <Header value="Header" />
  </View>
</View>
```
### 示例

在任务未设置样式时，使用 CSS 样式让标题居中显示并带有蓝色虚线边框

```html
<View>
  <Style> .fancy-border { border: 4px dotted blue; text-align: center; }</Style>
  <View className="fancy-border">
    <Header value="Greatest Task Header of All Time" />
  </View>
  <View>
    <Text name="text" value="$value"/>
    <Choices name="other" toName="text" choice="single">
      <Choice value="Other"/>
      <Choice value="Other2"/>
    </Choices>
  </View>
</View>
```
### 示例

使用 CSS 样式为文本分类任务包裹绿色虚线边框（35px 内边距），为所有文本添加绿色阴影，并使所有文本居中对齐

```html
<View>
<Style> .fancy-choices { outline: 5px dotted green; padding: 35px; text-shadow: 2px 2px green; text-align: center; } </Style>
  <View className="fancy-choices">
    <Text name="text" value="$value"/>
    <Choices name="other" toName="text" choice="single">
      <Choice value="Other"/>
       <Choice value="Other2"/>
    </Choices>
  </View>
</View>
```
### 示例

调整 Label Studio 的默认 CSS 样式，让每个单选按钮选项都被绿色实线边框包围

```html
<View>
<Style>
  .ant-radio-wrapper {border: 2px solid green;}
</Style>
<Choices name="chc" toName="text" choice="single-radio">
  <Choice value="First Choice"/>
  <Choice value="Second Choice"/>
</Choices>
<Text name="text" value="$text"/>
</View>
```
