---
name: audit
description: Run accessibility, security, and performance audits on the built site. Use after build or before deploy.
---

Run three checks in parallel using agent teams:

1. **Accessibility:** Check all .astro files for WCAG 2.2 AA issues — color contrast, alt text, heading hierarchy, keyboard nav, ARIA.
2. **Security:** Review CSP in astro.config.mjs, check for exposed env vars in client code, verify no secrets leak.
3. **Performance:** Find raw <img> tags (should be <Image>), unnecessary client:load, missing lazy loading, large unoptimized assets.

Output a single markdown summary with severity levels (critical / warning / info).
