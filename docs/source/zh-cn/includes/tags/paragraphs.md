### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 包含段落内容的数据字段 |
| [valueType] | <code>json</code> \| <code>url</code> | <code>json</code> | 数据是直接存储在上传的 JSON 数据中，还是需要从 URL 加载 |
| [audioUrl] | <code>string</code> |  | 用于与短语同步的音频 |
| [sync] | <code>string</code> |  | 要同步的对象名称 |
| [showPlayer] | <code>boolean</code> | <code>false</code> | 是否在段落上方显示音频播放器。若同步对象为音频则忽略此设置 |
| [saveTextResult] | <code>no</code> \| <code>yes</code> | <code>yes</code> | 是否将标注的文本与结果一起存储。默认情况下，对于 `valueType=url` 不存储文本 |
| [layout] | <code>none</code> \| <code>dialogue</code> | <code>none</code> | 是否使用对话式布局 |
| [nameKey] | <code>string</code> | <code>&quot;author&quot;</code> | 用于名称的键字段 |
| [textKey] | <code>string</code> | <code>&quot;text&quot;</code> | 用于文本的键字段 |
| [contextScroll] | <code>boolean</code> | <code>false</code> | 开启上下文滚动模式 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.start | <code>number</code> | 区域起始的段落索引 |
| value.end | <code>number</code> | 区域结束的段落索引 |
| value.startOffset | <code>number</code> | 起始段落内的偏移量 |
| value.endOffset | <code>number</code> | 结束段落内的偏移量 |
| [value.text] | <code>string</code> | 区域的文本内容，可省略 |

### 示例 JSON
```json
{
  "value": {
    "start": 3,
    "end": 5,
    "startOffset": 2,
    "endOffset": 81,
    "paragraphlabels": ["Car"]
  }
}
```

