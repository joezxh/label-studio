---
title: 拼写检查
type: plugins
category: Validation
cat: validation
order: 120
meta_title: 拼写检查
meta_description: 检测模板文本区域中的拼写错误
tier: enterprise
---

<img src="/images/plugins/spellcheck-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此脚本检查文本区域内内容中的拼写错误。如果用户在文本区域存在拼写错误的情况下尝试提交其工作，他们会收到一条错误消息：

![警告截图](/images/plugins/spellcheck.png)

## 插件

```javascript
// Load the spelling check library
await LSI.import('https://cdn.jsdelivr.net/npm/typo-js@1.1.0/typo.js')

// Initialize the dictionary
const dictionary = new Typo('en_US', false, false, { dictionaryPath: 'https://cdn.jsdelivr.net/npm/typo-js@1.1.0/dictionaries' })
const WORD_REGEX = /\w+/g

LSI.on('beforeSaveAnnotation', async (store, annotation) => {
  // Find all textareas with misspellings
  let misspelledAreas = annotation.results.filter(
    r => r.type === 'textarea' && r.value.text.some(t => {
      let words = t.match(WORD_REGEX) || [] // Extract words
      return words.some(word => !dictionary.check(word))
    })
  )

  // If no misspelled textareas, continue with the save process
  if (misspelledAreas.length === 0) return true

  // Collect all misspelled words
  let misspelledWords = [...new Set(misspelledAreas.flatMap(area =>
    area.value.text.flatMap(t =>
      (t.match(WORD_REGEX) || []).filter(word => !dictionary.check(word))
    )
  ))]
  // console.log('words:', misspelledWords) // print misspelled words

  // Select the first region to see textarea
  if (!misspelledAreas[0].area.classification) annotation.selectArea(misspelledAreas[0].area)

  // Show the modal with the misspelled words
  Htx.showModal(`Misspelled words: ${misspelledWords.join(', ')}. Please correct them before submitting.`, 'error')

  // Block the saving process
  return false
})
```

**相关的 LSI 实例方法：**

* [import(url, integrity)](custom#LSI-import-url-integrity)
* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**相关的前端事件：**

* [beforeSaveAnnotation](/guide/frontend_reference#beforeSaveAnnotation)

## 标注界面

```xml
<View>
  <Image name="image" value="$image"/>
  <Header value="Describe the image:"/>
  <TextArea name="caption" 
            toName="image" 
            placeholder="Enter description here..."
            rows="5" 
            maxSubmissions="1"/>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [Image](/tags/image.html)
* [TextArea](/tags/textarea.html)


## 示例数据

```json
[
  {
    "image": "https://labelstud.io/demo/Datasets/Image/Object Detection/Image_66.jpg"
  }
]
```
