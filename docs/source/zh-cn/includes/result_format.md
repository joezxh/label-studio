## Label Studio 如何保存标注中的结果

每个标注结果都由一个列表或项目组成，也称为 _区域（regions）_，存储在 `annotation.result` 字段下：
```json
{"result": [{"id": "123", ...}, {"id": "456", ...}], ...}
```
区域可以表示任何标注操作 —— 绘制的边界框、创建的关系、分配的类别等。每个 `"id"` 字段是一个由字符 `A-Za-z0-9_-` 组成的字符串，并根据标注结构进行分配：每个单独的标注实体获得自己的 ID，相同的 ID 用于链接不同的实体 —— 例如，使用 `<Relation>` 关联它们，或使用 `"perRegion"` 属性分配条件标注。

格式遵循以下原则：
- 始终应至少包含 1 个对象标签
- 对象标签定义所使用的数据类型（image、html、video 等）
- 至少 1 个控制标签应附加到对象标签以在该对象上创建区域
- 每个控制标签为区域生成 1 个结果
- 同一区域的结果共享相同的 id
- 分类技术上创建了一个特殊的空分类区域

当使用预测来创建标注时，结果 ID 在标注字段中保持不变。这允许你追踪由机器学习模型生成的区域，并将它们直接与人工创建和审核的标注进行比较。

`"value"` 表示标注过程的结果，其结构根据标注配置而变化。要了解特定标签的结构，请参阅 [控制标签](/tags) 文档并探索相关标签。

## 示例

### 每区域（per-regions）

当强制使用条件 `"perRegion"` 结构时，结果格式的示例：

```xml
<Image name="image" value="$image"/>
<RectangleLabels name="product" toName="image">
  <Label value="Some label" />
  ...
</RectangleLabels>
<TextArea name="name" toName="image" perRegion="true" />
```

一个区域的 1–2 个结果：必需的标注和可选的每区域文本结果

```json
[{
  "id": "X_12fGk",
  "from_name": "product",
  "to_name": "image",
  "type": "rectanglelabels",
  // ...
  "value": {
    "labels": ["Some label"],
    // ...
  }
}, {
  "id": "X_12fGk",
  "from_name": "name",
  "to_name": "image",
  "type": "textarea",
  // ...
  "value": {
    "text": ["Roasted beans"],
    // ...
  }
}]
```

### 可选标签

```xml
<Image name="image" value="$image"/>
<Rectangle name="product" toName="image" />
<Labels name="kind" toName="image">
  <Label value="Tea" />
  <Label value="Coffee" />
</Labels>
```

一个区域的 1–2 个结果：必需的绘制工具和附加到它的可选标签

```json
[{
  "id": "X_12fGk",
  "from_name": "product",
  "to_name": "image",
  "type": "rectangle",
  // ...
  "value": {
    "x": 100,
    "y": 200,
    // ...
  }
}, {
  "id": "X_12fGk",
  "from_name": "kind",
  "to_name": "image",
  "type": "labels",
  // ...
  "value": {
    "labels": ["Tea"],
    // ...
  }
}]
```

### 多标签

```xml
<Image name="image" value="$image"/>
<Rectangle name="product" toName="image" />
<Labels name="kind" toName="image">
  <Label value="Tea" />
  <Label value="Coffee" />
</Labels>
<Labels name="country" toName="image">
  <Label value="Sri-Lanka" />
  <Label value="Brazil" />
</Labels>
<Number name="price" toName="image" perRegion="true" required="true" />
```

一个区域的 1-4 个结果：可选标签和必需价格 + 矩形本身

```json
[{
  "id": "X_12fGk",
  "from_name": "product",
  "to_name": "image",
  "type": "rectangle",
  // ...
  "value": {
    // rectangle sizes
  }
}, {
  "id": "X_12fGk",
  "from_name": "kind",
  "to_name": "image",
  "type": "labels",
  // ...
  "value": {
    "labels": ["Coffee"],
    // rectangle sizes
  }
}, {
  "id": "X_12fGk",
  "from_name": "country",
  "to_name": "image",
  "type": "labels",
  // ...
  "value": {
    "labels": ["Brazil"],
    // rectangle sizes
  }
}, {
  "id": "X_12fGk",
  "from_name": "price",
  "to_name": "image",
  "type": "labels",
  // ...
  "value": {
    "number": 12.5,
    // rectangle sizes
  }
}]
```
### 关系（relations）

你可以在两个对象之间绘制关系箭头。例如，目标检测配置
```xml
<Image name="image" value="$image"/>
<RectangleLabels name="kind" toName="image">
  <Label value="Car" />
  <Label value="Airplaine" />
</RectangleLabels>
```
```
```json
[{
  "id": "oid67",
  "type": "rectanglelabels",
  // ...
},
{
  "id": "RQbW3Sj_Zr",
  "type": "rectanglelabels",
  // ...
},
{
  "type": "relation",
  "to_id": "RQbW3Sj_Zr",
  "from_id": "oid66",
  "direction": "right"
}]
```
