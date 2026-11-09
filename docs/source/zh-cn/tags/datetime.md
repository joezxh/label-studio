---
title: DateTime
type: tags
order: 405
---

DateTime 标签为标注界面添加日期和时间选择功能。使用此标签可在标注中添加日期、时间戳、月份或年份。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraph（段落）、text（文本）、time series（时间序列）、video（视频）

{% insertmd zh-cn/includes/tags/datetime.md %}

### 示例
```html
<View>
  <Text name="txt" value="$text" />
  <DateTime name="datetime" toName="txt" only="date" />
</View>
```
