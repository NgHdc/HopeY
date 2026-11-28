// Luật chơi thuần: không DOM, không mạng, không Math.random.
// applyAction(state, seat, action) → { ok, state, events }. Trạng thái cũ không bị sửa.
// Mọi số ngẫu nhiên lấy từ state.rng (có seed) → cùng seed + cùng thao tác = cùng ván.
// Bàn cờ, bộ thẻ, luật riêng lấy từ map của ván (S.map → ./maps/).
import { START_MONEY, SALARY, JAIL, GO_JAIL, BAIL, CUR, buyable, groupOf, unmortCost } from './board.js';
import { MAPS, mapOf } from './maps/index.js';
import { SCHEMA_VERSION } from './version.js';

const LOG_MAX = 80;
const MAX_DISCOUNT = 2, BET_MIN = 50, BET_MAX = 500;
/** Phase chờ người chơi chọn giữa lượt. */
export const CHOICE_PHASES = ['buy', 'downgrade', 'fly', 'gamble', 'move'];
// Chế độ Xóm lạ (docs/XOM_LA.md): bàn xáo + sương mù, chọn cách đi, 12 vòng chấm uy tín.
export const XL_ROUNDS = 12, XL_EXPLORE = 10, XL_HOUSE_MULT = 1.2;
const CORNERS = [0, 10, 20, 30];

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

const tilesOf = S => mapOf(S).tiles;
const groupIn = (S, d) => groupOf(tilesOf(S), d);
const houseCost = (S, i) => mapOf(S).districts[tilesOf(S)[i].d].house;

// ---------- tạo ván ----------
export function createGame(names, opts = {}) {
  const map = MAPS[opts.map] ? opts.map : 'classic';
  const S = {
    schemaVersion: SCHEMA_VERSION,
    map,
    rng: (opts.seed ?? Math.floor(Math.random() * 2 ** 32)) >>> 0,
    opts: { dev: !!opts.dev },
    players: names.map((name, i) => ({ name, money: START_MONEY, pos: 0, jail: 0, cards: 0, discount: 0, out: false, piece: (opts.pieces && opts.pieces[i] != null) ? opts.pieces[i] : i, creditor: null, online: true })),
    owner: {}, houses: {}, mort: {},
    turn: 0, phase: 'roll', doubles: 0, dice: [1, 1], round: 1,
    log: [], decks: {}, choice: null, gamble: null, secret: {},
    view: { kind: 'tile', i: 0 }, winner: null,
    msg: `Quân cờ đặt ở ${mapOf({ map }).terms.start}. Người đầu tiên lăn xúc xắc.`,
    stats: newStats(names.length),
  };
  if (opts.xomla) {
    S.layout = makeLayout(S, mapOf(S).tiles);
    S.xl = { rounds: XL_ROUNDS, choose: true, seen: Array.from({ length: 40 }, (_, i) => CORNERS.includes(i)), explored: Array(names.length).fill(0) };
  }
  for (const [k, d] of Object.entries(mapOf(S).decks)) S.decks[k] = shuffle(S, [...d.cards.keys()]);
  addLog(S, `Ván mới trên bàn ${mapOf(S).name}${S.xl ? ' (Xóm lạ: bàn phủ sương, ' + XL_ROUNDS + ' vòng)' : ''}, ${names.length} người, mỗi người ${START_MONEY} ${CUR}.`);
  return S;
}

/**
 * Xáo 36 ô (giữ 4 góc). Đất cùng quận đứng liền nhau thành một khối; không 2 ô thuế liền nhau.
 * Trả về layout: layout[vị trí] = chỉ số ô gốc.
 */
