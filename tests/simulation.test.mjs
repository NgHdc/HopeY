// Giả lập: bot chơi nhiều ván ngẫu nhiên trên mọi map, kiểm tra luật không bao giờ kẹt hay sinh trạng thái sai.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, canManage, choiceTiles, betRange, gambleTarget, rentFor, CHOICE_PHASES } from '../src/core/rules.js';
import { BAIL } from '../src/core/board.js';
import { MAPS, MAP_IDS } from '../src/core/maps/index.js';

const GAMES = Number(process.env.SIM_GAMES || 80); // mỗi map
const MAX_ACTIONS = 3000;

function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; }; }

/** Bot đơn giản. Cũng là mẫu cho bot trong game sau này. */
export function botAction(S, r) {
  const me = S.turn, p = S.players[me];
  const mine = Object.keys(S.owner).map(Number).filter(i => S.owner[i] === me);
  const tryEach = (type, list) => { const i = list.find(j => canManage(S, type, j)); return i == null ? null : { type, i }; };
  if (S.phase === 'roll') {
    if (p.jail && p.money >= BAIL && r() < 0.3) return { type: 'bail' };
    return { type: 'roll' };
  }
  if (S.phase === 'buy') return { type: r() < 0.75 ? 'buy' : 'skip' };
  if (S.phase === 'downgrade' || S.phase === 'fly') { const opts = choiceTiles(S); return { type: S.phase, i: opts[Math.floor(r() * opts.length)] }; }
  if (S.phase === 'gamble') {
    // tiền thuê ở ô sẽ bị đưa tới càng lớn so với tiền mặt thì cược càng thấp
    const { min, max, step } = betRange(S), t = gambleTarget(S);
    const risk = t != null && S.owner[t] != null ? rentFor(S, t) / Math.max(1, p.money) : 0;
    const want = Math.round((min + (max - min) * Math.max(0, 1 - 2 * risk) * r()) / step) * step;
    return { type: 'gamble', bet: Math.min(max, Math.max(min, want)), pick: r() < 0.5 ? 'even' : 'odd' };
  }
  if (p.money < 0) return tryEach('sell', mine) || tryEach('mort', mine) || { type: 'bankrupt' };
  if (r() < 0.4) { const b = tryEach('build', mine.sort(() => r() - 0.5)); if (b) return b; }
  if (r() < 0.1) { const u = tryEach('unmort', mine); if (u) return u; }
  return { type: 'end' };
}

function checkInvariants(S) {
  const T = MAPS[S.map].tiles;
  for (const p of S.players) {
    assert.ok(Number.isFinite(p.money), 'tiền là số');
    assert.ok(p.pos >= 0 && p.pos < 40, 'vị trí hợp lệ');
    assert.ok(p.discount >= 0 && p.discount <= 2, 'vé giảm giá 0–2');
    if (p.out) assert.equal(p.money, 0);
  }
  for (const [i, o] of Object.entries(S.owner)) {
    assert.ok(!S.players[o].out, `ô ${i} thuộc người đã bị loại`);
    assert.ok(['prop', 'station', 'util'].includes(T[i].type));
  }
  for (const [i, h] of Object.entries(S.houses)) {
    assert.ok(h >= 0 && h <= 5, 'số nhà 0–5');
    if (h > 0) assert.ok(S.owner[i] != null, 'nhà trên đất có chủ');
  }
  assert.ok(['roll', 'end', ...CHOICE_PHASES].includes(S.phase), `phase lạ: ${S.phase}`);
  if (S.phase === 'downgrade') assert.ok(choiceTiles(S).length > 0, 'phase hạ cấp phải có ô để chọn');
  for (const d of Object.keys(MAPS[S.map].decks)) assert.ok(S.decks[d].length > 0, 'bộ thẻ không rỗng');
  assert.ok(!S.players[S.turn].out || S.winner != null, 'không tới lượt người đã bị loại');
}

for (const map of MAP_IDS) {
  test(`${map}: ${GAMES} ván bot ngẫu nhiên không kẹt, không sai trạng thái`, () => {
    let finished = 0, actions = 0;
    const seen = new Set();
    for (let g = 0; g < GAMES; g++) {
      const r = rng(g + 1);
      let S = createGame(['A', 'B', 'C', 'D'].slice(0, 2 + (g % 3)), { seed: g + 1, map });
      for (let k = 0; k < MAX_ACTIONS && S.winner == null; k++) {
        const a = botAction(S, r);
        const res = applyAction(S, S.turn, a);
        assert.ok(res.ok, `ván ${g}: bot làm thao tác không hợp lệ ${JSON.stringify(a)} ở phase ${S.phase}`);
        seen.add(S.phase);
        S = res.state; actions++;
        checkInvariants(S);
      }
      if (S.secret && S.secret.th && S.secret.th.fired) seen.add('kingdom');
      if (S.winner != null) finished++;
    }
    assert.ok(finished >= GAMES * 0.4, `ít nhất 40% số ván phải kết thúc (được ${finished}/${GAMES})`);
    if (map === 'vietnam' && GAMES >= 40) for (const ph of ['downgrade', 'fly', 'gamble', 'kingdom']) assert.ok(seen.has(ph), `giả lập phải gặp ${ph}`);
    console.log(`  ${map}: ${finished}/${GAMES} ván kết thúc, ${actions} thao tác`);
  });
}
