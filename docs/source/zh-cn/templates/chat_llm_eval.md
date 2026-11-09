---
title: 用 LLM 微调 Agent 🔒
type: templates
category: LLM Fine-tuning
cat: llm-fine-tuning
order: 855
meta_description: 用于在与大语言模型（LLM）对话时进行对话级评估的模板。
---

<img src="/images/templates/chat-fine-tune-agent.png" alt="" class="gif-border" style="max-width:552px" />

使用本模板与任意 OpenAI 兼容的大语言模型（包括你自己的模型）进行实时、交互式对话。用于采集真实的多轮对话，以便进行微调。帮助你的 Agent 在关键任务上更加专精、平稳应对上下文切换，并在真实场景中表现更好。

虽然本模板侧重于对话级评估，你也可以修改它来进行逐消息评估。相关示例请参阅我们的[其他聊天模板](gallery_chat)。

!!! error Enterprise
    本模板需要 Label Studio Enterprise。

    Starter Cloud 用户可以使用 `Chat` 标签，但对 LLM 集成的访问受限。此时你可以进行手动对话，或将消息作为预测结果导入。请参阅 [Chat 标签文档](/tags/chat.html#Prediction-format)。

    对于 Community（社区版）用户，请参阅我们的[对话式 AI 模板](gallery_conversational_ai)或[多轮聊天评估模板](multi_turn_chat)。

## 标注配置

```xml
<View>
<Style>
    .chat {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
    }

    <!-- 右侧评估面板的样式 -->
    .evaluation {
        border: 2px solid var(--color-plum-800);
        background-color: var(--color-plum-000);
        color: var(--color-plum-900);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    <!-- 选项文字颜色样式，使其在深色模式下可见 -->
    .evaluation .lsf-choices span {
        color: var(--color-plum-900);
    }

    <!-- 上方说明文字的样式 -->
    .instructions {
      color: var(--color-plum-900);
      background-color: var(--color-plum-000);
      padding-top: 15px;
      padding-bottom: 15px;
    }
    
    <!-- 确保提交后的评论文字在深色模式下仍可读 -->
    [data-color-scheme="dark"] .lsf-row p {
        color: var(--color-sand-100);
    }
    
    <!-- 允许放大说明文字以更好地区分 -->
    .lsf-richtext__container.lsf-htx-richtext {
      font-size: 16px !important;
      line-height: 1.6;
    }
    <!-- 缩小聊天的多余高度，为说明文字留出空间 -->
    .htx-chat { 
      --excess-height: 300px 
    }
  </Style>
  <View style="display: flex; gap: 24px;">
    
    <!-- 左侧：聊天与说明 -->
    <View className="chat" style="flex: 2;">
      
      <View className="instructions">
        <Text name="instructions" value="$text" />
      </View>
            
      <Chat name="chat" value="$chat" 
            llm="openai/gpt-4.1-nano" 
            minMessages="4" 
            editable="true" />
    </View>

    <!-- 右侧：对话级评估 -->
    <View style="flex: 1;" className="evaluation">
      <Header value="Chat evaluation" size="2"/>

      <Header value="Did the agent answer the user's question(s)?"/>
      <Choices name="answered_rating" toName="chat" choice="single" showInline="true" required="true">
        <Choice value="5 - Yes - all of them were answered"/>
        <Choice value="4 - Mostly yes - most of them were answered"/>
        <Choice value="3 - Mixed - some yes, some no"/>
        <Choice value="2 - Mostly no - very few were answered"/>
        <Choice value="1 - No - none of them were answered"/>
      </Choices>

      <Header value="What types of questions were asked?"/>
      <Choices name="topics" toName="chat" choice="multiple" showInline="true">
        <Choice value="Project Setup"/>
        <Choice value="Billing"/>
        <Choice value="Request Live Support"/>
        <Choice value="Labeling Config"/>
        <Choice value="Integrations/SDK"/>
        <Choice value="Bug/Issue"/>
        <Choice value="Other"/>
      </Choices>

      <Header value="Comments (optional)"/>
      <TextArea name="comments" toName="chat" rows="4" placeholder="Add any notes or edge cases..."/>
    </View>
  </View>
</View>
```
    
## 关于此标注配置

此标注配置分为两列：左侧是聊天界面，右侧是对话级评估。

### 样式

样式通过 `<View>` 标签应用，它们会被渲染为 HTML 的 `<div>` 标签。

你可以直接在 `View` 标签上使用内联样式，或者在 `<Style>` 块中为类定义 CSS 规则。随后在标注配置中通过 `className` 参数应用这些类。

例如，这个 `View` 标签同时使用了内联样式和 `className`：

```xml
<View className="chat" style="flex: 2;">
```

`.chat` 类的 CSS 规则在 `<Style>` 块中定义。

!!!info Tip
    `.htx-chat` 是 Label Studio 的一个特殊类，可用于控制界面中聊天区域的高度。

    更多信息请参阅 [Style 标签](/tags/style)。

### 文本

聊天上方有说明文字，用于引导用户尝试通过该文本达成什么目标。

你可以将此说明硬编码到标注配置中（`<Text value="你的说明文字" />`），但如果你在一个项目中会有多个任务，通常你会希望将该文本作为导入数据的一部分来指定。

在本示例中，我们使用 `$text`，因为输入的 JSON 使用了 `"text"` 字段。请参阅下面的[输入数据](#输入数据)。

    更多信息请参阅 [Text 标签](/tags/text)。

### Chat（聊天）

`Chat` 标签提供了一个界面，标注人员可以在其中输入并发送消息。

```xml
<Chat name="chat" value="$chat" 
            llm="openai/gpt-4.1-nano" 
            minMessages="4" 
            editable="true" />
```

* `name`：必填项。当你希望你的控制标签（选项、评分等）引用聊天元素时，使用 `toName="chat"` 指向它。在自定义自己的标注配置时，你可以随意使用任何名称。

* `value`：必填项，应使用引用你的[输入数据](#输入数据)的变量。在本示例中，我们使用 `$chat`，因为输入的 JSON 使用了 `"chat"` 字段。

* `llm`：标注人员发送的消息会被发送给一个 LLM，其回复会显示在标注配置的聊天区域内。更多信息请参阅 [Chat 标签 - 与 LLM 配合使用](/tags/chat.html#Use-with-an-LLM)。

* `minMessages`：用户必须提交的最少消息数，你也可以设置最大值。

    最小值和最大值也可以在任务数据中设置，从而为每个任务设置不同的限制。示例请参阅[聊天机器人评估](chatbot#Chat)。

* `editable`：标注人员和 LLM 发送的消息均可编辑。若要修改为仅特定角色的消息可编辑，你可以指定它们（例如 `editable="user,assistant"`）。

    更多信息及其他参数请参阅 [Chat 标签](/tags/chat.html)。

### 选项与文本域

在本模板中，评估选项应用于整个对话。有关逐消息评估的示例，请参阅[聊天机器人评估](chatbot)、LINK、LINK。

    有关修改这些选项的更多信息，请参阅 [Choices 标签](/tags/choices) 和 [TextArea 标签](/tags/textarea)。

## 输入数据

`Chat` 标签接受 JSON 数据。

### 空聊天

以下内容会为标注人员提供一个空的聊天窗口和说明文字：

```json
{
  "data": {
    "text": "Pretend you are a new user exploring our platform for the first time. Ask detailed questions about setup, configuration, and other features -- sometimes sticking to one topic, sometimes switching between multiple. Make the conversation realistic, as if you are trying to get actual work done.",
    "chat": []
  }
}
```
### 已导入的聊天消息

你也可以按如下方式导入示例聊天消息：

```json
{
  "data": {
    "text": "Pretend you are a new user exploring our platform for the first time. Ask detailed questions about setup, configuration, and other features -- sometimes sticking to one topic, sometimes switching between multiple. Make the conversation realistic, as if you are trying to get actual work done.",
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

    你只能选择和标注由标注人员添加到聊天中的消息，或以[预测结果](/tags/chat.html#Prediction-format)形式导入的消息。

## 相关标签

* [Chat](/tags/chat.html)
* [Style](/tags/style)
* [Text](/tags/text)
* [View](/tags/view)
* [TextArea](/tags/textarea)
* [Choices](/tags/choices)