function makeLayout(S, tiles) {
  const blocks = [], byD = {};
  tiles.forEach((t, i) => {
    if (CORNERS.includes(i)) return;
    if (t.type === 'prop') (byD[t.d] ||= []).push(i); else blocks.push([i]);
  });
  for (const d of Object.keys(byD)) blocks.push(shuffle(S, byD[d]));
  let layout = null;
  for (let tries = 0; tries < 50; tries++) {
    const order = shuffle(S, blocks.slice()).flat();
    let k = 0;
    layout = Array.from({ length: 40 }, (_, pos) => (CORNERS.includes(pos) ? pos : order[k++]));
    const tax = pos => tiles[layout[pos]].type === 'tax';
    if (!layout.some((_, pos) => tax(pos) && tax((pos + 1) % 40))) break;
  }
  return layout;
}
/** Vị trí hiện tại của ô gốc `orig` (thẻ "đến ô X" của map). */
const posOf = (S, orig) => (S.layout ? S.layout.indexOf(orig) : orig);

/** Uy tín của người k (chỉ chế độ Xóm lạ): tài sản/100 (nhà ×1,2) + mỗi 5 ô khai hoang + lệ + trò hội làng. */
export function prestige(S, k) {
  if (!S.xl) return null;
  const p = S.players[k], T = tilesOf(S);
  let worth = p.out ? 0 : Math.max(0, p.money);
  for (const i in S.owner) {
    if (S.owner[i] !== k) continue;
    const t = T[i];
    worth += S.mort[i] ? t.price / 2 : t.price;
    if (t.type === 'prop') worth += (S.houses[i] || 0) * houseCost(S, i) * XL_HOUSE_MULT;
  }
  const r = {
    worth: Math.floor(worth / 100),
    explore: Math.floor((S.xl.explored[k] || 0) / 5),
    rules: 5 * ((S.xl.claims && S.xl.claims[k]) || 0),
    games: (S.xl.wins && S.xl.wins[k]) || 0,
  };
  r.total = r.worth + r.explore + r.rules + r.games;
  return r;
}

export function newStats(n) {
  return { rent: Array(n).fill(0), lands: {}, jails: Array(n).fill(0), worth: [Array(n).fill(START_MONEY)], outRound: Array(n).fill(null) };
}

