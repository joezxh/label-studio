---
title: 图像描述生成
type: templates
category: Computer Vision
cat: computer-vision
order: 130
meta_title: 图像描述生成数据标注模板
meta_description: 用于使用 Label Studio 为图像添加描述的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/image-captioning.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个机器学习模型来为图像生成描述或替代文本（alt text），请使用本模板收集关于图像的描述。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Image name="image" value="$captioning"/>
  <Header value="Describe the image:"/>
  <TextArea name="caption" toName="image" placeholder="Enter description here..." rows="5" maxSubmissions="1"/>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签指定要添加描述的图像：
```xml
<Image name="image" value="$captioning"/>
```

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Describe the image:"/>
```

使用 [TextArea](/tags/textarea.html) 控制标签提供一个 5 行的文本框，供标注人员输入描述：
```xml
<TextArea name="caption" toName="image" placeholder="Enter description here..." rows="5" maxSubmissions="1"/>
```
使用 `placeholder` 参数为标注人员提供占位文本，可用于给出示例或进一步说明。

## 增强此模板

你可以通过多种方式增强此模板。

### 添加固定的表头，以便始终查看描述

如果你希望始终在标注界面上查看标注选项，即使需要在被标注的图像或数据上滚动，也可以使用 [View](/tags/view.html) 标签的样式来指定位置。

在本例中，将描述元素包裹在带样式的 [View](/tags/view.html) 标签中：
```xml
 <View style="padding: 0 1em; margin: 1em 0; background: #f1f1f1; position: sticky; top: 0; border-radius: 3px">
  <TextArea name="caption" toName="image" placeholder="Enter description here..." rows="5" maxSubmissions="1"/>
 </View>
```
`position: sticky; top: 0;` 这段 CSS 会使 [TextArea](/tags/textarea.html) 在标注人员向下滚动查看任务时固定在屏幕顶部。其他样式选项在视觉上将包含文本框的界面部分与界面的其余部分区分开来。

## 相关标签

- [Image](/tags/image.html)
- [Header](/tags/header.html)
- [TextArea](/tags/textarea.html)
