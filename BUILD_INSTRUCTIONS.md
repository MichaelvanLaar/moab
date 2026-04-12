# Build Instructions: Astro Boilerplate

You are working in an empty repository. Build an opinionated Astro boilerplate for content-heavy websites according to the specification below. Execute it step by step and verify each phase before moving to the next.

## Target Stack

- **Astro 6** (SSG by default, hybrid SSR optional via env var)
- **TypeScript** strict mode
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Preact** for interactive islands
- **pnpm** as package manager
- **Lefthook** for git hooks
- **ESLint v9** (flat config) + **Prettier** with Astro and Tailwind plugins
- **Umami** analytics (self-hosted, first-party proxied)
- **Caddy** deployment on a Hetzner VPS (primary), Cloudflare Workers switchable via env var

## Ground Rules

- Use `pnpm` for all package operations. Never fall back to `npm` or `yarn`.
- Use `npx astro add <pkg>` when adding official Astro integrations. Do not hand-edit `astro.config.mjs` for integrations that have an `astro add` command.
- TypeScript strict mode is non-negotiable. Every file is `.ts` or `.astro`, never plain `.js`, except for config files where the tooling requires it (e.g. `eslint.config.js`).
- Use Zod 4 syntax (`z.email()`, not `z.string().email()`).
- Use Astro Content Layer API with `glob` loaders. Do not use the legacy `src/content/config.ts` pattern.
- Use `<Image>` / `<Picture>` from `astro:assets` for every image. Never raw `<img>`.
- Prefer `client:visible` over `client:load` for islands.
- Default to Astro components. Only use Preact where actual client-side state or interactivity is required.

## Phase 1: Project Initialization

1. Run `pnpm create astro@latest . --template minimal --typescript strict --no-install --no-git`.
2. Install dependencies with `pnpm install`.
3. Add integrations in this exact order:
   ```
   pnpm astro add preact
   pnpm astro add sitemap
   ```
4. Install Tailwind v4 manually (it is not added via `astro add` in v4):
   ```
   pnpm add -D tailwindcss @tailwindcss/vite @tailwindcss/typography
   ```
5. Add dev tooling:
   ```
   pnpm add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
   pnpm add -D eslint@latest eslint-plugin-astro @typescript-eslint/parser @typescript-eslint/eslint-plugin
   pnpm add -D lefthook
   ```
6. Initialize Lefthook: `pnpm exec lefthook install`.

**Acceptance:** `pnpm dev` starts without errors. `package.json` has no dependencies under `dependencies` that should be dev-only.

## Phase 2: Core Configuration

### `astro.config.mjs`

Create an adaptive config that switches deployment target based on `DEPLOY_TARGET` env var (`static` | `node` | `cloudflare`, default `static`). The config must:

- Import `@tailwindcss/vite` and register it under `vite.plugins`.
- Register the Preact integration.
- Register the sitemap integration.
- Declare `site` from an env var (`SITE_URL`).
- Configure `i18n` with `locales: ['de', 'en']`, `defaultLocale: 'de'`, `routing: { prefixDefaultLocale: false }`.
- Use the typed `env.schema`:
  - `SITE_URL` — server, public, required
  - `UMAMI_WEBSITE_ID` — client, public, optional
- Enable `security.csp: true`.
- Conditionally add `@astrojs/node` (standalone mode) or `@astrojs/cloudflare` only when the corresponding target is selected. Install them conditionally — do not add them to `package.json` unless needed. Add a comment explaining this.

### `tsconfig.json`

Extend `astro/tsconfigs/strict`. Set path alias `@/*` → `./src/*`.

### `.editorconfig`, `.prettierrc.json`, `.gitignore`

- `.editorconfig`: UTF-8, LF, 2 spaces, final newline, trim trailing whitespace.
- `.prettierrc.json`: plugins for Astro and Tailwind. 2 spaces, single quotes, no semicolons omitted (use semicolons), print width 100.
- `.gitignore`: include standard Node/Astro ignores. Explicitly ignore `node_modules/`, `dist/`, `.astro/`, `.env`, `.env.*` (except `.env.example`).

### `eslint.config.js`

Flat config. Include `eslint-plugin-astro`, TypeScript rules, ignore `dist/` and `.astro/`.

