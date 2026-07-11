import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    browser: 'chrome',
    proxy: {
      '/auth': {
        target: 'http://172.22.16.94:1998',
        changeOrigin: true,
      },
      '/components': {
        target: 'http://172.22.16.94:1998',
        changeOrigin: true,
      }
    }
  }
})
