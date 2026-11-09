---
title: RAG 检索
type: templates
category: LLM Fine-tuning
cat: llm-fine-tuning
order: 906
is_new: t
meta_title: 使用 Label Studio 创建用于构建 LLM RAG 系统的排序数据集
meta_description: 用于使用 Label Studio 为 LLM 构建 RAG 系统创建排序数据集的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/llm-ranker.png" alt="" class="gif-border" width="700px" />

本模板为你提供了一种对大语言模型（LLM）回答质量进行排序的工作流。

使用本模板，你将能够比较来自不同 LLM 的回答质量，并通过便捷的拖放界面对动态的项目集合进行排序。

这适用于以下使用场景：

1. 按不同类型对 LLM 回答进行分类：相关、不相关、有偏见、有攻击性等。
2. 比较并排序来自不同模型的回答质量。
3. 为基于检索增强生成（RAG）的聊天机器人和情境学习（in-context learning）中的上下文项目进行排序。
4. 构建 [用于 RLHF 的偏好模型](https://github.com/HumanSignal/RLHF)
5. 评估语义搜索的结果
6. [LLM 路由](https://betterprogramming.pub/unifying-llm-powered-qa-techniques-with-routing-abstractions-438e2499a0d0)

想找一个模型来开始微调过程？请查看 [Label Studio 博客上的指南](https://labelstud.io/blog/five-large-language-models-you-can-fine-tune-today/)。

## 如何创建数据集

按以下 JSON 格式收集一个提示词以及你希望在每个任务中展示的项目列表：

```json
{
  "prompt": "What caused the ancient library of Alexandria to be destroyed?",
  "items": [
    { "id": "llm_1", "title": "LLM 1", "body": "Wars led to library's ruin." },
    { "id": "llm_2", "title": "LLM 2", "body": "Library's end through various wars." },
    { "id": "llm_3", "title": "LLM 3", "body": "Ruin resulted from library wars." }
  ]
}
```

收集数据集示例并将其存储在 `dataset.json` 文件中。

## 如何配置标注界面

`LLM Ranker` 模板包含以下 XML 格式的标注界面：

```xml
<View>
  <Style>
    .htx-text { white-space: pre-wrap; }
    .search-query {
    	font-size: 120%; 
    	width: 800px;
    	margin-bottom: 0.5em;
    	border: 1px solid #eee;
    	padding: 0 1em 1em 1em; 
    	background: #fefefe; 
    }
    .question {
    	font-size: 100%; 
    	width: 800px;
    	background: #fff !important;
    	padding: 1em; 
    }
    .answer {
    	font-size: 100%; 
    	width: 800px;
    	background: #fff !important;
    	padding: 1em; 
    }
    .doc-body { 
    	white-space: pre-wrap;   
    	overflow-wrap: break-word;
  		word-break: keep-all; 
    }
    .doc-footer { 
    	font-size: 85%;
    	overflow-wrap: break-word;
  		word-break: keep-all; 
    }
    h3 + p + p { font-size: 85%; } /* doc id */
  </Style>
  
  <View className="search-query">
    <Header value="Search query"/>
    <Text name="query" value="$query" />
  </View>
  
  <Collapse>
    <Panel value="Full question">
      <View className="question">
        <Text name="question" value="$question" />
      </View>
    </Panel>
  </Collapse>
  
  <Collapse>
    <Panel value="Answer">
      <View className="answer">
        <Text name="answer" value="$answer" />
      </View>
    </Panel>
  </Collapse>
  
  <View style="margin-top: 2em">
    <List name="results" value="$similar_docs" title="Search results" />
    <Ranker name="rank" toName="results">
      <Bucket name="positives" title="Positives" />
      <Bucket name="hard_negatives" title="Hard Negatives" />
    </Ranker>
  </View>
</View>
```

该配置包含以下元素：

- `<Text>` - 用于显示提示词的标签。`value` 属性应设置为提示词元素的名称，在本例中即为 `prompt`。
- `<List>` - 用于显示项目列表的标签。`value` 属性应设置为列表元素的名称（在本例中为 `items`）。
- `<Ranker>` - 用于对列表中的项目进行排序的标签。`toName` 属性应设置为列表元素的名称。
- `<Bucket>` - 用于为已排序的项目创建桶（bucket）的标签。每个桶代表要在该类别中进行排序的项目的高级类别。`name` 属性应设置为桶的名称。

可以使用 `.htx-ranker-item` 类在 Style 标签中对项目进行样式设置。

## 启动你的标注项目

!!! info Tip
    需要帮助来开始使用 Label Studio？请查看我们的 [从零到一教程](https://labelstud.io/blog/zero-to-one-getting-started-with-label-studio/)。

1. 在 Label Studio 中创建新项目
2. 进入 **设置 > 标注界面 > 浏览模板 > 生成式 AI > LLM Ranker**。
3. 保存项目

或者，你可以使用我们的 Python SDK 创建项目：

```python
import label_studio_sdk

ls = label_studio_sdk.Client('YOUR_LABEL_STUDIO_URL', 'YOUR_API_KEY')
project = ls.create_project(title='LLM Ranker', label_config='<View>...</View>')
```

## 导入数据集

要导入你的数据集，请在项目设置中进入 `Import` 并上传数据集文件 `dataset.json`。

使用 Python SDK，将带有输入提示词的数据集导入 Label Studio，使用你刚创建的项目的 `PROJECT_ID`。

运行以下代码：

```python
from label_studio_sdk import Client

ls = Client(url='<YOUR-LABEL-STUDIO-URL>', api_key='<YOUR-API_KEY>')

project = ls.get_project(id=PROJECT_ID)
project.import_tasks('dataset.json')
```

如果你想创建预标注数据（例如由 LLM 生成的排序后的项目顺序），可以连同预标注（pre-annotations）一起导入数据集：

```python
project.import_tasks([{
    "data": {"prompt": "...", "items": [...]},
    "predictions": [{
          "type": "ranker",
          "value": {
            "ranker": {
              "_": [
                "llm_2",
                "llm_1"
              ],
              "biased_results": ["llm_3"],
              "relevant_results": []
            }
          },
          "to_name": "prompt",
          "from_name": "rank"
        }]
}])
```
在 `"value"` 组中，你可以指定不同的桶名称。注意 `"_"` 是表示原始、未分类列表的特殊键。

## 导出数据集

标注结果可以导出为 JSON 格式。要导出数据集，请在项目设置中进入 `Export` 并下载文件。

使用 Python SDK，你可以从 Label Studio 导出带有标注的数据集

```python
annotations = project.export_tasks(format='JSON')
```

`"value"` 中标注结果的输出预期包含以下结构：

```json
"value": {
    "ranker": {
      "_": [
        "llm_2",
        "llm_1"
      ],
      "biased_results": ["llm_3"],
      "relevant_results": []
    }
}
```

其中：

- `"_"` 是表示原始、未分类列表的特殊键（与上面的导入预标注示例相同）。
- `"biased_results"` 和 `"relevant_results"` 是标注界面中定义的桶的名称。

## 相关标签

- [Ranker](/tags/ranker.html)
- [List](/tags/list.html)
- [Text](/tags/text.html)
