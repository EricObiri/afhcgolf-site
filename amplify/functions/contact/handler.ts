import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { validate } from './validate.mjs';

const ses = new SESv2Client({});
const { CONTACT_TO = '', CONTACT_FROM = '' } = process.env;

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

  await ses.send(new SendEmailCommand({
    FromEmailAddress: CONTACT_FROM,
    Destination: { ToAddresses: [CONTACT_TO] },
    ReplyToAddresses: [d.email],
    Content: { Simple: {
      Subject: { Data: `[AFHC Golf] ${d.topic}: ${d.name}`, Charset: 'UTF-8' },
      Body: { Text: { Data: text, Charset: 'UTF-8' } },
    } },
  }));
  return reply(200, { ok: true });
};
