import { validate } from './validate.mjs';

// Sends contact-form messages through Brevo's transactional email API.
const {
  CONTACT_TO = '',
  CONTACT_FROM_EMAIL = '',
  CONTACT_FROM_NAME = 'AFHC Golf Classic',
  BREVO_API_KEY = '',
} = process.env;

type UrlEvent = { body?: string; isBase64Encoded?: boolean; requestContext?: { http?: { method?: string; sourceIp?: string } } };
const reply = (statusCode: number, body: object) => ({ statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

export const handler = async (event: UrlEvent) => {
  if (event.requestContext?.http?.method !== 'POST') return reply(405, { error: 'POST only.' });
  let body: unknown;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
    if (raw.length > 20_000) return reply(413, { error: 'Message too long.' });
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'Invalid request.' });
  }

  const v = validate(body);
  if (!v.ok) return reply(400, { error: v.error });
  if (v.spam) return reply(200, { ok: true });

  const d = v.data as { name: string; email: string; phone: string; topic: string; message: string };
  const text = [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : null,
    `Topic: ${d.topic}`,
    '',
    d.message,
    '',
    `Sent from the contact form on afhcgolf.net (IP ${event.requestContext?.http?.sourceIp ?? 'unknown'}).`,
  ].filter((l) => l !== null).join('\n');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: CONTACT_FROM_NAME, email: CONTACT_FROM_EMAIL },
      to: [{ email: CONTACT_TO }],
      replyTo: { email: d.email, name: d.name },
      subject: `[AFHC Golf] ${d.topic}: ${d.name}`,
      textContent: text,
    }),
  });
  if (!res.ok) {
    console.error('Brevo send failed', res.status, await res.text());
    return reply(502, { error: 'Message could not be sent.' });
  }
  return reply(200, { ok: true });
};
