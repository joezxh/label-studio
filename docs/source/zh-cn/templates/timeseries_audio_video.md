---
title: 带音视频同步的时间序列标注
type: templates
category: Time Series Analysis
cat: time-series-analysis
order: 615
meta_title: 时间序列 + 音频 + 视频数据标注模板
meta_description: 用于时间序列与音频、视频同步的模板。
---

<img src="/images/templates/timeseries_audio_video.png" alt="" class="gif-border" width="552px" height="408px" />

本模板通过将音频或视频帧映射到相应的时间序列时间戳，演示了媒体流与对应传感器数据的同步。例如：

<video src="https://htx-pub.s3.us-east-1.amazonaws.com/docs/timeseries-video-audio-sync.mp4" controls style="max-width:800px" />

!!! note
    **要求：** Label Studio >= 1.20

### 时间单位与同步

所有同步消息均使用相对于每个组件起始位置的相对秒数。

有两种类型的配置，你所使用的配置决定了时间序列如何转换相对秒数：

- **基于时间（Time-based）**：转换为绝对时间戳
- **基于索引（Index-based）**：将相对秒数用作索引


## 处理长度、时长、采样率和帧率不匹配的问题

**时间序列长度与视频时长**

你的数据可能存在长度不匹配的情况。发生这种情况时：

- 同步会持续至较短组件的末尾。
- 各组件会在各自末尾停止；但长度/时长更长的其他组件可以继续播放。

**时间序列采样率与视频帧率**

!!! attention
    为你的视频设置 `frameRate` 极其重要。否则，时间序列与视频之间的标注同步将出现错误。
  
我们建议使用这些脚本来转换你的视频：https://labelstud.io/tags/video#Video-format。

此外，建议为时间序列、音频和视频中的采样率与帧率使用整数倍关系。这种方法可以简化样本与帧的对齐，并允许在不同媒体源之间平滑导航。例如，如果视频帧率为 _30 帧每秒_，那么时间序列使用 _60（或 90、120……）个样本每秒_ 会很有帮助。


## 基于时间的时间序列

* 与视频、音频及其他时间序列保持精确的时间对齐
* 将相对秒数转换为绝对时间戳。
* **偏移行为：** 时间序列中的第一个时间戳对于每个已同步的媒体都被视为 *t = 0*。例如，如果 CSV 中最早样本位于绝对 5 秒处，那么：
    - `timeSeries[0]` = **5 秒**（绝对）→ 在同步空间中被视为 **0 秒**。
    - 当你在时间序列上点击 2 秒时，视频将跳转至真实视频时间的 *5 秒 + 2 秒 = 7 秒*。
    - 反之，将视频跳转到 0 秒会将播放头定位到第一个时间序列样本（绝对 5 秒）。
    - 这个恒定的偏移会在各个方向（跳转 / 播放 / 暂停）上应用，并且无论原始时钟如何偏移，都能保证完美对齐。

要指定基于时间的时间序列，请使用以下格式：

```xml
   <TimeSeries name="ts" timeColumn="timestamp" timeFormat="%Y-%m-%d %H:%M:%S">
```

**在以下情况使用基于时间的时间序列：**

- 数据具有实际时间戳。
- 需要精确的时间对齐。
- 正在处理多种媒体类型。

#### 标注配置

* 基于时间的时间序列（Time-based TimeSeries）
* 多个时间序列、音频和视频被同步在一起
* 使用 TimeSeriesLabels 作为标注用的控制标签

```html
<View>
  <Video name="video" value="$video" frameRate="30" sync="group_a"/>
  <!-- <Audio name="audio" value="$video" sync="group_a"/> -->
  
  <TimeSeriesLabels name="timelinelabels" toName="accel_timeseries">
    <Label value="A"/>
    <Label value="B"/>
  </TimeSeriesLabels>  

  <TimeSeries 
              name="accel_timeseries"
              value="$accel_data"
              sync="group_a"
              timeColumn="time"
              timeFormat="%H:%M:%S.%f"
              timeDisplayFormat="%H:%M:%S.%f"
              overviewWidth="10%"
              fixedScale="true"
  >
    <MultiChannel>
      <Channel column="accel_x" strokeColor="#FF0000" height="100"/>
      <Channel column="accel_y" strokeColor="#00FF00" height="100"/>
    </MultiChannel>
  </TimeSeries>
  
  <TimeSeries 
              name="gyro_timeseries" 
              value="$gyro_data" 
              sync="group_a"
              timeColumn="time"
              timeFormat="%H:%M:%S.%f"
              timeDisplayFormat="%H:%M:%S.%f"
              overviewWidth="10%"
              fixedScale="true"
  >
    <Channel column="gyro_x" strokeColor="#0000FF" height="100"/>
    <Channel column="gyro_y" strokeColor="#FF00FF" height="100"/>
  </TimeSeries> 

</View>

<!-- {
  "video": "https://app.heartex.ai/static/samples/opossum_snow.mp4",
  "accel_data": "https://app.humansignal.com/samples/time-series.csv?time=time&values=accel_x%2Caccel_y&sep=%2C&tf=%H:%M:%S.%f",
  "gyro_data": "https://app.humansignal.com/samples/time-series.csv?time=time&values=gyro_x%2Cgyro_y&sep=%2C&tf=%H:%M:%S.%f"
}
-->
```

