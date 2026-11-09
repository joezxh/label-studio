---
title: TextArea
type: tags
order: 427
meta_title: 用于文本区域的 TextArea 标签
meta_description: 使用 TextArea 标签自定义 Label Studio，支持机器学习和数据科学项目的音频转写、图像描述生成和 OCR 任务。
---

`TextArea` 标签用于显示供用户输入的文本区域。适用于转写、改写或描述生成任务。

与以下数据类型配合使用：audio（音频）、image（图像）、HTML、paragraphs（段落）、text（文本）、time series（时间序列）、video（视频）。

{% insertmd zh-cn/includes/tags/textarea.md %}

### 示例：基础 TextArea

你可以在 playground 中打开此示例并尝试不同的参数。

```html
<View>
  <TextArea name="text-area"></TextArea>
</View>
```

### 示例：区域列表 TextArea 字段

此示例将 `TextArea` 标签与其他标签组合，用于 OCR 标注。

由于 `displayMode="region-list"`，文本区域字段会显示在 **Regions**（区域）面板下，而不是标注界面中。

![Screenshot](/images/tags/textarea-ocr.png)

```html
<View>
  <Image name="image" value="$ocr"/>
  <Labels name="label" toName="image">
    <Label value="Product" background="#166a45"/>
    <Label value="Price" background="#2a1fc7"/>
  </Labels>
  <Rectangle name="bbox" toName="image" strokeWidth="3"/>
  <TextArea name="transcription" toName="image" editable="true" perRegion="true" required="true" maxSubmissions="1" rows="5" placeholder="Recognized Text" displayMode="region-list"/>
</View>
```

### 示例：强制唯一值

为了保持提交的唯一性，你可以设置 `skipDuplicates="true"`。如果用户尝试输入相同的值两次，会收到弹窗消息。

![Screenshot](/images/tags/textarea-unique.png)

```html
<View>
  <Audio name="audio" value="$audio"/>
  <TextArea name="genre" toName="audio" skipDuplicates="true" />
</View>
```

### 示例：确保用户可按 Enter 提交

如果你希望通过速度优化标注流程，可能希望使用键盘快捷键，或避免额外的点击。

对此你应当注意以下几点：

- 如果 `rows="1"`，你可以按 Enter 提交文本。
- 如果 rows > 1，会出现 **Add** 按钮。你可以点击它，或按 Shift + Enter。
- 按下 **Submit** 时，你不需要先添加文本（即点击 **Add** 或按 Enter/Shift + Enter）来保存你的文本。

  只需将文本输入到输入框即可。只有当你希望从同一个 TextArea 包含多次提交时，才需要添加文本。请参阅下方视频。

<video style="max-width: 600px;" class="gif-border" autoplay loop muted>
  <source src="/images/tags/textarea-demo.mp4">
</video>

!!! info Tip
    你可以点击 Control + Enter（Windows）或 Command + Enter（Mac）来提交标注。

    你还可以配置自己的 [自定义热键](/guide/user_account#Set-custom-hotkeys)

```html
<View>
  <Header value="Press Enter to submit"/>
  <Text name="text1" value="Example text 1" />
  <TextArea name="text-area-1" toName="text1" rows="1" />
  
  <Header value="Press Shift + Enter to submit"/>
  <Text name="text2" value="Example text 2" />
  <TextArea name="text-area-2" toName="text2" rows="3" />
</View>
```
