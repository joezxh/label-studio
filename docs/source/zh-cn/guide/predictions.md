---
title: 将预标注数据导入 Label Studio
short: 导入预标注
type: guide
tier: all
order: 163
order_enterprise: 163
meta_title: 将预标注数据导入 Label Studio
meta_description: 将预测的标签、预测结果、预标注或预标签导入 Label Studio，用于你的数据标注、机器学习和数据科学项目。
section: "导入与导出"
parent: "tasks"
parent_enterprise: "tasks"
---

如果你有用模型为数据集生成的预测（无论是预标注任务还是预标记任务），你可以将预测与数据集一起导入 Label Studio 以供审查和修正。Label Studio 会自动在你导入的每个任务的标注页面上显示预标注。

你可以[使用 UI](tasks.html#Import-data-from-the-Label-Studio-UI) 或[使用 API](/api#operation/projects_import_create) 将预标注任务导入 Label Studio。

!!! note 
    若要在标注时使用机器学习模型生成交互式预标注，请参阅[在 Label Studio 中设置机器学习](ml.html)。

<div class="opensource-only">

!!! error enterprise
    Label Studio Enterprise 客户可以使用一个名为 Prompts 的强大工具。借助 Prompts，你可以利用 LLM 自动为 Label Studio 任务生成预测。有关更多信息，请参阅 [Prompts](https://docs.humansignal.com/guide/prompts_overview)。

</div>

<div class="enterprise-only">

!!! info Tip
    借助 Prompts，你可以利用 LLM 自动为 Label Studio 任务生成预测。有关更多信息，请参阅 [Prompts](prompts_overview)。

</div>


## 为 Label Studio 准备预标注

要将预测标签导入 Label Studio，你必须使用[基本 Label Studio JSON 格式](tasks.html#Basic-Label-Studio-JSON-format)，并使用 `predictions` JSON 键设置你的任务。Label Studio ML 后端也以这种格式输出任务。查看这个常见视频教程，了解如何将提交的标注转换为预测：

<iframe class="video-border" width="100%" height="400vh" src="https://www.youtube.com/embed/CyRe73VD4EE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 预标注的 JSON 格式

Label Studio 的预标注 JSON 格式必须包含两个部分：
- 一个 `data` 对象，用于引用预标注所应用的源数据。它可以是音频文件的 URL、图像的预签名云存储链接、纯文本、对存储在 Label Studio 中的 CSV 文件的引用，或其他内容。请参阅如何[指定 data 对象](#Specify-the-data-object)。
- 一个 `predictions` 数组，包含不同类型标注的预标注结果。请参阅如何[将结果添加到 predictions 数组](#Add-results-to-the-predictions-array)。

预标注的 JSON 格式必须与用于数据标注项目的标注配置相匹配。

#### 指定 data 对象 
使用 `data` 对象来引用标注配置中[Object 标签](/tags)所指定数据的 `value`。例如，以下时间序列标注配置片段：
```xml
...
  <TimeSeries name="ts" value="$csv" valueType="url">
      <Channel column="first_column"/>
  </TimeSeries>
...
```
该片段在 TimeSeries Object 标签中指定了 `value="$csv"`。因此，此标注配置的预标注 JSON 文件的 data 对象必须使用 "csv" 来指定时间序列预标注的 CSV 数据位置，如下例所示：

```json
[
  {
    "data": {
      "csv": "https://app.heartex.ai/samples/time-series.csv?time=None&values=first_column"
    },
    "predictions": [ ]
  }
]
```

#### 将结果添加到 predictions 数组 

`predictions` 数组还取决于标注配置。某些预标注字段仅与特定类型的标注相关。下表描述了所有预标注都存在的 JSON 对象和数组： 

| JSON key                    | type   | description                                                                                                                                      |
|-----------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `predictions`               | array  | 包含特定任务的所有预标注。                                                                                                | 
| `predictions.model_version` | string | 指定生成该预测的模型版本。                                                                                        |
| `predictions.result`        | array  | 以 JSON 对象形式包含特定任务的所有预标注结果。                                                                         |
| `result.value`              | object | 包含特定标注区域的详细信息。                                                                                                  |
| `result.id`                 | string | 用于标识标注区域的任意字符串。必须与相关区域匹配，例如在 [OCR 预标注](#Import-OCR-pre-annotations) 中。   |
| `result.from_name`          | string | 用于引用正在执行的标注类型所对应的标注配置 `from_name`。必须与标注配置匹配。 |
| `result.to_name`            | string | 用于引用正在执行的标注类型所对应的标注配置 `to_name`。必须与标注配置匹配。   |
| `result.type`               | string | 指定正在执行的标注类型的标注标签。例如，命名实体识别任务的类型为 `labels`。          |
| `result.readonly`           | bool   | 特定区域的只读模式                                                                                                              | 
| `result.hidden`             | bool   | 特定区域的默认可见性（眼睛图标）                                                                                              |

其他类型的标注包含特定字段。你可以查看[本页上的示例](#Specific-examples-for-pre-annotations)，或查看标注配置中 Object 和 Control 标签的[标签文档](/tags)，了解标注特定的 `result` 对象。例如，[Audio 标签](/tags/audio.html)、[HyperText 标签](/tags/hypertext.html)、[Paragraphs 标签](/tags/paragraphs.html)、[KeyPointLabels](/tags/keypointlabels.html) 等都包含示例 `result` JSON。

!!! info
    如果你正在为[自定义 ML 后端](ml_create.html)生成预标注，可以使用 `self.parsed_label_config` 变量来检索项目的标注配置并生成预标注。有关更多详细信息，请参阅[自定义 ML 后端](ml_create.html)文档。


### 预测是只读的

预测无法修改，始终是只读的。

如果项目设置（机器学习部分）中的"在标注流和快速视图中向标注者显示预测"开关已启用，预测将自动复制到新创建的标注中。在快速视图模式下，可以使用编辑器工具面板上的特殊复制按钮从预测创建标注： 
<img src="/images/quickview-copy-button.png" class="gif-border">


### 预标注的具体示例

请参阅以下示例了解示例预标注格式：
- [导入图像的 bbox 和选择预标注](#Import-bbox-and-choice-pre-annotations-for-images)
- [导入无标签的图像预标注矩形、多边形、椭圆和关键点区域](#Import-pre-annotated-rectangle-polygon-ellipse-amp-keypoint-regions-without-labels-for-images)
- [带 NER span 的文本预标注](#Import-span-pre-annotations-for-text)
- [用于分割的笔刷预标注（带遮罩）](#Import-brush-segmentation-pre-annotations-in-RLE-format)
- [带边界框、标签和文本转写的 OCR 预标注](#Import-OCR-pre-annotations)

若要为这些示例中未涵盖的 Label Studio 格式化预标注，请参考相关 object 和 control 标签的示例结果 JSON（对应你的标注配置），例如用于音频分类任务的 [Audio 标签](/tags/audio.html)。每个标签都必须在 JSON 预标注格式中表示，才能在 Label Studio UI 中渲染预测。并非所有 object 和 control 标签都列出了示例结果 JSON。

你也可以使用 [Label Studio Playground](/playground) 预览特定标注配置的输出 JSON。


## 导入图像的 bbox 和选择预标注

例如，导入预测的**边界框区域（矩形）**和**选择**，用于确定图像中的物品是飞机还是汽车。

对于图像预标注，Label Studio 期望图像标注的 x、y、宽度和高度以整体图像尺寸的百分比形式提供。请参阅本页的[图像标注的单位](predictions.html#Units_for_image_annotations)，了解更多关于如何转换格式的信息。

使用以下标注配置： 
```xml
<View>
  <Choices name="choice" toName="image" showInLine="true">
    <Choice value="Boeing" background="blue"/>
    <Choice value="Airbus" background="green" />
  </Choices>

  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>

  <Image name="image" value="$image"/>
</View>
```

设置示例项目后，创建与以下格式匹配的示例任务：

{% details <b>点击展开带预测的 JSON 示例</b> %}
将此示例 JSON 保存为文件以导入 Label Studio，例如 `example_prediction_task.json`。

{% codeblock lang:json %}
[{
  "data": {
    "image": "/static/samples/sample.jpg" 
  },

  "predictions": [{
    "model_version": "one",
    "score": 0.5,
    "result": [
      {
        "id": "result1",
        "type": "rectanglelabels",        
        "from_name": "label", "to_name": "image",
        "original_width": 600, "original_height": 403,
        "image_rotation": 0,
        "value": {
          "rotation": 0,          
          "x": 4.98, "y": 12.82,
          "width": 32.52, "height": 44.91,
          "rectanglelabels": ["Airplane"]
        }
      },
      {
        "id": "result2",
        "type": "rectanglelabels",        
        "from_name": "label", "to_name": "image",
        "original_width": 600, "original_height": 403,
        "image_rotation": 0,
        "value": {
          "rotation": 0,          
          "x": 75.47, "y": 82.33,
          "width": 5.74, "height": 7.40,
          "rectanglelabels": ["Car"]
        }
      },
      {
        "id": "result3",
        "type": "choices",
        "from_name": "choice", "to_name": "image",
        "value": {
          "choices": ["Airbus"]
      }
    }]
  }]
}]
{% endcodeblock %}

在这个例子中，1 个预测（或预标注）中有 3 个结果： 
- `result1` - 第一个边界框
- `result2` - 第二个边界框
- `result3` - 选择项
预测分数适用于整个预测。

{% enddetails %}
<br/>

你可以[使用 UI](tasks.html#Import-data-from-the-Label-Studio-UI) 或[使用 API](/api#operation/projects_import_create) 将预标注任务导入 Label Studio。 

在 Label Studio UI 中，此任务的导入预测如下所示： 
<img src="../images/predictions_loaded.png" alt="screenshot of the Label Studio UI showing an image of airplanes with bounding boxes covering each airplane." style="max-width: 600px;" class="gif-border">

## 导入无标签的图像预标注矩形、多边形、椭圆和关键点区域  

如果你想导入带有预标注区域但未分配标签的图像，请按照此示例操作。

使用以下标注配置： 
```xml
<View>
  <Image name="image" value="$image" zoom="true" zoomControl="true" rotateControl="false"/>

  <Rectangle name="rect" toName="image" showInline="false"/>
  <Polygon name="polygon" toName="image"/>
  <Ellipse name="ellipse" toName="image"/>
  <KeyPoint name="kp" toName="image"/>

  <Labels name="labels" toName="image" fillOpacity="0.5" strokeWidth="5">
    <Label value="Vehicle" background="green"/>
    <Label value="Building" background="blue"/>
    <Label value="Pavement" background="red"/>
  </Labels>
</View>
```

设置示例项目后，创建与以下格式匹配的示例任务： 

{% details <b>点击展开 JSON 示例</b> %}
将此示例 JSON 保存为文件以导入 Label Studio，例如 `example_prediction_task.json`。

{% codeblock lang:json %}
[{
  "data": {
    "image": "/static/samples/sample.jpg"
  },
  
  "predictions": [
    {
      "model_version": "one",
      "score": 0.5,
      "result": [
        {
          "original_width": 800,
          "original_height": 450,
          "image_rotation": 0,
          "value": {
            "x": 55.46,
            "y": 2.36,
            "width": 35.86,
            "height": 46.9,
            "rotation": 0
          },
          "id": "ABC",
          "from_name": "rect",
          "to_name": "image",
          "type": "rectangle"
        },
        {
          "original_width": 800,
          "original_height": 450,
          "image_rotation": 0,
          "value": {
            "points": [
              [
                20.93,
                28.90
              ],
              [
                25.86,
                64.69
              ],
              [
                38.40,
                62.79
              ],
              [
                34.13,
                27.48
              ]
            ]
          },
          "id": "GHI",
          "from_name": "polygon",
          "to_name": "image",
          "type": "polygon"
        },
        {
          "original_width": 800,
          "original_height": 450,
          "image_rotation": 0,
          "value": {
            "x": 8.4,
            "y": 20.14,
            "radiusX": 4,
            "radiusY": 7.10,
            "rotation": 0
          },
          "id": "JKL",
          "from_name": "ellipse",
          "to_name": "image",
          "type": "ellipse"
        },
        {
          "original_width": 800,
          "original_height": 450,
          "image_rotation": 0,
          "value": {
            "x": 38.40,
            "y": 34.21,
            "width": 1.0
          },
          "id": "DEF",
          "from_name": "rect",
          "to_name": "image",
          "type": "keypoint"
        }
      ]
    }
  ]
}]
{% endcodeblock %}

在这个例子中，1 个预测（或预标注）的 1 个结果字段中有 4 个区域： 
- 区域 `ABC` - 矩形边界框
- 区域 `DEF` - 第二个矩形边界框
- 区域 `GHI` - 多边形分割
- 区域 `JKL` - 椭圆
这些区域都没有应用标签。标注配置必须使用 `Rectangle` 标签而非 `RectangleLabels` 标签来支持此类预测。尽管此示例的标注配置包含 `Labels` 标签，但预测无需为区域指定标签。

{% enddetails %}
<br/>

## 导入文本的 span 预标注

在这个例子中，使用[命名实体识别模板](/templates/named_entity.html) (NER) 导入文本的预标注：
```xml
<View>
  <Labels name="label" toName="text">
    <Label value="Person"></Label>
    <Label value="Organization"></Label>
    <Label value="Fact"></Label>
    <Label value="Money"></Label>
    <Label value="Date"></Label>
    <Label value="Time"></Label>
    <Label value="Ordinal"></Label>
    <Label value="Percent"></Label>
    <Label value="Product"></Label>
    <Label value="Language"></Label>
    <Label value="Location"></Label>
  </Labels>
  <Text name="text" value="$text"></Text>
</View>
```

这个示例 JSON 文件包含两个任务，每个任务都有来自不同模型的两组预标注。第一个任务还包含每个 NER span 的预测分数： 

{% details <b>点击展开 NER JSON 示例</b> %}
将此示例 JSON 保存为文件，例如：`example_preannotated_ner_tasks.json`。

{% codeblock lang:json %}
[
  {
    "data": {
      "text": "All that changed when he was 27 and he came to Jerusalem. It was the weekend of both Easter and Passover, and the city was flooded with tourists."
    },
    "predictions": [
      {
        "model_version": "one",
        "score": 0.5,
        "result": [
          {
            "id": "abc",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 29,
              "end": 31,
              "score": 0.70,
              "text": "27",
              "labels": [
                "Date"
              ]
            }
          },
          {
            "id": "def",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 47,
              "end": 56,
              "score": 0.65,
              "text": "Jerusalem",
              "labels": [
                "Location"
              ]
            }
          },
          {
            "id": "ghi",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 65,
              "end": 76,
              "score": 0.95,
              "text": "the weekend",
              "labels": [
                "Date"
              ]
            }
          },
          {
            "id": "jkl",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 85,
              "end": 91,
              "score": 0.50,
              "text": "Easter",
              "labels": [
                "Date"
              ]
            }
          }
        ]
      },
      {
        "model_version": "two",
        "score": 0.42,
        "result": [
          {
            "id": "mno",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 29,
              "end": 31,
              "score": 0.55,
              "text": "27",
              "labels": [
                "Date"
              ]
            }
          },
          {
            "id": "pqr",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 47,
              "end": 56,
              "score": 0.40,
              "text": "Jerusalem",
              "labels": [
                "Location"
              ]
            }
          },
          {
            "id": "stu",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 65,
              "end": 76,
              "score": 0.32,
              "text": "the weekend",
              "labels": [
                "Time"
              ]
            }
          },
          {
            "id": "vwx",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 85,
              "end": 91,
              "score": 0.22,
              "text": "Easter",
              "labels": [
                "Location"
              ]
            }
          },
          {
            "id": "yz1",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 96,
              "end": 104,
              "score": 0.96,
              "text": "Passover",
              "labels": [
                "Date"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "data": {
      "text": " Each journal was several inches thick and bound in leather. On one page are drawn portraits of Sunny in a flowery, Easter dress and sun hat. On another page are hundreds of sketches of leaves that Niyati saw in her yard."
    },
    "predictions": [
      {
        "model_version": "one",
        "result": [
          {
            "id": "ab2",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 18,
              "end": 32,
              "text": "several inches",
              "labels": [
                "Product"
              ]
            }
          },
          {
            "id": "cd3",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 64,
              "end": 67,
              "text": "one",
              "labels": [
                "Percent"
              ]
            }
          },
          {
            "id": "ef4",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 96,
              "end": 101,
              "text": "Sunny",
              "labels": [
                "Person"
              ]
            }
          },
          {
            "id": "gh5",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 162,
              "end": 170,
              "text": "hundreds",
              "labels": [
                "Percent"
              ]
            }
          },
          {
            "id": "ij6",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 198,
              "end": 204,
              "text": "Niyati",
              "labels": [
                "Person"
              ]
            }
          }
        ]
      },
      {
        "model_version": "two",
        "result": [
          {
            "id": "kl7",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 18,
              "end": 32,
              "text": "several inches",
              "labels": [
                "Fact"
              ]
            }
          },
          {
            "id": "mn8",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 64,
              "end": 67,
              "text": "one",
              "labels": [
                "Percent"
              ]
            }
          },
          {
            "id": "op9",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 96,
              "end": 101,
              "text": "Sunny",
              "labels": [
                "Time"
              ]
            }
          },
          {
            "id": "qr10",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 116,
              "end": 122,
              "text": "Easter",
              "labels": [
                "Location"
              ]
            }
          },
          {
            "id": "st11",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 162,
              "end": 170,
              "text": "hundreds",
              "labels": [
                "Money"
              ]
            }
          },
          {
            "id": "uv12",
            "from_name": "label",
            "to_name": "text",
            "type": "labels",
            "value": {
              "start": 198,
              "end": 204,
              "text": "Niyati",
              "labels": [
                "Person"
              ]
            }
          }
        ]
      }
    ]
  }
]
{% endcodeblock %}
{% enddetails %}

你可以[使用 UI](tasks.html#Import-data-from-the-Label-Studio-UI) 或[使用 API](/api#operation/projects_import_create) 将预标注任务导入 Label Studio。在 Label Studio UI 中，第一个任务的导入预测如下所示：

<center><img src="../images/predictions_loaded_text.png" alt="screenshot of the Label Studio UI showing the text with highlighted text labels and prediction scores visible." style="max-width: 100%;"></center>

你可以使用**区域**面板选项对每个标注区域的预测分数进行排序。


## 以 RLE 格式导入笔刷分割预标注

如果你想使用 [BrushLabels 标签](/tags/brushlabels.html) 导入笔刷遮罩图像分割的预标注，必须先将遮罩转换为 RLE 格式。[Label Studio Converter](https://github.com/HumanSignal/label-studio-converter) 包提供了一些辅助函数。请参阅以下内容了解常见的转换情况和指南。

安装 Label Studio Converter：
```
pip install -U label-studio-converter
```

导入笔刷工具：
```python
from label_studio_converter import brush
```

- 将遮罩转换为 RLE。这需要 `shape=[image_width, image_height]` 且 `dtype=np.uint8` 的 `np.array`。将以下内容添加到你的 Python 代码以执行转换：
    ```python
    mask = (np.random.random([10, 20]) * 255).astype(np.uint8)  # just a random 2D mask
    mask = (mask > 128).astype(np.uint8) * 255  # better to threshold, it reduces output annotation size
    rle = brush.mask2rle(mask)  # mask image in RLE format 
    ```
  
- 要转换 OpenCV 轮廓，请使用 
[`brush.contour2rle(contours, contour_id, img_width, img_height)`](https://github.com/HumanSignal/label-studio-converter/blob/master/label_studio_converter/brush.py#L310)。

- 要从路径转换图像（jpg、png、bmp），请使用 
[`brush.image2rle(path)`](https://github.com/HumanSignal/label-studio-converter/blob/master/label_studio_converter/brush.py#L343)。

- 要准备预标注，请使用 
[`brush.image2annotation(path, label_name, from_name, to_name, ground_truth=False, model_version=None, score=None)`](https://github.com/HumanSignal/label-studio-converter/blob/master/label_studio_converter/brush.py#L361)

如需更多帮助，请查看这个[使用预标注创建 Label Studio 任务的示例代码](https://github.com/HumanSignal/label-studio-converter/blob/master/tests/test_brush.py#L11)（针对笔刷标签）。

## 导入 OCR 预标注 

导入光学字符识别 (OCR) 的预标注，例如[此示例博客文章中使用 tesseract 的输出](https://labelstud.io/blog/improve-ocr-quality-for-receipt-processing-with-tesseract-and-label-studio)。 

在这个例子中，使用 [OCR 模板](/templates/optical_character_recognition.html) 导入 OCR 任务的预标注：

```xml
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="Text" background="green"/>
    <Label value="Handwriting" background="blue"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <Polygon name="poly" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image" editable="true" perRegion="true" required="true" maxSubmissions="1" rows="5" placeholder="Recognized Text" displayMode="region-list"/>
</View>
```

这个示例 JSON 包含一个任务，其中有三个结果字典，分别对应标注配置中的每种标签类型：Rectangle、Labels 和 TextArea： 

{% details <b>点击展开 JSON 示例</b> %}
将此示例 JSON 保存为文件以导入 Label Studio，例如 `example_prediction_task.json`。

{% codeblock lang:json %}
{
   "data": {
      "ocr": "/data/upload/receipt_00523.png"
   },
   "predictions": [
      {
         "model_version": "best_ocr_model_1_final",
         "result": [
            {
               "original_width": 864,
               "original_height": 1296,
               "image_rotation": 0,
               "value": {
                  "x": 48.9333,
                  "y": 61.3336,
                  "width": 9.73333,
                  "height": 2.8446,
                  "rotation": 0
               },
               "id": "bb1",
               "from_name": "bbox",
               "to_name": "image",
               "type": "rectangle"
            },
            {
               "original_width": 864,
               "original_height": 1296,
               "image_rotation": 0,
               "value": {
                  "x": 48.9333,
                  "y": 61.3336,
                  "width": 9.7333,
                  "height": 2.8446,
                  "rotation": 0,
                  "labels": [
                     "Text"
                  ]
               },
               "id": "bb1",
               "from_name": "label",
               "to_name": "image",
               "type": "labels"
            },
            {
               "original_width": 864,
               "original_height": 1296,
               "image_rotation": 0,
               "value": {
                  "x": 48.9333,
                  "y": 61.3336,
                  "width": 9.7333,
                  "height": 2.8446,
                  "rotation": 0,
                  "text": [
                     "TOTAL"
                  ]
               },
               "id": "bb1",
               "from_name": "transcription",
               "to_name": "image",
               "type": "textarea"
            }
         ],
         "score": 0.89
      }
   ]
}
{% endcodeblock %}
{% enddetails %}

这个示例 JSON 还包含任务的预测分数。每个矩形结果的 ID 与该区域分配的标签以及该区域的文本区域转写相匹配。 

你可以[使用 UI](tasks.html#Import-data-from-the-Label-Studio-UI) 或[使用 API](/api#operation/projects_import_create) 将预标注任务导入 Label Studio。

!!! note 
    此示例任务中的图像数据引用了一个上传的文件，由 Label Studio 上传图像后分配的 source_filename 标识。引用图像数据的最佳方式是使用存储在云存储中的图像的预签名 URL，或存储在本地存储中并通过[同步存储](storage.html)添加到 Label Studio 的图像数据的绝对路径。


### 预标注故障排除

<div class="opensource-only">

请参阅[预标注故障排除](troubleshooting#Pre-annotations)。

</div>

<div class="enterprise-only">

请参阅 HumanSignal 支持中心的 [ML 后端与预测故障排除](https://support.humansignal.com/hc/en-us/sections/23627938255117-ML-Backend-Predictions)。

</div>
