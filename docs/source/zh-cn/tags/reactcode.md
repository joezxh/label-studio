---
title: ReactCode - Beta 🧪
short: ReactCode 🧪
type: tags
order: 307
meta_title: ReactCode 标签
meta_description: Label Studio 的 ReactCode 标签用于创建高度自定义的、可编程的界面。
---

`<ReactCode>` 标签允许你在 Label Studio 中嵌入自定义的标注界面，同时仍将输出存储为常规的 Label Studio 区域/结果。

你可以用它将已经创建的外部应用引入，也可以创建针对你特定用例的全新自定义标注界面。

重要的是，这让你能够继续利用 Label Studio 的标注管理、审核工作流和数据导出能力。

!!! error Enterprise
    此标签仅面向 Label Studio Enterprise 用户提供。更多信息，请参阅 [可编程与可嵌入界面](https://humansignal.com/programmable-ui/)。

## 参数

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| name | string | — | 标签的唯一标识符（必填） |
| [toName] | string | — | 如果这是一个[自引用标签](#Self-referencing-tag)，则此参数为必填，且应与 `name` 一致 |
| [data] | string | — | [任务数据](#Data-parameter)，例如 `data="$image"` 或 `data="$text"` |
| [inputs] | string | — | 为输入数据（`data`）定义 JSON Schema  |
| [outputs] | string | — | 为[输出](#Using-the-outputs-parameter)定义 JSON Schema  |
| [src] | string | — | 要在 iframe 中加载的外部应用的 URL（参见[外部应用模式](#External-app-mode-src)）。支持任务数据插值，例如 `src="$app_url"` |
| [style] | string | — | iframe 容器的内联样式或 CSS 字符串  |
| [classname] | string | — | 为包装元素添加的额外 CSS 类  |
| [allow] | string | — | iframe 权限策略，例如 `allow="microphone *; camera *"` |

## ReactCode 标签使用说明

`ReactCode` 标签在几个方面很独特：

### 自引用标签

与大多数其他对象标签不同，`ReactCode` 可以单独使用，也可以与控制标签配合使用。

如果你不将其与控制标签配合使用，必须使其自引用（`toName` 参数必须指向 `name`）。例如：
    
`<ReactCode name="react-app" toName="react-app">`

### Data 参数

对于其他 Label Studio 标签，你使用 `value` 参数来引用任务数据。

但 `ReactCode` 没有可以显式设置的 `value` 参数。相反，要引用任务数据，你可以采用两种方法：

* 如果你想传递所有任务数据，则完全不需要引用数据。例如：

  `<ReactCode name="react-app" toName="react-app">`

* 如果你想引用特定字段，可以使用 `data` 参数。例如：

  `<ReactCode name="react-app" toName="react-app" data="$image">`

  然后你可以在 React 代码中访问任务数据：

```javascript
function MyComponent({ React, addRegion, regions, data }) {
  // data 包含 data="$fieldname" 中指定的任务字段的值
  const imageUrl = data.image || data.image_url || data;
  const metadata = data.metadata || {};
  
  return React.createElement('img', { src: imageUrl });
}
```

## React 使用说明

在开始之前，你应当熟悉 React 和 React hooks（`useState`、`useEffect`、`useRef`）。

在编写 React 代码时，请注意以下几点：

### CDATA 包裹

对于复杂代码（尤其是使用 `&`、`<`、`>` 字符时），请将你的代码包裹在 `<![CDATA[` 和 `]]>` 标签中

```xml
<ReactCode name="custom" toName="custom" data="$myData">
  <![CDATA[
  // 你的代码写在这里 - 可避免 XML 解析问题
  function MyComponent({ React, addRegion, regions, data }) {
    // 包含 &、<、> 字符的代码在这里是安全的
  }
  ]]>
</ReactCode>
```

### 不支持 JSX

不支持 JSX 语法。你必须改用 `React.createElement()`。

```javascript
// ❌ 这样不会生效
return <div className="container">Content</div>;

// ✅ 改用这种方式
return React.createElement('div', { className: 'container' }, 'Content');
```

### 基于函数的组件

你的代码必须是一个接收 props 并返回 React 元素的函数。

### 样式

你可以使用：
- **Tailwind CSS 类**：已在 iframe 中预加载
- **内联样式**：通过 `React.createElement()` 中的 `style` 属性
- **外部 CSS**：在你的组件中通过 CDN 加载

## Regions API

你的 React 组件会从 Label Studio 接收以下 props：

- **`React`**：包含 hooks 的 React 库（useState、useEffect、useRef 等。）
- **`addRegion`**：用于创建新区域的函数
- **`regions`**：此标签的所有现有区域数组
- **`data`**：在 `data` 参数中引用的任务数据
- **`viewState`**：包含当前视图/UI 状态信息的对象

#### `addRegion(value, extraData = {})`

使用你的自定义值创建一个新区域。

**参数：**
- `value`：可 JSON 序列化的负载（必填）
- `extraData`：可选对象，包含：
  - `displayText`：在区域标签中显示的易读文本

**返回：** 创建的区域对象

**示例：**
```javascript
const region = addRegion(
  { index: 1, labels: { category: "Food" } },
  { displayText: "Row 1: Food" }
);
```

#### `regions` 

此标签的所有区域数组。每个区域包含：

- **`region.value`**：你的可 JSON 序列化的负载
- **`region.id`**：区域的唯一标识符
- **`region.update(value)`**：替换区域的值
- **`region.delete()`**：删除区域

**示例：**
```javascript
// 读取所有区域
regions.forEach(region => {
  console.log(region.value);
});

// 更新一个区域
region.update({ ...region.value, status: 'updated' });

// 删除一个区域
region.delete();
```

#### `viewState`

包含用于条件渲染的当前视图/UI 状态信息的对象。

**属性：**
- **`currentScreen`**：`"quick_view" | "side_by_side" | "label_stream" | "review_stream"`——当前界面上下文
  - `"review_stream"`：审核模式（审核员界面）
  - `"label_stream"`：标注流模式（标注员流式处理）
  - `"side_by_side"`：查看所有标注模式（对比标注）
  - `"quick_view"`：单任务视图（默认）
- **`darkMode`**：`boolean`——应用程序当前是否处于深色模式

**示例：**
```javascript
function MyComponent({ React, addRegion, regions, data, viewState }) {
  const { currentScreen, darkMode } = viewState;
  
  // 基于界面进行条件渲染
  const isReviewing = currentScreen === "review_stream";
  
  // 应用深色模式样式
  const containerStyle = {
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    color: darkMode ? '#e5e5e5' : '#333333',
  };
  
  return React.createElement('div', { style: containerStyle },
    isReviewing && React.createElement('p', null, 'Review Mode Active'),
    // ... 组件其余部分
  );
}
```

## 区域的输出格式

使用 `ReactCode` 创建的区域遵循 Label Studio 的标准格式：

```json
{
  "id": "7ZP46bpbNX",
  "from_name": "custom",
  "to_name": "custom",
  "type": "reactcode",
  "origin": "manual",
  "value": {
    "reactcode": {
      "index": 1,
      "labels": {
        "category": "Food"
      }
    }
  }
}
```

`value.reactcode` 属性包含你传递给 `addRegion()` 的任何数据。

## 外部应用模式（`src`）

除了编写内联 React 代码，你还可以通过 `src` 参数加载一个完整的独立 Web 应用。该应用可以使用任何框架、构建系统或库——不限于 React。它通过 `window.postMessage()` 与 Label Studio 通信。

```xml
<View>
  <ReactCode name="map" src="http://localhost:3000/index.html" style='{"height":"600px"}' />
</View>
```

`src` 的值可以是静态 URL，也可以是从任务数据中读取的变量（例如 `src="$app_url"`）。

### 何时使用 `src` 模式

| Criteria | Inline code | External `src` |
|---|---|---|
| 配置复杂度 | 零——只需 XML | 应用必须通过 URL 托管 |
| 框架 | 仅 React（无 JSX）| 任意（React、Vue、原生 JS 等） |
| 构建工具 | 无 | 可选（Vite、webpack 等） |
| 依赖 | 通过 CDN 动态加载 | 按你的方式加载 |
| 最适合 | 表单、表格、简单 UI | 地图、画布、复杂可视化 |
| 调试 | 较困难（基于 eval 的代码）| 标准浏览器开发者工具 |
| 版本控制 | 无内置版本控制；通过更新 XML 配置维护 | 更易于用标准开发工具（例如 Git）管理版本 |

### 通信协议

你的应用运行在 iframe 中。Label Studio 通过 `postMessage()` 与它通信。生命周期如下：

1. Label Studio 用你的 URL 创建 iframe
2. 你的应用加载并向父窗口发送 `{ type: "ready" }`
3. Label Studio 以 `{ type: "init", tag, data, regions, viewState }` 回应
4. 你的应用使用接收到的数据和区域渲染 UI
5. 持续的双向消息保持区域和视图状态同步

#### 来自 Label Studio 发往你的应用的消息

| Message | Fields | When sent |
|---|---|---|
| `init` | `tag`, `data`, `code`*, `regions`, `viewState` | 在你的应用发送 `ready` 之后 |
| `update` | `tag`, `data?`, `regions?`, `viewState?` | 任务或标注切换（iframe 池复用） |
| `regions` | `tag`, `regions` | 区域变化（新增/删除/选中/更新） |
| `viewState` | `tag`, `viewState` | 深色模式切换、界面上下文变化 |

\* 在 `src` 模式下 `code` 为空字符串——忽略它。

#### 来自你的应用发往 Label Studio 的消息

| Message | Fields | Purpose |
|---|---|---|
| `ready` | _(none)_ | 表示应用已加载，触发 `init` |
| `addRegion` | `tag`, `value`, `extraData?` | 创建新区域 |
| `updateRegion` | `tag`, `id`, `value` | 更新现有区域的值 |
| `deleteRegion` | `tag`, `id` | 删除区域 |
| `selectRegions` | `tag`, `ids` | 在 Label Studio 的标注界面中选择区域 |

!!! warning 重要
    所有出站消息都必须包含 `tag`（在 `init` 期间接收）。Label Studio 使用它将消息路由到正确的 ReactCode 实例。

#### 数据结构

**`regions` 数组**（从 Label Studio 接收）：
```javascript
[
  {
    id: "abc123",
    value: { /* 你的自定义负载 */ },
    selected: false,    // 在标注界面中被选中
    hidden: false,      // 通过眼睛图标隐藏
    locked: false,      // 通过锁定图标锁定
    origin: "manual",   // "manual"（手动） | "prediction"（预测） | "prediction-changed"（预测已修改）
  }
]
```

**`viewState` 对象**：
```javascript
{
  currentScreen: "quick_view",  // "quick_view" | "label_stream" | "review_stream" | "side_by_side"
  darkMode: false,
}
```

**`addRegion` 中的 `extraData`**（可选）：
```javascript
{ displayText: "用于标注界面的易读标签" }
```

### 最简 `src` 应用模板

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReactCode src app</title>
</head>
<body>
  <div id="app">Loading…</div>

  <script>
    let tagName = null;
    let regions = [];

    function post(msg) {
      window.parent.postMessage({ ...msg, tag: tagName }, "*");
    }

    window.addEventListener("message", (e) => {
      if (tagName && e.data.tag && e.data.tag !== tagName) return;

      switch (e.data.type) {
        case "init":
          tagName = e.data.tag;
          initApp(e.data.data, e.data.regions, e.data.viewState);
          break;
        case "update":
          if (e.data.data !== undefined) updateData(e.data.data);
          if (e.data.regions) reconcileRegions(e.data.regions);
          if (e.data.viewState) updateViewState(e.data.viewState);
          break;
        case "regions":
          reconcileRegions(e.data.regions);
          break;
        case "viewState":
          updateViewState(e.data.viewState);
          break;
      }
    });

    function initApp(data, initialRegions, viewState) {
      if (!data) return;  // 在池预热期间 data 可能为 null
      // 使用任务数据初始化应用，渲染现有区域
    }
    function updateData(data) { /* 处理新任务数据 */ }
    function reconcileRegions(newRegions) {
      regions = newRegions;
      // 将你的可视化元素与新区域数组协调一致
    }
    function updateViewState(viewState) { /* 例如切换深色模式 */ }

    // 发送就绪信号——触发来自 Label Studio 的 init
    window.parent.postMessage({ type: "ready" }, "*");
  </script>
</body>
</html>
```

### 处理空 `data`

在初始化期间（尤其是在 iframe 池化的情况下），在真实任务数据到达之前，`data` 可能会短暂为 `null`。你的应用应当对此进行防护：

```javascript
function initApp(data, initialRegions, viewState) {
  if (!data) return;  // 等待真实数据
  // ... 设置你的应用
}
```

### 本地测试

在开发过程中，你需要让本地应用对 Label Studio（运行在 HTTPS 上）可访问。本地 `http://localhost` URL 无法工作，因为浏览器会阻止 HTTPS 页面内的 HTTP iframe（混合内容）。

**Step 1: 本地托管你的应用**

```bash
# 从你的应用目录
npx serve -l 3000
```

其他替代：`python3 -m http.server 3000`、`npx http-server -p 3000`，或任意开发服务器（Vite、webpack-dev-server）。

**Step 2: 通过 HTTPS 隧道暴露它**

```bash
# 在另一个终端
ngrok http 3000
```

ngrok 会输出一个公共 HTTPS URL，例如 `https://abc123.ngrok-free.app`。在配置中使用它：

```xml
<ReactCode name="myapp" src="https://abc123.ngrok-free.app/index.html" style='{"height":"600px"}' />
```

ngrok 的替代方案：`cloudflared tunnel --url http://localhost:3000`（Cloudflare Tunnel，无需账号）、`npx localtunnel --port 3000`。

!!! note
    对于生产环境，将你的应用部署到任意静态托管服务（Vercel、Netlify、S3、GitHub Pages 等），并使用永久的 HTTPS URL。

### 区域协调

当 Label Studio 发送 `regions` 更新时，你的应用必须协调其可视化状态。这是 `src` 应用最重要的模式：

1. **移除** 不再出现在数组中的区域对应的可视化（已删除）
2. **隐藏** `hidden: true` 的区域对应的可视化
3. **创建** 新区域 ID 对应的可视化
4. **更新** 发生变化的现有区域的位置/值
5. **聚焦/高亮** `selected: true` 的区域

!!! warning 重要
    添加区域时，切勿乐观地修改本地状态。始终向父窗口发送 `addRegion` 并等待 `regions` 更新。Label Studio 负责分配区域 ID，是唯一的真相来源。

### 处理任务和标注切换

当用户切换任务或标注时，Label Studio 可能会发送 `update` 消息，而不是销毁并重新创建 iframe。你的应用必须通过用新数据和区域重新初始化其状态来处理这种情况。务必同时处理 `init` 和 `update` 两种消息类型。

## 使用 `outputs` 参数 

你可以选择性地使用 `outputs` 参数来定义标注结果的预期结构。它指定了你的界面将产生哪些字段以及它们包含的数据类型。

```xml
<ReactCode name="my_interface" toName="my_interface" outputs="summary, sentiment" />
```

!!! note
    `outputs` 参数用于验证和文档目的的 schema 定义。实际的标注 JSON 结构始终相同——你从 `addRegion()` 传入的数据存储在 `value.reactcode` 中。`outputs` 参数帮助 Label Studio 理解预期的结构，以支持模型预测和数据导出等功能。

### 支持的格式

你可以使用三种方法定义输出（可组合）：

#### 简单字段列表

用逗号、分号、竖线或空格分隔字段名。每个字段默认为 `string` 类型。

!!! note

    所有分隔符（`,`、`;`、`|`）在功能上是等价的，可以互换使用。根据偏好或可读性选择即可。逗号（`,`）是最常用的分隔符。

```xml
<!-- 逗号分隔（最常见） -->
outputs="field1, field2, field3"

<!-- 分号分隔 -->
outputs="field1; field2; field3"

<!-- 竖线分隔 -->
outputs="field1|field2|field3"
```

**结果：** 所有字段都成为 schema 中的 string 类型属性。

#### 类型别名

为常见数据模式使用简写语法。格式：`fieldname:type(arguments)`

| Type Alias | Syntax | Description |
|------------|--------|-------------|
| `choices` | `field:choices(opt1, opt2, opt3)` | 从选项中单选（枚举） |
| `multichoices` | `field:multichoices(opt1, opt2, opt3)` | 多选（枚举数组） |
| `number` | `field:number(min, max)` | 带可选范围的数字值 |
| `rating` | `field:rating(max)` | 从 1 到 max 的整数评分（默认：5） |

**示例：**

```xml
<!-- 单选项下拉 -->
outputs="sentiment:choices(positive, negative, neutral)"

<!-- 多选标签 -->
outputs="categories:multichoices(urgent, bug, feature, docs)"

<!-- 带范围的数字 -->
outputs="confidence:number(0, 100)"

<!-- 1-10 评分量表 -->
outputs="quality:rating(10)"

<!-- 组合 -->
outputs="rating:choices(good, bad), tags:multichoices(urgent, review), score:number(0, 100)"
```

#### 原始 JSON Schema（高级）

如需完全控制，请提供原始 JSON Schema。当字符串以 `{` 开头时，解析器会识别为 JSON。

```xml
<!-- 仅属性（自动包裹在对象 schema 中） -->
outputs='{"name": {"type": "string"}, "age": {"type": "integer", "minimum": 0}}'

<!-- 包含嵌套对象的完整 schema -->
outputs='{
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object", 
      "properties": {
        "author": {"type": "string"},
        "timestamp": {"type": "string", "format": "date-time"}
      }
    },
    "tags": {
      "type": "array",
      "items": {"type": "string"}
    }
  },
  "required": ["metadata"]
}'
```
### 空 outputs

如果 `outputs` 为空或未指定，则 schema 默认是空对象：

```json
{"type": "object", "properties": {}}
```

### outputs 使用示例

#### 文档审核界面

```xml
<ReactCode 
  name="review" 
  toName="document" 
  outputs="decision:choices(approve, reject, revise), notes, priority:rating(5)"
/>
```

生成 schema：
```json
{
  "type": "object",
  "properties": {
    "decision": {"type": "string", "enum": ["approve", "reject", "revise"]},
    "notes": {"type": "string"},
    "priority": {"type": "integer", "minimum": 1, "maximum": 5}
  }
}
```

#### 内容标签

```xml
<ReactCode
  name="tagger" 
  toName="text" 
  outputs="topics:multichoices(sports, politics, tech, entertainment), confidence:number(0, 1)"
/>
```

#### 复杂 JSON Schema

```xml
<ReactCode 
  name="entity_extractor" 
  toName="text" 
  outputs='{
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {"type": "string"},
          "label": {"type": "string"},
          "start": {"type": "integer"},
          "end": {"type": "integer"}
        },
        "required": ["text", "label"]
      }
    }
  }'
/>
```

### 结果输出示例

`outputs` 参数定义了预期的 schema，而标注 JSON 结构始终遵循相同的格式。以下示例展示了不同的 `outputs` 值如何影响标注 JSON：

#### Example 1: Simple field list

<br />

{% details <b>点击展开</b> %}

**配置：**
```xml
<ReactCode name="classifier" toName="classifier" outputs="summary, sentiment" />
```

**创建标注的代码：**
```javascript
addRegion({
  summary: "This is a positive review",
  sentiment: "positive"
}, { displayText: "Positive" });
```

**结果标注 JSON：**
```json
{
  "id": "123",
  "from_name": "classifier",
  "to_name": "classifier",
  "type": "reactcode",
  "origin": "manual",
  "value": {
    "reactcode": {
      "summary": "This is a positive review",
      "sentiment": "positive"
    }
  }
}
```
{% enddetails %}

#### Example 2: Type aliases

<br />

{% details <b>点击展开</b> %}

**配置：**
```xml
<ReactCode 
  name="review" 
  toName="review" 
  outputs="decision:choices(approve, reject, revise), notes, priority:rating(5)"
/>
```

**创建标注的代码：**
```javascript
addRegion({
  decision: "approve",
  notes: "Looks good, minor formatting issues",
  priority: 4
}, { displayText: "Approve - Priority 4" });
```

**结果标注 JSON：**
```json
{
  "id": "def456",
  "from_name": "review",
  "to_name": "review",
  "type": "reactcode",
  "origin": "manual",
  "value": {
    "reactcode": {
      "decision": "approve",
      "notes": "Looks good, minor formatting issues",
      "priority": 4
    }
  }
}
```

{% enddetails %}

#### Example 3: JSON schema with nested objects

<br />

{% details <b>点击展开</b> %}

**配置：**
```xml
<ReactCode 
  name="entity_extractor" 
  toName="entity_extractor" 
  outputs='{
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {"type": "string"},
          "label": {"type": "string"},
          "start": {"type": "integer"},
          "end": {"type": "integer"}
        }
      }
    }
  }'
/>
```

**创建标注的代码：**
```javascript
addRegion({
  entities: [
    { text: "John Doe", label: "PERSON", start: 0, end: 8 },
    { text: "New York", label: "LOCATION", start: 15, end: 23 }
  ]
}, { displayText: "2 entities found" });
```

**结果标注 JSON：**
```json
{
  "id": "ghi789",
  "from_name": "entity_extractor",
  "to_name": "entity_extractor",
  "type": "reactcode",
  "origin": "manual",
  "value": {
    "reactcode": {
      "entities": [
        {
          "text": "John Doe",
          "label": "PERSON",
          "start": 0,
          "end": 8
        },
        {
          "text": "New York",
          "label": "LOCATION",
          "start": 15,
          "end": 23
        }
      ]
    }
  }
}
```
{% enddetails %}

### 最佳实践

1. **保持简单** — 对于简单情况使用字段列表或类型别名
2. **使用 JSON Schema** — 当你需要验证规则、嵌套对象或数组时
3. **清晰命名字段** — 字段名会成为你标注结果中的键
4. **与 UI 匹配** — 确保 outputs 定义与你自定义 React 组件实际产生的内容一致

## ReactCode 示例

### 基础示例

```xml
<View>
  <ReactCode name="custom" toName="custom" data="$myData">
    <![CDATA[
    function MyComponent({ React, addRegion, regions, data }) {
      const { useState } = React;
      
      const handleClick = () => {
        addRegion({ action: 'clicked', timestamp: Date.now() });
      };
      
      return React.createElement('div', { className: 'p-4' },
        React.createElement('h1', null, 'My Custom Interface'),
        React.createElement('button', { onClick: handleClick }, 'Add Annotation')
      );
    }
    ]]>
  </ReactCode>
</View>
```

### 简单按钮计数器

一个基础界面，用于统计按钮点击次数并将其保存为标注：

```xml
<View>
  <ReactCode name="counter" toName="counter" data="$task">
    <![CDATA[
    function CounterInterface({ React, addRegion, regions, data }) {
      const { useState } = React;
      const [count, setCount] = useState(0);
      
      const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);
        addRegion(
          { count: newCount, timestamp: Date.now() },
          { displayText: `Count: ${newCount}` }
        );
      };
      
      return React.createElement('div', { className: 'p-6 max-w-md mx-auto' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Click Counter'),
        React.createElement('p', { className: 'mb-4' }, `Current count: ${count}`),
        React.createElement('p', { className: 'mb-4 text-sm text-gray-600' }, 
          `Saved annotations: ${regions.length}`
        ),
        React.createElement('button', {
          onClick: handleIncrement,
          className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        }, 'Increment and Save')
      );
    }
    ]]>
  </ReactCode>
</View>

<!-- Example task data:
{
  "data": {
    "task": {
      "id": 1,
      "description": "Count clicks"
    }
  }
}
-->
```

### 文本分类

一个用预定义类别对文本进行分类的简单界面：

```xml
<View>
  <ReactCode name="classifier" toName="classifier" data="$text" outputs='{"category": {"type": "string"}}'>
    <![CDATA[
    function TextClassifier({ React, addRegion, regions, data }) {
      const { useState, useEffect } = React;
      const categories = ['Positive', 'Negative', 'Neutral'];
      const [selectedCategory, setSelectedCategory] = useState(null);
      
      // 如果存在现有标注则加载
      useEffect(() => {
        if (regions.length > 0) {
          setSelectedCategory(regions[0].value.category);
        }
      }, [regions]);
      
      const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (regions.length > 0) {
          // 更新现有区域
          regions[0].update({ category });
        } else {
          // 创建新区域
          addRegion({ category }, { displayText: category });
        }
      };
      
      return React.createElement('div', { className: 'p-6 max-w-2xl mx-auto' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Text Classification'),
        React.createElement('div', { className: 'mb-4 p-4 bg-gray-100 rounded' },
          React.createElement('p', { className: 'font-semibold mb-2' }, 'Text to classify:'),
          React.createElement('p', null, data || 'No text provided')
        ),
        React.createElement('div', { className: 'mb-4' },
          React.createElement('p', { className: 'font-semibold mb-2' }, 'Select category:'),
          React.createElement('div', { className: 'flex gap-2' },
            categories.map(category =>
              React.createElement('button', {
                key: category,
                onClick: () => handleCategorySelect(category),
                className: `px-4 py-2 rounded ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`
              }, category)
            )
          )
        ),
        selectedCategory && React.createElement('p', { className: 'text-green-600 font-semibold' },
          `Selected: ${selectedCategory}`
        )
      );
    }
    ]]>
  </ReactCode>
</View>

<!-- Example task data:
{
  "data": {
    "text": "This product is amazing! I love it."
  }
}
-->
```

### 带元数据的图像标注

一个显示图像并允许添加元数据标注的界面：

```xml
<View>
  <ReactCode name="imageAnnotator" toName="imageAnnotator" data="$image">
    <![CDATA[
    function ImageAnnotator({ React, addRegion, regions, data }) {
      const { useState } = React;
      const [notes, setNotes] = useState('');
      const [quality, setQuality] = useState('');
      
      const imageUrl = data || data.image || data.image_url;
      
      const handleSave = () => {
        if (!notes && !quality) return;
        
        addRegion(
          {
            notes: notes,
            quality: quality,
            timestamp: Date.now()
          },
          { displayText: `Quality: ${quality || 'N/A'}` }
        );
        
        setNotes('');
        setQuality('');
      };
      
      return React.createElement('div', { className: 'p-6' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Image Annotation'),
        imageUrl && React.createElement('img', {
          src: imageUrl,
          alt: 'Annotate this image',
          className: 'max-w-full h-auto mb-4 rounded border'
        }),
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', { className: 'block mb-2 font-semibold' }, 'Quality:'),
          React.createElement('select', {
            value: quality,
            onChange: (e) => setQuality(e.target.value),
            className: 'w-full p-2 border rounded'
          },
            React.createElement('option', { value: '' }, 'Select quality...'),
            React.createElement('option', { value: 'high' }, 'High'),
            React.createElement('option', { value: 'medium' }, 'Medium'),
            React.createElement('option', { value: 'low' }, 'Low')
          )
        ),
        React.createElement('div', { className: 'mb-4' },
          React.createElement('label', { className: 'block mb-2 font-semibold' }, 'Notes:'),
          React.createElement('textarea', {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            className: 'w-full p-2 border rounded',
            rows: 3,
            placeholder: 'Add your notes here...'
          })
        ),
        React.createElement('button', {
          onClick: handleSave,
          className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
        }, 'Save Annotation'),
        regions.length > 0 && React.createElement('div', { className: 'mt-4 p-4 bg-gray-100 rounded' },
          React.createElement('p', { className: 'font-semibold mb-2' }, `Saved annotations (${regions.length}):`),
          regions.map((region, idx) =>
            React.createElement('div', { key: region.id || idx, className: 'mb-2 text-sm' },
              React.createElement('span', null, `#${idx + 1}: `),
              React.createElement('span', null, JSON.stringify(region.value))
            )
          )
        )
      );
    }
    ]]>
  </ReactCode>
</View>

<!-- Example task data:
{
  "data": {
    "image": "https://example.com/image.jpg"
  }
}
-->
```

## 故障排查

**代码未渲染**

- 检查浏览器控制台是否有错误
- 确保你的函数返回了有效的 React 元素
- 如果代码包含特殊字符，请确认使用了 CDATA 包裹
- 检查 `data` 参数是否正确引用了你的任务数据

**区域未出现**

- 确认你正确调用了 `addRegion()`
- 检查你是否在组件中渲染了 `regions` 数组
- 确保自引用标签的 `name` 和 `toName` 一致

**数据未加载**

- 确认 `data` 参数与你的任务数据结构匹配
- 检查任务数据是否存在且格式正确
- 使用 `console.log(data)` 检查传入的内容

**样式问题**

- 使用 Tailwind 类（已预加载）或内联样式
- 对于外部 CSS，请确保它通过 CDN 在你的组件中加载
- 检查样式是否未被 Label Studio 的 CSS 覆盖



## 相关模板

- [Spreadsheet Editor](/templates/react_spreadsheet)
- [Multi-channel audio transcription](/templates/react_audio)
- [Agentic tracing for claims](/templates/react_claims)
