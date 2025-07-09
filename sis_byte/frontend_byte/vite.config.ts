import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  optimizeDeps: {
    include: ['crypto-js'], // 👈 fuerza a incluir crypto-js
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // 👈 permite módulos CJS
    },
  },
})
