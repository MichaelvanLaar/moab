---
name: preflight
description: Pre-deploy checklist. Run before pushing to production.
---

Verify each item. Report pass/fail for each:

1. `pnpm build` succeeds without errors
2. `pnpm typecheck` passes
3. `pnpm lint` passes
4. Every page has: title, meta description, canonical URL, OG tags
5. No `<img>` tags — all images use `<Image>` or `<Picture>`
6. 404.astro and 500.astro exist and render correctly
7. Heading hierarchy is correct (h1→h2→h3, no skips) on every page
8. Skip-link is the first focusable element
9. No `console.log` or debug output in production code
10. `.env.example` is up to date with all required variables
11. sitemap-index.xml is generated and contains all public pages
12. RSS feed validates (if blog collection has posts)
13. All links are relative or use `Astro.site` — no hardcoded domains
14. `robots.txt` references the correct sitemap URL
