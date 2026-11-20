<!-- adr template version: "adr 3.12.0" -->
<!--
adr teaching map: the example is not the teaching — these are the up-links from this file to what teaches its form; load them rather than winging it. (Sibling: the template-version marker dates the mold this file was minted from.)
  skill: adr-authoring
  mcp: adrs4ai
  plugin: adr@adrs4ai
-->

# Word list and guess rules

- **Date**: 2026-11-19
- **Iteration**: 1
- **Status**: Draft
- **Deciders**: Liyan Luo, Claude (Opus 5.5)

**TL;DR**: Recommended for v1: answers are always 5-letter CS terms, and a guess must be a real English word or any CS answer word. Word length stays a code constant so variable length can come later. Pending Liyan's picks.

---

## Originating Context

**Source**: Human request (Liyan Luo, 2026-11-19):

> A Wordle variant — guess the word, colored feedback per letter — with a twist: the answers are computer science words (ARRAY, STACK, QUEUE, CACHE, TOKEN…).

**Agency Grant**: Explore options and recommend.

---

## Explicitation

**What I understand**:

1. **Two word lists, not one.** The *answer* list is what can be the hidden word: curated CS terms. The *allowed-guess* list is what the game accepts as a guess. "The answers are CS words" settles the first list only. The second decides how the game feels.
2. **All five of your examples are five letters long.** That may be on purpose (the classic grid) or a coincidence. Many core CS words aren't five letters: HEAP, NODE, BINARY, POINTER, COMPILER, RECURSION.
3. **CS jargon collides with English dictionaries.** Good answers like ASYNC, INODE, MUTEX and REGEX aren't in general English word lists. Whatever the guess rule, every answer word must also be an accepted guess. Otherwise a player who knows the answer gets "not a word".

**Assumptions**:

- Answers are curated by hand (by us), not scraped. Quality matters more than count, and obscure picks feel unfair.
- Proper nouns such as LINUX and REACT are allowed as answers only if we decide so explicitly. I'd lean toward excluding brand names; that's noted as a follow-up, not a card.

**Confirm**: Liyan, by answering the two questions below.

---

## Questions

### QST-WORD-LENGTH: Are answers always five letters, or can the length vary?
- Status: unanswered
- Why asking: This sets the grid layout, the size of the answer pool, and which CS words are eligible at all. Context: your examples (ARRAY, STACK, QUEUE, CACHE, TOKEN) are all five letters, but many central CS words (HEAP, BINARY, POINTER) are not.
- Need: pick a letter (or override — any shape answers)

Options:
- **A — Five, always**: The classic 5-wide, 6-row grid. Answers are limited to 5-letter CS terms (ARRAY, STACK, QUEUE, CACHE, TOKEN, MUTEX, REGEX, TUPLE, QUERY, GRAPH, MERGE, PROXY, YIELD, FETCH, STASH…). Simplest layout and rules. The pool is smaller, perhaps 150–250 good words.
- **B — Varies per puzzle**: Each puzzle's answer sets the grid width, say 4 to 8 letters, and the player sees the length up front. Opens up HEAP, BINARY, POINTER, COMPILER. Costs a responsive grid that changes width, and the allowed-guess rules from QST-GUESS-RULES must work at every length.
- **C — Player chooses**: A setting (4 / 5 / 6 / 7) picks the length, and the answer comes from that length's pool. Most flexible, and the most to build and test. Every length needs its own decent pool.

**Recommendation**: (by Claude Opus 5.5, 2026-11-19)

**A — Five, always.** *Rationale*: All five of your examples fit, and the fixed grid keeps v1's layout and scoring code simple. The scoring function is where real bugs live (repeated letters; see CLAUDE.md's Fifth Directive). I'll still write the length as one constant, not a sprinkled `5`, so B or C stays a contained change later rather than a rewrite. *Confidence*: 0.75. I'm fairly sure about the engineering; how much you care about words like POINTER is your call. *If wrong*: if we can't curate at least ~150 five-letter answers that feel fair and recognizable, the pool is too thin and this flips to **B**. Likewise if the words you most want in the game are mostly not five letters.

**ANS:** (by Liyan Luo)
[Fill this in]   <!-- literal placeholder — parser-significant, do not paraphrase -->

---

### QST-GUESS-RULES: What counts as a legal guess?
- Status: unanswered
- Why asking: This is the biggest single factor in how the game *feels*, and it decides whether we bundle a general English word list. Context: the answers are CS terms, and some of them (ASYNC, INODE, MUTEX) aren't in English dictionaries. Whatever rule we pick, every answer word must also be accepted as a guess.
- Need: pick a letter (or override — any shape answers)

Options:
- **A — English + CS**: A guess must be in a general English word list of the right length (about 10–15k five-letter words) *or* in the CS answer list. Players can probe with everyday words like CRANE or SLATE, and nonsense like AEIOU is rejected. Costs a bundled list of roughly 60–90 KB, about 30 KB gzipped, with a license compatible with a public repo.
- **B — CS terms only**: A guess must be a CS term from a curated CS vocabulary somewhat larger than the answer list. The theme stays pure, and every guess teaches a term. The game is harder and narrower: everyday probe words are rejected, and a player who has seen the list can deduce answers by elimination.
- **C — Any letters**: No dictionary. Any five letters are a legal guess. Simplest, with nothing to bundle. But players can probe with non-words, which makes the puzzle easier and less word-like.

**Recommendation**: (by Claude Opus 5.5, 2026-11-19)

**A — English + CS.** *Rationale*: A keeps the familiar strategy of opening with common letters while still rejecting nonsense. The union with the answer list fixes the jargon problem in Explicitation item 3. B makes the allowed-guess list nearly as small as the answer list, so the game turns into "recall the list" more than deduction. C gives up the word-ness that makes the format work. *Confidence*: 0.65. This one leans on taste: I'm confident A is the most *conventional* feel, much less that it's what *you* want. I also haven't picked a specific word list or checked its license yet. *If wrong*: if the point of the twist is to *practice CS vocabulary* (a study tool more than a puzzle), every guess should be a CS term and this flips to **B**.

**ANS:** (by Liyan Luo)
[Fill this in]   <!-- literal placeholder — parser-significant, do not paraphrase -->

---

## Decision

Pending the answers to QST-WORD-LENGTH and QST-GUESS-RULES.

---

## Open Follow-ups

- [ ] Future task: curate the answer list into a reviewed data file. Brand and proper nouns (LINUX, REACT, JAVA) are excluded unless you rule otherwise.
- [ ] Future task: if A wins QST-GUESS-RULES, choose a general word list with a license compatible with a public repo, and record its source and license in the repo.
- [ ] Idea, not yet a question: after each game, show a one-line definition of the answer ("MUTEX: a lock ensuring only one thread enters a critical section"). It fits the CS twist, and it would make the answer list a small glossary.

---

## Iterations

### Iteration 1 (2026-11-19)
- Trigger: initial draft from Liyan's opening request
- Contributors: Claude (Opus 5.5)
- Changes: split "the word" into two lists (answers vs allowed guesses); two cards
- Outcome: Draft, awaiting QST-WORD-LENGTH and QST-GUESS-RULES

---

## Links

- Related ADRs: ADR-0001 (toolchain; word lists ship as bundled data), ADR-0003 (play mode; the pool size bounds how long a daily mode lasts)
