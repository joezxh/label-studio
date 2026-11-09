---
title: 技能总览
short: 总览
tier: all
type: skills
order: 1
meta_title: Label Studio 智能体技能
meta_description: 使用 HumanSignal 智能体技能，在 AI 编程智能体内部搭建标注项目并自定义标注界面。
---

HumanSignal 发布了一小组 **智能体技能（agent skills）**，让你可以在 AI 编程智能体（Claude Code、Codex、Cursor，以及 `skills` CLI 支持的其他智能体）内部，搭建并迭代 Label Studio 项目。每个技能都是一个自包含的包：包含一段工作流提示词、内嵌的参考资料，以及少量通过公开 API 与你的 Label Studio 实例通信的 Python 辅助脚本。

名称旁带有锁形 emoji 🔒 的技能，仅对 Label Studio Enterprise 用户开放。

当前已发布两个技能：

| 技能 | 作用 | 适用版本 |
|---|---|---|
| [`create-xml-labeling-config-skill`](/skills/xml-config.html) | 根据一段自然语言任务描述起草 Label Studio 的 XML 标注配置，先在本地校验，再针对你正在运行的 Label Studio 实例做校验，并在（你明确确认后）将其作为新项目或已有项目的更新推送上去。 | OSS + Enterprise |
| 🔒 [`create-interface-skill`](/skills/interface.html) | 生成一个 HumanSignal Interface——即 Label Studio Enterprise 用的单文件 JSX 标注界面——导出运行时所需的 `paramsSchema` / `outputSchema` / `getResults` / `parseResults`，以及末尾带括号的对象字面量。 | Enterprise |

## 该用哪一个

- **你想要一个标准标注项目**——文本分类、NER/片段标注、图像边界框、音频转写、分类体系审核、排序、两两对比、时序分割。请使用 [`create-xml-labeling-config-skill`](/skills/xml-config.html)。它使用 Label Studio 内置标签来编写 XML 配置，这适用于绝大多数项目的运行时。

- **你需要一个基于 React 的自定义界面**——内置标签无法覆盖你的场景、你处理的数据类型没有标准 object 标签（3D、GEOTiff、DICOM），或者你想用自然语言「即兴」编写标注界面。请使用 🔒 [`create-interface-skill`](/skills/interface.html)。输出是一个 JSX 文件，你可以直接粘贴进 Label Studio Enterprise 的 Interfaces 编辑器，或通过 [`label-studio-sdk` CLI](https://github.com/HumanSignal/label-studio-sdk) 同步。

如果你不确定从哪个入手，先从 XML 配置技能开始。它是更轻量的路径，且在每个 Label Studio 安装上都可用。

## 技能运行的结构

两个技能都遵循同样的总体形态：

1. **你用自然语言描述任务**（"对法律合同做 NER，标签为 Party / Date / Amount / Clause type"）。技能仅在有必要时才会问一到两个澄清问题；否则它会选取合理的默认值，并在确认环节列出其假设。
2. **智能体使用技能内嵌的参考资料起草** XML 配置或 JSX 界面。无需外部知识库或运行时查询。
3. **本地校验自动运行。** 两个技能都附带 Python 脚本，可以在任何内容到达你的 Label Studio 实例之前捕获结构问题。
4. **智能体向你展示配置 / 界面、一个示例任务，以及它做出的任何假设**，然后等待你明确确认（yes）。
5. **确认后，技能推送到 Label Studio。** 可以是新项目，或者——对配置技能而言——作为对已有 `--project-id` 的更新。

第 4 步的确认环节是关键：在未经你明确同意之前，两个技能都不会写入你的 Label Studio 实例。如果智能体的某个假设出错，你可以在确认环节纠正，技能会据此迭代。

## 安装

两个技能都通过 `skills` CLI 安装，目标为你所选的智能体。

### `create-xml-labeling-config-skill`

```bash
# Claude Code
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a claude-code

# Codex
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a codex

# Cursor
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a cursor
```

### `create-interface-skill`

```bash
# Claude Code
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a claude-code

# Codex
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a codex

# Cursor
npx skills add humansignal/create-interface-skill --skill create-interface-skill -g -a cursor
```

安装后重启你的智能体。

## 凭据

两个技能都从技能根目录下的 `.env` 文件读取。它们查找的变量如下：

| 变量 | 被谁使用 | 是否必需 |
|---|---|---|
| `LABEL_STUDIO_URL` | 两者 | 服务端校验与推送步骤需要。默认 `http://localhost:8080`。 |
| `LABEL_STUDIO_API_KEY` | 两者 | 服务端校验与推送步骤需要。若缺失，本地校验仍会运行，但你必须手动上传配置。 |

在你的 Label Studio 实例中，从 **Account & Settings → Access Token**（账户与设置 → 访问令牌）获取 API 密钥。

## 源码

- [github.com/HumanSignal/create-xml-labeling-config-skill](https://github.com/HumanSignal/create-xml-labeling-config-skill)
- [github.com/HumanSignal/create-interface-skill](https://github.com/HumanSignal/create-interface-skill)
