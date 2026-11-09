---
title: 图像分类
type: templates
category: Computer Vision
cat: computer-vision
order: 135
meta_title: 图像分类数据标注模板
meta_description: 用于使用 Label Studio 对图像数据进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/image-classification.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个模型来识别图像中内容的类型，例如用于内容审核的使用场景，请使用本模板通过复选框执行图像分类。

<a href="https://app.humansignal.com/b/MTk3"
  target="_blank" rel="noopener" aria-label="Open in Label Studio" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;border:1px solid rgb(109,135,241);padding:8px 12px;background:rgb(87 108 193);color:white;font-weight:500;font-family:sans-serif;gap:6px;transition:background 0.2s ease;" onmouseover="this.style.background='rgb(97 122 218)'" onmouseout="this.style.background='rgb(87 108 193)'">
  <svg style="width:20px;height:20px" viewBox="0 0 26 26" fill="none"><path fill="none" d="M3.5 4.5h19v18h-19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.7 7.503h-7.087V5.147H7.588V2.792h11.025V.436H25.7v7.067Zm-18.112 0H5.225v10.994H2.863V7.503H.5V.436h7.088v7.067Zm0 18.061v-7.067H.5v7.067h7.088ZM25.7 18.497v7.067h-7.088v-2.356H7.588v-2.355h11.025v-2.356H25.7Zm-2.363 0V7.503h-2.363v10.994h2.363Z" fill="white"/></svg>
  <span style="font-size:14px">在 Label Studio 中打开</span>
  <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="white"/></svg>
</a>

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image">
    <Choice value="Adult content"/>
    <Choice value="Weapons" />
    <Choice value="Violence" />
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [Image](/tags/image.html) 对象标签指定要分类的图像：
```xml
<Image name="image" value="$image"/>
```

使用 [Choices](/tags/choices.html) 控制标签显示可用于对图像进行分类的选项：
```xml
  <Choices name="choice" toName="image">
    <Choice value="Adult content"/>
    <Choice value="Weapons" />
    <Choice value="Violence" />
  </Choices>
```
你可以修改 [Choice](/tags/choice.html) 标签的值以提供不同的分类选项。查阅 Choices 标签的可用参数以进行自定义。

## 增强此模板

你可以通过多种方式增强此模板。

### 添加固定的左侧列

如果你希望分类选项显示在图像左侧，可以为 [View](/tags/view.html) 标签添加样式。

```xml
<View style="display: flex;">
  <View style="padding: 0em 1em; background: #f1f1f1; margin-right: 1em; border-radius: 3px">
    <View style="position: sticky; top: 0">
    <Choices name="choice" toName="image">
        <Choice value="Adult content"/>
        <Choice value="Weapons" />
        <Choice value="Violence" />
    </Choices>
    </View>
  </View>
    
  <View>
    <Image name="image" value="$image"/>
  </View>
</View>

```

{% insertmd zh-cn/includes/nested-classification.md %}

## 相关标签

- [Image](/tags/image.html)
- [Choices](/tags/choices.html)
