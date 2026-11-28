// Hàm vẽ thuần: nhận trạng thái + ngữ cảnh, trả về chuỗi HTML. Không đọc/ghi DOM.
// Bố cục theo mockup 0.4 "Giấy mới". Màu/font: design/tokens.css (qua class trong style.css).
import { CUR, BAIL, SALARY, START_MONEY, GO_JAIL, buyable, groupOf, unmortCost } from '../core/board.js';
import { MAPS, mapOf } from '../core/maps/index.js';
import { ownsGroup, ownedOfType, canManage, rentFor, netWorth, choiceTiles, betRange, prestige } from '../core/rules.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pad = n => String(n + 1).padStart(2, '0');
const money = n => (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('vi-VN').replace(/\./g, ' ');

// ---------- quân cờ ----------
export const PIECES = [
  { n: 'tròn', s: '<circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="2.4" fill="none" stroke="var(--paper)" stroke-width=".8"/>' },
  { n: 'tam giác', s: '<path d="M8 1.5 L15 14.5 H1Z"/><line x1="8" y1="6" x2="8" y2="12" stroke="var(--ink)" stroke-width=".6"/>' },
  { n: 'vuông', s: '<rect x="2" y="2" width="12" height="12"/><path d="M2 8 H14 M8 2 V14" stroke="var(--paper)" stroke-width=".6"/>' },
  { n: 'lục giác', s: '<path d="M8 1 L14.1 4.5 V11.5 L8 15 L1.9 11.5 V4.5Z"/><circle cx="8" cy="8" r="1.6" fill="var(--paper)"/>' },
  { n: 'ngôi nhà', s: '<path d="M1.5 7.5 L8 2 L14.5 7.5 V14.5 H1.5Z"/><rect x="6.5" y="9.5" width="3" height="5" fill="var(--accent-2)"/>' },
  { n: 'chiếc lá', s: '<path d="M1.5 14.5 C1.5 6 6 1.5 14.5 1.5 C14.5 10 10 14.5 1.5 14.5Z"/><path d="M2.5 13.5 L11 5" stroke="var(--paper)" stroke-width=".7"/>' },
];
// Nhân vật pixel của map đang xem (main.js nạp avatars.json rồi gọi setAvatars). Chưa nạp xong thì vẽ quân hình học.
let AV = [];
export const setAvatars = list => { AV = Array.isArray(list) ? list : []; };
export const avatars = () => AV;
export const pieceColor = k => (AV[k] && AV[k].color) || `var(--piece-${k})`;
export const pieceName = k => (AV[k] ? AV[k].name : 'quân ' + PIECES[k].n);
export const pieceSvg = (k, sz, label = true) => AV[k]
  ? `<img class="piece av" src="${esc(AV[k].portraitUrl)}" width="${sz}" height="${sz}" ${label ? `alt="${esc(AV[k].name)}"` : 'alt="" aria-hidden="true"'}>`
  : `<svg class="piece" width="${sz}" height="${sz}" viewBox="0 0 16 16" style="fill:${pieceColor(k)}" ${label ? `role="img" aria-label="quân ${PIECES[k].n}"` : 'aria-hidden="true"'}>${PIECES[k].s}</svg>`;

// ---------- ô ----------
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
export const swClass = (t, M) => t.type === 'prop' ? 'd' + t.d : t.type === 'station' ? 'st' : t.type === 'util' ? 'ut' : t.type === 'tax' ? 'tx' : t.type === 'card' ? M.decks[t.deck].cls : '';

export const currentView = (S, ctx) => ctx.viewOverride || S.view;
const btn = (act, label, cls = '', { arg = '', disabled = false, id = '' } = {}) =>
  `<button type="button" class="btn ${cls}" data-act="${act}"${arg !== '' ? ` data-arg="${arg}"` : ''}${id ? ` id="${id}"` : ''}${disabled ? ' disabled' : ''}>${label}</button>`;

// ============ TRANG ĐẦU ============

/** Nút chọn map (trang đầu, sảnh). */
export const mapSeg = cur => `<div class="seg" role="group" aria-label="Bàn cờ" id="maps">${Object.values(MAPS).map(m => `<button type="button" data-act="map" data-arg="${m.id}" class="${m.id === cur ? 'on' : ''}" aria-pressed="${m.id === cur}" title="${esc(m.blurb)}">${esc(m.name)}</button>`).join('')}</div>`;

export function homeHtml({ name, code, online, hasLocalSave, devDefault, version, mapId, xomla }) {
  return `<main class="home">
    <section class="home-art" aria-label="Bản đồ ${esc(MAPS[mapId].name)}">
      <div class="strip"><span>${esc(MAPS[mapId].name)} / Bản đồ</span><span>8 quận · 40 ô</span></div>
      <div class="home-map" role="img" aria-label="Bản đồ pixel ${esc(MAPS[mapId].name)}"></div>
      <div class="home-cast">${AV.map((a, k) => pieceSvg(k, 48)).join('')}</div>
    </section>
    <section class="home-form">
      <div class="strip"><span>Phố Giấy / Bắt đầu</span><span>v${version}</span></div>
      <div class="home-head">
        <span class="kicker">Ai sẽ sống ở phố này?</span>
        <h1 class="h1">Phố<br>Giấy</h1>
        <p class="human">Mỗi người một máy, chung một con phố. Mua đất, xây nhà, đừng quên chào hàng xóm.</p>
      </div>
      <label class="field"><span class="label">tên của bạn</span><input id="nm" maxlength="14" value="${esc(name)}" placeholder="ví dụ: Lan" autocomplete="nickname"></label>
      ${!online ? '<p class="label">Không tải được thư viện kết nối nên chưa chơi online được (kiểm tra mạng). Vẫn chơi thử trên máy này được.</p>' : `
      <div class="join-grid">
        <div>
          <span class="label">01 · mở phòng mới</span>
          <p>Nhận một mã 5 ký tự, gửi link cho bạn bè.</p>
          <button type="button" class="btn primary" id="create">Tạo phòng mới</button>
        </div>
        <div>
          <span class="label">02 · vào phòng bạn bè</span>
          <label style="display:flex;flex-direction:column;gap:4px"><span>Mã phòng</span><input id="code" class="code-in" maxlength="5" placeholder="K7Q2M" value="${esc(code)}" autocomplete="off"></label>
          <button type="button" class="btn" id="join">Vào phòng</button>
        </div>
      </div>`}
      <p class="err label" id="err" role="alert"></p>
      <div class="local-box">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap">
          <span class="kicker" style="color:var(--ink)">Thử trên một máy</span>
          <span class="label">không cần mạng · bạn điều khiển mọi người</span>
        </div>
        <div class="local-row">${mapSeg(mapId)}<span class="label">${esc(MAPS[mapId].blurb)}</span></div>
        <div class="local-row">
          <div class="seg" role="group" aria-label="Số người chơi" id="count">${[2, 3, 4, 5, 6].map(n => `<button type="button" data-n="${n}" class="${n === 3 ? 'on' : ''}" aria-pressed="${n === 3}">${n}</button>`).join('')}</div>
          <label class="check" title="Bàn cờ phủ sương, xáo mỗi ván, chọn cách đi, 12 vòng tính uy tín"><input type="checkbox" id="xlchk" ${xomla ? 'checked' : ''}>Xóm lạ (thử)</label>
          <label class="check"><input type="checkbox" id="devchk" ${devDefault ? 'checked' : ''}>công cụ dev</label>
          <button type="button" class="btn sm" id="local">Chơi thử ngay</button>
          ${hasLocalSave ? '<button type="button" class="btn ghost sm" id="resume-local">Tiếp tục ván thử</button>' : ''}
        </div>
      </div>
      <div class="foot"><span>Phố Giấy v${version} · board game mua bán xây phố</span><span><a href="#" data-act="rules">Luật chơi</a> · <a href="../versions/">Các phiên bản</a></span></div>
    </section>
  </main>`;
}

// ============ SẢNH CHỜ ============
export function lobbyHtml({ room, url, seats, me, isHost, canStart, status, statusOk, mapId }) {
  const M = MAPS[mapId] || MAPS.vietnam;
  const taken = new Set(seats.map(x => x.piece));
  const mine = seats[me];
  const offline = seats.filter(x => x.online === false).map(x => x.name);
  // Khách chưa nhận được danh sách ghế = chưa nối được với chủ phòng: đừng vẽ sảnh rỗng như thể đã vào.
  if (!isHost && !seats.length) return `<main class="page">
    <div class="topline"><span class="t">Phố Giấy / Phòng ${esc(room)}</span><div class="r">${btn('exit', 'Rời phòng', 'xs')}</div></div>
    <section class="card connecting" aria-live="polite">
      <span class="kicker">Chưa vào được phòng</span>
      <h2 class="h3">Đang nối với chủ phòng ${esc(room)}…</h2>
      <p class="human">${esc(status)}</p>
      <p class="label">Chủ phòng chỉ thấy bạn khi nối xong. Quá 20 giây chưa được thì thường do mạng (4G, wifi công ty) chặn kết nối trực tiếp: thử cho hai máy dùng chung một wifi.</p>
    </section>
  </main>`;
  return `<main class="page">
    <div class="topline">
      <span class="t">Phố Giấy / Sảnh chờ</span>
      <div class="r"><span class="label ${statusOk ? 'ok' : 'bad'}">● ${esc(status)}</span>${btn('exit', 'Rời phòng', 'xs')}</div>
    </div>
    <div class="lobby">
      <section class="left">
        <span class="kicker">Ai đã đến?</span>
        <div><span class="label">mã phòng</span><div class="room-code">${esc(room)}</div></div>
        <p class="human">Gửi mã hoặc đường link cho bạn bè. Ai mở trên máy mình là vào được phòng.</p>
        <div class="copy-row"><label class="sr" for="roomlink">Link phòng</label><input id="roomlink" class="link" readonly value="${esc(url)}"><button type="button" class="btn dark" id="copy">Sao chép link</button></div>
        <div class="rules-box">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="kicker" style="color:var(--ink)">Luật ván này</span><span class="label">chủ phòng chọn bàn</span></div>
          <div style="display:flex;flex-direction:column;gap:4px"><span class="label">bàn cờ</span>${isHost ? mapSeg(M.id) : `<b>${esc(M.name)}</b>`}<span class="label">${esc(M.blurb)}</span></div>
          <div class="grid"><div><span class="label">tiền khởi đầu</span><span>${money(START_MONEY)}</span></div><div><span class="label">lương qua ${esc(M.terms.start)}</span><span>${SALARY}</span></div><div><span class="label">đấu giá</span><span>chưa có</span></div><div><span class="label">giới hạn giờ</span><span>không</span></div></div>
        </div>
      </section>
      <section class="right">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><h2 class="h3" style="font-size:24px">Ghế quanh bàn</h2><span class="label">${seats.length} / 6</span></div>
        <div class="seats">
          ${seats.map((x, k) => `<div class="seat">${pieceSvg(x.piece, 40)}<div style="display:flex;flex-direction:column;gap:2px"><span class="nm">${esc(x.name)}${k === me ? ' <small class="label">(bạn)</small>' : ''}</span><span class="label ${x.online === false ? 'bad' : k === 0 ? '' : 'ok'}">${k === 0 ? 'chủ phòng' : x.online === false ? 'đang nối lại…' : 'đã vào'}</span></div></div>`).join('')}
          ${Array.from({ length: Math.max(0, 6 - seats.length) }, () => '<div class="seat empty">ghế trống</div>').join('')}
        </div>
        ${mine ? `<div style="display:flex;flex-direction:column;gap:10px;border-top:var(--hair) solid var(--neutral);padding-top:16px">
          <span style="font-size:13px;font-weight:600">Chọn quân cờ của bạn</span>
          <div class="pick" role="radiogroup" aria-label="Quân cờ">${PIECES.map((p, k) => {
            const chosen = mine.piece === k, busy = taken.has(k) && !chosen;
            return `<button type="button" role="radio" aria-checked="${chosen}" aria-label="${esc(pieceName(k))}${busy ? ', đã có người chọn' : ''}" data-act="piece" data-arg="${k}" ${busy ? 'disabled' : ''}>${pieceSvg(k, 30, false)}</button>`;
          }).join('')}</div>
        </div>` : ''}
        <div class="go-row">
          ${isHost ? btn('start', `Bắt đầu ván · ${seats.length} người`, 'primary lg', { disabled: !canStart, id: 'go' }) : '<span class="label">chờ chủ phòng bắt đầu ván…</span>'}
          <span class="human" style="font-size:14px">${isHost && seats.length < 2 ? 'Cần ít nhất 2 người.' : offline.length ? `${esc(offline.join(', '))} đang nối lại. Bắt đầu bây giờ vẫn vào được khi nối xong.` : ''}</span>
        </div>
      </section>
    </div>
  </main>`;
}

// ============ BÀN CỜ ============
/** Xóm lạ: ô i còn phủ sương. */
export const isFog = (S, i) => !!(S.xl && !S.xl.seen[i]);
const roundLabel = S => (S.xl ? `vòng ${S.round}/${S.xl.rounds}` : `vòng ${S.round}`);
const fogCardHtml = () => `<div class="card deed fog-card"><span class="kicker">Chưa ai tới đây</span><h3 class="h3">Sương còn phủ</h3><p class="human">Ai dừng chân ở ô này đầu tiên sẽ thấy ở đây có gì, được thưởng khai hoang và được mua trước.</p></div>`;

function tileHtml(S, ctx, t, i, sel, picks) {
  const [r, c] = cell(i);
  const pos = k => (ctx.pos && ctx.pos[k] != null ? ctx.pos[k] : S.players[k].pos);
  // ctx.layer: quân vẽ ở lớp riêng (src/ui/pieces.js), ô chỉ còn chỗ trống
  const here = ctx.layer ? '' : S.players.map((p, k) => (!p.out && pos(k) === i ? pieceSvg(p.piece, 15) : '')).join('');
  const o = S.owner[i], h = S.houses[i] || 0;
  const cls = ['tile', t.type === 'corner' ? 'corner' : '', i === sel ? 'sel' : '', S.mort[i] ? 'mort' : '', picks && picks.has(i) ? 'can-pick' : ''].join(' ');
  const label = `${t.name}${o != null ? ', của ' + S.players[o].name : ''}`;
  if (isFog(S, i)) {
    // Xóm lạ: ô chưa ai dừng chân. Không lộ gì: không tên, không giá, không màu quận.
    return `<button type="button" class="tile fog ${i === sel ? 'sel' : ''} ${picks && picks.has(i) ? 'can-pick' : ''}" style="grid-row:${r};grid-column:${c}" data-tile="${i}" aria-label="Ô chưa ai tới"><span class="fog-q" aria-hidden="true">?</span><span class="pieces">${here}</span></button>`;
  }
  const open = `<button type="button" class="${cls}" style="grid-row:${r};grid-column:${c}" data-tile="${i}" aria-label="${esc(label)}">`;
  if (t.type === 'corner') {
    return `${open}<span class="t-name">${t.name}</span><span class="t-note">${t.note || ''}</span><span class="big">${pad(i)}</span><span class="pieces">${here}</span></button>`;
  }
  const price = buyable(t) ? t.price : t.type === 'tax' ? '−' + t.amount : '?';
  const houses = h === 5 ? '<b></b>' : '<i></i>'.repeat(h);
  return `${open}
    <span class="t-top"><span class="t-num">${pad(i)}</span><span class="sw ${swClass(t, mapOf(S))}"></span></span>
    <span class="t-name">${t.short || t.name}</span>
    <span class="pieces">${here}</span>
    <span class="t-bot"><span>${price}</span><span class="houses">${houses}</span><span class="own" style="background:${o != null ? pieceColor(S.players[o].piece) : 'transparent'}"></span></span>
  </button>`;
}

function dieSvg(n, label) {
  const P6 = { 1: [[8, 8]], 2: [[4.5, 4.5], [11.5, 11.5]], 3: [[4.5, 4.5], [8, 8], [11.5, 11.5]], 4: [[4.5, 4.5], [11.5, 4.5], [4.5, 11.5], [11.5, 11.5]], 5: [[4.5, 4.5], [11.5, 4.5], [8, 8], [4.5, 11.5], [11.5, 11.5]], 6: [[4.5, 4.5], [11.5, 4.5], [4.5, 8], [11.5, 8], [4.5, 11.5], [11.5, 11.5]] };
  return `<svg class="die" viewBox="0 0 16 16" role="img" aria-label="${label} ${n}"><rect x=".5" y=".5" width="15" height="15" fill="var(--paper)" stroke="var(--ink)" stroke-width=".6"/>${P6[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${n === 1 ? 'var(--accent-2)' : 'var(--ink)'}"/>`).join('')}</svg>`;
}

function gambleResultHtml(S) {
  const g = S.gamble;
  if (!g) return '';
  const sum = g.dice[0] + g.dice[1];
  return `<div class="gamble-res ${g.win ? 'win' : 'lose'}"><span class="label">ván cược · ${esc(S.players[g.seat].name)} đoán ${g.pick === 'even' ? 'chẵn' : 'lẻ'} · ${g.bet} ${CUR}</span>
    <div class="dice-row">${dieSvg(g.dice[0], 'xúc xắc cược')}${dieSvg(g.dice[1], 'xúc xắc cược')}<span class="dice-sum">${sum}</span><b>${sum % 2 ? 'lẻ' : 'chẵn'} · ${g.win ? 'thắng +' + g.bet * 2 : 'thua'}</b></div></div>`;
}

function centerHtml(S, ctx) {
  const v = currentView(S, ctx);
  const last = S.players[S.turn];
  return `<div class="center">
    <span class="reg tl"></span><span class="reg tr"></span><span class="reg bl"></span><span class="reg br"></span>
    <div class="c-left">
      <div style="display:flex;flex-direction:column;gap:6px">
        <span class="label" style="text-transform:uppercase;letter-spacing:.12em;font-family:var(--font-sans);font-size:11px">${roundLabel(S)} · xúc xắc</span>
        <div class="dice-row">${dieSvg(S.dice[0], 'xúc xắc')}${dieSvg(S.dice[1], 'xúc xắc')}<span class="dice-sum">${S.dice[0] + S.dice[1]}</span></div>
      </div>
      ${gambleResultHtml(S)}
      <p class="msg" aria-live="polite">${esc(S.msg)}</p>
      <div class="recent"><span class="label">vừa xảy ra</span>${S.log.slice(0, 2).map(l => `<span>${esc(l)}</span>`).join('')}</div>
    </div>
    <div class="c-right">${v.kind === 'card' ? eventCardHtml(S, v) : isFog(S, v.i) ? fogCardHtml() : deedHtml(S, v.i, last)}</div>
  </div>`;
}

export function deedHtml(S, i) {
  const M = mapOf(S), TILES = M.tiles, DISTRICTS = M.districts, group = d => groupOf(TILES, d);
  const t = TILES[i], o = S.owner[i];
  const kick = { prop: 'Ai sống ở đây?', station: 'Đi đâu hôm nay?', util: 'Ai giữ cho phố sáng?', tax: 'Phải đóng gì?', card: 'Rút một thẻ?', corner: 'Dừng lại ở đâu?' }[t.type];
  const grp = t.type === 'prop' ? DISTRICTS[t.d].name : t.type === 'station' ? 'Nhà ga' : t.type === 'util' ? 'Tiện ích' : t.name;
  let body = '';
  if (t.type === 'prop') {
    const h = S.houses[i] || 0, full = ownsGroup(S, o, t.d);
    const rows = [['đất trống', t.rent[0]], ['cả quận', t.rent[0] * 2], ['1 nhà', t.rent[1]], ['2 nhà', t.rent[2]], ['3 nhà', t.rent[3]], ['4 nhà', t.rent[4]], ['phố', t.rent[5]]];
    const on = o == null ? -1 : h ? h + 1 : full ? 1 : 0;
    const others = group(t.d).filter(j => j !== i).map(j => `${TILES[j].name}: ${S.owner[j] == null ? 'chưa có chủ' : 'của ' + S.players[S.owner[j]].name}`);
    body = `<div class="rent">${rows.map((r, k) => `<div class="${k === on ? 'on' : ''}"><span>${r[0]}${k === on ? ' ◂' : ''}</span><span>${r[1]} ${CUR}</span></div>`).join('')}</div>
      <div class="foot2">giá mua <b>${t.price} ${CUR}</b> · nhà ${DISTRICTS[t.d].house} · thế chấp ${t.price / 2}</div>
      <div class="note">${esc(others.join(' · '))}</div>${secretHtml(S, t.d)}`;
  } else if (t.type === 'station') {
    const n = o != null ? ownedOfType(S, o, 'station') : 0;
    body = `<div class="rent">${[1, 2, 3, 4].map(k => `<div class="${k === n ? 'on' : ''}"><span>có ${k} ga${k === n ? ' ◂' : ''}</span><span>${25 * 2 ** (k - 1)} ${CUR}</span></div>`).join('')}</div>
      <div class="foot2">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
  } else if (t.type === 'util') {
    const n = o != null ? ownedOfType(S, o, 'util') : 0;
    body = `<div class="rent"><div class="${n === 1 ? 'on' : ''}"><span>có 1 tiện ích</span><span>4 × xúc xắc</span></div><div class="${n === 2 ? 'on' : ''}"><span>có cả 2</span><span>10 × xúc xắc</span></div></div>
      <div class="foot2">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
  } else if (t.type === 'tax') {
    body = `<div class="foot2">đóng <b>${t.amount} ${CUR}</b> cho phố</div>`;
  } else if (t.type === 'card') {
    body = `<div class="foot2">dừng ở đây → rút một thẻ ${t.name}</div>`;
  }
  const owner = buyable(t) ? `<div class="note">${o == null ? 'chưa có ai ở' : 'chủ: ' + esc(S.players[o].name) + (S.mort[i] ? ' · đang thế chấp' : '')}</div>` : '';
  return `<article class="card">
    <div class="strip"><span>${esc(M.name)} / ${grp}</span><span>${pad(i)} / 40</span></div>
    <div class="k-row"><span class="kicker">${kick}</span>${t.type === 'corner' ? '' : `<span class="sw lg ${swClass(t, M)}"></span>`}</div>
    <h3 class="h3">${t.name}</h3>
    ${t.human ? `<p class="human">${t.human}</p>` : ''}
    ${body}${owner}
  </article>`;
}

/** Dòng bí mật của quận (Thanh Hóa): gợi ý trước khi kích hoạt, luật sau khi kích hoạt. */
function secretHtml(S, d) {
  const D = mapOf(S).districts[d];
  if (!D.hint) return '';
  const sec = S.secret && S.secret.th;
  if (!sec || !sec.fired) return `<div class="note secret">${esc(D.hint)}</div>`;
  return `<div class="note secret on">${esc(D.reveal)}${sec.king != null ? ` Vua hiện tại: <b>${esc(S.players[sec.king].name)}</b>.` : ' Hiện chưa ai giữ đủ.'}</div>`;
}

export function eventCardHtml(S, v) {
  const M = mapOf(S), D = M.decks[v.deck], c = D.cards[v.id];
  return `<article class="card">
    <div class="strip"><span>${esc(M.name)} / ${esc(D.name)}</span><span>thẻ ${String(v.id + 1).padStart(2, '0')}</span></div>
    <div class="k-row"><span class="kicker">${c.k}</span>${D.mark ? `<span class="mark" aria-hidden="true">${D.mark}</span>` : ''}</div>
    <h3 class="ev-title">${c.t}</h3>
    <div class="act">→ ${c.a}</div>
  </article>`;
}

function dockHtml(S, ctx) {
  const p = S.players[S.turn], { mine, mode, busy } = ctx;
  if (!mine) {
    let html = `<span class="label">${p.online === false ? esc(p.name) + ' đang mất kết nối…' : 'đang chờ ' + esc(p.name) + '…'}</span>`;
    if (mode === 'host' && p.online === false) html += `<div class="row">${btn('forfeit', `Cho ${esc(p.name)} rời ván`, 'dark')}</div>`;
    return `<div class="dock">${html}</div>`;
  }
  const d = { disabled: busy };
  if (p.money < 0 && S.phase === 'end') {
    return `<div class="dock">
      <div class="debt"><span style="font-weight:700">${p.creditor != null ? 'Bạn còn thiếu ' + esc(S.players[p.creditor].name) : 'Bạn đang nợ'}</span><b>${money(p.money)} ${CUR}</b></div>
      <span class="human" style="font-size:14px">Bán bớt nhà hoặc thế chấp đất ở tab "Đất của tôi". Chưa đủ thì đành rời phố.</span>
      <div class="row">${btn('end', 'Kết thúc lượt', 'primary', { disabled: true })}${btn('bankrupt', S.xl ? 'Trắng tay, đi làm thuê' : 'Phá sản, rời ván', '', d)}</div>
    </div>`;
  }
  if (S.phase === 'roll') {
    return `<div class="dock">
      <div class="row">${btn('roll', p.jail ? 'Lăn tìm đôi' : 'Lăn xúc xắc', 'primary', d)}${p.jail ? btn('bail', `Trả ${BAIL} ${CUR}`, '', { disabled: busy || p.money < BAIL }) + (p.cards ? btn('ticket', 'Dùng vé', '', d) : '') : ''}</div>
      <span class="label">${p.jail ? `đang ở ${esc(mapOf(S).terms.jail)} · lần thử ${p.jail}/3` : 'phím Space để lăn'}</span>
    </div>`;
  }
  if (S.phase === 'move') {
    const T = mapOf(S).tiles;
    return `<div class="dock">
      <span style="font-weight:700">Đi theo tổng, hay theo một con xúc xắc?</span>
      <div class="row">${S.choice.opts.map((n, k) => { const to = (p.pos + n) % 40; return btn('move', `Đi ${n} ô · ${isFog(S, to) ? 'vào sương' : esc(T[to].short || T[to].name)}`, k === 0 ? 'primary' : '', { arg: n, disabled: busy }); }).join('')}</div>
      <span class="label">ô chưa ai tới còn phủ sương · ai mở ô đầu tiên được thưởng khai hoang</span>
    </div>`;
  }
  if (S.phase === 'downgrade' || S.phase === 'fly') {
    const opts = choiceTiles(S), v = currentView(S, ctx), T = mapOf(S).tiles;
    const sel = v.kind === 'tile' && opts.includes(v.i) ? v.i : null;
    const verb = S.phase === 'fly' ? 'Bay tới' : 'Hạ cấp';
    const hint = S.phase === 'fly'
      ? `Bấm một ô trên bàn cờ để bay tới (trừ ${esc(T[GO_JAIL].name)}). Qua ${esc(mapOf(S).terms.start)} vẫn nhận lương.`
      : 'Bấm một ô sáng trên bàn cờ: công trình đó bị hạ 1 bậc, chủ không được hoàn tiền.';
    return `<div class="dock">
      <span class="human" style="font-size:14px">${hint}</span>
      <div class="row">${btn(S.phase, sel != null ? `${verb} ${esc(T[sel].name)}` : 'Chọn một ô trên bàn cờ', 'primary', { arg: sel ?? '', disabled: busy || sel == null })}</div>
    </div>`;
  }
  if (S.phase === 'gamble') {
    const r = betRange(S), T = mapOf(S).tiles, tgt = S.choice ? S.choice.target : null;
    const bet = Math.min(r.max, Math.max(r.min, ctx.bet || r.min));
    const risk = tgt == null ? 'không bị đưa đi đâu' : S.owner[tgt] != null ? `bị đưa tới ${esc(T[tgt].name)}, trả thuê ${rentFor(S, tgt)} ${CUR}` : `bị đưa tới ${esc(T[tgt].name)} (chưa có chủ)`;
    return `<div class="dock gamble">
      <label class="bet"><span class="label">mức cược ${r.min}–${r.max}</span><input type="range" id="bet" min="${r.min}" max="${r.max}" step="${r.step}" value="${bet}"${busy ? ' disabled' : ''}><b id="betv">${bet} ${CUR}</b></label>
      <div class="row">${btn('gamble', 'Chẵn', 'primary', { arg: 'even', disabled: busy })}${btn('gamble', 'Lẻ', 'primary', { arg: 'odd', disabled: busy })}</div>
      <span class="label">thắng: +<span id="betw">${bet * 2}</span> ${CUR} · thua: mất cược và ${risk}</span>
    </div>`;
  }
  if (S.phase === 'buy') {
    const t = mapOf(S).tiles[p.pos];
    return `<div class="dock">
      <div class="row">${btn('buy', `Mua ${t.name} · ${t.price} ${CUR}`, 'primary', d)}${btn('skip', 'Bỏ qua', '', d)}</div>
      <span class="label">mua xong còn ${money(p.money - t.price)} ${CUR} · phím B mua · S bỏ qua</span>
    </div>`;
  }
  return `<div class="dock">
    <div class="row">${btn('end', 'Kết thúc lượt', 'primary', d)}</div>
    <span class="label">xây nhà hoặc thế chấp trước khi kết thúc lượt · phím E</span>
  </div>`;
}

function landsHtml(S, ctx) {
  const me = ctx.me;
  if (me < 0) return '<p class="label empty-note">bạn đang xem ván này</p>';
  const mine = Object.keys(S.owner).map(Number).filter(i => S.owner[i] === me).sort((a, b) => a - b);
  if (!mine.length) return '<p class="label empty-note">chưa có mảnh đất nào. Dừng ở ô trống để mua.</p>';
  const canAct = ctx.mine && !ctx.busy;
  const ok = (type, i) => canAct && canManage(S, type, i);
  const M = mapOf(S), TILES = M.tiles, DISTRICTS = M.districts;
  return `<div class="lands">${mine.map(i => {
    const t = TILES[i], h = S.houses[i] || 0;
    const meta = S.mort[i] ? 'đang thế chấp' : t.type === 'prop' ? `${h === 5 ? 'phố' : h + ' nhà'} · thuê ${rentFor(S, i)}${!h && ownsGroup(S, me, t.d) ? ' (cả quận)' : ''}` : t.type === 'station' ? `${ownedOfType(S, me, 'station')} ga · thuê ${rentFor(S, i)}` : `${ownedOfType(S, me, 'util')} tiện ích`;
    const acts = [];
    if (t.type === 'prop' && !S.mort[i]) {
      if (ownsGroup(S, me, t.d) && h < 5) acts.push(btn('build', `+ ${h === 4 ? 'Phố' : 'Nhà'} · ${DISTRICTS[t.d].house}`, 'sm', { arg: i, disabled: !ok('build', i) }));
      if (h > 0) acts.push(btn('sell', `Bán · +${DISTRICTS[t.d].house / 2}`, 'sm', { arg: i, disabled: !ok('sell', i) }));
    }
    if (S.mort[i]) acts.push(btn('unmort', `Chuộc · ${unmortCost(t)}`, 'sm', { arg: i, disabled: !ok('unmort', i) }));
    else if (!h) acts.push(btn('mort', `Thế chấp · +${t.price / 2}`, 'sm', { arg: i, disabled: !ok('mort', i) }));
    return `<div class="land"><span class="sw md ${swClass(t, M)}"></span><div style="display:flex;flex-direction:column;gap:1px;min-width:0"><button type="button" class="nm" data-tile="${i}">${t.name}</button><span class="meta">${meta}</span></div><div class="acts">${acts.join('')}</div></div>`;
  }).join('')}</div>`;
}

function devHtml(S, ctx) {
  const opts = [1, 2, 3, 4, 5, 6].map(n => `<option>${n}</option>`).join('');
  const v = currentView(S, ctx), vi = v.kind === 'tile' ? v.i : null;
  const canRoll = S.phase === 'roll' && !ctx.busy && S.winner == null;
  const M = mapOf(S), TILES = M.tiles;
  const cards = Object.entries(M.decks).flatMap(([k, d]) => d.cards.map((c, id) => `<option value="${k}:${id}">${esc(d.name)} ${String(id + 1).padStart(2, '0')} · ${esc(c.a)}</option>`)).join('');
  return `<div class="dev">
    <span class="label">công cụ dev · chỉ có ở ván thử</span>
    <div class="row">
      <label class="sr" for="dv1">xúc xắc 1</label><select id="dv1">${opts}</select><label class="sr" for="dv2">xúc xắc 2</label><select id="dv2">${opts}</select>
      ${btn('dev-roll', 'Lăn số này', 'xs', { disabled: !canRoll })}${btn('dev-money', '+500', 'xs', { arg: 500 })}${btn('dev-money', '−500', 'xs', { arg: -500 })}
    </div>
    <div class="row">
      ${vi != null ? btn('dev-goto', `Nhảy tới ${esc(TILES[vi].name)}`, 'xs', { arg: vi, disabled: !canRoll }) : ''}
      ${vi != null && buyable(TILES[vi]) && S.owner[vi] == null ? btn('dev-own', `Nhận ${esc(TILES[vi].name)}`, 'xs', { arg: vi }) : ''}
      ${btn('dev-own-district', 'Nhận cả quận', 'xs', { arg: vi ?? '', disabled: !(vi != null && TILES[vi].type === 'prop') })}
    </div>
    <div class="row"><label class="sr" for="dvc">thẻ</label><select id="dvc">${cards}</select>${btn('dev-card', 'Rút thẻ này', 'xs', { disabled: !canRoll })}</div>
  </div>`;
}

function sideHtml(S, ctx) {
  const p = S.players[S.turn], { me, mine, mode } = ctx, local = mode === 'local';
  const M = mapOf(S), TILES = M.tiles, king = S.secret && S.secret.th ? S.secret.th.king : null;
  const human = me < 0 && !local ? 'Bạn đang xem ván này.'
    : !mine ? `Pha ấm trà, chờ ${esc(p.name)} lăn xúc xắc.`
    : p.money < 0 ? 'Túi rỗng rồi. Bán gì đó, hoặc nhờ hàng xóm.'
    : p.jail ? 'Ngồi ghế đá, ngắm người qua lại.'
    : { move: 'Đi đường quen, hay liều vào sương?', roll: 'Xúc xắc đang chờ trong lòng bàn tay.', buy: 'Một mảnh phố đang chờ người đến ở.', end: 'Uống ngụm trà rồi chuyền xúc xắc.', fly: 'Vé đã trong tay, chỉ còn chọn nơi đến.', downgrade: 'Nhìn quanh bàn cờ, chọn một công trình.', gamble: 'Ván xúc xắc vỉa hè: cược bao nhiêu?' }[S.phase] || '';
  const title = local ? `Lượt của ${esc(p.name)}.` : mine ? 'Lượt của bạn.' : `Lượt của ${esc(p.name)}.`;
  const myCount = me >= 0 ? Object.values(S.owner).filter(o => o === me).length : 0;
  return `<aside class="side" aria-label="Lượt chơi">
    <div class="turn">
      <div class="strip"><span>Đến lượt ai?</span><span>${pad(S.turn)} / ${String(S.players.length).padStart(2, '0')}</span></div>
      <h2 class="h2" style="margin-top:4px">${title}</h2>
      <p class="human">${human}</p>
    </div>
    ${dockHtml(S, ctx)}
    <div class="players">${S.players.map((x, k) => {
      const chips = Object.keys(S.owner).map(Number).filter(i => S.owner[i] === k).sort((a, b) => a - b).map(i => `<span class="sw ${swClass(TILES[i], M)}" title="${esc(TILES[i].name)}"></span>`).join('');
      const tags = [S.xl ? `uy tín ${prestige(S, k).total}` : '', x.worker ? 'làm thuê' : '', k === me && !local ? '(bạn)' : '', x.online === false && !x.out ? 'mất kết nối' : '', king === k ? 'vua Thanh Hóa' : '', x.jail ? `${M.terms.jail.toLowerCase()} · thử ${x.jail}/3` : '', x.cards ? `vé ra ×${x.cards}` : '', x.discount ? `giảm 50% ×${x.discount}` : '', x.out ? 'đã rời phố' : ''].filter(Boolean).join(' · ');
      return `<div class="pl ${k === S.turn ? 'cur' : ''} ${x.out ? 'out' : ''}">
        ${pieceSvg(x.piece, 20)}
        <div class="info"><span class="nm">${esc(x.name)} <small>${esc(tags)}</small></span><span class="chips">${chips}</span></div>
        <span class="money ${x.money < 0 ? 'neg' : ''}">${money(x.money)}</span>
      </div>`;
    }).join('')}</div>
    <div>
      <div class="tabs" role="tablist" aria-label="Thông tin">
        <button type="button" class="tab" role="tab" aria-selected="${ctx.tab === 'land'}" data-act="tab" data-arg="land">${local ? 'Đất của ' + esc(p.name) : 'Đất của tôi'} · ${local ? Object.values(S.owner).filter(o => o === S.turn).length : myCount}</button>
        <button type="button" class="tab" role="tab" aria-selected="${ctx.tab === 'log'}" data-act="tab" data-arg="log">Nhật ký</button>
      </div>
      <div role="tabpanel">${ctx.tab === 'log' ? `<ul class="log">${S.log.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : landsHtml(S, ctx)}</div>
    </div>
    ${ctx.dev && S.opts.dev ? devHtml(S, ctx) : ''}
    <div class="side-foot"><span>Phố Giấy v${ctx.version}</span><span>${S.players.filter(x => !x.out).length} người còn chơi</span></div>
  </aside>`;
}

export function gameHtml(S, ctx) {
  const v = currentView(S, ctx), sel = v.kind === 'tile' ? v.i : -1, M = mapOf(S);
  const picking = ctx.mine && (S.phase === 'fly' || S.phase === 'downgrade');
  const picks = picking ? new Set(choiceTiles(S)) : null;
  const where = ctx.mode === 'local' ? 'ván thử trên máy này' : `phòng ${esc(ctx.room)}`;
  return `<header class="topbar">
      <div class="l"><span class="brand">Phố Giấy</span><span class="label">${esc(M.name)}${S.xl ? ' · Xóm lạ' : ''} · ${where} · ${roundLabel(S)} · ${S.players.length} người</span></div>
      <div class="r">${S.winner != null ? btn('review-end', 'Xem kết quả', 'xs') : ''}${btn('rules', 'Luật chơi', 'xs')}${btn('exit', ctx.mode === 'local' ? 'Thoát ván' : 'Rời phòng', 'xs')}</div>
    </header>
    ${ctx.banner ? `<div class="banner" role="status"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" aria-hidden="true"><path d="M3 12 a9 9 0 1 1 3 6.7"/><path d="M3 20 V13 H10"/></svg><b>${esc(ctx.banner)}</b><span class="human" style="font-size:14px">Bàn cờ vẫn ở đây. Đang thử nối lại mỗi 3 giây…</span></div>` : ''}
    <main class="game" data-map="${M.id}">
      <section class="board-sec" aria-label="Bàn cờ">
        <div class="board${picking ? ' picking' : ''}">${M.tiles.map((t, i) => tileHtml(S, ctx, t, i, sel, picks)).join('')}${centerHtml(S, ctx)}</div>
      </section>
      ${sideHtml(S, ctx)}
    </main>`;
}

// ============ KẾT THÚC VÁN ============
export function endHtml(S, ctx) {
  const st = S.stats, w = S.winner, n = S.players.length, M = mapOf(S), TILES = M.tiles;
  const argmax = arr => arr.reduce((b, v, i) => (v > arr[b] ? i : b), 0);
  const rentK = argmax(st.rent);
  const landEntries = Object.entries(st.lands).filter(([i]) => TILES[i].type !== 'corner' || i !== '0');
  const topLand = landEntries.sort((a, b) => b[1] - a[1])[0];
  const jailK = argmax(st.jails);
  const XL = S.xl && S.xl.final;
  const order = XL
    ? S.players.map((p, k) => k).sort((a, b) => XL[b].total - XL[a].total || (a === w ? -1 : b === w ? 1 : 0))
    : S.players.map((p, k) => k).sort((a, b) => (a === w ? -1 : b === w ? 1 : (st.outRound[b] ?? 1e9) - (st.outRound[a] ?? 1e9)));
  const xlRow = k => `uy tín ${XL[k].total} · tài sản ${XL[k].worth} · khai hoang ${XL[k].explore}${XL[k].rules ? ' · lệ ' + XL[k].rules : ''}${XL[k].games ? ' · hội ' + XL[k].games : ''}`;
  // biểu đồ tài sản
  const series = st.worth, maxV = Math.max(1, ...series.flat());
  const X = i => (series.length < 2 ? 0 : (i / (series.length - 1)) * 600), Y = v => 186 - (v / maxV) * 170;
  const dash = ['', '6 3', '2 3', '8 3 2 3', '1 2', '4 4'];
  const lines = S.players.map((p, k) => `<polyline points="${series.map((row, i) => `${X(i).toFixed(1)},${Y(row[k] ?? 0).toFixed(1)}`).join(' ')}" fill="none" stroke="${pieceColor(p.piece)}" stroke-width="${k === w ? 3 : 1.6}" stroke-dasharray="${k === w ? '' : dash[k % dash.length]}"/>`).join('');
  return `<main class="page">
    <div class="topline"><span class="t">Phố Giấy / ${ctx.mode === 'local' ? 'Ván thử' : 'Phòng ' + esc(ctx.room)} / Kết thúc</span><span class="label">${S.round} vòng · ${n} người</span></div>
    <div class="end-hero">
      <div class="txt">
        <span class="kicker">${XL ? 'Ai được cả xóm nể?' : 'Ai giữ được phố?'}</span>
        <h1 class="h1">${esc(S.players[w].name)} ${XL ? 'có uy tín nhất xóm.' : 'giữ được phố.'}</h1>
        <p class="human" style="font-size:18px;max-width:620px">${XL ? `Sau ${S.xl.rounds} vòng, sương đã tan ở ${S.xl.seen.filter(Boolean).length}/40 ô. Người mới đến giờ đã thành hàng xóm.` : 'Những người còn lại đã bán nhà, thế chấp đất, rồi lần lượt rời phố. Phố vẫn còn đó, và những người đã sống ở đây.'}</p>
        <div class="row" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
          ${ctx.mode !== 'guest' ? btn('new', ctx.mode === 'host' ? 'Chơi ván mới, cùng phòng' : 'Chơi ván mới', 'primary lg') : '<span class="label">chờ chủ phòng mở ván mới…</span>'}
          ${btn('review', 'Xem lại bàn cờ', 'lg')}${btn('exit', 'Về trang đầu', 'ghost lg')}
        </div>
      </div>
      <svg viewBox="0 0 360 220" aria-hidden="true">
        <line x1="0" y1="210" x2="360" y2="210" stroke="var(--ink)" stroke-width=".8"/>
        <rect x="40" y="120" width="40" height="90" fill="var(--d5)"/><rect x="90" y="80" width="46" height="130" fill="var(--d5)"/><circle cx="113" cy="62" r="14" fill="none" stroke="var(--accent)" stroke-width="2"/>
        <rect x="146" y="140" width="36" height="70" fill="none" stroke="var(--ink)" stroke-width=".8"/><path d="M140 140 L164 120 L188 140" fill="none" stroke="var(--ink)" stroke-width=".8"/>
        <path d="M150 30 Q230 60 330 30" fill="none" stroke="var(--ink)" stroke-width=".6"/>
        <circle cx="190" cy="44" r="7" fill="var(--accent)"/><circle cx="240" cy="50" r="7" fill="var(--accent-2)"/><circle cx="290" cy="44" r="7" fill="var(--accent)"/>
        <g fill="none" stroke="var(--ink)" stroke-width="1.6"><circle cx="250" cy="160" r="6" fill="var(--ink)"/><path d="M250 166 V186 M238 170 L250 176 L262 166 M250 186 L242 208 M250 186 L258 208"/></g>
      </svg>
    </div>
    <div class="stats">
      <div class="stat"><b style="color:var(--accent)">${money(netWorth(S, w))}</b><span class="label">${CUR} tài sản của ${esc(S.players[w].name)}</span></div>
      <div class="stat"><b style="color:var(--cool-2)">${money(st.rent[rentK])}</b><span class="label">${CUR} tiền thuê ${esc(S.players[rentK].name)} thu được</span></div>
      <div class="stat"><b>${topLand ? esc(TILES[topLand[0]].name) : '—'}</b><span class="label">ô được dừng chân nhiều nhất${topLand ? ' · ' + topLand[1] + ' lần' : ''}</span></div>
      <div class="stat"><b>${st.jails[jailK]}</b><span class="label">lần ${esc(S.players[jailK].name)} vào ${esc(M.terms.jail)}</span></div>
    </div>
    <div class="end-bottom">
      <figure>
        <figcaption>Tài sản theo vòng</figcaption>
        <svg viewBox="0 0 600 200" role="img" aria-label="Biểu đồ tài sản ${n} người chơi theo vòng">
          <g stroke="var(--neutral)" stroke-width=".5"><line x1="0" y1="${Y(maxV / 2)}" x2="600" y2="${Y(maxV / 2)}"/><line x1="0" y1="${Y(maxV)}" x2="600" y2="${Y(maxV)}"/></g>
          <line x1="0" y1="188" x2="600" y2="188" stroke="var(--ink)" stroke-width=".8"/>
          ${lines}
          <g font-family="IBM Plex Mono, monospace" font-size="11" fill="var(--ink-2)"><text x="2" y="${Y(maxV) - 4}">${money(maxV)}</text><text x="2" y="${Y(maxV / 2) - 4}">${money(Math.round(maxV / 2))}</text></g>
        </svg>
        <div class="legend">${S.players.map((p, k) => `<span><i style="background:${pieceColor(p.piece)}"></i>${esc(p.name)}</span>`).join('')}</div>
      </figure>
      <div class="rank">
        <span class="rank-title" style="padding-bottom:8px">${XL ? 'Bảng uy tín' : 'Thứ tự rời phố'}</span>
        ${order.map((k, i) => `<div class="r ${i === 0 ? 'first' : ''}"><span class="mono" style="color:${i === 0 ? 'var(--accent)' : 'var(--ink-2)'}">${String(i + 1).padStart(2, '0')}</span>${pieceSvg(S.players[k].piece, 18)}<span style="font-weight:${i === 0 ? 700 : 600}">${esc(S.players[k].name)}</span><span class="label">${XL ? xlRow(k) : k === w ? 'còn lại' : st.outRound[k] ? 'vòng ' + st.outRound[k] : ''}</span></div>`).join('')}
      </div>
    </div>
  </main>`;
}

// ============ LỖI, HỘP THOẠI ============
export function errorHtml({ kicker = 'Có trục trặc', title, text, table = null, primary = null }) {
  return `<main class="page"><div class="err-card">
    <span class="kicker">${esc(kicker)}</span>
    <h1 class="h3" style="font-size:26px">${esc(title)}</h1>
    ${table ? `<div class="vtable">${table.map(([a, b, bad]) => `<span class="label">${esc(a)}</span><span class="${bad ? 'bad' : ''}">${esc(b)}</span>`).join('')}</div>` : ''}
    <p class="human">${esc(text)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">${primary ? btn(primary[0], primary[1], 'primary') : ''}${btn('home', 'Về trang đầu', primary ? 'ghost' : 'primary')}</div>
  </div></main>`;
}

export function modalHtml(m) {
  return `<div class="modal-bg" data-act="modal-cancel"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="mtitle" data-stop="1">
    <div class="strip"><span>${esc(m.strip || 'Phố Giấy')}</span><span>${esc(m.stripR || '')}</span></div>
    ${m.kicker ? `<span class="kicker">${esc(m.kicker)}</span>` : ''}
    <h2 class="h3" id="mtitle" style="font-size:24px">${esc(m.title)}</h2>
    ${m.html || (m.text ? `<p class="human">${esc(m.text)}</p>` : '')}
    <div class="row">${m.ok ? btn('modal-ok', esc(m.ok), m.danger ? 'dark' : 'primary') : ''}${btn('modal-cancel', esc(m.cancel || 'Đóng'), '')}</div>
  </section></div>`;
}

export const rulesHtml = (M = MAPS.vietnam) => `<ol class="human" style="font-style:normal;font-family:var(--font-sans);font-size:14px;color:var(--ink)">
  <li>Mỗi người bắt đầu với ${money(START_MONEY)} ${CUR}. Đi qua <b>${M.terms.start}</b> nhận ${SALARY} ${CUR}.</li>
  <li>Dừng ở đất chưa có chủ: mua hoặc bỏ qua. Đất có chủ: trả tiền thuê, gấp đôi nếu chủ có cả quận.</li>
  <li>Có cả quận thì xây nhà, xây đều từng ô; 4 nhà rồi lên <b>phố</b>.</li>
  <li>Lăn đôi được lăn tiếp; 3 lần đôi liền hoặc dừng ở <b>${M.terms.goJail}</b> thì vào <b>${M.terms.jail}</b>.</li>
  <li>Ở ${M.terms.jail}: lăn đôi, trả ${BAIL} ${CUR} hoặc dùng vé. Sau 3 lần thử phải trả.</li>
  <li>Thiếu tiền: bán nhà, thế chấp đất. Vẫn âm thì phá sản. Người cuối cùng còn lại giữ được phố.</li>
  ${M.id === 'vietnam' ? '<li>Thẻ <b>Vận mệnh</b>: có thẻ cho bay tới ô bất kỳ, hạ cấp nhà đối thủ, giảm nửa tiền thuê, hoặc kéo bạn vào một ván cược chẵn lẻ: thua thì mất cược và bị đưa tới ô của đối thủ có tiền thuê cao nhất.</li>' : ''}
</ol>`;
