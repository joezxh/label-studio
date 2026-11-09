### 参数（Parameters）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | <code>string</code> |  | 元素名称 |
| value | <code>string</code> |  | 视频的 URL |
| [frameRate] | <code>number</code> | <code>24</code> | 视频每秒帧率；默认为 24；可使用任务数据如 `$fps` |
| [sync] | <code>string</code> |  | 要同步的对象名称 |
| [muted] | <code>boolean</code> | <code>false</code> | 静音视频 |
| [height] | <code>number</code> | <code>600</code> | 视频播放器的高度 |
| [timelineHeight] | <code>number</code> | <code>64</code> | 带区域的时间轴高度 |
| [defaultPlaybackSpeed] | <code>number</code> | <code>1</code> | 加载时播放器应使用的默认播放速度 |
| [minPlaybackSpeed] | <code>number</code> | <code>1</code> | 允许的最小播放速度；defaultPlaybackSpeed 不能低于此值 |

