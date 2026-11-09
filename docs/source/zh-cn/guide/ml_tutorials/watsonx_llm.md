---
title: Integrate WatsonX with Label Studio
type: guide
tier: all
order: 15
hide_menu: true
hide_frontmatter_title: true
meta_title: Integrate WatsonX with Label Studio
categories:
    - Generative AI
    - Large Language Model
    - WatsonX
image: "/guide/ml_tutorials/watsonx.png"
---

# 将 WatsonX 集成到 Label Studio

WatsonX 提供了一套机器学习工具，包括访问多种大语言模型（LLM）、提示词精调界面，以及通过 WatsonX.data 访问的数据存储。将 WatsonX 与 Label Studio 集成后，你可以使用这些模型，并自动将标注数据同步更新到你的 WatsonX.data 表中。

要运行此集成，你需要拉取这个仓库并部署在本地或云端。然后，你可以在项目设置的 `models` 部分将该模型连接到你的 Label Studio 项目。若要使用 WatsonX.data 集成，请在设置的 `webhooks` 部分配置一个 Webhook，链接结构如下：`<你部署容器的地址>/data/upload`，并将触发条件设为 `ANNOTATION_CREATED` 和 `ANNOTATION_UPDATED`。关于 Webhook 的更多信息，请参阅[我们的文档](https://labelstud.io/guide/webhooks)。

有关如何设置环境变量以使系统正常运行的详细配置说明，请参阅页面底部的配置说明。

视频演示请见 [Integrating Label Studio with IBM WatsonX](https://www.youtube.com/watch?v=9iP2yO4Geqc)。

## 准备工作

开始之前，你必须先安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`watsonx_llm` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/watsonx_llm)。

## 设置 label_config

对于本项目，我们建议你从下面定义的标注配置开始，但你始终可以根据需要编辑或扩展它！关键在于，必须有一个 `<TextArea>` 标签用于让模型插入其回复内容。

```xml
    <View>
        <Style>
            .lsf-main-content.lsf-requesting .prompt::before { content: ' loading...'; color: #808080; }
    
            .text-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
            font-size: 16px;
            }
        </Style>
        <Header value="Context:"/>
        <View className="text-container">
            <Text name="context" value="$text"/>
        </View>
        <Header value="Prompt:"/>
        <View className="prompt">
            <TextArea name="prompt"
                      toName="context"
                      rows="4"
                      editable="true"
                      maxSubmissions="1"
                      showSubmitButton="false"
                      placeholder="Type your prompt here then Shift+Enter..."
            />
        </View>
        <Header value="Response:"/>
        <TextArea name="response"
                  toName="context"
                  rows="4"
                  editable="true"
                  maxSubmissions="1"
                  showSubmitButton="false"
                  smart="false"
                  placeholder="Generated response will appear here..."
        />
        
        <Header value="Overall response quality:"/>
        <Rating name="rating" toName="context"/>
    </View>
```

## 设置 WatsonX.Data

要使用你的 WatsonX.data 集成，请按照以下步骤操作。
1. 首先，获取你将要使用的引擎的主机（host）和端口（port）信息。为此，请进入 WatsonX.data 页面左侧边栏的 Infrastructure Manager（基础设施管理器），选择 Infrastructure Manager。点击右上角的符号切换为列表视图。然后点击你要使用的引擎名称，会弹出一个窗口，你可以在其中的 "host" 下看到主机和端口信息。端口是 URL 末尾 `:` 之后的部分。
2. 接下来，确保你的 catalog（目录）已设置好。要创建新的 catalog，请按照[这些说明](https://dataplatform.cloud.ibm.com/docs/content/wsj/catalog/create-catalog.html?context=wx&locale=en)操作。
3. catalog 设置完成后，确保正确的 schema（模式）也已创建。进入你的 Data Manager，选择 `create` 来创建一个新的 schema。
4. 掌握以上所有信息后，你就可以更新本页底部的环境变量列表，并开始使用你的 WatsonX.data 集成！

## 使用 Docker 运行（推荐）

1. 使用预构建镜像在 `http://localhost:9090` 启动机器学习后端：

```bash
docker-compose up
```

2. 验证后端是否运行

```bash
$ curl http://localhost:9090/
{"status":"UP"}
```

3. 在 Label Studio 中创建一个项目。然后从项目设置的 **Model（模型）** 页面[连接模型](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。默认 URL 为 `http://localhost:9090`。

## 从源码构建（高级）

要从源码构建 ML 后端，你需要克隆仓库并构建 Docker 镜像：

```bash
docker-compose build
```

## 不使用 Docker 运行（高级）

要在不使用 Docker 的情况下运行 ML 后端，你需要克隆仓库并使用 pip 安装所有依赖：

```bash
python -m venv ml-backend
source ml-backend/bin/activate
pip install -r requirements.txt
```

然后你可以启动 ML 后端：

```bash
label-studio-ml start ./dir_with_your_model
```

## 配置

参数可以在运行容器之前，在 `docker-compose.yml` 中进行设置。

以下是可用的通用参数：
- `BASIC_AUTH_USER` - 指定模型服务的基本认证用户名。
- `BASIC_AUTH_PASS` - 指定模型服务的基本认证密码。
- `LOG_LEVEL` - 设置模型服务的日志级别。
- `WORKERS` - 指定模型服务的工作进程数。
- `THREADS` - 指定模型服务的线程数。

以下参数允许你将 WatsonX 模型连接到 Label Studio：

- `LABEL_STUDIO_URL` - 指定你的 Label Studio 实例的 URL。如果你在另一个 Docker 容器中运行 Label Studio，可能需要设为 `http://host.docker.internal:8080`。
- `LABEL_STUDIO_API_KEY` - 指定用于认证你的 Label Studio 实例的 API 密钥。你可以登录 Label Studio 后，[进入 **Account & Settings（账户与设置）** 页面](https://labelstud.io/guide/user_account#Access-token)找到它。
- `WATSONX_API_KEY` - 指定用于认证 WatsonX 的 API 密钥。你可以按照[此处](https://www.ibm.com/docs/en/watsonx/watsonxdata/1.0.x?topic=started-generating-api-keys)的说明生成。
- `WATSONX_PROJECT_ID` - 指定你用来运行模型的 WatsonX 项目 ID。必须拥有 WML 能力。你可以在项目的 `General（常规）` 部分找到它，从 WatsonX 首页点击进入项目即可访问。
- `WATSONX_MODELTYPE` - 指定你想使用的 WatsonX 模型名称。完整列表可在 [IBM 文档](https://ibm.github.io/watsonx-ai-python-sdk/fm_model.html#TextModels:~:text=CODELLAMA_34B_INSTRUCT_HF)中找到。
- `DEFAULT_PROMPT` - 如果你想让模型自动对新的数据样本进行预测，你需要提供一个默认提示词，或指定默认提示词文件的位置。
- `USE_INTERNAL_PROMPT` - 如果使用默认提示词，设为 0；否则设为 1。

以下参数允许你使用 Webhook 连接，将数据从 Label Studio 传输到 WatsonX.data：

- `WATSONX_ENG_USERNAME` - 必须设为 `ibmlhapikey` 集成才能正常工作。

要获取下方的主机和端口信息，你可以按照[先决条件](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-con-presto-serv#conn-to-prestjava)中的步骤操作。

- `WATSONX_ENG_HOST` - 你的 WatsonX.data 引擎的主机信息。
- `WATSONX_ENG_PORT` - 你的 WatsonX.data 引擎的端口信息。
- `WATSONX_CATALOG` - 你要将数据插入其中的表所属的 catalog 名称。必须在 WatsonX.data 平台中预先创建。
- `WATSONX_SCHEMA` - 你要将数据插入其中的表所属的 schema 名称。必须在 WatsonX.data 平台中预先创建。
- `WATSONX_TABLE` - 你要将数据插入其中的表名称。无需预先创建。
