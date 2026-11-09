---
title: Change Point Detection
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 620
meta_title: 变点检测数据标注模板
meta_description: 使用 Label Studio 标注时间序列数据中变点检测的模板，用于你的机器学习和数据科学项目。
---

<img src="/images/templates/change-point-detection.png" alt="" class="gif-border" width="552px" height="408px" />

如果你需要查找时间序列数据中的突变，可使用此模板执行变点检测。在相关的时间序列通道上标注变化。 

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <TimeSeriesLabels name="label" toName="ts">
        <Label value="Change" background="red" />
    </TimeSeriesLabels>
    
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
</View>
```

## 关于标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签，让标注员能够标注时间序列图表上表示变化的区域：
```xml
    <TimeSeriesLabels name="label" toName="ts">
        <Label value="Change" background="red" />
    </TimeSeriesLabels>
```

使用 [TimeSeries](/tags/timeseries.html) 对象标签指定时间序列数据源。`valueType="url"` 参数指定时间序列数据以 URL 形式提供（而非文件），`value="$csv"` 参数指定该 URL 存储在名为 `csv` 的数据键中。`sep=","` 参数指定以逗号作为数据分隔符，这是 CSV 格式文件的标准做法。时间参数指定哪一列包含时间数据、文件中时间数据的格式，以及如何在标注界面上显示时间数据。 
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
[TimeSeries](/tags/timeseries.html) 标签中的 `overviewChannels` 参数指定时间序列数据中要在时间序列图表上作为通道显示的列。然后你可以使用 Channel 标签及其参数为数据提供详细信息，例如数据单位、使用 d3 格式的通道数据 `displayFormat`、高亮通道时使用的 `strokeColor`，以及该通道在标注界面图例中应显示的名称。

## 相关标签

- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [TimeSeries](/tags/timeseries.html)
- [Channel](/tags/timeseries.html)
