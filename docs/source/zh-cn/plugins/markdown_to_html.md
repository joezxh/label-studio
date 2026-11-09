---
title: Markdown 转 HTML
type: plugins
category: Visualization
cat: visualization
order: 210
meta_title: Markdown 转 HTML
meta_description: 将 Markdown 转换为 HTML 格式
tier: enterprise
---

<img src="/images/plugins/markdown-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件会将基础的 Markdown 渲染为 HTML。

![Markdown 格式化截图](/images/plugins/markdown.png)


## 插件

```javascript
/**
 * Converts the Markdown code given in a specific selector to HTML code.
 */

window.LSI = LSI;

await LSI.import("https://unpkg.com/showdown/dist/showdown.min.js");

const sumBlock = document.querySelector(".lsf-richtext");

if (sumBlock) {
	const converter = new showdown.Converter();
	const html = converter.makeHtml(LSI.task.data.chat_transcript);
	sumBlock.innerHTML = html;
}
```

**相关的 LSI 实例方法：**

* [import(url, integrity)](custom#LSI-import-url-integrity)

## 标注配置

此标注配置在左侧显示聊天记录，在右侧显示选项。

```xml
<View>
  <Style>
    .container {
      display: flex;
      justify-content: space-between;
    }
    .left-column {
      width: 60%;
    }
    .right-column {
      width: 35%;
      margin-left: 20px;
    }
    .summary-box {
      padding: 10px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  </Style>

  <View className="container">
    <!-- Left Column: Chat Transcript -->
    <View className="left-column summaryBlock">
      <Header value="Chat transcript" />
      <!-- Use Text tag to display the markdown content of the conversation -->
      <Text name="chat_transcript" value="$chat_transcript" markdown="true" />
    </View>

    <!-- Right Column: Classification Options -->
    <View className="right-column">
	  <Header value="Classify chat quality" />
      <!-- Relevance of the summary -->
      <Choices name="relevance" toName="chat_transcript" required="true">
        <Choice value="Highly quality" />
        <Choice value="Bad quality" />
      </Choices>
    </View>
  </View>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [Choices](/tags/choices.html)

## 示例数据

```json
{
	"data": {
		"chat_transcript": "**User**: The printer in the office is not working. Can you help troubleshoot?\n\n**LLM Agent**: I can help with that. Is the printer showing any error codes or messages on the display?\n\n**User**: It’s showing 'Paper Jam' but I’ve checked and there’s no paper stuck in there.\n\n**LLM Agent**: Sometimes the sensors in the printer may still think there’s a jam after clearing it. Let’s try turning the printer off for a minute and turning it back on. That should reset the sensors.\n\n**User**: Okay, let me try that... It worked! The error message is gone now.\n\n**LLM Agent**: Great! If you encounter the issue again, let me know. I can also file a maintenance ticket if the problem persists.\n\n**User**: Will do, thanks for your help!"
	}
}
```
