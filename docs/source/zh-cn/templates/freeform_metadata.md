---
title: 自由格式元数据
type: templates
category: Structured Data Parsing
cat: structured-data-parsing
order: 501
meta_title: 自由格式元数据数据标注模板
meta_description: 用于为任务添加自由格式内容元数据的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/freeform-metadata.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想为某个文本样本收集用于打标签或其他用途的元数据，请使用本模板为标注人员提供一个表格，让他们输入关于某段文本的自由格式元数据。你可以使用不同的标签来修改本模板，以显示图像或其他数据类型。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Style>
    input[type="text"][name^="table"] { border-radius: 0px;}
    input[type="text"][name^="table_value"] { border-left: none; }
    div[class*=" TextAreaRegion_mark"] {background: none; height: 33px; border-radius: 0; min-width: 135px;}
  </Style>
  <Text value="$text" name="text"/>
  <View style="display: grid;  grid-template-columns: 1fr 1fr; max-height: 300px; width: 400px">
    <TextArea name="table_name_1" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
    <TextArea name="table_value_1" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
    <TextArea name="table_name_2" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
    <TextArea name="table_value_2" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
    <TextArea name="table_name_3" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
    <TextArea name="table_value_3" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
  </View>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。


使用 [Style](/tags/style.html) 标签来控制用于自由格式元数据的表格的显示外观。
```xml
<Style>
    input[type="text"][name^="table"] { border-radius: 0px;}
    input[type="text"][name^="table_value"] { border-left: none; }
    div[class*=" TextAreaRegion_mark"] {background: none; height: 33px; border-radius: 0; min-width: 135px;}
</Style>
```
此标签中的样式用于修改本标注配置中使用的对象标签和控制标签的样式。应用于 `name^="table"` 的 `input` 参数指定了表格数据的边框，而应用于 `name^="table_value"` 的 `input` 参数则仅指定了表格值的边框。类似地，`div` 选项修改了 TextArea 控制标签的现有样式，为其分配背景色和其他 CSS 样式以覆盖默认样式。

使用 [Text](/tags/text.html) 对象标签指定要标注的文本：
```xml
<Text value="$text" name="text"/>
```
  
为 [View](/tags/view.html) 标签添加样式，以控制 TextArea 标签以网格形式显示：
```xml
<View style="display: grid;  grid-template-columns: 1fr 1fr; max-height: 300px; width: 400px">
```

使用 [TextArea](/tags/textarea.html) 控制标签为标注人员显示可编辑的文本框，并带有占位符：
```xml
<TextArea name="table_name_1" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
<TextArea name="table_value_1" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
<TextArea name="table_name_2" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
<TextArea name="table_value_2" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
<TextArea name="table_name_3" toName="text" placeholder="name" editable="true" maxSubmissions="1"/>
<TextArea name="table_value_3" toName="text" placeholder="value" editable="true" maxSubmissions="1"/>
```

## 相关标签

- [Style](/tags/style.html)
- [Text](/tags/text.html)
- [TextArea](/tags/textarea.html)
