---
title: create-interface-skill 🔒
short: 界面构建器 🔒
tier: all
type: skills
order: 3
meta_title: 在你的 AI 编程智能体中创建 Label Studio Enterprise 界面
meta_description: create-interface-skill 能从自然语言描述生成 HumanSignal Interface——一个单文件 JSX 标注界面——先在本地校验，即可粘贴进 Interfaces 编辑器，或通过 Label Studio SDK CLI 同步。
---

`create-interface-skill` 是一个智能体技能，可生成 [HumanSignal Interface](https://docs.humansignal.com/guide/interfaces.html)：一个供 Label Studio Enterprise 使用的单文件 JSX 标注界面。输出是一个 `.jsx` 源文件，其最后一条表达式是一个带括号的对象字面量，导出一个 `default` React 组件，以及 Interfaces 运行时所期望的可选 `paramsSchema`、`outputSchema`、`getResults` 和 `parseResults` 钩子。

!!! note
    Interfaces 是 Label Studio Enterprise 的功能。该技能页面在开源文档上也可见，以便 OSS 读者了解该技能的作用，但生成的 Interface 本身仅在 Label Studio Enterprise 实例上运行。

当你希望由一个智能体来创建或迭代标注 UI 时，请使用此技能：文本分类、NER/片段标注、Document AI 工作流、数据审核界面，或将 React 或 Claude Design 原型转换为 Interface 格式。

## 何时使用 create-interface-skill 而非 XML 配置技能

如果一个标准 Label Studio 配置就能胜任——使用内置的 object 与 control 标签，无需自定义逻辑——请改用 [`create-xml-labeling-config-skill`](/skills/xml-config.html)。它是更轻量的路径。

在以下情况请选择 `create-interface-skill`：

- 内置标签无法覆盖你的数据类型或交互方式（3D、GEOTiff、DICOM、自定义组件）。
- 你需要条件逻辑、自定义校验，或经典标签无法表达的按任务变化的 UI。
- 你想用自然语言「即兴」编写标注 UI——描述它、看到它、微调它。
- 你正在将一个 React 或 Claude Design 模型草图移植为一个 Label Studio 标注界面。

## 安装

```bash
# Claude Code
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a claude-code

# Codex
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a codex

# Cursor
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a cursor
```

安装后重启你的智能体。

## 前置条件

- 一个你可以向其发布 Interfaces 的 Label Studio Enterprise 实例。
- 可选但强烈推荐：已安装并在 `PATH` 中的 [`label-studio-sdk` CLI](https://github.com/HumanSignal/label-studio-sdk)。技能会借助它从命令行校验、预览并同步界面。若没有 SDK，技能会退回到依据 `references/authoring-rules.md` 规则进行的静态检查。

## 使用

请你的智能体使用该技能：

```text
Use $create-interface-skill to build an interface for classifying support tickets by urgency and product area.
```

该技能设计支持的其他提示词：

- *"Use `$create-interface-skill` to convert this Claude Design mockup into a Label Studio interface."*
- *"Use `$create-interface-skill` to build a Document AI review screen with redactable PII spans and a confidence-score field."*
- *"Use `$create-interface-skill` to update my existing interface so reviewers can leave per-region comments."*

## 启动一个本地界面

如果你已安装 SDK CLI，推荐的做法是先创建一个本地界面工作区：

```bash
label-studio-sdk interface init ./my-interface
cd ./my-interface
```

该脚手架会为你生成三个可编辑文件：

```text
Screen.jsx        # 界面源码——即智能体编辑的内容
task.json         # 用于本地预览与校验的示例任务数据
scenarios.js      # 浏览器驱动的交互检查（可选）
```

然后将智能体的目标指向 `Screen.jsx`：

```text
Use $create-interface-skill to edit Screen.jsx to add a "needs-review" tag toggle per region.
```

## 本地校验与预览

在本地界面目录下：

```bash
# 校验整个目录
label-studio-sdk interface validate .

# 校验单个文件
label-studio-sdk interface validate ./Screen.jsx

# 运行浏览器驱动的场景（若存在）
label-studio-sdk interface validate . --scenario scenarios.js

# 输出 JSON，便于管道传给其他工具 / 智能体
label-studio-sdk interface validate . --json

# 在本地浏览器中预览
label-studio-sdk interface preview .
```

当校验通过且预览效果正确后，同步回 Label Studio：

```bash
# 推送一个草稿
label-studio-sdk interface sync . --message "Describe the change"

# 一步完成推送并发布
label-studio-sdk interface sync . --message "Describe the change" --publish
```

如果 SDK CLI 未安装，技能仍会运行并生成 JSX 文件。它会对文件做静态检查：仅允许纯 JSX，不允许 `import` / `require` / `export`，不允许 TypeScript 语法，末尾须有带 `default` 的带括号对象字面量，跨渲染保持稳定 region ID，且 `paramsSchema` / `outputSchema` / `getResults` / `parseResults` 一致。

## Interfaces 运行时契约

每个 Interface 都是一个 `.jsx` 源文件，其最后一条表达式是一个带括号的对象字面量。以下是最小骨架：

```jsx
const MyInterface = (props) => {
  const { task, regions, params, addRegion, updateRegion, deleteRegion, readOnly } = props;
  const text = getField(task.data, params?.textField ?? "text") ?? "";

  return (
    <div style={{ padding: 24 }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{String(text)}</pre>
    </div>
  );
};

const paramsSchema = {
  type: "object",
  properties: {
    textField: {
      type: "string",
      title: "Text field",
      default: "text",
    },
  },
};

const outputSchema = {
  type: "object",
  properties: {},
};

function getResults(regions, relations) {
  return [];
}

function parseResults(results) {
  return { regions: [], relations: [] };
}

({
  default: MyInterface,
  specVersion: 1,
  paramsSchema,
  outputSchema,
  getResults,
  parseResults,
})
```

运行时强制遵循、且技能会自动遵守的一些规则：

- **不允许模块语法。** 源码是作为函数体求值，而非 ES 模块。不允许 `import`、`require` 或 `export`。不允许 TypeScript 语法。
- **画布中不允许有主提交/更新按钮。** Interfaces 外壳自身负责提交。如果你需要额外的底栏操作，请使用 `BottomBarExtra` 插槽。
- **不要在渲染期间生成新的 region ID。** 复用 `props.regions` 中的既有 ID。仅在事件处理函数中或 `parseResults` 内部铸造新 ID。
- **不允许持久的 `localStorage` / `sessionStorage`。** 沙箱可能会在 iframe 重新挂载时将其重置。
- **仅在组件渲染函数内部引用 `EditorUI`。** 管理端 schema 提取可能不会注入它。

技能的 `references/runtime-contract.md` 包含完整的 prop 列表、region 结构、relation 结构，以及外壳插槽参考。对于非平凡界面，技能会按需加载它。

## 该技能不会做的事

- **生成 XML 配置。** 对于由 Label Studio 经典标签构建的标准标注 UI，请使用 [`create-xml-labeling-config-skill`](/skills/xml-config.html)。
- **使用遗留的 `<ReactCode>` XML 标签。** 这是基于 JSX 的新 Interfaces 运行时。如果你特别需要 `<ReactCode>`，请显式提出要求。
- **构建一个多文件应用、包或构建配置。** Interfaces 是单个 `.jsx` 文件。技能保持输出可被粘贴进 Interfaces 编辑器。

## 源码

[github.com/HumanSignal/create-interface-skill](https://github.com/HumanSignal/create-interface-skill)
