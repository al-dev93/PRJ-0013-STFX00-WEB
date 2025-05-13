import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/csrf': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/csrf/, '/functions/v1/csrf'),
        secure: false,
      },
      '/contact': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/contact/, '/functions/v1/contact'),
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@images': resolve(__dirname, 'src/assets/images'),
      '@styles': resolve(__dirname, 'src/assets/styles'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@services': resolve(__dirname, 'src/services'),
      '@secure': resolve(__dirname, 'src/services/secure'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});
