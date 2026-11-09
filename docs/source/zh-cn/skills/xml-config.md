---
title: create-xml-labeling-config-skill
short: XML 标注配置
tier: all
type: skills
order: 2
meta_title: 在你的 AI 编程智能体中创建 Label Studio 标注配置
meta_description: create-xml-labeling-config-skill 能从自然语言任务描述起草 Label Studio 的 XML 标注配置，先对其进行校验，并在你批准后推送到你的 Label Studio 实例。
---

`create-xml-labeling-config-skill` 是一个智能体技能，能根据你的标注任务的自然语言描述起草一份 Label Studio 的 XML 标注配置，针对你正在运行的 Label Studio 实例做校验，并在你明确批准之后，将该配置作为新项目或已有项目的一个更新推送上去。

当你希望由一个智能体依据标注需求说明书来创建或迭代 Label Studio 项目时，请使用它：文本分类、NER/片段标注、图像边界框、音频转写、分类体系审核、排序、两两对比、时序分割，等等。

该技能是自包含的。它编写正确配置所需的每一条规则与模板都内置在技能的 `references/config_guide.md` 中。运行时没有外部知识库或 MCP 查询。

## 安装

```bash
# Claude Code
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a claude-code

# Codex
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a codex

# Cursor
npx skills add humansignal/create-xml-labeling-config-skill --skill create-xml-labeling-config-skill -g -a cursor
```

安装后重启你的智能体。

## 前置条件

- 一个从本机可访问、正在运行的 Label Studio 实例（社区 OSS 版或 Enterprise 版）。技能默认指向 `http://localhost:8080`。
- 一个 Label Studio 个人 API 密钥。从你实例中的 **Account & Settings → Access Token**（账户与设置 → 访问令牌）获取。

如果你还没有安装 Label Studio：

```bash
pip install label-studio
label-studio start
```

打开 `http://localhost:8080`，创建一个账户，然后从账户页面复制你的令牌。

## 凭据

技能从技能根目录下的 `.env` 读取：

```bash
cd ~/.skills/create-xml-labeling-config-skill   # 或你的智能体将其安装到的任意位置
cp .env.example .env
# 使用你的取值编辑 .env
```

必填项：

- `LABEL_STUDIO_URL` —— 基础 URL，例如 `http://localhost:8080`
- `LABEL_STUDIO_API_KEY` —— 账户页面中的个人 API 令牌

`LABEL_STUDIO_API_KEY` 在「技能仍能运行」的意义上是可选的——本地结构校验仍会工作，且配置会被保存到磁盘。服务端校验与推送步骤会跳过并给出警告。

## 使用

请你的智能体使用该技能：

```text
Use $create-xml-labeling-config-skill to build a labeling config for
sentiment classification with labels Positive / Neutral / Negative.
```

其他示例提示词：

- *"Use `$create-xml-labeling-config-skill` to make an NER config for legal contracts with labels Party / Date / Amount / Clause type."*
- *"Use `$create-xml-labeling-config-skill` to set up a Label Studio project for image bounding boxes — labels Person, Vehicle, Animal."*
- *"Use `$create-xml-labeling-config-skill` to update project 42 with a 'rationale' text area on the rating config."*

## 一次运行是怎样的

对于每一次运行，技能会：

1. **问一到两个快速问题**——如果它无法自信地选定 object 标签、control 标签和标签集。如果你的需求说明书没有歧义，它会直接跳过这步。
2. **使用内嵌的编写指南起草 XML。** 它从最接近的模板出发并做适配。
3. **用 `validate_config.py` 在本地校验配置。** 这会捕获格式错误的 XML、缺失/重复的 `name` 属性、指向不存在或非 object 标签的 `toName`、错误的嵌套、`style=` / `className=` 用在了错误的标签上，以及已废弃的标签（`AudioPlus`、`Repeater`）。
4. **在设置了 API 密钥时，针对你的 Label Studio 实例校验配置。** 该脚本将配置发布到你实例上的一个临时项目，让 Label Studio 自身的校验器运行，并立即删除该项目。这会捕获引擎层面的问题——未知的标签组合、control/object 类型不匹配、无法协同工作的属性。
5. **向你展示配置、一个示例任务 JSON、它做出的任何假设，以及校验状态。** 你进行审阅，选择批准或纠正。
6. **在你明确批准后推送。** 可以是新项目（`--title "..." --description "..."`），也可以是对已有项目的更新（`--project-id N`）。
7. **打开示例任务文件**，以便你将其拖拽进新项目的数据管理器（Data Manager）。

