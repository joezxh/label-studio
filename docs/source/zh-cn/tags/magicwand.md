---
title: Magicwand
type: tags
order: 413
meta_title: Magic Wand 标签，用于在图像分割期间快速阈值化洪泛填充
meta_description: 使用 Magic Wand 标签自定义 Label Studio，在图像分割标注过程中通过快速点击并拖动来阈值化洪泛填充图像区域，用于机器学习和数据科学项目。
---

`Magicwand` 标签允许用户在正在进行分割标注的图像区域中点击，拖动鼠标以动态调整洪泛填充容差，然后松开鼠标按钮得到一个新的标注区域。它在对广阔、弥散、边缘复杂的对象进行分割标注时尤为有效，例如地球观测应用中的云、云影、雪等，或生物医学应用中的有机形状。

与以下数据类型配合使用：image（图像）。

Magic Wand 支持缩放，但无法在旋转后的图像上工作。

Magic Wand 使用示例：

![Animated GIF showing Magic Wand clicking on cloud and dragging, automatically segmenting and selecting
pixels to create a mask](../images/magicwand_example.gif)

### CORS 配置

Magic Wand 需要以像素级别访问正在标注的图像，才能进行阈值化和洪泛填充。如果你在一个第三方域上托管要标注的图像，则需要启用 CORS 头，以便 Magic Wand 能够跨域发起 HTTP `GET` 请求，从而对实际图像像素数据进行阈值化。有关配置 CORS 的更多详细信息，请参阅 [Label Studio 存储指南](../guide/storage.html#Troubleshoot-CORS-and-access-problems)。

### `Image` 标签配置

`Magicwand` 标签被配置为与它将操作的 `Image` 标签协同工作以进行标注。如果你在跨域存储 `Image` 标签所引用的图像，则必须正确设置 `Image` 属性的 `crossOrigin`。该属性模拟普通 DOM `img` 标签所拥有的相同 `crossOrigin` 属性（[参考](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin)）。

如果图像位于无需任何身份验证即可公开读取的公共服务器或 Google/AWS/Azure 存储桶上，应将 `crossOrigin` 设置为 `anonymous`。

如果图像位于需要任何类型身份验证的服务器或私有云存储桶上（即请求必须携带证明身份的 HTTP 头并与第三方请求一起发送），则应将 `crossOrigin` 设置为 `use-credentials`。请注意，Google 的云存储桶 [不支持 CORS 请求的鉴权请求](https://cloud.google.com/storage/docs/cross-origin#additional_considerations)，这意味着你要么将该 Google 存储桶设为全球可读以配合 Magic Wand 使用，要么使用 Label Studio 的签名 URL 支持（[AWS](../guide/storage.html#Set-up-connection-in-the-Label-Studio-UI)、[GCP](../guide/storage.html#Set-up-connection-in-the-Label-Studio-UI-1) 以及 [Azure](../guide/storage.html#Set-up-connection-in-the-Label-Studio-UI-2)）。

如果图像与你的 Label Studio 实例位于同一主机上，你可以直接省略 `crossOrigin` 属性，或将其设置为 `none`。

{% insertmd zh-cn/includes/tags/magicwand.md %}

### 示例

基础图像分割标注配置，图像存储在第三方公共云存储桶上：

```html
<View>
  <Labels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </Labels>
  <MagicWand name="magicwand" toName="image" />
  <Image name="image" value="$image" crossOrigin="anonymous" />
</View>
```
### 示例

启用了缩放控件和笔刷的 Magic Wand 示例：

```html
<View>
  <Labels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </Labels>
  <MagicWand name="magicwand" toName="image" />
  <Brush name="brush" toName="image" />
  <Image name="image" value="$image" zoomControl="true" zoom="true" crossOrigin="anonymous" />
</View>
```
