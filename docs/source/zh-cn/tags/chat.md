---
title: Chat
type: tags
order: 302
meta_title: 用于对话记录的 Chat 标签
meta_description: 显示并扩展对话记录；可选地向 LLM 请求助手回复。支持消息编辑控制和最小/最大限制。
---

`Chat` 标签用于显示对话记录，并允许标注员通过添加新消息来扩展它：

![Screenshot](/images/tags/chat.png)

与以下数据类型配合使用：消息对象的 JSON 数组

!!! error Enterprise
    该标签仅面向 Label Studio Enterprise 和 Starter Cloud 用户提供。

### 与 LLM 配合使用

该标签可选地向 LLM 发送请求，然后发布回复。

要使用 LLM，你需要完成两件事：

1. 为你的组织添加模型提供方的 API 密钥。请参阅 [面向组织的模型提供方 API 密钥](https://docs.humansignal.com/guide/model_providers)。

2.  添加模型提供方的 API 密钥后，将 `<Chat>` 标签上的 `llm` 属性设置为你要使用的模型。

    `llm` 属性必须使用 `<provider>/<model>` 格式。例如 `llm="openai/gpt-5"`。

!!! note
    Starter Cloud 用户对聊天的 LLM 功能访问受限。

    在 Starter Cloud 中，你不能添加模型提供方。不过，你将可以使用开箱即用的 OpenAI 模型，并获得 5.00 美元的测试额度。如果你希望添加自己的模型并更广泛地使用交互式聊天，可以 [升级到 Enterprise](https://humansignal.com/pricing/)。

### 可编辑消息

你可以允许标注员编辑聊天消息，包括来自 LLM 的回复。

将 `editable` 参数设置为 `"true"`，或设置为应可编辑的角色列表（例如 `"editable="user,system"`）。

要编辑消息，将鼠标悬停在其上即可查看编辑图标。

标注员无法编辑从导入任务数据中带来的消息。

![Screenshot](/images/tags/chat-edit.png)

### 基于角色的评估

你可以仅在选中特定角色的消息时显示选项。

为此，将控件包裹在 `<View>` 块中并设置 `visibleWhen` 和 `whenRole` 参数。这样可确保控件仅在标注员选中该角色的消息时显示。

例如，标注员只有在选中 user 角色的消息时才会看到以下选项：

```xml
<View visibleWhen="region-selected" whenRole="user">
  <Choices name="choices" toName="chat" perRegion="true">
    <Choice value="User choice 1"/>
    <Choice value="User choice 2"/>
  </Choices>
</View>
```
<video style="max-width: 800px;" class="gif-border" autoplay loop muted>
  <source src="/images/tags/chat-role-eval.mp4">
</video>

{% insertmd zh-cn/includes/tags/chat.md %}

## 示例

### `<Chat>` 标签示例

以下标注配置是 Chat 标签最基本的实现。添加自引用的 `toName` 参数后，无需任何其他控件标签即可使用它。

此标注配置允许标注员提交他们在下拉菜单中选择的、来自不同角色的消息。

```xml
<View>
  <Chat name="chat" value="$chat" toName="chat" />
</View>
```

你可以扩展此配置，允许来自 LLM 的自动回复，并添加控件标签来评估消息，如下例所示。

### 标注配置示例

评估助手回复：

```xml
<View>
  <Style>
    .htx-chat{flex-grow:1}
    .htx-chat-sidepanel{flex:300px 0 0;display:flex;flex-direction:column;border-left:2px solid #ccc;padding-left:16px}
  </Style>
  <View style="display:flex;width:100%;gap:1em">
    <Chat name="chat" value="$chat" llm="openai/gpt-4.1-nano" minMessages="4" maxMessages="10" editable="true" />
    <View className="htx-chat-sidepanel">
      <View style="position:sticky;top:14px">
        <!-- Invitation/explanation on how to evaluate -->
        <View visibleWhen="no-region-selected">
          <Text name="_3" value="Click on a message to rate specific parts of the conversation"/>
        </View>
        <!-- Evaluate assistant messages -->
        <View visibleWhen="region-selected" whenRole="assistant">
          <Text name="_1" value="Rate the response" />
          <Rating name="response_rating" toName="chat" perRegion="true" />
        </View>
      </View>
      <!-- Evaluate the whole conversation -->
      <View style="margin-top:auto;height:130px">
        <Header size="4">Overall quality of this conversation</Header>
        <Rating name="rating" toName="chat" />
      </View>
    </View>
  </View>
</View>
```

## 示例输入数据

### 导入 JSON 数据

以下示例 JSON 输入数据在 `value="$chat"` 参数中被调用。

- `role`    — 说话人标识；支持的角色：`user`、`assistant`、`system`、`tool`、`developer`
- `content` — 消息文本

```json
{
  "data": {
    "chat": [
        {
            "role": "user",
            "content": "Start with a kick-off message to validate the quality of it based on further conversation"
        },
        {
            "role": "assistant",
            "content": "A response from the LLM"
        }
    ]
  }
}
```

!!! note 隐私说明
    作为导入数据或预测一部分的消息，遵循与你导入的其他数据相同的隐私规则，并在使用云存储时可通过预签名 URL 访问。标注过程中添加的消息视为标注结果。请参阅我们的 [安全文档](/guide/security#Secure-access-to-data-in-Label-Studio)。

!!! attention
    你导入的聊天消息不可被选中。这意味着你无法编辑它们，也无法对它们应用标注（评分、选项等）。

    你只能选中和标注由标注员添加到聊天中的消息，或作为预测导入的消息。

如果要使用空白聊天并让标注员添加所有消息，只需导入：

```json
{
  "data": {
    "chat": []
  }
}
```

### 预测格式

由于用户无法选中或评估作为数据导入的聊天消息，因此当你希望允许用户评估在其他地方生成的对话时，可以使用预测。

!!! note
    你应当包含一个以毫秒为单位的时间戳字段（`createdAt`）。这可以确保在修改消息（编辑、重发等）时保持其正确的顺序。

请参阅以下示例：

```json
[
  {
    "data": {
      "chat": [
        { 
          "text": "Review the conversation in detail. As you read through it, click on individual messages to provide feedback about accuracy, clarity, and intent."
        }
      ]
    },
    "predictions": [
      {
        "model_version": "demo-model",
        "result": [
          {
            "type": "chatmessage",
            "value": {
              "chatmessage": {
                "role": "user",
                "content": "I'm onboarding a new annotator. What are the first steps to ensure quality and speed?",
                "createdAt": 1757612212681
              }
            },
            "to_name": "chat",
            "from_name": "chat"
          },
          {
            "type": "chatmessage",
            "value": {
              "chatmessage": {
                "role": "assistant",
                "content": "Start by creating their account and assigning the Annotator role so permissions are scoped correctly. Add concise labeling instructions that appear before labeling. Use a small ground-truth set and require overlap (e.g., 2 annotators per task) with a reviewer to resolve disagreements. Enable comments so reviewers can leave precise, in-task feedback.",
                "createdAt": 1757612363718
              }
            },
            "to_name": "chat",
            "from_name": "chat"
          }
        ]
      }
    ]
  }
]
```

## 相关模板

- [使用 LLM 微调一个 Agent](/templates/chat_llm_eval)
- [不使用 LLM 微调一个 Agent](/templates/chat_eval)
- [聊天机器人评估](/templates/chatbot)
- [Chat 中的红队测试](/templates/chat_red_team)
- [为 RLHF 评估生产对话](/templates/chat_rlhf)
