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
        find: '@pages', replacement: resolve(__dirname, 'src/pages')
      }
    ]
  },
  server: {
    port: 3001
    // https: true,
    // '/api/v1': 'https://localhost:8888'
    // proxy: {
    //   '/api/v1': {
    //     target: 'https://localhost:8888',
    //     changeOrigin: true,
    //     secure: false,
    //     ws: true
    //   }
    // }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
