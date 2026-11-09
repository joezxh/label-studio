---
title: RAG with a Langchain search agent
type: guide
tier: all
order: 45
hide_menu: true
hide_frontmatter_title: true
meta_title: RAG with a Langchain search agent
meta_description: Use Langchain, OpenAI, and Google to generate responses based on Google search results. 
categories:
    - Generative AI
    - Retrieval Augmented Generation
    - Google
    - OpenAI
    - Langchain
image: "/guide/ml_tutorials/langchain.png"
---

# Langchain 搜索代理

此示例演示了如何将 Label Studio 与自定义的机器学习后端一起使用。

它使用一个基于 [Langchain](https://www.langchain.com/) 的代理，该代理接受文本输入，搜索 Google，并基于搜索结果返回答案（即检索增强生成，Retrieval Augmented Generation）。

## 开始之前

在开始之前，你必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`langchain_search_agent` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/langchain_search_agent)。

## 先决条件

### 使用 Google 搜索

要使用 Google 搜索引擎，你需要拥有一个 Google 自定义搜索引擎（CSE）API 密钥和一个搜索引擎 ID。

```
GOOGLE_API_KEY=<your_google_api_key>
GOOGLE_CSE_ID=<your_google_search_engine_id>
```

有关更多信息，请参阅 [可编程搜索引擎 ID](https://support.google.com/programmable-search/answer/12499034?hl=en)。

### 使用 OpenAI

要使用 OpenAI，你需要拥有一个 OpenAI API 密钥。

```
OPENAI_API_KEY=<your_openai_api_key>
```

有关更多信息，请参阅 [在哪里可以找到我的 OpenAI API 密钥？](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)。

## 标注界面

标注界面必须包含：

- 输入提示
- LLM 响应
- 搜索结果片段
- 分类标签

#### 示例

```xml

<View>
    <Style>
        .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
    </Style>
    <Text name="input" value="$text"/>
    <View className="prompt">
        <TextArea name="prompt" toName="input" maxSubmissions="1" editable="true"/>
    </View>
    <TextArea name="response" toName="input" maxSubmissions="1" editable="true"/>
    <TextArea name="snippets" toName="input"/>
    <Choices name="classification" toName="input" choice="single" showInLine="true">
        <Choice value="Good"/>
        <Choice value="Bad"/>
    </Choices>
</View>
```

## 快速开始

1. 在 `http://localhost:9090` 上构建并启动机器学习后端：

```bash
docker-compose up
```

2. 验证后端是否正在运行：

```bash
$ curl http://localhost:9090/health
{"status":"UP"}
```

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **模型（Model）** 页面，[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。
