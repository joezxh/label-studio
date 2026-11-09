## 标注任务的 Label Studio JSON 格式

当你标注数据时，Label Studio 以 JSON 格式存储输出。每个已完成任务的原始 JSON 结构使用以下示例：

```json
{
    "id": 1,
    "created_at":"2021-03-09T21:52:49.513742Z",
    "updated_at":"2021-03-09T22:16:08.746926Z",
    "project":83,

    "data": {
        "image": "https://example.com/opensource/label-studio/1.jpg"
    },

    "annotations": [
        {
            "id": "1001",
            "result": [
                {
                    "from_name": "tag",
                    "id": "Dx_aB91ISN",
                    "source": "$image",
                    "to_name": "img",
                    "type": "rectanglelabels",
                    "value": {
                        "height": 10.458911419423693,
                        "rectanglelabels": [
                            "Moonwalker"
                        ],
                        "rotation": 0,
                        "width": 12.4,
                        "x": 50.8,
                        "y": 5.869797225186766
                    }
                }
            ],
            "was_cancelled":false,
            "ground_truth":false,
            "created_at":"2021-03-09T22:16:08.728353Z",
            "updated_at":"2021-03-09T22:16:08.728378Z",
            "lead_time":4.288,
            "result_count":0,
            "task":1,
            "completed_by":10
        }
    ],

    "predictions": [
        {
            "created_ago": "3 hours",
            "model_version": "model 1",
            "result": [
                {
                    "from_name": "tag",
                    "id": "t5sp3TyXPo",
                    "source": "$image",
                    "to_name": "img",
                    "type": "rectanglelabels",
                    "value": {
                        "height": 11.612284069097889,
                        "rectanglelabels": [
                            "Moonwalker"
                        ],
                        "rotation": 0,
                        "width": 39.6,
                        "x": 13.2,
                        "y": 34.702495201535505
                    }
                }
            ]
        },
        {
            "created_ago": "4 hours",
            "model_version": "model 2",
            "result": [
                {
                    "from_name": "tag",
                    "id": "t5sp3TyXPo",
                    "source": "$image",
                    "to_name": "img",
                    "type": "rectanglelabels",
                    "value": {
                        "height": 33.61228406909789,
                        "rectanglelabels": [
                            "Moonwalker"
                        ],
                        "rotation": 0,
                        "width": 39.6,
                        "x": 13.2,
                        "y": 54.702495201535505
                    }
                }
            ]
        }
    ]
}
```

### 相关 JSON 属性说明

在 [API 文档](api.html) 中查看 JSON 属性的完整列表。

| JSON 属性名称 | 描述 |
| --- | --- | 
| id | 来自数据集的标注任务的标识符。 |
| data | 从输入数据任务格式复制的数据。请参阅 [任务格式](tasks.html#Basic-Label-Studio-JSON-format) 的文档。 |
| project | Label Studio 中特定项目的标识符。 |
| annotations | 包含任务标注结果的数组。 |
| annotations.id | 已完成任务的标识符。 |
| annotations.lead_time | 标注任务所需的时间（秒）。 |
| annotations.result | 包含标注或标注任务结果的数组。 |
| annotations.updated_at | 创建或修改标注时的时间戳。 |
| annotations.completed_at | 创建或提交标注时的时间戳。 |
| annotations.completed_by | 创建标注的用户的用户 ID。与 Label Studio UI 上 "People（人员）" 页面中用户的列表顺序相匹配。有关导入格式选项，请参阅 [导入期间指定标注员](#specifying-annotators-during-import)。 |
| annotations.was_cancelled | 布尔值。有关标注是否被跳过或取消的详细信息。 |
| result.id | 此任务特定标注结果的标识符。使用它将来自不同控制标签的区域组合在一起，例如 `<Labels>` 和 `<Rectangle>` |
| result.parentID | （可选）对父区域 result.id 的引用。它将区域组织在区域面板中的层次树中 |
| result.from_name | 用于标注区域的标签名称。请参阅 [控制标签](/tags)。 |
| result.to_name | 提供要标注区域的对象标签的名称。请参阅 [对象标签](/tags)。 |
| result.type | 用于标注任务的标签类型。 |
| result.value | 特定于标签的值，包含标注任务结果的详细信息。值结构取决于标签的标签。有关更多信息，请参阅 [探索每个标签](/tags)。 |
| drafts | 草稿标注数组。遵循与 annotations 数组类似的格式。仅包含 [从 UI](#Export-snapshots-using-the-UI) 或 [使用 API](#Export-snapshots-using-the-Snapshot-API) 作为快照导出的任务。 |
| predictions | 机器学习预测数组。遵循与 annotations 数组相同的格式，带有一个附加参数。 |
| predictions.score | 结果的总体分数，基于概率输出、置信度级别或其他。 |
| task.updated_at | 创建、更新或删除任务或其任何标注或审核时的时间戳。 |

### 导入期间指定标注员 {#specifying-annotators-during-import}

将标注导入 Label Studio 时，你可以通过使用标注对象中的 `completed_by` 字段来控制哪些用户被指定为标注员：

```json
// 选项 1：未指定标注员（使用导入用户）
{
  "result": [...],
  "completed_by": null
}

// 选项 2：通过电子邮件指定
{
  "result": [...],
  "completed_by": {
    "email": "annotator@example.com"
  }
}

// 选项 3：通过 ID 指定
{
  "result": [...],
  "completed_by": 42
}
```

系统会将电子邮件或 ID 与你组织中的现有用户进行匹配，或者如果配置为允许，则回退到导入用户。

请注意，这适用于通过 Label Studio UI、API 或 SDK 导入的情况。

<div class="enterprise-only">

企业版字段在导出中呈现：

| JSON 属性名称 | 描述 |
| --- | --- | 
| annotations.reviews | 包含此标注的审核详细信息的数组。 |
| reviews.id | 特定标注审核的 ID。 |
| reviews.created_by | 包含执行审核的用户的用户 ID、电子邮件、名字和姓氏的字典。 |
| reviews.accepted | 布尔值。审核员是否在审核中接受了该标注。 |

</div>