## 每次运行你得到什么

- 一份保存到 `/tmp/labeling-config-<slug>-<date>.xml` 的 `.xml` 配置
- 同级路径下的示例任务 JSON `/tmp/labeling-config-<slug>-<date>.tasks.json`，始终以 JSON 列表形式写入，以便数据管理器无需重新整形即可导入
- 本地 + 服务端校验结果
- 在你批准后：你 Label Studio 实例中的项目 URL

## 校验器如何工作

`validate_config.py` 运行三层校验：

1. **XML 格式良好性** —— 必须能解析为以单个 `<View>` 为根的 XML。
2. **结构规则** —— 从 Label Studio 编写指南固化而来：
   - 每个 object/control 标签都有 `name`
   - 所有 `name` 都唯一
   - 每个 control 标签的 `toName` 都指向一个既存的 object 标签
   - `<Pairwise>` 允许两个用逗号分隔的 `toName` 目标
   - `<Label>` / `<Choice>` 的嵌套规则
   - `style=` 仅允许在 `View` / `Filter` / `Header` 上；`className=` 仅允许在 `View` 上
   - 没有已废弃的标签
   - `<View>` 与其所包裹的 control 之间 `visibleWhen` 保持一致
3. **服务端**（带 `--server`）—— 将配置发布到你的 Label Studio 实例，让 Label Studio 自身的校验器运行。

你可以直接对任一文件运行校验器：

```bash
python3 scripts/validate_config.py /tmp/my-config.xml
python3 scripts/validate_config.py /tmp/my-config.xml --server
python3 scripts/validate_config.py /tmp/my-config.xml --server --project-id 42
python3 scripts/validate_config.py - < my-config.xml
python3 scripts/validate_config.py /tmp/my-config.xml --json   # 机器可读
```

仅当每一项被请求的校验都通过时，退出码才为 `0`。

## 推送如何工作

`push_config.py` 要么从配置创建一个新项目，要么更新一个已有项目的 `label_config`：

```bash
# 新项目
python3 scripts/push_config.py /tmp/my-config.xml --title "Legal NER"

# 更新已有项目
python3 scripts/push_config.py /tmp/my-config.xml --project-id 42

# 空运行（无网络调用）
python3 scripts/push_config.py /tmp/my-config.xml --title "Test" --dry-run
```

成功时会打印项目 URL。

关于更新的一点说明：如果已有项目已经带有标注，Label Studio 可能会拒绝会使其失效的变更——例如重命名一个 `Choices` 标签。在多次更新之间请保持 object/control 的 `name` 稳定，或者如果你需要一项破坏性变更，请创建一个全新的项目。

## 该技能不会做的事

- **导入你的数据。** 技能只推送标注配置。拿到项目 URL 后，请通过数据管理器、[Label Studio SDK](https://labelstud.io/sdk/)（`ls.projects.import_tasks(...)`），或 **Project Settings → Cloud Storage**（项目设置 → 云存储）导入任务。
- **生成自定义 React 界面。** 那是 🔒 [`create-interface-skill`](/skills/interface.html) 的工作（仅限 Label Studio Enterprise）。如果你的需求提到 ReactCode 或自定义界面，该技能会转交给它。
- **从 Label Studio 反向同步改动。** 流程是单向的：技能 → Label Studio。如果你在推送后在 Label Studio UI 中调整了配置，技能不会把这些改动拉回。

## 故障排查

| 现象 | 可能原因 / 修复 |
|---|---|
| `Could not reach Label Studio at http://localhost:8080` | Label Studio 未运行，或你的 `LABEL_STUDIO_URL` 有误。用 `curl http://localhost:8080/health` 确认。 |
| `--server requested but LABEL_STUDIO_API_KEY is not set` | 在 `.env` 中设置 `LABEL_STUDIO_API_KEY`。令牌从账户页面获取。 |
| `Label Studio rejected the config (HTTP 400): label_config: ...` | Label Studio 的引擎级校验器捕获了问题。错误通常很具体（`toName` 不匹配、未知属性）。修复后重新校验。 |
| `Label Studio rejected config update for project N (HTTP 400): ... annotations` | 该更新会使既有标注失效。请保持 name 稳定，或创建一个新项目。 |
| 配置通过了两项校验但 Label Studio UI 行为异常 | 几乎总是某个 control 标签上缺失了一个属性。重新阅读已安装技能内 `references/config_guide.md` 中相关标签的章节。 |

## 源码

[github.com/HumanSignal/create-xml-labeling-config-skill](https://github.com/HumanSignal/create-xml-labeling-config-skill)
