import { beforeEach, describe, expect, it } from 'vitest'
import { loadRecent, pickRandomAnswer, rememberAnswer } from '../src/game/picker'

describe('unlimited-mode answer picker (ADR-0003)', () => {
  beforeEach(() => localStorage.clear())

  it('does not repeat a recently shown answer while fresh ones remain', () => {
    const pool = ['ARRAY', 'STACK', 'QUEUE']
    for (let i = 0; i < 20; i++) {
      expect(pickRandomAnswer(pool, ['ARRAY', 'STACK'])).toBe('QUEUE')
    }
  })

  it('still returns a word once every answer has been seen', () => {
    // A player who has seen the whole pool must not get stuck with no puzzle.
    const pool = ['ARRAY', 'STACK']
    expect(pool).toContain(pickRandomAnswer(pool, ['ARRAY', 'STACK']))
  })

  it('remembers answers across page loads, most recent first', () => {
    rememberAnswer('ARRAY')
    rememberAnswer('STACK')
    rememberAnswer('ARRAY')
    expect(loadRecent()).toEqual(['ARRAY', 'STACK'])
  })

  it('survives corrupted saved data instead of breaking the game', () => {
    localStorage.setItem('cache-hit:recent-answers', '{not json')
    expect(loadRecent()).toEqual([])
  })
})
