// Chế độ Xóm lạ (docs/XOM_LA.md): bàn xáo + sương mù, chọn cách đi, 12 vòng chấm uy tín, đi làm thuê.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, prestige, XL_EXPLORE, XL_ROUNDS } from '../src/core/rules.js';
import { MAPS, mapOf } from '../src/core/maps/index.js';
import { SALARY } from '../src/core/board.js';

const xl = (seed = 1, map = 'vietnam', n = 3) => createGame(['A', 'B', 'C', 'D'].slice(0, n), { seed, map, xomla: true, dev: true });
const act = (S, a, seat = S.turn) => { const r = applyAction(S, seat, a); assert.ok(r.ok, `thao tác bị từ chối: ${JSON.stringify(a)} ở phase ${S.phase}`); return r; };

test('bàn xáo: hoán vị đủ 40 ô, giữ 4 góc, mỗi seed một bàn', () => {
  const layouts = new Set();
  for (let seed = 1; seed <= 30; seed++) {
    const S = xl(seed);
    assert.deepEqual([...S.layout].sort((a, b) => a - b), [...Array(40).keys()]);
    for (const c of [0, 10, 20, 30]) assert.equal(S.layout[c], c);
    layouts.add(S.layout.join());
  }
  assert.ok(layouts.size >= 29, 'seed khác thì bàn khác');
});

test('bàn xáo: đất cùng quận liền nhau (chỉ bị góc chen giữa), không 2 ô thuế liền nhau', () => {
  for (let seed = 1; seed <= 50; seed++) {
    const T = mapOf(xl(seed)).tiles;
    for (let d = 1; d <= 8; d++) {
      const pos = T.map((t, i) => (t.d === d ? i : -1)).filter(i => i >= 0);
      const span = pos[pos.length - 1] - pos[0] + 1;
      assert.ok(span <= pos.length + 1, `seed ${seed}: quận ${d} rải rác (${pos})`);
    }
    T.forEach((t, i) => assert.ok(!(t.type === 'tax' && T[(i + 1) % 40].type === 'tax'), `seed ${seed}: 2 ô thuế liền nhau`));
  }
});

test('sương: đầu ván chỉ lộ 4 góc; đi ngang không mở, dừng chân mới mở và được thưởng', () => {
  let S = xl(3);
  assert.deepEqual(S.xl.seen.map((v, i) => (v ? i : -1)).filter(i => i >= 0), [0, 10, 20, 30]);
  let r = act(S, { type: 'roll', dice: [2, 3] });
  assert.equal(r.state.phase, 'move');
  assert.deepEqual(r.state.choice.opts, [5, 2, 3]);
  const money = r.state.players[0].money;
  r = act(r.state, { type: 'move', n: 5 });
  S = r.state;
  for (const i of [1, 2, 3, 4]) assert.equal(S.xl.seen[i], false, `đi ngang ô ${i} không mở`);
  assert.equal(S.xl.seen[5], true);
  assert.equal(S.xl.explored[0], 1);
  assert.equal(S.players[0].money, money + XL_EXPLORE);
  assert.ok(r.events.some(e => e.type === 'reveal' && e.i === 5 && e.seat === 0));
});

test('chọn cách đi: chỉ được đi một trong các số đã tung', () => {
  const r = act(xl(4), { type: 'roll', dice: [1, 6] });
  assert.equal(applyAction(r.state, 0, { type: 'move', n: 4 }).ok, false);
  assert.equal(applyAction(r.state, 1, { type: 'move', n: 7 }).ok, false, 'không phải lượt');
  assert.equal(act(r.state, { type: 'move', n: 1 }).state.players[0].pos, 1);
});

test('lăn đôi: vẫn chọn được, và được lăn thêm', () => {
  let r = act(xl(5), { type: 'roll', dice: [3, 3] });
  assert.deepEqual(r.state.choice.opts, [6, 3]);
  r = act(r.state, { type: 'move', n: 3 });
  if (r.state.phase === 'buy') r = act(r.state, { type: 'skip' });
  assert.equal(r.state.phase, 'roll');
  assert.equal(r.state.turn, 0);
});

