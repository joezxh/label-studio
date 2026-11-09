---
title: Shortcut
type: tags
order: 425
meta_title: 用于定义快捷键的 Shortcut 标签
meta_description: 使用 Shortcut 标签自定义 Label Studio，定义键盘快捷键和热键以加速机器学习和数据科学项目的标注。
---

`Shortcut` 标签用于定义快捷键，标注员可以使用热键或键盘快捷键来添加预定义的对象，例如特定的标签值。

与以下数据类型配合使用：
- 音频
- 图像
- HTML
- 段落
- 文本
- 时间序列
- 视频

{% insertmd zh-cn/includes/tags/shortcut.md %}

### 示例

用于在转写时，在给定 TextArea 中插入文本 SILENCE 的快捷键的基础标注配置。

注意：Shortcut 标签的默认背景色为灰色。

你可以使用文本或十六进制格式在 `background` 参数中更改背景颜色。

```html
<View>
  <TextArea name="txt-1">
    <Shortcut alias="Silence" value="SILENCE" hotkey="ctrl+1" background="#3333333" />
  </TextArea>
</View>
```
