---
title: 垃圾邮件与机器人检测
type: plugins
category: Automation
cat: automation
order: 20
meta_title: 垃圾邮件与机器人检测
meta_description: 检测到机器人行为时暂停标注人员
tier: enterprise
---

<img src="/images/plugins/pause-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

你可以手动[暂停标注人员](/guide/quality#Pause-an-annotator)，以阻止他们完成任务并撤销其项目访问权限。

此脚本会自动暂停违反了以下任意规则之一的标注人员，并自定义所显示的消息：

* 过多重复值 `timesInARow(3)`：

    检查 `TextArea` 字段（`comment`）中最后三次提交的标注是否都具有相同的值。如果是，则返回一条自定义警告消息。

    ![警告截图](/images/plugins/pause1.png)

* 过多相似值 `tooSimilar()`：

    对于 `Choices` 选项（`sentiment`），它会计算过往值的偏差。如果偏差低于某个阈值（意味着这些值过于一致/相似），则返回一条自定义警告消息。

    ![警告截图](/images/plugins/pause2.png)
 
* 一段时间内提交过多 `tooFast()`：

    监控标注的总体速度。例如，它会检查是否在不到 10 分钟的时间内提交了 20 个标注。如果是，则会出现一条自定义警告。

    ![警告截图](/images/plugins/pause3.png)

要解除标注人员的暂停状态，请使用[成员仪表板](/guide/quality#Pause-an-annotator)。

!!! info 提示

    如果你将鼠标悬停在 **已暂停（Paused）** 指示器上，可以看到该用户被暂停时向其显示的消息。如果是手动暂停的用户，它还会显示是谁发起了该操作。

    ![悬停截图](/images/plugins/pause_hover.png)

## 插件

```javascript
/**
 * Defines a set of rules the annotator must follow so good quality can be guaranteed. If the rules are not follow,
 * it will pause the annotator
 */

/**
 * Rules configuration for pausing the annotation
 *
 * `fields` describe per-field rules in a format
 *   <field-name>: [<rule>(<optional params for the rule>)]
 * `global` is for rules applied to the whole annotation
 */
const RULES = {
	fields: {
		comment: [timesInARow(3)],
		sentiment: [tooSimilar()],
	},
	global: [tooFast()],
};

/**
 * Messages for users when they are paused.
 *
 * Each message is a function with the same name as original rule and it receives an object with
 * `items` and `field`.
 */
const MESSAGES = {
	timesInARow: ({ field }) => `Too many similar values for ${field}`,
	tooSimilar: ({ field }) => `Too similar values for ${field}`,
	tooFast: () => "Too fast annotations",
};

/**
 * All Available rules are below.
 *
 * They recieve params and return function which recieves `items` and optional `field`.
 * If condition is met it returns warning message. If not — returns `false`.
 */

/**
 * Validates if values for the `field` in last `times` items are the same
 */
function timesInARow(times) {
	return (items, field) => {
		if (items.length < times) return false;
		const last = String(items.at(-1).values[field]);
		return items
			.slice(-times)
			.every((item) => String(item.values[field]) === last)
			? MESSAGES.timesInARow({ items, field })
			: false;
	};
}

/**
 * Validates if the annotations are too similar (`deviation`) with the given frequency (`max_count`)
 */
function tooSimilar(deviation = 0.1, max_count = 10) {
	return (items, field) => {
		if (items.length < max_count) return false;
		const values = items.map((item) => item.values[field]);
		const points = values.map((v) => values.indexOf(v));
		return calcDeviation(points) < deviation
			? MESSAGES.tooSimilar({ items, field })
			: false;
	};
}

/**
 * Validates the annotations are less than `times` in the given time window (`minutes`)
 */
function tooFast(minutes = 10, times = 20) {
	return (items) => {
		if (items.length < times) return false;
		const last = items.at(-1);
		const first = items.at(-times);
		return last.created_at - first.created_at < minutes * 60
			? MESSAGES.tooFast({ items })
			: false;
	};
}

/**
 * Internal code for calculating the deviation and provide faster accessors
 */
const project = DM.project?.id;
if (!project) throw new Error("Project is not initialized");

const key = ["__pause_stats", project].join("|");
const fields = Object.keys(RULES.fields);
// { sentiment: ["positive", ...], comment: undefined }
const values = Object.fromEntries(
	fields.map((field) => [field, DM.project.parsed_label_config[field]?.labels]),
);

// simplified version of MSE with normalized x-axis
function calcDeviation(data) {
	const n = data.length;
	// we normalize indices from -n/2 to n/2 so meanX is 0
	const mid = n / 2;
	const mean = data.reduce((a, b) => a + b) / n;

	const k =
		data.reduce((a, b, i) => a + (b - mean) * (i - mid), 0) /
		data.reduce((a, b, i) => a + (i - mid) ** 2, 0);
	const mse =
		data.reduce((a, b, i) => a + (b - (k * (i - mid) + mean)) ** 2, 0) / n;

	return Math.abs(mse);
}

// When triggering the submission of the annotation, it will check the annotators are following the predefined `RULES`
// and they will be paused otherwise
LSI.on("submitAnnotation", async (_store, annotation) => {
	const results = annotation.serializeAnnotation();
	// { sentiment: "positive", comment: "good" }
	const values = {};
	for (const field of fields) {
		const value = results.find((r) => r.from_name === field)?.value;
		if (!value) return;
		if (value.choices) values[field] = value.choices.join("|");
		else if (value.text) values[field] = value.text;
	}
	let stats = [];
	try {
		stats = JSON.parse(localStorage.getItem(key)) ?? [];
	} catch (e) {
		// Ignore parse errors
	}
	stats.push({ values, created_at: Date.now() / 1000 });

	for (const rule of RULES.global) {
		const result = rule(stats);

		if (result) {
			localStorage.setItem(key, "[]");

			try {
				await pause(result);
			} catch (error) {
				Htx.showModal(error.message, "error");
			}
			return;
		}
	}

	for (const field of fields) {
		if (!values[field]) continue;
		for (const rule of RULES.fields[field]) {
			const result = rule(stats, field);

			if (result) {
				localStorage.setItem(key, "[]");

				try {
					await pause(result);
				} catch (error) {
					Htx.showModal(error.message, "error");
				}
				return;
			}
		}
	}

	localStorage.setItem(key, JSON.stringify(stats));
});

/**
 * Sends a request to the API to pause an annotator
 */
async function pause(verbose_reason) {
	const body = {
		reason: "CUSTOM_SCRIPT",
		verbose_reason,
	};
	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
	const response = await fetch(
		`/api/projects/${project}/members/${Htx.user.id}/pauses`,
		options,
	);
	if (!response.ok) {
		throw new Error(
			`Error pausing the annotator: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data;
}
```

**相关的 LSI 实例方法：**

* [on(eventName, handler)](custom#LSI-on-eventName-handler)
  
**相关的前端事件：**

* [submitAnnotation](/guide/frontend_reference#submitAnnotationn)

## 标注配置

此标注配置向用户展示文本，并要求他们：

* 使用 `<Choices>` 提供情感值
* 使用 `<TextArea>` 对其判断理由进行评论

```xml
<View>
  <Text name="text" value="$text"/>
  <View style="box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;">
    
    <Header value="What is the sentiment of this text?" />
    <Choices name="sentiment" toName="text" choice="single" showInLine="true">
      <Choice value="positive" hotkey="1" />
      <Choice value="negative" hotkey="2" />
      <Choice value="neutral" hotkey="3" />
    </Choices>

    <Header value="Why?" />
    <TextArea name="comment" toName="text" rows="4" placeholder="Add your comment here..." />
  
  </View>
</View>

```

**相关标签：**

* [View](/tags/view.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [Choices](/tags/choices.html)
* [TextArea](/tags/textarea.html)

## 示例数据

```json
[
  {
    "data": {
      "text": "I recently purchased a portable Bluetooth speaker and have been impressed with its clear sound and long battery life. The speaker is compact and easy to use, making it perfect for outdoor adventures."
    }
  },
  {
    "data": {
      "text": "I bought a smartwatch from this vendor and it has exceeded my expectations. The device offers an intuitive user interface and tracks my daily activities accurately while looking very stylish on my wrist."
    }
  },
  {
    "data": {
      "text": "I ordered a pair of noise-cancelling headphones and they don't do anything to cancel out noise. Waste of money."
    }
  }
]
```
