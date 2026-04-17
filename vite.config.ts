import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vite configuration for hrnet-modal library
 *
 * Builds to:
 * - dist/index.js (ES module)
 * - dist/index.d.ts (TypeScript declarations)
 *
 * Library mode: exposes Modal and SignupModal as exports
 */
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'build'
      ? dts({
          include: ['src'],
          outDir: 'dist',
          entryRoot: 'src',
          exclude: ['src/demo/**'],
        })
      : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build:
    command === 'build'
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'HrnetModal',
            fileName: (format) => `index.${format === 'cjs' ? 'cjs' : 'js'}`,
            formats: ['es', 'cjs'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'react/jsx-runtime': 'ReactJSXRuntime',
              },
            },
          },
          sourcemap: true,
          minify: 'terser',
        }
      : {
          outDir: 'dist-demo',
        },
  server:
    command === 'serve'
      ? {
          open: true,
          port: 5173,
        }
      : undefined,
}));
