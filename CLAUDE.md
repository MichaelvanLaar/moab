@AGENTS.md

# moab — Claude Code additions

## Commands

- `pnpm dev` — dev server
- `pnpm build` — static build (also `build:static`, `build:node`, `build:cloudflare`)
- `pnpm preview` — preview built site
- `pnpm lint` / `pnpm format` / `pnpm typecheck` / `pnpm check`

## Hard rules

- **pnpm only.** Never `npm` or `yarn`. Use `pnpm astro add <pkg>` for integrations.

## Learnings

When I correct a mistake or point out a recurring issue, append a one-line summary to `.claude/learnings.md`. Don't modify `CLAUDE.md` directly.

## Compact Instructions

When compacting, preserve: list of modified files, test/typecheck/lint status, open TODOs, and key decisions made.
