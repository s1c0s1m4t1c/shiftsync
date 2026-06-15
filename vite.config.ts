import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change base to '/' (absolute root)
  base: '/', 
  build: {
    outDir: 'dist',
  }
})
