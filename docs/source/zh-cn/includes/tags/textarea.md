### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 用于标识 TextArea 的名称 |
| toName | <code>string</code> |  | 分配给 TextArea 所标注的对象标签的名称 |
| [value] | <code>string</code> |  | 出现在渲染后的 TextArea 字段中且可提交的预填充默认值 |
| [placeholder] | <code>string</code> |  | 出现在渲染后的 TextArea 字段内的占位文本，但与 `value` 不同，它无法被提交 |
| [maxSubmissions] | <code>string</code> |  | 最大提交次数 |
| [editable] | <code>boolean</code> | <code>false</code> | 是否显示一个图标，允许标注员在添加文本后对其进行编辑 |
| [transcription] | <code>boolean</code> | <code>false</code> | 当设为 true 并与 `editable="true"` 配合使用时，即使在添加文本后，TextArea UI 仍会保持可编辑状态 |
| [skipDuplicates] | <code>boolean</code> | <code>false</code> | 当设为 true 时，会弹出警告并阻止重复值。请参阅 [下方示例](#Example-Enforce-unique-values) |
| [displayMode] | <code>tag</code> \| <code>region-list</code> | <code>tag</code> | TextArea 的显示模式；当设为 `region-list` 时，区域面板中的每个区域都会有一个输入框。请参阅 [下方示例](#Example-Region-list-TextArea-fields) |
| [rows] | <code>number</code> | <code>1</code> | TextArea 输入框的行数。若为 `1`，可按 Enter 提交文本；若大于 `1`，可点击 **Add** 或按 Shift + Enter 提交文本 |
| [required] | <code>boolean</code> | <code>false</code> | 确定 TextArea 中的内容是否为必填 |
| [requiredMessage] | <code>string</code> |  | 校验失败时显示的消息 |
| [showSubmitButton] | <code>boolean</code> |  | 确定是否显示或隐藏 **Add** 按钮。默认情况下，若 `rows="1"` 则隐藏，若行数大于 1 则可见 |
| [perRegion] | <code>boolean</code> |  | 使用此标签标注区域而非整个对象 |
| [perItem] | <code>boolean</code> |  | 使用此标签标注对象内部的项而非整个对象 |

