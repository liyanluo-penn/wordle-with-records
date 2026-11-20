<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import GameBoard from './components/GameBoard.vue'
import KeyBoard from './components/KeyBoard.vue'
import { GAME_TITLE, MAX_GUESSES, WORD_LENGTH } from './game/constants'
import { loadRecent, pickRandomAnswer, rememberAnswer } from './game/picker'
import { useGame } from './game/useGame'
import { ANSWERS } from './game/words'

// Tests pass a fixed picker; the real page uses unlimited mode's random one.
const props = defineProps<{ pickAnswer?: () => string }>()

const pick =
  props.pickAnswer ??
  (() => {
    const word = pickRandomAnswer(ANSWERS, loadRecent())
    rememberAnswer(word)
    return word
  })

const game = useGame(pick)
const { rows, current, status, answer, letterScores } = game

const message = ref('')
const shake = ref(false)
let messageTimer: ReturnType<typeof setTimeout> | undefined

function flash(text: string) {
  message.value = text
  shake.value = true
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => {
    message.value = ''
    shake.value = false
  }, 1500)
}

function press(key: string) {
  if (key === 'ENTER') {
    const result = game.submit()
    if (!result.ok && result.reason === 'too-short') flash('Not enough letters')
    if (!result.ok && result.reason === 'not-a-word') flash('Not in the word list')
  } else if (key === 'BACKSPACE') {
    game.backspace()
  } else {
    game.typeLetter(key)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (e.key === 'Enter') {
    // preventDefault stops a focused button (e.g. "new game") from also
    // activating, so one Enter press does exactly one thing.
    e.preventDefault()
    if (status.value === 'playing') press('ENTER')
    else newGame()
  } else if (e.key === 'Backspace') {
    press('BACKSPACE')
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    press(e.key.toUpperCase())
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(messageTimer)
})

const newGameButton = ref<HTMLButtonElement>()
watch(status, (s) => {
  if (s !== 'playing') queueMicrotask(() => newGameButton.value?.focus())
})

function newGame() {
  message.value = ''
  game.newGame()
}
</script>

<template>
  <main class="app">
    <header>
      <h1><span class="prompt">$</span> {{ GAME_TITLE.toLowerCase().replace(' ', '-') }}<span class="cursor">_</span></h1>
      <p class="tagline">Guess the five-letter computer-science word in {{ MAX_GUESSES }} tries.</p>
    </header>

    <GameBoard
      :rows="rows"
      :current="current"
      :word-length="WORD_LENGTH"
      :max-guesses="MAX_GUESSES"
      :shake="shake"
    />

    <p class="message" role="status" aria-live="polite" data-test="message">{{ message }}</p>

    <section v-if="status !== 'playing'" class="result" data-test="result">
      <p v-if="status === 'won'">
        <strong>Cache hit!</strong> Solved in {{ rows.length }}/{{ MAX_GUESSES }}.
      </p>
      <p v-else>
        <strong>Cache miss.</strong> The word was <code>{{ answer }}</code>.
      </p>
      <button ref="newGameButton" type="button" class="again" @click="newGame">new game</button>
    </section>

    <KeyBoard :letter-scores="letterScores" @key="press" />

    <footer>
      <p class="legend">
        <span class="chip correct">A</span> right spot
        <span class="chip present">A</span> in the word
        <span class="chip absent">A</span> not in it
      </p>
    </footer>
  </main>
</template>

<style scoped>
.app {
  --tile: min(14vw, 58px);
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

header {
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
  letter-spacing: 0.02em;
}

.prompt {
  color: var(--correct);
}

.cursor {
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}

.tagline {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.message {
  min-height: 1.4em;
  margin: 0;
  color: var(--present);
}

.result {
  text-align: center;
}

.result p {
  margin: 0 0 8px;
}

code {
  color: var(--correct);
  font-weight: 700;
}

.again {
  padding: 8px 18px;
  border: 1px solid var(--correct);
  border-radius: 5px;
  background: transparent;
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

.again:hover,
.again:focus-visible {
  background: var(--correct);
  color: #fff;
}

.legend {
  margin: 0;
  color: var(--muted);
  font-size: 0.8rem;
}

.chip {
  display: inline-grid;
  place-items: center;
  width: 1.4em;
  height: 1.4em;
  margin: 0 2px 0 10px;
  border-radius: 3px;
  font-weight: 700;
}

.chip.correct {
  background: var(--correct);
  color: #fff;
}

.chip.present {
  background: var(--present);
  outline: 1px dashed #fff8;
  outline-offset: -3px;
  color: #1a1300;
}

.chip.absent {
  background: var(--absent);
  color: var(--muted);
}
</style>
