### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 选项组的名称 |
| toName | <code>string</code> |  | 要标注的数据项名称 |
| [choice] | <code>single</code> \| <code>single-radio</code> \| <code>multiple</code> | <code>single</code> | 单类或多类分类 |
| [showInline] | <code>boolean</code> | <code>false</code> | 在同一行显示选项 |
| [required] | <code>boolean</code> | <code>false</code> | 校验是否已选择一个选项 |
| [requiredMessage] | <code>string</code> |  | 校验失败时显示的消息 |
| [visibleWhen] | <code>region-selected</code> \| <code>no-region-selected</code> \| <code>choice-selected</code> \| <code>choice-unselected</code> |  | 控制选项的可见性。也可与下方的 `when*` 参数配合使用以收窄可见范围 |
| [whenTagName] | <code>string</code> |  | 与 `visibleWhen` 配合使用。按标签名称收窄可见性。对于区域，使用对象标签的名称；对于选项，使用 `choices` 标签的名称 |
| [whenLabelValue] | <code>string</code> |  | 与 `visibleWhen="region-selected"` 配合使用。按标签值收窄可见性。多个值可用逗号分隔 |
| [whenChoiceValue] | <code>string</code> |  | 与 `visibleWhen`（`"choice-selected"` 或 `"choice-unselected"`）以及 `whenTagName` 配合使用（两者均为必填）。按选项值收窄可见性。多个值可用逗号分隔 |
| [perRegion] | <code>boolean</code> |  | 使用此标签为特定区域而非整个任务选择选项 |
| [perItem] | <code>boolean</code> |  | 使用此标签为对象内的特定项而非整个对象选择选项 |
| [value] | <code>string</code> |  | 包含动态加载选项列表的任务数据字段（见下方示例） |
| [allowNested] | <code>boolean</code> |  | 允许在动态选项中使用 `children` 字段进行嵌套。提交的结果将包含数组的数组，每一项是从最顶层父选项到所选选项的值列表。 |
| [layout] | <code>select</code> \| <code>inline</code> \| <code>vertical</code> |  | 选项的布局：`select` 为下拉框格式，`inline` 为水平单行显示，`vertical` 为垂直堆叠显示（默认） |
| [randomize] | <code>boolean</code> | <code>false</code> | 在每次打开任务时对展示给标注员的 `Choice` 选项顺序进行打乱，以减少位置偏差。该打乱是临时性的（每次加载任务和每个标注员会话都会生成新顺序），且不会影响序列化结果——选择某个选项时仍会序列化该选项配置的 `value`/`alias`。自动分配的快捷键遵循可见顺序，因此 `[1]`、`[2]`、`[3]` 提示始终自上而下顺序读取，消除了对特定选项的肌肉记忆偏差。在 `<Choice>` 上显式设置的 `hotkey="..."` 保持不变。只有直接的顶层 `<Choice>` 子元素参与打乱：非 `<Choice>` 的兄弟元素（`<Header>`、`<View>`、`<HyperText>`）保持其布局位置，嵌套选项（`allowNested`）保持嵌套在其父 `<Choice>` 内。 |

