---
title: 简单内容审核
type: plugins
category: Validation
cat: validation
order: 105
meta_title: 简单内容审核
meta_description: 检测文本区域中的禁用词
tier: enterprise
---

<img src="/images/plugins/moderation-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件用于检查标注中是否包含淫秽或禁用词。

在下面的示例中，如果用户尝试提交一个在任意音频转写中包含 "hate" 一词的标注，他们会看到一个弹出警告。

请注意，这是一个"软"阻止（soft block），意味着用户可以关闭弹窗并仍然继续。有关"硬"阻止的示例，请参阅 [JSON 校验](json_validation)。

![Label Studio 中的审核弹窗截图](/images/plugins/moderation.png)


## 插件

```javascript
/**
 * Simple content moderation plugin that prevents saving annotations containing hate speech
 *
 * This plugin monitors text entered into TextArea regions and checks for the word "hate"
 * before allowing the annotation to be saved. If found, it shows an error message and
 * prevents submission. This would happen only once, if user clicks Submit again it would
 * work with no errors.
 *
 * The plugin uses Label Studio's beforeSaveAnnotation event which is triggered before
 * an annotation is saved. Returning false from this event handler prevents the save
 * operation from completing.
 */

let dismissed = false;

LSI.on("beforeSaveAnnotation", (store, ann) => {
	// text in TextArea is always an array
	const obscene = ann.results.find(
		(r) =>
			r.type === "textarea" && r.value.text.some((t) => t.includes("hate")),
	);
	if (!obscene || dismissed) return true;

	// select region to see textarea
	if (!obscene.area.classification) ann.selectArea(obscene.area);

	Htx.showModal("The word 'hate' is disallowed", "error");
	dismissed = true;

	return false;
});
```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**相关的前端事件：**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## 标注配置

```xml
<View>
  <Labels name="labels" toName="audio">
    <Label value="Speech" />
    <Label value="Noise" />
  </Labels>

  <Audio name="audio" value="$audio"/>

  <TextArea name="transcription" toName="audio"
    editable="true"
    perRegion="true"
    required="true"
  />
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Labels](/tags/labels.html)
* [Audio](/tags/audio.html)
* [TextArea](/tags/textarea.html)

## 示例数据

```json
[
  {
    "audio": "https://data.heartex.net/librispeech/dev-clean/3536/8226/3536-8226-0024.flac.wav"
  }
]
```
