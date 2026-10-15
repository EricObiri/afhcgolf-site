import { defineFunction } from '@aws-amplify/backend';

export const contact = defineFunction({
  name: 'afhcgolf-contact',
  entry: './handler.ts',
  timeoutSeconds: 10,
  memoryMB: 256,
  environment: {
    // Where messages go, and the verified sender on afhcgolf.net. Confirm both with the client.
    CONTACT_TO: 'info@afhcgolf.net',
    CONTACT_FROM: 'AFHC Golf Classic <no-reply@afhcgolf.net>',
  },
});
