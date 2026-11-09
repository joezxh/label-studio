# Label Studio 文档多语言翻译方案（i18n Plan & Glossary）

> 适用范围：`docs/source/` 全套文档的多语言翻译与维护。
> 当前进度：中文（`zh-cn`）为首个非英语语言，已完成 `guide/` 主体与少量 `includes/`。

---

## 1. 现状盘点（2026-11-08）

文档站基于 **Hexo**（`i18n_dir: :lang`，主题 `v2`），语言目录即 `docs/source/<lang>/`，默认英语（根 `source/`）。语言切换逻辑见 `themes/v2/source/js/language-switcher.js`（当前硬编码 `en` ↔ `zh-CN`，前缀 `/zh-cn`）。

| 目录 | 源文件数(.md) | 已译 zh-cn | 说明 |
| --- | --- | --- | --- |
| `guide/`(顶层+子目录) | 244 | 148(除自动生成项外基本覆盖) | 主体已完成 |
| `guide/ml_tutorials/` | 29 | 29 | 本次补全最后 2 篇 |
| `guide/release_notes/onprem/` | 93 | 0 | 自动生成，排除(§6) |
| `guide/release_notes.md` | 1 | 0 | 由 onprem 自动生成，排除 |
| `includes/` | 63 | 7 | 共享片段，见 §2 |
| `plugins/` | 16 | 0 | 待译 |
| `skills/` | 3 | 0 | 待译 |
| `tags/` | 54 | 0 | 待译 |
| `templates/` | 112 | 0 | 待译 |
| `tutorials/` | 11 | 0 | 待译 |

**结论**：`guide/` 收尾（除自动生成内容外）已完成；其余待译约 **259 篇 .md**（plugins 16 + skills 3 + tags 54 + templates 112 + tutorials 11 + includes 其余 56）。

---

## 2. guide/ 收尾与一致性修复记录

### 2.1 补全的缺口
- `zh-cn/guide/ml_tutorials/mmdetection-3.md`
- `zh-cn/guide/ml_tutorials/sklearn-text-classifier.md`

### 2.2 一致性缺陷修复（重要）
发现 **8 个中文页** 通过 `{% insertmd includes/xxx.md %}` 引用的是 **英文** 共享片段（`source/includes/`，而非 `source/zh-cn/includes/`），导致中文页内嵌英文段落。

修复方式（已执行）：
1. 将 5 个被引用但未译的英文 include 译入 `zh-cn/includes/`：`deploy.md`、`annotation_ids.md`、`image_units.md`、`base_models.md`、`model_keys.md`（`task_format.md`、`result_format.md` 此前已译）。
2. 将 8 个中文页的 insertmd 路径由 `includes/` 改为 `zh-cn/includes/`：`export.md`、`install.md`、`install_requirements.md`、`install_enterprise_docker.md`、`model_providers.md`、`troubleshooting.md`、`task_format.md`、`prompts_keys.md`。

> 插件解析规则（已核实 `node_modules/hexo-include/lib/include.js`）：`path = join(source_dir, args[0])`，相对 `source/` 根目录解析，故 `zh-cn/includes/X.md` 正确指向 `source/zh-cn/includes/X.md`。

### 2.3 建议的后续 QA（人工抽检）
- 前期已完成但本会话未逐篇核对的约 140 篇翻译，建议抽样检查是否残留整段英文。
- 内部交叉链接：中文页内 `/guide/X.html` 当前指向英文页；语言切换器按 `localStorage` 自动跳转，改为 `/zh-cn/guide/X.html` 体验更佳但非必须。

---

## 3. 统一术语表（Glossary）

| 英文术语 | 推荐中文 | 备注 |
| --- | --- | --- |
| Label Studio | Label Studio | 专有名词不译 |
| annotation | 标注 | |
| annotator | 标注员 | |
| reviewer | 审核员 | |
| label | 标签 | |
| labeling | 标注 | |
| task | 任务 | |
| project | 项目 | |
| prediction | 预测 | |
| pre-annotation / prelabel | 预标注 | |
| ground truth | 真值 | |
| dataset | 数据集 | |
| export / import | 导出 / 导入 | |
| storage(source/target) | 存储(源存储/目标存储) | |
| ML backend | ML 后端 | 首次出现用全称 |
| control tag | 控制标签 | |
| object tag | 对象标签 | |
| region | 区域 | |
| result | 结果 | |
| workspace | 工作区 | |
| organization | 组织 | |
| role / permission | 角色 / 权限 | |
| webhook | Webhook | 不译 |
| API key | API 密钥 | |
| tier | 版本层级(社区版/企业版) | |
| on-premises / on-prem | 本地部署 / 本地 | |
| SaaS | SaaS | 不译 |
| template | 模板 | |
| plugin | 插件 | |
| taxonomy | 分类法 | |
| prompt | Prompt / 提示词 | 技术语境保留 Prompt |
| LLM | 大语言模型 / LLM | |
| fit / train | 训练 | |
| predict / inference | 预测 / 推理 | |
| endpoint / deployment | 终结点 / 部署 | |
| checkpoint | 检查点 | |
| bounding box | 边界框 | |
| segmentation | 分割 | |
| keypoint | 关键点 | |
| polygon | 多边形 | |
| mask | 掩码 | |

