---
kind: frontend_style
name: Label Studio 前端样式体系：HumanSignal Design System + Tailwind + Figma 设计令牌
category: frontend_style
scope:
    - '**'
source_files:
    - web/.design-sync/conventions.md
    - web/design-tokens.json
    - web/tailwind.config.js
    - web/postcss.config.js
    - web/components.json
    - web/package.json
    - web/libs/ui/package.json
    - web/libs/ui/src/tailwind.css
    - web/libs/ui/src/tailwind.config.js
    - web/libs/ui/src/index.ts
    - web/tools/design-tokens-converter/design-tokens-converter.mjs
    - web/tools/ds-check/cli.ts
    - web/tools/ds-manifest/cli.ts
    - web/tools/ds-metrics/cli.ts
---

## 1. 总体方案

Label Studio 的前端位于 `web/`，采用 **Vite + React** 构建，样式体系围绕 HumanSignal（原 Label Studio）自研的 Design System 展开，核心由以下组件构成：

- **Tailwind CSS v3.4.3**（`tailwind.config.js` → `libs/ui/src/tailwind.config.js`），作为原子化样式引擎。
- **HumanSignal UI 组件库**（包名 `@humansignal/ui`，源码在 `web/libs/ui/src`），通过全局对象 `window.HumanSignalUI` 暴露 `<Typography>`、`<Button>`、`<Badge>`、`ModalWindow`、`Dropdown`、`Popover`、`Tooltip`、`ContextMenu`、`Drawer` 等语义化组件。
- **Figma 设计令牌**（`design-tokens.json`，6000+ 行），经 `tools/design-tokens-converter/design-tokens-converter.mjs` 脚本生成 `tokens/tokens.css`，同时产出 Tailwind 语义类名。
- **PostCSS 管线**（`postcss.config.js`）：`postcss-import` → `postcss-nested` → `postcssPrefixLsfClasses`（自定义前缀插件）→ `tailwindcss` → `autoprefixer`。
- **shadcn/ui**（`components.json` 指向 `libs/ui/src/tailwind.css`，别名 `@humansignal/shad/*`），作为 Radix 基础组件的二次封装层。
- **Storybook**（`libs/storybook`）用于组件文档与视觉回归。

## 2. 关键文件

| 路径 | 作用 |
|---|---|
| `web/package.json` | 统一入口脚本：`design-tokens`、`ds:manifest`、`ds:check`、`ds:metrics`、`extract-antd-no-reset` 等 |
| `web/tailwind.config.js` | 转发到 `libs/ui/src/tailwind.config.js` |
| `web/postcss.config.js` | PostCSS 插件链，含 LSF 类名前缀处理 |
| `web/components.json` | shadcn/ui 配置，别名映射到 `@humansignal/shad/*` |
| `web/design-tokens.json` | Figma 导出的设计令牌（color / spacing / typography / radius / shadow 等） |
| `web/.design-sync/conventions.md` | HumanSignal UI 使用约定文档 |
| `web/libs/ui/src/tailwind.css` | 设计系统主样式入口（导入 tokens、字体、Tailwind base/utilities、各组件 CSS） |
| `web/libs/ui/src/tailwind.config.js` | 实际 Tailwind 配置（扩展语义色、间距、字号、圆角等） |
| `web/libs/ui/src/index.ts` | `window.HumanSignalUI` 全局导出 |
| `web/libs/ui/package.json` | `@humansignal/ui` 包的发布清单（`sideEffects` 包含 `.css` 与 `.prefix.css`） |
| `web/tools/ds-check/cli.ts` | 设计系统一致性检查 CLI（`bun run ds:check`） |
| `web/tools/ds-manifest/cli.ts` | 生成组件 manifest（`bun run ds:manifest`） |
| `web/tools/ds-metrics/cli.ts` | 设计系统度量统计（`bun run ds:metrics`） |

## 3. 架构与约定

### 3.1 设计令牌驱动（Design Tokens）

- `design-tokens.json` 是单一事实来源，按 Figma Variable Collection 结构组织，支持 `light` / `dark` 双模式（`modes` 字段）。颜色家族包括 `neutral`、`primary`、`negative`、`positive`、`warning` 以及品牌强调色 `grape`、`blueberry`、`kale`、`kiwi`、`mango`、`canteloupe`、`persimmon`、`plum`、`fig`、`sand`。
- 运行 `bun run design-tokens` 将 JSON 转换为 `tokens/tokens.css`，其中语义变量以 CSS 自定义属性形式挂载到 `:root`（浅色）和 `[data-color-scheme="dark"]`（深色）。
- 同一脚本同时生成 Tailwind 语义类名（如 `bg-neutral-background`、`text-primary-content`、`border-negative-border`），供组件直接使用。

### 3.2 Tailwind 语义化命名

`.design-sync/conventions.md` 明确规定：**禁止使用原始调色板名或默认 Tailwind 颜色**（如 `bg-grape-700`、`bg-blue-500`、`text-gray-600`），只允许使用从设计令牌生成的语义类。约定表格覆盖了页面面板、文本、边框、品牌填充、状态色、强调色、间距、排版、圆角等所有维度。

