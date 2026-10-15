// Pure validation for the contact form, kept separate so it can be unit-tested with node --test.
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const TOPICS = ['Registration', 'Sponsorship', 'Donations', 'Programs and scholarships', 'Something else'];
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

/** @returns {{ ok: true, spam?: boolean, data: object } | { ok: false, error: string }} */
export function validate(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  if (clean(body.website, 200)) return { ok: true, spam: true, data: {} }; // honeypot filled: accept silently
  const data = {
    name: clean(body.name, 120).replace(/[\r\n]+/g, ' '),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40).replace(/[\r\n]+/g, ' '),
    topic: TOPICS.includes(body.topic) ? body.topic : 'Something else',
    message: clean(body.message, 5000),
  };
  if (!data.name) return { ok: false, error: 'Name is required.' };
  if (!EMAIL.test(data.email)) return { ok: false, error: 'A valid email address is required.' };
  if (data.message.length < 2) return { ok: false, error: 'Message is required.' };
  if ((data.message.match(/https?:\/\//g) ?? []).length > 3) return { ok: true, spam: true, data: {} };
  return { ok: true, data };
}
