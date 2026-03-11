import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'jc-logo-512.png'],
      manifest: {
        name: 'Javed Computers',
        short_name: 'Javed Cafe',
        description: 'Authorized CSC & Digital Service Center',
        theme_color: '#0F172A',
        background_color: '#0F172A',
        display: 'standalone',
        icons: [
          {
            src: 'jc-logo-512.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'jc-logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'jc-logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    }),
  ],
})
