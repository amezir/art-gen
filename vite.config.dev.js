import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  optimizeDeps: {
    include: ['tweakpane', '@tweakpane/plugin-essentials']
  },
  build: {
    rollupOptions: {
      input: {
        main: './src/main.js',
      },
    },
  },
});
