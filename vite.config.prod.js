import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
	server: {
		open: 'index.html',
    rollupOptions: {
			// https://rollupjs.org/configuration-options/
    },
  },
  build: {
    rollupOptions: {
      input: {
				main: './src/main.js',
      },
    },
  },
	esbuild: {
		keepNames: false,
		legalComments: 'none',
		treeShaking: true,
		minify: true,
		minifySyntax: true,
		minifyIdentifiers: true,
	},
	// base: process.env.NODE_ENV === 'production' ? '/' : '/',
});
