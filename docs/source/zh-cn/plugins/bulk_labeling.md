---
title: 通过键盘快捷键批量标注文本片段
short: 文本片段批量标注
type: plugins
category: Automation
cat: automation
order: 10
meta_title: 文本片段批量标注
meta_description: 一次性为所选文本的所有出现位置分配标签
tier: enterprise
---

<img src="/images/plugins/bulk-labeling-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

当你按下 **Shift** 键时，此插件会自动将相同的标签应用到所有匹配的文本片段。

例如，如果你为文本片段 `Smith` 应用 `PER` 标签，此插件会自动在文本中找到 `Smith` 的所有实例，并为它们应用 `PER` 标签。

![批量文本标注截图](/images/plugins/bulk_actions.gif)

1. **Shift 键跟踪**
    - 插件使用 `keydown` 和 `keyup` 事件监听器来跟踪 Shift 键的状态。当按下 Shift 键时，布尔变量 `isShiftKeyPressed` 被设为 `true`；当释放时设为 `false`。
2. **批量删除**
    - 当一个区域（标注）被删除且 Shift 键处于按下状态时，插件会找出所有与被删除区域文本和标签相同的区域。
    - 然后它会删除所有这些匹配的区域，以实现批量删除。
3. **批量创建**
    - 当一个区域被创建且 Shift 键处于按下状态时，插件会在文档中搜索所创建区域文本的所有出现位置。
    - 它会为文本的每次出现创建新的区域，并确保不会创建重复的区域（即避免创建起止偏移量重叠的区域）。
    - 插件还会阻止对单个字符打标签，以避免不必要的标注。
4. **超时**
    - 为了防止连续快速地触发批量操作，插件设置了 1 秒的超时。这能确保批量操作不会过于频繁地触发。

## 插件

```javascript
/**
 * Automatically creates text regions for all instances of the selected text and deletes existing regions
 * when the shift key is pressed.
 */

// Track the state of the shift key
let isShiftKeyPressed = false;

window.addEventListener("keydown", (e) => {
	if (e.key === "Shift") {
		isShiftKeyPressed = true;
	}
});

window.addEventListener("keyup", (e) => {
	if (e.key === "Shift") {
		isShiftKeyPressed = false;
	}
});

LSI.on("entityDelete", (region) => {
	if (!isShiftKeyPressed) return; // Only proceed if the shift key is pressed

	if (window.BULK_REGIONS) return;
	window.BULK_REGIONS = true;
	setTimeout(() => {
		window.BULK_REGIONS = false;
	}, 1000);

	const existingEntities = Htx.annotationStore.selected.regions;
	const regionsToDelete = existingEntities.filter((entity) => {
		const deletedText = region.text.toLowerCase().replace("\\\\n", " ");
		const otherText = entity.text.toLowerCase().replace("\\\\n", " ");
		return deletedText === otherText && region.labels[0] === entity.labels[0];
	});

	for (const region of regionsToDelete) {
		Htx.annotationStore.selected.deleteRegion(region);
	}

	Htx.annotationStore.selected.updateObjects();
});

LSI.on("entityCreate", (region) => {
	if (!isShiftKeyPressed) return;

	if (window.BULK_REGIONS) return;
	window.BULK_REGIONS = true;
	setTimeout(() => {
		window.BULK_REGIONS = false;
	}, 1000);

	const existingEntities = Htx.annotationStore.selected.regions;

	setTimeout(() => {
		// Prevent tagging a single character
		if (region.text.length < 2) return;
		regexp = new RegExp(
			region.text.replace("\\\\n", "\\\\s+").replace(" ", "\\\\s+"),
			"gi",
		);
		const matches = Array.from(region.object._value.matchAll(regexp));
		for (const match of matches) {
			if (match.index === region.startOffset) continue;

			const startOffset = match.index;
			const endOffset = match.index + region.text.length;

			// Check for existing entities with overlapping start and end offset
			let isDuplicate = false;
			for (const entity of existingEntities) {
				if (
					startOffset <= entity.globalOffsets.end &&
					entity.globalOffsets.start <= endOffset
				) {
					isDuplicate = true;
					break;
				}
			}

			if (!isDuplicate) {
				Htx.annotationStore.selected.createResult(
					{
						text: region.text,
						start: "/span[1]/text()[1]",
						startOffset: startOffset,
						end: "/span[1]/text()[1]",
						endOffset: endOffset,
					},
					{
						labels: [...region.labeling.value.labels],
					},
					region.labeling.from_name,
					region.object,
				);
			}
		}

		Htx.annotationStore.selected.updateObjects();
	}, 100);
});
```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)

**相关的前端 API：**

* [regions](custom#regions)

**相关的前端事件：**

* [entityCreate](/guide/frontend_reference#entityCreate)
* [entityDelete](/guide/frontend_reference#entityDelete)


## 标注配置

这是一个基础的 NER 标注配置。

```xml
<View>
  <Labels name="label" toName="text">
    <Label value="PER" background="red"/>
    <Label value="ORG" background="darkorange"/>
    <Label value="LOC" background="orange"/>
    <Label value="MISC" background="green"/>
  </Labels>

  <Text name="text" value="$text"/>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Text](/tags/text.html)
* [Labels](/tags/labels.html)

## 示例数据

```json
[
   {
      "data": {
         "text": "Opossums are nocturnal animals that are often seen scavenging for food at night. They have a prehensile tail that helps them climb trees and navigate their environment."
      }
   },
   {
      "data": {
         "text": "Opossums are known for their ability to play dead when threatened, a behavior known as 'playing possum'. This act can deter predators and give the opossum a chance to escape."
      }
   },
   {
      "data": {
         "text": "Opossums are marsupials, meaning they carry and nurse their young in a pouch. Baby opossums, called joeys, stay in the pouch for about two months after birth."
      }
   }
]
```