// ---------- tiện ích đọc trạng thái (UI dùng chung) ----------
/** Tài sản: tiền + giá đất (thế chấp tính nửa) + giá nhà đã xây. */
export function netWorth(S, k) {
  const p = S.players[k], T = tilesOf(S);
  if (p.out) return 0;
  let w = p.money;
  for (const i in S.owner) {
    if (S.owner[i] !== k) continue;
    const t = T[i];
    w += S.mort[i] ? t.price / 2 : t.price;
    if (t.type === 'prop') w += (S.houses[i] || 0) * houseCost(S, i);
  }
  return w;
}
const WORTH_MAX = 64;
/** Ghi tài sản mỗi vòng cho biểu đồ cuối ván. Quá WORTH_MAX điểm thì bỏ bớt một nửa, giữ điểm đầu và cuối. */
function snapshotWorth(S) {
  const w = S.stats.worth;
  w.push(S.players.map((_, k) => netWorth(S, k)));
  if (w.length > WORTH_MAX) S.stats.worth = w.filter((_, i) => i % 2 === 0 || i === w.length - 1);
}
export const ownedOfType = (S, o, type) => tilesOf(S).filter((t, i) => t.type === type && S.owner[i] === o).length;
export const ownsGroup = (S, o, d) => o != null && groupIn(S, d).every(i => S.owner[i] === o);
export function rentFor(S, i) {
  const t = tilesOf(S)[i], o = S.owner[i];
  if (t.type === 'station') return 25 * 2 ** (ownedOfType(S, o, 'station') - 1);
  if (t.type === 'util') return (S.dice[0] + S.dice[1]) * (ownedOfType(S, o, 'util') === 2 ? 10 : 4);
  const h = S.houses[i] || 0;
  if (h) return t.rent[h];
  return ownsGroup(S, o, t.d) ? t.rent[0] * 2 : t.rent[0];
}
/** Ô i có đang là ô nhiều nhà nhất quận không (luật bán/hạ đều). */
const topOfGroup = (S, i) => { const h = S.houses[i] || 0; return h > 0 && groupIn(S, tilesOf(S)[i].d).every(j => (S.houses[j] || 0) <= h); };
/** Người đang tới lượt có được làm thao tác quản lý `type` trên ô i không. */
export function canManage(S, type, i) {
  const t = tilesOf(S)[i], me = S.turn, p = S.players[me];
  if (S.winner != null || S.owner[i] !== me) return false;
  const h = S.houses[i] || 0;
  if (type === 'mort') return !S.mort[i] && (t.type !== 'prop' || groupIn(S, t.d).every(j => !S.houses[j]));
  if (type === 'unmort') return !!S.mort[i] && p.money >= unmortCost(t);
  if (t.type !== 'prop') return false;
  const g = groupIn(S, t.d), hs = g.map(j => S.houses[j] || 0);
  if (type === 'build') return ownsGroup(S, me, t.d) && g.every(j => !S.mort[j]) && h < 5 && h <= Math.min(...hs) && p.money >= houseCost(S, i);
  if (type === 'sell') return topOfGroup(S, i);
  return false;
}
/** Các ô người đang tới lượt được chọn ở phase hiện tại (Hạ cấp, Máy bay). */
export function choiceTiles(S) {
  const me = S.turn, p = S.players[me];
  if (S.phase === 'downgrade') return Object.keys(S.houses).map(Number).filter(i => S.owner[i] != null && S.owner[i] !== me && topOfGroup(S, i)).sort((a, b) => a - b);
  if (S.phase === 'fly') return tilesOf(S).map((_, i) => i).filter(i => i !== GO_JAIL && i !== p.pos);
  return [];
}
/** Mức cược được phép cho thẻ Con bạc, hoặc null nếu không đủ tiền. */
export function betRange(S, k = S.turn) {
  const m = S.players[k].money;
  if (m < BET_MIN) return null;
  return { min: BET_MIN, max: Math.max(BET_MIN, Math.min(BET_MAX, Math.floor(m / 20) * 10)), step: 10 };
}
/** Ô thua cược sẽ bay tới: ô đối thủ có tiền thuê cao nhất; chưa ai có đất thì ô trống đắt nhất. */
export function gambleTarget(S, k = S.turn) {
  const T = tilesOf(S);
  let best = null, bestV = -1;
  for (const i of Object.keys(S.owner).map(Number)) {
    if (S.owner[i] === k || S.mort[i]) continue;
    const r = rentFor(S, i);
    if (r > bestV || (r === bestV && i > best)) { best = i; bestV = r; }
  }
  if (best != null) return best;
  T.forEach((t, i) => { if (buyable(t) && S.owner[i] == null && t.price >= bestV) { best = i; bestV = t.price; } });
  return best;
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
  if (ok && S.winner == null) hook(G, 'afterStep');
  return ok ? { ok, state: S, events: G.ev } : { ok, state: prev, events: [] };
}

/** Gọi luật riêng của map (nếu có). Map chỉ được dùng các hàm trong api. */
function hook(G, name, ...args) {
  const f = mapOf(G.S).hooks[name];
  if (!f) return;
  const api = { group: d => groupIn(G.S, d), log: s => addLog(G.S, s), say: s => say(G, s), pay: (p, to, amt, why) => pay(G, p, to, amt, why) };
  f(G, ...args, api);
}

