# sample-lit-design-system

A small [Lit](https://lit.dev) design system and a Pokédex web app that consumes
it, in one npm workspaces monorepo.

- **`packages/design-system`** — the component library (`@lit-ds/design-system`),
  documented in Storybook.
- **`apps/pokedex`** — a Vite app hitting the live [PokeAPI](https://pokeapi.co),
  built entirely out of design-system components.

## Getting started

```bash
npm install

npm run dev         # Pokédex app on http://localhost:5173
npm run storybook   # Component docs on http://localhost:6006
```

Both can run at once. The app imports the design system's **source**, so editing
a component hot-reloads the app immediately.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Pokédex dev server |
| `npm run storybook` | Storybook dev server |
| `npm run build` | Build the library, then the app |
| `npm run build:storybook` | Static Storybook into `packages/design-system/storybook-static` |
| `npm run typecheck` | `tsc --noEmit` across every workspace |
| `npm test` | Vitest, across every workspace |

## Adding a component

1. Create `packages/design-system/src/components/ds-thing.ts`. Copy the shape of
   `ds-button.ts`: `@customElement`, `static styles`, `@property` fields with
   reflected attributes, a `declare global` entry for the tag name.
2. Style against the `--ds-*` custom properties in `src/styles/tokens.css`, with
   a literal fallback in each `var()` so the component works unthemed.
3. Export it from `src/index.ts`.
4. Add `ds-thing.stories.ts` alongside it, and `ds-thing.test.ts` if it has
   behaviour worth pinning down.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, tests,
builds both halves, and publishes them to GitHub Pages as one site:

- `/` — the Pokédex
- `/design-system/` — Storybook

The base path is derived from the repo name at build time, so renaming the repo
needs no config change. Pull requests run the same build without deploying.

**One-time setup:** in the repo, go to *Settings → Pages* and set **Source** to
**GitHub Actions**.

## Notes on the setup

- **Decorators.** `tsconfig.base.json` uses `experimentalDecorators` with
  `useDefineForClassFields: false`, which is the config esbuild (and therefore
  Vite) supports. Standard decorators plus the `accessor` keyword would need a
  different toolchain.
- **`lit` is external** to the library build, so the app ships exactly one copy.
  Two copies means two `ReactiveElement` base classes and duplicate registrations.
- **The Pokédex tiles are intentionally plain markup.** They're placeholders
  marked with `TODO`, waiting to be replaced by real `ds-card` / `ds-badge`
  components.
