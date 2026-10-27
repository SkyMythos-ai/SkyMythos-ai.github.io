#!/usr/bin/env bash
#
# 本地预览 SkyMythos 官网。
#
# 用法：
#   ./scripts/preview.sh          开发模式，改代码即时热更新（默认）
#   ./scripts/preview.sh static   生产预览，与 GitHub Pages 上线效果一致
#
# 首次运行会自动重装依赖：仓库里的 node_modules 可能是在其他平台（例如
# Linux 容器）安装的，而 Next.js 的编译器是平台相关的原生二进制，跨平台复用
# 会在启动时报 "Failed to load SWC binary"。脚本检测到平台不匹配时会自动重装。

set -euo pipefail

cd "$(dirname "$0")/.."

MODE="${1:-dev}"
PORT="${PORT:-3000}"

# ── 1. 检查 Node 版本 ─────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "✗ 未找到 Node.js。请先安装 Node 22.19 或更高版本：https://nodejs.org" >&2
  exit 1
fi

if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 19) ? 0 : 1)'; then
  echo "✗ Node 版本过低（当前 $(node -v)），需要 22.19 或更高。" >&2
  exit 1
fi

# ── 2. 确保依赖与当前平台匹配 ─────────────────────────────────────────────────
# Next 按 "<os>-<arch>" 安装对应的 SWC 包，例如 macOS Apple 芯片是 darwin-arm64。
PLATFORM="$(node -p 'process.platform + "-" + process.arch')"

needs_install=false
if [ ! -d node_modules ]; then
  needs_install=true
elif ! ls node_modules/@next/ 2>/dev/null | grep -q "swc-${PLATFORM}"; then
  echo "→ node_modules 不是为当前平台（${PLATFORM}）安装的，重新安装依赖…"
  rm -rf node_modules .next
  needs_install=true
fi

if [ "$needs_install" = true ]; then
  npm install --no-audit --no-fund
fi

# ── 3. 启动 ───────────────────────────────────────────────────────────────────
case "$MODE" in
  dev)
    echo
    echo "→ 开发模式启动：http://localhost:${PORT}"
    echo "  中文首页 http://localhost:${PORT}/zh/    英文首页 http://localhost:${PORT}/en/"
    echo "  按 Ctrl+C 停止"
    echo
    exec npx next dev -p "$PORT"
    ;;

  static)
    echo "→ 构建静态站点…"
    npm run build
    echo
    echo "→ 生产预览：http://localhost:${PORT}"
    echo "  这就是部署到 GitHub Pages 后的样子。按 Ctrl+C 停止"
    echo
    exec node scripts/serve-export.cjs out "$PORT"
    ;;

  *)
    echo "✗ 未知模式：$MODE（可用：dev、static）" >&2
    exit 1
    ;;
esac
