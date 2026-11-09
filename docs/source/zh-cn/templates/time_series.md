---
title: 时间序列标注
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 601
meta_title: 时间序列数据标注模板
meta_description: 使用 Label Studio 为单变量与多变量时间序列数据打标签的模板，适用于你的机器学习和数据科学项目。
---

<img src="/images/templates/time-series-forecasting.png" alt="" class="gif-border" width="552px" height="408px" />

使用这个通用模板标注任意类型的时间序列数据。

## 交互式模板预览

<div id="main-preview"></div>

<!--需要修复这个预览，因为它会预览本页上所有的配置，糟糕-->

## 标注配置

多变量时间序列标注的示例项目配置：

```html
<View>
  <TimeSeriesLabels name="label" toName="ts">
    <Label value="Run"/>
    <Label value="Walk"/>
  </TimeSeriesLabels> 
  <TimeSeries name="ts" valueType="url" value="$csv_url" timeColumn="time">
    <Channel column="sensorone" />
    <Channel column="sensortwo" />
  </TimeSeries>
</View>
```

## 关于此标注配置

所有标注配置都必须包裹在 [View](/tags/view.html) 标签中。

使用 [TimeSeriesLabels](/tags/timeserieslabels.html) 控制标签高亮并标注时间序列图的特定区间：
```xml
<TimeSeriesLabels name="label" toName="ts">
    <Label value="Run"/>
    <Label value="Walk"/>
</TimeSeriesLabels> 
```
该标签通过 `toName` 参数与 [TimeSeries](/tags/timeseries.html) 对象标签关联。

使用 [TimeSeries](/tags/timeseries.html) 对象标签显示时间序列数据及通道：
```xml
<TimeSeries name="ts" valueType="url" value="$csv_url" timeColumn="time">
    <Channel column="sensorone" />
    <Channel column="sensortwo" />
</TimeSeries>
```
`valueType="url"` 参数表示 Label Studio 期望在 JSON 格式任务中提供 CSV 文件的链接。`timeColumn` 参数指定数据集中用作时间 X 轴的列。如果不指定 `timeColumn`，Label Studio 会使用递增的整数值作为 X 轴：`0, 1, 2, ...`。

### 输入数据

上述标注配置的示例 CSV 文件输入如下所示：

```csv
time,sensorone,sensortwo
0,10,20
1,20,30
2,30,40
```

## 相关标签
- [TimeSeriesLabels](/tags/timeserieslabels.html)
- [TimeSeries](/tags/timeseries.html)
- [Channel](/tags/timeseries.html#Channel)

## 输入格式

Label Studio 支持多种时间序列输入类型：

- 带或不带表头的 CSV
- 带或不带表头的 TSV
- JSON

### CSV 示例

例如，对于一个包含 3 列的 CSV 文件：

```csv
time,sensorone,sensortwo
0.0,3.86,0.00
0.1,2.05,2.11
0.2,1.64,5.85
 ```

然后，创建一个引用 CSV 文件 URL 的 JSON 文件，以上传到 Label Studio：
```json
[ { "data": { "csv_url": "http://example.com/path/to/file.csv" } } ]
```

由于 JSON 文件引用了一个 URL，且该 URL 位于名为 `csv_url` 的字段中，请在标注配置中如下设置 TimeSeries 对象标签：
```html
<TimeSeries name="ts" valueType="url" value="$csv_url" sep="," timeColumn="time">
    <Channel column="sensorone" />
</TimeSeries>
```
在此例中，`<TimeSeries>` 标签带有 `valueType="url"` 属性，因为 CSV 文件是通过 URL 引用的。参见 [如何导入你的数据](/guide/tasks.html#How-to-import-your-data)。

### TSV 示例

如果你上传的是制表符分隔的文件，请使用 `TimeSeries` 标签上的 `sep` 属性来指定制表符分隔。

例如，在标注配置中如下设置 TimeSeries 对象标签：
```html
<TimeSeries name="ts" valueType="url" value="$csv_url" sep="\t" timeColumn="time">
    <Channel column="0"/>
</TimeSeries>
```

### 无表头的 CSV 与 TSV

无表头 CSV/TSV 用法的主要区别在于命名 `<Channel>` 列的另一种方式。由于文件没有表头且列名未知，请改用列索引。例如，要将第一列用作时间列，请指定 `<TimeSeries timeColumn="0" ... >`。 `<Channel>` 标签中的 `column` 属性同理。

### JSON

Label Studio 中的所有任务都以 JSON 存储，这也是 Label Studio 的原生格式。

- `valueType="url"`

  当你为 TimeSeries 标签使用 `valueType="url"` 并导入一个 CSV 文件时，Label Studio 会自动创建一个形如以下示例的 JSON 任务：
  
  ```json
  {
    "csv": "http://localhost:8080/data/upload/my-import-file.csv"
  }
  ```

- `valueType="json"`
  
  你也可以直接使用 Label Studio 的 JSON 格式，创建并导入结构如下的 JSON，其中每个键指定了时间与通道：

  ```json
  {
    "ts": {
      "time": [
        15.97, 15.85, 25.94
      ],
      "sensorone": [
        13.86, 29.05, 64.90
      ],
      "sensortwo": [
        21.00, 15.18, 35.85
      ]
    }
  }
  ```

## 输出格式示例

标注人员为时间序列任务添加标签。Label Studio 使用 JSON 结构来表示每次完成的标注。每个标注都有一个 `result` 字段，对于时间序列标注项目，其形式如下示例：

```json
{
  "annotations": [{  
    "result": [
      {
          "value": {
              "start": 1592250751951.8074,
              "end": 1592251071946.638,
              "instant": false,
              "timeserieslabels": [
                  "Run"
              ]
          },
          "id": "S1DkU7FSku",
          "from_name": "label",
          "to_name": "ts",
          "type": "timeserieslabels"
      },
      {
          "value": {
              "start": 1592251231975.601,
              "end": 1592251461993.5276,
              "instant": false,
              "timeserieslabels": [
                  "Run"
              ]
          },
          "id": "XvagJo87mr",
          "from_name": "label",
          "to_name": "ts",
          "type": "timeserieslabels"
      }
    ]
  }] 
}
```

## 增强此模板

如果你想增强此模板，可以对标签配置进行若干修改。

### 在一个项目中使用多个时间序列

如果你想在一个项目中使用多个时间序列数据集，必须将你的 CSV 文件以 URL 形式提供，并导入一个 JSON 格式的文件，其中的任务引用这些 CSV 文件。

例如，对于一个可以引用两组时间序列数据的任务：

```json
[ { "data": { "csv_file1": "http://example.com/path/file1.csv", "csv_file2": "http://example.com/path/file2.csv" } } ]
```

然后你可以设置如下标注配置，以引用每个 CSV 文件，并能在同一个标注界面中对它们进行标注：
```html
<View>
  <Header value="First time series" />
  <TimeSeriesLabels name="lbl-1" toName="ts-1">
    <Label value="Label 1" />
  </TimeSeriesLabels>
  <TimeSeries name="ts-1" timeColumn="0" value="$csv_file1">
    <Channel column="1" />
  </TimeSeries>
	
  <Header value="Second time series" />
  <TimeSeriesLabels name="lbl-2" toName="ts-2">
    <Label value="Label 2" />
  </TimeSeriesLabels>
  <TimeSeries name="ts-2" timeColumn="0" value="$csv_file2">
    <Channel column="1" />
  </TimeSeries>
</View>
```
[TimeSeries](/tags/timeseries.html) 标签中的 `value` 参数用于引用包含 CSV 文件 URL 的 JSON 键。