### `lefthook.yml`

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx,astro}"
      run: pnpm exec eslint --fix {staged_files}
      stage_fixed: true
    format:
      glob: "*.{ts,tsx,js,jsx,json,md,css,astro}"
      run: pnpm exec prettier --write {staged_files}
      stage_fixed: true
    typecheck:
      run: pnpm exec astro check
```

### `package.json` scripts

```
dev, build, preview, lint, format, typecheck, check
build:static, build:node, build:cloudflare (each setting DEPLOY_TARGET)
```

**Acceptance:** `pnpm typecheck` passes, `pnpm lint` passes, `pnpm build` produces a `dist/` folder.

## Phase 3: Directory Structure

Create this structure. Empty directories get a `.gitkeep`.

```
.claude/
  settings.json
  skills/
.github/
  prompts/
  workflows/
    deploy-vps.yml
    deploy-preview.yml
deploy/
  Caddyfile.static
  Caddyfile.ssr
  wrangler.jsonc
public/
  .well-known/
    security.txt
  humans.txt
  robots.txt
  favicon.svg
src/
  assets/images/
  components/
    analytics/
      Analytics.astro
    layout/
      HamburgerMenu.astro
    seo/
      SEO.astro
    sections/
    ui/
  content/
    blog/
    pages/
  content.config.ts
  i18n/
    ui.ts
    utils.ts
  layouts/
    BaseLayout.astro
    BlogPost.astro
  lib/
  pages/
    404.astro
    500.astro
    api/
    blog/
      index.astro
      [...slug].astro
    index.astro
    rss.xml.ts
  plugins/
    remark-reading-time.mjs
  styles/
    global.css
    tokens.css
AGENTS.md
CLAUDE.md
README.md
```

## Phase 4: Design Tokens and Styling

### `src/styles/tokens.css`

Define all design tokens as CSS custom properties under `:root`, with a `@media (prefers-color-scheme: dark)` block for dark mode. Include:

- **Brand colors:** `--color-brand`, `--color-brand-contrast`, `--color-accent`, `--color-accent-contrast` — each in light and dark variants.
- **Semantic colors:** `--color-bg`, `--color-bg-subtle`, `--color-text`, `--color-text-muted`, `--color-border`.
- **Typography scale:** `--font-size-xs` through `--font-size-4xl` using a modular scale (1.2 ratio).
- **Spacing scale:** `--space-1` through `--space-16` using a 4px base.
- **Radii:** `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`.
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

Use placeholder neutral brand colors (e.g. a blue and a warm gray) with clear comments indicating they must be replaced per project.

### `src/styles/global.css`

```css
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --color-brand: var(--color-brand);
  --color-brand-contrast: var(--color-brand-contrast);
  /* map all tokens into Tailwind's @theme */
}

/* base resets, focus styles, skip-link */
```

Include a visible-on-focus skip-link style. Include sensible `:focus-visible` outlines. Do not use Tailwind's `@apply` outside this file.

**Acceptance:** Building produces a single CSS bundle that references the tokens. Dark mode toggles correctly when the OS preference changes.

## Phase 5: Layouts and Core Components

### `src/layouts/BaseLayout.astro`

- Accepts props: `title`, `description`, `image?`, `canonical?`, `noindex?`.
- Renders `<html lang={locale}>` with correct `dir`.
- Includes `<SEO>` component in `<head>`.
- Includes `<Analytics>` component in `<head>` (before `</head>`).
- Imports `global.css`.
- Renders `<ClientRouter />` from `astro:transitions`.
- Contains a skip-link as the first focusable element.
- Uses semantic landmarks: `<header>`, `<main id="main">`, `<footer>`.
- Leaves a named slot for header, footer, and default slot for page content.

### `src/components/seo/SEO.astro`

Emits: `<title>`, `<meta name="description">`, canonical link, Open Graph tags, Twitter Card tags, optional `noindex`, and a JSON-LD block for `WebSite` schema.

### `src/components/analytics/Analytics.astro`

Exactly this pattern:

```astro
---
import { UMAMI_WEBSITE_ID } from 'astro:env/client';
const isProd = import.meta.env.PROD;
---
{isProd && UMAMI_WEBSITE_ID && (
  <script
    is:inline
    defer
    src="/s.js"
    data-website-id={UMAMI_WEBSITE_ID}
    data-host-url={Astro.site?.origin}
  />
)}
```

### `src/components/layout/HamburgerMenu.astro`

CSS-only hamburger menu using a hidden checkbox pattern. Accessible (proper `<label>`, `aria-expanded` via `:has()` where possible, keyboard operable). No JavaScript.

### `src/layouts/BlogPost.astro`

Extends `BaseLayout`. Renders post title, publish date, reading time, tags, hero image via `<Image>`, and `<slot />` for content. Applies prose styling via `@tailwindcss/typography`.

### `src/pages/404.astro` and `src/pages/500.astro`

Minimal, styled, use `BaseLayout`, include link back to home.

## Phase 6: Content Collections

### `src/content.config.ts`

Define two collections using `glob` loaders:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { blog, pages };
```

