/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // The AI relay (relay/) is a separate Cloudflare Worker with its own tests.
  test: { exclude: ['relay/**', 'node_modules/**'] },
})