function step(G, seat, a) {
  const S = G.S;
  if (S.winner != null || seat !== S.turn) return false;
  const p = S.players[S.turn], T = tilesOf(S);
  const tileArg = Number.isInteger(a.i) && a.i >= 0 && a.i < T.length;
  switch (a.type) {
    case 'roll': return roll(G, a);
    case 'move':
      if (S.phase !== 'move' || !S.choice || !S.choice.opts.includes(a.n)) return false;
      resume(S);
      addLog(S, `${p.name} chọn đi ${a.n} ô.`);
      moveBy(G, p, a.n);
      return done(G);
    case 'buy': {
      if (S.phase !== 'buy') return false;
      const t = T[p.pos];
      p.money -= t.price; S.owner[p.pos] = S.turn;
      say(G, `${p.name} mua ${t.name} với giá ${t.price} ${CUR}.`);
      return afterLand(G);
    }
    case 'skip':
      if (S.phase !== 'buy') return false;
      say(G, `${p.name} để ${T[p.pos].name} cho người sau.`);
      return afterLand(G);
    case 'downgrade': {
      if (S.phase !== 'downgrade' || !tileArg || !choiceTiles(S).includes(a.i)) return false;
      resume(S);
      const h = --S.houses[a.i];
      if (!h) delete S.houses[a.i];
      say(G, `${p.name} hạ cấp ${T[a.i].name} của ${S.players[S.owner[a.i]].name}: còn ${h ? h + ' nhà' : 'đất trống'}.`);
      return done(G);
    }
    case 'fly': {
      if (S.phase !== 'fly' || !tileArg || !choiceTiles(S).includes(a.i)) return false;
      resume(S);
      say(G, `${p.name} bay tới ${T[a.i].name}.`);
      jump(G, p, a.i, true);
      return done(G);
    }
    case 'gamble': return gamble(G, a);
    case 'bail':
      if (S.phase !== 'roll' || !p.jail || p.money < BAIL) return false;
      pay(G, p, null, BAIL, 'rời ' + mapOf(S).terms.jail); p.jail = 0; return true;
    case 'ticket':
      if (S.phase !== 'roll' || !p.jail || !p.cards) return false;
      p.cards--; p.jail = 0; say(G, `${p.name} dùng vé, rời ${mapOf(S).terms.jail}.`); return true;
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
      if (!tileArg || !canManage(S, a.type, a.i)) return false;
      manage(G, a.type, a.i); return true;
    case 'debug': return debug(G, a);
    default: return false;
  }
}

// Phase 'act' = đang xử lý; xong mà không có lựa chọn mới thì sang afterLand.
function resume(S) { S.phase = 'act'; S.choice = null; }
function done(G) { if (G.S.phase === 'act') afterLand(G); return true; }

function roll(G, a) {
  const S = G.S, p = S.players[S.turn], jailName = mapOf(S).terms.jail;
  if (S.phase !== 'roll') return false;
  const forced = S.opts.dev && Array.isArray(a.dice) && a.dice.every(n => Number.isInteger(n) && n >= 1 && n <= 6) && a.dice.length === 2;
  const d1 = forced ? a.dice[0] : d6(S), d2 = forced ? a.dice[1] : d6(S), dbl = d1 === d2;
  S.dice = [d1, d2];
  S.phase = 'act'; S.gamble = null;
  G.ev.push({ type: 'dice', dice: [d1, d2] });
  addLog(S, `${p.name} lăn ${d1} + ${d2}${dbl ? ' (đôi)' : ''}.`);
  if (p.jail > 0) {
    if (dbl) { p.jail = 0; say(G, `${p.name} lăn đôi, rời ${jailName}.`); moveBy(G, p, d1 + d2); }
    else if (++p.jail > 3) { p.jail = 0; pay(G, p, null, BAIL, 'ngồi đủ 3 lượt, phải trả để đi'); moveBy(G, p, d1 + d2); }
    else say(G, `${p.name} vẫn ngồi ở ${jailName} (lần thử ${p.jail - 1}/3).`);
    if (S.phase === 'act') S.phase = 'end';
    return true;
  }
  if (dbl && ++S.doubles === 3) { addLog(S, 'Ba lần đôi liền.'); sendJail(G, p); S.phase = 'end'; return true; }
  if (S.xl && S.xl.choose) {
    // Xóm lạ: đi theo tổng hoặc theo một con xúc xắc
    S.phase = 'move';
    S.choice = { kind: 'move', opts: [...new Set([d1 + d2, d1, d2])] };
    S.msg = `${p.name} chọn đi ${S.choice.opts.join(' hay ')} ô.`;
    return true;
  }
  moveBy(G, p, d1 + d2);
  return done(G);
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
  do {
    n = (n + 1) % S.players.length;
    if (n === 0) {
      S.round++; snapshotWorth(S);
      if (S.xl && S.round > S.xl.rounds) { finishByPrestige(G); return; }
    }
  } while (S.players[n].out);
  S.turn = n; S.phase = 'roll'; S.doubles = 0; S.choice = null; S.gamble = null;
  const p = S.players[n];
  S.view = { kind: 'tile', i: p.pos };
  S.msg = p.jail ? `${p.name} đang ở ${mapOf(S).terms.jail}: lăn đôi, trả ${BAIL} ${CUR} hoặc dùng vé.` : `Đến lượt ${p.name}.`;
  if (p.money < 0) S.msg += ` Còn nợ ${-p.money} ${CUR}.`;
}

