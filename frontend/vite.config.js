import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to backend (avoids CORS issues in dev)
    proxy: {
      '/api': {
        target: 'https://prepgenius-ai-eeee.onrender.com',
        changeOrigin: true
      }
    }
  }
})
