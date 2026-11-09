---
title: 快捷键
short: 快捷键
tier: all
type: guide
order: 138
order_enterprise: 138
meta_title: Label Studio 中的快捷键
section: "创建与管理项目"
parent: "labeling"
parent_enterprise: "labeling"
date: 2025-05-24 17:19:21
---

使用键盘快捷键（或热键）来提高你的标注效率。 

## 查看开箱即用的快捷键

在标注编辑器中，点击设置图标以查看有关快捷键的更多详细信息，或启用/禁用快捷键。 

![Screenshot of settings icon](/images/label/settings.png)

!!! info Tip
    如果指定了 `enter` 且你使用的是 Mac 键盘，请改用 `return`。使用 `delete` 代替 `backspace`，使用 `option` 代替 `alt`。

## 从账户页面自定义全局快捷键

你可以轻松地从 [**账户与设置 > 快捷键** 页面](user_account#Hotkeys) 自定义全局快捷键。 

![Screenshot of customized key](/images/admin/global-hotkeys.png)

## 使用环境变量自定义全局快捷键

如果你想更改用于特定操作的快捷键，请在你的 `.env` 文件或启动 Label Studio 时设置带有有效 JSON 的 `EDITOR_KEYMAP` 环境变量。例如，要将用于提交标注的键盘快捷键更改为 `shift` + `s`，请按如下方式设置环境变量：
```
EDITOR_KEYMAP='{"annotation:submit":{"key": "shift+s","description": "My Custom Submit Hotkey!"}}'
```
这会用你的自定义映射覆盖现有的快捷键映射。请参阅[有关如何设置环境变量的更多信息](https://labelstud.io/guide/start#Set-environment-variables)。 

请参阅 [`keymap.json` 文件](https://github.com/HumanSignal/label-studio/blob/develop/web/libs/editor/src/core/settings/keymap.json) 中可自定义快捷键的完整列表，以更新不同的快捷键组合。 

你不能使用此环境变量来删除现有的或添加新的键盘快捷键。 

## 使用 `<Shortcut>` 标签

使用 [Shortcut 标签](/tags/shortcut) 允许标注者将预定义的文本片段插入到他们当前的标注中。 

他们可以通过点击快捷键按钮或按下其热键来执行此操作。 

!!! info Tip
    Shortcuts work inside control tags (e.g., `<TextArea>`, `<Labels>`)

例如，使用以下内容将预定义文本插入到文本区域：

```html
<View>
  <Image name="image" value="$captioning"/>
  <Header value="Describe the image:"/>
  <TextArea name="caption" toName="image">
    <!-- Inserts "CAR" when clicked or on Ctrl+1 -->
    <Shortcut alias="Car" value="CAR" hotkey="ctrl+1" background="#333333"/>
    <!-- Inserts "AIRPLANE" when clicked or on Ctrl+2 -->
    <Shortcut alias="Airplane"   value="AIRPLANE"   hotkey="ctrl+2" background="#FFEE00"/>
  </TextArea>
</View>
```
