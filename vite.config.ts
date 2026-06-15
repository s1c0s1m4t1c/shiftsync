import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // ADD THIS LINE: It tells Vite to look for files relative to the current path
})