Create one example blog post at `src/content/blog/hello-world.md` with valid frontmatter so the build does not fail on empty collection.

### `src/pages/blog/index.astro` and `[...slug].astro`

- `index.astro`: lists published posts (filter out `draft: true`), sorted by `pubDate` desc.
- `[...slug].astro`: renders a single post using `BlogPost` layout, uses `getStaticPaths`, filters drafts in prod builds only.

### `src/pages/rss.xml.ts`

Generate RSS feed from the blog collection using `@astrojs/rss`. Install if not already present: `pnpm astro add rss`.

### `src/plugins/remark-reading-time.mjs`

Custom remark plugin that calculates reading time and injects it into frontmatter as `data.astro.frontmatter.readingTime`. Register in `astro.config.mjs` under `markdown.remarkPlugins`.

## Phase 7: Internationalization

### `src/i18n/ui.ts`

Simple typed dictionary:

```ts
export const languages = { de: 'Deutsch', en: 'English' } as const;
export const defaultLang = 'de' as const;

export const ui = {
  de: { 'nav.home': 'Start', 'nav.blog': 'Blog', /* ... */ },
  en: { 'nav.home': 'Home', 'nav.blog': 'Blog', /* ... */ },
} as const;
```

### `src/i18n/utils.ts`

Export `getLangFromUrl(url)` and `useTranslations(lang)` following the pattern from the Astro docs i18n recipe.

## Phase 8: Static Files

- `public/robots.txt`: allow all, reference `${SITE_URL}/sitemap-index.xml`.
- `public/humans.txt`: minimal template with placeholders.
- `public/.well-known/security.txt`: RFC 9116 compliant template with placeholders for `Contact`, `Expires`, `Preferred-Languages`.
- `public/favicon.svg`: minimal placeholder SVG.

## Phase 9: Deployment Configuration

### `deploy/Caddyfile.static`

Snippet-based Caddyfile fragment that assumes the user's central Caddyfile already defines `common_config`, `security_headers`, `content_security_policy`, and `www_to_naked` snippets. This file provides:

1. The `umami_proxy` snippet (see below).
2. A commented-out site block template showing how to use all imports together.

```caddyfile
# Umami analytics proxy (first-party)
# Usage: import umami_proxy
(umami_proxy) {
    handle /s.js {
        rewrite * /script.js
        reverse_proxy https://umami.example.com {
            header_up Host umami.example.com
        }
    }
    handle /api/send {
        reverse_proxy https://umami.example.com {
            header_up Host umami.example.com
        }
    }
}

# Site block template — replace example.com and umami host before use
# example.com, www.example.com {
#     root * /var/www/example.com
#     import www_to_naked example.com
#     import common_config
#     import security_headers
#     import content_security_policy
#     import umami_proxy
#     file_server
# }
```

### `deploy/Caddyfile.ssr`

Template for running Astro in Node standalone mode behind Caddy reverse proxy on `localhost:4321`. Include asset handling for `/_astro/*` served directly from disk with immutable cache headers.

### `deploy/wrangler.jsonc`

Minimal Cloudflare Workers config template with placeholders.

### `.github/workflows/deploy-vps.yml`

GitHub Actions workflow triggered on push to `main`:
1. Setup pnpm + Node 22.
2. `pnpm install --frozen-lockfile`.
3. `pnpm build:static`.
4. Deploy `dist/` via rsync over SSH using secrets: `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_HOST`, `SSH_USER`, `DEPLOY_PATH`.
5. Use `--delete` flag in rsync but protect any paths outside `dist/` content.

### `.github/workflows/deploy-preview.yml`

Triggered on `pull_request` (opened, synchronize, reopened):
1. Build site with `SITE_URL` set to `https://preview-${{ github.event.pull_request.number }}.example.com`.
2. Deploy to `/var/www/previews/pr-${{ github.event.pull_request.number }}/`.
3. Post a comment on the PR with the preview URL.

