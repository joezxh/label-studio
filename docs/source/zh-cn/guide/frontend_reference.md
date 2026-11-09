---
title: 前端参考
short: 前端
type: guide
tier: all
order: 416 
order_enterprise: 416
meta_title: 前端库参考
meta_description: 将 Label Studio 前端实现到你自己的机器学习或数据科学应用工作流中的参考文档。
section: "集成与扩展"
---

Label Studio frontend (LSF) 包含多个 UI 选项和回调，你可以在使用自定义标注后端实现前端或自定义 Label Studio 界面时使用它们。

!!! attention
    从 [Label Studio 1.11.0](https://github.com/HumanSignal/label-studio/releases/tag/1.11.0) 开始，Label Studio 前端已弃用为单独的库，不再作为独立发行版受支持。有关在 Label Studio 中使用前端库的信息，请参阅 [README](https://github.com/HumanSignal/label-studio/blob/develop/web/libs/editor/README.md)。 

## LSF 在 1.0.0 版本中的更新

!!! warning
    LSF 版本 1.0.0 与早期版本的 Label Studio 不兼容。

如果你将 LSF 与自定义后端一起使用，你必须更改所用的 API 回调，如下所示：

| 0.9.1 及更早版本中的回调 | 1.0.0 中重命名的回调 |
| ----------------------------- | ------------------------- |
| onSubmitCompletion            | onSubmitAnnotation        |
| onUpdateCompletion            | onUpdateAnnotation        |
| onDeleteCompletion            | onDeleteAnnotation        |

如果你依赖 Label Studio 已完成任务的特定格式，[Label Studio 的标注格式](export.html#Raw-JSON-format-of-completed-tasks) 也已更新。

## 实现 Label Studio Frontend

```javascript
var labelStudio = new LabelStudio("editor", options);
```

以下是初始化 Label Studio 实例版本 1.0.0 时识别的选项。

## 选项

### config

默认值：`null`

数据类型：`string`

标注界面的基于 XML 的配置。此配置依赖于任务的 `data` 字段。
请参阅 [可自定义标签](/tags) 了解更多信息。

### interfaces

默认值：`null`

数据类型：`array`

要显示的 UI 元素集合。可用的界面元素：

- `panel` - 启用当前任务的导航面板，包含按钮：撤销、重做和重置。
- `update` - 显示提交后更新当前任务的按钮。
- `submit` - 显示提交或更新当前标注的按钮。
- `skip` - 显示跳过当前任务的按钮。
- `controls` - 启用包含控件（`submit`、`update`、`skip`）的面板。
- `infobar` - 显示信息的按钮。
- `topbar` - 列出 Label Studio UI 中顶级项的标注界面。
- `instruction` - [说明](#description) 的按钮。
- `side-column` - 在 Label Studio UI 的左侧或右侧显示一列。
- `annotations:history` - 标注历史的显示按钮。
- `annotations:tabs` - 标注选项卡的显示按钮。
- `annotations:menu` - 标注菜单的显示按钮。
- `annotations:current` - 当前标注的显示按钮。
- `annotations:add-new` - 添加新标注的显示按钮。
- `annotations:delete` - 删除当前标注的显示按钮。
- `annotations:view-all` - 查看所有标注的显示按钮。
- `predictions:tabs` - 显示预测选项卡。
- `predictions:menu` - 显示预测菜单。
- `auto-annotation` - 显示自动标注。
- `edit-history` - 显示编辑历史。

### messages

默认值：`null`

数据类型：`object`

用于不同操作的消息

```javascript
{
  DONE: "Done!",
  NO_COMP_LEFT: "No more annotations",
  NO_NEXT_TASK: "No more data available for labeling",
  NO_ACCESS: "You don't have access to this task"
}
```

- `DONE` - 任务提交到服务器后显示
- `NO_COMP_LEFT` - 如果没有更多标注时显示
- `NO_NEXT_TASK` - 没有下一个任务可加载
- `NO_ACCESS` - 无法访问提供的任务

### description

默认值：`No description`

数据类型：`string`

当前任务的描述。

### task

任务数据

默认值：`null`

数据类型：`object`

```json
{
  id: 1,
  load: false
  },
  data: {
    text: "Labeling text..."
  },
  annotations: [],
  predictions: [],
}
```

#### id

数据类型：`integer`

默认值：`null`

#### data

#### annotations

数据类型：`array`

标注数组。请参阅 [标注文档](export.html#Raw-JSON-format-of-completed-tasks) 了解更多信息。

#### predictions

数据类型：`array`

预测数组。结构与完成项或标注类似。请参阅 [标注文档](export.html#Raw-JSON-format-of-completed-tasks) 和[导入预测标签的指南](predictions.html) 了解更多信息。

### user

用户数据

数据类型：`object`

```json
{
  "pk": 1,
  "firstName": "Stanley",
  "lastName": "Kubrick"
}
```

#### pk

数据类型：`number`

#### firstName

数据类型：`string`

#### lastName

数据类型：`string`

## 事件系统

LSF 有一个内置的事件系统，允许你监听事件并触发自定义操作。在 Label Studio 实例初始化后的任何时间，你都可以订阅或取消订阅事件。

### 使用事件

#### 订阅事件

```javascript
const callback = () => {
  console.log("Event triggered");
};
labelStudio.on("event", callback);
```

#### 取消订阅事件

```javascript
const callback = () => {
  console.log("Event triggered");
};
labelStudio.off("event", callback);
```

!!! note
    为了能够取消订阅事件，你必须将相同的回调函数引用传递给 `off` 方法。

## 可用事件

#### 顶级事件

此事件组包含顶级事件。这些事件与 LSF 的任何内部实体无关。

### `labelStudioLoad`

Label Studio 实例已加载。 

!!! warning
    此事件在插件中不起作用。

**事件处理程序参数**

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |

### `storageInitialized`

内部存储已初始化。

!!! warning
    此事件在插件中不起作用。

**事件处理程序参数**

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |

#### 任务事件

此事件组包含与任务相关的事件。

### `skipTask`

用户点击了"跳过"按钮。

**事件处理程序参数**

| 参数          | 类型     | 描述                                 |
| ------------- | -------- | ------------------------------------------- |
| `labelStudio` | `Object` | Label Studio 实例                    |
| `payload`     | `Object` | 在跳过操作期间发送的附加数据 |

### `unskipTask`

用户点击了"取消跳过"按钮。

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |

### `nextTask`

用户点击了"下一项"（向右的 chevron）按钮。

| 参数          | 类型      | 描述                                    |
| -------------- | --------- | ---------------------------------------------- |
| `labelStudio`  | `Object`  | Label Studio 实例                       |
| `taskId`       | `Number?` | 历史记录中下一个任务的 ID                 |
| `annotationId` | `Number?` | 要在任务中选择标注的 ID |

### `prevTask`

用户点击了"上一项"（向左的 chevron）按钮。

| 参数          | 类型      | 描述                                    |
| -------------- | --------- | ---------------------------------------------- |
| `labelStudio`  | `Object`  | Label Studio 实例                       |
| `taskId`       | `Number?` | 历史记录中上一个任务的 ID             |
| `annotationId` | `Number?` | 要在任务中选择标注的 ID |

### `submitDraft`

草稿已发送到服务器。

| 参数          | 类型      | 描述                      |
| ------------- | --------- | -------------------------------- |
| `labelStudio` | `Object`  | Label Studio 实例         |
| `annotation`  | `Object`  | 当前标注               |
| `params`      | `Object?` | 随草稿发送的额外参数 |

#### 标注事件

此事件组包含与标注相关的事件。

### `beforeSaveAnnotation`

标注将作为 `submit` 或 `update` 操作的结果被保存。 
从此事件返回 `false` 将阻止保存标注。

| 参数              | 类型     | 描述                                                                                  |
|------------------|----------|----------------------------------------------------------------------------------------------|
| `labelStudio`    | `Object` | Label Studio 实例                                                                     |
| `annotation`     | `Object` | 当前标注                                                                           |
| `payload`        | `Object` | 附加信息                                                                       |
| `payload.event`  | `string` | 指示即将执行的事件（`submitAnnotation`、`updateAnnotation` 等） |

### `submitAnnotation`

标注已提交。

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |
| `annotation`  | `Object` | 当前标注       |

### `updateAnnotation`

标注已更新。

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |
| `annotation`  | `Object` | 当前标注       |

### `selectAnnotation`

标注已选择。

| 参数              | 类型      | 描述                                   |
|-----------------------|-----------|-----------------------------------------------|
| `annotation`          | `Object`  | 当前标注                            |
| `previousAnnotation`  | `Object`  | 上一个标注                           |
| `payload`             | `Object?` | 附加信息                        |
| `payload.fromViewAll` | `boolean` | 如果刚刚关闭了 ViewAll，则为 `true`  |

### `deleteAnnotation`

标注已删除。

| 参数          | 类型     | 描述              |
| ------------- | -------- | ------------------------ |
| `labelStudio` | `Object` | Label Studio 实例 |
| `annotation`  | `Object` | 当前标注       |

### `groundTruth`

标注被设置为真值（点击了星标按钮）。

| 参数         | 类型      | 描述                      |
| ---------------- | --------- | -------------------------------- |
| `store`          | `Object`  | Label Studio 实例         |
| `labelStudio`    | `Object`  | Label Studio 实例         |
| `params`         | `Object`  |                                  |
| `params.isDirty` | `Boolean` | 如果标注已更改，则为 `true` |
| `params.entity`  | `Object`  | 当前标注               |

### `selectHistory`

标注历史中的步骤被选择。

| 参数          | 类型     | 描述                 |
|---------------|----------|-----------------------------|
| `labelStudio` | `Object` | Label Studio 实例    |
| `annotation`  | `Object` | 当前标注          |
| `historyItem` | `Object` | 当前历史项        |

#### 区域事件

此事件组包含与区域相关的事件。区域是在分割任务（如图像分割、音频分割等）中使用的特殊实体。

### `entityCreate`

区域已创建。

| 参数    | 类型     | 描述          |
| -------- | -------- | -------------------- |
| `region` | `Object` | 新创建的区域 |

### `entityDelete`

区域已删除。

| 参数    | 类型     | 描述          |
| -------- | -------- | -------------------- |
| `region` | `Object` | 新创建的区域 |

{% collapse "回调（已弃用）" %}

回调可用于基于用户与界面的交互执行操作。例如，label-studio 服务器使用回调与 API 通信。在初始化实例时随其他选项一起传递它们。

### onSubmitAnnotation

数据类型：`function`

当按下 `submit` 按钮时调用。`ls` 是 label studio 实例，`annotation` 是当前标注的值。

#### 示例

```javascript
onSubmitAnnotation: function(ls, annotation) {
  console.log(annotation)
}
```

### onUpdateAnnotation

数据类型：`function`

当按下 `update` 按钮时调用。`ls` 是 label studio 实例，`annotation` 是当前标注的值。

#### 示例

```javascript
onUpdateAnnotation: function(ls, annotation) {
  console.log(result)
}
```

### onDeleteAnnotation

数据类型：`function`

当按下 `delete` 按钮时调用。`ls` 是 label studio 实例，`annotation` 是当前标注的值。

#### 示例

```javascript
onDeleteAnnotation: function(ls, annotation) {
  console.log(result)
}
```

### onEntityCreate

数据类型：`function`

当新的区域被标注时调用，例如，创建了一个新的 bbox。`region` 是创建的对象。

#### 示例

```javascript
onEntityCreate: function(region) {
  console.log(region)
}
```

### onEntityDelete

数据类型：`function`

当现有的区域被删除时调用。`region` 是对象本身。

#### 示例

```javascript
onEntityDelete: function(region) {
  console.log(region)
}
```

### onSkipTask

数据类型：`function`

当按下 `skip` 按钮时调用。`ls` 是 label studio 实例。

#### 示例

```javascript
onSkipTask: function(ls) {
  console.log(result)
}
```

### onLabelStudioLoad

数据类型：`function`

当 Label Studio 完全加载并准备好进行标注时调用。`ls` 是 label studio 实例

#### 示例

```javascript
onLabelStudioLoad: function(ls) {
  console.log(result)
}
```

{% endcollapse %}
