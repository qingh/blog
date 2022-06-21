import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@api', replacement: resolve(__dirname, 'src/api')
      },
      {
        find: '@utils', replacement: resolve(__dirname, 'src/utils')
      },
      {
        find: '@router', replacement: resolve(__dirname, 'src/router')
      },
      {
        find: '@pages', replacement: resolve(__dirname, 'src/pages')
      },
      {
        find: '@context', replacement: resolve(__dirname, 'src/context')
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
