import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ✅ correct Tailwind plugin for Vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ Tailwind integration via official plugin
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },
})