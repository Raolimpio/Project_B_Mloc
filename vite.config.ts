import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true,
    },
    force: true
  },
  clearScreen: false,
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: []
    },
  }
});