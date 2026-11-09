### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 包含图像路径或 URL 的数据字段 |
| [valueList] | <code>string</code> |  | 引用一个保存图像 URL 列表的变量。示例见 [多页文档标注](/templates/multi-page-document-annotation) 模板。 |
| [smoothing] | <code>boolean</code> |  | 启用平滑，默认使用用户设置 |
| [width] | <code>string</code> | <code>&quot;100%&quot;</code> | 图像宽度 |
| [maxWidth] | <code>string</code> | <code>&quot;750px&quot;</code> | 图像最大宽度 |
| [zoom] | <code>boolean</code> | <code>false</code> | 启用通过鼠标滚轮缩放图像 |
| [negativeZoom] | <code>boolean</code> | <code>false</code> | 启用缩小图像 |
| [zoomBy] | <code>float</code> | <code>1.1</code> | 缩放系数 |
| [grid] | <code>boolean</code> | <code>false</code> | 是否显示网格 |
| [gridSize] | <code>number</code> | <code>30</code> | 指定网格大小 |
| [gridColor] | <code>string</code> | <code>&quot;#EEEEF4&quot;</code> | 网格的十六进制颜色，不透明度为 0.15 |
| [zoomControl] | <code>boolean</code> | <code>false</code> | 在工具栏中显示缩放控件 |
| [brightnessControl] | <code>boolean</code> | <code>false</code> | 在工具栏中显示亮度控件 |
| [contrastControl] | <code>boolean</code> | <code>false</code> | 在工具栏中显示对比度控件 |
| [rotateControl] | <code>boolean</code> | <code>false</code> | 在工具栏中显示旋转控件 |
| [crosshair] | <code>boolean</code> | <code>false</code> | 显示十字光标 |
| [horizontalAlignment] | <code>left</code> \| <code>center</code> \| <code>right</code> | <code>left</code> | 图像水平对齐的位置。可以是 "left"、"center" 或 "right" |
| [verticalAlignment] | <code>top</code> \| <code>center</code> \| <code>bottom</code> | <code>top</code> | 图像垂直对齐的位置。可以是 "top"、"center" 或 "bottom" |
| [defaultZoom] | <code>auto</code> \| <code>original</code> \| <code>fit</code> | <code>fit</code> | 指定图像在视口中的初始缩放比例（保持宽高比）。可以是 "auto"、"original" 或 "fit" |
| [crossOrigin] | <code>none</code> \| <code>anonymous</code> \| <code>use-credentials</code> | <code>none</code> | 配置此图像的 CORS 跨域行为，可选 "none"、"anonymous" 或 "use-credentials"，类似于 [DOM `img` crossOrigin 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin)。 |

