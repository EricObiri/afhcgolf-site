import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from './validate.mjs';

const good = { name: 'Pat Golfer', email: 'pat@example.com', topic: 'Sponsorship', message: 'Interested in a hole sign.' };

test('accepts a normal message', () => {
  const r = validate(good);
  assert.equal(r.ok, true); assert.equal(r.spam, undefined); assert.equal(r.data.topic, 'Sponsorship');
});
test('rejects missing name, bad email, empty message', () => {
  assert.equal(validate({ ...good, name: ' ' }).ok, false);
  assert.equal(validate({ ...good, email: 'nope' }).ok, false);
  assert.equal(validate({ ...good, email: 'a@b.c\nBcc: x@y.z' }).ok, false);
  assert.equal(validate({ ...good, message: '' }).ok, false);
});
test('honeypot and link-stuffed messages are dropped silently', () => {
  assert.deepEqual(validate({ ...good, website: 'http://spam' }), { ok: true, spam: true, data: {} });
  assert.equal(validate({ ...good, message: 'http://a http://b http://c http://d' }).spam, true);
});
test('strips newlines from header-bound fields and unknown topics', () => {
  const r = validate({ ...good, name: 'Pat\r\nBcc: evil@x.com', topic: 'Hacking' });
  assert.equal(r.data.name, 'Pat Bcc: evil@x.com'); assert.equal(r.data.topic, 'Something else');
});
test('non-object body is rejected', () => { assert.equal(validate(null).ok, false); assert.equal(validate('x').ok, false); });
