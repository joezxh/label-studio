### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的 HTML 元素名称 |
| [choice] | <code>single</code> \| <code>multiple</code> | <code>single</code> | 配置可以选择一个还是多个标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中一个标签最多可使用的次数 |
| [showInline] | <code>boolean</code> | <code>true</code> | 在同一行显示标签 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| value | <code>Object</code> |  |
| value.start | <code>string</code> | 区域起始容器的 xpath（xpath） |
| value.end | <code>string</code> | 区域结束容器的 xpath（xpath） |
| value.startOffset | <code>number</code> | 起始容器内的偏移量 |
| value.endOffset | <code>number</code> | 结束容器内的偏移量 |
| [value.text] | <code>string</code> | 区域的文本内容，可省略 |

### 示例 JSON
```json
{
  "value": {
    "start": "/div[1]/p[2]/text()[1]",
    "end": "/div[1]/p[4]/text()[3]",
    "startOffset": 2,
    "endOffset": 81,
    "hypertextlabels": ["Car"]
  }
}
```

