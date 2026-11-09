---
title: Webhook event format reference 
short: Webhook event reference
type: guide
tier: all
order: 413
order_enterprise: 413
meta_title: Label Studio Webhook Event Reference 
meta_description: Label Studio reference documentation for webhook event fields and payloads sent from Label Studio for integration with your machine learning pipeline. 
section: "Integrate & Extend"
parent: "webhooks"
parent_enterprise: "webhooks"

---

Label Studio 包含多种类型的 webhook 事件，当发生特定操作时会被触发。请参阅本页上的详细信息以确定每个 webhook 事件的有效负载中包含哪些信息。有关如何使用 webhook 以及在 Label Studio 中设置 webhook 的详细信息，请参阅 [在 Label Studio 中设置 webhook](webhooks.html)。要在 Label Studio 中创建你自己的 webhook 以在特定操作发生时触发事件，请参阅 [在 Label Studio 中为 webhook 创建自定义事件](webhook_create.html)。

从 Label Studio 发送的 webhook 包含以下内容：

| Key | 详情 |
| --- | --- |
| action | 详细说明该事件所代表的操作。 |
| project | 仅包含在任务和标注事件中。有关项目的详细信息。 |
| task_number | 项目中的任务总数。 |
| finished_task_number | 项目中已标注任务的总数。 |
| total_predictions_number | 项目的总预测数。 |
| total_annotations_number | 项目中标注、跳过任务和基准真值标注的总数。可能与已标注任务的总数不同。 |
| num_tasks_with_annotations | 项目中带有标注的任务总数。不计入跳过和基准真值标注。 |
| useful_annotation_number | 项目中的标注总数。排除跳过和基准真值标注。 |
| ground_truth_number | 项目中被标记为基准真值标注的标注总数。 |
| skipped_annotations_number | 项目中被跳过或取消的标注总数。 |

Label Studio 发送到已配置 webhook URL 的 HTTP POST 有效负载包含你 [配置 webhook](webhooks.html) 时设置的请求头。

如果 webhook 事件是对创建或更新事件的响应，则所创建实体的完整详细信息也会在有效负载中发送。有关其他详细信息，请参阅以下事件参考表。

## 任务已创建（Task Created）

当在 Label Studio 中创建任务时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

