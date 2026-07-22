import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyTarget = 'http://172.22.16.166:1998'

const proxyConfig = {
  target: proxyTarget,
  changeOrigin: true,
  configure: (proxy: any) => {
    proxy.on('proxyReq', (proxyReq: any, req: any) => {
      const auth = req.headers['authorization']
      if (auth) {
        proxyReq.setHeader('Authorization', auth)
      }
    })
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    browser: 'chrome',
    proxy: {
      '/auth': proxyConfig,
      '/components': proxyConfig,
      '/ships': proxyConfig,       
    }
  }
})
