#!/usr/bin/env bash
# 一次性初始化 IDEA 调试环境：
# 1. uv 创建/同步 Python 虚拟环境（.venv），供 Django 调试配置使用
# 2. bun 安装前端依赖（web/node_modules），供 Vite HMR dev server 使用
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> uv sync (Python >= 3.11, 生成 .venv)"
uv sync

echo "==> bun install --frozen-lockfile (前端依赖)"
cd web && bun install --frozen-lockfile

echo "==> 完成。请在 IDEA 中将 Python 解释器指向 .venv，然后运行 Compound「fullstack (dev + HMR)」"
