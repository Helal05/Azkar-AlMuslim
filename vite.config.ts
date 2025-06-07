import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '::', // Listen on all available IPv6 and IPv4 addresses
    port: 5176, // Changed port to 5176
  },
  plugins: [
    react(),
    process.env.NODE_ENV === 'development' &&
      componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        manualChunks(id) {
          // Separate large vendor libraries into their own chunks
          if (id.includes('node_modules')) {
            if (
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('react')
            ) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            // Group other node_modules into a general vendor chunk
            return 'vendor';
          }
        },
      },
    },
  },
});
