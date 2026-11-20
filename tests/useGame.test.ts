import { describe, expect, it } from 'vitest'
import { MAX_GUESSES } from '../src/game/constants'
import { useGame } from '../src/game/useGame'

function play(game: ReturnType<typeof useGame>, word: string) {
  for (const ch of word) game.typeLetter(ch)
  return game.submit()
}

describe('useGame', () => {
  it('ends in a win when the player types the answer', () => {
    const game = useGame(() => 'CACHE')
    expect(play(game, 'STACK')).toEqual({ ok: true })
    expect(play(game, 'CACHE')).toEqual({ ok: true })
    expect(game.status.value).toBe('won')
    expect(game.rows.value).toHaveLength(2)
  })

  it('ends in a loss after the last allowed wrong guess', () => {
    const game = useGame(() => 'CACHE')
    for (let i = 0; i < MAX_GUESSES; i++) play(game, 'STACK')
    expect(game.status.value).toBe('lost')
    // Typing after the game ends does nothing.
    game.typeLetter('A')
    expect(game.current.value).toBe('')
  })

  it('rejects a non-word without using up one of the six rows', () => {
    const game = useGame(() => 'CACHE')
    expect(play(game, 'AEIOU')).toEqual({ ok: false, reason: 'not-a-word' })
    expect(game.rows.value).toHaveLength(0)
    // The letters stay so the player can fix a typo with backspace.
    expect(game.current.value).toBe('AEIOU')
  })

  it('refuses to submit a short guess', () => {
    const game = useGame(() => 'CACHE')
    expect(play(game, 'CAC')).toEqual({ ok: false, reason: 'too-short' })
    expect(game.rows.value).toHaveLength(0)
  })

  it('stops accepting letters once the row is full', () => {
    const game = useGame(() => 'CACHE')
    for (const ch of 'STACKS') game.typeLetter(ch)
    expect(game.current.value).toBe('STACK')
  })

  it('colors keyboard letters from all guesses, keeping the best score', () => {
    const game = useGame(() => 'CACHE')
    play(game, 'TEACH') // E,A,C,H present; T absent
    play(game, 'CACHE') // all correct
    expect(game.letterScores.value.C).toBe('correct')
    expect(game.letterScores.value.T).toBe('absent')
  })

  it('starts over with a fresh answer on new game', () => {
    const answers = ['CACHE', 'STACK']
    const game = useGame(() => answers.shift()!)
    play(game, 'CACHE')
    game.newGame()
    expect(game.status.value).toBe('playing')
    expect(game.rows.value).toHaveLength(0)
    expect(game.answer.value).toBe('STACK')
  })
})
