<script setup lang="ts">
import type { LetterScore } from '../game/score'

defineProps<{ letterScores: Record<string, LetterScore> }>()
const emit = defineEmits<{ key: [key: string] }>()

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]
</script>

<template>
  <div class="keyboard" aria-label="Keyboard">
    <div v-for="(row, i) in ROWS" :key="i" class="krow">
      <!-- mousedown.prevent: a clicked key must not keep focus, or the next
           physical Enter would "click" it again instead of submitting -->
      <button
        v-for="k in row"
        :key="k"
        type="button"
        class="key"
        :class="[letterScores[k], { wide: k.length > 1 }]"
        :aria-label="k === 'BACKSPACE' ? 'Backspace' : k === 'ENTER' ? 'Enter' : k"
        @mousedown.prevent
        @click="emit('key', k)"
      >
        {{ k === 'BACKSPACE' ? '⌫' : k === 'ENTER' ? 'enter' : k }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  display: grid;
  gap: 6px;
  width: 100%;
  max-width: 500px;
}

.krow {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.key {
  flex: 1 1 0;
  min-width: 0;
  height: 52px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--key);
  color: var(--text);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.key.wide {
  flex: 1.6 1 0;
  font-size: 0.75rem;
}

.key:focus-visible {
  outline: 2px solid var(--correct);
  outline-offset: 2px;
}

.key.correct {
  background: var(--correct);
  border-color: var(--correct);
  color: #fff;
}

.key.present {
  background: var(--present);
  border: 1px dashed #fff8;
  color: #1a1300;
}

.key.absent {
  background: var(--absent);
  color: var(--muted);
  opacity: 0.6;
}
</style>