Second workflow triggered on `pull_request closed`: cleans up the preview directory via SSH.

## Phase 10: AI Tooling

### `CLAUDE.md`

Under 200 lines. Content (expand each section with concrete examples where helpful):

```markdown
# CLAUDE.md

## Project
Opinionated Astro 6 boilerplate for content-heavy websites.
TypeScript strict, Tailwind v4, Preact for islands, Umami analytics.

## Commands
- `pnpm dev` — local dev server
- `pnpm build` — production build (static output)
- `pnpm preview` — preview built site
- `pnpm lint` / `pnpm format` / `pnpm typecheck`
- Add integrations with `pnpm astro add <name>`, never edit config manually for standard integrations.

## Architecture Rules
- Astro components for everything static. Preact ONLY for actual interactivity.
- Prefer `client:visible` over `client:load`.
- Content Layer API with `glob` loaders (NOT legacy content/config.ts).
- Images ALWAYS via `<Image>` or `<Picture>` from `astro:assets`.
- Zod 4 syntax (`z.email()`, not `z.string().email()`).
- No arbitrary values in Tailwind (no `text-[#abc123]`) — use tokens from `src/styles/tokens.css`.
- No `localStorage` or `sessionStorage` in components — use URL state or server state.

## SEO Requirements
Every page must have: title, description, canonical, OG tags.
Heading hierarchy is strict (h1 → h2 → h3, no skips).
JSON-LD for content pages.

## Styling
All colors, spacing, radii, shadows come from `src/styles/tokens.css`.
Brand colors are placeholders — the project owner replaces them per project.

## Deployment
Primary target: Hetzner VPS with Caddy, built statically via GitHub Actions.
Secondary: Cloudflare Workers via `DEPLOY_TARGET=cloudflare`.
Umami analytics uses a first-party Caddy reverse proxy at `/s.js` and `/api/send`.
```

### `AGENTS.md`

Shorter, tool-agnostic version of CLAUDE.md covering the same architecture rules. Aimed at any AI coding agent.

### `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "command": "pnpm exec prettier --write $FILE || true" }]
      }
    ]
  }
}
```

### `README.md`

Quick-start for a human developer: prerequisites (pnpm, Node 22+), install, dev, build, deploy. Link to CLAUDE.md for architecture details. Document the `UMAMI_WEBSITE_ID` env var and how to register a new site in Umami.

## Phase 11: Final Verification

Run each of these and confirm they pass:

1. `pnpm install` — clean install succeeds.
2. `pnpm typecheck` — no errors.
3. `pnpm lint` — no errors.
4. `pnpm build` — produces `dist/` with at least `index.html`, `404.html`, `500.html`, `blog/hello-world/index.html`, `sitemap-index.xml`, `rss.xml`.
5. `pnpm preview` — serves the built site, all routes respond 200 (or 404 for the 404 page intentionally).
6. Open the built `index.html` in a browser. Skip-link is visible on Tab. Dark mode responds to OS preference. No console errors. No `<img>` tags — all images are picture/srcset.
7. `DEPLOY_TARGET=node pnpm build` succeeds (after conditionally installing `@astrojs/node`).
8. Git status shows no files that should be gitignored (no `node_modules`, no `.env`, no `dist`).

## What NOT to do

- Do not add a CMS integration (Sanity, Storyblok, Keystatic, etc.) — content lives in Markdown in the repo.
- Do not add authentication, database adapters, or ORM. This is a content site starter.
- Do not add UI component libraries (shadcn, daisyUI, Flowbite). The design system is built on tokens + Tailwind primitives.
- Do not commit `node_modules`, built artifacts, or any vendor folders.
- Do not add Husky or lint-staged. Lefthook replaces both.
- Do not configure Biome. Stick to ESLint + Prettier for now.
- Do not add MDX unless asked. Plain Markdown is the default.
- Do not add Vitest or Playwright configs by default. Leave testing as an opt-in the project owner adds per repo.
- Do not add placeholder marketing copy. Keep all content strings neutral and minimal.

## Completion Report

When done, produce a short completion report covering:
- Astro version and key dependency versions actually installed.
- Any deviations from this spec and why.
- Any `TODO` markers you left in the code that need human attention (e.g. replace brand colors, fill in security.txt contact).
- Next steps the project owner should take before using this as a real project base.
