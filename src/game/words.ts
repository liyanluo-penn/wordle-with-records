import answersRaw from '../data/answers.txt?raw'
import englishRaw from '../data/english-5.txt?raw'

// ADR-0002: answers are hand-curated CS terms; a legal guess is any English
// five-letter word (SCOWL levels ≤60, see src/data/SCOWL-COPYRIGHT.txt) OR any
// answer. The union is what lets jargon answers like MUTEX be typed at all.

/** Parse a word file: one word per line, `#` starts a comment. */
export function parseWordList(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, '').trim().toUpperCase())
    .filter(Boolean)
}

export const ANSWERS: readonly string[] = parseWordList(answersRaw)

const ALLOWED = new Set<string>([...parseWordList(englishRaw), ...ANSWERS])

export function isAllowedGuess(word: string): boolean {
  return ALLOWED.has(word.toUpperCase())
}
