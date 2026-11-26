// Hàm vẽ thuần: nhận trạng thái + ngữ cảnh, trả về chuỗi HTML. Không đọc/ghi DOM.
// ctx = { me, mine, mode: 'local'|'host'|'guest', room, status, dev, version, viewOverride, pos }
import { TILES, DISTRICTS, CUR, BAIL, buyable, unmortCost } from '../core/board.js';
import { CARDS } from '../core/cards.js';
import { ownsGroup, ownedOfType, canManage } from '../core/rules.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pad = n => String(n + 1).padStart(2, '0');

// ---------- quân cờ ----------
export const PIECES = [
  { n: 'tròn', c: 'var(--accent)', s: '<circle cx="8" cy="8" r="6"/>' },
  { n: 'tam giác', c: 'var(--accent-2)', s: '<path d="M8 2 L14.5 14 H1.5Z"/>' },
  { n: 'vuông', c: 'var(--cool-1)', s: '<rect x="2.5" y="2.5" width="11" height="11"/>' },
  { n: 'lục giác', c: 'var(--cool-2)', s: '<path d="M8 1.5 L13.6 4.75 V11.25 L8 14.5 L2.4 11.25 V4.75Z"/>' },
  { n: 'ngôi nhà', c: 'var(--ink)', s: '<path d="M2 8 L8 2.5 L14 8 V14 H2Z"/>' },
  { n: 'chiếc lá', c: 'var(--d7)', s: '<path d="M2 14 C2 6 6 2 14 2 C14 10 10 14 2 14Z"/>' },
];
export const pieceSvg = (k, sz) =>
  `<svg class="piece" width="${sz}" height="${sz}" viewBox="0 0 16 16" style="fill:${PIECES[k].c};stroke:var(--paper);stroke-width:1.2" aria-label="${PIECES[k].n}">${PIECES[k].s}</svg>`;

// ---------- bàn cờ ----------
function cell(i) {
  if (i === 0) return [11, 11];
  if (i < 10) return [11, 11 - i];
  if (i === 10) return [11, 1];
  if (i < 20) return [11 - (i - 10), 1];
  if (i === 20) return [1, 1];
  if (i < 30) return [1, 1 + (i - 20)];
  if (i === 30) return [1, 11];
  return [1 + (i - 30), 11];
}
const swClass = t => t.type === 'prop' ? 'd' + t.d : t.type === 'station' ? 'st' : t.type === 'util' ? 'ut' : t.type === 'tax' ? 'tx' : t.type === 'card' ? (t.deck === 'q' ? 'cq' : 'ch') : '';

const ICONS = {
  home: '<svg class="icon" viewBox="0 0 60 44"><circle cx="46" cy="12" r="7" fill="var(--accent-2)"/><path d="M8 24 L22 12 L36 24 V40 H8Z" fill="none" stroke="var(--ink)" stroke-width="1"/><rect x="18" y="30" width="8" height="10" fill="var(--ink)"/><line x1="0" y1="40" x2="60" y2="40" stroke="var(--ink)" stroke-width=".6"/></svg>',
  jail: '<svg class="icon" viewBox="0 0 60 44"><line x1="6" y1="30" x2="54" y2="30" stroke="var(--ink)" stroke-width="2"/><line x1="12" y1="30" x2="12" y2="40" stroke="var(--ink)"/><line x1="48" y1="30" x2="48" y2="40" stroke="var(--ink)"/><circle cx="22" cy="12" r="3.2" fill="var(--ink)"/><path d="M22 15 V28 M17 20 H27" stroke="var(--ink)"/><circle cx="38" cy="12" r="3.2" fill="var(--ink)"/><path d="M38 15 V28 M33 20 H43" stroke="var(--ink)"/><rect x="34" y="6" width="8" height="2" fill="var(--accent-2)"/></svg>',
  park: '<svg class="icon" viewBox="0 0 60 44"><defs><pattern id="h45" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="var(--neutral)" stroke-width="1.4"/></pattern></defs><rect x="0" y="34" width="60" height="10" fill="url(#h45)"/><circle cx="22" cy="16" r="12" fill="var(--cool-2)"/><line x1="22" y1="26" x2="22" y2="38" stroke="var(--ink)" stroke-width="1.4"/><circle cx="44" cy="22" r="3" fill="var(--ink)"/><path d="M44 25 V36 M40 29 H48" stroke="var(--ink)"/></svg>',
  lost: '<svg class="icon" viewBox="0 0 60 44"><path d="M6 36 C14 6 26 40 32 18 S48 4 52 22" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="2 3"/><path d="M52 22 L47 20 L52 29 L56 20Z" fill="var(--accent)"/><circle cx="6" cy="36" r="3" fill="var(--ink)"/></svg>',
};

