import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from '../src/App.vue'

// These drive the game the way a player does: physical keys on the window.
let wrapper: VueWrapper | undefined
afterEach(() => wrapper?.unmount())

async function typeWord(word: string) {
  for (const key of [...word, 'Enter']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  }
  await nextTick()
}

const rowText = (w: VueWrapper, row: number) =>
  w.findAll('[data-test="tile"]').slice(row * 5, row * 5 + 5).map((t) => t.text()).join('')

describe('App', () => {
  it('lets a player win with the physical keyboard', async () => {
    wrapper = mount(App, { props: { pickAnswer: () => 'CACHE' }, attachTo: document.body })
    await typeWord('stack')
    expect(rowText(wrapper, 0)).toBe('STACK')
    expect(wrapper.find('[data-test="result"]').exists()).toBe(false)

    await typeWord('cache')
    expect(wrapper.find('[data-test="result"]').text()).toContain('Solved in 2/6')
  })

  it('tells the player a word was rejected instead of silently ignoring Enter', async () => {
    wrapper = mount(App, { props: { pickAnswer: () => 'CACHE' }, attachTo: document.body })
    await typeWord('aeiou')
    expect(wrapper.find('[data-test="message"]').text()).toBe('Not in the word list')
  })

  it('reveals the answer when the player runs out of guesses', async () => {
    wrapper = mount(App, { props: { pickAnswer: () => 'MUTEX' }, attachTo: document.body })
    for (let i = 0; i < 6; i++) await typeWord('stack')
    expect(wrapper.find('[data-test="result"]').text()).toContain('MUTEX')
  })
})
