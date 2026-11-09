### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | <code>string</code> |  | 标签的值 |
| [selected] | <code>boolean</code> | <code>false</code> | 是否预选此标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中此标签最多可使用的次数 |
| [hint] | <code>string</code> |  | 悬停时显示的标签提示 |
| [hotkey] | <code>string</code> |  | 用于该标签的快捷键。若未指定则自动生成 |
| [alias] | <code>string</code> |  | 标签别名 |
| [showAlias] | <code>boolean</code> | <code>false</code> | 是否在标签文本内显示别名 |
| [aliasStyle] | <code>string</code> | <code>&quot;opacity:0.6&quot;</code> | 别名的 CSS 样式 |
| [size] | <code>string</code> | <code>&quot;medium&quot;</code> | 标签中文本的大小 |
| [background] | <code>string</code> | <code>&quot;#36B37E&quot;</code> | 激活标签的背景颜色（十六进制） |
| [selectedColor] | <code>string</code> | <code>&quot;#ffffff&quot;</code> | 激活标签中文本的颜色（十六进制） |
| [granularity] | <code>symbol</code> \| <code>word</code> |  | 基于符号或单词选择设置控件（仅适用于文本） |
| [html] | <code>string</code> |  | HTML 代码用于显示标签按钮，替代 `value` 提供的原始文本（需正确转义） |
| [category] | <code>int</code> |  | 类别用于在导出（label-studio-converter 库）中为 YOLO 和 COCO 排序标签 |

