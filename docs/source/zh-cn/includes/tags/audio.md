### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 包含音频路径或 URL 的数据字段。 |
| [defaultspeed] | <code>string</code> | <code>1</code> | 默认播放速度级别（0.5 到 2）。 |
| [defaultscale] | <code>string</code> | <code>1</code> | 音频面板的波形默认 y 轴缩放比例。 |
| [defaultzoom] | <code>string</code> | <code>1</code> | 波形默认缩放级别（1 到 1500）。 |
| [defaultvolume] | <code>string</code> | <code>1</code> | 默认音量级别（0 到 1）。 |
| [hotkey] | <code>string</code> |  | 用于播放或暂停音频的快捷键。 |
| [sync] | <code>string</code> |  | 要同步的对象名称。 |
| [height] | <code>string</code> | <code>96</code> | 音频播放器的总高度。 |
| [waveheight] | <code>string</code> | <code>32</code> | 在 `splitchannels` 模式下显示多声道时波形的最小高度。 |
| [spectrogram] | <code>boolean</code> | <code>false</code> | 决定加载时是否自动显示音频频谱图。 |
| [splitchannels] | <code>boolean</code> | <code>false</code> | 如果音频文件包含多声道，则分别显示各个声道。（**注意：需要更多内存来运行。**） |
| [decoder] | <code>string</code> | <code>&quot;webaudio&quot;</code> | 用于解码音频数据的解码器类型。（`"webaudio"`、`"ffmpeg"`，或 `"none"` 表示不解码——可加快大文件加载速度，但会禁用波形可视化） |
| [player] | <code>string</code> | <code>&quot;html5&quot;</code> | 用于播放音频数据的播放器类型。（`"html5"` 或 `"webaudio"`） |

### 结果参数（Result parameters）

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| original_length | <code>number</code> | 原始音频时长（秒） |
| value | <code>Object</code> |  |
| value.start | <code>number</code> | 片段起始时间（秒） |
| value.end | <code>number</code> | 片段结束时间（秒） |
| value.channel | <code>number</code> | 所针对的声道标识 |

### 示例 JSON
```json
{
  "original_length": 18,
  "value": {
    "start": 3.1,
    "end": 8.2,
    "channel": 0,
    "labels": ["Voice"]
  }
}
```

