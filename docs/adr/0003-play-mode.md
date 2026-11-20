<!-- adr template version: "adr 3.12.0" -->
<!--
adr teaching map: the example is not the teaching — these are the up-links from this file to what teaches its form; load them rather than winging it. (Sibling: the template-version marker dates the mold this file was minted from.)
  skill: adr-authoring
  mcp: adrs4ai
  plugin: adr@adrs4ai
-->

# Play mode

- **Date**: 2026-11-19
- **Iteration**: 2
- **Status**: Partially Implemented
- **Scope Remaining**: daily mode (milestone 2): date → word picker, per-day saved state, mode switch in the UI
- **Deciders**: Liyan Luo, Claude (Opus 5.5)

**TL;DR**: Support both an unlimited practice mode and a daily puzzle, built in that order on one shared game engine.

---

## Originating Context

**Source**: Human request (Liyan Luo, 2026-11-19). The request names the core mechanic ("guess the word, colored feedback per letter") but not *when* a new word appears. That gap is what this ADR is about.

**Agency Grant**: Explore options and recommend.

---

## Explicitation

**What I understand**:

1. **The engine is the same either way.** Scoring a guess, tracking the six rows, and detecting win or loss don't care where the answer came from. Play mode only changes two things: the *answer picker* (random vs. derived from today's date) and *what we save* in the browser (the current game, or today's game plus a streak).
2. **Daily mode spends the answer pool.** With ~150–250 five-letter answers (ADR-0002), one word a day runs out in 5–8 months unless we cycle. It also raises the "whose midnight?" question: the player's local date or UTC.
3. **There's no server.** GitHub Pages is static, so a daily word must be computed in the browser from the date. Anyone reading the source can work out tomorrow's word. For a class project that's acceptable, but worth knowing.

**Assumptions**:

- Progress and stats live in the browser's `localStorage`: no accounts, no backend.

**Confirm**: Liyan, by answering the question below.

---

## Questions

### QST-PLAY-MODE: When does a player get a new word?
- Status: answered
- Why asking: This decides how answers are picked, what the browser saves, and whether there's date logic to test. Context: the site is static (GitHub Pages, no server), so any "daily" word must be computed in the browser from the date. The answer pool is likely ~150–250 words (ADR-0002).
- Need: pick a letter (or override — any shape answers)

Options:
- **A — Daily only**: One answer per calendar day, the same for every player, derived from the date (for example, a fixed shuffle of the list indexed by days since launch). One game per day, with streak tracking. People can compare results, but players get only six guesses a day, a 150-word pool lasts about five months, and there's date and timezone logic to test.
- **B — Unlimited only**: Each game picks a random answer, with a "New game" button. No date logic, and easy to test and demo. Recently seen words are remembered so repeats are rare. There's no shared puzzle to compare.
- **C — Both, unlimited first**: Build B first because it's the quickest playable game. Then add a daily mode as a thin layer: a date-based answer picker plus per-day saved state, on the same engine. Two modes in the UI, so a little more to explain and test.

**Recommendation**: (by Claude Opus 5.5, 2026-11-19)

**C — Both, unlimited first.** *Rationale*: Explicitation item 1 means the second mode costs only an answer picker and a save slot, not a second game. Building unlimited first gives a playable, demo-able game soonest, and lets us test the scoring engine without faking dates. Daily then adds the shared-puzzle appeal, and its date→word function gets its own focused tests. *Confidence*: 0.65. The engineering argument is solid; whether you want the extra mode at all is your call. *If wrong*: if the deadline is tight or you want one mode to polish, this flips to **B**. If "everyone solves the same CS word today" *is* the point of the project, it flips to **A**.

**ANS:** (by Liyan Luo)
C — Both, unlimited first. (Accepted the recommendation. Liyan said in conversation, 2026-11-19: "按照你的来" — "go with your recommendations"; recorded by Claude Opus 5.5.)

---

## Decision

### Chosen: C — Both, unlimited first

**Rationale**: As in the Recommendation. Both modes share one engine (scoring, rows, win/loss); they differ only in the answer picker and what gets saved.

**Trade-offs accepted**: Two modes to explain in the UI. The daily word is computable by anyone who reads the source (static hosting, no server).

### Consequences
- Milestone 1: unlimited mode (random answer, "New game"), playable and deployed.
- Milestone 2: daily mode (date → word via a fixed shuffle, the player's local date, per-day saved state).
- Saved state lives in `localStorage`.

---

## Action Items

- [x] Build the engine + unlimited mode — Owner: Claude (commit 043aaee; live 2026-11-19)
- [ ] Add daily mode on the same engine — Owner: Claude

---

## Open Follow-ups

- [ ] Concern, game identity: the game needs its **own public name and its own look**. "Wordle" is a trademark of The New York Times, and I won't reproduce its name, exact tile palette or page layout. The guess-and-color mechanic is common to the genre (it descends from Mastermind) and is fine. Our own name and palette are easy, and the CS theme invites them. To be decided before UI polish; it's a candidate for its own ADR then.
- [ ] Concern, accessibility: "letter right but in the wrong spot" vs. "letter right, right spot" shouldn't depend on color alone. That needs a color-blind-safe palette and/or a symbol or pattern on each tile.
- [ ] Future task: decide what stats to keep (games played, win %, guess distribution, streak) once the play mode is picked.

---

## Iterations

### Iteration 1 (2026-11-19)
- Trigger: initial draft from Liyan's opening request
- Contributors: Claude (Opus 5.5)
- Changes: options laid out, recommendation C
- Outcome: Draft, awaiting QST-PLAY-MODE

### Iteration 2 (2026-11-19)
- Trigger: Liyan's answer in conversation: "按照你的来" (go with your recommendations)
- Contributors: Liyan Luo, Claude (Opus 5.5)
- Changes: QST-PLAY-MODE answered C; Decision and Action Items filled
- Outcome: Draft → Accepted

---

## Links

- Related ADRs: ADR-0001 (static hosting, so there's no server), ADR-0002 (the answer pool size bounds daily mode's lifetime)
