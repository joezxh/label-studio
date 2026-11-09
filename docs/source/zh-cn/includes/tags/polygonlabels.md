### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 标签名称 |
| toName | <code>string</code> |  | 要标注的图像名称 |
| [choice] | <code>single</code> \| <code>multiple</code> | <code>single</code> | 配置可以选择一个还是多个标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中一个标签最多可使用的次数 |
| [showInline] | <code>boolean</code> | <code>true</code> | 在同一行显示标签 |
| [opacity] | <code>number</code> | <code>0.2</code> | 多边形的不透明度 |
| [fillColor] | <code>string</code> |  | 多边形填充颜色（十六进制） |
| [strokeColor] | <code>string</code> |  | 描边颜色（十六进制） |
| [strokeWidth] | <code>number</code> | <code>1</code> | 描边宽度 |
| [pointSize] | <code>small</code> \| <code>medium</code> \| <code>large</code> | <code>medium</code> | 多边形控制点的大小 |
| [pointStyle] | <code>rectangle</code> \| <code>circle</code> | <code>rectangle</code> | 控制点的样式 |
| [snap] | <code>pixel</code> \| <code>none</code> | <code>none</code> | 将多边形吸附到图像像素 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| original_width | <code>number</code> | 原始图像宽度（像素） |
| original_height | <code>number</code> | 原始图像高度（像素） |
| image_rotation | <code>number</code> | 图像旋转角度（度） |
| value | <code>Object</code> |  |
| value.points | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | 多边形 (x, y) 坐标列表，按图像尺寸百分比表示（0-100） |

### 示例 JSON
```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "points": [[2, 2], [3.5, 8.1], [3.5, 12.6]],
    "polygonlabels": ["Car"]
  }
}
```

