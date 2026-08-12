import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * Library build for the design system.
 *
 * `lit` stays external so that the consuming app ships exactly one copy of it —
 * two copies means two `ReactiveElement` base classes and duplicate custom
 * element registrations.
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [/^lit($|\/)/],
      output: {
        // Keep the token sheet at a stable, importable path: `@lit-ds/design-system/tokens.css`.
        assetFileNames: 'tokens[extname]',
      },
    },
    sourcemap: true,
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist before this runs.
    emptyOutDir: false,
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
});