/** Hết vòng cuối: ai uy tín cao nhất thắng (hòa thì tài sản, rồi ghế nhỏ hơn). */
function finishByPrestige(G) {
  const S = G.S;
  S.round = S.xl.rounds;
  const sc = S.players.map((_, k) => prestige(S, k));
  S.xl.final = sc;
  let w = 0;
  sc.forEach((r, k) => { if (r.total > sc[w].total || (r.total === sc[w].total && netWorth(S, k) > netWorth(S, w))) w = k; });
  S.winner = w; S.phase = 'end';
  say(G, `Hết ${S.xl.rounds} vòng. ${S.players[w].name} có uy tín cao nhất xóm: ${sc[w].total} điểm.`);
}

// ---------- tiền ----------
const idx = (S, p) => S.players.indexOf(p);
function gain(G, p, amt) { p.money += amt; G.ev.push({ type: 'money', from: null, to: idx(G.S, p), amt }); say(G, `${p.name} nhận ${amt} ${CUR}.`); }
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
/** Tổng giá trị công trình của người k: số nhà × giá nhà quận (khách sạn = 5 nhà). */
export function buildingValue(S, k) {
  let v = 0;
  for (const i in S.houses) if (S.owner[i] === k) v += S.houses[i] * houseCost(S, i);
  return v;
}

// ---------- di chuyển ----------
function passStart(G, p) {
  const S = G.S;
  const salary = p.worker ? SALARY / 2 : SALARY;
  p.money += salary;
  addLog(S, `${p.name} đi qua ${mapOf(S).terms.start}, nhận ${salary} ${CUR}${p.worker ? ' (lương làm thuê)' : ''}.`);
  hook(G, 'onPassStart', p);
}
function moveBy(G, p, steps) {
  const S = G.S, dir = Math.sign(steps), path = [];
  for (let s = 0; s < Math.abs(steps); s++) {
    p.pos = (p.pos + dir + 40) % 40;
    path.push(p.pos);
    if (p.pos === 0 && dir > 0) passStart(G, p);
  }
  G.ev.push({ type: 'move', seat: idx(S, p), path });
  land(G, p);
}
/** Dịch chuyển thẳng tới ô (máy bay, thua cược). salary: đi theo chiều bàn cờ, qua Xuất phát thì nhận lương. */
function jump(G, p, target, salary) {
  const S = G.S;
  if (salary && target < p.pos) passStart(G, p);
  p.pos = target;
  G.ev.push({ type: 'jump', seat: idx(S, p), to: target });
  land(G, p);
}
const moveTo = (G, p, target) => moveBy(G, p, (target - p.pos + 40) % 40);
function nearest(S, from, type) { const T = tilesOf(S); for (let s = 1; s <= 40; s++) { const i = (from + s) % 40; if (T[i].type === type) return i; } return from; }
function sendJail(G, p) {
  const S = G.S;
  p.pos = JAIL; p.jail = 1; S.doubles = 0; S.view = { kind: 'tile', i: JAIL };
  S.stats.jails[idx(S, p)]++;
  G.ev.push({ type: 'jump', seat: idx(S, p), to: JAIL });
  say(G, `${p.name} vào ${mapOf(S).terms.jail}.`);
}

