---
title: Troubleshooting Label Studio
short: Troubleshooting Label Studio
tier: opensource
type: guide
order: 460
order_enterprise: 0
hide_menu: true
meta_title: Troubleshooting Label Studio
meta_description: Troubleshooting issues in Label Studio Community Edition
date: 2024-09-03 09:57:28
---

!!! error Enterprise
    本页面涵盖 Label Studio 社区版的常见用户故障排查场景。有关特定于 Label Studio Enterprise 的信息，请参阅我们的 [支持中心文章](https://support.humansignal.com/hc/en-us)。

## 安装

请参阅 [排查安装问题](install_troubleshoot)。

## 项目

### 加载项目时出现空白页

在启动 Label Studio 并打开项目后，你看到空白页。可能有几个可能的问题导致此情况。

如果你在启动 Label Studio 时指定了一个没有协议（如 `http://` 或 `https://`）的主机，Label Studio 可能无法找到正确的文件来加载项目页面。

要解决此问题，请更新作为环境变量或在启动 Label Studio 时指定的主机。请参阅 [启动 Label Studio](start)。

## 标注

### 标注时速度缓慢

* 如果你使用的是 SQLite 数据库，而另一个用户导入了大量数据，由于数据库负载，服务器上其他用户的标注可能会变慢。

* 如果你想上传大量数据（数千个项目），请考虑在人们没有进行标注的时候进行，或者使用不同的数据库后端，例如 PostgreSQL 或 Redis。你可以从 Label Studio 的根目录运行 Docker Compose 来使用 PostgreSQL：`docker-compose up -d`，或请参阅 [从云或数据库存储同步数据](storage)。

* 如果你使用的标注模式有成千上万个标签，请考虑改用 [外部分类法](/tags/taxonomy.html)。

### 标注时图像/音频/资源加载错误

资源加载时最常见的错误是 <b>CORS</b>（跨域资源共享）问题或跨域问题。当你尝试从外部托管获取图片时，可能会因安全原因被阻止。

打开你的浏览器控制台并检查其中的错误。通常，此问题通过外部主机配置来解决。

- 如果你作为管理员有权访问托管服务器，则需要为 Web 服务器允许 CORS。例如，在 nginx 上，你可以尝试将以下行添加到 `/etc/nginx/nginx.conf` 的 `location` 部分下：

{% details <b>点击查看详情</b> %}
 ```conf
  location <YOUR_LOCATION> {
       if ($request_method = 'OPTIONS') {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
          #
          # 各种浏览器*应该*接受但事实并非如此的自定义标头和标头
          #
          add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
          #
          # 告诉客户端此预检信息在 20 天内有效
          #
          add_header 'Access-Control-Max-Age' 1728000;
          add_header 'Content-Type' 'text/plain; charset=utf-8';
          add_header 'Content-Length' 0;
          return 204;
       }
       if ($request_method = 'POST') {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
          add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
          add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
       }
       if ($request_method = 'GET') {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
          add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
          add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
       }
  }
  ```
{% enddetails %}
* 对于 Amazon S3，请参阅 Amazon S3 用户指南中的 [配置和使用跨域资源共享（CORS）](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)。
* 对于 GCS，请参阅 Google Cloud Storage 文档中的 [配置跨域资源共享（CORS）](https://cloud.google.com/storage/docs/configuring-cors)。
* 对于 Microsoft Azure，请参阅 Microsoft Azure 文档中的 [Azure 存储的跨域资源共享（CORS）支持](https://docs.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services)。
* 如果你从如下创建的 HTTP 服务器提供数据：`python -m http.server 8081 -d`，请从命令行运行以下命令：
```bash
npm install http-server -g
http-server -p 3000 --cors
```

并非每个主机都支持 CORS 设置，但你可以尝试在主机配置的管理区域中找到 CORS 设置。

### 音频波形与标注不匹配

如果你发现标注音频数据后，可见的音频波形与时间戳和声音不匹配，请尝试将音频转换为不同的格式。例如，如果你正在标注 mp3 文件，请尝试将它们转换为 wav 文件。

```bash
ffmpeg -y -i audio.mp3 -ar 8k -ac 1 audio.wav
```

### 标注员看不到预测

请参阅下面的 [预标注](#Pre-annotations)。

## 云存储与本地存储

在使用外部云存储连接（S3、GCS、Azure）时，请记住以下几点：

* 对于源存储：
   * 当选择 **Files（文件）** 导入方法时，Label Studio 不会导入存储桶中存储的数据，而是创建对对象的 *引用*。因此，你完全控制要同步并在标注屏幕上显示的数据。
   * 当选择 **Tasks（任务）** 导入方法时，假定存储桶文件是不可变的；将更新文件的状态推送到 Label Studio 的唯一方法是使用新文件名将其上传到存储，或者删除与该文件关联的所有任务并重新同步。
* 与外部存储桶的同步操作仅单向进行。它要么从存储桶上的对象创建任务（源存储），要么将标注推送到输出存储桶（目标存储）。在存储桶端更改某些内容并不能保证结果的一致性。
* 我们建议每个 Label Studio 项目使用单独的存储桶文件夹。

### CORS 错误

如果你尚未设置 CORS，则无法从 Label Studio 查看云存储数据。你可能会在 Web 浏览器控制台中看到数据链接而不是数据预览，或者看到 CORS 错误：

* 对于 Amazon S3，请参阅 Amazon S3 用户指南中的 [配置和使用跨域资源共享（CORS）](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)。
* 对于 GCS，请参阅 Google Cloud Storage 文档中的 [配置跨域资源共享（CORS）](https://cloud.google.com/storage/docs/configuring-cors)。
* 对于 Microsoft Azure，请参阅 Microsoft Azure 文档中的 [Azure 存储的跨域资源共享（CORS）支持](https://docs.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services)。

!!! note
    1. 确保为你的服务账户应用了正确的角色和权限。例如，向服务账户分配服务账户角色 "roles/iam.serviceAccountTokenCreator"。

    2. 如果服务账户 `labelstudio` 的名称使用了 DEBUG 日志中显示的错误，则可以使用 `label-studio start` 命令中的 `--log-level DEBUG` 标志启用它们。

### 403 错误

如果你在 Web 浏览器控制台中看到 403 错误，请确保配置了正确的凭据。

{% details <b>Google Cloud Storage 凭据</b> %}

请参阅 Google Cloud Storage 文档中的 [设置身份验证](https://cloud.google.com/storage/docs/reference/libraries#setting_up_authentication) 和 [Cloud Storage 的 IAM 权限](https://cloud.google.com/storage/docs/access-control/iam-permissions)。

你的账户必须具有 **Service Account Token Creator（服务账户令牌创建者）** 角色、**Storage Object Viewer（存储对象查看者）** 角色和 **storage.buckets.get** 访问权限。

此外，如果你使用服务账户来授权访问 Google Cloud Platform，请确保已激活它。请参阅 Google Cloud SDK 中的 [gcloud auth activate-service-account](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account)：命令行界面文档。

{% enddetails %}

{% details <b>Amazon S3 凭据</b> %}

对于 Amazon S3，请参阅 Amazon AWS 命令行界面用户指南中的 [配置和凭据文件设置](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)。还要检查你的凭据是否可从 [aws 客户端](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) 正常工作。

 * 确保在创建存储桶时指定了正确的区域。如果需要，请在源或目标存储设置或 `.aws/config` 文件中更改区域，否则你可能会在访问存储桶对象时遇到问题。
    例如，更新以下内容：`~/.aws/config`

    ```
    [default]
    region=us-east-2  # 更改为你的存储桶的区域
    ```
- 确保你用于设置源或目标存储连接的凭据仍然有效。如果你在浏览器控制台中看到 403 错误，并且你为存储桶设置了正确的权限，你可能需要更新 Access Key ID、Secret Access Key 和 Session ID。请参阅 AWS Identity and Access Management 文档中的 [请求临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html)。

{% enddetails %}

### 点击同步不会更新我的数据

有时同步过程不会立即启动。这是因为同步过程基于内部作业调度器。如果一段时间后没有任何反应，请按照以下步骤操作。

首先，检查你是否指定了正确的凭据（请参阅上面的部分）。

然后转到云存储设置页面，点击云连接旁边的 **Edit（编辑）**。从这里，你可以检查以下内容：

* **File Filter Regex（文件过滤器正则表达式）** 已设置且正确。当未指定过滤器时，所有找到的项目都将被跳过。过滤器应该是有效的正则表达式，而不是通配符（例如 `.*` 是有效的，`*.` 是无效的）
* **Import method（导入方法）** 应设置为 `Files`，用于简单情况，如果你处理的是图像、音频、文本文件或存储在存储桶中的任何其他二进制内容。

    这会指示 Label Studio 使用 URI 链接（如 `s3://bucket/1.jpg`）自动创建任务，并在打开标注屏幕时将它们解析为预签名的 `https` URL。

    如果你在存储桶中存储了 Label Studio 格式的 JSON/JSONL 任务或 Parquet 文件 —— 请将此选项设置为 "Tasks"。

* 检查 rq worker 失败。检查 rq worker 的一种简单方法是完成一次导出操作。

    从数据管理器，点击 **Export（导出）**，并创建一个新的快照并下载 JSON 文件。如果你看到错误，很可能你的 rq worker 有问题。检查 rq worker 的另一种方法是作为超级用户登录并转到 `/django-rq` 页面。你应该看到一个 `workers` 列。如果值为 `0` 或该列为空，这可能表示出现故障。

### 来自云存储的 JSON 文件未同步，且数据管理器为空

1. 编辑存储设置。如果你在数据管理器中看到任务，请继续执行第 2 步。
2. 将 **Import method（导入方法）** 设置为 "Tasks"。

    如果你在数据管理器中没有看到任务，则你的存储桶只有 LIST 权限，而没有 GET 权限。

如果只有 LIST 权限，Label Studio 可以扫描存储桶中对象的存在而无需实际读取它们。有了 GET 权限，Label Studio 可以读取数据并适当地提取你的 JSON 文件。

### 任务没有按我期望的方式加载

如果任务同步到 Label Studio 但没有按你期望的方式出现，可能是使用 URL 而不是图像，或者在你期望看到多个任务的地方只有一个任务，请检查以下内容：
- 如果你将 JSON 文件放在 [云存储](storage.html) 中，请确保如果你在同一文件中有多个任务，它们的格式都相同（例如，你不能在一个文件中有 1 个包含 `data` 字段原始内容的任务，而另一个任务包含同一文件中的标注和预测）。
- 如果你正在同步图像或音频文件，请确保 **Import method（导入方法）** 设置为 "Files"。

### 使用 Windows 时无法访问本地存储

如果你使用的是 Windows：

1. 设置环境变量 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 时，请确保使用双反斜杠（`\\`）。这是必要的，因为你必须对反斜杠（\）进行转义。
2. 在配置项目的本地存储时，在输入 **Absolute local path（绝对本地路径）** 时，请确保使用单反斜杠（`\`）。
3. 不要在 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 或 **Absolute local path（绝对本地路径）** 中使用空格或非拉丁符号。

示例：

```bash
LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=c:\\data\\media
Absolute local path from Local Storage settings = c:\data\media\subpath
```

## 预标注

检查你是否使用了正确的标注单位。

{% details <b>图像标注单位</b> %}

{% insertmd zh-cn/includes/image_units.md %}

{% enddetails %}

### 标注员无法看到预测

如果标注员看不到预测，或者你在 [将预标注导入 Label Studio](predictions) 后遇到意外行为，请查看此指南以解决问题。

首先，在你项目的 **Settings > Annotation（设置 > 标注）** 部分，确保 **Use predictions to pre-label tasks（使用预测为任务预标注）** 已启用。

#### 检查标注配置和任务的配置值

预标注任务 JSON 的 `from_name` 必须与标注配置中 `<Labels name="label" toName="text">` 部分的 `name` 值匹配。`to_name` 必须与 `toName` 值匹配。

例如，以下 XML：
  ```xml
  ...
  <Choices name="choice" toName="image" showInLine="true">`
  ...
  <RectangleLabels name="label" toName="image">
  ...
  ```

应与示例 JSON 的以下部分相对应：
```json
...
"type": "rectanglelabels",        
"from_name": "label", "to_name": "image",
...
type": "choices",
"from_name": "choice", "to_name": "image",
...
```

#### 检查配置和任务中的标签

确保你为标注界面设置了标注配置，并且 JSON 文件中的标签与配置中的标签完全匹配。如果你使用 [转换模型输出的工具](https://github.com/HumanSignal/label-studio-transformers)，请确保标签没有被该工具更改。

#### 检查 ID 和 toName 值

如果你正在执行嵌套标注，例如为特定的 Label 或 Choice 值显示 TextArea 标签，则这些结果的 ID 必须匹配。

例如，如果你想在此标注配置旁边转录文本以及命名实体解析任务，你可能会有以下的标注配置：
```xml
  <View>
    <Labels name="label" toName="text">
      <Label value="PER" background="red"/>
      <Label value="ORG" background="darkorange"/>
      <Label value="LOC" background="orange"/>
      <Label value="MISC" background="green"/>
    </Labels>
    <Text name="text" value="$text"/>
    <TextArea name="entity" toName="text" perRegion="true"/>
  </View>
```

如果你想为此标注配置添加预测文本和转录建议，你可以使用以下示例 JSON。

{% details <b>点击查看详情</b> %}
```json
{
"data":{
         "text":"The world that we live in is a broad expanse of nothingness, said the existential philosopher, before he rode away with his cat on his motorbike. "
      },
   "predictions":[
      {
            "result":[
               {
                  "value":{
                     "start":135,
                     "end":144,
                     "text":"motorbike",
                     "labels":[
                        "ORG"
                     ]
                  },
                  "id":"def",
                  "from_name":"ner",
                  "to_name":"text",
                  "type":"labels"
               },
               {
                  "value":{
                     "start":135,
                     "end":144,
                     "text":[
                        "yay"
                     ]
                  },
                  "id":"def",
                  "from_name":"entity",
                  "to_name":"text",
                  "type":"textarea"
               }
            ]
      }
   ]
}
```

{% enddetails %}

因为 TextArea 标签应用于每个标注区域，标签结果和 textarea 结果的 ID 必须匹配。

#### 只读和隐藏区域

在某些情况下，隐藏或使 `read-only`（只读）边界框、文本跨度、音频片段等非常有帮助。你可以将 `"readonly": true` 或 `"hidden": true` 放在区域中以实现此目的（在 `annotations.result` 列表内的字典中）。

## 导出

### HTML 标签偏移位置错误

如果导出的 HTML 标签的偏移与你期望的输出不匹配，例如 HTML 命名实体识别（NER）任务，最常见的原因是由于 HTML 压缩（minification）。当你将 HTML 文件上传到 Label Studio 进行标注时，HTML 会被压缩以删除空白。当你标注这些任务时，标签的偏移应用于 HTML 的压缩版本，而不是原始未修改的 HTML 文件。

要防止 HTML 文件被压缩，你可以使用不同的导入方法。请参阅 [导入 HTML 数据](tasks.html#Import-HTML-data) 了解更多信息。

如果你想更正现有的标注，你可以用与 Label Studio 相同的方式压缩你的源 HTML 文件。压缩是使用以下脚本执行的：

```python
import htmlmin

with open("sample.html", "r") as f:
html_doc = f.read()

minified_html_doc = htmlmin.minify(html_doc, remove_all_empty_space=True)
```

如果压缩似乎没有影响偏移位置，则复杂 CSS 或其他原因可能是原因。

## ML 后端

你可以使用服务器控制台日志调查大多数问题。机器学习后端作为与 Label Studio 分开的服务器运行，因此在故障排查时请确保检查正确的服务器控制台日志。要查看更详细的日志，请使用 `--debug` 选项启动 ML 后端服务器。

如果你正在运行 ML 后端：
- 生产训练日志位于 `my_backend/logs/rq.log`
- 生产运行时日志位于 `my_backend/logs/uwsgi.log`
在开发模式下，训练日志出现在 Web 浏览器控制台中。

如果你使用 Docker Compose 运行 ML 后端：
- 训练日志位于 `logs/rq.log`
- 主进程和推理日志位于 `logs/uwsgi.log`

### Label Studio 对 ML 服务器请求的默认超时设置

Label Studio 对所有类型的 ML 服务器请求都有默认超时。

Label Studio 对 ML 服务器有几种不同的请求：
1. Health（健康检查）- 添加新 ML 后端时检查 ML 后端健康状态的请求（环境变量 `ML_TIMEOUT_HEALTH`）
2. Setup（设置）- 设置 ML 后端、初始化 ML 模型的请求（环境变量 ML_TIMEOUT_SETUP）
3. Predict（预测）- Label Studio 从 ML 后端获取预测时的预测请求（环境变量 `ML_TIMEOUT_PREDICT`）
4. Train（训练）- 训练 ML 后端的请求（环境变量 `ML_TIMEOUT_PREDICT`）
5. Duplicate model（重复模型）- 向 ML 后端发送重复模型请求（环境变量 `ML_TIMEOUT_PREDICT`）
6. Delete（删除）- 向 ML 后端发送删除请求（环境变量 `ML_TIMEOUT_PREDICT`）
7. Train job status（训练作业状态）- 从 ML 后端请求训练作业状态的请求（环境变量 `ML_TIMEOUT_PREDICT`）

你可以通过为每个请求设置环境变量或在 Label Studio 变量中修改来调整超时。这些是 Label Studio 中的变量（以秒为单位）：

```python
CONNECTION_TIMEOUT = float(get_env('ML_CONNECTION_TIMEOUT', 1))  
TIMEOUT_DEFAULT = float(get_env('ML_TIMEOUT_DEFAULT', 100))  
TIMEOUT_TRAIN = float(get_env('ML_TIMEOUT_TRAIN', 30))
TIMEOUT_PREDICT = float(get_env('ML_TIMEOUT_PREDICT', 100))
TIMEOUT_HEALTH = float(get_env('ML_TIMEOUT_HEALTH', 1))
TIMEOUT_SETUP = float(get_env('ML_TIMEOUT_SETUP', 3))
TIMEOUT_DUPLICATE_MODEL = float(get_env('ML_TIMEOUT_DUPLICATE_MODEL', 1))
TIMEOUT_DELETE = float(get_env('ML_TIMEOUT_DELETE', 1))
TIMEOUT_TRAIN_JOB_STATUS = float(get_env('ML_TIMEOUT_TRAIN_JOB_STATUS', 1))
```

你可以在 [ml/api_connector.py](https://github.com/HumanSignal/label-studio/blob/develop/label_studio/ml/api_connector.py#L22..L31) 中修改它们。

### 我启动了 ML 后端，但在 Label Studio UI 中添加后它显示为 **Disconnected（已断开连接）**

你的 ML 后端服务器可能未正确启动。

1. 检查 ML 后端服务器是否正在运行。运行以下健康检查：<br/> `curl -X GET http://localhost:9090/health`
2. 如果健康检查没有响应，或者你看到错误，请检查服务器日志。
3. 如果你使用 Docker Compose 启动 ML 后端，请检查用于设置 Docker 内部环境的 `requirements.txt` 文件中是否有缺失的要求。

### ML 后端似乎已连接，但在我点击 "Start Training（开始训练）" 后，我看到 "Error. Click here for details.（错误。点击此处查看详情。）" 消息

点击错误消息以查看回溯。你可能看到的常见错误包括：
- 完成的标注数量不足以开始训练。
- 服务器上的内存问题。
如果你无法自己解决回溯问题，<a href="https://slack.labelstud.io/?source=docs-ML">在 Slack 上联系我们</a>。

### 我的预测是错误的，或者我在标注页面上看不到模型预测结果

你的 ML 后端可能以错误的格式生成预测。

- 检查 ML 后端预测格式是否遵循与 [导入的预标注中的预测](predictions.html) 相同的结构。
- 确认你项目的标签配置与你的 ML 后端产生的输出相匹配。例如，使用 `<Choices>` 标签为文本创建一类预测。查看更多 [Label Studio 标签](/tags)。

### 模型后端无法启动或正常运行

如果你在启动 ML 后端服务器后的终端或日志中看到有关缺失包的错误，你可能需要为你的 ML 后端在 `requirements.txt` 文件中指定额外的包。

### ML 后端无法访问任务

由于 ML 后端和 Label Studio 是不同的服务，你标注的资产（图像、音频等）必须由机器学习后端托管并且可以通过 URL 访问，否则它可能无法创建预测。

### 添加 ML 后端时出现验证错误

如果你在将 ML 后端 URL 添加到 Label Studio 项目时遇到验证错误，请检查以下内容：
- 标注界面是否使用有效配置进行了设置？
- 机器学习后端是否正在运行？运行以下健康检查：<br/> `curl -X GET http://localhost:9090/health`
- 你的机器学习后端是否可从你的 Label Studio 实例访问？它必须对运行 Label Studio 的实例可用。

如果你在 Docker 中运行 Label Studio，则必须在同一个 Docker 容器内运行机器学习后端，或以其他方式使其对运行 Label Studio 的 Docker 容器可用。你可以使用 `docker exec` 命令在 Docker 容器内运行命令，或使用 `docker exec -it <container_id> /bin/sh` 在容器的上下文中启动 shell。请参阅 [docker exec 文档](https://docs.docker.com/engine/reference/commandline/exec/)。

### Windows 上的 No such file or directory 错误

如果你在 Windows 上运行 `docker-compose up --build` 时遇到类似于以下的错误：

```
exec /app/start.sh : No such file or directory
exited with code 1
```

此问题可能是由 Windows 对文本文件中行尾的处理引起的，这会影响 `start.sh` 等脚本。要解决此问题，请按照以下步骤操作：

#### 第 1 步：调整 Git 配置

在克隆仓库之前，请确保你的 Git 配置为在检出文件时不自动将行尾转换为 Windows 风格（CRLF）。这可以通过将 `core.autocrlf` 设置为 `false` 来实现。打开 Git Bash 或你喜欢的终端并执行以下命令：

```
git config --global core.autocrlf false
```

#### 第 2 步：重新克隆仓库

如果你在调整 Git 配置之前已经克隆了仓库，则需要再次克隆它以确保正确保留行尾：

1. **删除现有的本地仓库。** 确保你已备份任何更改或进行中的工作。
2. **再次克隆仓库。** 使用标准的 Git clone 命令将仓库克隆到你的本地计算机。

#### 第 3 步：构建并运行 Docker 容器

导航到克隆的仓库中包含 Dockerfile 和 `docker-compose.yml` 的适当目录。然后，继续执行 Docker 命令：

1. **构建 Docker 容器：** 运行 `docker-compose build` 以根据 `docker-compose.yml` 中指定的配置构建 Docker 容器。

2. **启动 Docker 容器：** 构建过程完成后，使用 `docker-compose up` 启动容器。

#### 附加说明

- 此解决方案专门解决 Windows 上由于自动转换行尾而遇到的问题。如果你使用其他操作系统，此解决方案可能不适用。
- 请记住检查项目的 `.gitattributes` 文件（如果存在），因为它也会影响 Git 处理文件中行尾的方式。

按照以下步骤，你应该能够解决由于行尾转换导致 Docker 无法识别 Windows 上的 `start.sh` 脚本的问题。

### Docker 镜像中的 Pip 缓存重置

有时，你想要重置 pip 缓存以确保安装了最新版本的依赖项。

例如，Label Studio ML Backend 库在 requirements.txt 中用作 `label-studio-ml @ git+https://github.com/HumanSignal/label-studio-ml-backend.git`。假设它已更新，并且你想在带有 ML 模型的 docker 镜像中使用最新版本。

你可以使用以下命令从头构建 docker 镜像：

```bash
docker compose build --no-cache
```

### `Bad Gateway` 和 `Service Unavailable` 错误

如果你发送多个并发请求，你可能会看到这些错误。

请注意，提供的 ML 后端示例是以开发模式提供的，不支持生产级别的推理服务。

### ML 后端无法进行简单的自动标注或无法看到预测

你必须确保 ML 后端可以访问你的 Label Studio 数据。如果不能，你可能会遇到以下问题：

* 服务器日志中的 `no such file or directory`（没有这样的文件或目录）错误。
* 在 Label Studio 中加载任务时无法看到预测。
* 你的 ML 后端似乎已正确连接，但似乎无法在任务内完成任何自动标注。

为了解决这个问题，请确保你已设置 `LABEL_STUDIO_URL` 和 `LABEL_STUDIO_API_KEY` 环境变量。有关更多信息，请参阅 [允许 ML 后端访问 Label Studio 数据](ml#Allow-the-ML-backend-to-access-Label-Studio-data)。
