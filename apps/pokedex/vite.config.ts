import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * The app consumes the design system's *source*, not its built `dist`. That
 * gives real HMR when editing a component, and Vite compiles the TypeScript
 * either way. The published `exports` map in the package still points at
 * `dist`, so the library stays consumable by anything outside this repo.
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  resolve: {
    alias: {
      '@lit-ds/design-system': resolve(
        import.meta.dirname,
        '../../packages/design-system/src/index.ts',
      ),
    },
  },
  server: {
    open: true,
  },
});
