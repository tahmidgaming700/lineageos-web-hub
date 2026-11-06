import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves this project from /<repository>/ rather than the
// account root. Keep this value in sync with the repository name.
const base = '/lineageos-web-hub/';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      base,
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        id: base,
        name: 'LineageOS Web Hub',
        short_name: 'LineageHub',
        description: 'Android ROM discovery, downloads, firmware information and developer tools.',
        theme_color: '#006874',
        background_color: '#0f1415',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: `${base}icon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
