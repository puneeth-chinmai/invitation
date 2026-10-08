import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js + R3F is inherently large; suppress the size warning.
    // Future phases can add dynamic imports for lazy scene loading.
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      output: {
        // Rolldown requires manualChunks as a function (not an object)
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('@react-three')) return 'r3f'
        },
      },
    },
  },
})
