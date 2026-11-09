---
title: 连接 LLM 后端
type: plugins
category: Automation
cat: automation
order: 40
meta_title: 连接 LLM 后端
meta_description: 向 LLM URL 发送提示词
---

<img src="/images/plugins/llm-backend-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件连接到一个开放的 LLM 端点，使你能够作为标注工作流的一部分来生成回复。

![LLM 分析截图](/images/plugins/llm-backend.gif)

## 插件

在使用之前，请将 `MY_URL_ROOT` 值替换为一个不需要身份验证的 URL。这通常是一个内部服务或代理后面的 LLM。

```javascript 
window.LSI = LSI;

const baseUrl = "MY_URL_ROOT";

/**
 * Makes a request to the configured LLM sending the given prompt
 */
async function fetchLLM(prompt) {
	const params = {
		prompt,
		llm_endpoint_name: "chatgpt",
		redteam_categories: ["cat1"],
	};

	const searchParams = new URLSearchParams(params).toString();
	const url = `${baseUrl}?${searchParams}`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// No auth needed because the API is open
		},
	});

	const data = await response.json();
}

/**
 * Sends the introduced prompt to the LLM endpoint and attaches the given results to the annotation
 */
async function sendPrompt() {
	const promptTag = LSI.annotation.names.get("prompt");
	promptTag.submitChanges();
	const prompt = promptTag.result?.value.text.join("\n");

	if (!prompt) {
		Htx.showModal("The prompt is empty", "error");
		return false;
	}

	let response;

	// console.log("Input prompt:" + prompt);
	try {
		response = await fetchLLM(prompt);
	} catch (error) {
		Htx.showModal(
			`Error fetching the LLM endpoint "${baseUrl}": ${error.message}`,
			"error",
		);
		return false;
	}
	const results = [];

	const llmResponse = response.LLM_response;
	if (llmResponse) {
		const llmResult = {
			from_name: "response",
			to_name: "placeholder",
			type: "textarea",
			value: { text: [] },
		};
		results.push(llmResult);
	}
	// console.log("Response:" + llmResponse["LLM_response"]);

	const category = response.Category?.category;
	if (category?.length) {
		const attackResult = {
			from_name: "category",
			to_name: "placeholder",
			type: "choices",
			value: { choices: category },
		};
		results.push(attackResult);
		// console.log("Category:" + category);
	}

	const reasonText = response.Type?.reason;
	if (reasonText) {
		const reasonResult = {
			from_name: "reason",
			to_name: "placeholder",
			type: "textarea",
			value: { text: [reasonText] },
		};
		results.push(reasonResult);
		// console.log("Reason:" + reason);
	}

	LSI.annotation.deserializeResults(results);
}

/**
 * Sets up the onClick event of the template to trigger the LLM request
 */
function setup() {
	const aBtn = document.querySelector(".analyzeButton");
	const button = document.createElement("button");
	button.textContent = "Analyze"; // Set the button text

	// Attach an onclick event to the button
	button.onclick = sendPrompt;

	// Insert the button into the div
	aBtn.replaceChildren(button);
}

setup();

```

**相关的 LSI 实例方法：**

* [.annotation)](custom#LSI-annotation)


## 标注配置

!!! info 提示
    你可以向 prompt 的 TextArea 参数添加 `value="$text"`，以用数据中的文本预填充内容。

```xml
<View>
    <Style>
      .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
      .placeholder { display: none; }
      .llm_response textarea { background-color: #f0f0f0; /* Optional: gives a "disabled" feel */ }
      .analyzeButton button {
        background: #1890ff;
        border-color: #1890ff;
        box-shadow: 0 2px 0 rgba(0, 0, 0, .045);
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, .12);
        padding: 4px 15px;
      }
    </Style>

    <View className="placeholder">
    	<Text name="placeholder" value="placeholder" />
  	</View>

    <Header value="Enter Prompt to Analyze:"/>
    <TextArea
      name="prompt"
      toName="placeholder"
      transcription="true"
      showSubmitButton="false"
      editable="true"
      rows="4"
      maxSubmissions="1"
      placeholder="Type the prompt here..."
    />
    <View className="analyzeButton"></View>

    <Header value="LLM Response:"/>
    <View className="llm_response">
      <TextArea
        name="response"
        toName="placeholder"
        transcription="true"
        rows="6"
        showSubmitButton="false"
        editable="false"
        smart="false"
        maxSubmissions="1"
        placeholder="The LLM response will appear here..."
      />
    </View>

    <Header value="Category:"/>
    <Choices name="category" toName="placeholder" choice="single" showInLine="true">
      <Choice value="none" />
      <Choice value="cat1" />
      <Choice value="cat2" />
      <Choice value="cat3" />
    </Choices>

    <Header value="Reason"/>
    <TextArea
      name="reason"
      toName="placeholder"
      rows="2"
      editable="false"
      smart="false"
      maxSubmissions="1"
      placeholder="Write something here..."
    />
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [TextArea](/tags/textarea.html)
* [Choices](/tags/choices.html)

## 示例数据

```json
[
   {
      "data": {
         "text": "What is the closest relative to an opossum?"
      }
   },
   {
      "data": {
         "text": "What is a fun opossum fact?"
      }
   },
   {
      "data": {
         "text": "Why are opossums cool?"
      }
   }
]
```
