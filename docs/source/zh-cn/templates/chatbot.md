---
title: 聊天机器人评估 🔒
type: templates
category: Chat
cat: Chat
order: 851
meta_description: 用于评估聊天机器人的模板。
---

<img src="/images/templates/chat-evaluate-agent.png" alt="" class="gif-border" style="max-width:552px"  />

使用本模板快速评估你的聊天机器人是否准备好投入生产。让评审人员针对回答质量、是否基于正确来源、安全性以及语气，对真实对话进行打分。

然后将结论转化为行动：微调模型、扩展知识库，或优化系统提示词，以缩短与生产环境之间的差距。

!!! error Enterprise
    本模板需要 Label Studio Enterprise 或 Starter Cloud。

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
    .evaluation {
        border: 2px solid var(--color-blueberry-800);
        background: var(--color-blueberry-100);
        color: var(--color-blueberry-900);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
     <!-- 选项文字 -->
     .evaluation span {
        color: var(--color-blueberry-900);
        line-height: 1.1;
     }
    <!-- 星级评分 -->
     .evaluation .ant-rate-star.ant-rate-star-full span {
       color: #f4aa2a;
      }
    
    .instructions {
       color: var(--color-blueberry-900);
       background-color: var(--color-blueberry-100);
       padding-top: 15px;
       padding-bottom: 15px;
    }
    <!-- 允许放大说明文字 -->
    .lsf-richtext__container.lsf-htx-richtext {
      font-size: 16px !important;
      line-height: 1.3;
    }
    
    <!-- 缩小聊天的多余高度，为说明文字留出空间 -->
    .htx-chat { 
      --excess-height: 275px 
    }
  </Style>
  <View style="display: flex; gap: 24px;">
    
    <!-- 左侧：对话 -->
    <View className="chat" style="flex: 2;">
      <View className="instructions">
        <Text name="instructions" value="Review the conversation in detail. 
                                         As you read through it, click on individual messages to 
                                         provide feedback about accuracy, clarity, and intent." />
      </View>
      
      <Chat name="chat" value="$chat" 
            minMessages="2"
            maxMessages="$max"
            editable="false" />
    </View>

    <!-- 右侧：对话级评估 -->
    <View style="flex: 1;" className="evaluation">
      <View style="position:sticky;top:14px">
        
        <!-- 仅在没有选中消息时可见 -->
         <View visibleWhen="no-region-selected">
          <View>
          <Header value="Click on a message to evaluate it"/>
          </View>
        </View>
        
        <!-- 仅当选中一条用户消息时可见，且只应用于所选消息 -->
        <View visibleWhen="region-selected" whenRole="user">
          <Header value="Rate message clarity"/>
          <Rating name="user_clarity" toName="chat" perRegion="true" />
          <Header value="Classify the topic"/>
          <Choices name="request_classification" toName="chat" perRegion="true" >
            <Choice value="Labeling Config" />
            <Choice value="Project setup" />
            <Choice value="Importing/exporting data" />
            <Choice value="SDK/API" />
            <Choice value="ML backends" />
            <Choice value="Predictions" />
          </Choices>
       </View>
        
        <!-- 仅当选中一条助手消息时可见，且只应用于所选消息 -->
        <View visibleWhen="region-selected" whenRole="assistant">
          <Header value="Rate response clarity"/>
          <Rating name="assistant_response_clarity" toName="chat" perRegion="true" />
          
          <Header value="Rate response accuracy"/>
          <Rating name="assistant_response_accuracy" toName="chat" perRegion="true" />
          
          <Header value="Documentation provided"/>
          <Choices name="docs" toName="chat" perRegion="true" >
            <Choice value="All proper documentation provided" />
            <Choice value="Provided some documentation, missing some" />
            <Choice value="Missing critical documentation, 
                           provided incorrect or irrelevant documentation" />
          </Choices>
          
          <Header value="Answered question"/>
          <Choices name="questions_answered" toName="chat" perRegion="true" >
            <Choice value="Yes" />
            <Choice value="No" />
            <Choice value="Partial" />
          </Choices>
          
          <Header value="Tone/Style"/>
          <Choices name="style" toName="chat" perRegion="true" choice="multiple" >
            <Choice value="Too verbose" />
            <Choice value="Too friendly" />
            <Choice value="Too technical" />
          </Choices>
          
       </View>
     </View>
   </View>
 </View>
</View>
```

## 关于此标注配置

此标注配置分为两列：左侧是聊天界面，右侧是消息评估。

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
            minMessages="2"
            maxMessages="$max"
            editable="false" />
```
* `name`：必填项。当你希望你的控制标签（选项、评分等）引用聊天元素时，使用 `toName="chat"` 指向它。在自定义自己的标注配置时，你可以随意使用任何名称。

* `value`：必填项，应使用引用你的[输入数据](#输入数据)的变量。在本示例中，我们使用 `$chat`，因为输入的 JSON 使用了 `"chat"` 字段。

* `minMessages`：用户必须提交的最少消息数。

* `maxMessages`：用户可提交的最大消息数。在本示例中，你使用一个变量来从任务数据中动态设置它（`$max`），从而可以逐个任务地改变最大值。请参阅下面的[输入数据](#输入数据)。

* `editable`：在本示例中，你不允许标注人员编辑消息。

    更多信息及其他参数请参阅 [Chat 标签](/tags/chat.html)。

!!! note
    本模板设计用于评估已导入的对话，因此你很可能希望从外部来源将消息作为[预测结果](/tags/chat.html#Prediction-format)导入。

### 逐消息评估

此配置仅允许逐消息评估。标注人员必须点击聊天界面中的某条消息，随后该角色对应的选项会出现在右侧。有关对话级评估的示例，请参阅[用 LLM 微调 Agent](chat_llm_eval)。

例如：

```xml
<View visibleWhen="region-selected" whenRole="user">
```

* `visibleWhen` - 仅当选中一个区域（在本例中是聊天消息）时，此区块内的控件才可见。

* `whenRole` - 进一步细化 `visibleWhen`，使得仅当选中的区域（消息）来自指定角色时，此区块内的控件才可见。

    更多信息请参阅 [View 标签](/tags/view)。

### 评分与选项

由于你的聊天中很可能包含来自每个角色的多个消息，请使用 `perRegion="true"`，以确保用户能够对对话中的多条消息进行标注。

```xml
<Rating name="assistant_response_accuracy" toName="chat" perRegion="true" />
```

    更多信息请参阅 [Rating 标签](/tags/rating)、[Choice 标签](/tags/choice) 和 [Choices 标签](/tags/choices)。

## 输入数据

`Chat` 标签接受 JSON 数据。

### 空聊天

以下内容会为标注人员提供一个空的聊天窗口和说明文字：

```json
{
  "data": {
    "text": "Review the conversation in detail. As you read through it, click on individual messages to provide feedback about accuracy, clarity, and intent.",
    "chat": []
  }
}
```

### 已导入的聊天消息

你也可以按如下方式导入示例聊天消息：

```json
{
  "data": {
    "text": "Review the conversation in detail. As you read through it, click on individual messages to provide feedback about accuracy, clarity, and intent.",
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

    你只能选择和标注由标注人员添加到聊天中的消息，或以预测结果形式导入的消息。

### 预测结果

如果你希望能够选中消息并对其评估，则可以使用[预测结果](/tags/chat.html#Prediction-format)。例如：


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


## 相关标签

* [Chat](/tags/chat.html)
* [Style](/tags/style)
* [Text](/tags/text)
* [View](/tags/view)
* [Rating](/tags/rating)
* [Choices](/tags/choices)
