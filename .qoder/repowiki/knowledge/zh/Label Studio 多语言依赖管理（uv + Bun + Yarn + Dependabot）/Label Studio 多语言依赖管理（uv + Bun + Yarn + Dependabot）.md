---
kind: dependency_management
name: Label Studio 多语言依赖管理（uv + Bun + Yarn + Dependabot）
category: dependency_management
scope:
    - '**'
source_files:
    - pyproject.toml
    - uv.lock
    - web/package.json
    - web/bun.lock
    - docs/package.json
    - docs/yarn.lock
    - .github/dependabot.yml
    - Dockerfile
    - .github/workflows/validator-uv-lock.yml
    - .github/workflows/update_pip_dependency.yml
    - .github/workflows/tests.yml
    - .github/workflows/build_pypi.yml
    - tools/bandit_ls_custom_checks/pyproject.toml
---

## 1. 使用的系统与工具

Label Studio 是一个 Python + Node.js 的多语言单体仓库，依赖管理按语言分层：

- **Python 后端**：使用 `uv`（Rust 实现的 Python 包管理器）作为安装与解析器，构建后端为 `uv_build`。依赖声明集中在根目录的 `pyproject.toml`，锁定文件为 `uv.lock`。
- **前端工程**：位于 `web/`，使用 `bun@1.3.11` 作为包管理器与运行时，依赖声明在 `web/package.json`，锁定文件为 `web/bun.lock`。
- **文档站点**：位于 `docs/`，基于 Hexo，使用 `yarn@1.22.22`（由 `packageManager` 字段指定），锁定文件为 `docs/yarn.lock`。
- **独立工具包**：`tools/bandit_ls_custom_checks/` 是独立的 Python 包，有自己独立的 `pyproject.toml`，通过 setuptools 构建，仅依赖 `bandit>=1.7.0`。
- **自动化更新**：通过 GitHub 内置的 Dependabot（`.github/dependabot.yml`）对 GitHub Actions 进行每周更新。

## 2. 关键文件

- `pyproject.toml`：后端主包定义、依赖、可选依赖组（`test`、`build`）、`[tool.uv]` 配置、构建系统、Ruff/pytest 等工具链。
- `uv.lock`：Python 依赖的精确锁定快照。
- `web/package.json`：前端依赖、脚本、`resolutions` 覆盖。
- `web/bun.lock`：前端依赖锁定快照。
- `docs/package.json` + `docs/yarn.lock`：文档站点的 Hexo 依赖。
- `.github/dependabot.yml`：Dependabot 配置，仅启用 `github-actions` 生态。
- `.github/workflows/build_pypi.yml`、`cicd_pipeline.yml`、`tests.yml`、`update_pip_dependency.yml`、`validator-uv-lock.yml`：CI 中缓存与校验 `uv.lock` 的工作流。
- `Dockerfile`：镜像构建时 COPY `pyproject.toml`、`uv.lock`、`web/bun.lock`，并注释说明 `label-studio-sdk is a git-pinned dependency in pyproject.toml/uv.lock`。
- `tools/bandit_ls_custom_checks/pyproject.toml`：Bandit 自定义检查插件包的独立依赖声明。

## 3. 架构与约定

### Python 依赖（`pyproject.toml` + `uv`）

- 所有运行时依赖声明在 `[project].dependencies`，采用 PEP 621 格式；版本约束混合使用 `>=`、`<`、`==`，例如 `Django (>=5.2.16,<5.3.0)`、`requests>=2.33.1,<2.35.0`、`django-rq (>=4.1.1,<4.2)`。
- 可选依赖组通过 `[project.optional-dependencies]`（如 `uwsgi`）和 `[dependency-groups]`（`test`、`build`）组织。
- 私有/非 PyPI 依赖通过 `[tool.uv.sources]` 以 Git URL + 固定 commit SHA 引入：`label-studio-sdk = { git = "https://github.com/HumanSignal/label-studio-sdk.git", rev = "bb754c29572d6e2b7ec3723409c4043cc3ca70b2" }`。
- 构建系统固定为 `uv_build<0.14.0`，并要求 `required-version = ">=0.13.5"`。
- 安全策略：`exclude-newer = "4 days"` 禁止引入 4 天内发布的包，但 `certifi` 被显式豁免（`exclude-newer-package = { certifi = false }`）。
- 模块名与入口：`module-name = "label_studio"`，CLI 命令 `label-studio = "label_studio.server:main"`。

### 前端依赖（`web/package.json` + `bun`）

- 通过 `packageManager: "bun@1.3.11"` 强制使用特定版本的 bun。
- 生产依赖在 `dependencies`，开发依赖在 `devDependencies`，测试工具（Cypress、Storybook、Jest）统一放在 `devDependencies`。
- 通过 `resolutions` 字段集中覆盖第三方传递依赖的版本，用于修复安全漏洞或解决冲突（如 `handlebars`、`moment`、`postcss`、`esbuild`、`d3-color`、`markdown-it` 等）。
- Vite 通过 `npm:rolldown-vite@^7.3.1` 别名方式引入，而非直接依赖。

### 文档站点依赖（`docs/package.json` + `yarn`）

- 使用 Yarn Classic（`yarn@1.22.22+sha512...`），依赖 Hexo 生态插件（`hexo-*`）。
- 通过 `resolutions` 覆盖 `follow-redirects`、`brace-expansion`、`markdown-it` 等依赖。

### CI/CD 中的依赖管理

- 多个 GitHub Actions workflow 使用 `cache-dependency-glob: "uv.lock"` 缓存 Python 依赖。
- `validator-uv-lock.yml` 工作流会校验 `uv.lock` 是否随 `pyproject.toml` 变更而更新。
- `update_pip_dependency.yml` 负责更新 pip 依赖。
- Dockerfile 将 `uv.lock` 与 `web/bun.lock` 一起 COPY 进镜像，确保构建可复现。

## 4. 约定与约束

- **Python 依赖必须通过 `pyproject.toml` 声明**，并由 `uv` 生成 `uv.lock`；CI 中通过 `cache-dependency-glob: "uv.lock"` 与 validator 工作流强制锁定文件同步。
- **新包引入需满足 `exclude-newer = "4 days"` 约束**（除 `certifi` 外），即不允许自动拉取 4 天内发布的新版本，降低上游破坏性更新风险。
- **Git 依赖必须固定到具体 commit SHA**（见 `label-studio-sdk` 的 `rev = "bb754c29572d6e2b7ec3723409c4043cc3ca70b2"`），不可使用分支名或 tag。
- **前端包管理器固定为 `bun@1.3.11`**，由 `packageManager` 字段与 `web/bun.lock` 共同保证一致性。
- **文档站点固定使用 Yarn Classic `1.22.22`**，由 `packageManager` 字段与 `docs/yarn.lock` 共同保证。
- **Dependabot 仅启用 `github-actions` 生态**，未启用 npm/pip 等其他生态的自动 PR（当前配置中只有 `package-ecosystem: "github-actions"`）。
- **无 vendored 第三方源码**：仓库未发现 `vendor/`、`third_party/` 等目录，所有第三方代码均通过包管理器拉取。
- **私有注册表**：未发现 `PYPI_PRIVATE_URL`、`NPM_REGISTRY` 等私有源配置；Git 依赖通过公开 GitHub URL 访问。
- **独立子包**：`tools/bandit_ls_custom_checks/` 拥有独立的 `pyproject.toml`，通过 setuptools 构建并通过 entry point 向 bandit 暴露自定义检查规则，不混入主包依赖。