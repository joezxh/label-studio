### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要分类的元素名称 |
| [apiUrl] | <code>string</code> |  | **Beta**——从远程源获取分类法。这可以是 JSON 格式的文件，也可以是通过 API 读取的分层数据源。更多信息，请参阅 [分类法模板页面](/templates/taxonomy) |
| [leafsOnly] | <code>boolean</code> | <code>false</code> | 允许标注员仅选择分类法的叶子节点 |
| [showFullPath] | <code>boolean</code> | <code>false</code> | 是否显示所选项目的完整路径 |
| [pathSeparator] | <code>string</code> | <code>&quot;/&quot;</code> | 完整路径中显示的分隔符（默认为 " / "）。为避免错误，请确保你的数据不包含此分隔符 |
| [maxUsages] | <code>number</code> |  | 每个任务或每个区域中一个选项最多可选中的次数 |
| [maxWidth] | <code>number</code> |  | 下拉框的最大宽度（带单位，例如 "500px"） |
| [minWidth] | <code>number</code> |  | 下拉框的最小宽度（带单位，例如 "300px"） |
| [required] | <code>boolean</code> | <code>false</code> | 是否要求至少选中一个选项 |
| [requiredMessage] | <code>string</code> |  | 校验失败时显示的消息 |
| [placeholder=] | <code>string</code> |  | 在输入框中显示的提示文本 |
| [perRegion] | <code>boolean</code> |  | 使用此标签标注特定区域而非整个对象 |
| [perItem] | <code>boolean</code> |  | 使用此标签标注对象内部的特定项而非整个对象 |
| [labeling] | <code>boolean</code> |  | 使用分类法标注文本中的区域。仅支持 `<Text>` 和 `<HyperText>` 对象标签。 |
| [legacy] | <code>boolean</code> |  | **已弃用。** 启用旧版分类法 UI（标注员可按需添加标签）。当为 true 时，`apiUrl` 参数不可用。建议使用默认的分类法 UI。 |
| [allowAddLabels] | <code>boolean</code> | <code>false</code> | **仅适用于新版分类法 UI。** 当为 `true` 时，在项目支持的情况下，标注员可以添加和移除用户定义的标签。默认为 `false`，因此除非你选择启用，选项将限制为配置的分类法。如果你省略此属性但设置了 `legacy`，`allowAddLabels` 将默认与 `legacy` 取相同的值。当 `legacy` 为 `true` 或设置了 `apiUrl` 时会被忽略（外部分类法应在其源头管理）。 |

