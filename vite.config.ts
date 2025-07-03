import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-renderer"
  },
  server: {
    port: 5777,
    strictPort: true
  },
  resolve: {
    alias: {
      "app": path.resolve(__dirname, 'src'),
      "main": path.resolve(__dirname, 'src/main'),
      "renderer": path.resolve(__dirname, 'src/renderer'),
      "__assets": path.resolve(__dirname, 'assets'),
    }
  }
})