test('thẻ "đến ô X" của map đi tới đúng ô đó trên bàn đã xáo', () => {
  // Phố Giấy: thẻ Cơ hội "đến Hải Đăng" (ô gốc 39)
  let S = xl(6, 'classic');
  const deck = Object.keys(MAPS.classic.decks).find(k => MAPS.classic.decks[k].cards.some(c => c.fx.goto === 39));
  const id = MAPS.classic.decks[deck].cards.findIndex(c => c.fx.goto === 39);
  const r = act(S, { type: 'debug', op: 'card', deck, id });
  const p = r.state.players[0];
  assert.equal(mapOf(r.state).tiles[p.pos], MAPS.classic.tiles[39], 'tới đúng Hải Đăng');
  assert.equal(p.pos, S.layout.indexOf(39));
});

test('hết tiền: không bị loại, đất về chủ nợ, đi làm thuê (nửa lương, không mua đất)', () => {
  let S = xl(7);
  S = structuredClone(S);
  const T = mapOf(S).tiles, i = T.findIndex(t => t.type === 'prop');
  S.owner[i] = 1; S.players[0].money = -100; S.players[0].creditor = 1; S.phase = 'end';
  const r = act(S, { type: 'bankrupt' });
  const p = r.state.players[0];
  assert.equal(p.out, false);
  assert.equal(p.worker, true);
  assert.equal(p.money, 0);
  assert.equal(r.state.turn, 1);
  // người làm thuê dừng ở đất trống: không được mua
  let W = structuredClone(r.state);
  W.turn = 0; W.phase = 'roll'; W.players[0].pos = 0;
  const j = mapOf(W).tiles.findIndex((t, k) => t.type === 'prop' && W.owner[k] == null);
  const r2 = act(W, { type: 'debug', op: 'goto', i: j });
  assert.notEqual(r2.state.phase, 'buy');
  // lương qua Xuất phát còn một nửa
  W = structuredClone(r.state);
  W.turn = 0; W.phase = 'roll'; W.players[0].pos = 38;
  const before = W.players[0].money;
  const r3 = act(act(W, { type: 'roll', dice: [1, 3] }).state, { type: 'move', n: 4 });
  assert.ok(r3.state.players[0].money >= before + SALARY / 2);
  assert.ok(r3.state.players[0].money < before + SALARY + XL_EXPLORE + 1);
});

test(`hết ${XL_ROUNDS} vòng: ván kết thúc, người uy tín cao nhất thắng`, () => {
  let S = structuredClone(xl(8, 'vietnam', 2));
  S.round = XL_ROUNDS; S.turn = 1; S.phase = 'end';
  S.players[0].money = 3000;
  const r = act(S, { type: 'end' });
  assert.equal(r.state.winner, 0);
  assert.equal(r.state.round, XL_ROUNDS);
  assert.equal(r.state.xl.final[0].total, prestige(r.state, 0).total);
  assert.equal(r.state.xl.final[0].worth, 30);
});

test('uy tín: nhà tính 1,2 lần, mỗi 5 ô khai hoang +1', () => {
  const S = structuredClone(xl(9));
  const T = mapOf(S).tiles, i = T.findIndex(t => t.type === 'prop');
  S.players[0].money = 0; S.owner[i] = 0; S.houses[i] = 1; S.xl.explored[0] = 11;
  const house = mapOf(S).districts[T[i].d].house;
  const r = prestige(S, 0);
  assert.equal(r.worth, Math.floor((T[i].price + house * 1.2) / 100));
  assert.equal(r.explore, 2);
  assert.equal(prestige(createGame(['A', 'B'], { seed: 1 }), 0), null, 'chế độ cổ điển không có uy tín');
});

test('chế độ cổ điển không đổi: không có layout, không có phase move', () => {
  const S = createGame(['A', 'B'], { seed: 2, map: 'vietnam', dev: true });
  assert.equal(S.layout, undefined);
  assert.equal(S.xl, undefined);
  assert.equal(mapOf(S), MAPS.vietnam);
  assert.notEqual(act(S, { type: 'roll', dice: [1, 2] }).state.phase, 'move');
});
