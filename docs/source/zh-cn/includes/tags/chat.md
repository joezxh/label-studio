### 参数（Parameters）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | <code>string</code> | 元素名称 |
| value | <code>string</code> | 包含聊天消息数组或空数组的数据字段 |
| [messageroles] | <code>string</code> | 用户可代表其创建并发送消息的角色列表（逗号分隔）。若设置了 `llm` 参数，默认值为 "user"；否则默认值为 "user,assistant"。 |
| [editable] | <code>boolean</code> \| <code>string</code> | 消息是否可编辑。使用 true/false，或逗号分隔的可编辑角色列表 |
| [minmessages] | <code>string</code> \| <code>number</code> | 提交所需的最小消息总数 |
| [maxmessages] | <code>string</code> \| <code>number</code> | 允许的最大消息总数 |
| [llm] | <code>string</code> | 用于启用自动助手回复的模型，格式：`<provider>/<model>` |

