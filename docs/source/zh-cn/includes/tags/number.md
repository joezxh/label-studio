### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的元素名称 |
| [min] | <code>number</code> |  | 最小数值 |
| [max] | <code>number</code> |  | 最大数值 |
| [step] | <code>number</code> | <code>1</code> | 数值增减的步长 |
| [defaultValue] | <code>number</code> |  | 默认数值；对于必填字段会自动添加到结果中 |
| [hotkey] | <code>string</code> |  | 用于增加数值的快捷键 |
| [required] | <code>boolean</code> | <code>false</code> | 数值是否为必填 |
| [requiredMessage] | <code>string</code> |  | 校验失败时显示的消息 |
| [perRegion] | <code>boolean</code> |  | 使用此标签标注特定区域而非整个对象 |
| [perItem] | <code>boolean</code> |  | 使用此标签标注对象内部的特定项而非整个对象 |
| [slider] | <code>boolean</code> | <code>false</code> | 使用滑块样式而非输入框；使用 min 和 max 来添加约束 |

