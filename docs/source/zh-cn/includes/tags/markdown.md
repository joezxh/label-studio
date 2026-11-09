### 参数（Parameters）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | <code>string</code> | Markdown 文本内容，可以是静态文本，也可以是任务数据中的字段名（例如 $markdown_field） |
| [style] | <code>string</code> | CSS 样式字符串 |
| [className] | <code>string</code> | 要应用的 CSS 样式的类名 |
| [idAttr] | <code>string</code> | 在 CSS 中使用的唯一 ID 属性 |
| [visibleWhen] | <code>region-selected</code> \| <code>choice-selected</code> \| <code>no-region-selected</code> \| <code>choice-unselected</code> | 控制内容的可见性 |
| [whenTagName] | <code>string</code> | 与 `visibleWhen` 配合使用。按标签名称收窄可见性 |
| [whenLabelValue] | <code>string</code> | 与 `visibleWhen="region-selected"` 配合使用。按标签值收窄可见性 |
| [whenChoiceValue] | <code>string</code> | 与 `visibleWhen` 和 `whenTagName` 配合使用。按选项值收窄可见性 |

