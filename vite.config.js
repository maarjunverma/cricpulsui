import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy /api → Strapi CMS on port 1337
      // In production (cricpulse.craftflow.in), set VITE_API_BASE_URL=https://craftflow.in/api
      // so fetch() calls go directly to Strapi (no proxy needed in nginx)
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
      },
    },
  },
})

