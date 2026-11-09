---
title: 时间序列分类
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 605
meta_title: 时间序列分类数据标注模板
meta_description: 使用 Label Studio 对时间序列数据进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates-misc/time-series-classification.png" alt="" class="gif-border" width="552px" height="546px" />

如果你需要训练一个对时间序列数据进行分类的机器学习模型，请使用本模板创建数据集。本模板提供了一种方式，让标注人员可以对整个时间序列信号图进行分类，也可以选择将图的特定部分分类为不同的活动类型。你可以结合使用这些分类方法，或仅使用其中一种。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <Header value="Time Series classification"
            style="font-weight: normal"/>
    <Choices name="pattern" toName="ts">
        <Choice value="Accelerating"/>
        <Choice value="Slowing"/>
    </Choices>
    <TimeSeriesLabels name="label" toName="ts">
        <Label value="Run"/>
        <Label value="Walk"/>
    </TimeSeriesLabels>
    <TimeSeries name="ts" value="$csv" valueType="url">
        <Channel column="first_column"/>
    </TimeSeries>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

你可以添加一个 [header](/tags/header.html) 来为标注人员提供说明：
```xml
<Header value="Time Series classification"
            style="font-weight: normal"/>
```
`style` 参数会覆盖 header 的默认样式，以显示常规字重而非加粗。

[Choices](/tags/choices.html) 控制标签让标注人员对整张时间序列图进行分类：
```xml
<Choices name="pattern" toName="ts">
    <Choice value="Accelerating"/>
    <Choice value="Slowing"/>
</Choices>
```

[TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签让标注人员将时间序列图的特定区域分类为特定活动：
```xml
<TimeSeriesLabels name="label" toName="ts">
    <Label value="Run"/>
    <Label value="Walk"/>
</TimeSeriesLabels>
```

[TimeSeries](/tags/timeseries.html) 对象标签指定了时间序列数据的位置：
```xml
<TimeSeries name="ts" value="$csv" valueType="url">
    <Channel column="first_column"/>
</TimeSeries>
```

## 相关标签
- [Header](/tags/header.html)
- [Choices](/tags/choices.html)
- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [TimeSeries](/tags/timeseries.html)

## 相关模板
- [时间序列标注](time_series.html)
