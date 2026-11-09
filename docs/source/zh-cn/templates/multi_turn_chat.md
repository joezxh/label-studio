---
title: 多轮聊天评估
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 972
meta_title: 多轮聊天评估模板
meta_description: 使用 SDK 创建一个用于评估多轮聊天的动态模板。
date: 2025-01-21 10:49:57
---


<img src="/images/templates/multi-turn-chat.png" alt="" class="gif-border" width="552px" />

本模板使用了此处的示例：[多轮聊天标注：评估虚拟助手对话](https://github.com/HumanSignal/label-studio-examples/blob/main/multi-turn-chat/Readme.md)

你可以使用此示例在 Label Studio 中评估多轮聊天对话，找出可提升你虚拟助手性能和用户体验的地方。

对于本示例，你需要以下环境：

- Label Studio 实例
- Label Studio SDK（`pip install label-studio-sdk`）
- 带有 pandas 的 Python 3.8+

## 标注配置

在本示例中，标注配置是动态生成的。这是必要的，因为每次聊天的轮次数量（提问与回答）都不同。

要构建你自己的模板 XML，你需要按照以下笔记本中的步骤操作：**[评估虚拟助手对话.ipynb](https://github.com/HumanSignal/label-studio-examples/blob/main/multi-turn-chat/Evaluating%20Virtual%20Assistant%20Conversations.ipynb)**

不过，这里有一个 5 轮聊天的标注配置示例：

```xml
<View>
    <Style>
        
.root {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full height of the viewport */
    margin: 0;
    padding: 0;
}

.container {
    display: flex;
    flex: 1;
    gap: 20px;
    height: 100%; /* Ensure it stretches to fill the root height */
    overflow: hidden; /* Prevent scrolling at the container level */
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent column itself from scrolling */
}

.dialogue {
    max-width: 750px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    overflow-y: auto; /* Enable vertical scrolling */
    flex: 1; /* Stretch to fill the available height */
}

.questions {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    overflow-y: auto; /* Enable vertical scrolling */
    flex: 1; /* Stretch to fill the available height */
}

.panel {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    background-color: #f8f9fa;
}

.panel-header {
    font-weight: bold;
    margin-bottom: 10px;
}

.section-header {
    margin-bottom: 10px;
}

    .turn-1 {
        border: 2px solid #6A5ACD;
        background-color: #EDEDFD;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-2 {
        border: 2px solid #2E8B57;
        background-color: #EAF5F1;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-3 {
        border: 2px solid #FF4500;
        background-color: #FFF4EC;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-4 {
        border: 2px solid #DC143C;
        background-color: #FDECEC;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-5 {
        border: 2px solid #4B0082;
        background-color: #F3EAFD;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    </Style>
    <View className="root">
        <Header value="Dialogue and Questions" />
        <View className="container">
            <View className="column">
                <View className="dialogue">
                    <Header value="Full Conversation" />
                    <Paragraphs name="prg" value="$messages" layout="dialogue" nameKey="role" textKey="content" />
                </View>
            </View>
            <View className="column">
                <View className="questions">
                    <Header value="Answer the questions for each turn" className="section-header" />
                    <Collapse>
                        
    <Panel value="Turn 1" className="panel-header">
        <View className="panel-turn turn-1">
            <Paragraphs name="turn1_prg" value="$turn1_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn1_user_intent" toName="turn1_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn1_response_address_intent" toName="turn1_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn1_response_accuracy_helpfulness" toName="turn1_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn1_response_action" toName="turn1_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 2" className="panel-header">
        <View className="panel-turn turn-2">
            <Paragraphs name="turn2_prg" value="$turn2_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn2_user_intent" toName="turn2_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn2_response_address_intent" toName="turn2_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn2_response_accuracy_helpfulness" toName="turn2_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn2_response_action" toName="turn2_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 3" className="panel-header">
        <View className="panel-turn turn-3">
            <Paragraphs name="turn3_prg" value="$turn3_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn3_user_intent" toName="turn3_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn3_response_address_intent" toName="turn3_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn3_response_accuracy_helpfulness" toName="turn3_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn3_response_action" toName="turn3_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 4" className="panel-header">
        <View className="panel-turn turn-4">
            <Paragraphs name="turn4_prg" value="$turn4_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn4_user_intent" toName="turn4_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn4_response_address_intent" toName="turn4_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn4_response_accuracy_helpfulness" toName="turn4_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn4_response_action" toName="turn4_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 5" className="panel-header">
        <View className="panel-turn turn-5">
            <Paragraphs name="turn5_prg" value="$turn5_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn5_user_intent" toName="turn5_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn5_response_address_intent" toName="turn5_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn5_response_accuracy_helpfulness" toName="turn5_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn5_response_action" toName="turn5_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
                    </Collapse>
                </View>
            </View>
        </View>
    </View>
</View>

<!-- {
    "data": {
        "messages": [
        {
          "role": "user",
          "content": "Hello, I need help with my account."
        },
        {
          "role": "assistant",
          "content": "Sure, I'd be happy to assist you. What seems to be the issue?"
        },
        {
          "role": "user",
          "content": "I can't access my account settings."
        },
        {
          "role": "assistant",
          "content": "Let's reset your password to regain access."
        }
      ],
      "turn1_dialogue": [
        {
          "role": "user",
          "content": "Hello, I need help with my account."
        },
        {
          "role": "assistant",
          "content": "Sure, I'd be happy to assist you. What seems to be the issue?"
        }
      ],
      "turn2_dialogue": [
        {
          "role": "user",
          "content": "I can't access my account settings."
        },
        {
          "role": "assistant",
          "content": "Let's reset your password to regain access."
        }
      ],
      "turn3_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ],
      "turn4_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ],
      "turn5_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ]
    }
  } -->
```

## 关于此标注配置

#### Paragraphs

```xml
<Paragraphs name="prg" value="$messages" layout="dialogue" nameKey="role" textKey="content" />
```
这会在 "Full Conversation"（完整对话）下的一个列中使用 Paragraphs 标签显示整个对话。它将每条消息（含角色和内容）显示为对话形式。

在另一列中，它按轮次组织标注问题。每个 "Turn"（轮次）都在一个可折叠的 `<Panel>` 组件内，并拥有自己的 `<Paragraphs>` 标签。例如：

```xml
<Paragraphs name="turn1_prg" value="$turn1_dialogue" layout="dialogue" … /> 
```
这可以让你只查看与该轮次相关的对话子集。

#### Choices

对于每一轮，有多个 `<Choices>` 区块，每个区块关注不同的问题：

1. 该轮次中用户的意图（多选）。
2. 助手的回答是否解决了该意图（单选）。
3. 助手的回答是否准确/有帮助（单选）。
4. 助手回答所隐含的「动作」（多选）。

`toName` 属性（例如 `toName="turn1_prg"`）将每组选项与该轮的 Paragraphs 对象绑定，因此每个问题都具体关联到该轮次的文本。

## 相关标签

- [Paragraphs](/tags/paragraphs.html)
- [Choices](/tags/choices.html)
