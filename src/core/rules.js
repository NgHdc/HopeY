// Luật chơi thuần: không DOM, không mạng, không Math.random.
// applyAction(state, seat, action) → { ok, state, events }. Trạng thái cũ không bị sửa.
// Mọi số ngẫu nhiên lấy từ state.rng (có seed) → cùng seed + cùng thao tác = cùng ván.
import { TILES, DISTRICTS, START_MONEY, SALARY, JAIL, BAIL, CUR, buyable, group, unmortCost } from './board.js';
import { CARDS } from './cards.js';
import { SCHEMA_VERSION } from './version.js';

const LOG_MAX = 80;

// ---------- số ngẫu nhiên (mulberry32) ----------
function rand(S) {
  S.rng = (S.rng + 0x6d2b79f5) >>> 0;
  let t = S.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const d6 = S => 1 + Math.floor(rand(S) * 6);
function shuffle(S, a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand(S) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- tạo ván ----------
export function createGame(names, opts = {}) {
  const S = {
    schemaVersion: SCHEMA_VERSION,
    rng: (opts.seed ?? Math.floor(Math.random() * 2 ** 32)) >>> 0,
    opts: { dev: !!opts.dev },
    players: names.map((name, i) => ({ name, money: START_MONEY, pos: 0, jail: 0, cards: 0, out: false, piece: i, creditor: null, online: true })),
    owner: {}, houses: {}, mort: {},
    turn: 0, phase: 'roll', doubles: 0, dice: [1, 1], round: 1,
    log: [], decks: null,
    view: { kind: 'tile', i: 0 }, winner: null,
    msg: 'Quân cờ đặt ở Nhà. Người đầu tiên lăn xúc xắc.',
  };
  S.decks = { q: shuffle(S, [...CARDS.q.keys()]), h: shuffle(S, [...CARDS.h.keys()]) };
  addLog(S, `Ván mới, ${names.length} người, mỗi người ${START_MONEY} ${CUR}.`);
  return S;
}

// ---------- tiện ích đọc trạng thái (UI dùng chung) ----------
export const ownedOfType = (S, o, type) => TILES.filter((t, i) => t.type === type && S.owner[i] === o).length;
export const ownsGroup = (S, o, d) => o != null && group(d).every(i => S.owner[i] === o);
export function rentFor(S, i) {
  const t = TILES[i], o = S.owner[i];
  if (t.type === 'station') return 25 * 2 ** (ownedOfType(S, o, 'station') - 1);
  if (t.type === 'util') return (S.dice[0] + S.dice[1]) * (ownedOfType(S, o, 'util') === 2 ? 10 : 4);
  const h = S.houses[i] || 0;
  if (h) return t.rent[h];
  return ownsGroup(S, o, t.d) ? t.rent[0] * 2 : t.rent[0];
}
/** Người đang tới lượt có được làm thao tác quản lý `type` trên ô i không. */
export function canManage(S, type, i) {
  const t = TILES[i], me = S.turn, p = S.players[me];
  if (S.winner != null || S.owner[i] !== me) return false;
  const h = S.houses[i] || 0;
  if (type === 'mort') return !S.mort[i] && (t.type !== 'prop' || group(t.d).every(j => !S.houses[j]));
  if (type === 'unmort') return !!S.mort[i] && p.money >= unmortCost(t);
  if (t.type !== 'prop') return false;
  const g = group(t.d), hs = g.map(j => S.houses[j] || 0);
  if (type === 'build') return ownsGroup(S, me, t.d) && g.every(j => !S.mort[j]) && h < 5 && h <= Math.min(...hs) && p.money >= DISTRICTS[t.d].house;
  if (type === 'sell') return h > 0 && h >= Math.max(...hs);
  return false;
}

// ---------- ghi nhật ký (dùng được từ ngoài, ví dụ lớp mạng) ----------
export function addLog(S, s) { S.log.unshift(s); if (S.log.length > LOG_MAX) S.log.length = LOG_MAX; }
function say(G, s) { G.S.msg = s; addLog(G.S, s); }

/** Đổi trạng thái kết nối của một ghế (lớp mạng gọi). Trả về trạng thái mới. */
export function setOnline(prev, seat, online) {
  const S = structuredClone(prev), p = S.players[seat];
  if (!p || p.online === online) return prev;
  p.online = online;
  addLog(S, online ? `${p.name} đã vào lại phòng.` : `${p.name} mất kết nối.`);
  return S;
}

// ---------- thao tác ----------
export function applyAction(prev, seat, action) {
  if (!prev || !action || typeof action.type !== 'string') return { ok: false, state: prev, events: [] };
  const S = structuredClone(prev), G = { S, ev: [] };
  const ok = step(G, seat, action) !== false;
  return ok ? { ok, state: S, events: G.ev } : { ok, state: prev, events: [] };
}

function step(G, seat, a) {
  const S = G.S;
  if (S.winner != null || seat !== S.turn) return false;
  const p = S.players[S.turn];
  switch (a.type) {
    case 'roll': return roll(G, a);
    case 'buy': {
      if (S.phase !== 'buy') return false;
      const t = TILES[p.pos];
      p.money -= t.price; S.owner[p.pos] = S.turn;
      say(G, `${p.name} mua ${t.name} với giá ${t.price} ${CUR}.`);
      return afterLand(G);
    }
    case 'skip':
      if (S.phase !== 'buy') return false;
      say(G, `${p.name} để ${TILES[p.pos].name} cho người sau.`);
      return afterLand(G);
    case 'bail':
      if (S.phase !== 'roll' || !p.jail || p.money < BAIL) return false;
      pay(G, p, null, BAIL, 'rời Trạm Nghỉ'); p.jail = 0; return true;
    case 'ticket':
      if (S.phase !== 'roll' || !p.jail || !p.cards) return false;
      p.cards--; p.jail = 0; say(G, `${p.name} dùng vé, rời Trạm Nghỉ.`); return true;
    case 'end':
      if (S.phase !== 'end' || p.money < 0) return false;
      nextPlayer(G); return true;
    case 'bankrupt':
      if (p.money >= 0) return false;
      return bankrupt(G, false);
    case 'forfeit': // chủ phòng cho người mất kết nối rời ván
      if (p.online !== false) return false;
      return bankrupt(G, true);
    case 'build': case 'sell': case 'mort': case 'unmort':
      if (!Number.isInteger(a.i) || a.i < 0 || a.i >= 40 || !canManage(S, a.type, a.i)) return false;
      manage(G, a.type, a.i); return true;
    case 'debug': return debug(G, a);
    default: return false;
  }
}

function roll(G, a) {
  const S = G.S, p = S.players[S.turn];
  if (S.phase !== 'roll') return false;
  const forced = S.opts.dev && Array.isArray(a.dice) && a.dice.every(n => Number.isInteger(n) && n >= 1 && n <= 6) && a.dice.length === 2;
  const d1 = forced ? a.dice[0] : d6(S), d2 = forced ? a.dice[1] : d6(S), dbl = d1 === d2;
  S.dice = [d1, d2];
  G.ev.push({ type: 'dice', dice: [d1, d2] });
  addLog(S, `${p.name} lăn ${d1} + ${d2}${dbl ? ' (đôi)' : ''}.`);
  if (p.jail > 0) {
    if (dbl) { p.jail = 0; say(G, `${p.name} lăn đôi, rời Trạm Nghỉ.`); moveBy(G, p, d1 + d2); }
    else if (++p.jail > 3) { p.jail = 0; pay(G, p, null, BAIL, 'ngồi đủ 3 lượt, phải trả để đi'); moveBy(G, p, d1 + d2); }
    else say(G, `${p.name} vẫn ngồi ở Trạm Nghỉ (lần thử ${p.jail - 1}/3).`);
    if (S.phase !== 'buy') S.phase = 'end';
    return true;
  }
  if (dbl && ++S.doubles === 3) { addLog(S, 'Ba lần đôi liền.'); sendJail(G, p); S.phase = 'end'; return true; }
  moveBy(G, p, d1 + d2);
  if (S.phase !== 'buy') afterLand(G);
  return true;
}

function afterLand(G) {
  const S = G.S, p = S.players[S.turn];
  const again = S.dice[0] === S.dice[1] && S.doubles > 0 && p.jail === 0 && !p.out;
  S.phase = again ? 'roll' : 'end';
  if (again) S.msg = `${p.name} lăn đôi, được lăn thêm lần nữa.`;
  return true;
}

function nextPlayer(G) {
  const S = G.S;
  let n = S.turn;
  do { n = (n + 1) % S.players.length; if (n === 0) S.round++; } while (S.players[n].out);
  S.turn = n; S.phase = 'roll'; S.doubles = 0;
  const p = S.players[n];
  S.view = { kind: 'tile', i: p.pos };
  S.msg = p.jail ? `${p.name} đang ở Trạm Nghỉ: lăn đôi, trả ${BAIL} ${CUR} hoặc dùng vé.` : `Đến lượt ${p.name}.`;
  if (p.money < 0) S.msg += ` Còn nợ ${-p.money} ${CUR}.`;
}

// ---------- tiền ----------
const idx = (S, p) => S.players.indexOf(p);
function gain(G, p, amt) { p.money += amt; say(G, `${p.name} nhận ${amt} ${CUR}.`); }
function pay(G, p, toIdx, amt, why) {
  const S = G.S;
  p.money -= amt;
  if (toIdx != null) S.players[toIdx].money += amt;
  G.ev.push({ type: 'money', from: idx(S, p), to: toIdx, amt });
  say(G, `${p.name} trả ${amt} ${CUR}${toIdx != null ? ' cho ' + S.players[toIdx].name : ''}${why ? ' — ' + why : ''}.`);
  if (p.money < 0) { p.creditor = toIdx; addLog(S, `${p.name} đang nợ ${-p.money} ${CUR}: bán nhà hoặc thế chấp đất.`); }
}
function repairs(G, p, perHouse, perStreet) {
  const S = G.S, me = idx(S, p);
  let total = 0;
  for (const i in S.owner) if (S.owner[i] === me) { const h = S.houses[i] || 0; total += h === 5 ? perStreet : h * perHouse; }
  if (total) pay(G, p, null, total, 'sửa nhà'); else say(G, `${p.name} chưa có nhà nào, không phải trả.`);
}

// ---------- di chuyển ----------
function moveBy(G, p, steps) {
  const S = G.S, dir = Math.sign(steps), path = [];
  for (let s = 0; s < Math.abs(steps); s++) {
    p.pos = (p.pos + dir + 40) % 40;
    path.push(p.pos);
    if (p.pos === 0 && dir > 0) { p.money += SALARY; addLog(S, `${p.name} đi qua Nhà, nhận ${SALARY} ${CUR}.`); }
  }
  G.ev.push({ type: 'move', seat: idx(S, p), path });
  land(G, p);
}
const moveTo = (G, p, target) => moveBy(G, p, (target - p.pos + 40) % 40);
function nearest(from, type) { for (let s = 1; s <= 40; s++) { const i = (from + s) % 40; if (TILES[i].type === type) return i; } return from; }
function sendJail(G, p) {
  const S = G.S;
  p.pos = JAIL; p.jail = 1; S.doubles = 0; S.view = { kind: 'tile', i: JAIL };
  G.ev.push({ type: 'jump', seat: idx(S, p), to: JAIL });
  say(G, `${p.name} vào Trạm Nghỉ.`);
}

function land(G, p) {
  const S = G.S, i = p.pos, t = TILES[i];
  S.view = { kind: 'tile', i };
  if (buyable(t)) {
    const o = S.owner[i];
    if (o == null) {
      if (p.money >= t.price) { S.phase = 'buy'; S.msg = `${t.name} chưa có ai ở. ${p.name} có muốn mua với giá ${t.price} ${CUR}?`; }
      else say(G, `${p.name} chưa đủ tiền mua ${t.name}.`);
    } else if (o === idx(S, p)) say(G, `${p.name} về thăm ${t.name} của mình.`);
    else if (S.mort[i]) say(G, `${t.name} đang thế chấp, không thu tiền thuê.`);
    else pay(G, p, o, rentFor(S, i), `thuê ${t.name}`);
  } else if (t.type === 'tax') pay(G, p, null, t.amount, t.name);
  else if (t.type === 'card') draw(G, p, t.deck);
  else if (t.key === 'lost') sendJail(G, p);
  else if (t.key === 'park') say(G, `${p.name} ngồi nghỉ ở Công Viên.`);
  else if (t.key === 'jail') say(G, `${p.name} ghé chơi Trạm Nghỉ.`);
  else if (t.key === 'home') say(G, `${p.name} đứng ở Nhà.`);
}

function draw(G, p, deck) {
  const S = G.S, pile = S.decks[deck];
  const id = pile.shift(); pile.push(id);
  const c = CARDS[deck][id], fx = c.fx;
  S.view = { kind: 'card', deck, id };
  S.msg = `${c.k} ${c.t}`;
  G.ev.push({ type: 'card', deck, id });
  addLog(S, `${p.name} rút thẻ ${deck === 'q' ? 'Câu hỏi' : 'Hàng xóm'}: ${c.t}`);
  const me = idx(S, p);
  if (fx.gain) gain(G, p, fx.gain);
  else if (fx.pay) pay(G, p, null, fx.pay, fx.why);
  else if (fx.goto != null) moveTo(G, p, fx.goto);
  else if (fx.nearest) moveTo(G, p, nearest(p.pos, fx.nearest));
  else if (fx.back) moveBy(G, p, -fx.back);
  else if (fx.repairs) repairs(G, p, ...fx.repairs);
  else if (fx.jail) sendJail(G, p);
  else if (fx.ticket) p.cards++;
  else if (fx.collectEach) S.players.forEach(o => { if (o !== p && !o.out) pay(G, o, me, fx.collectEach, fx.why); });
  else if (fx.payEach) S.players.forEach((o, k) => { if (o !== p && !o.out) pay(G, p, k, fx.payEach, fx.why); });
  // thẻ không làm di chuyển: vẫn cho xem thẻ
  if (S.view.kind === 'tile' && TILES[S.view.i].type === 'card') S.view = { kind: 'card', deck, id };
}

// ---------- quản lý đất ----------
function manage(G, type, i) {
  const S = G.S, p = S.players[S.turn], t = TILES[i];
  if (type === 'build') { const c = DISTRICTS[t.d].house; p.money -= c; S.houses[i] = (S.houses[i] || 0) + 1; say(G, `${p.name} xây ${S.houses[i] === 5 ? 'phố' : 'nhà'} ở ${t.name} (${c} ${CUR}).`); }
  if (type === 'sell') { const c = DISTRICTS[t.d].house / 2; p.money += c; S.houses[i]--; say(G, `${p.name} bán bớt nhà ở ${t.name}, nhận ${c} ${CUR}.`); }
  if (type === 'mort') { const c = t.price / 2; p.money += c; S.mort[i] = true; say(G, `${p.name} thế chấp ${t.name}, nhận ${c} ${CUR}.`); }
  if (type === 'unmort') { const c = unmortCost(t); p.money -= c; delete S.mort[i]; say(G, `${p.name} chuộc lại ${t.name} (${c} ${CUR}).`); }
  if (p.money >= 0) p.creditor = null;
}

function bankrupt(G, forced) {
  const S = G.S, p = S.players[S.turn];
  const to = forced ? null : p.creditor;
  for (const i of Object.keys(S.owner)) {
    if (S.owner[i] !== S.turn) continue;
    delete S.houses[i];
    if (to != null && !S.players[to].out) S.owner[i] = to;
    else { delete S.owner[i]; delete S.mort[i]; }
  }
  p.out = true; p.money = 0;
  say(G, `${p.name} ${forced ? 'rời ván' : 'phá sản'}${to != null ? ', đất chuyển cho ' + S.players[to].name : ', đất trả về phố'}.`);
  const alive = S.players.filter(x => !x.out);
  if (alive.length === 1) { S.winner = idx(S, alive[0]); S.msg = `${alive[0].name} giữ được phố.`; return true; }
  nextPlayer(G);
  return true;
}

// ---------- công cụ dev (chỉ khi opts.dev) ----------
function debug(G, a) {
  const S = G.S, p = S.players[S.turn];
  if (!S.opts.dev) return false;
  if (a.op === 'money' && Number.isInteger(a.n)) { p.money += a.n; addLog(S, `[dev] ${p.name} ${a.n >= 0 ? '+' : ''}${a.n} ${CUR}.`); if (p.money >= 0) p.creditor = null; return true; }
  if (a.op === 'goto' && Number.isInteger(a.i) && a.i >= 0 && a.i < 40 && S.phase === 'roll') {
    addLog(S, `[dev] ${p.name} nhảy tới ${TILES[a.i].name}.`);
    p.jail = 0; moveTo(G, p, a.i);
    if (S.phase !== 'buy') S.phase = 'end';
    return true;
  }
  if (a.op === 'own' && Number.isInteger(a.i) && buyable(TILES[a.i] || {}) && S.owner[a.i] == null) {
    S.owner[a.i] = S.turn; addLog(S, `[dev] ${p.name} nhận ${TILES[a.i].name}.`); return true;
  }
  return false;
}
