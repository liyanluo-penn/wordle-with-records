/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// ADR-0001: deployed as a GitHub Pages *project* site, served from
// https://<user>.github.io/wordle-with-records/ — not the domain root.
// Without this `base`, the built page requests /assets/... and renders blank
// in production while `npm run dev` looks fine. If the repo is renamed,
// change this string in the same commit.
export default defineConfig({
  base: '/wordle-with-records/',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
