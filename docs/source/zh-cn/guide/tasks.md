---
title: 将数据导入 Label Studio
short: 导入数据
type: guide
tier: all
order: 157
order_enterprise: 157
meta_title: 将数据导入 Label Studio
meta_description: 使用常见文件格式或 Label Studio JSON 格式，为你的机器学习和数据科学项目标注和注释数据。
section: "导入与导出"
---

通过导入文件、引用 URL，或与云存储或数据库存储同步，将数据导入 Label Studio。

- 如果你的数据存储在云存储桶中，请参阅[从云或数据库存储同步数据](/guide/storage)。
- 如果你的数据存储在 Redis 数据库中，请参阅[从云或数据库存储同步数据](/guide/storage)。
- 如果你的数据存储在可通过互联网访问的 URL、文件或目录中，请[从 Label Studio UI 导入](#Import-data-from-the-Label-Studio-UI)。
- 如果你的数据存储在本地，请[从本地目录导入](#Import-data-from-a-local-directory)。
- 如果你的数据包含预测或预标注，请参阅[将预标注数据导入 Label Studio](/guide/predictions)。

## 导入数据的一般准则

* 为获得最佳性能，建议每个项目保持约 10 万个任务 / 10 万个标注。
* 避免频繁导入，因为每次新导入都需要较长的后台操作。每 30 秒一次导入可以避免过载。

!!! attention
    对于大型项目或业务关键型项目，请勿[通过 Label Studio 界面上传媒体文件](#Import-data-from-the-Label-Studio-UI)。对于图像、音频、视频、时序等文件尤其如此。

    通过 Label Studio UI 上传数据对于概念验证项目没有问题，但不建议用于较大的项目。Label Studio 并不是为大规模托管服务而设计的，并且没有为导入的媒体资源提供备份。

    **通过 UI 上传时的风险**：<br />
    当你尝试执行以下操作时将面临挑战：

        * 导入带预测的任务
        * 导出你的数据
        * 将数据迁移到另一个 Label Studio 实例
        * 重新部署 Label Studio

    我们***强烈***建议你改为配置[源存储](/guide/storage)。

## 你可以导入到 Label Studio 的数据类型

你可以导入多种类型的数据，包括文本、时序、音频和图像数据。支持的文件类型取决于数据类型。

| 数据类型 | 支持的文件类型 |
| --- | --- |
| 音频 | .flac, .m4a, .mp3, .ogg, .wav |
| [超文本（HTML）](#Import-HTML-data) | .html, .htm, .xml |
| 图像 | .bmp, .gif, .jpg, .png, .svg, .webp |
| 段落（对话） | .json |
| 结构化数据 | .csv, .tsv |
| [文本](#Plain-text) | .txt, .json |
| [时序](#Import-CSV-or-TSV-data) | .csv, .tsv, .json |
| [包含多种数据类型的任务](#Basic-Label-Studio-JSON-format) | .csv, .tsv, .json, .jsonl*, .parquet*+ |
| 视频 | .mp4, .webm |

\* *仅云存储*

\+ *仅 Label Studio 企业版和 Starter Cloud*

如果你没有看到想要导入的受支持的数据或文件类型，请通过向 <a className="no-go" href="https://github.com/humansignal/label-studio/issues">Label Studio 代码仓库</a> 提交 issue 告知我们。

### 如何导入你的数据

导入数据最安全可靠的方法是，将数据存储在 Label Studio 之外，并使用 URL 导入对数据的引用。你可以在 TXT、CSV 或 TSV 文件中导入 URL 列表，或在 [JSON 任务格式](#Basic-Label-Studio-JSON-format) 中引用 URL。

如果你要导入音频、图像或视频数据，必须使用 URL 来引用这些数据类型。

如果你在标注配置中使用 `<HyperText>`、`<Text>`、`<Paragraphs>` 或 `<TimeSeries>` 标签导入 HTML、文本、对话或时序数据，你可以直接加载数据，或从 URL 加载数据。
- 要从 URL 加载数据，请在标注配置中指定 `valueType="url"`。
- 要直接将数据加载到 Label Studio 数据库中，请为 `HyperText` 或 `Text` 数据指定 `valueType="text"`，或为 `Paragraph` 或 `TimeSeries` 数据指定 `valueType="json"`。

!!! note
    如果你从 URL 加载数据，数据不会保存到 Label Studio 中。如果你希望导出的标注任务包含你所标注的数据，则必须将数据导入 Label Studio 数据库而不使用 URL 引用，或者在导出后将数据与标注合并。

<br/>
{% details <b>点击展开包含每种 valueType 的示例配置</b> %}

#### valueType="text" 示例
<div style="margin-left: 1em;">

标注配置：

{% codeblock lang:xml %}
<View>
  <Text name="text1" value="text" valueType="text">
</View>
{% endcodeblock %}

要导入的 JSON 文件：
{% codeblock lang:json %}
{
  "text": "My awesome opossum"
}
{% endcodeblock %}

要导入的 CSV 文件：
{% codeblock lang:csv %}
text
My awesome opossum
{% endcodeblock %}

</div>

#### valueType="url" 示例

<div style="margin-left: 1em;">

标注配置：

{% codeblock lang:xml %}
<View>
  <Text name="text1" value="text" valueType="url">
</View>
{% endcodeblock %}

要导入的 JSON 文件：
{% codeblock lang:json %}
{
  "text": "http://example.com/text.txt"
}
{% endcodeblock %}

要导入的 CSV 文件：
{% codeblock lang:csv %}
text
http://example.com/text.txt
{% endcodeblock %}

</div>

{% enddetails %}

## 如何检索数据

要检索在 `Object` 标签中显示的数据，有几个步骤。该数据检索也用于[动态选项](/templates/serp_ranking.html)和[标签](/templates/inventory_tracking.html)。请在 `Object` 标签中使用以下参数。

### `value`（必填）

`value` 参数表示数据的来源。它可以是纯文本，也可以是复杂数据检索系统的一个步骤。它可以通过以下形式表示：

#### 变量

在大多数情况下，`Object` 标签的 value 中包含了一个变量（以 $ 为前缀）。

例如，`<Audio value="$audio" ... />` 会在导入的 JSON 对象中查找 "audio" 字段：
```json
{
  "data": {
    "audio": "https://host.name/myaudio.wav"
  }
}
```

#### 纯文本

value 参数可以是一个字符串。它对 `Header` 和 `Text` 很有用。

此外，你也可以使用标签的内容作为值。这对描述性文本标签很有用，适用于 `Label` 和 `Choice`。

例如：

```xml
<Header>标注音频：</Header>
<Header value="仅标注完全可见的车辆" />
<Text name="instruction" value="仅标注完全可见的车辆" />
<Label>猫</Label>

<Choice>其他</Choice>
```

#### 其他情况

1. value 参数可以是包含以 $ 为前缀的变量的文本。

    例如：
    ```xml
    <Header value="url: $image"/>
    ```

2. value 参数也可以引用数组和字典中的嵌套数据（`$texts[2]` 和 `$audio.url`）。

    例如：
    ```xml
    <Image name="image" value="$images[0]"/>
    ```

### `valueType`（可选）

`valueType` 参数定义了如何处理从上一步检索到的数据。有两个选项： "url" 和原始数据。目前原始数据输入可以是 "text" 或 "json"。其中 "text" 用于 `HyperText` 和 `Text` 标签，"json" 用于 `TimeSeries` 标签。

例如：

- 使用 "url"：`<Text name="text1" value="$text" valueType="url"/>` 会显示由 URL 加载的文本。

- 使用 "text"：`<Text name="text" value="$text" valueType="text"/>` 会显示 URL 而不加载文本。

### `resolver`（可选）

使用此参数从 [S3 或其他云存储](/guide/storage.html) 上的多列 CSV 中检索数据。Label Studio 只能在运行时检索它，因此是安全的。

如果你导入一个包含任务列表的文件，且列表中的每个任务都是存储中另一个文件的链接，在这种情况下，你可以使用 `resolver` 参数从存储中检索这些文件的内容。

#### 使用场景

有一个任务列表，其中每个任务的 "remote" 字段都是存储中某个 CSV 文件的链接。每个 CSV 文件都有一个用于标注的 "text" 列。例如：

任务：
```json
[
    { "remote": "s3://bucket/text1.csv" },
    { "remote": "s3://bucket/text2.csv" }
]
```

CSV 文件：
```csv
id;text
12;最灵活的数据标注工具。可快速安装。构建自定义 UI 或使用预构建的标注模板。
```

#### 解决方案

要检索文件，请使用以下参数：

1. `value="$remote"`：CSV 在 S3 上的 URL 位于任务数据的 "remote" 字段中。如果使用 `resolver` 参数，`value` 始终被视为 URL，因此你无需设置 `valueType`。

2. `resolver="csv|separator=;|column=text"`：在运行时加载此文件，将其解析为 CSV，并从第一行获取 "text" 列。

3. 显示结果。

#### 语法

`resolver` 参数的语法由以 `|` 符号分隔的选项列表组成。

第一个选项是文件类型。

!!! note
    目前仅支持 CSV 文件。

其余选项是所指定文件类型的参数以及可选值。CSV 文件的参数包括：

- `headless`：CSV 文件没有表头（此参数为布尔值，不能有值）。
- `separator=;`：CSV 分隔符，通常可以自动检测。
- `column=1`：在 `headless` 模式下使用从零开始的索引，否则使用列名。

例如，`resolver="csv|headless|separator=;|column=1"`

## 如何格式化要导入的数据

Label Studio 对不同类型的文件处理方式不同。

如果你希望同时导入多种类型的数据进行标注，例如带字幕的图像或带转录文本的音频录音，你必须使用[基本的 Label Studio JSON 格式](#Basic-Label-Studio-JSON-format)。

[你也可以先导入一个 CSV 文件或任务 JSON 列表来指向包含数据的 URL](#How-to-import-your-data)，而不是直接导入数据（如果你需要导入数千个文件）。你可以导入包含最多 250,000 个任务或最大 50MB 的文件到 Label Studio。

如果你在云存储桶或容器中指定数据，并且不想[同步云存储](/guide/storage.html)，请在 JSON、CSV、TSV 或 TXT 文件中创建并指定 [Amazon S3 存储的预签名 URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)、[Google Cloud Storage 的签名 URL](https://cloud.google.com/storage/docs/access-control/signed-urls) 或 [Microsoft Azure 的共享访问签名](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)。

### 基本的 Label Studio JSON 格式

将数据导入 Label Studio 的最佳方式是使用 JSON 格式的任务列表。JSON 文件的 `data` 键将每个任务作为 JSON 字典中的一个条目来引用。如果没有 `data` 键，Label Studio 会将整个 JSON 文件解释为一个任务。

在 `data` JSON 字典中，使用与你为项目设置的[标注配置](/guide/setup#Customize-the-labeling-interface-for-your-project)中对象标签所期望的源键相对应的键值对。

根据对象标签的类型，Label Studio 对字段值的解释方式不同：
- `<Text value="$key">`：`value` 被解释为纯文本。
- `<HyperText value="$key">`：`value` 被解释为 HTML 标记。
- `<HyperText value="$key" encoding="base64">`：`value` 被解释为 base64 编码的 HTML 标记。
- `<Audio value="$key">`：`value` 被解释为启用了服务器端 CORS 策略的音频文件的有效 URL。
- `<Image value="$key">`：`value` 被解释为图像文件的有效 URL。
- `<TimeSeries value="$key">`：如果 `valueType="url"`，`value` 被解释为 CSV/TSV 文件的有效 URL；否则，如果 `valueType="json"`，它被解释为带有列数组的 JSON 字典：`"value": {"first_column": [...], ...}`。有关[如何使用 valueType](#How-to-import-your-data) 的更多信息。

你可以向 JSON 文件添加其他可选键。

| JSON 键 | 说明 |
| --- | --- |
| annotations | 可选。从 Label Studio 导出的标注列表。[Label Studio 的标注格式](/guide/export#Raw-JSON-format-of-completed-tasks) 允许你导入标注结果，以便在后续标注任务中使用它们。 |
| predictions | 可选。模型预测结果列表，其中每个结果都使用 [Label Studio 的预测格式](/guide/export#Raw-JSON-format-of-completed-tasks) 保存。导入预测以用于自动任务预标注和主动学习。请参阅[将预测标签导入 Label Studio](/guide/predictions)。 |

有关导出任务的 JSON 格式的更多详细信息，请参阅导出文档中的[相关 JSON 属性说明](/guide/export#Relevant-JSON-property-descriptions)。

### JSON 格式示例

以一个文本分类项目为例，你可以设置如下标注配置：
```xml
<View>
  <Text name="message" value="$my_text"/>
  <Choices name="sentiment_class" toName="message">
    <Choice value="Positive"/>
    <Choice value="Neutral"/>
    <Choice value="Negative"/>
  </Choices>
</View>

```

然后，你可以导入符合以下 JSON 格式的文本任务进行标注：

```yaml
[{
  # "data" 必须包含文本标注配置中定义的 "my_text" 字段作为值，并可以可选地包含其他字段
  "data": {
    "my_text": "Opossums are great",
    "ref_id": 456,
    "meta_info": {
      "timestamp": "2020-03-09 18:15:28.212882",
      "location": "North Pole"
    }
  },

  # annotations 不是必需的，是与标注配置模式匹配的标注结果列表
  "annotations": [{
    "result": [{
      "from_name": "sentiment_class",
      "to_name": "message",
      "type": "choices",
      "readonly": false,
      "hidden": false,
      "value": {
        "choices": ["Positive"]
      }
    }]
  }],

  # "predictions" 与 "annotations" 非常相似
  # 只是它们还包含一些与 ML 相关的字段，例如预测的 "score"
  "predictions": [{
    "result": [{
      "from_name": "sentiment_class",
      "to_name": "message",
      "type": "choices",
      "readonly": false,
      "hidden": false,
      "value": {
        "choices": ["Neutral"]
      }
    }],
  # score 用于主动学习采样模式
    "score": 0.95
  }]
}]
```

#### 包含多个任务的 JSON 示例
如果你仅使用 Label Studio 导入对话框（数据管理器 => 导入按钮）上传 JSON 文件，或者从[云存储](/guide/storage.html) 导入，你可以将多个任务放在一个 JSON 文件中。使用云存储时，你必须确保文件中的每个任务格式都相同。

如果你使用的是[源云存储](/guide/storage.html)，你也可以将多个任务放在换行符分隔的 JSON 文件（JSONL/NDJSON）中。

<br/>
{% details <b>要将多个任务放在一个 JSON 文件中，请使用以下 JSON 格式示例</b> %}
此示例包含多个没有标注或预测的文本分类任务。

"data" 参数必须包含文本标注配置中定义的 "my_text" 字段，并可以可选地包含其他字段。"id" 参数不是必需的。

{% codeblock lang:json %}
[
   {
      "id":1,
      "data":{
         "my_text":"Opossums like to be aloft in trees."
      }
   },
   {
      "id":2,
      "data":{
         "my_text":"Opossums are opportunistic."
      }
   },
   {
      "id":3,
      "data":{
         "my_text":"Opossums like to forage for food."
      }
   }
]
{% endcodeblock %}

如果你没有嵌套，也可以使用 "data" 字段的裸内容，前提是你没有标注或预测。

{% codeblock lang:json %}
[
   {
      "my_text":"Opossums like to be aloft in trees."
   },
   {
      "my_text":"Opossums are opportunistic."
   },
   {
      "my_text":"Opossums like to forage for food."
   }
]
{% endcodeblock %}
{% enddetails %}

#### 旧版本 Label Studio 的 JSON 示例
如果你仍在使用早于 1.0.0 的 Label Studio 版本，请参阅此示例 JSON 格式。

<br/>
{% details <b>对于早于 1.0.0 的 Label Studio 版本，请使用此 JSON 格式示例。</b> %}
如果你使用的是早于 1.0.0 版本的 Label Studio，请导入符合以下 JSON 格式的任务：

{% codeblock lang:json %}
[{
  # "data" 必须包含标注配置定义的 "my_text" 字段，
  # 并可以可选地包含其他字段
  "data": {
    "my_text": "Opossums are great",
    "ref_id": 456,
    "meta_info": {
      "timestamp": "2020-03-09 18:15:28.212882",
      "location": "North Pole"
    }
  },

  # completions 是与标注配置模式匹配的标注结果列表
  "completions": [{
    "result": [{
      "from_name": "sentiment_class",
      "to_name": "message",
      "type": "choices",
      "value": {
        "choices": ["Positive"]
      }
    }]
  }],

  # "predictions" 与 "completions" 非常相似
  # 只是它们还包含一些与 ML 相关的字段，例如预测的 "score"
  "predictions": [{
    "result": [{
      "from_name": "sentiment_class",
      "to_name": "message",
      "type": "choices",
      "value": {
        "choices": ["Neutral"]
      }
    }],
  # score 用于主动学习采样模式
    "score": 0.95
  }]
}]
{% endcodeblock %}
{% enddetails %}

### 导入 CSV 或 TSV 数据

当你导入 CSV / TSV 格式的文本文件时，Label Studio 将列名解释为与你所设置的标注配置相对应的任务数据键：
```csv
my_text,optional_field
this is a first task,123
this is a second task,456
```

!!! note
    如果你的标注配置包含 `TimeSeries` 标签，Label Studio 在导入时会将 CSV/TSV 解释为时序数据。此 CSV/TSV 作为资源文件托管，Label Studio 会自动创建一个指向所上传 CSV/TSV 的任务。

### 纯文本

以纯文本形式导入数据。Label Studio 将纯文本文件中的每一行解释为一个独立的数据标注任务。

如果你的输入数据流只有一个，并且在标注配置中只指定了一个[对象标签](/tags)，你可能会使用纯文本进行标注任务。

```text
this is a first task
this is a second task
```

如果你想导入整个纯文本文件而不让每一行都成为新的标注任务，请自定义标注配置，在 Text 标签中指定 `valueType="url"`。请参阅[Text 标签文档](/tags/text.html)。有关[如何使用 valueType 字段](#How-to-import-your-data) 的更多信息。

### 导入 HTML 数据

你可以以 HTML 格式的文件导入 `HyperText` 数据，并在 Label Studio 中对其进行标注。当你直接导入 HTML 文件时，内容会通过压缩文本、删除 HTML 代码中的空白和其他非功能性数据来进行精简。你创建的标注会应用于精简后的 HTML 版本。

如果你想标注 HTML 文件而不精简数据，可以执行以下任一操作：
- 从[外部云存储（如 Amazon S3 或 Google Cloud Storage）](/guide/storage.html) 将 HTML 文件作为 BLOB 存储导入。
- 按照本页的[如何导入你的数据](#How-to-import-your-data) 中所述，更新标注配置中的 `HyperText` 标签以指定 `valueType="url"`。

## 从本地目录导入数据

要从本地目录导入数据，你有两个选项：
- 运行一个 Web 服务器为文件生成 URL，然后上传一个引用这些 URL 的文件到 Label Studio。
- 在 Label Studio UI 中将文件目录添加为源或目标的[本地存储](/guide/storage.html#Local-storage) 连接。

### 运行 Web 服务器为本地文件生成 URL

要运行 Web 服务器为文件生成 URL，你可以参考 Label Studio 代码仓库中提供的[辅助 shell 脚本](https://github.com/HumanSignal/label-studio/blob/develop/scripts/serve_local_files.sh)，或者编写你自己的脚本。
使用该脚本执行以下操作：
1. 在你要让 Label Studio 导入的文件目录所在的机器上，调用辅助脚本并指定一个正则表达式模式以匹配你要导入的文件。在此示例中，脚本识别具有 JPG 文件扩展名的文件：
   ```bash
   ./script/serve_local_files.sh <directory/with/files> *.jpg
   ```
   该脚本收集该 HTTP 服务器提供的文件链接，并将它们保存到 `files.txt` 文件中，每行一个 URL。
3. 使用 Label Studio UI 将包含 URL 的文件导入 Label Studio。

!!! note
    在执行数据标注时，你必须保持 Web 服务器运行，以便 URL 对 Label Studio 保持可访问。

如果你的标注配置支持 HyperText 或多种数据类型，请使用 Label Studio JSON 格式来指定本地文件位置，而不是使用 `txt` 文件。请参阅[此格式的示例](/guide/storage#Tasks-with-local-storage-file-references)。

如果你从如下创建的 HTTP 服务器提供数据：`python -m http.server 8081 -d`，你可能需要为该服务器设置 CORS，以便 Label Studio 能够成功访问数据文件。如果需要，请从命令行运行以下命令：
```bash
npm install http-server -g
http-server -p 3000 --cors
```

### 在 Label Studio UI 中将文件目录添加为源存储

如果你在 Docker 上运行 Label Studio 并想添加本地文件存储，你需要挂载文件目录并设置环境变量。请参阅[在 Docker 上运行 Label Studio 并使用本地存储](https://labelstud.io/guide/start#Run-Label-Studio-on-Docker-and-use-Local-Storage)。

## 从 Label Studio UI 导入数据

!!! attention
    对于大型项目或业务关键型项目，请勿[通过 Label Studio 界面上传媒体文件](#Import-data-from-the-Label-Studio-UI)。对于图像、音频、视频、时序等文件尤其如此。

    通过 Label Studio UI 上传数据对于概念验证项目没有问题，但不建议用于较大的项目。Label Studio 并不是为大规模托管服务而设计的，并且没有为导入的媒体资源提供备份。

    **通过 UI 上传时的风险**：<br />
    当你尝试执行以下操作时将面临挑战：

        * 导入带预测的任务
        * 导出你的数据
        * 将数据迁移到另一个 Label Studio 实例
        * 重新部署 Label Studio

    我们***强烈***建议你改为配置[源存储](/guide/storage)。

要从 Label Studio UI 导入数据，请执行以下操作：
1. 在 Label Studio UI 中，打开特定项目的数据管理器页面。
2. 点击 **Import（导入）** 打开导入对话框。
3. 从文件或 URL 导入你的数据。

你导入的数据是特定于项目的。

<img src="/images/screens/import-button.png" class="img-template-example" title="数据管理器中的导入按钮" />

## 使用 API 导入数据

使用 Label Studio API 导入你的数据。请参阅[用于导入任务的 API 文档](/api#operation/api_projects_import_create)。

### 从命令行导入数据

在早于 1.0.0 的 Label Studio 版本中，你可以使用命令行从本地目录导入数据。

要从命令行导入数据，请执行以下操作：

1. 启动 Label Studio 并使用命令行参数指定数据的路径和数据的格式。<br/>例如：<br/>`label-studio init --input-path my_tasks.json --input-format json`
2. 打开 Label Studio UI 并确认你的数据已正确导入。

你可以使用 `--input-path` 参数指定要标注的数据的文件或目录。你可以使用 `--input-format` 参数指定其他数据格式。例如，运行以下命令以启动 Label Studio 并从本地目录导入音频文件：

```bash
label-studio init my-project --input-path=my/audios/dir --input-format=audio-dir --label-config=config.xml --allow-serving-local-files
```

!!! warning
    `--allow-serving-local-files` 参数仅用于本地运行的 Label Studio 实例。除非你确定自己在做什么，否则请避免将其用于远程服务器。

默认情况下，Label Studio 期望使用[基本 Label Studio JSON 格式](/guide/tasks#Basic-Label-Studio-JSON-format) 的 JSON 格式任务。

如果在 Label Studio 启动后你向本地目录添加了更多文件，则必须重新启动 Label Studio 才能导入附加文件中的任务。
