---
title: 文本片段重叠校验
type: plugins
category: Validation
cat: validation
order: 110
meta_title: 文本片段重叠校验
meta_description: 防止文本片段重叠
tier: enterprise
---

<img src="/images/plugins/ner-overlap-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

如果文本片段发生重叠，此插件会显示一条错误消息：

![警告截图](/images/plugins/ner-overlap.png)

其工作原理如下：

1. 从标注存储中检索所有当前已创建的区域（标注）。
2. 将这些区域过滤为仅包含类型为 `richtextregion` 且具备有效数值型起始和结束偏移量的区域。
3. 根据起始偏移量（升序）对过滤后的文本区域进行排序。
4. 成对遍历它们，检查是否有区域的结束偏移量大于下一个区域的起始偏移量。如果是，则表明存在重叠。
5. 如果发现了任何重叠对，脚本会构建一条错误消息，列出重叠的文本对，使用模态框显示该错误，并阻止保存标注。

    这是一个"硬"阻止的示例，意味着用户必须先解决该问题才能继续。
6. 如果未检测到重叠，则提交标注。

## 插件

```javascript
/**
 * Validates there are no NER text spans overlap before submitting an annotation
 */

LSI.on("beforeSaveAnnotation", (store, annotation) => {
	const existingEntities = Htx.annotationStore.selected.regions;

	const textRegions = existingEntities.filter(
		(r) =>
			r.type === "richtextregion" &&
			typeof r.startOffset === "number" &&
			typeof r.endOffset === "number",
	);

	// console.log(textRegions);  // Print the filtered result
	textRegions.sort((a, b) => a.startOffset - b.startOffset);

	const overlaps = [];

	// Check for overlaps
	for (let i = 0; i < textRegions.length - 1; i++) {
		const current = textRegions[i];
		const next = textRegions[i + 1];
		// console.log("This is current: ", current, "This is next: ", next);

		if (current.endOffset > next.startOffset) {
			// Collect overlapping regions
			const currentText = current.text || "Unknown text";
			const nextText = next.text || "Unknown text";
			overlaps.push(`"${currentText}" and "${nextText}"`);
		}
	}

	if (overlaps.length > 0) {
		// Show error with all overlapping text pairs
		const errorMessage = `Overlapping annotations are not allowed between the following text pairs: ${overlaps.join(", ")}. Please adjust your annotations to remove overlaps.`;
		Htx.showModal(errorMessage, "error");
		return false; // Prevent saving the annotation
	}

	return true; // Allow saving the annotation
});

```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**相关的前端事件：**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## 标注配置

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
