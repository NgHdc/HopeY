// Test luật chơi: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, rentFor, canManage, setOnline } from '../src/core/rules.js';
import { TILES, START_MONEY, SALARY, JAIL, BAIL } from '../src/core/board.js';
import { migrate, SCHEMA_VERSION } from '../src/core/version.js';

const game = (n = 2) => createGame(['An', 'Bình', 'Chi', 'Dũng'].slice(0, n), { seed: 42, dev: true });
/** Áp dụng một thao tác cho người đang tới lượt, bắt buộc thành công. */
function go(S, action, seat = S.turn) {
  const r = applyAction(S, seat, action);
  assert.ok(r.ok, `thao tác ${JSON.stringify(action)} phải hợp lệ (phase=${S.phase}, turn=${S.turn})`);
  return r.state;
}
const roll = (S, a, b) => go(S, { type: 'roll', dice: [a, b] });
const own = (S, i) => go(S, { type: 'debug', op: 'own', i });
const money = (S, n) => go(S, { type: 'debug', op: 'money', n });

test('cùng seed → cùng ván (bộ thẻ, xúc xắc)', () => {
  const a = createGame(['A', 'B'], { seed: 7 }), b = createGame(['A', 'B'], { seed: 7 });
  assert.deepEqual(a.decks, b.decks);
  const ra = applyAction(a, 0, { type: 'roll' }), rb = applyAction(b, 0, { type: 'roll' });
  assert.deepEqual(ra.state.dice, rb.state.dice);
});

test('không sửa trạng thái cũ', () => {
  const S = game(), copy = structuredClone(S);
  roll(S, 1, 2);
  assert.deepEqual(S, copy);
});

test('không tới lượt thì không làm được gì', () => {
  const S = game();
  assert.equal(applyAction(S, 1, { type: 'roll' }).ok, false);
  assert.equal(applyAction(S, 0, { type: 'end' }).ok, false, 'chưa lăn thì chưa kết thúc lượt được');
});

test('lăn, dừng ở đất trống, mua', () => {
  let S = roll(game(), 1, 2);
  assert.equal(S.players[0].pos, 3);
  assert.equal(S.phase, 'buy');
  S = go(S, { type: 'buy' });
  assert.equal(S.owner[3], 0);
  assert.equal(S.players[0].money, START_MONEY - 60);
  assert.equal(S.phase, 'end');
  S = go(S, { type: 'end' });
  assert.equal(S.turn, 1);
});

test('tiền thuê: đất trống, cả quận ×2', () => {
  let S = own(own(game(), 1), 3);           // An có cả Ngõ Đất (ô 1, 3)
  S = roll(S, 1, 2); S = go(S, { type: 'end' }); // An đứng ở ô 3 của mình
  const before = S.players[1].money;
  S = roll(S, 1, 2);                         // Bình dừng ở ô 3
  assert.equal(rentFor(S, 3), TILES[3].rent[0] * 2);
  assert.equal(S.players[1].money, before - TILES[3].rent[0] * 2);
  assert.equal(S.players[0].money, START_MONEY + TILES[3].rent[0] * 2);
});

test('đi qua Nhà nhận lương', () => {
  let S = go(game(), { type: 'debug', op: 'goto', i: 38 }); // Phí Cảng
  S = go(S, { type: 'end' }); S = roll(S, 1, 2); S = go(S, { type: 'skip' }); S = go(S, { type: 'end' }); // Bình đi
  const m = S.players[0].money;
  S = roll(S, 1, 2); // 38 → 1, qua Nhà
  assert.equal(S.players[0].pos, 1);
  assert.equal(S.players[0].money, m + SALARY);
});

test('lăn đôi được lăn tiếp; 3 lần đôi liền vào Trạm Nghỉ', () => {
  let S = roll(game(), 2, 2);                // ô 4 (phí), đôi
  assert.equal(S.phase, 'roll');
  S = roll(S, 1, 1);                          // ô 6 (đất), đôi
  S = go(S, { type: 'skip' });
  assert.equal(S.phase, 'roll');
  S = roll(S, 3, 3);
  assert.equal(S.players[0].pos, JAIL);
  assert.equal(S.players[0].jail, 1);
  assert.equal(S.phase, 'end');
});

test('Trạm Nghỉ: 3 lần không lăn được đôi thì trả tiền và đi', () => {
  let S = go(game(), { type: 'debug', op: 'goto', i: 30 }); // Lạc Đường → Trạm Nghỉ
  assert.equal(S.players[0].pos, JAIL);
  const pass = s => { s = go(s, { type: 'end' }); s = roll(s, 1, 2); if (s.phase === 'buy') s = go(s, { type: 'skip' }); return go(s, { type: 'end' }); };
  S = pass(S); S = roll(S, 1, 2); assert.equal(S.players[0].pos, JAIL);
  S = pass(S); S = roll(S, 1, 2); assert.equal(S.players[0].pos, JAIL);
  const m = S.players[0].money;
  S = pass(S); S = roll(S, 1, 2);
  assert.equal(S.players[0].jail, 0);
  assert.equal(S.players[0].pos, JAIL + 3);
  assert.ok(S.players[0].money <= m - BAIL);
});

