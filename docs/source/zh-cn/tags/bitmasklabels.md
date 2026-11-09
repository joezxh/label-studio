---
title: BitmaskLabels
type: tags
order: 402
meta_title: 用于像素级图像分割标注的 Bitmask 标签
meta_description: 使用 bitmask 像素级标签自定义 Label Studio，用于机器学习和数据科学项目的图像分割标注。
---

`Bitmask` 标签用于像素级图像分割任务，适用于需要应用遮罩或使用笔刷在图像上绘制区域的场景。

`Bitmask` 在像素级别运行，输出一个 base64 编码的 PNG 数据 URL 图像，透明背景上为黑色像素。

导出数据示例：`data-url:image/png;[base64-encoded-string]`

<video class="Video astro-OQEP7KKB" loop="" playsinline="" autoplay="" muted="" style="width:100%;">
  <source src="https://cdn.sanity.io/files/mzff2hy8/production/4812f66851a7fd4836e729bc7ccb7e510823af5d.mp4" type="video/mp4" class="astro-OQEP7KKB">
</video>

<br/>
<br/>

!!! note 

    你需要将 `<Image>` 标签的 `smoothing="false"` 设置为 false，才能对单个像素进行操作。

与以下数据类型配合使用：image（图像）。

{% insertmd zh-cn/includes/tags/bitmasklabels.md %}

### 示例

基础图像分割标注配置

```html
<View>
  <BitmaskLabels name="labels" toName="image">
    <Label value="Person" />
    <Label value="Animal" />
  </BitmaskLabels>
  <Image name="image" value="$image" smoothing="false" />
</View>
```
