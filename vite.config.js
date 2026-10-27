import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Clinic_Web/' : '/',
  plugins: [react()],
  build: {
    // Two pages: the public website and the staff portal at /admin/.
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'),
        admin: path.resolve(process.cwd(), 'admin/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
});
