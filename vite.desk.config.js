import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone build for the Windows folder. Asset URLs stay relative so the
// folder can be served from any localhost port without a site root.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  build: {
    outDir: 'release/sri-rudra-desk',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(process.cwd(), 'desk.html'),
    },
  },
});
