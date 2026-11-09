---
title: TimeSeriesLabels
type: tags
order: 428
meta_title: 用于标注时间序列数据的 Time Series Label 标签
meta_description: 使用 TimeSeriesLabel 标签自定义 Label Studio，为机器学习和数据科学项目标注时间序列数据。
---

`TimeSeriesLabels` 标签用于创建带标签的时间范围。

与以下数据类型配合使用：time series（时间序列）。

{% insertmd zh-cn/includes/tags/timeserieslabels.md %}

### 示例

用于为单通道时间序列的已识别区域应用标签的基础标注配置

```html
<View>
  <TimeSeriesLabels name="label" toName="ts">
      <Label value="Run"/>
      <Label value="Walk"/>
  </TimeSeriesLabels>

  <TimeSeries name="ts" value="$csv" valueType="url">
     <Channel column="first_column"/>
  </TimeSeries>
</View>
```
