### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 包含文本或 URI 的数据字段 |
| [valueType] | <code>url</code> \| <code>text</code> | <code>text</code> | 文本是直接存储在上传的数据中，还是需要从 URL 加载 |
| [saveTextResult] | <code>yes</code> \| <code>no</code> |  | 是否将标注的文本与结果一起存储。默认情况下，对于 `valueType=url` 不存储文本 |
| [encoding] | <code>none</code> \| <code>base64</code> \| <code>base64unicode</code> |  | 如何从编码字符串解码值 |
| [selectionEnabled] | <code>boolean</code> | <code>true</code> | 启用或禁用选择 |
| [highlightColor] | <code>string</code> |  | 高亮颜色的十六进制字符串，若未提供则使用标签颜色 |
| [showLabels] | <code>boolean</code> |  | 是否在区域旁边显示标签；未设置（默认）——使用编辑器设置；true/false——覆盖设置 |
| [granularity] | <code>symbol</code> \| <code>word</code> \| <code>sentence</code> \| <code>paragraph</code> |  | 控制区域选择的粒度 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.start | <code>string</code> | 区域起始位置（字符数） |
| value.end | <code>string</code> | 区域结束位置（字符数） |
| [value.text] | <code>string</code> | 区域的文本内容，可省略 |

### 示例 JSON
```json
{
  "value": {
    "start": 2,
    "end": 81,
    "labels": ["Car"]
  }
}
```

