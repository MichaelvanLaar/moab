# moab

Opinionated Astro 6 boilerplate for content-heavy websites.
Stack: Astro 6 (SSG default, hybrid SSR via `DEPLOY_TARGET`), TypeScript strict, Tailwind v4, Preact for islands, pnpm, Lefthook, ESLint v9, Prettier, Umami analytics, Caddy on Hetzner VPS.

**Current state:** empty repository. The build spec lives in `@BUILD_INSTRUCTIONS.md` — follow it phase by phase and verify each acceptance block before moving on.

## Commands

Available after Phase 1 of `BUILD_INSTRUCTIONS.md`:

- `pnpm dev` — dev server
- `pnpm build` — static build (also `build:static`, `build:node`, `build:cloudflare`)
- `pnpm preview` — preview built site
- `pnpm lint` — ESLint
- `pnpm format` — Prettier write
- `pnpm typecheck` — `astro check`

## Conventions

- **pnpm only.** Never `npm` or `yarn`.
- **`pnpm astro add <pkg>`** for official integrations. Do not hand-edit `astro.config.mjs` for things that have an `astro add` command.
- **Zod 4 syntax:** `z.email()`, not `z.string().email()`.
- **Content Layer API** with `glob` loaders. Not the legacy `src/content/config.ts` pattern.
- **Images** always via `<Image>`/`<Picture>` from `astro:assets`. No raw `<img>`.
- **Islands:** prefer `client:visible` over `client:load`. Default to Astro components; use Preact only where real interactivity is needed.
- **Styling:** all colors/spacing/radii/shadows come from `src/styles/tokens.css`. No arbitrary Tailwind values (`text-[#abc123]`).
- **No `localStorage`/`sessionStorage`** in components — URL state or server state.
- **TypeScript strict**, every file is `.ts` or `.astro`. Config files may be `.js` where tooling requires (e.g. `eslint.config.js`).

## Don't

- Don't commit secrets, `.env`, `node_modules/`, `dist/`, or `.astro/`.
- Don't use `--force` flags — fix the underlying issue.
- Don't add Husky or lint-staged — Lefthook replaces both.
- Don't add Biome, CMS integrations, auth, ORMs, or UI component libraries (shadcn, daisyUI, etc.).
- Don't add MDX, Vitest, or Playwright unless explicitly asked.

## Learnings

When I correct a mistake or point out a recurring issue, append a one-line summary to `.claude/learnings.md`. Don't modify `CLAUDE.md` directly.

## Compact Instructions

When compacting, preserve: list of modified files, current phase in `BUILD_INSTRUCTIONS.md`, test/typecheck/lint status, open TODOs, and key decisions made.
