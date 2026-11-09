---
title: Fine-tune an Agent without an LLM 🔒
type: templates
category: Chat
cat: Chat
order: 860
meta_description: 用于手动聊天对话的模板。
---

<img src="/images/templates/chat-fine-tune-no-llm.png" alt="" class="gif-border" style="max-width:552px" />

通过同时扮演用户和助手（或与队友配合）来模拟多轮对话。捕捉语气、风格和人格特征以用于微调——使用人工编写的对话，避免千篇一律的“前沿聊天机器人”口吻。

!!! error Enterprise
    此模板需要 Label Studio Enterprise 或 Starter Cloud。 

    对于 Community 用户，请参阅我们的 [对话 AI 模板](gallery_conversational_ai) 或 [多轮对话评估模板](multi_turn_chat)。 

## 标注配置

```xml
<View>
  <Style>
    .lsf-richtext__container.lsf-htx-richtext {
      font-size: 16px !important;
      line-height: 1.6;
      padding-top: 10px;
      padding-bottom: 10px;
      background-color: var(--color-kiwi-100);
      color: var(--color-kiwi-800);
  }
  <!-- Remove excess height from the chat to allow space for instruction text -->
    .htx-chat { 
      --excess-height: 275px 
    }

</Style>
  
  <Text name="instructions" value="$text" />
  
  <Chat name="chat" value="$chat" toName="chat"
        minMessages="4" 
        messageroles="user,assistant"
        editable="true" />
</View>
```

## 关于此标注配置

### 样式

你可以直接在 `View` 标签上使用内联样式，或通过在 `<Style>` 块中为类定义 CSS 规则来应用样式。然后使用 `className` 参数在标注配置中应用这些类。

此标注配置使用内置类和属性来应用样式。 

* `.lsf-richtext__container.lsf-htx-richtext` 是面向文本的内置类，在本例中允许你对说明文本应用样式。 
* `.htx-chat` 面向聊天窗口的高度。

有关更多信息，请参阅 [Style 标签](/tags/style)。

### 文本

聊天上方有说明文本，指导用户他们应该尝试通过文本实现什么。

你可以将其硬编码到标注配置中（`<Text value="Your instruction text" />`），但如果你在项目中有多个任务，你很可能希望将该文本指定为导入数据的一部分。

在此示例中，我们使用 `$text`，因为输入 JSON 使用了 `"text"`。请参阅下方的 [输入数据](#Input-data)。

有关更多信息，请参阅 [Text 标签](/tags/text)。

### 聊天

`Chat` 标签提供了一个界面，标注员可以在其中输入并发送消息。由于此配置不会向 LLM 发送提示，标注员在发送聊天前需要选择一个角色。

```xml
<Chat name="chat" value="$chat" toName="chat"
        minMessages="4" 
        messageroles="user,assistant"
        editable="true" />
```

* `value`：这是必填项，应使用引用你的 [输入数据](#Input-data) 的变量。在此示例中，我们使用 `$chat`，因为输入 JSON 使用了 `"chat"`。 

* `name` 和 `toName`：`Chat` 标签很特殊，因为它既可以充当对象标签，也可以充当控制标签。 

    在此配置中，没有引用 `Chat` 对象的控制标签。因此，为了使你的标注配置完整，你需要让 `Chat` 标签在 `name="chat"` 和 `toName="chat"` 中引用自身。 

    这是唯一允许以这种方式引用自身的标签。 

* `minMessages`：用户必须提交以完成任务的最小消息数。你也可以设置最大值。

    最小值和最大值也可以在任务数据中设置，从而允许你为每个任务设置不同的限制。有关示例，请参阅 [聊天机器人评估](chatbot#Chat)。   

* `editable`：聊天中的消息可编辑。要修改此设置，使仅某些角色的消息可编辑，你可以指定它们（例如 `editable="user,assistant"`）。 

* `messageroles`：标注员将看到一个下拉菜单，其中包含用户和助手角色，他们可以在发送消息时从中选择。

  你可以使用 `user`、`assistant`、`system`、`tool` 和 `developer` 来自定义此参数。

有关更多信息和其他参数，请参阅 [Chat 标签](/tags/chat.html)。 


## 输入数据

`Chat` 标签接受 JSON 数据。 

### 空聊天

以下是为标注员提供空聊天窗口和说明文本的示例：

```json
{
  "data": {
    "text": "Simulate a conversation between a curious customer ('user') and a helpful agent ('assistant'). Experiment with tone and personality—make the agent sound human, natural, and aligned with our brand voice. Try out different quirks (humor, warmth, brevity) while avoiding overly ‘AI-ish’ habits like excessive emojis, filler words, or generic phrases.",
    "chat": []
  }
}
```

### 导入的聊天消息

你也可以按如下方式导入示例聊天消息：

```json
{
  "data": {
    "text": "Simulate a conversation between a curious customer ('user') and a helpful agent ('assistant'). Experiment with tone and personality—make the agent sound human, natural, and aligned with our brand voice. Try out different quirks (humor, warmth, brevity) while avoiding overly ‘AI-ish’ habits like excessive emojis, filler words, or generic phrases.",
    "chat": [
        {
            "role": "user",
            "content": "Demo chat message 1"
        },
        {
            "role": "assistant",
            "content": "Demo chat message 2"
        },
        {
            "role": "developer",
            "content": "Demo chat message 3 "
        }
    ]
  }
}
```

!!! attention
    你导入的聊天消息不可被选中。这意味着你无法编辑它们，也无法对它们应用标注（评分、选项等）。

    你只能选中和标注由标注员添加到聊天中的消息，或作为 [预测](/tags/chat.html#Prediction-format) 导入的消息。

## 相关标签

* [Chat](/tags/chat.html)
* [Style](/tags/style)
* [View](/tags/view)
* [Text](/tags/text)
