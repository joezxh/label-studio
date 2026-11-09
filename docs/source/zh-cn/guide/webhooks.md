---
title: Set up webhooks in Label Studio
short: Webhooks
type: guide
tier: all
order: 407
order_enterprise: 407
meta_title: Configure Webhooks in Label Studio
meta_description: Label Studio documentation for setting up and configuring webhooks to integrate Label Studio with your machine learning pipeline.
section: "Integrate & Extend"

---

Label Studio 中的 webhook 允许你设置集成，以订阅在 Label Studio 内部发生的某些事件。当事件被触发时，Label Studio 会向已配置的 webhook URL 发送一个 HTTP POST 请求。例如：
```json
{
    "action": "TASK_CREATED",
    "tasks": [
        {"id": 1, ...},
        ...
    ]
}
```

然后，你的应用程序或服务可以根据你的意愿对该事件信息作出响应。

## Label Studio webhook 的用途

Label Studio 中发生的某些事件是作为对 API 调用的响应而发生的。对于这些情况，API 响应足以知道操作已经发生。但其他事件发生在 Label Studio UI 内部，例如项目更改和任务标注活动。要立即了解这些更改何时发生，你可以使用 webhook 来通知你的应用程序或机器学习流水线采取特定操作。

你的 webhook 在应用程序或流水线中执行的操作可能因事件而异。例如，你可以使用发送到你的 webhook URL 的事件来执行以下操作：
- 在标注了一定数量的任务后开始训练机器学习模型。
- 在任务被标注后执行主动学习。
- 在项目完全设置好后提示标注员开始处理项目。
- 在数据集版本控制仓库中创建训练数据的新版本。

通过仅订阅与你的用例相关的事件来限制对你的服务器的请求数量。

## 可用的 Label Studio webhook

Label Studio 提供两种主要类型的事件与 webhook 集成：项目级任务事件和组织事件。

<table>
<thead>
  <tr>
    <th>事件操作</th>
    <th>详情</th>
    <th>用例</th>
  </tr>
  </thead>
  <tr>
    <td><a href="webhook_reference.html#Task-Created">任务已创建（Task Created）</a></td>
    <td>对于特定项目，在创建新任务时触发。每次导入操作一个事件。批量任务创建作为单个事件发送。</td>
    <td>用于在机器学习流水线中采取行动。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Task-Deleted">任务已删除（Task Deleted）</a></td>
    <td>对于特定项目，在删除任务时触发。每次删除操作一个事件。批量任务删除作为单个事件发送。</td>
    <td>用于更新训练数据集版本。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Annotation-Created">标注已创建（Annotation Created）</a></td>
    <td>对于特定项目，在为任何任务创建新标注时触发。每个标注一个事件。</td>
    <td>用于在主动学习场景中开始训练。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Annotation-Updated">标注已更新（Annotation Updated）</a></td>
    <td>对于特定项目，在现有标注被更新、覆盖或任务被跳过时触发。</td>
    <td>用于提示模型重新训练。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Annotation-Deleted">标注已删除（Annotation Deleted）</a></td>
    <td>对于特定项目，在标注被删除时触发。批量标注删除作为单个事件发送。</td>
    <td>用于创建训练数据集的新版本。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Project-Created">项目已创建（Project Created）</a></td>
    <td>对于组织，在创建项目时触发。你必须 <a href="webhooks.html#Enable-organization-level-webhooks">启用组织级别的 webhook</a> 才能发送此事件。</td>
    <td>用于创建数据管理的新流水线。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Project-Updated">项目已更新（Project Updated）</a></td>
    <td>在更新、创建或保存项目设置（例如标注配置）时触发。</td>
    <td>用于更新现有的数据管理流水线。</td>
  </tr>
  <tr>
    <td><a href="webhook_reference.html#Project-Deleted">项目已删除（Project Deleted）</a></td>
    <td>对于组织，在删除项目时触发。你必须 <a href="webhooks.html#Enable-organization-level-webhooks">启用组织级别的 webhook</a> 才能发送此事件。</td>
    <td>用于移除数据管理流水线。</td>
  </tr>
