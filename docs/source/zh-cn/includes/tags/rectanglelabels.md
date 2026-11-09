### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的图像名称 |
| [choice] | <code>single</code> \| <code>multiple</code> | <code>single</code> | 配置可以选择一个还是多个标签 |
| [maxUsages] | <code>number</code> |  | 每个任务中一个标签最多可使用的次数 |
| [showInline] | <code>boolean</code> | <code>true</code> | 在同一行显示标签 |
| [opacity] | <code>float</code> | <code>0.6</code> | 矩形的不透明度 |
| [fillColor] | <code>string</code> |  | 矩形填充颜色（十六进制） |
| [strokeColor] | <code>string</code> |  | 描边颜色（十六进制） |
| [strokeWidth] | <code>number</code> | <code>1</code> | 描边宽度 |
| [canRotate] | <code>boolean</code> | <code>true</code> | 是否显示或隐藏旋转控件。请注意，结果中的锚点与使用旋转工具旋转时所用的锚点不同。更多信息，请参阅 [旋转](/templates/image_bbox#Rotation)。 |
| [snap] | <code>pixel</code> \| <code>none</code> | <code>none</code> | 将矩形吸附到图像像素 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| original_width | <code>number</code> | 原始图像宽度（像素） |
| original_height | <code>number</code> | 原始图像高度（像素） |
| image_rotation | <code>number</code> | 图像旋转角度（度） |
| value | <code>Object</code> |  |
| value.x | <code>number</code> | 旋转前左上角的 x 坐标（0-100） |
| value.y | <code>number</code> | 旋转前左上角的 y 坐标（0-100） |
| value.width | <code>number</code> | 边界框宽度（0-100） |
| value.height | <code>number</code> | 边界框高度（0-100） |
| value.rotation | <code>number</code> | 边界框旋转角度（度） |

### 示例 JSON
```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "x": 3.1,
    "y": 8.2,
    "width": 20,
    "height": 16,
    "rectanglelabels": ["Car"]
  }
}
```

