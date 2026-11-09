---
title: 视觉排序器
type: templates
category: Ranking and Scoring
cat: ranking-and-scoring
order: 401
is_new: t
meta_title: 使用 Label Studio 创建用于文本到图像模型的数据集
meta_description: 用于使用 Label Studio 创建文本到图像模型排序数据集的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/visual-ranker.png" alt="" class="gif-border" width="700px"/>

本模板提供了一套工作流，用于为文本到图像模型（如 Dall-E、Midjourney、Stable Diffusion 等）的回答质量进行排序。

使用本模板，你可以比较来自不同生成式 AI 模型的回答质量，并通过便捷的拖放界面对动态的项目集合进行排序。

这对以下使用场景很有帮助：

1. 按不同类型对回答进行分类：相关、不相关、有偏见、有攻击性等。
2. 比较并排序来自不同模型的回答质量。
3. 评估语义搜索的结果
4. 个性化与推荐系统、电商平台商品搜索

## 如何创建数据集

按以下形式收集一个提示词以及你希望在每個任务中展示的图像列表：

```json

[{
  "prompt": "Generate a high-quality image of a stylish, ergonomic chair for a home office. ",
  "images": [
      {
          "id": "chair_1",
          "html": "<img src='/static/samples/chairs/chair1.png'/>"
      },
        {
          "id": "chair_2",
          "html": "<img src='/static/samples/chairs/chair2.png'/>"
      },
        {
          "id": "chair_3",
          "html": "<img src='/static/samples/chairs/chair3.png'/>"
      },
        {
          "id": "chair_4",
          "html": "<img src='/static/samples/chairs/chair4.png'/>"
      }
  ]
}, ...]
```

每个条目都包含 `"html"` 字段，你可以在其中指定要显示的图像的路径。
这是一个通用的 HTML 渲染器，因此你可以在此处使用任何 HTML 标签。

收集数据集示例并将其存储在 `dataset.json` 文件中。

## 启动你的标注项目

*需要帮助来开始使用 Label Studio？请查看我们的 [从零到一教程](https://labelstud.io/blog/zero-to-one-getting-started-with-label-studio/)。*

1. 在 Label Studio 中创建一个新项目
2. 进入 `设置 > 标注界面 > 浏览模板 > 生成式 AI > LLM Ranker`
3. 保存项目

或者，你可以使用 Python SDK 创建项目：

```python
import label_studio_sdk

ls = label_studio_sdk.Client('YOUR_LABEL_STUDIO_URL', 'YOUR_API_KEY')
project = ls.create_project(title='Visual Ranker', label_config='<View>...</View>')
```

## 导入数据集

要导入数据集，请在项目设置中进入 `Import` 并上传数据集文件 `dataset.json`。

使用 Python SDK，你可以将带有输入提示词的数据集导入 Label Studio。使用你刚创建的项目的 `PROJECT_ID`，运行以下代码：

```python
from label_studio_sdk import Client

ls = Client(url='<YOUR-LABEL-STUDIO-URL>', api_key='<YOUR-API_KEY>')

project = ls.get_project(id=PROJECT_ID)
project.import_tasks('dataset.json')
```

## 配置标注界面

使用以下配置作为标注界面：

```xml
<View>
      <Style>
          <!-- 在此自定义你的 CSS 样式 -->
      </Style>

   <View className="product-panel">
      <Text name="prompt" value="$prompt"/>
    </View>
    <View>
      <List name="generated_images" value="$images" title="Generated Images" />
      <Ranker name="rank" toName="generated_images">
  </Ranker> 
    </View>
  </View>
```
它包含以下元素：
- `<Text>` 定义任务的提示词
- `<List>` 显示要评估的生成图像列表
- `<Ranker>` 提供对图像重新排序的功能

## 导出数据集

标注结果可以导出为 JSON 格式。要导出数据集，请在项目设置中进入 `Export` 并下载文件。

使用 Python SDK，你可以从 Label Studio 导出带有标注的数据集。

```python
annotations = project.export_tasks(format='JSON')
```

`"value"` 中标注结果的输出预期包含以下结构：

```json
"value": {
    "ranker": {
      "rank": [
        "chair_2",
        "chair_4",
        "chair_3",
        "chair_1"
      ]
    }
}
```

列表中的条目是图像的 "id"，按排序后的顺序排列

## 相关标签

- [Ranker](/tags/ranker.html)
- [List](/tags/list.html)
