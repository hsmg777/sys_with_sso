import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react() ],
  server: {
    host: true,           // ya lo tenías
    watch: {
      // fuerza a usar polling para detectar cambios en Docker
      usePolling: true,
      // cada cuánto mira (en ms), puedes dejarlo en 100
      interval: 100
    }
  }
})
