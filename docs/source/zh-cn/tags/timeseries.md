---
title: TimeSeries
type: tags
order: 310
meta_title: 用于时间序列数据的 TimeSeries 标签
meta_description: 使用 TimeSeries 标签自定义 Label Studio，为机器学习和数据科学项目标注时间序列数据。
---

`TimeSeries` 标签可用于标注时间序列数据。有关时间序列标注的更多信息，请参阅 [时间序列模板页面](../templates/time_series.html)。

注意：你的数据中的时间轴必须已排序，否则 TimeSeries 标签无法工作。
若要使用自动生成的索引作为时间轴，请勿使用 `timeColumn` 参数。

与以下数据类型配合使用：time series（时间序列）。

{% insertmd zh-cn/includes/tags/timeseries.md %}

## Channel

Channel 标签可用于标注时间序列数据

{% insertmd zh-cn/includes/tags/channel.md %}

### 示例

用于标注存储在从 URL 加载的 CSV 中的时间序列数据的标注配置，该 CSV 包含 3 列：time、sensor1 和 sensor2。time 列以数字形式存储时间。

```html
<View>
  <TimeSeries name="device" value="$timeseries" valueType="url" timeColumn="time">
     <Channel column="sensor1" />
     <Channel column="sensor2" />
  </TimeSeries>
  <TimeSeriesLabels name="label" toName="device">
    <Label value="Run" background="#5b5"/>
    <Label value="Walk" background="#55f"/>
  </TimeSeriesLabels>
</View>
```
### 示例

用于标注存储在 Label Studio JSON 格式的任务字段 `ts` 中的时间序列数据的标注配置。时间字段以 `timeformat` 字段中的日期形式存储，并在图表上以完整日期格式显示（默认）。

```html
<View>
  <TimeSeries name="device" value="$ts" timeColumn="time" timeFormat="%m/%d/%Y %H:%M:%S">
     <Channel column="sensor1" />
     <Channel column="sensor2" />
  </TimeSeries>
</View>
```

## MultiChannel

`MultiChannel` 标签用于在时间序列可视化中将多个通道组合在一起。在 `TimeSeries` 标签内部使用此标签，以在单一视图中组织和显示多个数据通道。

{% insertmd zh-cn/includes/tags/multichannel.md %}

### 示例

将多个通道组合在一起的时间序列数据标注配置：

```html
<View>
  <TimeSeries name="ts" value="$timeseries" 
			  valuetype="url"
              timeColumn="time"
              timeFormat="%Y-%m-%d %H:%M:%S.%f"
              >
    
	<MultiChannel>
      <Channel column="velocity" />
      <Channel column="acceleration" />
    </MultiChannel>

  </TimeSeries>

  <TimeSeriesLabels name="label" toName="ts">
    <Label value="Run" background="red"/>
    <Label value="Walk" background="green"/>
  </TimeSeriesLabels>
</View>

<!-- {
  "timeseries": "https://app.heartex.ai/samples/time-series.csv?time=time&values=velocity%2Cacceleration&tf=%25Y-%25m-%25d+%25H%3A%25M%3A%25S.%25f&type=csv"
} -->
```
