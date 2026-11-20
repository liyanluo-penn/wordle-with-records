# Technical Debt

Known compromises, each with where it lives and how to pay it off (see CLAUDE.md, "Technical Debt Tracking").

---

## TypeScript pinned to 6.x (not 7)

- **Issue**: `vue-tsc@3.3.14` crashes with TypeScript 7 (`ERR_PACKAGE_PATH_NOT_EXPORTED: './lib/tsc'`). TS 7 is the native compiler and no longer ships the JS entry point vue-tsc loads.
- **Location**: `package.json` → `"typescript": "~6.0.3"`
- **Impact**: None today; we miss TS 7's speed.
- **Workaround**: Pin TS 6.
- **Fix**: When a vue-tsc release states TS 7 support, bump both and run `just gate`.
- **Priority**: Low

## Dev-only audit warnings

- **Issue**: `npm audit` reports 5 moderate advisories (glob, minimatch) reached via `@vue/test-utils` → `js-beautify` → `editorconfig`.
- **Location**: devDependencies only. Nothing ships in `dist/`.
- **Impact**: Test tooling only; it never runs in players' browsers.
- **Workaround**: None needed. `npm audit fix --force` would *downgrade* test-utils, which is worse.
- **Fix**: Take the next `@vue/test-utils` release that updates `js-beautify`.
- **Priority**: Low

## jsdom wants a newer Node than the local machine has

- **Issue**: `jsdom@31` declares `node ^24.15`; Liyan's machine has 24.13.1 (npm EBADENGINE warning). Tests pass anyway. CI uses the latest Node 24.
- **Location**: local environment
- **Fix**: Update Node locally (e.g. `winget upgrade OpenJS.NodeJS.LTS`).
- **Priority**: Low

## `just gate` exits 2 on the kintsugi lock warning

- **Issue**: `instantiate-check` fails because `kintsugi.yaml` exists without `kintsugi.lock`. Every placeholder is filled; tests and build pass. The template intends this failure until `kintsugi adopt` is run.
- **Location**: `justfile` → `instantiate-check`
- **Impact**: The gate is red for a reason unrelated to the code, which teaches people to ignore a red gate. That's the dangerous part.
- **Fix**: Liyan decides whether to install kintsugi (`uv tool install adrs4ai-kintsugi`, then `kintsugi adopt`); it's Unix-oriented, see the WSL notes in `scripts/ephemeral/2026-11-19-check-toolchain.sh`.
- **Priority**: Medium. Needs a human decision.
