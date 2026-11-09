---
title: 自定义并构建你自己的插件
short: 自定义插件
type: plugins
category: Overview
cat: overview
order: 8
meta_title: 自定义并构建你自己的插件
tier: enterprise
---

你可以修改我们提供的插件示例，也可以构建你自己的自定义插件。

插件使用 JavaScript 编写，并且是项目级别的。它们仅限于特定的任务和标注工作流，例如不能用于创建新页面或以其他方式扩展 Label Studio 的核心功能。

!!! note
    插件在启用之前不可用。在申请访问权限之前，需要先了解[重要的安全注意事项](/guide/plugins#Security-notes-constraints-and-limitations)。  

## 执行

每当标注被显示时，插件都会被执行。例如，当你打开一个任务、在任务之间切换、创建新标注、在标注之间切换、创建新标注，以及查看标注的旧版本时。

这意味着你可以为每个标注添加特定的行为。然而，这也意味着如果你在构建插件逻辑时没有做好规划，最终可能会出现重复的操作。

为了避免多次事件订阅（以及随之而来的多次处理器触发），最好使用 `LSI.on()`，因为使用此方法添加的处理器会在当前标注关闭后自动取消订阅。有关 LSI 的更多信息，请参阅[下文](#Label-Studio-Interface-LSI)。

!!! note
    由于插件可能会针对同一个标注多次执行，你需要采取措施来避免诸如无限循环、内存泄漏和应用程序崩溃等问题。因此，我们建议每次脚本运行时都要清理上一次运行，也就是说，事件处理器应当与其参数一起存储在一个全局注册表中，以便能够被检查、停止或调整。每个处理器都应当检查它当前是否仍在针对当前版本的标注/数据运行，以防其已经发生变化。

    不过，通过 `LSI.on()` 绑定的处理器是安全的，会自动处理这一清理过程。

!!! info 提示
    插件在一个异步函数内部执行，因此你可以根据需要使用 `await`。

## 故障排查与调试

重要的是，先使用一个测试项目对插件进行测试和打磨，以避免对线上项目造成任何干扰。

当你添加插件时，**测试（Testing）**面板会出现在脚本字段下方。你可以使用它配合示例数据来测试插件、手动触发事件，并在你与示例数据交互时查看触发了哪些事件。

<video src="../images/plugins/test.mp4" controls="controls" style="max-width: 800px;" class="gif-border" />

请注意以下几点：

* **测试**面板只有在你添加插件后才会显示，并且如果你的标注配置存在校验错误则不会显示，因此请检查**代码（Code）**面板以确保没有错误。
* 你也可以使用 Web 浏览器开发者工具中的 Console（控制台）标签页来检查错误，并验证插件是否在运行。
* 你可以检查 Network（网络）标签页（插件信息会随 `/project/:id` API 调用一起返回）。
* 如有需要，你可以在脚本中添加 [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)，以便在使用 Web 浏览器开发者工具调试插件时有一个方便的断点。

## Label Studio 接口（LSI）

Label Studio 接口（LSI）是一个设计用于配合插件使用的辅助对象。

LSI 简化了对某些数据的访问，并可以执行一些只有在插件框架内才有意义的特殊操作。

### 实例方法

##### `LSI.import(url, integrity)`

允许加载额外的外部脚本

| 参数 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | 类型     | 描述          |
|--------------------------|--------------------|--------------------------|
| `url` | string | 指定外部脚本文件的 URL。                                 |
| `integrity`  | string | 允许浏览器检查所获取的脚本，以确保代码在来源被篡改时绝不会被加载。  |

该方法是异步的，因此你可以在执行主要操作之前等待脚本加载完成。例如：

```javascript
await LSI.import('https://cdn.plot.ly/plotly-2.26.0.min.js', 'sha384-xuh4dD2xC9BZ4qOrUrLt8psbgevXF2v+K+FrXxV4MlJHnWKgnaKoh74vd/6Ik8uF');
console.log("Plotly is ready");
```

##### `LSI.on(eventName, handler)`

订阅以监听与 Label Studio 前端相关的事件。使用此方法附加/订阅的处理器会在切换到另一个标注时自动取消订阅。此方法内部的任何处理器都需要手动确保其安全。

有关所有可用事件的列表，请参阅我们的 [前端参考](/guide/frontend_reference#Available-events)。

!!! note
    诸如 `labelStudioLoad` 和 `storageInitialized` 之类的顶层事件不能与插件一起使用，因为它们会在脚本初始化之前执行。

| 参数 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | 类型     | 描述          |
|--------------------------|--------------------|--------------------------|
| `eventName` | string | 一个区分大小写的字符串，表示要监听的事件类型。                  |
| `handler`  | function | 当事件被触发时将被调用的函数。该函数可以根据事件的不同接收参数。  |


##### `LSI.dataObj`

`.task.data` 的别名。这是任务的核心数据结构，包含需要标注的原始数据。

##### `LSI.task`

一个 getter，返回当前任务的相关信息：
* `id` - 任务的 ID。
* `data` - 表示任务数据的对象。

##### `LSI.annotation`

一个 getter，返回当前选中的标注。

##### `LSI.regions`

一个 getter，返回当前标注的所有区域。


## 前端 API 实现细节

以下实现细节在你创建自己的插件时可能很有用。

!!! note
    虽然这些细节相对稳定，但我们无法保证它们在未来不会发生变化。

有关标注如何存储和格式化的更多信息，请参阅 [Label Studio 如何在标注中保存结果](/guide/task_format#How-Label-Studio-saves-results-in-annotations)。

### 区域


##### `.areas` 

区域的映射（Map）。

##### `.regions` 

所有区域（包含分类）的数组。

##### `.regionStore.regions` 

所有真实区域（不包含分类）的数组。

##### `.results` 

所有结果的数组。

请注意，这里返回的是一个对象数组，其键涵盖所有可能的结果类型，但只有一种结果类型具有实际值。要直接访问这个值，可以使用 `result.mainValue`（它是 `r[control.valueType]` 的快捷方式）。

### 标签

!!! note
    `region` 通过 `.region` 获取（见上文）。

##### `region.labelings` 

此区域的所有标注结果数组。

##### `region.labeling` 

第一个标注结果。

##### `region.labels` 

来自 `labeling` 的标签文本数组，但不包含其他标注结果。

##### `region.labelName` 

第一个标注结果中第一个标签的标签文本。

##### `region.labeling.selectedLabels` 

连接到 `labeling` 中每个标签的 `<Label>` 标签数组。

例如，要获取标签颜色，可以使用 `region.labeling.selectedLabels[0].background`。

##### `region.labeling.getSelectedString(joinStr = " ")` 

返回一个字符串，包含 `labeling` 中的所有标签。默认情况下，这些标签通过参数后跟一个空格进行拼接（例如 `“A B”`）。

##### `region.getLabelText()` 

返回一个字符串，包含 `labeling` 中以逗号分隔的标签列表，以及可选的、第一个逐区域 TextArea 结果的文本。格式如下：`“A,B: text”`