export function currentView(S, ctx) { return ctx.viewOverride || S.view; }

export function boardHtml(S, ctx) {
  const v = currentView(S, ctx), sel = v.kind === 'tile' ? v.i : -1;
  const pos = k => (ctx.pos && ctx.pos[k] != null ? ctx.pos[k] : S.players[k].pos);
  let html = '';
  TILES.forEach((t, i) => {
    const [r, c] = cell(i);
    const here = S.players.map((p, k) => (!p.out && pos(k) === i ? pieceSvg(p.piece, 15) : '')).join('');
    const o = S.owner[i], h = S.houses[i] || 0;
    const cls = ['tile', t.type === 'corner' ? 'corner' : '', i === sel ? 'sel' : '', S.mort[i] ? 'mort' : ''].join(' ');
    const style = `grid-row:${r};grid-column:${c}`;
    if (t.type === 'corner') {
      html += `<div class="${cls}" style="${style}" data-tile="${i}" title="${esc(t.name)}">
        <span class="big">${pad(i)}</span><div class="t-name">${t.name}</div>${ICONS[t.key]}<div class="pieces">${here}</div></div>`;
      return;
    }
    const price = buyable(t) ? t.price : t.type === 'tax' ? '−' + t.amount : '?';
    const houses = h === 5 ? '<b></b>' : '<i></i>'.repeat(h);
    html += `<div class="${cls}" style="${style}" data-tile="${i}" title="${esc(t.name)}">
      <div class="t-top"><span class="num">${pad(i)}</span><span class="sw ${swClass(t)}"></span></div>
      <div class="t-name">${t.name}</div>
      <div class="pieces">${here}</div>
      <div class="t-bot"><span>${price}</span><span class="houses">${houses}</span>${o != null ? `<span class="own">${pieceSvg(S.players[o].piece, 10)}</span>` : ''}</div>
    </div>`;
  });
  return html + centerHtml(S, ctx);
}

function dieSvg(n) {
  const P6 = { 1: [[8, 8]], 2: [[4, 4], [12, 12]], 3: [[4, 4], [8, 8], [12, 12]], 4: [[4, 4], [12, 4], [4, 12], [12, 12]], 5: [[4, 4], [12, 4], [8, 8], [4, 12], [12, 12]], 6: [[4, 4], [12, 4], [4, 8], [12, 8], [4, 12], [12, 12]] };
  return `<svg class="die" viewBox="0 0 16 16">${P6[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" style="fill:${n === 1 ? 'var(--accent-2)' : 'var(--ink)'}"/>`).join('')}</svg>`;
}

const SCENE = `<svg class="scene" viewBox="0 0 260 90" aria-hidden="true">
  <line x1="0" y1="80" x2="260" y2="80" stroke="var(--ink)" stroke-width=".6"/>
  <rect x="0" y="80" width="260" height="10" fill="var(--cool-2-l)"/>
  <path d="M0 85 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="var(--cool-2)" stroke-width=".6"/>
  <rect x="18" y="44" width="34" height="36" fill="none" stroke="var(--ink)" stroke-width=".7"/><path d="M14 44 L35 28 L56 44" fill="none" stroke="var(--ink)" stroke-width=".7"/>
  <rect x="70" y="30" width="22" height="50" fill="var(--d5)"/><circle cx="81" cy="22" r="7" fill="none" stroke="var(--accent)" stroke-width="1"/>
  <g stroke="var(--ink)" stroke-width=".5">${[0, 1, 2, 3, 4, 5].map(k => `<line x1="${104 + k * 5}" y1="50" x2="${104 + k * 5}" y2="80"/>`).join('')}</g>
  <circle cx="170" cy="56" r="16" fill="var(--d7)"/><line x1="170" y1="70" x2="170" y2="80" stroke="var(--ink)"/>
  <circle cx="222" cy="22" r="9" fill="var(--accent-2)"/>
  <g stroke="var(--ink)" stroke-width="1" fill="none"><circle cx="140" cy="59" r="3" fill="var(--ink)"/><path d="M140 62 V72 M135 66 H145 M140 72 L136 80 M140 72 L144 80"/></g>
  <path d="M133 57 L140 52 L147 57Z" fill="var(--accent-2)"/>
  <g stroke="var(--ink)" stroke-width="1" fill="none"><circle cx="200" cy="61" r="2.6" fill="var(--ink)"/><path d="M200 64 V73 M196 67 H204 M200 73 L197 80 M200 73 L203 80"/></g>
