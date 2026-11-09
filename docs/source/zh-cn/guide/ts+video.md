---
title: Time series and Video or Audio
short: Time series and Video or Audio
meta_title: Time series video audio labeling 
---

!!! note
    - 此功能不受官方支持，属于实验性，并且设置方式比较棘手。
    - 要使用音频而不是视频，你应该将 `.mp4` 文件替换为 mp3/wav/其他浏览器支持的音频格式。
    - 此方法适用于 Label Studio **1.4.1 及更低版本**。

## 此方法已弃用

此方法已完全弃用。

在 Label Studio 1.20 中，我们引入了一种新的方式来同步时间序列与视频和音频。请参阅更多详细信息：
https://labelstud.io/templates/timeseries_audio_video

## 第 1 步：媒体托管

你必须将你的 CSV 和 MP4（或浏览器支持的其他视频格式）托管在某处。你可以使用 S3 或其他云。如果你想从硬盘托管数据，请使用 [Label Studio 本地存储](http://localhost:4000/guide/storage.html#Local-storage)。

作为此步骤的结果，你将有两个 URL：一个用于 CSV，一个用于视频。例如，
```
http://localhost:8080/samples/time-series.csv?time=time_column&values=first_column
http://localhost:8080/static/samples/opossum_snow.mp4
```

## 第 2 步：带有示例任务数据的标注配置

将此标注配置复制到你的项目。

```
<View>
  <TimeSeriesLabels name="label" toName="ts">
    <Label value="Run"/>
    <Label value="Walk"/>
  </TimeSeriesLabels>
  <HyperText name="video" value="$video" inline="true"/>
  <TimeSeries name="ts" value="$csv" valueType="url" timeColumn="time_column">
    <Channel column="first_column"/>
  </TimeSeries>
</View>

<!-- {
    "csv": "/samples/time-series.csv?time=time_column&values=first_column",
    "video": "<video src='/static/samples/opossum_snow.mp4' width='100%' controls onloadeddata=\"setTimeout(function(){ts=Htx.annotationStore.selected.names.get('ts');t=ts.data.time_column;v=document.getElementsByTagName('video')[0];w=parseInt(t.length*(5/v.duration));l=t.length-w;ts.updateTR([t[0], t[w]], 1.001);r=$=>
ts.brushRange.map(n=>(+n).toFixed(2));_=r();setInterval($=>r().some((n,i)=>n!==_[i])&&(_=r())&&(v.currentTime=v.duration*(r()[0]-t[0])/(t.slice(-1)[0]-t[0]-(r()[1]-r()[0]))),300); console.log('video is loaded, starting to sync with time series')}, 3000); \" />"
  } -->
```

## 第 3 步：准备并导入任务

!!! note
    这是最重要的一步，因为主要技巧在于任务数据，它使用了 JavaScript 注入。

将此代码保存到 `import.json`，然后将此文件导入 LS。
```
{
    "csv": "/samples/time-series.csv?time=time_column&values=first_column",
    "video": "<video src='/static/samples/opossum_snow.mp4' width='100%' controls onloadeddata=\"setTimeout(function(){ts=Htx.annotationStore.selected.names.get('ts');t=ts.data.time_column;v=document.getElementsByTagName('video')[0];w=parseInt(t.length*(5/v.duration));l=t.length-w;ts.updateTR([t[0], t[w]], 1.001);r=$=>
ts.brushRange.map(n=>(+n).toFixed(2));_=r();setInterval($=>r().some((n,i)=>n!==_[i])&&(_=r())&&(v.currentTime=v.duration*(r()[0]-t[0])/(t.slice(-1)[0]-t[0]-(r()[1]-r()[0]))),300); console.log('video is loaded, starting to sync with time series')}, 3000); \" />"
}
```

## 第 4 步：探索导入的任务

1. 转到数据管理器并点击任务行。
2. 等待大约 3 秒（取决于视频大小），直到视频加载完成，这非常重要。
3. 拖动时间序列概览通道上的手柄，你的视频必须与时间序列同步。

!!! note
    - 此技巧假设时间序列长度等于视频长度，因此时间序列和视频之间的滚动是按比例的。
    - 同步仅在一个方向工作：从时间序列到视频，你只能使用时间序列滚动来控制时间位置。

## 视频教程

<iframe width="100%" height="450vh" src="https://www.youtube.com/embed/fzY1DNPxkdw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
