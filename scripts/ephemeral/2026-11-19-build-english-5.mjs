// 2026-11-19 — build src/data/english-5.txt, the general-English half of the
// allowed-guess list (ADR-0002, QST-GUESS-RULES answered A: English ∪ CS answers).
//
// Source: the npm package wordlist-english@1.2.1 (MIT), which repackages SCOWL
// (Kevin Atkinson; permissive license, notice must travel with the words — it is
// copied to src/data/SCOWL-COPYRIGHT.txt). Fetched with `npm pack` into a scratch
// folder, never installed into the project.
//
// We take SCOWL size levels 10–50 ("english" + "american" spellings): level 50 is
// roughly a standard desk dictionary, so real words pass and obscure junk mostly
// doesn't. Keep only plain a–z words of exactly five letters (drops proper nouns,
// which SCOWL capitalizes, plus apostrophes and accents).
//
// Usage:  node scripts/ephemeral/2026-11-19-build-english-5.mjs <path-to-unpacked-package-dir>
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'

const pkg = process.argv[2]
if (!pkg) {
  console.error('usage: node 2026-11-19-build-english-5.mjs <unpacked wordlist-english package dir>')
  process.exit(1)
}

const MAX_LEVEL = Number(process.argv[3] ?? 50) // optional 2nd arg: top SCOWL level to include
const LEVELS = [10, 20, 35, 40, 50, 55, 60, 70].filter((l) => l <= MAX_LEVEL)
const DIALECTS = ['english', 'american']
const words = new Set()
for (const d of DIALECTS) {
  for (const lvl of LEVELS) {
    const list = JSON.parse(readFileSync(join(pkg, `${d}-words-${lvl}.json`), 'utf8'))
    for (const w of list) if (/^[a-z]{5}$/.test(w)) words.add(w.toUpperCase())
  }
}

const sorted = [...words].sort()
writeFileSync('src/data/english-5.txt', sorted.join('\n') + '\n')
copyFileSync(join(pkg, 'Copyright'), 'src/data/SCOWL-COPYRIGHT.txt')
console.log(`wrote ${sorted.length} words to src/data/english-5.txt`)

// OUTCOME (2026-11-19, Claude Opus 5.5): sizes by top level — 50: 4,441 words,
// 55: 4,748, 60: 5,055, 70: 6,415. Level 50 rejected real words (AMBIT, TALUS,
// WURST, YURTS, RECON); level 70 is mostly obscure or slang. Shipped level 60:
//   node scripts/ephemeral/2026-11-19-build-english-5.mjs <pkg-dir> 60
// Recorded in ADR-0002's Consequences. Note: levels ≥60 include some slurs; they
// are only *accepted* as guesses, never shown (answers come from answers.txt).
