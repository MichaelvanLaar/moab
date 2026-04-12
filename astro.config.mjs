// @ts-check
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

import remarkReadingTime from './src/plugins/remark-reading-time.mjs';

// Load .env into process.env so config-time access (site, DEPLOY_TARGET)
// picks up the same values Astro's runtime env schema will validate.
try {
  const parsed = parseEnv(readFileSync('.env', 'utf8'));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
} catch {
  // .env is optional — ignore if missing.
}

// DEPLOY_TARGET switches the output/adapter combo.
// Valid values: 'static' (default), 'node', 'cloudflare'.
// @astrojs/node and @astrojs/cloudflare are NOT listed in package.json by
// default — install the one you need before building with that target:
//   pnpm add @astrojs/node        # for DEPLOY_TARGET=node
//   pnpm add @astrojs/cloudflare  # for DEPLOY_TARGET=cloudflare
const deployTarget = process.env.DEPLOY_TARGET ?? 'static';

/** @type {import('astro').AstroUserConfig['output']} */
let output = 'static';
/** @type {import('astro').AstroUserConfig['adapter']} */
let adapter;

if (deployTarget === 'node') {
  output = 'server';
  // @ts-expect-error - adapter is installed on-demand, not in package.json by default
  const { default: node } = await import('@astrojs/node');
  adapter = node({ mode: 'standalone' });
} else if (deployTarget === 'cloudflare') {
  output = 'server';
  // @ts-expect-error - adapter is installed on-demand, not in package.json by default
  const { default: cloudflare } = await import('@astrojs/cloudflare');
  adapter = cloudflare();
}

export default defineConfig({
  site: process.env.SITE_URL,
  output,
  adapter,
  integrations: [preact(), sitemap()],
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  env: {
    schema: {
      SITE_URL: envField.string({
        context: 'server',
        access: 'public',
      }),
      UMAMI_WEBSITE_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  security: {
    csp: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
