# moab

Opinionated Astro 6 boilerplate for content-heavy websites.

**Stack:** Astro 6 (SSG by default, hybrid SSR via `DEPLOY_TARGET`),
TypeScript strict, Tailwind CSS v4, Preact for islands, pnpm, Lefthook,
ESLint v9, Prettier, Umami analytics, VPS with Caddy.

## Prerequisites

- **Node.js 22+**
- **pnpm.** Node ships Corepack but leaves it inactive. Run
  `corepack enable` once and it will pick up the `packageManager` field
  from `package.json` and use the matching pnpm version automatically.
  If you'd rather not use Corepack, `npm install -g pnpm@latest` works
  too.
- **Image optimization (`sharp`).** sharp 0.33+ ships prebuilt
  `libvips` binaries for glibc Linux (x64/arm64), macOS, and Windows,
  so a standard Debian/Ubuntu box needs no extra build tools. On
  Alpine/musl the `@img/sharp-linuxmusl-*` package is selected
  automatically. If `pnpm install` is run with `--no-optional` or a
  hoisting quirk drops the platform binary, run `pnpm rebuild sharp`
  to fix it.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

The dev server reads `.env` (see `.env.example`). At minimum set
`SITE_URL`. `UMAMI_WEBSITE_ID` is optional and only used when the
analytics proxy is wired up via Caddy (see `deploy/Caddyfile.static`).

## Scripts

| Command                 | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `pnpm dev`              | Local dev server                                |
| `pnpm build`            | Static production build → `dist/`               |
| `pnpm build:static`     | Explicit static build (`DEPLOY_TARGET=static`)  |
| `pnpm build:node`       | Hybrid SSR build for `@astrojs/node` standalone |
| `pnpm build:cloudflare` | Build for Cloudflare Workers                    |
| `pnpm preview`          | Serve the built site locally                    |
| `pnpm lint`             | ESLint                                          |
| `pnpm format`           | Prettier `--write`                              |
| `pnpm typecheck`        | `astro check`                                   |
| `pnpm check`            | typecheck + lint                                |

`@astrojs/node` and `@astrojs/cloudflare` are **not** listed in
`package.json` by default. Install whichever you need before running the
corresponding build:

```bash
pnpm add @astrojs/node          # for DEPLOY_TARGET=node
pnpm add @astrojs/cloudflare    # for DEPLOY_TARGET=cloudflare
```

## Deployment

Primary target: a Linux VPS behind Caddy. The GitHub Actions workflow
in `.github/workflows/deploy-vps.yml` builds statically and rsyncs
`dist/` over SSH. It expects these repository secrets:
`SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_HOST`, `SSH_USER`,
`DEPLOY_PATH`, `SITE_URL`.

Caddy fragments live in `deploy/` and expect your central Caddyfile to
already define these snippets: `common_config`, `security_headers`,
`content_security_policy`, `www_to_naked`. Ready-to-import versions of
all four — matching the setup this boilerplate assumes — are provided in
[`deploy/Caddyfile.snippets`](./deploy/Caddyfile.snippets); paste them
into your central Caddyfile or `import` the file once. The `umami_proxy`
snippet provided here serves Umami first-party at `/s.js` and `/api/send`.

Cloudflare Workers is available as an alternative via
`DEPLOY_TARGET=cloudflare` + `deploy/wrangler.jsonc`.

## Analytics

Umami is proxied first-party through Caddy so no third-party script tag
is loaded. Set `UMAMI_WEBSITE_ID` in the environment. The
`<Analytics />` component only emits the script in production builds
and only when the ID is present. To register a new site in Umami, add
it in the Umami admin UI, copy the generated website ID, and store it
as the `UMAMI_WEBSITE_ID` secret (or `.env` value) for this project.

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for the full list of conventions,
architectural rules, and things not to add. The same content in a
tool-agnostic form lives in [`AGENTS.md`](./AGENTS.md).

## License

See [`LICENSE`](./LICENSE).
