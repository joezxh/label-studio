---
title: Number
type: tags
order: 414
meta_title: 用于数值分类的 Number 标签
meta_description: 使用 Number 标签自定义 Label Studio，为机器学习和数据科学项目中的任务进行数值分类。
---

Number 标签支持数值分类。可用于使用数字对任务进行分类。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）

{% insertmd zh-cn/includes/tags/number.md %}

### 示例

用于文本数值分类的基础标注配置

```html
<View>
  <Text name="txt" value="$text" />
  <Number name="number" toName="txt" max="10" />
</View>
```
