export type LetterScore = 'correct' | 'present' | 'absent'

/**
 * Score a guess against the answer, letter by letter.
 *
 * Two passes, because repeated letters are where naive scoring goes wrong:
 *   1. exact matches claim their letter first;
 *   2. remaining guess letters may mark "present" only while unclaimed copies
 *      of that letter are left in the answer.
 * So ARRAY vs CRASH gives one "correct" R (position 2) and the second R is
 * "absent", because CRASH only has one R to give.
 */
export function scoreGuess(guess: string, answer: string): LetterScore[] {
  if (guess.length !== answer.length) {
    throw new Error(`guess "${guess}" and answer "${answer}" differ in length`)
  }
  const g = guess.toUpperCase()
  const a = answer.toUpperCase()
  const result: LetterScore[] = new Array(g.length).fill('absent')
  const unclaimed = new Map<string, number>()

  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) result[i] = 'correct'
    else unclaimed.set(a[i], (unclaimed.get(a[i]) ?? 0) + 1)
  }
  for (let i = 0; i < g.length; i++) {
    if (result[i] === 'correct') continue
    const left = unclaimed.get(g[i]) ?? 0
    if (left > 0) {
      result[i] = 'present'
      unclaimed.set(g[i], left - 1)
    }
  }
  return result
}

const RANK: Record<LetterScore, number> = { absent: 0, present: 1, correct: 2 }

/** The better of two scores, used so a keyboard key never "downgrades". */
export function bestScore(a: LetterScore | undefined, b: LetterScore): LetterScore {
  return a === undefined || RANK[b] > RANK[a] ? b : a
}
