import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadAvatars, spriteHtml, portraitHtml, setAnim } from '../../src/render/sprite.js';

const entry = { id: 'test', name: 'Bé "Tí" & bạn', sheet: 'test.png',
  portrait: 'test-portrait.png', frame: 32,
  anims: { idle: [0, 4, 4], walk: [1, 4, 8], happy: [2, 4, 6], sad: [3, 3, 4] } };
const originalFetch = globalThis.fetch;

test('JSON hợp lệ nạp sheet, chân dung và hoạt ảnh theo hàng', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => [entry] });
  try {
    const list = await loadAvatars('sprite-test', 'http://local/assets/avatars/');
    assert.equal(list.length, 1);
    assert.match(spriteHtml(list, 0, { anim: 'walk', scale: 2, flip: true }), /--frame:64px;--row:1;--frames:4;--fps:8/);
    assert.match(spriteHtml(list, 0, { anim: 'sad' }), /--row:3;--frames:3/);
    assert.match(spriteHtml(list, 0), /aria-label="Bé &quot;Tí&quot; &amp; bạn"/);
    assert.match(spriteHtml(list, 0, { anim: 'missing' }), /data-anim="idle"/);
    assert.match(portraitHtml(list, 0, 2), /width="96" height="96"/);
    assert.equal(spriteHtml(list, 6), null);
    assert.equal(portraitHtml([], 0), null);
    const props = {};
    const el = { style: { setProperty: (k, v) => { props[k] = v; } }, dataset: {} };
    assert.equal(setAnim(el, 'happy', list, 0), true);
    assert.equal(props['--row'], 2);
    assert.equal(props['--duration'], '0.6666666666666666s');
    assert.equal(setAnim(el, 'missing', list, 0), false);
    const css = readFileSync(new URL('../../design/themes/sprite.css', import.meta.url), 'utf8');
    assert.match(css, /steps\(var\(--frames\)\)/);
    assert.match(css, /var\(--row\)/);
  } finally { globalThis.fetch = originalFetch; }
});

test('JSON thiếu trả danh sách rỗng', async () => {
  globalThis.fetch = async () => { throw new Error('offline'); };
  try { assert.deepEqual(await loadAvatars('sprite-missing', 'http://local/assets/avatars/'), []); }
  finally { globalThis.fetch = originalFetch; }
});
