### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| column | <code>string</code> |  | 列名称或索引 |
| [legend] | <code>string</code> |  | 声道的显示名称 |
| [units] | <code>string</code> |  | 显示的单位名称 |
| [displayFormat] | <code>string</code> |  | 数值的格式字符串，使用 d3-format:<br/>        `[,][.precision][f\|%]`<br/>        `,` - 使用分隔符对千位分组（取决于区域设置）：`,` (12345.6 -> 12,345.6) `,.2f` (12345.6 -> 12,345.60)<br/>        `.precision` - 针对 `f\|%` 类型的精度，针对空类型为有效数字位数：<br/>                     `.3f` (12.3456 -> 12.345, 1000 -> 1000.000)<br/>                     `.3` (12.3456 -> 12.3, 1.2345 -> 1.23, 12345 -> 1.23e+4)<br/>        `f` - 按浮点处理，默认精度为 .6：`f` (12 -> 12.000000) `.2f` (12 -> 12.00) `.0f` (12.34 -> 12)<br/>        `%` - 按百分比处理并相应格式化：`%.0` (0.128 -> 13%) `%.1` (1.2345 -> 123.4%) |
| [height] | <code>number</code> | <code>200</code> | 绘图高度 |
| [strokeColor] | <code>string</code> | <code>&quot;#f48a42&quot;</code> | 绘图描边颜色，期望十六进制值 |
| [strokeWidth] | <code>number</code> | <code>1</code> | 绘图描边宽度 |
| [markerColor] | <code>string</code> | <code>&quot;#f48a42&quot;</code> | 标记颜色，期望十六进制值 |
| [markerSize] | <code>number</code> | <code>0</code> | 标记大小 |
| [markerSymbol] | <code>number</code> | <code>circle</code> | 标记符号 |
| [timeRange] | <code>string</code> |  | x 轴/时间轴的数据范围 |
| [dataRange] | <code>string</code> |  | y 轴/数据轴的数据范围 |
| [showAxis] | <code>string</code> |  | 显示或隐藏两个坐标轴 |
| [fixedScale] | <code>boolean</code> |  | 若为 false，当前视图缩放以适应仅显示的值；若给定，则覆盖 TimeSeries 的 fixedScale |