</svg>`;

function centerHtml(S, ctx) {
  const v = currentView(S, ctx);
  return `<div class="center">
    <span class="reg tl"></span><span class="reg tr"></span><span class="reg bl"></span><span class="reg br"></span>
    <div class="c-left">
      <div class="logo"><small>BOARD GAME / VÒNG ${S.round}</small>Phố<br>Giấy</div>
      <div><div class="dice">${dieSvg(S.dice[0])}${dieSvg(S.dice[1])}</div></div>
      <p class="msg">${esc(S.msg)}</p>
      ${SCENE}
    </div>
    <div class="c-right">${v.kind === 'card' ? eventCardHtml(v) : deedHtml(S, v.i)}</div>
  </div>`;
}

export function deedHtml(S, i) {
  const t = TILES[i], o = S.owner[i];
  const kick = { prop: 'Ai sống ở đây?', station: 'Đi đâu hôm nay?', util: 'Ai giữ cho phố sáng?', tax: 'Phải đóng gì?', card: 'Rút một thẻ?', corner: 'Dừng lại ở đâu?' }[t.type];
  const grp = t.type === 'prop' ? DISTRICTS[t.d].name : t.type === 'station' ? 'Nhà ga' : t.type === 'util' ? 'Tiện ích' : t.name;
  let body = '';
  if (t.type === 'prop') {
    const h = S.houses[i] || 0, full = ownsGroup(S, o, t.d);
    const rows = [['đất trống', t.rent[0]], ['cả quận, đất trống', t.rent[0] * 2], ['1 nhà', t.rent[1]], ['2 nhà', t.rent[2]], ['3 nhà', t.rent[3]], ['4 nhà', t.rent[4]], ['phố', t.rent[5]]];
    const on = o == null ? -1 : h ? h + 1 : full ? 1 : 0;
    body = `<table class="rent">${rows.map((r, k) => `<tr class="${k === on ? 'on' : ''}"><td>${r[0]}</td><td>${r[1]} ${CUR}</td></tr>`).join('')}</table>
      <div class="foot">giá mua <b>${t.price} ${CUR}</b> · xây nhà ${DISTRICTS[t.d].house} · thế chấp ${t.price / 2}</div>`;
  } else if (t.type === 'station') {
    body = `<table class="rent">${[1, 2, 3, 4].map(n => `<tr class="${o != null && ownedOfType(S, o, 'station') === n ? 'on' : ''}"><td>sở hữu ${n} ga</td><td>${25 * 2 ** (n - 1)} ${CUR}</td></tr>`).join('')}</table>
      <div class="foot">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
  } else if (t.type === 'util') {
    body = `<table class="rent"><tr><td>1 tiện ích</td><td>4 × xúc xắc</td></tr><tr><td>cả 2 tiện ích</td><td>10 × xúc xắc</td></tr></table>
      <div class="foot">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
  } else if (t.type === 'tax') {
    body = `<div class="foot">đóng <b>${t.amount} ${CUR}</b> cho phố</div>`;
  } else if (t.type === 'card') {
    body = `<div class="foot">dừng ở đây → rút một thẻ ${t.name}</div>`;
  }
  const owner = buyable(t) ? `<div class="act">${o == null ? 'chưa có ai ở' : 'chủ: ' + esc(S.players[o].name) + (S.mort[i] ? ' · đang thế chấp' : '')}</div>` : '';
  return `<div class="card">
    <div class="strip"><span>Phố Giấy / ${grp}</span><span>${pad(i)} / 40</span></div>
    <div class="k-row"><span class="kicker">${kick}</span>${t.type === 'corner' ? '' : `<span class="sw lg ${swClass(t)}"></span>`}</div>
    <h3>${t.name}</h3>
    ${t.human ? `<p class="human">${t.human}</p>` : ''}
    ${body}${owner}
  </div>`;
}

export function eventCardHtml(v) {
  const c = CARDS[v.deck][v.id];
  return `<div class="card">
    <div class="strip"><span>Phố Giấy / ${v.deck === 'q' ? 'Câu hỏi' : 'Hàng xóm'}</span><span>thẻ ${String(v.id + 1).padStart(2, '0')}</span></div>
    ${v.deck === 'q' ? '<span class="mark">?</span>' : ''}
    <div class="kicker">${c.k}</div>
    <h3>${c.t}</h3>
    <div class="act">→ ${c.a}</div>
  </div>`;
}

// ---------- cột bên phải ----------
export function sideHtml(S, ctx) {
  const p = S.players[S.turn], alive = S.players.filter(x => !x.out).length;
  const { me, mine, mode, busy } = ctx, local = mode === 'local', host = mode === 'host' || local;
  const human = S.winner != null ? 'Phố vẫn còn đó, và những người đã sống ở đây.'
    : !mine ? (me < 0 ? 'Bạn đang xem ván này.' : `Pha ấm trà, chờ ${esc(p.name)} lăn xúc xắc.`)
    : p.jail ? 'Ngồi ghế đá, ngắm người qua lại.'
    : { roll: 'Xúc xắc đang chờ trong lòng bàn tay.', buy: 'Một mảnh phố đang chờ người đến ở.', end: 'Uống ngụm trà rồi chuyền xúc xắc.' }[S.phase];
  const title = S.winner != null ? `${esc(S.players[S.winner].name)} giữ được phố.`
    : local ? `Lượt của ${esc(p.name)}.` : mine ? 'Lượt của bạn.' : `Lượt của ${esc(p.name)}.`;
  const B = (act, label, primary, enabled = true, arg = '') =>
    `<button class="btn ${primary ? 'primary' : ''}" data-act="${act}" data-arg="${arg}" ${enabled && !busy ? '' : 'disabled'}>${label}</button>`;

  let actions = '';
  if (S.winner != null) actions = host ? B('new', 'Chơi ván mới', true) : '<span class="label">chờ chủ phòng mở ván mới</span>';
  else if (!mine) {
    actions = `<span class="label">${p.online === false ? esc(p.name) + ' đang mất kết nối…' : 'đang chờ ' + esc(p.name) + '…'}</span>`;
    if (mode === 'host' && p.online === false) actions += B('forfeit', `Cho ${esc(p.name)} rời ván`, false);
  } else if (S.phase === 'roll') {
    actions = B('roll', p.jail ? 'Lăn tìm đôi' : 'Lăn xúc xắc', true);
    if (p.jail) actions += B('bail', `Trả ${BAIL} ${CUR}`, false, p.money >= BAIL) + (p.cards ? B('ticket', 'Dùng vé', false) : '');
  } else if (S.phase === 'buy') {
    const t = TILES[p.pos];
    actions = B('buy', `Mua ${t.name} — ${t.price} ${CUR}`, true) + B('skip', 'Bỏ qua', false);
  } else {
    actions = B('end', 'Kết thúc lượt', true, p.money >= 0) + (p.money < 0 ? B('bankrupt', 'Phá sản', false) : '');
  }

  let manage = '';
  const v = currentView(S, ctx);
  if (mine && v.kind === 'tile' && S.owner[v.i] === S.turn) {
    const i = v.i, t = TILES[i], ok = type => canManage(S, type, i) && !busy ? '' : 'disabled';
    manage = `<div><div class="label">quản lý ${esc(t.name)}</div><div class="manage">
      ${t.type === 'prop' ? `<button class="btn sm" data-act="build" data-arg="${i}" ${ok('build')}>Xây nhà (${DISTRICTS[t.d].house})</button>
      <button class="btn sm" data-act="sell" data-arg="${i}" ${ok('sell')}>Bán nhà (+${DISTRICTS[t.d].house / 2})</button>` : ''}
      ${S.mort[i] ? `<button class="btn sm" data-act="unmort" data-arg="${i}" ${ok('unmort')}>Chuộc (${unmortCost(t)})</button>`
        : `<button class="btn sm" data-act="mort" data-arg="${i}" ${ok('mort')}>Thế chấp (+${t.price / 2})</button>`}
    </div></div>`;
  } else if (mine) {
    manage = `<div class="label">bấm vào ô đất của mình trên bàn cờ để xây nhà hoặc thế chấp</div>`;
  }

  const where = local ? 'Ván thử trên máy này' : `Phòng ${esc(ctx.room)}`;
  return `
    <div class="side-top">
      <span class="label">${where}${ctx.status && !local ? ' · ' + esc(ctx.status) : ''}</span>
      <button class="btn sm" data-act="exit">${local ? 'Thoát ván' : 'Rời phòng'}</button>
    </div>
    <div>
      <div class="strip"><span>Phố Giấy / Vòng ${S.round}</span><span>${pad(S.turn)} / ${String(S.players.length).padStart(2, '0')}</span></div>
      <div class="kicker">${S.winner != null ? 'Ai giữ được phố?' : 'Đến lượt ai?'}</div>
      <h2>${title}</h2>
      <p class="human">${human}</p>
    </div>
    <div class="players">${S.players.map((x, k) => `
      <div class="pl ${k === S.turn && S.winner == null ? 'cur' : ''} ${x.out ? 'out' : ''}">
        ${pieceSvg(x.piece, 18)}<span class="nm">${esc(x.name)}${k === me && !local ? ' <span class="label">(bạn)</span>' : ''}</span>
        <span class="tag">${[x.online === false && !x.out ? 'mất kết nối' : '', x.jail ? 'trạm nghỉ' : '', x.cards ? 'vé ×' + x.cards : '', Object.values(S.owner).filter(o => o === k).length + ' ô'].filter(Boolean).join(' · ')}</span>
        <span class="money ${x.money < 0 ? 'neg' : ''}">${x.money}</span>
      </div>`).join('')}</div>
    <div class="actions">${actions}</div>
    ${manage}
    ${ctx.dev && S.opts.dev ? devHtml(S, ctx) : ''}
    <ul class="log">${S.log.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
    <div class="sources">Phố Giấy v${ctx.version} · ${alive} người còn chơi</div>`;
}

function devHtml(S, ctx) {
  const opts = [1, 2, 3, 4, 5, 6].map(n => `<option>${n}</option>`).join('');
  const v = currentView(S, ctx), vi = v.kind === 'tile' ? v.i : null;
  return `<div class="dev">
    <div class="label">công cụ dev · chỉ có ở ván thử</div>
    <div class="manage">
      <select id="dv1">${opts}</select><select id="dv2">${opts}</select>
      <button class="btn sm" data-act="dev-roll" ${S.phase === 'roll' && !ctx.busy ? '' : 'disabled'}>Lăn số này</button>
      <button class="btn sm" data-act="dev-money" data-arg="500">+500</button>
      <button class="btn sm" data-act="dev-money" data-arg="-500">−500</button>
    </div>
    <div class="manage">
      ${vi != null ? `<button class="btn sm" data-act="dev-goto" data-arg="${vi}" ${S.phase === 'roll' && !ctx.busy ? '' : 'disabled'}>Nhảy tới ${esc(TILES[vi].name)}</button>
      ${buyable(TILES[vi]) && S.owner[vi] == null ? `<button class="btn sm" data-act="dev-own" data-arg="${vi}">Nhận ${esc(TILES[vi].name)}</button>` : ''}` : ''}
      <button class="btn sm" data-act="dev-own-district" ${vi != null && TILES[vi].type === 'prop' ? '' : 'disabled'} data-arg="${vi ?? ''}">Nhận cả quận</button>
    </div>
  </div>`;
}

// ---------- sảnh ----------
export function homeHtml({ name, code, online, hasLocalSave, devDefault }) {
  return `
    <div class="strip"><span>Phố Giấy / Bắt đầu</span><span>2–6 người</span></div>
    <div class="kicker">Ai sẽ sống ở phố này?</div>
    <h1>Mỗi người một máy, chung một con phố.</h1>
    <p class="human">Một người tạo phòng rồi gửi mã cho bạn bè; mỗi người mở trên máy của mình.</p>
    <label class="field"><span class="label">tên của bạn</span><input id="nm" maxlength="14" value="${esc(name)}" placeholder="ví dụ: Lan"></label>
    ${!online ? '<p class="small">không tải được thư viện kết nối, chưa chơi online được (kiểm tra mạng). Vẫn chơi thử trên máy này được.</p>' : code ? `
      <div class="row"><button class="btn primary" id="join">Vào phòng ${esc(code)}</button></div>
      <p class="small">hoặc <a href="#" id="create">tạo phòng mới</a></p>` : `
      <div class="row"><button class="btn primary" id="create">Tạo phòng mới</button></div>
      <div class="or label">— hoặc vào phòng của bạn bè —</div>
      <div class="row"><input id="code" class="code-in" maxlength="5" placeholder="MÃ PHÒNG"><button class="btn" id="join">Vào phòng</button></div>`}
    <p class="small" id="err"></p>
    <div class="local-box">
      <div class="kicker">Thử trên một máy?</div>
      <p class="human">Không cần tạo phòng hay chờ ai: bạn điều khiển mọi người chơi, để thử luật và giao diện.</p>
      <div class="count" id="count">${[2, 3, 4, 5, 6].map(n => `<button class="btn sm ${n === 3 ? 'on' : ''}" data-n="${n}">${n} người</button>`).join('')}</div>
      <label class="check"><input type="checkbox" id="devchk" ${devDefault ? 'checked' : ''}> bật công cụ dev (đặt xúc xắc, cộng tiền, nhảy ô)</label>
      <div class="row"><button class="btn" id="local">Chơi thử ngay</button>${hasLocalSave ? '<button class="btn" id="resume-local">Tiếp tục ván thử</button>' : ''}</div>
    </div>`;
}

export function lobbyHtml({ room, url, seats, me, isHost, canStart, status }) {
  return `
    <div class="strip"><span>Phố Giấy / Phòng ${esc(room)}</span><span>${seats.length} / 6</span></div>
    <div class="kicker">Ai đã đến?</div>
    <h1>Phòng <span class="room-code">${esc(room)}</span></h1>
    <p class="human">Gửi mã hoặc đường link cho bạn bè. Ai mở link trên máy mình là vào được phòng.</p>
    <div class="row"><input class="link" readonly value="${esc(url)}"><button class="btn" id="copy">Sao chép link</button></div>
    <div class="players lobby">${seats.map((x, k) => `
      <div class="pl">${pieceSvg(k, 18)}<span class="nm">${esc(x.name)}${k === me ? ' <span class="label">(bạn)</span>' : ''}</span>
        <span class="tag">${k === 0 ? 'chủ phòng' : x.online === false ? 'mất kết nối' : 'đã vào'}</span></div>`).join('') || '<div class="label" style="padding:8px 0">đang chờ…</div>'}</div>
    <div class="row">${isHost
      ? `<button class="btn primary" id="go" ${canStart ? '' : 'disabled'}>Bắt đầu ván</button>`
      : '<span class="label" style="align-self:center">chờ chủ phòng bắt đầu ván…</span>'}
      <button class="btn" data-act="exit">Rời phòng</button></div>
    <p class="small">${esc(status)}${isHost && seats.length < 2 ? ' · cần ít nhất 2 người' : ''}</p>`;
}

export function errorHtml(title, text) {
  return `<div class="kicker">Có trục trặc</div><h1>${esc(title)}</h1><p class="human">${esc(text)}</p>
    <div class="row"><button class="btn primary" data-act="home">Về trang đầu</button></div>`;
}
