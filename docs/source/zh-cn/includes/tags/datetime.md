### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的元素名称 |
| only | <code>string</code> |  | 要显示的组成部分列表（逗号分隔：date、time、month、year）。date 与 month/year 不能同时使用。date 选项优先级更高 |
| format | <code>string</code> |  | 日期时间的输入/输出 strftime 格式（内部始终为 ISO）；当日期和时间同时显示时，默认以带 "T" 分隔符的 ISO 格式显示；当仅显示日期时，默认显示 ISO 日期；当仅显示时间时，默认显示带前导零的 24 小时制时间 |
| [min] | <code>string</code> |  | 为 only=date 设置最小日期时间值（ISO 格式），或为 only=year 设置最小年份 |
| [max] | <code>string</code> |  | 为 only=date 设置最大日期时间值（ISO 格式），或为 only=year 设置最大年份 |
| [required] | <code>boolean</code> | <code>false</code> | 日期时间是否为必填 |
| [requiredMessage] | <code>string</code> |  | 校验失败时显示的消息 |
| [perRegion] | <code>boolean</code> |  | 使用此选项标注区域而非整个对象 |
| [perItem] | <code>boolean</code> |  | 使用此选项标注对象内部的项而非整个对象 |

