<!-- adr template version: "adr 3.12.0" -->
<!--
adr teaching map: the example is not the teaching — these are the up-links from this file to what teaches its form; load them rather than winging it. (Sibling: the template-version marker dates the mold this file was minted from.)
  skill: adr-authoring
  mcp: adrs4ai
  plugin: adr@adrs4ai
-->

# Build and deploy toolchain

- **Date**: 2026-11-19
- **Iteration**: 2
- **Status**: Accepted
- **Deciders**: Liyan Luo, Claude (Opus 5.5)

**TL;DR**: Build with Vite + Vue 3 single-file components (scoped CSS), in TypeScript, tested with Vitest; a GitHub Actions workflow tests, builds and publishes to GitHub Pages.

---

## Originating Context

**Source**: Human request (Liyan Luo, 2026-11-19, opening message of the project):

> I want it hosted free on GitHub Pages, built with Vue using scoped CSS so styles stay component-local. Before you write any code: what are the 2–3 decisions we should settle first?

**Agency Grant**: Explore options and recommend. No code until the pre-code decisions are settled.

---

## Explicitation

**What I understand**:

1. **Scoped CSS means a build step.** `<style scoped>` is a feature of Vue's single-file-component (SFC) compiler. It rewrites selectors with a per-component attribute. A plain `<script src="vue.js">` page from a CDN has no compiler, so it can't scope styles. Your "scoped CSS" requirement therefore picks a build tool for us.
2. **GitHub Pages serves static files from a subpath.** A project site lives at `https://<user>.github.io/wordle-with-records/`, not at the domain root. Vite must be told `base: '/wordle-with-records/'`. Otherwise the built page asks for its JS at `/assets/…`, gets 404s, and shows blank. Dev mode hides this bug, which is why the production build is part of the gate (CLAUDE.md, Fifth Directive).
3. **Pages can publish two ways.** Either a GitHub Actions workflow uploads the build, or Pages serves a branch (`gh-pages`) that someone pushes built files to.

**Assumptions** (confirm or override in passing; none needs its own card):

- **TypeScript**, via the official scaffold's TS option. It's cheap at this size and catches mistyped game state early. Say so if you'd rather write plain JavaScript; for a course project that's a fine choice too.
- **No UI framework or CSS library.** Plain scoped CSS per component, as you described.
- **The repo will be public.** GitHub Pages is free for public repos on a free account; a private repo needs a paid plan for Pages.

**Confirm**: Liyan, by answering the question below.

---

## Questions

### QST-TOOLCHAIN: How do we build and ship the site?
- Status: answered
- Why asking: This shapes the repo skeleton, the verification gate, and how a change reaches players. Context: you asked for Vue with scoped CSS (`<style scoped>`), hosted free on GitHub Pages. Scoped CSS exists only inside Vue's single-file-component compiler, so any option without a build step can't meet that requirement.
- Need: pick a letter (or override — any shape answers)

Options:
- **A — Vite + Actions deploy**: Scaffold with `npm create vue@latest` (Vite, Vue 3 SFCs, TypeScript, Vitest). Set `base: '/wordle-with-records/'`. Add a `.github/workflows/deploy.yml`: on every push to `main` it runs the tests, builds, and publishes `dist/` with GitHub's official `actions/deploy-pages`. The repo holds only source, and a red test blocks the deploy. One-time setup only you can do: Settings → Pages → Source: "GitHub Actions".
- **B — Vite + manual branch deploy**: Same scaffold. You build locally and push `dist/` to a `gh-pages` branch, for example with the `gh-pages` npm package via `npm run deploy`. No CI. Deploying is a deliberate act you run, which suits release-by-snapshot. Nothing stops a stale or untested build going live.
- **C — No build (Vue from a CDN)**: One `index.html` loads Vue from a CDN, and components are JS objects with template strings. Zero tooling, and Pages serves the files directly. But `<style scoped>` doesn't exist without the SFC compiler, so this breaks your stated requirement. Styles would be kept apart by hand with class-name prefixes (BEM-style), by convention only.

**Recommendation**: (by Claude Opus 5.5, 2026-11-19)

**A — Vite + Actions deploy.** *Rationale*: C fails the scoped-CSS requirement on its own terms (Explicitation item 1). Between A and B, A runs the same gate as CLAUDE.md's Fifth Directive (`npm test` + `npm run build`) on every deploy. So the subpath `base` bug and the repeated-letter scoring bug are caught before players see them, not after. The official scaffold also wires Vitest in for free, which gives the tests directive a real home from day one. *Confidence*: 0.85, because the scoped-CSS constraint rules out C outright and A is GitHub's documented path for Vite on Pages. What I haven't verified: whether your account or the course limits Actions minutes or Pages on this repo. *If wrong*: if you want deploys to be deliberate snapshots you trigger yourself (say, per course milestone), or Actions isn't available to you, this flips to **B**.

**ANS:** (by Liyan Luo)
A — Vite + Actions deploy. (Accepted the recommendation. Liyan said in conversation, 2026-11-19: "按照你的来" — "go with your recommendations"; recorded by Claude Opus 5.5.)

---

## Decision

### Chosen: A — Vite + Actions deploy

**Rationale**: As in the Recommendation. `<style scoped>` requires the SFC compiler, so C is out. A puts the Fifth Directive's gate (`npm test` + `npm run build`) between every push and the live site. The Explicitation's assumptions (TypeScript, no UI framework, public repo) were accepted along with the pick.

**Trade-offs accepted**: Node and a build step are required to work on the site. Deploys happen on every push to `main`, not as hand-picked snapshots.

### Consequences
- The repo gets a Vite + Vue 3 + TypeScript + Vitest skeleton with `base: '/wordle-with-records/'`.
- `.github/workflows/deploy.yml` runs tests and build, then `actions/deploy-pages`.
- One-time manual step for Liyan: Settings → Pages → Source: "GitHub Actions" (or the guide's `gh api` call).

---

## Action Items

- [ ] Scaffold the app and the deploy workflow — Owner: Claude
- [ ] Extend `just gate` with `npm test` and `npm run build` — Owner: Claude
- [ ] Switch Pages to the "GitHub Actions" source — Owner: Liyan (or Claude via `gh api`, with Liyan's OK)

---

## Open Follow-ups

- [ ] Future task: once the toolchain is picked, extend `just gate` (justfile) to run `npm test` and `npm run build`, as CLAUDE.md's Fifth Directive already says.
- [ ] Concern: the public URL will contain the repo name (`…/wordle-with-records/`). If the game gets its own public name (ADR-0003 follow-ups), renaming the repo changes the URL and the `base` setting together.

---

## Iterations

### Iteration 1 (2026-11-19)
- Trigger: initial draft from Liyan's opening request
- Contributors: Claude (Opus 5.5)
- Changes: options laid out, recommendation A
- Outcome: Draft, awaiting QST-TOOLCHAIN

### Iteration 2 (2026-11-19)
- Trigger: Liyan's answer in conversation: "按照你的来" (go with your recommendations)
- Contributors: Liyan Luo, Claude (Opus 5.5)
- Changes: QST-TOOLCHAIN answered A; Decision and Action Items filled
- Outcome: Draft → Accepted

---

## Links

- Related ADRs: ADR-0002 (word list, which ships as bundled data), ADR-0003 (play mode)
- Related docs: CLAUDE.md, Fifth Directive (the gate this toolchain must feed)
