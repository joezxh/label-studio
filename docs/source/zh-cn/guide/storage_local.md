---
title: Set up local project storage
short: Local
type: guide
tier: all
order: 157
order_enterprise: 157
meta_title: Set up local storage
meta_description: "How to set up source and target storage for local files."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

<div class="enterprise-only">

!!! note
    本地存储仅适用于本地部署（on-premises）。

    Label Studio Cloud（`app.humansignal.com`）不支持本地存储。

</div>

如果你有本地文件想要从特定目录添加到 Label Studio，你可以将运行 Label Studio 的机器上的某个特定本地目录设置为源存储或目标存储。Label Studio 会递归遍历该目录以读取任务。

请记住，从本地文件系统提供数据可能是一个 **安全风险**。

## 先决条件

添加以下环境变量：

- `LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true`
- `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 并将其设置为你机器上的一个目录。这必须是你的本地文件所在的文件夹或各个文件夹的父目录。请参阅下面的 [目录示例](#Directory-examples)。

!!! note
    在 Windows 上设置文件根目录时，请使用双反斜杠，例如

    `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=C:\\data\\media`

有关使用环境变量的更多信息，请参阅 [设置环境变量](https://labelstud.io/guide/start#Set-environment-variables)。

如果你使用的是 Docker，请参阅 [在 Docker 上运行 Label Studio 并使用本地存储](https://labelstud.io/guide/start#Run-Label-Studio-on-Docker-and-use-Local-Storage)。

### 目录示例

#### Mac/Unix 示例

你有以下目录结构：

```
/home/user/
└── ls-demo
    ├── my-data
    │   ├── image1.png
    │   ├── image2.png
    │   ├── text1.txt
    │   └── text2.txt
    └── audio
        ├── audio1.mp3
        └── audio2.mp3
```

如果你知道自己最终想要同时指向 `my-data` 和 `audio` 文件夹中的文件，你可以如下设置环境变量：

```bash
export LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true
export LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=/home/user
```

然后，当你在 UI 中按照 [如下所述](#Create-a-source-storage-connection) 配置本地存储时，你的绝对本地路径将是（以便可以选择引用两个文件夹中的文件）：

**绝对本地路径：** home/user<span style="color:red">/ls-demo</span>

或者只从一个文件夹中提取：

**绝对本地路径：** home/user<span style="color:red">/ls-demo/my-data</span>

#### Windows 示例

你有以下目录结构：

```
C:\Users\YourName\Documents\
└── ls-demo
    ├── my-data
    │   ├── image1.png
    │   ├── image2.png
    │   ├── text1.txt
    │   └── text2.txt
    └── audio
        ├── audio1.mp3
        └── audio2.mp3
```

如果你知道自己最终想要同时指向 `my-data` 和 `audio` 文件夹中的文件，你可以如下设置环境变量：

```bash
set LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true
set LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=C:\\Users\\YourName\\Documents
```

然后，当你在 UI 中按照 [如下所述](#Create-a-source-storage-connection) 配置本地存储时，你的绝对本地路径将是（以便可以选择引用两个文件夹中的文件）：

**绝对本地路径：** C:\Users\YourName\Documents<span style="color:red">\ls-demo</span>

或者只从一个文件夹中提取：

**绝对本地路径：** C:\Users\YourName\Documents<span style="color:red">\ls-demo\my-data</span>

## 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储（Settings > Cloud Storage > Add Source Storage）**。

选择 **Local Files（本地文件）** 并点击 **下一步**。

#### 配置连接

填写以下字段，然后点击 **测试连接**：

* **Storage Title（存储标题）**
  输入一个名称以标识该存储连接。

* **Absolute local path（绝对本地路径）**

    此字段已预填为你之前在 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 值中指定的路径。

    在这里，你可以附加你想要使用的子目录。

    例如，给定一个上面列出的 [目录结构](#Directory-examples)，如果你只访问 `my-data` 文件夹中的文件，你可以将 `ls-demo/my-data` 附加到你的绝对本地路径：

    **Mac：**

    * `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=home/user`

    * **绝对本地路径：** home/user<span style="color:red">/ls-demo/my-data</span>

    **Windows：**

    * `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=C:\\Users\\YourName\\Documents`

    * **绝对本地路径：** C:\Users\YourName\Documents<span style="color:red">\ls-demo\my-data</span>

#### 导入设置与预览

填写以下字段，然后点击 **加载预览（Load preview）** 以确保你正在同步正确的数据：

<div class="noheader rowheader">

| | |
| --- | --- |
| Import Method（导入方法） | 选择是希望为本地目录中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。<br /><br />例如，如果你的标注任务只是标注单张图片，并且你指向的是装满这些图片的目录，你可以将此设置为 **Files（文件）**。<br /><br />但如果你要标注多个数据片段，例如单个任务中的两张图片，或者同一任务中的一张图片和一个文本文件，你需要将此设置为 **Tasks（任务）**。请参阅下面的 [带有本地存储文件引用的任务](#Tasks-with-local-storage-file-references)。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤文件。使用 `.*` 收集所有文件。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的本地目录中的子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/local/sync)。

## 带有本地存储文件引用的任务

如果你的标注配置包含多个对象标签（例如，每个任务将包含一个音频文件和一个文本文件，或两音频文件，或一个图像文件和一个文本文件等），你将需要在 JSON/JSONL/Parquet 文件中定义任务。

!!! error Enterprise
    Parquet 仅在 Label Studio Enterprise 中受支持。

在这种情况下，你需要执行以下操作：

- 使用上述步骤设置本地存储，指向所有数据文件所在的目录
- **Import Method（导入方法）** —— 将此设置为 **Tasks（任务）**
- **File Name Filter（文件名过滤器）** —— 将此字段留空
- 当你到达 **审查与确认（Review & Confirm）** 步骤时，点击 **保存（Save）** 而不是 **保存并同步（Save & Sync）**（这样做是为了避免自动为本地存储目录中的每个文件创建一个单独的任务）

然后，当你在任务文件中指定数据文件时，你需要使用以下格式：

`/data/local-files/?d=path/file`

### 示例 1：单个文件夹中的数据文件

给定以下目录结构，假设你只想从 `my-data` 中提取文件。

```
/home/user/ls-demo
├── my-data
│   ├── image1.png
│   ├── image2.png
│   ├── text1.txt
│   └── text2.txt
└── audio
    ├── audio1.mp4
    └── audio2.mp4
