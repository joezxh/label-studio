### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 元素的值 |
| [valueType] | <code>url</code> \| <code>text</code> | <code>text</code> | 文本是直接存储在上传的数据中，还是需要从 URL 加载 |
| [inline] | <code>boolean</code> | <code>false</code> | 是否将 HTML 直接嵌入 Label Studio，还是使用 iframe |
| [saveTextResult] | <code>yes</code> \| <code>no</code> |  | 是否将标注的文本与结果一起存储。默认情况下，对于 `valueType=url` 不存储文本 |
| [encoding] | <code>none</code> \| <code>base64</code> \| <code>base64unicode</code> |  | 如何从编码字符串解码值 |
| [selectionEnabled] | <code>boolean</code> | <code>true</code> | 启用或禁用选择 |
| [clickableLinks] | <code>boolean</code> | <code>false</code> | 是否允许从超文本标记中的链接打开资源。 |
| [highlightColor] | <code>string</code> |  | 高亮颜色的十六进制字符串，若未提供则使用标签颜色 |
| [showLabels] | <code>boolean</code> |  | 是否在区域旁边显示标签；未设置（默认）——使用编辑器设置；true/false——覆盖设置 |
| [granularity] | <code>symbol</code> \| <code>word</code> \| <code>sentence</code> \| <code>paragraph</code> |  | 控制区域选择的粒度 |
| [resolveUrls] | <code>boolean</code> | <code>true</code> | 当 valueType 为 "url" 时，是否解析加载内容中的云存储 URI（s3://、gs:// 等） |

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

