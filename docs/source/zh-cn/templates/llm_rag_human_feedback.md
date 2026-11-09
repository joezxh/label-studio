---
title: 结合人类反馈评估 RAG
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 965
is_new: t
meta_description: 评估检索到文档的上下文相关性，并对 LLM 回答进行打分。
date: 2024-07-26 14:49:29
---

<img src="/images/templates/evaluate-rag-human-feedback.png" alt="" class="gif-border" width="700px"/>

在处理 RAG（检索增强生成）流水线时，你的目标不仅是评估单个 LLM 回答，还要纳入对检索文档的各种评估，例如上下文相关性和回答相关性、忠实度。

在本示例中，你将创建一个标注界面，用于评估：

- 检索文档的上下文相关性
- 回答相关性
- 回答忠实度

有关如何将此模板与 Label Studio SDK 配合使用的教程，请参阅 [评估 LLM 回答](https://api.labelstud.io/tutorials/tutorials/evaluate-llm-responses)。

## 配置标注界面

[创建一个项目](/guide/setup_project)并使用以下标注配置：

```xml
<View>
  <Style>
    .htx-text {white - space: pre-wrap;}
    .question {
    font - size: 120%;
    width: 800px;
    margin-bottom: 0.5em;
    border: 1px solid #eee;
    padding: 0 1em 1em 1em;
    background: #fefefe;
  }
    .answer {
    font - size: 120%;
    width: 800px;
    margin-top: 0.5em;
    border: 1px solid #eee;
    padding: 0 1em 1em 1em;
    background: #fefefe;
  }
    .doc-body {
    white - space: pre-wrap;
    overflow-wrap: break-word;
    word-break: keep-all;
  }
    .doc-footer {
    font - size: 85%;
    overflow-wrap: break-word;
    word-break: keep-all;
  }
    h3 + p + p {font - size: 85%;} /* doc id */
  </Style>

  <View className="question">
    <Header value="Question"/>
    <Text name="question" value="$question"/>
  </View>

  <View style="margin-top: 2em">
    <Header value="Context"/>
    <List name="results" value="$similar_docs" title="Retrieved Documents"/>
    <Ranker name="rank" toName="results">
      <Bucket name="relevant" title="Relevant"/>
      <Bucket name="non_relevant" title="Non Relevant"/>
    </Ranker>
  </View>

  <View className="answer">
    <Header value="Answer"/>
    <Text name="answer" value="$answer"/>
  </View>
  <Collapse>
    <Panel value="How relevant is the answer to the provided context?">
      <Choices name="answer_relevancy" toName="question" showInline="true">
        <Choice value="Relevant" html="&lt;div class=&quot;thumb-container&quot; style=&quot;display: flex; gap: 20px;&quot;&gt;
  &lt;div class=&quot;thumb-box&quot; id=&quot;thumb-up&quot; style=&quot;width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;&quot;&gt;
      &lt;span class=&quot;thumb-icon&quot; style=&quot;font-size: 48px;&quot;&gt;&amp;#128077;&lt;/span&gt; &lt;!-- Thumbs Up Emoji --&gt;
  &lt;/div&gt;&lt;/div&gt;"/>
        <Choice value="Non Relevant" html="&lt;div class=&quot;thumb-container&quot; style=&quot;display: flex; gap: 20px;&quot;&gt;
&lt;div class=&quot;thumb-box&quot; id=&quot;thumb-down&quot; style=&quot;width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;&quot;&gt;
      &lt;span class=&quot;thumb-icon&quot; style=&quot;font-size: 48px;&quot;&gt;&amp;#128078;&lt;/span&gt; &lt;!-- Thumbs Down Emoji --&gt;
  &lt;/div&gt;
&lt;/div&gt;"/>
      </Choices>

    </Panel>
  </Collapse>

  <Collapse>
    <Panel value="If the answer factually aligns with the retrieved context?">
      <Choices name="faithfulness" toName="question" showInline="true">
        <Choice value="Relevant" html="&lt;div class=&quot;thumb-container&quot; style=&quot;display: flex; gap: 20px;&quot;&gt;
  &lt;div class=&quot;thumb-box&quot; id=&quot;thumb-up&quot; style=&quot;width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;&quot;&gt;
      &lt;span class=&quot;thumb-icon&quot; style=&quot;font-size: 48px;&quot;&gt;&amp;#128077;&lt;/span&gt; &lt;!-- Thumbs Up Emoji --&gt;
  &lt;/div&gt;&lt;/div&gt;"/>
        <Choice value="Non Relevant" html="&lt;div class=&quot;thumb-container&quot; style=&quot;display: flex; gap: 20px;&quot;&gt;
&lt;div class=&quot;thumb-box&quot; id=&quot;thumb-down&quot; style=&quot;width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;&quot;&gt;
      &lt;span class=&quot;thumb-icon&quot; style=&quot;font-size: 48px;&quot;&gt;&amp;#128078;&lt;/span&gt; &lt;!-- Thumbs Down Emoji --&gt;
  &lt;/div&gt;
&lt;/div&gt;"/>
      </Choices>

    </Panel>
  </Collapse>
</View>
```

该配置包含以下元素：

* `<View>` - 所有标注配置都必须包含基础的 `View` 标签。在此配置中，`View` 标签用于配置区块的显示，类似于 HTML 中的 div 标签。它有助于组织标注界面的布局。
* `<Style>` - `Style` 标签用于定义应用于 `View` 内部元素的 CSS 样式。在此配置中，它为标注界面布局的各个部分设置了样式。
* `<Header>` - `Header` 标签用于在标注界面内显示标题。标题的文本在 `value` 参数中定义。
* `<Text>` - `Text` 标签用于显示输入数据提供的文本。根据下面的示例输入数据，文本块显示的是源 JSON 中 `question` 或 `answer` 键的信息。你可能需要调整这些变量以匹配你自己的 JSON 数据。
* `<List>` - 列出检索到的文档。根据下面的示例输入数据，你正在从源 JSON 的 `similar_docs` 字段填充该列表。
* `<Ranker>` - `Ranker` 标签创建 UI 元素，允许你通过拖放将列表项排序到不同的桶中。
* `<Bucket>` - `Bucket` 标签定义了 Ranker 中可放置项的类别或容器。
- `<Collapse>` - `Collapse` 标签创建一个可由用户展开或收起的可折叠区块。
- `<Panel>` - `Panel` 标签用在 Collapse 元素内部，用于定义可展开或收起的内容。
- `<Choices>` - `Choices` 标签呈现一组供标注人员选择的选项，由 `name` 和 `toName` 参数指定。
- `<Choice>` - `Choice` 标签定义了 Choices 标签内单个选项。在此示例中，选项被样式化为可点击的点赞（thumbs up）和点踩（thumbs down）图标。

## 输入数据

在本示例中，你包含了提示词、回答以及用作上下文的文档。

```json
[
  {
    "data": {
      "question": "Can I use Label Studio for LLM evaluation?",
      "answer": "Yes, you can use Label Studio for LLM evaluation.",
      "similar_docs": [
        {"id": 0, "body": "Label Studio is a data labeling tool."},
        {"id": 1, "body": "Label Studio is a data labeling tool for AI projects."}
      ]
    }
  }
]
```

### 使用 LlamaIndex

你可以使用 [LlamaIndex 框架](https://www.llamaindex.ai/) 来收集此类数据。

```
pip install llama-index
```

例如，你可以使用一个脚本来创建一个 RAG 流水线，以回答关于 GitHub issue 的用户查询：

```python
import os
from llama_index.readers.github import GitHubRepositoryIssuesReader, GitHubIssuesClient
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.core.callbacks import CallbackManager, LlamaDebugHandler, CBEventType

reader = GitHubRepositoryIssuesReader(
github_client=GitHubIssuesClient(),
owner="HumanSignal",
repo="label-studio",
)

llama_debug = LlamaDebugHandler()
callback_manager = CallbackManager([llama_debug])


# check if storage already exists
PERSIST_DIR = "./llama-index-storage"
if not os.path.exists(PERSIST_DIR):
# load the documents and create the index
documents = reader.load_data(state=GitHubRepositoryIssuesReader.IssueState.CLOSED)
index = VectorStoreIndex.from_documents(documents, callback_manager=callback_manager)
# store it for later
index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
# load the existing index
storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
index = load_index_from_storage(storage_context, callback_manager=callback_manager)

query_engine = index.as_query_engine()
question = "Can I use Label Studio for LLM evaluation?"
answer = query_engine.query(question)

# accessing the list of top retrieved documents from callback
event_pairs = llama_debug.get_event_pairs(CBEventType.RETRIEVE)
retrieved_nodes = list(event_pairs[0][1].payload.values())[0]
retrieved_documents = [node.text for node in retrieved_nodes]
```

现在你可以使用 SDK 来构建一项任务，在给定上述标注配置的情况下，该任务可以直接导入 Label Studio 项目：

```python
task = {
  "question": question,
  "answer": answer,
  "similar_docs": [{"id": i, "body": text} for i, text in enumerate(retrieved_documents)]
}
```

## 相关标签

- [View](/tags/view.html)
- [Style](/tags/style.html)
- [Text](/tags/text.html)
- [Header](/tags/header.html)
- [Ranker](/tags/ranker.html)
- [Collapse](/tags/collapse.html)
- [List](/tags/list.html)
- [Choices](/tags/choices.html)
- [Choice](/tags/choice.html)
