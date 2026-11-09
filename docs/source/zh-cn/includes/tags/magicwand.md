### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| toName | <code>string</code> |  | 要标注的图像名称 |
| [opacity] | <code>float</code> | <code>0.6</code> | 使用过程中魔法棒区域的不透明度 |
| [blurradius] | <code>number</code> | <code>5</code> | 魔法棒区域的边缘会被模糊和简化，这是模糊核的半径 |
| [defaultthreshold] | <code>number</code> | <code>15</code> | 当用户最初点击而不拖动时，一个颜色需要距离初始选中的像素多远才会被一并选中 |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| original_width | <code>number</code> | 原始图像宽度（像素） |
| original_height | <code>number</code> | 原始图像高度（像素） |
| image_rotation | <code>number</code> | 图像旋转角度（度） |
| value | <code>Object</code> |  |
| value.format | <code>&quot;rle&quot;</code> | 掩码格式，目前仅支持 RLE |
| value.rle | <code>Array.&lt;number&gt;</code> | RLE 编码的图像 |

### 示例 JSON
```json
{
  "original_width": 1920,
  "original_height": 1280,
  "image_rotation": 0,
  "value": {
    "format": "rle",
    "rle": [0, 1, 1, 2, 3],
    "brushlabels": ["Car"]
  }
}
```

