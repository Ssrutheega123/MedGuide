import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/health': 'http://127.0.0.1:8000',
      '/ask': 'http://127.0.0.1:8000',
      '/sessions': 'http://127.0.0.1:8000',
      '/upload': 'http://127.0.0.1:8000',
      '/ingest': 'http://127.0.0.1:8000',
    },
  },
})
