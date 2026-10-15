// Amplify build step: turn amplify_outputs.json into PUBLIC_* vars for the Astro build.
// Values already set in the Amplify console (e.g. a custom media domain) win.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const out = existsSync('amplify_outputs.json') ? JSON.parse(readFileSync('amplify_outputs.json', 'utf8')) : {};
const c = out.custom ?? {};
const env = {
  PUBLIC_MEDIA_BASE: process.env.PUBLIC_MEDIA_BASE || c.mediaUrl || '',
  PUBLIC_CONTACT_ENDPOINT: process.env.PUBLIC_CONTACT_ENDPOINT || c.contactUrl || '',
};
writeFileSync('.env.production', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
console.log('Wrote .env.production', env);
