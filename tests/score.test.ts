import { describe, expect, it } from 'vitest'
import { bestScore, scoreGuess } from '../src/game/score'

// Shorthand so expectations read like the tiles a player sees:
// C = correct (right spot), P = present (wrong spot), _ = absent.
const tiles = (guess: string, answer: string) =>
  scoreGuess(guess, answer)
    .map((s) => (s === 'correct' ? 'C' : s === 'present' ? 'P' : '_'))
    .join('')

describe('scoreGuess', () => {
  it('marks every tile correct when the player solves it', () => {
    expect(tiles('CACHE', 'CACHE')).toBe('CCCCC')
  })

  it('distinguishes right-spot, wrong-spot and missing letters', () => {
    // STACK vs TASKS: no letter is in its spot, but all of S,T,A,K are present.
    expect(tiles('STACK', 'TASKS')).toBe('PPP_P')
  })

  it('does not mark a repeated guess letter present twice when the answer has it once', () => {
    // CLAUDE.md's Fifth Directive example: ARRAY vs CRASH. CRASH has one R and
    // one A. The R at position 2 is exact; the second R must be absent, and of
    // the two A's only the first can claim CRASH's single A.
    expect(tiles('ARRAY', 'CRASH')).toBe('PC___')
  })

  it('lets an exact match claim its letter before an earlier wrong-spot copy can', () => {
    // Guess EERIE vs answer THEME. THEME has two E's (positions 3 and 5). EERIE's last E is exact, so only
    // ONE more E may be "present" — the first — and the second E is absent.
    expect(tiles('EERIE', 'THEME')).toBe('P___C')
  })

  it('marks both copies when the answer really has the letter twice', () => {
    // QUEUE has two U's; guessing UNCUT finds both (one exact, one wrong spot).
    expect(tiles('UNCUT', 'QUEUE')).toBe('P__C_')
  })

  it('is case-insensitive, since keyboard input may arrive lowercase', () => {
    expect(tiles('cache', 'CACHE')).toBe('CCCCC')
  })
})

describe('bestScore (keyboard colors)', () => {
  it('never downgrades a key the player already found in the right spot', () => {
    // Guessing a letter in the wrong spot after finding it must keep the key blue.
    expect(bestScore('correct', 'present')).toBe('correct')
    expect(bestScore('present', 'correct')).toBe('correct')
    expect(bestScore(undefined, 'absent')).toBe('absent')
  })
})
