### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 标签名称 |
| toName | <code>string</code> |  | 要标注的图像名称 |
| [choice] | <code>single</code> \| <code>multiple</code> | <code>single</code> | 配置可以选择一个还是多个标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中一个标签最多可使用的次数 |
| [showInline] | <code>boolean</code> | <code>true</code> | 在同一行显示标签 |
| [opacity] | <code>number</code> | <code>0.2</code> | 矢量的不透明度 |
| [fillColor] | <code>string</code> |  | 矢量填充颜色（十六进制） |
| [strokeColor] | <code>string</code> |  | 描边颜色（十六进制） |
| [strokeWidth] | <code>number</code> | <code>1</code> | 描边宽度 |
| [pointSize] | <code>small</code> \| <code>medium</code> \| <code>large</code> | <code>medium</code> | 矢量控制点的大小 |
| [pointStyle] | <code>rectangle</code> \| <code>circle</code> | <code>rectangle</code> | 控制点的样式 |
| [snap] | <code>pixel</code> \| <code>none</code> | <code>none</code> | 将矢量吸附到图像像素 |
| [closable] | <code>boolean</code> | <code>false</code> | 允许闭合形状 |
| [curves] | <code>boolean</code> | <code>false</code> | 允许贝塞尔曲线 |
| [skeleton] | <code>boolean</code> | <code>false</code> | 启用骨架模式以允许分支路径 |
| [minPoints] | <code>number</code> \| <code>none</code> | <code>none</code> | 允许的最小点数 |
| [maxPoints] | <code>number</code> \| <code>none</code> | <code>none</code> | 允许的最大点数 |
| [pointsizeenabled] | <code>number</code> | <code>5</code> | 形状被选中时点的像素大小 |
| [pointsizedisabled] | <code>number</code> | <code>5</code> | 形状未被选中时点的像素大小 |