test('Trạm Nghỉ: trả tiền hoặc dùng vé để ra', () => {
  let S = go(game(), { type: 'debug', op: 'goto', i: 30 });
  S = go(S, { type: 'end' }); S = roll(S, 1, 2); S = go(S, { type: 'skip' }); S = go(S, { type: 'end' });
  S = go(S, { type: 'bail' });
  assert.equal(S.players[0].jail, 0);
  assert.equal(applyAction(S, 0, { type: 'ticket' }).ok, false, 'không có vé');
});

test('xây nhà đều trong quận, không thế chấp khi còn nhà', () => {
  let S = own(own(game(), 1), 3);
  assert.ok(canManage(S, 'build', 1));
  S = go(S, { type: 'build', i: 1 });
  assert.equal(S.houses[1], 1);
  assert.equal(applyAction(S, 0, { type: 'build', i: 1 }).ok, false, 'phải xây ô 3 trước');
  assert.equal(applyAction(S, 0, { type: 'mort', i: 3 }).ok, false, 'quận còn nhà');
  S = go(S, { type: 'build', i: 3 });
  S = go(S, { type: 'build', i: 1 });
  assert.equal(S.houses[1], 2);
  assert.equal(applyAction(S, 0, { type: 'sell', i: 3 }).ok, false, 'phải bán ô nhiều nhà hơn trước');
  S = go(S, { type: 'sell', i: 1 });
  assert.equal(S.houses[1], 1);
});

test('chưa có cả quận thì không xây được', () => {
  const S = own(game(), 1);
  assert.equal(applyAction(S, 0, { type: 'build', i: 1 }).ok, false);
});

test('thế chấp và chuộc', () => {
  let S = own(game(), 5);
  S = go(S, { type: 'mort', i: 5 });
  assert.equal(S.players[0].money, START_MONEY + 100);
  S = go(S, { type: 'unmort', i: 5 });
  assert.equal(S.players[0].money, START_MONEY + 100 - 110);
  assert.equal(S.mort[5], undefined);
});

test('phá sản: đất chuyển cho chủ nợ, còn 1 người thì thắng', () => {
  let S = own(own(game(), 1), 3);
  S = go(S, { type: 'build', i: 1 }); S = go(S, { type: 'build', i: 3 });
  S = roll(S, 2, 3); if (S.phase === 'buy') S = go(S, { type: 'skip' }); S = go(S, { type: 'end' });
  S = money(S, -START_MONEY);                 // Bình hết tiền
  S = roll(S, 1, 2);                          // dừng ở ô 3 có nhà
  assert.ok(S.players[1].money < 0);
  assert.equal(applyAction(S, 1, { type: 'end' }).ok, false, 'đang nợ thì không kết thúc lượt được');
  S = go(S, { type: 'bankrupt' });
  assert.equal(S.players[1].out, true);
  assert.equal(S.winner, 0);
});

test('chủ phòng cho người mất kết nối rời ván', () => {
  let S = game(3);
  assert.equal(applyAction(S, 0, { type: 'forfeit' }).ok, false, 'đang online thì không được');
  S = setOnline(S, 0, false);
  S = go(S, { type: 'forfeit' });
  assert.equal(S.players[0].out, true);
  assert.equal(S.turn, 1);
  assert.equal(S.winner, null);
});

test('công cụ dev bị khóa ở ván thường', () => {
  const S = createGame(['A', 'B'], { seed: 1 });
  assert.equal(applyAction(S, 0, { type: 'debug', op: 'money', n: 999 }).ok, false);
  const r = applyAction(S, 0, { type: 'roll', dice: [6, 6] });
  assert.ok(r.ok);
  assert.notDeepEqual(r.state.dice, [6, 6], 'xúc xắc không bị đặt trước (seed 1 không ra 6-6)');
});

test('migrate: ván bản 0.2 mở được, ván bản tương lai thì không', () => {
  const old = { players: [{ name: 'A' }], owner: {} };
  const m = migrate(structuredClone(old));
  assert.equal(m.schemaVersion, SCHEMA_VERSION);
  assert.equal(typeof m.rng, 'number');
  assert.equal(migrate({ players: [], schemaVersion: SCHEMA_VERSION + 1 }), null);
  assert.equal(migrate(null), null);
});
