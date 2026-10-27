import { defineFunction, secret } from '@aws-amplify/backend';

export const contact = defineFunction({
  name: 'afhcgolf-contact',
  entry: './handler.ts',
  timeoutSeconds: 10,
  memoryMB: 256,
  environment: {
    // Where messages go. Confirm with the client.
    CONTACT_TO: 'info@afhcgolf.net',
    // Sender must be on a domain verified in Brevo (Senders, Domains & Dedicated IPs).
    CONTACT_FROM_EMAIL: 'no-reply@afhcgolf.net',
    CONTACT_FROM_NAME: 'AFHC Golf Classic',
    // Set in Amplify console → Hosting → Secrets (name: BREVO_API_KEY).
    BREVO_API_KEY: secret('BREVO_API_KEY'),
  },
});
