import test from 'node:test';
import assert from 'node:assert/strict';
import { frameFor, stackLayout, validateManifest } from '../../src/render/stack.js';

test('frameFor chuẩn hóa góc và làm tròn đến khung gần nhất', () => {
  assert.equal(frameFor(0), 0);
  assert.equal(frameFor(360), 0);
  assert.equal(frameFor(-90), 12);
  assert.equal(frameFor(45), 2);
  assert.equal(frameFor(359), 0);
  assert.throws(() => frameFor(NaN), RangeError);
});

test('stackLayout bao trọn lát xoay và phần nâng lên', () => {
  const flat = stackLayout(24, 48, 16, 0.75, 0);
  const tall = stackLayout(24, 48, 16, 0.75, 2);
  assert.equal(flat.width, tall.width);
  assert.equal(tall.height - flat.height, 30);
  assert.ok(flat.cx > 0 && flat.baseY > 0);
  assert.throws(() => stackLayout(24, 48, 0), RangeError);
});

test('manifest kiểm tra schema, id và kích thước', () => {
  const good = { id: 'hn-ho-hoan-kiem', w: 24, h: 48, count: 16,
    spacing: 1, squash: 0.75, style: 'paper', strip: 'out/hn-ho-hoan-kiem.png' };
  assert.deepEqual(validateManifest({ assets: [good] })[0], good);
  assert.throws(() => validateManifest({ assets: [good, good] }), TypeError);
  assert.throws(() => validateManifest({ assets: [{ ...good, count: 0 }] }), TypeError);
  assert.throws(() => validateManifest({ assets: [{ ...good, style: 'unknown' }] }), TypeError);
});
