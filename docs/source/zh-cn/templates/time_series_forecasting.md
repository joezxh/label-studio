---
title: 时间序列预测
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 610
meta_title: 时间序列预测数据标注模板
meta_description: 使用 Label Studio 为预测场景准备时间序列数据的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/time-series-forecasting.png" alt="" class="gif-border" width="552px" height="408px" />

要训练一个对时间序列数据执行预测的机器学习模型，请使用本模板创建数据集。本模板提示标注人员高亮时间序列通道中可预测的区域区间，并将其标注为 "Regions"（区域），然后识别特定区域的趋势预测。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <Header value="Select predictable region spans in time series:"/>
    <TimeSeriesLabels name="predictable" toName="stock">
        <Label value="Regions" background="red" />
    </TimeSeriesLabels>

    <!-- 使用 TimeSeries 对象标签显示时间序列数据 -->
    <TimeSeries name="stock" valueType="url" value="$csv"
                sep=","
                timeColumn="time"
                timeFormat="%Y-%m-%d %H:%M:%S.%f"
                timeDisplayFormat="%Y-%m-%d"
                overviewChannels="value">
<!--使用 Channel 标签指定时间序列通道的名称与格式-->
        <Channel column="value"
                 displayFormat=",.1f"
                 strokeColor="#1f77b4"
                 legend="Stock Value"/>
    </TimeSeries>
    <Header value="Forecast next trend:"/>
    <!--使用 Choices 控制标签提示标注人员选择
    时间序列图的趋势-->
    <Choices name="trend_forecast" toName="stock">
        <Choice value="Up"/>
        <Choice value="Down"/>
        <Choice value="Steady"/>
    </Choices>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Select predictable region spans in time series:"/>
```

使用 [TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签来提供标注时间序列图特定区域的方式：
```xml
<TimeSeriesLabels name="predictable" toName="stock">
        <Label value="Regions" background="red" />
</TimeSeriesLabels>
```

使用 [TimeSeries](/tags/timeseries.html) 对象标签显示时间序列数据。`valueType="url"` 参数指定时间序列数据以 URL 形式提供（而非文件），`value="$csv"` 参数指定该 URL 存储在名为 `csv` 的数据键中。`sep=","` 参数指定逗号作为数据分隔符（这是 CSV 格式文件的标准做法）。时间参数指定了哪一列包含时间数据、文件中时间数据的格式，以及如何在标注界面上显示时间数据。
```xml
    <TimeSeries name="stock" valueType="url" value="$csv"
                sep=","
                timeColumn="time"
                timeFormat="%Y-%m-%d %H:%M:%S.%f"
                timeDisplayFormat="%Y-%m-%d"
                overviewChannels="value">
        <Channel column="value"
                 displayFormat=",.1f"
                 strokeColor="#1f77b4"
                 legend="Stock Value"/>
    </TimeSeries>
```
使用 Channel 标签指定时间序列通道的名称与显示格式（使用 d3 格式）。你可以使用 `legend` 参数来指定用于描述该通道的值。

使用 Choices 控制标签提示标注人员为整体时间序列图选择趋势：
```xml
    <Choices name="trend_forecast" toName="stock">
        <Choice value="Up"/>
        <Choice value="Down"/>
        <Choice value="Steady"/>
    </Choices>
```

## 相关标签

- [Header](/tags/header.html)
- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [TimeSeries](/tags/timeseries.html)
- [Choices](/tags/choices.html)