### 3.3 主题切换

- 默认浅色主题；在 `<html>` 上设置 `data-color-scheme="dark"` 即可切换到深色，所有语义 token 自动翻转。
- 背景与文字基色来自 `body` 上的 `bg-neutral-background text-neutral-content`。
- Toast 是唯一需要 Provider 的场景：用 `<ToastProvider>` 包裹应用并放入 `<ToastViewport />`，再通过 `useToast()` 调用。

### 3.4 组件库分层

```
web/libs/ui/src/
├── tokens/          # 生成的 tokens CSS
├── components/      # HumanSignal 语义组件（Typography, Button, Badge, ModalWindow…）
├── shad/            # shadcn/ui 基于 Radix 的基础组件
├── hooks/           # 共享 hooks
├── i18n/            # 国际化资源
└── utils/           # 工具函数
```

组件通过 `window.HumanSignalUI` 全局暴露，无需 React Provider 注入（除 Toast 外）。图标同时提供自定义 `Icon*`（如 `IconSearch`、`IconSettings`）与 Phosphor `*Icon`（如 `MagnifyingGlassIcon`、`GearIcon`、`XIcon`）。

### 3.5 构建与隔离

- PostCSS 插件 `postcssPrefixLsfClasses` 为 LSF 相关 CSS 类添加命名空间前缀，避免与第三方样式冲突。
- `libs/ui/package.json` 的 `sideEffects` 声明了 `.css` 与 `.prefix.css`，确保 Tree-shaking 时保留样式副作用。
- Vite 多配置：`vite.config.ts`（主应用）、`vite.config.editor.ts`（编辑器 standalone 构建）、`vite.config.playground.ts`（Playground）。

## 4. 约定与约束

### 观察到的约定（描述性）

- 所有页面级布局使用语义 Tailwind 类：`bg-neutral-background`、`bg-neutral-surface`、`bg-neutral-surface-hover`、`bg-neutral-surface-active`、`bg-neutral-surface-inset`。
- 文本层级使用 `<Typography variant size>`（`body-{smaller,small,medium}`、`label-*`、`title-*`、`headline-*`、`display-*`），而非手写 `<h1>`–`<p>` 样式。
- 按钮统一使用 `<Button variant look size>`（`variant`: primary/neutral/negative/positive/warning/gradient/inverted；`look`: filled/outlined/string；`size`: medium/small/smaller）。
- 间距使用设计系统扩展的 `tightest(2px)`、`tighter(4px)`、`tight(8px)`、`base(16px)`、`wide(24px)`、`wider(32px)`、`widest(40px)`。
- 圆角使用 `rounded-smallest`(2px) → `rounded-large`(16px) 五级阶梯。
- 运行时 CSS 变量取值遵循 `var(--color-*)`、`var(--spacing-*)`、`var(--corner-radius-*)`、`var(--font-size-*)` 命名空间。
- 组件 API 文档位于 `components/<group>/<Name>/<Name>.prompt.md`，类型定义在 `<Name>.d.ts`。

### 可验证的规则（有工具/文档强制）

1. **禁止使用非语义 Tailwind 颜色**：`.design-sync/conventions.md` 明文规定“Never use raw palette names (`bg-grape-700`) or default Tailwind colors (`bg-blue-500`, `text-gray-600`)”。该规则由 `bun run ds:check`（`tools/ds-check/cli.ts`）在设计系统一致性检查中执行。
2. **设计令牌变更必须通过转换器**：`package.json` 中 `design-tokens` 脚本唯一负责从 `design-tokens.json` 生成 `tokens/tokens.css` 与 Tailwind 语义类，手动维护 CSS 令牌不在工作流内。
3. **Dark mode 通过 `data-color-scheme="dark"` 切换**：约定文档明确说明 theme 默认 light，深色需设置该属性，且“every semantic token flips”。
4. **HumanSignal UI 通过全局对象访问**：约定文档要求“Components are on `window.HumanSignalUI`. No root provider is needed”，仅 Toast 例外需 `<ToastProvider>`。
5. **shadcn 组件通过别名引入**：`components.json` 将 `components`、`ui`、`utils`、`lib`、`hooks` 别名映射到 `@humansignal/shad/*`，新增 shadcn 组件应走此路径。
6. **CSS 类名前缀隔离**：PostCSS 链中的 `postcssPrefixLsfClasses()` 对 LSF 相关样式施加命名空间前缀，防止与外部样式冲突。

## 5. 依赖关系图

```
Figma Variables
    ↓ (design-tokens.json)
bun run design-tokens
    ↓
tokens/tokens.css + Tailwind 语义类
    ↓
libs/ui/src/tailwind.css
    ↓
PostCSS (import → nested → prefix → tailwind → autoprefixer)
    ↓
Vite 构建产物
    ↓
window.HumanSignalUI 全局组件
```

这套体系的核心思想是：**设计令牌是唯一真相源，Tailwind 语义类是消费接口，HumanSignal UI 组件是组合单元，PostCSS 前缀保证样式隔离**。