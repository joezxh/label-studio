---
title: JSON 校验
type: plugins
category: Validation
cat: validation
order: 100
meta_title: JSON 校验
meta_description: 检查所输入的文本是否为有效的 JSON
tier: enterprise
---

<img src="/images/plugins/json-validate-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于
此插件会解析 `TextArea` 字段的内容以检查是否为有效的 JSON。如果 JSON 无效，它会显示错误并阻止保存标注。

这是一个"硬"阻止（hard block）的示例，意味着用户必须先解决该问题才能继续。

![JSON 错误消息截图](/images/plugins/json-validate.png)

## 插件

```javascript
 LSI.on("beforeSaveAnnotation", (store, annotation) => {
  const textAreaResult = annotation.results.find(r => r.type === 'textarea' && r.from_name.name === 'answer');
  if (textAreaResult) {
    try {
      JSON.parse(textAreaResult.value.text[0]);
    } catch (e) {
      Htx.showModal("Invalid JSON format. Please correct the JSON and try again.", "error");
      return false;
    }
  }
  return true;
});
```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)

**相关的前端事件：**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)


## 标注配置

```xml
<View>
  <View>
    <Filter toName="label_rectangles" minlength="0" name="filter"/>
    <RectangleLabels name="label_rectangles" toName="image" canRotate="false" smart="true">
      <Label value="table" background="Blue"/>
      <Label value="cell" background="Red"/>
      <Label value="column" background="Green"/>
      <Label value="row" background="Purple"/>
    </RectangleLabels>
  </View>
  <View>
    <Image name="image" value="$image" />
  </View>
  <View style=".htx-text { white-space: pre-wrap; }">
    <TextArea name="answer" toName="image"
              editable="true"
              perRegion="true"
              required="false"
              maxSubmissions="1"
              rows="10"
              placeholder="Parsed Row JSON"
              displayMode="tag"/>
  </View>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [RectangleLabels](/tags/rectanglelabels.html)
* [TextArea](/tags/textarea.html)
* [Labels](/tags/labels.html)

## 示例数据

```json
[
  {
    "image": "https://labelstud.io/demo/Datasets/Image/Object Detection/Image_66.jpg"
  }
]
```