function land(G, p) {
  const S = G.S, i = p.pos, t = tilesOf(S)[i];
  S.view = { kind: 'tile', i };
  S.stats.lands[i] = (S.stats.lands[i] || 0) + 1;
  if (S.xl && !S.xl.seen[i]) {
    // Xóm lạ: sương tan ở ô có người dừng chân; người mở ô được thưởng khai hoang
    const k = idx(S, p);
    S.xl.seen[i] = true; S.xl.explored[k]++;
    p.money += XL_EXPLORE;
    G.ev.push({ type: 'reveal', i, seat: k });
    addLog(S, `${p.name} khai hoang: sương tan, hiện ra ${t.name} (+${XL_EXPLORE} ${CUR}).`);
  }
  if (buyable(t)) {
    const o = S.owner[i];
    if (o == null) {
      if (p.worker) say(G, `${p.name} đang đi làm thuê, chưa mua được ${t.name}.`);
      else if (p.money >= t.price) { S.phase = 'buy'; S.msg = `${t.name} chưa có ai ở. ${p.name} có muốn mua với giá ${t.price} ${CUR}?`; }
      else say(G, `${p.name} chưa đủ tiền mua ${t.name}.`);
    } else if (o === idx(S, p)) say(G, `${p.name} về thăm ${t.name} của mình.`);
    else if (S.mort[i]) say(G, `${t.name} đang thế chấp, không thu tiền thuê.`);
    else {
      let rent = rentFor(S, i);
      if (p.discount > 0 && rent > 0) {
        p.discount--;
        const half = Math.min(rent, Math.ceil(rent / 20) * 10);
        addLog(S, `${p.name} dùng vé giảm 50%: ${rent} → ${half} ${CUR}.`);
        rent = half;
      }
      S.stats.rent[o] += rent; pay(G, p, o, rent, `thuê ${t.name}`);
    }
  } else if (t.type === 'tax') pay(G, p, null, t.amount, t.name);
  else if (t.type === 'card') draw(G, p, t.deck);
  else if (t.key === 'lost') sendJail(G, p);
  else if (t.visit) say(G, `${p.name} ${t.visit}.`);
}

