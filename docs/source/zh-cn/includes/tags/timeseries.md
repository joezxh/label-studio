### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 用于查找数据的键，若 valueType=url 则为时间序列的 URL，否则期望 JSON |
| [valueType] | <code>url</code> \| <code>json</code> | <code>url</code> | 所提供的时间序列数据的格式。若设为 "url"，则 Label Studio 加载 `value` 键内的引用值，否则期望 JSON。 |
| [sync] | <code>string</code> |  | 要同步的对象名称。 |
| [cursorColor] | <code>string</code> |  | 同步中使用的播放光标颜色（十六进制或任何 SVG 兼容的颜色字符串） |
| [timeColumn] | <code>string</code> |  | 提供时间值的列名或索引。如果你的时间序列数据没有时间列，则会自动生成一个。 |
| [timeFormat] | <code>string</code> |  | 用于解析 timeColumn 内值的模式，解析由 d3 提供，遵循 `strftime` 实现 |
| [timeDisplayFormat] | <code>string</code> |  | 用于显示时间值的格式。可以是数字或日期。如果时间列是日期，使用 strftime 格式化；如果是数字，使用 [d3 number](https://github.com/d3/d3-format#locale_format) 格式。 |
| [durationDisplayFormat] | <code>string</code> |  | 用于显示笔刷范围的时间时长值的格式。如果时间列是日期，使用 strftime 格式化；如果是数字，使用 [d3 number](https://github.com/d3/d3-format#locale_format) 格式。 |
| [sep] | <code>string</code> | <code>&quot;,&quot;</code> | CSV 文件的分隔符。 |
| [overviewChannels] | <code>string</code> |  | 在概览中显示的通道名称或索引（逗号分隔）。 |
| [overviewWidth] | <code>string</code> | <code>&quot;25%&quot;</code> | 概览窗口的默认宽度（百分比） |
| [fixedScale] | <code>boolean</code> | <code>false</code> | 是否将 y 轴缩放到最大值以适配所有值。若为 false，当前视图仅缩放以适配显示的值。 |

