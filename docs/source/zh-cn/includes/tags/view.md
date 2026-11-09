### 参数（Parameters）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| display | <code>block</code> \| <code>inline</code> | 显示方式（block 为块级，inline 为行内） |
| [style] | <code>string</code> | CSS 样式字符串 |
| [className] | <code>string</code> | 要应用的 CSS 样式的类名。与 Style 标签配合使用 |
| [idAttr] | <code>string</code> | 在 CSS 中使用的唯一 ID 属性 |
| [visibleWhen] | <code>region-selected</code> \| <code>choice-selected</code> \| <code>no-region-selected</code> \| <code>choice-unselected</code> | 控制内容的可见性。也可与下方的 `when*` 参数配合使用以收窄可见范围 |
| [whenTagName] | <code>string</code> | 与 `visibleWhen` 配合使用。按标签名称收窄可见性。对于区域，使用对象标签的名称；对于选项，使用 `choices` 标签的名称 |
| [whenLabelValue] | <code>string</code> | 与 `visibleWhen="region-selected"` 配合使用。按标签值收窄可见性。多个值可用逗号分隔 |
| [whenChoiceValue] | <code>string</code> | 与 `visibleWhen`（`"choice-selected"` 或 `"choice-unselected"`）以及 `whenTagName` 配合使用（两者均为必填）。按选项值收窄可见性。多个值可用逗号分隔 |

