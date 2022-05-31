import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/admin',
  resolve: {
    alias: [
      {
        find: '@api', replacement: resolve(__dirname, 'src/api')
      },
      {
        find: '@pages', replacement: resolve(__dirname, 'src/pages')
      }
    ]
  },
  server: {
    port: 3001
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
