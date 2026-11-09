---
title: 文本区域字数统计
type: plugins
category: Validation
cat: validation
order: 130
meta_title: 文本区域字数统计
meta_description: 根据字数验证文本区域的长度
tier: enterprise
---

<img src="/images/plugins/wordcount-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件用于验证用户是否超出了字数限制。

![警告截图](/images/plugins/wordcount.png)

## 插件

按脚本编写，此插件设置 10 个字的限制。你可以根据需要修改字数限制。

```javascript
/**
 * Validates the word count of the entered text to prevent submission if it exceeds a specified threshold
 */

let dismissed = false;

LSI.on("beforeSaveAnnotation", (store, annotation) => {
	const textAreaResult = annotation.results.find(
		(r) => r.type === "textarea" && r.from_name.name === "textarea",
	);

	if (textAreaResult) {
		words = textAreaResult.value.text[0];
		word_count = words.split(" ").length;

		if (word_count > 10) {
			Htx.showModal(
				`Word count is ${word_count}. Please reduce to 10 or less.`,
			);
			dismissed = true;
			return false; // Block submission
		}
	}

	return true; // Allow submission
});
```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**相关的前端事件：**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## 标注配置

```xml
<View>
  <Header value="Classify the text in less than 10 words"/>
  <Text name="text" value="$text"/>
  <TextArea name="textarea" toName="text" />
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [Text](/tags/text.html)
* [TextArea](/tags/textarea.html)

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
