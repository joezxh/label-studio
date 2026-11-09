### 参数（Parameters）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | <code>string</code> | 元素名称 |
| toName | <code>string</code> | 视频元素的名称 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.ranges | <code>Array.&lt;object&gt;</code> | 范围数组，每个范围是一个带有 `start` 和 `end` 属性的对象。每个区域对应一个范围。 |
| [value.timelinelabels] | <code>Array.&lt;string&gt;</code> | 区域由 `TimelineLabels` 创建，相应的标签列于此。 |

### 示例 JSON
```json
{
  "value": {
    "ranges": [{"start": 3, "end": 5}],
    "timelinelabels": ["Moving"]
  }
}
```

