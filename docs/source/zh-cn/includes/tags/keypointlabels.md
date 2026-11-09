### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的图像名称 |
| [choice] | <code>single</code> \| <code>multiple</code> | <code>single</code> | 配置可以选择一个还是多个标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中一个标签最多可使用的次数 |
| [showInline] | <code>boolean</code> | <code>true</code> | 在同一行显示标签 |
| [opacity] | <code>float</code> | <code>0.9</code> | 关键点的不透明度 |
| [strokeWidth] | <code>number</code> | <code>1</code> | 描边宽度 |
| [snap] | <code>pixel</code> \| <code>none</code> | <code>none</code> | 将关键点吸附到图像像素 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| original_width | <code>number</code> | 原始图像宽度（像素） |
| original_height | <code>number</code> | 原始图像高度（像素） |
| image_rotation | <code>number</code> | 图像旋转角度（度） |
| value | <code>Object</code> |  |
| value.x | <code>number</code> | 按图像尺寸百分比表示的 x 坐标（0-100） |
| value.y | <code>number</code> | 按图像尺寸百分比表示的 y 坐标（0-100） |
| value.width | <code>number</code> | 按图像尺寸百分比表示的点大小（0-100） |

### 示例 JSON
```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "x": 3.1,
    "y": 8.2,
    "width": 2,
    "keypointlabels": ["Car"]
  }
}
```

