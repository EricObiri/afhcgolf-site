// @ts-check
import { defineConfig } from 'astro/config';

// Old WordPress URLs -> new pages. Static builds emit a meta-refresh page for each;
// the same list is mirrored as real 301s in amplify-redirects.json for Amplify Hosting.
import redirects from './redirects.json' with { type: 'json' };

export default defineConfig({
  site: 'https://www.afhcgolf.net',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: Object.fromEntries(redirects.map((r) => [r.from, r.to])),
});