```

所以你如下设置本地文件存储：

`LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=home/user/ls-demo`

**绝对本地路径：** home/user/ls-demo<span style="color:red">/my-data</span>

当你在任务中引用文件时，你需要重复你附加到绝对本地路径的内容（`my-data`）+ 文件名。

```json
[{
 "data": {
    "image": "/data/local-files/?d=my-data/image1.png",
    "text": "/data/local-files/?d=my-data/text1.txt"
  }
},
{
 "data": {
    "image": "/data/local-files/?d=my-data/image2.png",
    "text": "/data/local-files/?d=my-data/text2.txt"
  }
}]
```

### 示例 2：跨文件夹的数据文件

给定以下目录结构，假设你想从 `my-data` 和 `audio` 中提取文件。

```
/home/user/ls-demo
├── my-data
│   ├── image1.png
│   ├── image2.png
│   ├── text1.txt
│   └── text2.txt
└── audio
    ├── audio1.mp3
    └── audio2.mp3
```

所以你如下设置本地文件存储：

`LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=home/user`

**绝对本地路径：** home/user<span style="color:red">/ls-demo</span>

当你在任务中引用文件时，你需要重复你附加到绝对本地路径的内容（`ls-demo`）+ 子文件夹 + 文件名。

```json
[{
 "data": {
    "image": "/data/local-files/?d=ls-demo/my-data/image1.png",
    "text": "/data/local-files/?d=ls-demo/my-data/text1.txt",
    "audio": "/data/local-files/?d=ls-demo/audio/audio1.mp3"
  }
},
{
 "data": {
    "image": "/data/local-files/?d=ls-demo/my-data/image2.png",
    "text": "/data/local-files/?d=ls-demo/my-data/text2.txt",
    "audio": "/data/local-files/?d=ls-demo/audio/audio2.mp3"
  }
}]
```

### 将任务文件导入 Label Studio

有几种方法可以将你的 JSON/JSONL/Parquet 文件导入 Label Studio：

- 在 UI 中直接上传
- [使用 API](https://api.labelstud.io/api-reference/api-reference/projects/import-tasks)
- 将它们添加到你的本地文件存储中，并使用文件名过滤器仅同步 JSON/JSONL/Parquet 文件
- 设置第二个源存储连接并将任务文件放在那里

尽管 UI 此后已更改，但此视频演示了如何从零开始设置本地存储，并以链接到本地存储文件的复杂任务格式导入 JSON 任务。

<iframe class="video-border" width="100%" height="400vh" src="https://www.youtube.com/embed/lo6ncQajbdU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储（Settings > Cloud Storage > Add Target Storage）**。

选择 **Local Files（本地文件）** 并填写以下字段：

* **Storage Title（存储标题）**
  输入一个名称以标识该存储连接。

* **Absolute local path（绝对本地路径）**

    此字段已预填为你之前在 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 值中指定的路径。

    在这里，你可以修改此字段以附加到你想要设置目标存储的文件夹的剩余路径。

* **Can delete objects from storage（可以从存储中删除对象）**

    如果你希望在 Label Studio 中删除的标注也能够在容器中删除，请启用此选项。

添加存储后，点击 **保存（Save）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/local/sync)。

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)

## 使用 Docker 设置本地存储

如果你在 Docker 中使用 Label Studio，你需要在启动 Docker 容器时将你想要访问的本地目录作为卷挂载。请参阅 [在 Docker 上运行 Label Studio 并使用本地存储](https://labelstud.io/guide/start#Run-Label-Studio-on-Docker-and-use-Local-Storage)。

<div class="opensource-only">

!!! note "社区版的 Docker 自动检测"
    在开源社区版（Community Edition）中，如果未设置 `LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT` 和 `LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED`，Label Studio 会自动在当前工作目录中查找名为 `mydata` 或 `label-studio-data` 的文件夹。
    当你使用官方 Docker 镜像时，应用程序从 `/label-studio` 运行，因此你可以将主机文件夹挂载到容器内的 `/label-studio/mydata` 或 `/label-studio/label-studio-data`，以便无需额外配置即可启用本地文件服务。

</div>
