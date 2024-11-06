import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'https://672b2d17568bbbad9c48.appwrite.global'
    },
  },
  plugins: [react()],
})
