import { computed, ref } from 'vue'
import { MAX_GUESSES, WORD_LENGTH } from './constants'
import { bestScore, scoreGuess, type LetterScore } from './score'
import { isAllowedGuess } from './words'

export interface ScoredRow {
  word: string
  scores: LetterScore[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'too-short' | 'not-a-word' | 'game-over' }

/**
 * The game engine, shared by every play mode (ADR-0003): it only needs a way
 * to get an answer. Unlimited mode passes a random picker; daily mode will
 * pass a date-based one.
 */
export function useGame(pickAnswer: () => string) {
  const answer = ref(pickAnswer())
  const rows = ref<ScoredRow[]>([])
  const current = ref('')
  const status = ref<GameStatus>('playing')

  /** Best score seen per letter, for coloring the on-screen keyboard. */
  const letterScores = computed(() => {
    const map: Record<string, LetterScore> = {}
    for (const row of rows.value) {
      row.scores.forEach((s, i) => {
        map[row.word[i]] = bestScore(map[row.word[i]], s)
      })
    }
    return map
  })

  function typeLetter(letter: string) {
    if (status.value !== 'playing') return
    if (!/^[A-Za-z]$/.test(letter)) return
    if (current.value.length >= WORD_LENGTH) return
    current.value += letter.toUpperCase()
  }

  function backspace() {
    if (status.value !== 'playing') return
    current.value = current.value.slice(0, -1)
  }

  function submit(): SubmitResult {
    if (status.value !== 'playing') return { ok: false, reason: 'game-over' }
    const word = current.value
    if (word.length < WORD_LENGTH) return { ok: false, reason: 'too-short' }
    // A rejected word does not use up a row.
    if (!isAllowedGuess(word)) return { ok: false, reason: 'not-a-word' }

    const scores = scoreGuess(word, answer.value)
    rows.value.push({ word, scores })
    current.value = ''
    if (word === answer.value) status.value = 'won'
    else if (rows.value.length >= MAX_GUESSES) status.value = 'lost'
    return { ok: true }
  }

  function newGame() {
    answer.value = pickAnswer()
    rows.value = []
    current.value = ''
    status.value = 'playing'
  }

  return { answer, rows, current, status, letterScores, typeLetter, backspace, submit, newGame }
}
