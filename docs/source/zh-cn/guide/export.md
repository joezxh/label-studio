---
title: 从 Label Studio 导出标注和数据
short: 导出标注
type: guide
tier: all
order: 166
order_enterprise: 166
meta_title: 导出标注
meta_description: Label Studio 文档，介绍如何导出数据标注结果，以便在机器学习模型和数据科学项目中使用。
section: "导入与导出"
---

在标注项目的任何阶段，你都可以从 Label Studio 导出标注。

Label Studio 将你的标注以原始 JSON 格式存储在 SQLite 数据库后端、PostgreSQL 数据库后端，或你指定为靶标存储的任何云或数据库存储中。云存储桶中每个已标注任务对应一个以 `task_id.json` 命名的文件。有关同步靶标存储的更多信息，请参阅[云存储设置](/guide/storage)。

以 JSON 格式导出的图像标注使用整体图像尺寸的百分比（而非像素）来描述边界框的大小和位置。有关更多信息，请参阅[如何转换图像标注单位](#Units-of-image-annotations)。

!!! note
    某些导出格式仅导出标注而不导出任务中的数据。有关更多信息，请参阅[Label Studio 支持的导出格式](#Export-formats-supported-by-Label-Studio)。

{% insertmd zh-cn/includes/annotation_ids.md %}

<div class="opensource-only">

### 在社区版 Label Studio 中使用 UI 导出

使用以下步骤从 Label Studio UI 导出数据和标注。

1. 对于一个项目，点击 **Export（导出）**。
2. 选择一种可用的导出格式。
3. 点击 **Export（导出）** 以导出你的数据。

!!! note
    1. 无论标签页上设置了什么筛选条件，导出始终会包含已标注的任务。
    2. 已取消的标注任务也会包含在导出结果中。
    3. 如果你想将标签页筛选条件应用到导出，请尝试[使用 SDK 创建导出快照](https://api.labelstud.io/api-reference/api-reference/projects/exports/create)。

### 社区版的导出超时

社区版 UI 的导出是作为请求的一部分**同步**生成的。社区版保持了部署的简单性，默认不运行后台导出工作进程。Label Studio 企业版支持后台工作进程进行异步快照导出，更适合大规模项目。对于大型项目，社区版的导出可能超过你在反向代理或 ingress 中配置的超时时间（通常约为 **90 秒**），这可能导致 502/504 错误或导出超时。

如果你遇到此限制，仍然可以使用以下任一选项导出数据：

- **使用 SDK 导出快照**：请参阅如何[使用 SDK 导出快照](https://api.labelstud.io/api-reference/api-reference/projects/exports/create)。
- **使用控制台命令导出**：使用[控制台命令](#Export-using-console-command) 直接从运行 Label Studio 的机器导出你的项目。
- **在 UI 中大规模导出**：Label Studio 企业版在 UI 中包含了用于大型数据集的**后台快照导出**（请参阅[使用 UI 导出快照](#Export-snapshots-using-the-UI)）。

### 使用控制台命令导出

使用以下命令导出数据和标注。

```shell
label-studio export <project-id> <export-format> --export-path=<output-path>
```

要启用日志：
```shell
DEBUG=1 LOG_LEVEL=DEBUG label-studio export <project-id> <export-format> --export-path=<output-path>
```

</div>

<div class="enterprise-only">

### 使用 UI 导出快照

<img src="/images/lse-export-snapshots-ui.png" alt="" class="gif-border" />
<br>

在 Label Studio 企业版中，创建你的数据和标注的快照。创建快照以从数据标注项目中精确导出你所需的内容。这种延迟导出方法使得从 Label Studio UI 导出大型标注项目变得更容易。

1. 在 Label Studio UI 的某个项目内，点击 **Export（导出）**。
2. 点击 **Create New Snapshot（创建新快照）**。
3. **Apply filters from tab ...（应用来自标签页的筛选）**：从下拉列表中选择 **Default（默认）**。
4. （可选）**Snapshot Name（快照名称）**：输入一个快照名称，以便将来更容易找到。默认情况下，导出快照命名为 `PROJECT-NAME-at-YEAR-MM-DD-HH-MM`，其中时间为 UTC 时间。
5. **Include in the Snapshot…（包含在快照中）**：选择要包含在快照中的数据类型。选择 **All tasks（所有任务）**、**Only annotated（仅已标注）** 任务，或 **Only reviewed（仅已审核）** 任务。
6. **Drafts（草稿）**：选择是导出任务的完整草稿标注（**Complete drafts（完整草稿）**），还是仅导出草稿标注的 ID（**Only IDs（仅 ID）**）以表示草稿存在。
7. **Predictions（预测）**：选择是导出任务的完整预测（**Complete predictions（完整预测）**），还是仅导出预测的 ID（**Only IDs（仅 ID）**）以表示该任务曾有过预测。
8. **Annotations（标注）**：启用你想要导出的标注类型。你可以指定 **Annotations（标注）**、**Ground Truth（真值）** 标注和 **Skipped（已跳过）** 标注。默认情况下仅导出标注。
9. （可选）启用 **Remove user details（移除用户详细信息）** 选项以移除用户的详细信息。
10. 点击 **Create a Snapshot（创建快照）** 以启动导出过程。
11. 你会看到可供下载的快照列表，其中包含有关快照内容、创建时间和创建者的详细信息。
12. 点击 **Download（下载）** 并选择你想要使用的导出格式。现在，快照文件将下载到你的计算机。

</div>

### 使用 Easy Export API 导出

你可以调用 Label Studio API 来导出标注。对于小型标注项目，调用[导出端点](https://api.labelstud.io/api-reference/api-reference/projects/exports/download-sync) 来导出标注。

#### 导出所有任务（包括没有标注的任务）

Label Studio 开源版默认仅导出带有标注的任务。如果你想轻松导出所有任务（包括没有标注的任务），可以使用查询参数 `download_all_tasks=true` 调用 [Easy Export API](https://api.labelstud.io/api-reference/api-reference/projects/exports/download-sync)。例如：
```
curl -X GET https://localhost:8080/api/projects/{id}/export?exportType=JSON&download_all_tasks=true
```

如果你的项目很大，你可以使用[快照导出](https://api.labelstud.io/api-reference/api-reference/projects/exports/create) 来在大多数情况下避免超时。快照默认包含所有没有标注的任务。

### 使用 Snapshot API 导出快照

对于拥有数十万个任务的大型标注项目，请执行以下操作：
1. 向[创建新导出文件或快照](https://api.labelstud.io/api-reference/api-reference/projects/exports/create) 发送 POST 请求。响应中包含所创建文件的 `id`。
2. 使用 `id` 作为 `export_pk`，[检查所创建导出文件的状态](https://api.labelstud.io/api-reference/api-reference/projects/exports/get)。
3. 使用所创建快照的 `id` 作为导出主键（或 `export_pk`），向[下载导出文件](https://api.labelstud.io/api-reference/api-reference/projects/exports/download) 发送 GET 请求。

## Label Studio 支持的导出格式

Label Studio 支持许多常见和标准的格式来导出已完成的标注任务。如果你没有看到适合你的格式，你可以贡献一种。有关更多信息，请参阅[我们 SDK 代码仓库中的 Label Studio Converter 工具](https://github.com/HumanSignal/label-studio-sdk/tree/master/src/label_studio_sdk/converter)。

### ASR_MANIFEST

将自动语音识别的音频转录标签导出为 [NVIDIA NeMo 模型](https://docs.nvidia.com/deeplearning/nemo/user-guide/docs/en/stable/core/core.html) 所期望的 JSON 清单格式。支持使用 `Audio` 标签与 `TextArea` 标签的音频转录标注项目。

```json
{“audio_filepath”: “/path/to/audio.wav”, “text”: “the transcription”, “offset”: 301.75, “duration”: 0.82, “utt”: “utterance_id”, “ctm_utt”: “en_4156”, “side”: “A”}
```

### 将画笔标签导出为 NumPy 和 PNG

将你的画笔掩码标签导出为 NumPy 二维数组和 PNG 图像。每个标签输出为一幅图像。支持使用 `BrushLabels` 标签的画笔标注图像项目。

### COCO

一种流行的机器学习格式，由 [COCO 数据集](http://cocodataset.org/#home) 用于目标检测和图像分割任务。支持使用 `BrushLabels`、`RectangleLabels`、`KeyPointLabels`（见下方说明）或 `PolygonLabels` 标签的边界框和多边形图像标注项目。

{% details <b>KeyPointLabels 导出支持</b> %}

如果使用 `KeyPointLabels`，你需要向标注配置中添加以下内容：

* 至少一个 `<RectangleLabels>` 选项。你将用它作为关键点的父级边界框。
* 为 `<KeyPointLabels>` 标签内的每个 `<Label>` 添加 `model_index`。`model_index` 值定义了 YOLO 输出数组中关键点坐标的顺序。

例如：

```xml
<View>
  <Image name="image" value="$image"/>

  <KeyPointLabels name="kp" toName="image">
    <Label value="nose" model_index="0"/>
    <Label value="eye" model_index="1"/>
    <Label value="tail" model_index="2"/>
  </KeyPointLabels>

  <RectangleLabels name="bbox" toName="image">
    <Label value="animal"/>
  </RectangleLabels>
</View>

```

标注完成后，你必须在 **Regions（区域）** 面板中将每个关键点区域拖放至其对应的矩形区域之下。

这会建立一个父子层级关系（通过 parentID），这是导出所必需的。请参阅下方的导出示例。

![边界框内关键点的截图](/images/import-export/keypoints.png)

**导出示例**

<div class="code-tabs">
  <div data-name="Keypoints in JSON">
```json
[
      {
        "result": [
          {
            "id": "17n06ubOJs",
            "type": "keypointlabels",
            "value": {
              "x": 6.675567423230974,
              "y": 20.597014925373134,
              "width": 0.26702269692923897,
              "keypointlabels": [
                "nose"
              ]
            },
            "origin": "manual",
            "to_name": "image",
            "parentID": "QHG4TBXuNC",
            "from_name": "kp",
            "image_rotation": 0,
            "original_width": 200,
            "original_height": 179
          },
          {
            "id": "QHG4TBXuNC",
            "type": "rectanglelabels",
            "value": {
              "x": 3.871829105473965,
              "y": 4.029850746268656,
              "width": 94.39252336448598,
              "height": 92.08955223880598,
              "rotation": 0,
              "rectanglelabels": [
                "animal"
              ]
            },
            "origin": "manual",
            "to_name": "image",
            "from_name": "bbox",
            "image_rotation": 0,
            "original_width": 200,
            "original_height": 179
          }
]
```
  </div>
  <div data-name="Keypoints in COCO">
```json
[
    {
      "id": 0,
      "image_id": 0,
      "category_id": 0,
      "segmentation": [],
      "bbox": [
        7.74365821094793,
        7.213432835820895,
        188.78504672897196,
        164.84029850746268
      ],
      "ignore": 0,
      "iscrowd": 0,
      "area": 31119.38345654903
    },
    {
      "id": 1,
      "image_id": 0,
      "category_id": 0,
      "keypoints": [
        13,
        37,
        2,
        33,
        33,
        2,
        167,
        24,
        2
      ],
      "num_keypoints": 3,
      "bbox": [
        13,
        24,
        154,
        13
      ],
      "iscrowd": 0
    }
]
```
  </div>
  <div data-name="Keypoints in YOLO">
```
0 0.5106809078771696 0.5007462686567165 0.9439252336448598 0.9208955223880598 0.06675567423230974 0.20597014925373133 2 0.1628838451268358 0.18507462686567164 2 0.8371161548731643 0.13134328358208955 2
```
  </div>
</div>
{% enddetails %}

### CoNLL2003

一种流行的格式，用于 [CoNLL-2003 命名实体识别挑战赛](https://www.clips.uantwerpen.be/conll2003/ner/)。支持使用 `Text` 和 `Labels` 标签的文本标注项目。

### CSV

结果以逗号分隔值的形式存储，列名由标注配置中 `"from_name"` 和 `"to_name"` 字段的值指定。支持所有项目类型。

### JSON

以[原始 JSON 格式](#Label-Studio-JSON-format-of-annotated-tasks) 存储的项目列表，保存在一个 JSON 文件中。使用此格式可同时导出数据集的数据和标注。支持所有项目类型。

### JSON_MIN

仅导出[原始 JSON 格式](#Label-Studio-JSON-format-of-annotated-tasks) 中的 `"from_name", "to_name"` 值的项目列表。使用此格式可导出数据集的标注和数据，而不包含 Label Studio 特定的字段。支持所有项目类型。

例如：
```json
{
  "image": "https://htx-pub.s3.us-east-1.amazonaws.com/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg",
  "tag": [{
    "height": 10.458911419423693,
    "rectanglelabels": [
        "Moonwalker"
    ],
    "rotation": 0,
    "width": 12.4,
    "x": 50.8,
    "y": 5.869797225186766
  }]
}
```

### Pascal VOC XML

一种流行的 XML 格式任务数据，用于目标检测和图像分割任务。支持使用 `RectangleLabels` 标签的边界框图像标注项目。

### spaCy

Label Studio 不支持直接导出为 spaCy 二进制格式，但你可以将 Label Studio 导出的标注转换为与 spaCy 兼容的格式。你必须安装 spacy python 包才能执行此转换。

要将 Label Studio 标注转换为 spaCy 二进制格式，请执行以下操作：
1. 将你的标注导出为 CONLL2003 格式。
2. 打开下载的文件，并更新导出文件的第一行，在第一行添加 `O`：
```
-DOCSTART- -X- O O
```
3. 在命令行中，运行 spacy convert 将 CoNLL 格式的标注转换为 spaCy 二进制格式，将 `/path/to/<filename>` 替换为你的标注的路径和文件名：

    spacy 2 版本：
    ```shell
    spacy convert /path/to/<filename>.conll -c ner
    ```
    spacy 3 版本：
    ```shell
    spacy convert /path/to/<filename>.conll -c conll .
    ```

    有关运行 spacy convert 的更多信息，请参阅 spaCy 文档中的[转换现有语料库和标注](https://spacy.io/usage/training#data-convert)。

### TSV

结果存储在以制表符分隔的表格文件中，列名由标注配置中的 `"from_name"` 和 `"to_name"` 值指定。支持所有项目类型。

### YOLO

以 YOLOv3 和 YOLOv4 格式导出目标检测标注。支持使用 `RectangleLabels` 和 `KeyPointLabels` 标签的目标检测标注项目。

!!! note
    如果使用 KeyPointLabels，请参阅 [COCO](#COCO) 下的说明。

{% insertmd zh-cn/includes/task_format.md %}

{% insertmd zh-cn/includes/image_units.md %}

## 手动将 JSON 标注转换为其他格式

你可以使用命令行或 Python，在已完成的 JSON 标注的目录或文件上运行 [Label Studio converter 工具](https://github.com/HumanSignal/label-studio-sdk/tree/master/src/label_studio_sdk/converter)，将已完成的标注从 Label Studio JSON 格式转换为其他格式。

!!! note
    如果你使用的是早于 1.0.0 的 Label Studio 版本，那么这是将 Label Studio JSON 格式标注转换为其他标注格式的唯一方法。

## 在 Label Studio 之外访问任务数据（图像、音频、文本）以用于 ML 后端

机器学习后端使用任务中的数据来进行预测，你需要在机器学习后端侧下载这些数据。Label Studio 提供了下载这些资源的工具，它们位于 label-studio-tools Python 包中。如果你使用的是官方 Label Studio 机器学习后端，则 label-studio-tools 包会随其他依赖项自动安装。

### 从 Label Studio 实例访问任务数据

在 Label Studio 中有几种存储任务资源（图像、音频、文本等）的方式：
- 云存储
- 外部 Web 链接
- 上传的文件
- 本地文件目录

Label Studio 以项目级别的结构存储上传的文件。每个项目都有自己的文件文件夹。

你可以使用 `label_studio_tools.core.utils.io.get_local_path` 来获取任务数据——它会将任务数据中的路径或 URL 转换为本地路径。对于本地路径，它将返回完整的本地路径，并在使用 `download_resources` 参数时下载资源。

请提供 `Hostname` 和 `access_token` 以访问外部资源。

### 在 Label Studio 实例之外访问任务数据

你可以使用 `label_studio_tools.core.utils.io.get_local_path` 方法，从外部机器获取外部链接和云存储的数据。

!!! attention "important"
    不要忘记提供凭据。

如果你将相同的磁盘挂载到你的机器，可以使用 `label_studio_tools.core.utils.io.get_local_path` 获取数据。如果你将相同的磁盘挂载到外部机器

访问数据的另一种方式是使用任务中的链接和 ACCESS_TOKEN（[请参阅身份验证文档](/guide/access_tokens)）。将 Label Studio 主机名和任务数据中的链接连接起来。然后将访问令牌添加到你的请求中：

```json
curl -X GET http://localhost:8080/api/projects/ -H 'Authorization: Token {YOUR_TOKEN}'
```

### 常见问题

#### 问题 #1：我发出了请求，但收到了以下 API 响应：
- 未提供数据。
- 返回了 404 或 403 错误码。

**回答：**
首先在你发送 API 请求时检查到 Label Studio 实例的网络访问。你可以使用示例数据执行测试 curl 请求。

#### 问题 #2：我尝试访问文件，但收到了 `FileNotFound` 错误。

**回答：**
1. 检查你是否挂载了与 Label Studio 实例相同的磁盘。然后首先检查文件在 Label Studio 实例中的存在情况。

2. 检查 Label Studio 实例中的 `LOCAL_FILES_DOCUMENT_ROOT` 环境变量，并将其添加到你的数据访问脚本中。

#### 问题 #3：如何修改 COCO 和 YOLO 导出的类别顺序？

标签默认按字母顺序排序，这是默认行为。如果你想修改它，请在 `<Label>` 中添加 **category** 属性来修改该行为。例如：

```xml
<Label value="abc" category="1" />
<Label value="def" category="2" />
```
