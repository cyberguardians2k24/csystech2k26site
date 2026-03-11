import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './Assets'),
    },
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.mp4', '**/*.webm'],
  build: {
    // Raise the inline-asset threshold so small images stay inlined
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          // Large dependencies — cache-busted independently of app code
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-three':   ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
