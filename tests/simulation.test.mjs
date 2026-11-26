// Giả lập: bot chơi nhiều ván ngẫu nhiên, kiểm tra luật không bao giờ kẹt hay sinh trạng thái sai.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction } from '../src/core/rules.js';
import { TILES, BAIL } from '../src/core/board.js';

const GAMES = Number(process.env.SIM_GAMES || 300);
const MAX_ACTIONS = 4000;

function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; }; }

function botAction(S, r) {
  const me = S.turn, p = S.players[me];
  const mine = Object.keys(S.owner).map(Number).filter(i => S.owner[i] === me);
  const tryEach = (type, list) => { for (const i of list) { const res = applyAction(S, me, { type, i }); if (res.ok) return { type, i }; } return null; };
  if (S.phase === 'roll') {
    if (p.jail && p.money >= BAIL && r() < 0.3) return { type: 'bail' };
    return { type: 'roll' };
  }
  if (S.phase === 'buy') return { type: r() < 0.75 ? 'buy' : 'skip' };
  if (p.money < 0) return tryEach('sell', mine) || tryEach('mort', mine) || { type: 'bankrupt' };
  if (r() < 0.4) { const b = tryEach('build', mine.sort(() => r() - 0.5)); if (b) return b; }
  if (r() < 0.1) { const u = tryEach('unmort', mine); if (u) return u; }
  return { type: 'end' };
}

function checkInvariants(S) {
  for (const p of S.players) {
    assert.ok(Number.isFinite(p.money), 'tiền là số');
    assert.ok(p.pos >= 0 && p.pos < 40, 'vị trí hợp lệ');
    if (p.out) assert.equal(p.money, 0);
  }
  for (const [i, o] of Object.entries(S.owner)) {
    assert.ok(!S.players[o].out, `ô ${i} thuộc người đã bị loại`);
    assert.ok(['prop', 'station', 'util'].includes(TILES[i].type));
  }
  for (const [i, h] of Object.entries(S.houses)) {
    assert.ok(h >= 0 && h <= 5, 'số nhà 0–5');
    if (h > 0) assert.ok(S.owner[i] != null, 'nhà trên đất có chủ');
  }
  assert.ok(['roll', 'buy', 'end'].includes(S.phase));
  assert.ok(!S.players[S.turn].out || S.winner != null, 'không tới lượt người đã bị loại');
}

test(`${GAMES} ván bot ngẫu nhiên không kẹt, không sai trạng thái`, () => {
  let finished = 0, actions = 0;
  for (let g = 0; g < GAMES; g++) {
    const r = rng(g + 1);
    let S = createGame(['A', 'B', 'C', 'D'].slice(0, 2 + (g % 3)), { seed: g + 1 });
    for (let k = 0; k < MAX_ACTIONS && S.winner == null; k++) {
      const a = botAction(S, r);
      const res = applyAction(S, S.turn, a);
      assert.ok(res.ok, `ván ${g}: bot làm thao tác không hợp lệ ${JSON.stringify(a)} ở phase ${S.phase}`);
      S = res.state; actions++;
      checkInvariants(S);
    }
    if (S.winner != null) finished++;
  }
  assert.ok(finished > GAMES * 0.5, `ít nhất một nửa số ván phải kết thúc (được ${finished}/${GAMES})`);
  console.log(`  ${finished}/${GAMES} ván kết thúc, ${actions} thao tác`);
});
