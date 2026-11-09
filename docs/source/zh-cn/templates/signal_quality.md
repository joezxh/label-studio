---
title: 信号质量
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 630
meta_title: 信号质量数据标注模板
meta_description: 用于使用 Label Studio 对时间序列中的信号质量进行分类的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/signal-quality.png" alt="" class="gif-border" width="552px" height="408px" />

识别时间序列上的区域，并对信号的质量进行评分和分类。

## 交互式模板预览

<div id="main-preview"></div>

## 标注配置

```html
<View>
    <View visibleWhen="no-region-selected"
          style="height:120px">
        <TimeSeriesLabels name="label" toName="ts">
            <Label value="Region" background="#5b5"/>
        </TimeSeriesLabels>
    </View>
    
    <View visibleWhen="region-selected" style="height:120px">
        <Rating name="rating" toName="ts"
                maxRating="10" icon="star"
                perRegion="true"/>
        <Choices name="choices" toName="ts"
                 showInline="true" required="true"
                 perRegion="true">
            <Choice value="Good"/>
            <Choice value="Medium"/>
            <Choice value="Poor"/>
        </Choices>
    </View>
    <TimeSeries name="ts" valueType="url" value="$csv"
                sep="," timeColumn="time">
        <Channel column="signal_1"
                 strokeColor="#17b" legend="Signal 1"/>
        <Channel column="signal_2"
                 strokeColor="#f70" legend="Signal 2"/>
    </TimeSeries>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

将 [View](/tags/view.html) 标签的 `visibleWhen` 参数配合使用，以创建一个仅在未选中任何区域时可见的标注配置区块：
```xml
<View visibleWhen="no-region-selected"
          style="height:120px">
``` 

当标注界面的该区块可见时，标注人员可以使用 [TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签来标注时间序列数据上的特定区域：
```xml
        <TimeSeriesLabels name="label" toName="ts">
            <Label value="Region" background="#5b5"/>
        </TimeSeriesLabels>
    </View>
```

使用另一个 [View](/tags/view.html) 标签的 `visibleWhen` 参数，来创建一个仅在选中某个区域时可见的标注界面区块：
```xml
<View visibleWhen="region-selected" style="height:120px">
```

当标注界面的该区块可见时，标注人员可以使用 [Rating](/tags/rating.html) 控制标签为所选区域选择 10 星评分：
```xml
<Rating name="rating" toName="ts"
                maxRating="10" icon="star"
                perRegion="true"/>
```
`perRegion="true"` 参数表示此评分仅适用于所选区域。

仍在该区域特定的标注界面区块内，标注人员可以使用 [Choices](/tags/choices.html) 控制标签为所选区域选择一个选项：
```xml
        <Choices name="choices" toName="ts"
                 showInline="true" required="true"
                 perRegion="true">
            <Choice value="Good"/>
            <Choice value="Medium"/>
            <Choice value="Poor"/>
        </Choices>
    </View>
```

使用 [TimeSeries](/tags/timeseries.html) 对象标签和 Channel 标签，向标注人员显示时间序列数据及通道：
```xml
    <TimeSeries name="ts" valueType="url" value="$csv"
                sep="," timeColumn="time">
        <Channel column="signal_1"
                 strokeColor="#17b" legend="Signal 1"/>
        <Channel column="signal_2"
                 strokeColor="#f70" legend="Signal 2"/>
    </TimeSeries>
```

## 相关标签

- [View](/tags/view.html)
- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [Rating](/tags/rating.html)
- [Choices](/tags/choices.html)
- [TimeSeries](/tags/timeseries.html)
