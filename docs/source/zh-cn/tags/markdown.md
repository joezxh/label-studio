---
title: Markdown
type: tags
order: 504
meta_title: 用于渲染 Markdown 文本的 Markdown 标签
meta_description: 使用 Markdown 标签自定义 Label Studio，显示格式化的 markdown 文本内容，用于机器学习和数据科学项目。
---

`Markdown` 标签用于在标注界面上显示 markdown 格式的文本内容。使用此标签可以提供富文本说明、描述或内容，并支持标题、粗体、列表、链接等格式。

此外，这也是在标注界面上显示辅助文本内容最简单的方式。

与以下数据类型配合使用：Markdown 格式的文本内容。

{% insertmd zh-cn/includes/tags/markdown.md %}

### 示例

在标注界面上显示静态 markdown 说明：

```html
<View>
  <Markdown>
## Instructions

Please **carefully** read the following text and mark all entities.

- Look for **person names**
- Look for **organization names**  
- Look for **locations**

> Remember to be thorough in your analysis.
  </Markdown>
  <Text name="text" value="$text" />
</View>
```

缩进在 markdown 中很重要，因此建议保持 markdown 内容不缩进。

### 示例

显示来自任务数据的 markdown 内容：

```html
<View>
  <Markdown value="$markdown_description" />
  <Text name="text" value="$text" />
</View>
```

**示例任务数据：**

```json
{
  "markdown_description": "## Analysis Task\n\nPlease analyze the following text for sentiment:\n\n- **Positive** - Shows satisfaction or approval\n- **Negative** - Shows dissatisfaction or criticism\n- **Neutral** - Shows no particular sentiment",
  "text": "The product was amazing and I loved it!"
}
```

### 示例

显示带样式的 markdown 内容：

```html
<View>
  <Markdown 
    value="$content"
    style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;" />
</View>
```

### 支持的 Markdown 功能

Markdown 标签支持标准 Markdown 语法，包括：

- **标题** - `# ## ### ####` 等
- **粗体与斜体** - `**bold**` 与 `*italic*`
- **列表** - 有序列表（`1. item`）与无序列表（`- item`）
- **链接** - `[link text](URL)`
- **代码** - 行内 `` `code` `` 以及用 ``` 包裹的代码块
- **引用块** - `> quoted text`
- **换行** - 双换行会创建新的段落
