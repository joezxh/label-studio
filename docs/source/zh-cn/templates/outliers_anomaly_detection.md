---
title: 离群值与异常检测
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 635
meta_title: 离群值与异常检测数据标注模板
meta_description: 用于使用 Label Studio 检测时间序列数据中离群值与异常的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/outliers-anomaly-detection.png" alt="" class="gif-border" width="552px" height="408px" />

如果你想训练一个机器学习模型来检测时间序列数据中的离群值与异常，请使用本模板来标注可疑区域，并将这些时间序列通道的区域分类为离群值或异常。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>

    <TimeSeries name="ts" valueType="url" value="$csv"
                sep=","
                timeColumn="time"
                timeFormat="%Y-%m-%d %H:%M:%S.%f"
                timeDisplayFormat="%Y-%m-%d"
                overviewChannels="velocity">

        <Channel column="velocity"
                 units="miles/h"
                 displayFormat=",.1f"
                 strokeColor="#1f77b4"
                 legend="Velocity"/>
    </TimeSeries>
    <TimeSeriesLabels name="label" toName="ts">
        <Label value="Region" background="red" />
    </TimeSeriesLabels>
  <Choices name="region_type" toName="ts"
        perRegion="true" required="true">
      <Choice value="Outlier"/>
      <Choice value="Anomaly"/>
  </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [TimeSeries](/tags/timeseries.html) 对象标签指定时间序列数据源。`valueType="url"` 参数指定时间序列数据以 URL 形式提供，而非文件，`value="$csv"` 参数指定该 URL 存储在一个名为 `csv` 的数据键中。`sep=","` 参数指定逗号作为数据分隔符，这是 CSV 格式文件的标准。`time` 参数指定哪一列包含时间数据、文件中时间数据的格式，以及如何在标注界面上显示时间数据。
```xml
 <TimeSeries name="ts" valueType="url" value="$csv"
                sep=","
                timeColumn="time"
                timeFormat="%Y-%m-%d %H:%M:%S.%f"
                timeDisplayFormat="%Y-%m-%d"
                overviewChannels="velocity">
        <Channel column="velocity"
                 units="miles/h"
                 displayFormat=",.1f"
                 strokeColor="#1f77b4"
                 legend="Velocity"/>
    </TimeSeries>
```
[TimeSeries](/tags/timeseries.html) 标签中的 `overviewChannels` 参数指定时间序列图中作为通道显示的时间序列数据列。然后你可以使用 Channel 标签及其参数提供关于数据的详细信息，例如数据的单位、使用 d3 格式的通道数据 `displayFormat`、高亮该通道时使用的 `strokeColor`，以及该通道在标注界面图例中应显示的名称。

使用 [TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签指定要应用于时间序列图中区域的标签：
```xml
<TimeSeriesLabels name="label" toName="ts">
        <Label value="Region" background="red" />
</TimeSeriesLabels>
```

使用 [Choices](/tags/choices.html) 控制标签来分类时间序列数据中每个特定区域究竟是离群值（Outlier）还是异常（Anomaly）：
```xml
<Choices name="region_type" toName="ts"
        perRegion="true" required="true">
      <Choice value="Outlier"/>
      <Choice value="Anomaly"/>
</Choices>
```

## 相关标签
- [TimeSeries](/tags/timeseries.html)
- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [Choices](/tags/choices.html)
