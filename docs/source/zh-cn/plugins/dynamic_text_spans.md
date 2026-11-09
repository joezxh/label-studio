---
title: 动态文本片段
short: 动态文本片段
type: plugins
category: Automation
cat: automation
order: 45
meta_title: 动态文本片段
meta_description: 标注编辑后的文本
tier: enterprise
---

<img src="/images/plugins/dynamic-text-spans.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     有关修改此插件或创建自定义插件的信息，请参阅 [自定义并构建你自己的插件](custom)。

     有关常规插件信息，请参阅 [项目插件](/guide/plugins) 和 [插件常见问题](faq)。

## 关于

此插件将一个 `TextArea` 与 `Text` 字段"绑定"在一起，在你编辑时使二者保持同步。随后你可以为 `Text` 字段中的文本应用标签，从而允许你标注与导入文本不同的独特文本。

<video style="max-width: 800px;" class="gif-border" autoplay loop muted>
  <source src="/images/plugins/dynamic-text-spans.mp4">
</video>

此插件的工作原理：

1. 它定义了两个标签名：
    - `TextArea` 为 `transcription`
    - `Text` 为 `extraction_text`
2. 它会捕获当前的标注 ID，以便在切换区域时停止运行。
3. 在 `init()` 中，它会每 300 毫秒轮询一次，直到找到名称以 "transcription" 开头的 `<TextArea>`（Label Studio 会追加随机后缀）。
4. 一旦找到，它会将其标记为 `_already_loaded` 并启动 `tick()`，后者每 300 毫秒运行一次：
   - 如果 DOM 节点被替换了（例如你重新加载或更改了标注），它会重新查询该节点。
   - 如果你切换到了不同的标注 ID，它会停止。
   - 它会获取实时的 DOM 值（`$ta.value`），或在缺失时回退到标注最近保存的结果。
   - 它会将该字符串与你的 `extraction_text` 控件的当前 `_value` 进行比较。
   - 如果二者不同，它会调用 `text.setRemoteValue(val)`。这使用 Label Studio 前端 API 来更新另一个字段的值。

最终效果是一个实时镜像：你在 "transcription" `TextArea` 中输入或粘贴的任何内容，都会自动出现在 "extraction_text" `Text` 字段中。并且重要的是，你在 `Text` 字段中标注的文本可以随你的结果一起导出。

## 插件 

```javascript
const TEXTAREA_NAME = "transcription";
const TEXT_NAME = "extraction_text";

const current_annotation = LSI.annotation.id;
(function init() {
  // textarea results have names like "tag_name:h4$h", so we use ^=
  let $ta = document.querySelector(`textarea[name^="${TEXTAREA_NAME}"]`);
  if (!$ta) return setTimeout(init, 300);
  if ($ta._already_loaded) return;

  $ta._already_loaded = true;
  (function tick() {
    // it can be another textarea with submitted result
    if (!$ta?.isConnected) {
      $ta = document.querySelector(`textarea[name^="${TEXTAREA_NAME}"]`);
    }
    // if we lost textarea/moved out of current annotation — break the cycle
    if (!$ta?.isConnected || LSI.annotation?.id !== current_annotation) return;
    setTimeout(tick, 300);

    const textarea = LSI.annotation.names.get(TEXTAREA_NAME);
    const text = LSI.annotation.names.get(TEXT_NAME);

    const val = String($ta.value ?? textarea.result?.value.text ?? "");
    if (text._value !== val) {
      text.setRemoteValue(val);
    }
  })();
})();
```

**相关的 LSI 实例方法：**

* [LSI.annotation](custom#LSI-annotation)

## 标注界面

```xml
<View>
  <Header value="1. Transcribe the audio below:"/>
  <Audio name="audio" value="$audio" zoom="true" hotkey="ctrl+enter"/>

  <TextArea
    name="transcription"
    toName="audio"
    rows="4"
    editable="true"
    maxSubmissions="1"
    showSubmitButton="false"
    value="$text"
  />

  <Header value="2. Extract spans from the transcript:"/>
  <!-- force HyperText into the DOM via non-breaking space -->
  <View idAttr="extractionBlock">
    <Text
      name="extraction_text"
      idAttr="extractionText"
      value="$transcription"
      inline="false"
    />
  </View>

  <Labels
    name="span_labels"
    toName="extraction_text"
    choice="multiple"
    showInline="true"
  >
    <Label value="EntityType1" background="#8cc6ff"/>
    <Label value="EntityType2" background="#ffa39e"/>
  </Labels>
</View>
```

**相关标签：**

* [View](/tags/view.html)
* [Header](/tags/header.html)
* [TextArea](/tags/textarea.html)
* [Audio](/tags/audio.html)
* [Text](/tags/text.html)
* [Labels](/tags/labels.html)

## 示例数据

```json
{
  "data": {
    "audio": "https://data.heartex.net/librispeech/dev-clean/3536/8226/3536-8226-0024.flac.wav",
    "transcription": "",
    "text": "this is a test"
  }
}
```
