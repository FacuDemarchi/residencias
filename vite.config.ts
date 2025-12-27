import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@chakra-ui')) return 'chakra';
            if (id.includes('@ark-ui')) return 'ark';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react-router') || id.includes('react-dom')) return 'react-router';
            if (id.includes('react')) return 'react';
          }
        }
      }
    }
  }
})
