import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy /api → production Strapi API endpoint
      '/api': {
        target: 'https://craftflow.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
