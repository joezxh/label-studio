---
title: Set up Redis database project storage
short: Redis
type: guide
tier: all
order: 156
order_enterprise: 156
meta_title: Set up Redis storage
meta_description: "How to set up source and target storage for a Redis database."
section: "Import & Export"
parent: "storage"
parent_enterprise: "storage"
---

你也可以将你的任务和标注存储在 [Redis 数据库](https://redis.io/) 中。你必须将任务和标注存储在不同的数据库中。如果你发现依赖基于文件的云存储连接对于你的数据集来说速度很慢，你可能想要使用 Redis 数据库。

目前，此配置仅在以默认模式、使用默认 IP 地址托管 Redis 数据库时才受支持。

Label Studio 不会为你管理 Redis 数据库。有关托管和管理你自己的 Redis 数据库的详细信息，请参阅 [Redis 快速入门](https://redis.io/topics/quickstart)。由于 Redis 是一个内存数据库，保存在 Redis 中的数据不会持久化。为确保不丢失数据，请设置 [Redis 持久化](https://redis.io/topics/persistence) 或使用其他方法来持久化数据，例如在云中使用 [Microsoft Azure](https://azure.microsoft.com/en-us/services/cache/) 或 [Amazon AWS](https://aws.amazon.com/redis/) 的 Redis。

## 源 Redis 存储的任务格式

Label Studio 仅支持 Redis 数据库的字符串值，这些值应表示 JSON 格式的 Label Studio 任务。

例如：

```
'ls-task-1': '{"image": "http://example.com/1.jpg"}'
'ls-task-2': '{"image": "http://example.com/2.jpg"}'
...
```

```
> redis-cli -n 1
127.0.0.1:6379[1]> SET ls-task-1 '{"image": "http://example.com/1.jpg"}'
OK
127.0.0.1:6379[1]> GET ls-task-1
"{\"image\": \"http://example.com/1.jpg\"}"
127.0.0.1:6379[1]> TYPE ls-task-1
string
```

## 创建源存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加源存储（Settings > Cloud Storage > Add Source Storage）**。

选择 **Redis Storage（Redis 存储）** 并点击 **下一步**。

#### 配置连接

填写以下字段，然后点击 **测试连接**：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <th style="width: 25%;">字段</th>
    <th>描述</th>
  </tr>

  <tr>
    <td>Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Host（主机）</td>
    <td>
      输入托管该数据库的服务器 IP 地址，或 <code>localhost</code>。
    </td>
  </tr>

  <tr>
    <td>Port（端口）</td>
    <td>
      输入你可用于访问该数据库的端口。默认值为 <code>6379</code>。
    </td>
  </tr>

  <tr>
    <td>Database Number (db)（数据库编号（db））</td>
    <td>
      输入你想要使用的数据库编号。默认值为 <code>1</code>。
    </td>
  </tr>

  <tr>
    <td>Password（密码）</td>
    <td>
      可选地，如果你的 Redis 实例需要认证，请输入服务器密码。
    </td>
  </tr>

</table>
</div>

#### 导入设置与预览

填写以下字段，然后点击 **加载预览（Load preview）** 以确保你正在同步正确的数据：

<div class="noheader rowheader">

| | |
| --- | --- |
| Path to files（文件路径） | 可选地，指定数据库的路径。用作键前缀，将扫描此路径下的值以查找任务。 |
| Import Method（导入方法） | 选择是希望为数据库中的每个文件创建一个任务，还是希望使用 JSON/JSONL/Parquet 文件来定义每个任务的数据。 |
| File Name Filter（文件名过滤器） | 指定一个正则表达式来过滤数据库对象。使用 `.*` 收集所有对象。 |
| Scan all sub-folders（扫描所有子文件夹） | 启用此选项以在你的数据库中的子文件夹上执行递归扫描。 |

</div>

#### 审查与确认

如果一切正确，点击 **保存并同步（Save & Sync）** 立即同步，或点击 **保存（Save）** 保存你的设置并稍后同步。

!!! info 提示
    你也可以使用 API 来 [同步导入存储](https://api.labelstud.io/api-reference/api-reference/import-storage/redis/sync)。

## 创建目标存储连接

从 Label Studio 中，打开你的项目并选择 **设置 > 云存储 > 添加目标存储（Settings > Cloud Storage > Add Target Storage）**。

选择 **Redis Storage（Redis 存储）** 并点击 **下一步**。

填写以下字段：

<div class="noheader rowheader">

<table style="width: 100%; border-collapse: collapse;">

  <tr>
    <td style="width: 25%;">Storage Title（存储标题）</td>
    <td>输入一个名称以标识该存储连接。</td>
  </tr>

  <tr>
    <td>Path（路径）</td>
    <td>
      可选地，指定数据库的路径。用作导出标注的键前缀。
    </td>
  </tr>

  <tr>
    <td>Host（主机）</td>
    <td>
      输入托管该数据库的服务器 IP 地址，或 <code>localhost</code>。
    </td>
  </tr>

  <tr>
    <td>Port（端口）</td>
    <td>
      输入你可用于访问该数据库的端口。默认值为 <code>6379</code>。
    </td>
  </tr>

  <tr>
    <td>Database Number (db)（数据库编号（db））</td>
    <td>
      输入你想要使用的数据库编号。默认值为 <code>2</code>。你必须使用与你的源存储不同的数据库编号。
    </td>
  </tr>

  <tr>
    <td>Password（密码）</td>
    <td>
      可选地，如果你的 Redis 实例需要认证，请输入服务器密码。
    </td>
  </tr>

</table>
</div>

添加存储后，点击 **同步（Sync）**。

!!! info 提示
    你也可以使用 API 来 [同步导出存储](https://api.labelstud.io/api-reference/api-reference/export-storage/redis/sync)。

## 使用 Label Studio API 添加存储

你也可以使用 API 以编程方式创建连接。[查看我们的 API 文档。](https://api.labelstud.io/api-reference/introduction/getting-started)
