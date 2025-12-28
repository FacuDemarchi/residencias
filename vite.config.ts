import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Use default chunking to avoid interop issues with CJS/ESM in vendor bundles
    }
  }
})