function draw(G, p, deck) {
  const S = G.S, D = mapOf(S).decks[deck];
  if (!S.decks[deck] || !S.decks[deck].length) S.decks[deck] = shuffle(S, [...D.cards.keys()]);
  const id = S.decks[deck].shift();
  if (!S.decks[deck].length) S.decks[deck] = shuffle(S, [...D.cards.keys()]); // hết bộ thì xáo lại
  const c = D.cards[id], fx = c.fx;
  S.view = { kind: 'card', deck, id };
  S.msg = `${c.k} ${c.t}`;
  G.ev.push({ type: 'card', deck, id });
  addLog(S, `${p.name} rút thẻ ${D.name}: ${c.t}`);
  const me = idx(S, p), T = tilesOf(S);
  if (fx.gain) gain(G, p, fx.gain);
  else if (fx.pay) pay(G, p, null, fx.pay, fx.why);
  else if (fx.goto != null) moveTo(G, p, posOf(S, fx.goto));
  else if (fx.nearest) moveTo(G, p, nearest(S, p.pos, fx.nearest));
  else if (fx.back) moveBy(G, p, -fx.back);
  else if (fx.repairs) repairs(G, p, ...fx.repairs);
  else if (fx.jail) sendJail(G, p);
  else if (fx.ticket) p.cards++;
  else if (fx.collectEach) S.players.forEach(o => { if (o !== p && !o.out) pay(G, o, me, fx.collectEach, fx.why); });
  else if (fx.payEach) S.players.forEach((o, k) => { if (o !== p && !o.out) pay(G, p, k, fx.payEach, fx.why); });
  else if (fx.sellRandom) {
    const list = Object.keys(S.houses).map(Number).filter(i => S.owner[i] === me && topOfGroup(S, i)).sort((a, b) => a - b);
    if (!list.length) say(G, `${p.name} chưa có công trình nào, không mất gì.`);
    else {
      const i = list[Math.floor(rand(S) * list.length)], c2 = houseCost(S, i) / 2;
      if (!--S.houses[i]) delete S.houses[i];
      p.money += c2;
      say(G, `${p.name} phải bán bớt một công trình ở ${T[i].name}, nhận ${c2} ${CUR}.`);
    }
  } else if (fx.downgrade) {
    S.phase = 'downgrade';
    const opts = choiceTiles(S);
    if (!opts.length) { S.phase = 'act'; say(G, 'Chưa đối thủ nào có nhà, thẻ không có tác dụng.'); }
    else { S.choice = { kind: 'downgrade', tiles: opts }; S.msg = `${p.name} chọn một công trình của đối thủ để hạ 1 bậc.`; }
  } else if (fx.discount) {
    if (p.discount >= MAX_DISCOUNT) say(G, `${p.name} đã giữ đủ ${MAX_DISCOUNT} vé giảm giá, bỏ thẻ này.`);
    else { p.discount++; say(G, `${p.name} giữ vé giảm 50% (đang có ${p.discount}).`); }
  } else if (fx.fly) {
    S.phase = 'fly'; S.choice = { kind: 'fly' };
    S.msg = `${p.name} chọn một ô để bay tới (trừ ô ${T[GO_JAIL].name}).`;
  } else if (fx.gamble) {
    const r = betRange(S, me);
    if (!r) say(G, `${p.name} không đủ ${BET_MIN} ${CUR} để ngồi vào ván, thẻ không có tác dụng.`);
    else { S.phase = 'gamble'; S.choice = { kind: 'gamble', ...r, target: gambleTarget(S, me) }; S.msg = `${p.name} đặt cược từ ${r.min} đến ${r.max} ${CUR}, đoán tổng hai xúc xắc chẵn hay lẻ.`; }
  } else if (fx.wealthTax) {
    const v = buildingValue(S, me), amt = Math.ceil((v * fx.wealthTax) / 10) * 10;
    if (amt) pay(G, p, null, amt, 'thuế công trình'); else say(G, `${p.name} chưa xây gì, không phải nộp thuế.`);
  }
  // thẻ không làm di chuyển: vẫn cho xem thẻ
  if (S.view.kind === 'tile' && T[S.view.i].type === 'card') S.view = { kind: 'card', deck, id };
}

function gamble(G, a) {
  const S = G.S, me = S.turn, p = S.players[me], r = betRange(S, me);
  if (S.phase !== 'gamble' || !r) return false;
  const bet = a.bet, pick = a.pick;
  if (!Number.isInteger(bet) || bet % r.step || bet < r.min || bet > r.max || (pick !== 'even' && pick !== 'odd')) return false;
  resume(S);
  const dice = [d6(S), d6(S)], sum = dice[0] + dice[1], win = (sum % 2 === 0) === (pick === 'even');
  S.gamble = { dice, bet, pick, win, seat: me };
  G.ev.push({ type: 'dice', dice, gamble: true });
  addLog(S, `${p.name} cược ${bet} ${CUR} vào ${pick === 'even' ? 'chẵn' : 'lẻ'}; xúc xắc ra ${dice[0]} + ${dice[1]} = ${sum}.`);
  if (win) gain(G, p, bet * 2);
  else {
    pay(G, p, null, bet, 'thua cược');
    const tgt = gambleTarget(S, me);
    if (tgt != null) { say(G, `${p.name} thua cược, bị đưa tới ${tilesOf(S)[tgt].name}.`); jump(G, p, tgt, false); }
  }
  return done(G);
}

// ---------- quản lý đất ----------
function manage(G, type, i) {
  const S = G.S, p = S.players[S.turn], t = tilesOf(S)[i];
  if (type === 'build') { const c = houseCost(S, i); p.money -= c; S.houses[i] = (S.houses[i] || 0) + 1; say(G, `${p.name} xây ${S.houses[i] === 5 ? 'phố' : 'nhà'} ở ${t.name} (${c} ${CUR}).`); }
  if (type === 'sell') { const c = houseCost(S, i) / 2; p.money += c; if (!--S.houses[i]) delete S.houses[i]; say(G, `${p.name} bán bớt nhà ở ${t.name}, nhận ${c} ${CUR}.`); }
  if (type === 'mort') { const c = t.price / 2; p.money += c; S.mort[i] = true; say(G, `${p.name} thế chấp ${t.name}, nhận ${c} ${CUR}.`); }
  if (type === 'unmort') { const c = unmortCost(t); p.money -= c; delete S.mort[i]; say(G, `${p.name} chuộc lại ${t.name} (${c} ${CUR}).`); }
  if (p.money >= 0) p.creditor = null;
}