</table>

### 启用组织级别的 webhook

要使用为每个项目触发事件的组织级别 webhook，你必须 [设置一个环境变量](https://labelstud.io/guide/start#Set-environment-variables)。
```shell
LABEL_STUDIO_ALLOW_ORGANIZATION_WEBHOOKS=true
```

## 如何与 webhook 集成

要与 Label Studio 中的 webhook 集成，你必须执行以下操作：
1. 作为你的应用程序或机器学习模型流水线的一部分，创建一个 webhook 端点或 URL。
2. 确保 webhook 端点或 URL 对你的 Label Studio 实例可访问，并且可以接受 HTTP POST 请求。
3. [将 webhook 添加到 Label Studio](webhooks.html#Add-a-new-webhook-in-Label-Studio)。

设置你的 webhook 端点以读取来自 Label Studio 的事件有效负载，并根据该事件采取行动。

## 在 Label Studio 中添加新的 webhook

在 Label Studio 中设置 webhook URL，并将其与一个或多个事件触发器关联。你可以在 Label Studio UI 中或使用 API 设置 webhook URL。你可以根据需要配置任意数量的 webhook 连接，但数量过多可能会使你的实例不堪重负。

### 在 Label Studio UI 中添加 webhook

将一个 webhook URL 添加到 Label Studio。该 webhook URL 必须设置为接受 HTTP POST 请求。

1. 在 Label Studio UI 中，打开你想要与 webhook URL 关联的项目。
2. 点击 **Settings（设置）** 并点击 **Webhooks**。
3. 点击 **Add Webhook（添加 Webhook）**。
4. 在 **Payload URL** 字段中，提供用于发送事件有效负载的 URL。例如 `https://www.example.com/webhook`。
5. （可选）切换 **Is Active（是否激活）** 选项以在 webhook 准备就绪之前将其停用。否则，webhook 会在你保存后立即激活，并且事件将被发送到该 URL。
6. （可选）点击 + 号以添加 webhook URL 所需的任何请求头。指定请求头名称和值。你可以使用请求头来对发送到你的 webhook URL 的请求进行身份验证。例如，`Authorization` 和 `Basic bGFiZWxzdHVkaW86ZXhhbXBsZQ==`
7. （可选）选择是否随事件发送有效负载。默认情况下会发送有效负载。如果你不发送有效负载，则仅发送 `action` 键。例如，选择为 `Annotation created（标注已创建）` 事件发送有效负载，以便根据有效负载中发送的项目 ID 更新正确的流水线。
8. （可选）选择是发送 Label Studio 支持的 webhook 的所有操作的事件，还是仅发送特定事件的事件。默认情况下，会为所有操作发送事件。例如，选择 `Annotation created（标注已创建）` 事件。
9. 保存 webhook。

### 使用 Label Studio API 添加 webhook

向 [创建 webhook](/api#tag/Webhooks/) 端点发出 POST 请求，以使用 API 添加 webhook。如果你想要使用自定义事件扩展 webhook，请参阅 [创建自定义 webhook 事件](webhook_create.html)。

## 排查 webhook 连接问题

webhook 连接会在 1 秒后超时。你可以通过设置环境变量 `WEBHOOK_TIMEOUT` 来调整超时时间。

如果 webhook URL 无法被 Label Studio 访问，你可以在日志的回溯中看到这一点。

Label Studio 不会重试失败的 webhook 连接。你可以在 DEBUG 模式的日志中看到成功的 webhook 投递。

<div class="enterprise-only">

!!! note
    在 Label Studio Enterprise Cloud（SaaS）上，webhook 响应会在 10 秒后超时。如果 webhook 连续失败 50 次，系统会自动将其禁用，并且必须在 webhook 设置中重新激活。有关更多详细信息，请参阅 [Webhook 限制](saas.html#Webhook-limits)。

</div>
