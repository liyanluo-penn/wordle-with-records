// ADR-0002 (QST-WORD-LENGTH answered A): five letters for v1. This is the one
// place the length lives, so variable-length puzzles stay a contained change.
export const WORD_LENGTH = 5
export const MAX_GUESSES = 6

// Working title. The public name is still an open follow-up in ADR-0003.
// It must be our own, not "Wordle".
export const GAME_TITLE = 'Cache Hit'