function bankrupt(G, forced) {
  const S = G.S, p = S.players[S.turn];
  const to = forced ? null : p.creditor;
  if (S.xl && !forced) {
    // Xóm lạ: không ai bị loại. Đất về chủ nợ (hoặc về phố), xóa nợ, đi làm thuê tới hết ván.
    for (const i of Object.keys(S.owner)) {
      if (S.owner[i] !== S.turn) continue;
      delete S.houses[i];
      if (to != null && !S.players[to].out) S.owner[i] = to; else { delete S.owner[i]; delete S.mort[i]; }
    }
    p.money = 0; p.creditor = null; p.worker = true;
    say(G, `${p.name} trắng tay${to != null ? ', đất chuyển cho ' + S.players[to].name : ''}, đi làm thuê tới hết ván.`);
    nextPlayer(G);
    return true;
  }
  for (const i of Object.keys(S.owner)) {
    if (S.owner[i] !== S.turn) continue;
    delete S.houses[i];
    if (to != null && !S.players[to].out) S.owner[i] = to;
    else { delete S.owner[i]; delete S.mort[i]; }
  }
  p.out = true; p.money = 0;
  S.stats.outRound[S.turn] = S.round;
  say(G, `${p.name} ${forced ? 'rời ván' : 'phá sản'}${to != null ? ', đất chuyển cho ' + S.players[to].name : ', đất trả về phố'}.`);
  const alive = S.players.filter(x => !x.out);
  if (alive.length === 1) { S.winner = idx(S, alive[0]); S.msg = `${alive[0].name} giữ được phố.`; snapshotWorth(S); return true; }
  nextPlayer(G);
  return true;
}

// ---------- công cụ dev (chỉ khi opts.dev) ----------
function debug(G, a) {
  const S = G.S, p = S.players[S.turn], T = tilesOf(S);
  if (!S.opts.dev) return false;
  if (a.op === 'money' && Number.isInteger(a.n)) { p.money += a.n; addLog(S, `[dev] ${p.name} ${a.n >= 0 ? '+' : ''}${a.n} ${CUR}.`); if (p.money >= 0) p.creditor = null; return true; }
  if (a.op === 'goto' && Number.isInteger(a.i) && a.i >= 0 && a.i < 40 && S.phase === 'roll') {
    addLog(S, `[dev] ${p.name} nhảy tới ${T[a.i].name}.`);
    p.jail = 0; S.phase = 'act'; moveTo(G, p, a.i);
    if (S.phase === 'act') S.phase = 'end';
    return true;
  }
  if (a.op === 'own' && Number.isInteger(a.i) && buyable(T[a.i] || {}) && S.owner[a.i] == null) {
    S.owner[a.i] = S.turn; addLog(S, `[dev] ${p.name} nhận ${T[a.i].name}.`); return true;
  }
  if (a.op === 'card' && typeof a.deck === 'string' && mapOf(S).decks[a.deck] && Number.isInteger(a.id) && S.phase === 'roll') {
    // rút đúng lá id ngay tại chỗ (để thử thẻ)
    const pile = S.decks[a.deck], k = pile.indexOf(a.id);
    if (a.id < 0 || a.id >= mapOf(S).decks[a.deck].cards.length) return false;
    if (k >= 0) pile.splice(k, 1);
    pile.unshift(a.id); // lá đã rút rồi thì chen lên đầu, rút xong bộ vẫn như cũ
    S.phase = 'act'; draw(G, p, a.deck);
    if (S.phase === 'act') S.phase = 'end';
    return true;
  }
  return false;
}
