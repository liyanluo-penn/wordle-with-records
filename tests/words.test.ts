import { describe, expect, it } from 'vitest'
import { WORD_LENGTH } from '../src/game/constants'
import { ANSWERS, isAllowedGuess, parseWordList } from '../src/game/words'

describe('answer list (ADR-0002)', () => {
  it('has enough words: fewer than ~150 is ADR-0002\'s signal to revisit five-letters-only', () => {
    expect(ANSWERS.length).toBeGreaterThanOrEqual(150)
  })

  it('contains only words the board can display', () => {
    // A 4- or 6-letter answer would make the puzzle unsolvable.
    const bad = ANSWERS.filter((w) => !new RegExp(`^[A-Z]{${WORD_LENGTH}}$`).test(w))
    expect(bad).toEqual([])
  })

  it('has no duplicates, which would make some words come up twice as often', () => {
    const dupes = ANSWERS.filter((w, i) => ANSWERS.indexOf(w) !== i)
    expect(dupes).toEqual([])
  })
})

describe('isAllowedGuess (ADR-0002: English ∪ CS answers)', () => {
  it('accepts everyday English words players open with', () => {
    expect(isAllowedGuess('CRANE')).toBe(true)
    expect(isAllowedGuess('slate')).toBe(true)
  })

  it('accepts CS jargon answers that no English dictionary contains', () => {
    // If these were rejected, a player who knows the answer could not type it.
    for (const w of ['MUTEX', 'ASYNC', 'INODE', 'REGEX']) expect(isAllowedGuess(w)).toBe(true)
  })

  it('accepts every answer in the list', () => {
    expect(ANSWERS.filter((w) => !isAllowedGuess(w))).toEqual([])
  })

  it('rejects letter soup used to probe vowels', () => {
    expect(isAllowedGuess('AEIOU')).toBe(false)
    expect(isAllowedGuess('QQQQQ')).toBe(false)
  })
})

describe('parseWordList', () => {
  it('ignores comments, blank lines and Windows line endings in the curated file', () => {
    // answers.txt is hand-edited on Windows; CRLF must not leak a "\r" into words.
    expect(parseWordList('# header\r\nARRAY\r\n\r\nTREAP   # tree + heap\r\n')).toEqual(['ARRAY', 'TREAP'])
  })
})
