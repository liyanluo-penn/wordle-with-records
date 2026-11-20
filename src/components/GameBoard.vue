<script setup lang="ts">
import { computed } from 'vue'
import type { LetterScore } from '../game/score'
import type { ScoredRow } from '../game/useGame'

const props = defineProps<{
  rows: ScoredRow[]
  current: string
  wordLength: number
  maxGuesses: number
  shake: boolean
}>()

interface Cell {
  letter: string
  score?: LetterScore
}

const SCORE_LABEL: Record<LetterScore, string> = {
  correct: 'right spot',
  present: 'in the word, wrong spot',
  absent: 'not in the word',
}

// Every row on the board: submitted ones, the one being typed, then blanks.
const grid = computed<Cell[][]>(() => {
  const out: Cell[][] = props.rows.map((r) =>
    [...r.word].map((letter, i) => ({ letter, score: r.scores[i] })),
  )
  if (out.length < props.maxGuesses) {
    out.push(Array.from({ length: props.wordLength }, (_, i) => ({ letter: props.current[i] ?? '' })))
  }
  while (out.length < props.maxGuesses) {
    out.push(Array.from({ length: props.wordLength }, () => ({ letter: '' })))
  }
  return out
})

function cellLabel(cell: Cell): string {
  if (!cell.letter) return 'empty'
  return cell.score ? `${cell.letter}, ${SCORE_LABEL[cell.score]}` : cell.letter
}
</script>

<template>
  <div class="board" role="grid" aria-label="Guesses">
    <div
      v-for="(row, r) in grid"
      :key="r"
      class="row"
      :class="{ shake: shake && r === rows.length }"
      :style="{ gridTemplateColumns: `repeat(${wordLength}, var(--tile))` }"
      role="row"
    >
      <div
        v-for="(cell, c) in row"
        :key="c"
        class="tile"
        :class="[cell.score, { filled: cell.letter && !cell.score }]"
        role="gridcell"
        :aria-label="cellLabel(cell)"
        data-test="tile"
      >
        {{ cell.letter }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  gap: 6px;
  justify-content: center;
}

.row {
  display: grid;
  gap: 6px;
}

.tile {
  width: var(--tile);
  height: var(--tile);
  display: grid;
  place-items: center;
  border: 2px solid var(--line);
  border-radius: 4px;
  font-size: calc(var(--tile) * 0.5);
  font-weight: 700;
  text-transform: uppercase;
  user-select: none;
}

.tile.filled {
  border-color: var(--muted);
}

.tile.correct {
  background: var(--correct);
  border-color: var(--correct);
  color: #fff;
}

/* dashed border: a second, non-color cue for "in the word, wrong spot" */
.tile.present {
  background: var(--present);
  border: 2px dashed #fff8;
  color: #1a1300;
}

.tile.absent {
  background: var(--absent);
  border-color: var(--absent);
  color: var(--muted);
}

.shake {
  animation: shake 0.35s;
}

@keyframes shake {
  20%,
  60% {
    transform: translateX(-6px);
  }
  40%,
  80% {
    transform: translateX(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shake {
    animation: none;
  }
}
</style>