webhook 有效负载包含操作的名称和一些额外的任务数据。与任务相关的数据与 [使用 API 创建任务时的响应](/api#operation/api_tasks_create) 中包含的数据相同。

| Key | Type | Description |
| --- | --- | --- | 
| action | string | 操作的名称。在本例中为 `TASKS_CREATED`，如果只导入了一个任务，则为 `TASK_CREATED`。 | 
| tasks.id | integer | 已创建任务的 ID。 | 
| tasks.data | string | 与任务关联的数据的引用。可以是 URL，例如 `s3://path/to/bucket/image.png` |
| tasks.meta | JSON dictionary | 如果存在，则为任务的元数据。 |
| tasks.created_at | datetime | 任务创建的日期和时间。 |
| tasks.updated_at | datetime | 任务最后更新的日期和时间。 |
| tasks.is_labeled | boolean | 任务是否已标注。 |
| tasks.project | integer | 任务的所属项目 ID。 | 
| project | JSON dictionary | 任务或任务被添加到的项目的详细信息。 | 

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "TASKS_CREATED",
    "tasks": [
        {
            "id": 21,
            "data": {
                "ner": "Opossums like to be aloft \n\n\n\n\n\n in trees."
            },
            "meta": {},
            "created_at": "2021-08-17T13:51:02.590839Z",
            "updated_at": "2021-08-17T13:51:02.590873Z",
            "is_labeled": false,
            "overlap": 1,
            "project": 2,
            "file_upload": 46
        },
        {
            "id": 22,
            "data": {
                "ner": "Opossums are opportunistic."
            },
            "meta": {},
            "created_at": "2021-08-17T13:51:02.590926Z",
            "updated_at": "2021-08-17T13:51:02.590941Z",
            "is_labeled": false,
            "overlap": 1,
            "project": 2,
            "file_upload": 46
        },
        {
            "id": 23,
            "data": {
                "ner": "Opossums like to forage for food."
            },
            "meta": {},
            "created_at": "2021-08-17T13:51:02.590981Z",
            "updated_at": "2021-08-17T13:51:02.590995Z",
            "is_labeled": false,
            "overlap": 1,
            "project": 2,
            "file_upload": 46
        }
    ],
    "project": {
        "id": 2,
        "title": "New Project #2",
        "description": "",
        "label_config": "<View></View>",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "9105a1d897e52286",
        "result_count": 0,
        "color": "#FFFFFF",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {},
        "model_version": "",
        "data_types": {},
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-17T13:49:34.326416Z",
        "updated_at": "2021-08-17T13:49:35.911271Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 任务已删除（Task Deleted）

当任务从 Label Studio 中删除时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

| Key | Type | Description |
| --- | --- | --- | 
| action | string | 操作的名称。在本例中为 `TASK_DELETED` 或 `TASKS_DELETED`（如果一次删除了多个任务）。 | 
| id | integer | 已删除任务的 ID。 | 
| project | JSON dictionary | 任务或任务被从中删除的项目的详细信息。 | 

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "TASKS_DELETED",
    "tasks": [
        {
            "id": 18
        },
        {
            "id": 19
        },
        {
            "id": 20
        },
        {
            "id": 21
        },
        {
            "id": 22
        },
        {
            "id": 23
        }
    ],
    "project": {
        "id": 2,
        "title": "New Project #2",
        "description": "",
        "label_config": "<View> <Header value=\"Please read the passage\"/> <Text name=\"text\" value=\"$ner\" granularity=\"word\"/> <Header value=\"Select a text span answering the following question:\"/> <Text name=\"question\" value=\"$ner\"/>\n<Labels name=\"answer\" toName=\"text\"> <Label value=\"Answer\" maxUsage=\"1\" background=\"red\"/> </Labels>\n</View><!-- {\"data\": { \"text\": \"The boundary of the region from which no escape is possible is called the event horizon. Although the event horizon has an enormous effect on the fate and circumstances of an object crossing it, according to general relativity it has no locally detectable features.[4] In many ways, a black hole acts like an ideal black body, as it reflects no light.[5][6] Moreover, quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is on the order of billionths of a kelvin for black holes of stellar mass, making it essentially impossible to observe directly.\", \"question\": \"How could black holes be detected?\" }, \"annotations\": [{\"result\": [ { \"value\": { \"start\": 423, \"end\": 553, \"text\": \"event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass.\", \"labels\": [ \"Answer\" ] }, \"id\": \"b0wKkdnnRc\", \"from_name\": \"answer\", \"to_name\": \"text\", \"type\": \"labels\" } ] }] } -->",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "9105a1d897e52286",
        "result_count": 0,
        "color": "#FFFFFF",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {
            "answer": {
                "overall": 1.0,
                "type": "Labels",
                "labels": {
                    "Answer": 1.0
                }
            }
        },
        "model_version": "",
        "data_types": {
            "ner": "Text"
        },
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-17T13:49:34.326416Z",
        "updated_at": "2021-08-17T13:52:09.334425Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 标注已创建（Annotation Created）

当为 Label Studio 中的任务创建标注时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

webhook 有效负载包含操作的名称和一些额外的标注数据。与标注相关的数据与 [使用 API 创建标注时的响应](/api#operation/api_tasks_annotations_create) 中包含的数据相同。

| Key | Type | Description |
| --- | --- | --- | 
| action | string | 操作的名称。在本例中为 `ANNOTATION_CREATED`。 | 
| annotation.id | integer | 已创建标注的 ID。 | 
| annotation.result | JSON dictionary | 已创建标注的 JSON 表示。 |
| annotation.task | integer | 创建标注所针对的任务 ID。 |
| annotation.completed_by | integer | 创建标注的用户的 ID。 |
| annotation.was_cancelled | boolean | 标注是否是跳过任务的结果，以及是否为空标注。 |
| annotation.ground_truth | boolean | 始终为 false。标注是否为基准真值。 
| annotation.created_at | datetime | 创建标注的日期和时间。 |
| annotation.updated_at | datetime | 标注最后更新的日期和时间。 |
| annotation.lead_time | floating point number | 完成标注所花费的时间，以秒为单位。 |
| annotation.prediction | JSON dictionary | 标注时查看的预测的详细信息（如果存在）。 |
| project | JSON dictionary | 与关联项目相关的所有字段。 |

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "ANNOTATION_CREATED",
    "annotation": {
        "id": 17,
        "result": [
            {
                "value": {
                    "start": 0,
                    "end": 26,
                    "text": "Opossums are op",
                    "labels": [
                        "Answer"
                    ]
                },
                "id": "WArqkkifYE",
                "from_name": "answer",
                "to_name": "text",
                "type": "labels"
            }
        ],
        "was_cancelled": false,
        "ground_truth": false,
        "created_at": "2021-08-17T13:52:48.536303Z",
        "updated_at": "2021-08-17T13:52:48.536370Z",
        "lead_time": 37.13,
        "prediction": {},
        "result_count": 0,
        "task": 19,
        "completed_by": 1
    },
    "project": {
        "id": 2,
        "title": "New Project #2",
        "description": "",
        "label_config": "<View> <Header value=\"Please read the passage\"/> <Text name=\"text\" value=\"$ner\" granularity=\"word\"/> <Header value=\"Select a text span answering the following question:\"/> <Text name=\"question\" value=\"$ner\"/>\n<Labels name=\"answer\" toName=\"text\"> <Label value=\"Answer\" maxUsage=\"1\" background=\"red\"/> </Labels>\n</View><!-- {\"data\": { \"text\": \"The boundary of the region from which no escape is possible is called the event horizon. Although the event horizon has an enormous effect on the fate and circumstances of an object crossing it, according to general relativity it has no locally detectable features.[4] In many ways, a black hole acts like an ideal black body, as it reflects no light.[5][6] Moreover, quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is on the order of billionths of a kelvin for black holes of stellar mass, making it essentially impossible to observe directly.\", \"question\": \"How could black holes be detected?\" }, \"annotations\": [{\"result\": [ { \"value\": { \"start\": 423, \"end\": 553, \"text\": \"event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass.\", \"labels\": [ \"Answer\" ] }, \"id\": \"b0wKkdnnRc\", \"from_name\": \"answer\", \"to_name\": \"text\", \"type\": \"labels\" } ] }] } -->",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "9105a1d897e52286",
        "result_count": 0,
        "color": "#FFFFFF",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {
            "answer": {
                "overall": 1.0,
                "type": "Labels",
                "labels": {
                    "Answer": 1.0
                }
            }
        },
        "model_version": "",
        "data_types": {
            "ner": "Text"
        },
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-17T13:49:34.326416Z",
        "updated_at": "2021-08-17T13:52:09.334425Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 标注已更新（Annotation Updated）

当标注被更新时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

webhook 有效负载包含操作的名称和一些额外的标注数据。与标注相关的数据与 [使用 API 更新标注时的响应](/api#operation/api_annotations_partial_update) 中包含的数据相同。

| Key | Type | Description |
| --- | --- | --- | 
| action | string | 操作的名称。在本例中为 `ANNOTATION_UPDATED`。 | 
| annotation.id | integer | 已更新标注的 ID。 | 
| annotation.result | JSON dictionary | 已更新标注的 JSON 表示。 |
| annotation.task | integer | 更新标注所针对的任务 ID。 |
| annotation.completed_by | integer | 更新标注的用户的 ID。 |
| annotation.was_cancelled | boolean | 标注是否是跳过任务的结果，以及是否为空标注。 |
| annotation.ground_truth | boolean | 始终为 false。标注是否为基准真值。 
| annotation.created_at | datetime | 创建标注的日期和时间。 |
| annotation.updated_at | datetime | 标注最后更新的日期和时间。 |
| annotation.lead_time | floating point number | 完成标注所花费的时间，以秒为单位。 |
| annotation.prediction | JSON dictionary | 标注时查看的预测的详细信息（如果存在）。 |
| project | JSON dictionary | 与关联项目相关的所有字段。 |

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "ANNOTATION_UPDATED",
    "annotation": {
        "id": 16,
        "result": [
            {
                "original_width": 1024,
                "original_height": 1024,
                "image_rotation": 0,
                "value": {
                    "x": 42,
                    "y": 36.4,
                    "width": 50.13333333333333,
                    "height": 26,
                    "rotation": 0,
                    "rectanglelabels": [
                        "Airplane"
                    ]
                },
                "id": "5dC-jDgBtG",
                "from_name": "label",
                "to_name": "image",
                "type": "rectanglelabels"
            },
            {
                "original_width": 1024,
                "original_height": 1024,
                "image_rotation": 0,
                "value": {
                    "x": 12.533333333333333,
                    "y": 37.733333333333334,
                    "width": 23.6,
                    "height": 22,
                    "rotation": 0,
                    "rectanglelabels": [
                        "Car"
                    ]
                },
                "id": "_bJsGZ0_Cm",
                "from_name": "label",
                "to_name": "image",
                "type": "rectanglelabels"
            }
        ],
        "was_cancelled": false,
        "ground_truth": false,
        "created_at": "2021-08-17T13:35:59.817086Z",
        "updated_at": "2021-08-17T13:37:25.805479Z",
        "lead_time": 299.327,
        "prediction": {},
        "result_count": 0,
        "task": 5,
        "completed_by": 1
    },
    "project": {
        "id": 1,
        "title": "New Project #5",
        "description": "",
        "label_config": "<View> <Image name=\"image\" value=\"$image\"/> <RectangleLabels name=\"label\" toName=\"image\"> <Label value=\"Airplane\" background=\"green\"/> <Label value=\"Car\" background=\"blue\"/> </RectangleLabels> </View>\n<!--{\"annotations\": [{\"result\": [ { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 4.21455938697318, \"y\": 11.142857142857142, \"width\": 32.95019157088122, \"height\": 46.285714285714285, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"PIhJM1YYpH\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 30.076628352490417, \"y\": 44.57142857142857, \"width\": 32.56704980842912, \"height\": 46, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"lnimBBYxMU\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 67.17850287907869, \"y\": 18, \"width\": 28.406909788867566, \"height\": 43.714285714285715, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"sBjX3KteGU\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 77.01149425287356, \"y\": 84.57142857142857, \"width\": 3.4482758620689653, \"height\": 5.142857142857142, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"TIYiC1Bh67\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 85.02879078694816, \"y\": 83.71428571428572, \"width\": 2.879078694817658, \"height\": 4.857142857142856, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"mL8hEBkvJt\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 57.08812260536399, \"y\": 87.42857142857143, \"width\": 5.363984674329502, \"height\": 7.142857142857142, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"3gpRfF9MkN\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" } ] }]} -->",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "846c4da585704dd4",
        "result_count": 0,
        "color": "#F6C549",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {
            "label": {
                "overall": 1.0,
                "type": "RectangleLabels",
                "labels": {
                    "Airplane": 1.0,
                    "Car": 1.0
                }
            }
        },
        "model_version": "",
        "data_types": {
            "image": "Image"
        },
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-12T14:15:01.744507Z",
        "updated_at": "2021-08-17T13:35:25.697471Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 标注已删除（Annotation Deleted）

当标注被删除时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

| Key | Type | Description |
| --- | --- | --- | 
| action | string  | 操作的名称。在本例中为 `ANNOTATION_DELETED`，或对于批量操作，为 `ANNOTATIONS_DELETED` | 
| id | integer | 已删除标注的 ID。 | 
| project | JSON dictionary | 标注被从中删除的项目的详细信息。 | 

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "ANNOTATIONS_DELETED",
    "annotations": [
        {
            "id": 17
        }
    ],
    "project": {
        "id": 2,
        "title": "New Project #2",
        "description": "",
        "label_config": "<View> <Header value=\"Please read the passage\"/> <Text name=\"text\" value=\"$ner\" granularity=\"word\"/> <Header value=\"Select a text span answering the following question:\"/> <Text name=\"question\" value=\"$ner\"/>\n<Labels name=\"answer\" toName=\"text\"> <Label value=\"Answer\" maxUsage=\"1\" background=\"red\"/> </Labels>\n</View><!-- {\"data\": { \"text\": \"The boundary of the region from which no escape is possible is called the event horizon. Although the event horizon has an enormous effect on the fate and circumstances of an object crossing it, according to general relativity it has no locally detectable features.[4] In many ways, a black hole acts like an ideal black body, as it reflects no light.[5][6] Moreover, quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is on the order of billionths of a kelvin for black holes of stellar mass, making it essentially impossible to observe directly.\", \"question\": \"How could black holes be detected?\" }, \"annotations\": [{\"result\": [ { \"value\": { \"start\": 423, \"end\": 553, \"text\": \"event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass.\", \"labels\": [ \"Answer\" ] }, \"id\": \"b0wKkdnnRc\", \"from_name\": \"answer\", \"to_name\": \"text\", \"type\": \"labels\" } ] }] } -->",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "9105a1d897e52286",
        "result_count": 0,
        "color": "#FFFFFF",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {
            "answer": {
                "overall": 1.0,
                "type": "Labels",
                "labels": {
                    "Answer": 1.0
                }
            }
        },
        "model_version": "",
        "data_types": {
            "ner": "Text"
        },
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-17T13:49:34.326416Z",
        "updated_at": "2021-08-17T13:52:09.334425Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 项目已创建（Project Created）

当创建项目时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

你必须 [启用组织级别的 webhook](webhooks.html#Enable-organization-level-webhooks) 才能使用此事件。

### Webhook 有效负载详情

webhook 有效负载包含操作的名称和一些额外的项目数据。与项目相关的数据与 [使用 API 创建项目时的响应](/api#operation/api_projects_create) 中包含的数据相同。

| Key | Type | Description |
| --- | --- | --- | 
| action | string  | 触发事件的操作。在本例中为 `PROJECT_CREATED`。 |
| project | JSON dictionary | 与所创建项目相关的所有字段。请参阅 [创建项目的 API 文档](/api#operation/api_projects_create)。 | 

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "PROJECT_CREATED",
    "project": {
        "id": 3,
        "title": "New Project #3",
        "description": "",
        "label_config": "<View></View>",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "d881a308198ff9ac",
        "result_count": 0,
        "color": "#FFFFFF",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {},
        "model_version": "",
        "data_types": {},
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-17T13:55:58.809065Z",
        "updated_at": "2021-08-17T13:55:58.809098Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 项目已更新（Project Updated）

当项目被更新时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

### Webhook 有效负载详情

webhook 有效负载包含操作的名称和一些额外的项目数据。与项目相关的数据与 [使用 API 更新项目时的响应](/api#operation/api_projects_partial_update) 中包含的数据相同。

| Key | Type | Description |
| --- | --- | --- | 
| action | string  | 触发事件的操作。在本例中为 `PROJECT_UPDATED`。 |
| project | JSON dictionary | 与所更新项目相关的所有字段。请参阅 [更新项目的 API 文档](/api#operation/api_projects_partial_update)。 | 

### 示例有效负载

<br/>
{% details <b>点击展开示例有效负载</b> %}

{% codeblock lang:json %}
{
    "action": "PROJECT_UPDATED",
    "project": {
        "id": 1,
        "title": "New Project #5",
        "description": "",
        "label_config": "<View> <Image name=\"image\" value=\"$image\"/> <RectangleLabels name=\"label\" toName=\"image\"> <Label value=\"Airplane\" background=\"green\"/> <Label value=\"Car\" background=\"blue\"/> </RectangleLabels> </View>\n<!--{\"annotations\": [{\"result\": [ { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 4.21455938697318, \"y\": 11.142857142857142, \"width\": 32.95019157088122, \"height\": 46.285714285714285, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"PIhJM1YYpH\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 30.076628352490417, \"y\": 44.57142857142857, \"width\": 32.56704980842912, \"height\": 46, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"lnimBBYxMU\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 67.17850287907869, \"y\": 18, \"width\": 28.406909788867566, \"height\": 43.714285714285715, \"rotation\": 0, \"rectanglelabels\": [ \"Airplane\" ] }, \"id\": \"sBjX3KteGU\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 77.01149425287356, \"y\": 84.57142857142857, \"width\": 3.4482758620689653, \"height\": 5.142857142857142, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"TIYiC1Bh67\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 85.02879078694816, \"y\": 83.71428571428572, \"width\": 2.879078694817658, \"height\": 4.857142857142856, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"mL8hEBkvJt\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" }, { \"original_width\": 600, \"original_height\": 403, \"image_rotation\": 0, \"value\": { \"x\": 57.08812260536399, \"y\": 87.42857142857143, \"width\": 5.363984674329502, \"height\": 7.142857142857142, \"rotation\": 0, \"rectanglelabels\": [ \"Car\" ] }, \"id\": \"3gpRfF9MkN\", \"from_name\": \"label\", \"to_name\": \"image\", \"type\": \"rectanglelabels\" } ] }]} -->",
        "expert_instruction": "",
        "show_instruction": false,
        "show_skip_button": true,
        "enable_empty_annotation": true,
        "show_annotation_history": false,
        "show_collab_predictions": true,
        "evaluate_predictions_automatically": false,
        "token": "846c4da585704dd4",
        "result_count": 0,
        "color": "#F6C549",
        "maximum_annotations": 1,
        "min_annotations_to_start_training": 10,
        "control_weights": {
            "label": {
                "overall": 1.0,
                "type": "RectangleLabels",
                "labels": {
                    "Airplane": 1.0,
                    "Car": 1.0
                }
            }
        },
        "model_version": "",
        "data_types": {
            "image": "Image"
        },
        "is_draft": false,
        "is_published": false,
        "created_at": "2021-08-12T14:15:01.744507Z",
        "updated_at": "2021-08-17T13:39:14.054849Z",
        "sampling": "Sequential sampling",
        "show_overlap_first": true,
        "overlap_cohort_percentage": 100,
        "task_data_login": null,
        "task_data_password": null,
        "organization": 1,
        "created_by": 1
    }
}
{% endcodeblock %}

{% enddetails %}
<br/>

## 项目已删除（Project Deleted）

当项目被删除时发送。请参阅如何 [为此事件设置 webhook](webhooks.html)。

你必须 [启用组织级别的 webhook](webhooks.html#Enable-organization-level-webhooks) 才能使用此事件。

### Webhook 有效负载详情

| Key | Type | Description |
| --- | --- | --- | 
| action | string | 操作的名称。在本例中为 `PROJECT_DELETED`。 | 
| id | integer | 已删除项目的 ID。 | 

### 示例有效负载

```json
{
    "action": "PROJECT_DELETED",
    "project": {
        "id": 3
    }
}
```

### 开始训练（Start Training）

当用户在项目设置页面的 ML 模型卡片上点击 `Start Training（开始训练）` 按钮时，会触发此 webhook。
此事件将被发送到 ML 后端，并可在 `model.fit(event, ...)` 方法中被捕获：

```
class MyModel(LabelStudioMLBase):
  def fit(self, event, *args, **kwargs):
    if event == 'START_TRAINING': 
      ...
```

### Webhook 有效负载详情

| Key | Type | Description                           |
| --- | --- |---------------------------------------| 
| action | string | 操作的名称：`START_TRAINING`。 | 
| id | integer | 开始训练的项目 ID。 |
| project | JSON dictionary | 与所更新项目相关的所有字段。请参阅 [更新项目的 API 文档](/api#operation/api_projects_partial_update)。 |
