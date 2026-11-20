#!/usr/bin/env bash
# 2026-11-19 — toolchain inventory for the ADRs4AI getting-started guide
# (jlumbroso.github.io/adrs4ai-getting-started, chapters 02-setup + 03-first-project,
# plus the ADRs4AI/plugins README and the adrs4ai-tooling skill's pneumatic/kintsugi).
# Read-only: prints OK/MISS + version for each tool; installs nothing.
# Run it in any POSIX shell: Git Bash on Windows, or inside WSL:
#   wsl.exe -d Ubuntu -- bash scripts/ephemeral/2026-11-19-check-toolchain.sh
echo "== $(uname -a)"
for t in brew uv pip3 python3 node npm asdf gh git just tmux claude code pneumatic kintsugi; do
  p=$(command -v "$t" 2>/dev/null)
  if [ -n "$p" ]; then
    echo "OK   $t | $p | $("$t" --version 2>&1 | head -1)"
  else
    echo "MISS $t"
  fi
done

# OUTCOME (2026-11-19, run by Claude Opus 5.5 for Liyan Luo):
# - Windows side (Git Bash): OK git, gh (logged in), just, node/npm, python 3.12,
#   claude, code (+ extensions jlumbroso.adrs4ai, fabiospampinato.vscode-terminals).
#   MISS brew, uv, asdf, tmux, pneumatic, kintsugi.
# - WSL side: Ubuntu 26.04 but WSL **1** (kernel 4.4.0-Microsoft). OK git, gh, tmux
#   (note: tmux uses -V, so "--version" prints an error here), python3. MISS brew, uv,
#   asdf, node, just, claude, pneumatic, kintsugi. Windows npm refuses to run:
#   "WSL 1 is not supported" → the full Unix toolchain needs `wsl --set-version Ubuntu 2`.
# - Decision: report to Liyan; no installs made without their go-ahead.
