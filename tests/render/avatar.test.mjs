import test from 'node:test';
import assert from 'node:assert/strict';
import { avatarEntries, avatarHtml, loadAvatarManifest } from '../../src/render/avatar.js';

const entries = Array.from({ length: 6 }, (_, k) => ({
  id: `resident-${k}`, name: `Nhân vật ${k}`, line: `Lời giới thiệu ${k}`,
  color: '#C93420', portrait: `portrait-${k}.svg`, token: `token-${k}.svg`,
}));
const response = value => ({ ok: true, json: async () => value });

test('loads JSON and renders portrait or token from the chosen map', async () => {
  assert.equal(await loadAvatarManifest('vietnam', { url: 'http://local/assets/avatars/vietnam/avatars.json', fetchImpl: async () => response(entries) }), true);
  const data = avatarEntries('vietnam');
  assert.equal(data.length, 6);
  assert.equal(data[2].name, 'Nhân vật 2');
  assert.match(avatarHtml('vietnam', 2, 32, 'portrait'), /portrait-2\.svg/);
  assert.match(avatarHtml('vietnam', 2, 24, 'token'), /token-2\.svg/);
  assert.match(avatarHtml('vietnam', 2, 32, 'portrait'), /alt="Nhân vật 2"/);
});

test('missing or invalid JSON falls back to a geometric piece', async () => {
  assert.equal(await loadAvatarManifest('missing', { fetchImpl: async () => { throw new Error('offline'); } }), false);
  assert.deepEqual(avatarEntries('missing'), []);
  assert.match(avatarHtml('missing', 5, 24, 'token'), /aria-label="quân chiếc lá"/);
  assert.equal(await loadAvatarManifest('invalid', { fetchImpl: async () => response([{ name: 'partial' }]) }), false);
  assert.match(avatarHtml('invalid', 0, 24, 'portrait'), /avatar-fallback/);
});

test('seat indices outside 0–5 stay safe and use geometric fallback when absent', () => {
  assert.match(avatarHtml('unknown', -1, 18, 'token'), /var\(--piece-5\)/);
  assert.match(avatarHtml('unknown', 6, 18, 'token'), /var\(--piece-0\)/);
  assert.match(avatarHtml('unknown', 7, 18, 'token'), /var\(--piece-1\)/);
  assert.match(avatarHtml('unknown', '2', -5, 'token'), /width="24"/);
});