{% details <b>accel_x、accel_y 的 time-series-accel.csv 示例</b> %}

```csv
time,accel_x,accel_y
00:01:01.000000,-0.056646571671882806,2.1066649495524605
00:01:02.000000,-0.6888765232989033,0.35646668995794306
00:01:03.000000,-0.23512086306647553,0.5799351613084716
00:01:04.000000,-0.9314772647682944,-0.5195693066279311
00:01:05.000000,1.321119143958512,-0.622026749003922
00:01:06.000000,0.10592100887528152,0.15477501359739493
00:01:07.000000,-0.6261150686384155,0.5624264458111049
00:01:08.000000,1.0829322997587332,-1.9590268928992862
00:01:09.000000,-1.2267135177322928,-0.4538764395229617
00:01:10.000000,1.6705781810127622,0.38407182850093363
```

{% enddetails %}

{% details <b>gyro_x、gyro_y 的 time-series-gyro.csv 示例</b> %}

```csv
time,gyro_x,gyro_y
00:01:01.000000,-0.776563940219835,-1.1115451852904443
00:01:02.000000,0.17111212343134966,-1.377696478819913
00:01:03.000000,-1.168085910547026,-0.8500307427257534
00:01:04.000000,-0.13947878605597916,0.9062482653127198
00:01:05.000000,0.3079887618179474,-1.6722497873634719
00:01:06.000000,-0.3825838786476411,-1.242585234780504
00:01:07.000000,-0.7015245817392025,-1.712515499827561
00:01:08.000000,-0.3437952109000775,-0.9337512501019165
00:01:09.000000,-0.19464021971045084,-0.9653381620475747
00:01:10.000000,-0.29753925483100785,-0.7699832734123578
```

{% enddetails %}


## 基于索引的时间序列

- 使用直接的索引作为相对秒数
- 媒体中的每一秒 = 时间序列中的一个索引，采样率始终为 1 Hz
- 主要适用于调试和测试
- 示例：视频中的 30 秒 = 时间序列中的索引 30

要指定基于索引的时间序列，请使用以下格式：

```xml
   <TimeSeries name="ts">
```

**在以下情况使用基于索引的时间序列：**
- 数据是顺序性的。
- 没有实际的时间戳可用。
- 媒体时间与简单的 1 样本 <=> 1 秒映射即可满足需求。


#### 标注配置

<br>

{% details <b>基于索引的时间序列（X 轴无时间戳）</b> %}

* 基于索引的时间序列 + 视频 + TimeSeriesLabels
* 由于 `TimeSeries` 标签中未指定时间轴，一个值等于一秒。视频正是基于这一思路进行同步的——如果不提供时间戳，则一个样本等于一秒。


```html
<View>
  <Video name="video" value="$video" frameRate="30" sync="group_a"/>
  
  <TimeSeries name="timeseries"
              value="$ts" valueType="json"
              sync="group_a" sep=","
              overviewWidth="10%"
              fixedScale="true"
              >
    <Channel column="value" strokeColor="#FF0000"/>
    <Channel column="value" strokeColor="#00FF00"/>
  </TimeSeries>
  
  <TimeSeriesLabels name="labels" toName="timeseries">
    <Label value="action"/>
    <Label value="pause"/>
  </TimeSeriesLabels>

</View>

<!-- {
  "video": "https://app.heartex.ai/static/samples/opossum_snow.mp4",
  "ts": {
      "value": [
        10.7036820361892644,
        -0.18120536109567212,
        -0.39251488391214157,
        1.3384817293995075,
        0.8779675446349394,
        -0.1511946071051955,
        -0.7955547028255082,
        1.0736798948078534,
        1.1266164855584428,
        -0.440291574562604,
        -0.8436786901744359,
        -0.24956239687939094,
        1.268049926141147,
        0.6300808834120004,
        1.7946935071842107,
        -0.37700464705843,
        0.706518542026297,
        -0.45787451607104046,
        -2.3643354623876607,
        0.13984274721398307,
        0.3174445171792305,
        -1.8162371732091722,
        -0.30289394872251374,
        -0.730112449190387,
        -1.6852497246079239,
        -1.0473893262227658,
        0.10416951356137397,
        -2.0266185534759633,
        -0.05196549263706541,
        0.4436085233243668,
        -0.0956064205420074,
        -1.1790065141112944,
        -0.015063840978932763,
        0.28691755509866407,
        1.4122332721986657,
        0.40127732957527523,
        1.546243544663401,
        0.11119508061291504,
        -0.499517691828469,
        -0.02922576888373752,
        -0.8454178734108769,
        0.19122400060485445,
        0.6914340334390281,
        -0.18047241277757645,
        -0.6394589243120249,
        1.0019886671810008
      ]
  }
} -->
```

{% enddetails %}
