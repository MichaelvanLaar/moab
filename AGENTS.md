# AGENTS.md

Guidance for any AI coding agent working in this repository.

## Project

Opinionated Astro 6 boilerplate for content-heavy websites.
TypeScript strict, Tailwind v4, Preact for islands, Umami analytics,
VPS with Caddy (primary) with Cloudflare Workers as a switch.

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — static production build
- `pnpm build:node` / `pnpm build:cloudflare` — hybrid SSR builds
- `pnpm preview` — preview the built site
- `pnpm lint` / `pnpm format` / `pnpm typecheck`
- `pnpm check` — typecheck + lint

Add Astro integrations with `pnpm astro add <name>` where available. Do
not hand-edit `astro.config.mjs` for integrations that have an `astro add`
command.

## Architecture Rules

- Astro components by default. Preact **only** for real client-side
  interactivity or state.
- Prefer `client:visible` over `client:load`.
- Content Layer API with `glob` loaders, configured in
  `src/content.config.ts`. Do **not** use the legacy
  `src/content/config.ts` pattern.
- Every image goes through `<Image>` or `<Picture>` from `astro:assets`.
  Never a raw `<img>` tag.
- Zod 4 syntax: `z.email()`, not `z.string().email()`.
- No arbitrary Tailwind values (`text-[#abc123]`). All colors, spacing,
  radii, and shadows come from `src/styles/tokens.css` via the Tailwind
  `@theme` mapping in `src/styles/global.css`.
- No `localStorage` or `sessionStorage` in components — use URL state or
  server state.

## SEO Requirements

Every page must have: `title`, `description`, canonical link, Open Graph
tags, Twitter Card tags. Heading hierarchy is strict (no `h1 → h3`
skips). Content pages ship a JSON-LD block.

## Styling

All tokens live in `src/styles/tokens.css` and are mapped into Tailwind
via `@theme` in `src/styles/global.css`. Brand colors are placeholders —
the project owner replaces them per project.

## Deployment

Primary target: a Linux VPS with Caddy, built statically through a
GitHub Actions workflow that rsyncs `dist/` over SSH. Cloudflare Workers
is available via `DEPLOY_TARGET=cloudflare`. Umami analytics is proxied
first-party via Caddy at `/s.js` and `/api/send` (see
`deploy/Caddyfile.static`).

## Claude Design handoffs

When the prompt starts with "Fetch this design file … implement":

**Tokens.** `src/styles/tokens.css` is designed to be replaced per project — do that. Map the design system's semantic equivalents to moab's existing token names (e.g. design's `--paper` → `--color-bg`, `--ink` → `--color-text`, primary accent → `--color-brand`). For design tokens with no moab equivalent, add them as new `--color-*` entries in `tokens.css` and register them in the `@theme` block in `global.css`. Never reference design-package CSS variable names directly in Astro components; always use moab token names.

**Fonts.** Place `.woff2` files in `public/fonts/` (the directory exists). Add `@font-face` declarations at the top of `tokens.css` using absolute paths (`url('/fonts/filename.woff2')`). Update `--font-sans` and/or `--font-mono` in the `:root` block to reference the new font family.

**Components.** The prototype JSX files are React 18 + Babel, fully client-rendered. Translate to Astro:

- Purely presentational → `.astro` component
- Scroll listeners, toggle state, or `useState`/`useEffect` → Preact `.tsx` island; `client:load` for nav/header, `client:visible` for everything below the fold
- CSS-only alternatives (`:has()`, scroll-driven animations) are preferred over a Preact island when feasible
- Adapt: drop `React.*` globals; use `useState`, `useEffect` from `preact/hooks`

**Assets.** Copy SVGs to `src/assets/images/`. Import inline SVGs directly. Use `<Image>` from `astro:assets` for raster or dimensioned images.

## Don't

- Don't add a CMS, auth, ORM, or UI component library.
- Don't add Husky or lint-staged — Lefthook replaces both.
- Don't add Biome, Vitest, Playwright, or MDX unless explicitly asked.
- Don't commit `node_modules/`, `dist/`, `.astro/`, or `.env`.
- Don't use `--force` flags — fix the underlying issue instead.