**格式与保留规则**：frontmatter 随正文翻译，但 `image` 路径、`order`、`tier`、`hide_menu` 等元数据保持原值；代码块、HTML、`{% %}` 标签、Mermaid、URL、产品/模型名保持原样；文件名/目录名与英文源严格一致。

---

## 4. 其余文档待译清单与目标语言范围

### 4.1 待译清单（优先级）
1. **`includes/`**（余 56 篇）— 高：被 `guide/` 大量 `insertmd` 引用，未译会让中文页夹生英文。
2. **`tags/`**（54 篇）— 高：每个标注标签的参考页，短小且高频访问。
3. **`templates/`**（112 篇）— 中：标注模板库，篇幅短。
4. **`tutorials/`**（11 篇）— 中：上手教程。
5. **`plugins/`**（16 篇）— 低：插件生态。
6. **`skills/`**（3 篇）— 低：Skills 框架。

### 4.2 目标语言范围
- 当前唯一非英语语言：**简体中文 `zh-cn`**。建议作为"参考语言"先打磨完整。
- 是否扩展其他语言（如 `ja` / `ko` / `fr` / `de` / `es` / `pt-BR` / `ru`）取决于业务需求，
  由产品/市场侧确定优先级；结构上可随时新增 `<lang>/` 目录。

---

## 5. 文件命名与目录结构方案

### 5.1 目录结构（已确立的约定）
每个语言在 `docs/source/` 下建立与源树完全镜像的目录：

```
docs/source/
├── <英文源文件>.md            # 默认英语（无语言前缀）
├── images/                   # 图片二进制，全语言共享，不复制
├── includes/                 # 英语共享片段
├── guide/  tags/  templates/  tutorials/  plugins/  skills/
└── zh-cn/                    # 中文镜像
    ├── guide/  tags/  templates/  tutorials/  plugins/  skills/
    └── includes/             # 中文共享片段（页面用 {% insertmd zh-cn/includes/X.md %} 引用）
```

- 新增语言只需复制该结构为 `docs/source/<lang>/`。
- `<lang>` 使用与 Hexo `i18n_dir`、切换器一致的 locale 代码（`zh-cn`、`ja`、`ko`、`pt-BR` 等）。

### 5.2 文件命名
- **保持与英文源完全相同的文件名与相对路径**（如 `guide/export.md` → `zh-cn/guide/export.md`）。
- 不在文件名加语言后缀，语言由所在目录区分。
- 图片等二进制资源沿用英语 `images/`，翻译页引用原路径（`/images/...` 或相对路径），不重复存储。

### 5.3 切换器改造
`language-switcher.js` 当前硬编码 `en` ↔ `zh-CN`。新增语言时需将其改为"语言列表 + 当前语言"的通用逻辑（`mirroredPath` 已支持任意 `/<lang>` 前缀映射，改动很小）。

---

## 6. 翻译内容与原文档同步更新的方式

### 6.1 同步机制（推荐）
1. **翻译清单清单（manifest）**：维护 `docs/translation_status.json`，结构如下，由脚本生成/更新：
   ```json
   {
     "guide/export.md": { "zh-cn": { "status": "translated", "sourceHash": "<sha256>", "translatedHash": "<sha256>", "updated": "2026-11-08" } }
   }
   ```
   - `sourceHash`：英文源文件内容哈希；`translatedHash`：对应翻译文件哈希。
   - `status`：`missing`(未译) / `translated`(已译) / `outdated`(源已更新，翻译待同步) / `auto-generated`(自动生成，排除)。
2. **变更检测脚本**：新增 `docs/scripts/check-translations.js`（仓库已有 `scripts/` 目录），对比哈希：
   - 源文件存在、翻译缺失 → 标记 `missing`。
   - 源哈希变化而翻译未变 → 标记 `outdated` 并报告。
   - 可接入 CI（如 PR 检查时输出待办清单），也可本地 pre-commit 运行。
3. **流程约定**：英文源 `docs/source/X.md` 修改后，对应 `docs/source/<lang>/X.md` 应在同一 PR 或跟进 PR 中同步；合并前由 `check-translations` 给出缺口提示。

### 6.2 自动生成内容的处理（release_notes）
- `guide/release_notes.md` 头部明确：**"不要手动修改，它由 onprem/*.md 在 hexo 运行时自动生成"**。
- 因此 `release_notes/onprem/`（93 篇）与 `release_notes.md` **不纳入人工翻译范围**。
- 若业务需要中文 Release Notes：应翻译 `onprem/*.md` 源数据后由构建重生成；或仅在站点的 Release Notes 区域保留英文（推荐，属高频变更且低优先级）。

### 6.3 链接与格式一致性规范
- 站内链接：英文源用 `/guide/X.html`；翻译页可保留（依赖切换器重定向）或改为 `/<lang>/guide/X.html`。
- 所有 frontmatter 元数据字段名、代码块围栏、Hexo 标签、锚点（`#Anchor`）保持与英文一致，避免破坏页面内跳转与 SEO。
- 同一术语严格遵循 §3 术语表，审校阶段统一。

---

## 7. 后续执行建议
1. 先按 §4.1 优先级补全 `includes/`（高优先，解除中文页英文夹生）。
2. 推行 §6.1 的 `translation_status.json` + 检测脚本，作为长期同步保障。
3. 翻译 `tags/`、`templates/` 等短文件批次推进（每批 5–8 篇）。
4. 视业务需求决定是否扩展更多语言目录。
