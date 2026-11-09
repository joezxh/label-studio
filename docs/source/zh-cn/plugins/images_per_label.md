---
title: 动态图像切换
type: plugins
category: Visualization
cat: visualization
order: 220
meta_title: 动态图像切换
meta_description: 根据条件切换活动图像
tier: enterprise
---

<img src="/images/plugins/dynamic-images-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件会动态地在标注界面底部添加一个图像元素，并根据所点击的类标签来更新该图像：

![图像切换动图](/images/plugins/dynamic-images.gif)

其工作原理如下：

1. 插件脚本定义了一个名为 `images` 的对象，它根据根路径将标签名（如 "Addressee" 或 "Signature"）映射到特定的图像文件 URL。
2. 它尝试使用唯一 ID（`img_uniq`）从全局 window 中获取一个已有的图像元素。
   - 如果该图像尚不存在，它会使用该 ID 创建一个新的 `<img>` 元素。
   - 然后，它会找到主标注容器（使用选择器 `.lsf-main-view__annotation`），并将新的图像元素追加到其末尾。
3. 脚本通过 `LSI.annotation.names.get("label").children` 获取当前配置的标签对象列表。
   接着，它找到所有可点击的标签元素（带有 CSS 类 `.lsf-label_clickable`），并为每一个附加一个点击事件监听器。
4. 当任意标签被点击时，相应的事件监听器会使用标签的值（由其在标签数组中的索引确定）从 `images` 映射中查找对应的图像 URL，然后将图像元素的 `src` 属性设为该 URL。如果没有匹配的图像，则 `src` 可能为空。


## 插件

此插件配合演示支票图像即可直接使用。若要用于你自己的目的，你需要托管 Label Studio 可访问的图像。

```javascript
/**
 * Display different example check images at the bottom of the layout
 * depending on the class label selected
 */

const IMG_ID = "img_uniq";
// Use your own keys and values here for label lookup and data objects to display
const imagesRoot = "/static/plugins/src/different-images-per-label/img";
const images = {
	Addressee: `${imagesRoot}/demo-addressee.jpg`,
	"Account number": `${imagesRoot}/demo-routing-number.png`,
	"Routing number": `${imagesRoot}/demo-routing-number.png`,
	Signature: `${imagesRoot}/demo-sign.jpg`,
	Amount: `${imagesRoot}/demo-amount.jpg`,
	Watermark: `${imagesRoot}/demo-watermark.png`,
	Date: `${imagesRoot}/demo-date.png`,
	Correction: `${imagesRoot}/demo-correction.jpg`,
};

function appendCheckImg() {
	let imageEl = window[IMG_ID];
	if (!imageEl) {
		imageEl = document.createElement("img");
		imageEl.id = IMG_ID;

		const labelingInterface = document.querySelector(
			".lsf-main-view__annotation",
		);
		if (labelingInterface) {
			labelingInterface.insertAdjacentElement("beforeend", imageEl);
		} else {
			console.error("Labeling interface element not found.");
		}
	}

	// `label` is an actual tag name from config
	const labels = LSI.annotation.names.get("label").children;

	// If you will have more Labels in a future adjust the logic
	document.querySelectorAll(".lsf-label_clickable").forEach((lbl, index) =>
		lbl.addEventListener("click", () => {
			const src = images[labels[index].value];

			// if there are no images with this key image will just have an empty src
			imageEl.src = src;
		}),
	);
}

appendCheckImg();
```

## 标注配置

```xml
<View>
  <View>
    <Image name="image" value="$image" maxHeight="300px" />
    <Labels name="label" toName="image">
        <Label value="Addressee" background="gray" maxUsages="1" />
        <Label value="Account number" background="magenta" maxUsages="1" />
        <Label value="Routing number" background="green" maxUsages="1" />
        <Label value="Signature" background="red" maxUsages="1" />
        <Label value="Amount" background="orange" maxUsages="2" />
        <Label value="Watermark" background="purple" />
        <Label value="Date" background="brown" maxUsages="1" />
        <Label value="Correction" background="black" maxUsages="1" />
    </Labels>
    <Rectangle name="bbox" toName="image" strokeWidth="3" />
  </View>
  <View>
    <Header value="Example" />
    <Header value="(Please make a selection)" size="5" />
  </View>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Image](/tags/image.html)
* [Labels](/tags/labels.html)
* [Label](/tags/label.html)
* [Rectangle](/tags/rectangle.html)
* [Header](/tags/header.html)

## 示例数据

```json
{
	"data": {
		"image": "/static/plugins/src/different-images-per-label/img/demo-sample.png"
	}
}
```
