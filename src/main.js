// Điều phối: 3 chế độ chơi
//   local: ván thử trên một máy, bạn điều khiển mọi người chơi (có công cụ dev)
//   host : chủ phòng online, giữ trạng thái thật và chạy luật
//   guest: khách online, gửi thao tác và vẽ trạng thái nhận được
import { APP_VERSION, PROTOCOL_VERSION, migrate } from './core/version.js';
import { createGame, applyAction, setOnline } from './core/rules.js';
import { TILES, group } from './core/board.js';
import * as V from './ui/view.js';
import { openHost, joinHost, makeRoomCode, peerAvailable } from './net/peer.js';

const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const STEP_MS = 120;
const SESSION_KEY = 'phogiay-session-v2', LOCAL_KEY = 'phogiay-local', NAME_KEY = 'phogiay-name';
const DEFAULT_NAMES = ['Lan', 'Minh', 'Hoa', 'Tuấn', 'Mai', 'Nam'];
const params = new URLSearchParams(location.search);
const isLocalhost = ['localhost', '127.0.0.1', ''].includes(location.hostname);

const app = {
  mode: null,            // 'local' | 'host' | 'guest'
  screen: 'home',        // 'home' | 'lobby' | 'game' | 'error'
  error: null,
  truth: null,           // trạng thái thật (local/host tự giữ; guest: bản mới nhất nhận được)
  S: null,               // trạng thái đang hiển thị (đi sau truth khi đang chạy hiệu ứng)
  me: -1, room: '', status: '', statusOk: false, started: false, seats: [], net: null, token: '', name: '',
  viewOverride: null, lastView: '', pos: null, animating: false, queue: Promise.resolve(),
  tab: 'land', review: false, modal: null, homeDraft: null, homeCount: 3,
};

// ---------- lưu trữ ----------
const store = {
  get: (k, s = localStorage) => { try { return JSON.parse(s.getItem(k)); } catch { return null; } },
  set: (k, v, s = localStorage) => { try { s.setItem(k, JSON.stringify(v)); } catch { /* đầy bộ nhớ */ } },
  del: (k, s = localStorage) => { try { s.removeItem(k); } catch { /* bỏ qua */ } },
};
const roomKey = code => 'phogiay-room-' + code;
function persist() {
  if (app.mode === 'local') store.set(LOCAL_KEY, { S: app.truth });
  if (app.mode === 'host') store.set(roomKey(app.room), { S: app.truth, seats: app.seats.map(x => ({ name: x.name, token: x.token, piece: x.piece })) });
}
function setUrl(code) { try { history.replaceState(null, '', code ? '?room=' + code : location.pathname + (params.has('dev') ? '?dev' : '')); } catch { /* file:// */ } }
const roomUrl = code => location.href.split(/[?#]/)[0] + '?room=' + code;

// ---------- vẽ ----------
function ctx() {
  const S = app.S;
  const sv = JSON.stringify(S.view);
  if (sv !== app.lastView) { app.lastView = sv; app.viewOverride = null; }
  const me = app.mode === 'local' ? S.turn : app.me;
  const lost = app.mode === 'guest' && app.started && !app.statusOk;
  return {
    me, mine: S.winner == null && me === S.turn, mode: app.mode, room: app.room, status: app.status,
    dev: app.mode === 'local', version: APP_VERSION, viewOverride: app.viewOverride, pos: app.pos, busy: app.animating,
    tab: app.tab, banner: lost ? 'Mất kết nối với chủ phòng.' : '',
  };
}
function render() {
  const root = $('#root');
  // giữ chữ đang gõ ở trang đầu khi vẽ lại
  if ($('#nm')) app.homeDraft = { name: $('#nm').value, code: $('#code') ? $('#code').value : '' };
  if (app.screen === 'game' && app.S) {
    const c = ctx();
    root.innerHTML = app.S.winner != null && !app.review ? V.endHtml(app.S, c) : V.gameHtml(app.S, c);
  } else if (app.screen === 'error') root.innerHTML = V.errorHtml(app.error);
  else if (app.screen === 'lobby') renderLobby(root);
  else renderHome(root);
  $('#modal').innerHTML = app.modal ? V.modalHtml(app.modal) : '';
}
function setStatus(s, ok = false) { app.status = s; app.statusOk = ok; if (app.screen !== 'home') render(); }

/** Hiện trạng thái mới, chạy hiệu ứng đi từng ô theo các sự kiện. */
function show(next, events = []) {
  app.queue = app.queue.then(async () => {
    const prev = app.S;
    const moving = prev && app.screen === 'game' && events.some(e => e.type === 'move' || e.type === 'jump');
    if (moving) {
      app.animating = true;
      app.pos = prev.players.map(p => p.pos);
      app.S = next;
      for (const e of events) {
        if (e.type === 'move') for (const p of e.path) { app.pos[e.seat] = p; render(); await sleep(STEP_MS); }
        else if (e.type === 'jump') { app.pos[e.seat] = e.to; render(); await sleep(250); }
        else if (e.type === 'card') { render(); await sleep(700); }
      }
      app.pos = null; app.animating = false;
    }
    if (next.winner != null && (!prev || prev.winner == null)) app.review = false;
    app.S = next;
    render();
  });
  return app.queue;
}

// ---------- hộp thoại ----------
function ask(m) { app.modal = m; render(); const b = document.querySelector('.modal [data-act=modal-ok], .modal [data-act=modal-cancel]'); if (b) b.focus(); }
function closeModal() { app.modal = null; render(); }

// ---------- thao tác ----------
function act(action) {
  if (!app.truth) return;
  if (app.mode === 'local') commit(app.truth.turn, action);
  else if (app.mode === 'host') commit(0, action);
  else if (app.mode === 'guest' && app.net) app.net.send({ t: 'act', action });
}
function commit(seat, action) {
  const r = applyAction(app.truth, seat, action);
  if (!r.ok) return false;
  app.truth = r.state;
  persist();
  broadcastState(r.events);
  show(r.state, r.events);
  return true;
}

// ---------- ván thử trên máy ----------
function startLocal(n, dev) {
  const first = (store.get(NAME_KEY) || '').trim() || DEFAULT_NAMES[0];
  const names = [first, ...DEFAULT_NAMES.filter(x => x !== first)].slice(0, n);
  Object.assign(app, { mode: 'local', S: null, review: false, tab: 'land', screen: 'game' });
  app.truth = createGame(names, { dev });
  store.set(SESSION_KEY, { mode: 'local' }, sessionStorage);
  persist(); show(app.truth);
}
function resumeLocal() {
  const saved = store.get(LOCAL_KEY), S = saved && migrate(saved.S);
  if (!S) return false;
  Object.assign(app, { mode: 'local', truth: S, S: null, screen: 'game', review: false });
  store.set(SESSION_KEY, { mode: 'local' }, sessionStorage);
  show(S);
  return true;
}

// ---------- chủ phòng ----------
const seatOfPeer = id => app.seats.findIndex(x => x.peerId === id);
const freePiece = () => [0, 1, 2, 3, 4, 5].find(k => !app.seats.some(x => x.piece === k));
function startHost(name, code) {
  Object.assign(app, { mode: 'host', room: code, me: 0, name, truth: null, S: null, review: false });
  store.set(SESSION_KEY, { mode: 'host', room: code, name }, sessionStorage);
  setUrl(code);
  const saved = store.get(roomKey(code)), S = saved && migrate(saved.S);
  if (S && saved.seats) {
    app.truth = S; app.started = true; app.screen = 'game';
    app.seats = saved.seats.map((x, i) => ({ ...x, piece: x.piece ?? i, peerId: null, online: i === 0 }));
    S.players.forEach((p, i) => { p.online = i === 0; });
    show(S);
  } else {
    app.started = false; app.screen = 'lobby';
    app.seats = [{ name, token: Math.random().toString(36).slice(2), peerId: null, online: true, piece: 0 }];
    render();
  }
  app.net = openHost(code, { onOpen: () => setStatus('phòng đã mở', true), onData: onHostData, onClose: onHostClose, onStatus: s => setStatus(s, s === 'phòng đã mở') });
}
function onHostData(peerId, d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'hello') {
    if (d.protocol !== PROTOCOL_VERSION) { app.net.send(peerId, { t: 'error', code: 'version', host: APP_VERSION }); return; }
    const name = String(d.name || '').trim().slice(0, 14) || 'Khách';
    const tok = String(d.token || '');
    let seat = tok ? app.seats.findIndex(x => x.token === tok) : -1;
    if (seat < 0 && !app.started) {
      if (app.seats.length >= 6) { app.net.send(peerId, { t: 'error', code: 'full' }); return; }
      app.seats.push({ name, token: tok, peerId, online: true, piece: freePiece() });
      seat = app.seats.length - 1;
    }
    if (seat >= 0) {
      Object.assign(app.seats[seat], { peerId, online: true });
      if (!app.started) app.seats[seat].name = name;
      else { app.truth = setOnline(app.truth, seat, true); persist(); show(app.truth); }
    }
    broadcastLobby();
    if (app.started) broadcastState([]);
    render();
  } else if (d.t === 'piece') {
    const seat = seatOfPeer(peerId);
    if (seat > 0) choosePiece(seat, d.piece);
  } else if (d.t === 'act' && d.action && typeof d.action === 'object') {
    const seat = seatOfPeer(peerId), a = d.action;
    if (seat > 0) commit(seat, { type: String(a.type), i: Number.isInteger(a.i) ? a.i : undefined });
  }
}
function choosePiece(seat, piece) {
  if (app.started || !Number.isInteger(piece) || piece < 0 || piece > 5) return;
  if (app.seats.some((x, k) => k !== seat && x.piece === piece)) return;
  app.seats[seat].piece = piece;
  broadcastLobby(); render();
}
function onHostClose(peerId) {
  const seat = seatOfPeer(peerId);
  if (seat < 0) return;
  if (!app.started) app.seats.splice(seat, 1);
  else {
    app.seats[seat].online = false;
    app.truth = setOnline(app.truth, seat, false); persist();
    broadcastState([]); show(app.truth);
  }
  broadcastLobby(); render();
}
function broadcastLobby() {
  if (app.mode !== 'host') return;
  const seats = app.seats.map(x => ({ name: x.name, online: x.online, piece: x.piece }));
  app.net.broadcast(id => ({ t: 'lobby', seats, you: seatOfPeer(id), started: app.started }));
}
function broadcastState(events) {
  if (app.mode !== 'host' || !app.net || !app.truth) return;
  app.net.broadcast(id => ({ t: 'state', S: app.truth, events, you: seatOfPeer(id) }));
}
function startOnlineGame() {
  if (app.mode !== 'host' || app.seats.length < 2) return;
  app.truth = createGame(app.seats.map(x => x.name), { pieces: app.seats.map(x => x.piece) });
  app.truth.players.forEach((p, i) => { p.online = app.seats[i].online; });
  Object.assign(app, { started: true, screen: 'game', S: null, review: false, tab: 'land' });
  persist(); broadcastLobby(); broadcastState([]); show(app.truth);
}

// ---------- khách ----------
function startGuest(name, code) {
  const ses = store.get(SESSION_KEY, sessionStorage);
  const token = (ses && ses.mode === 'guest' && ses.room === code && ses.token) || Math.random().toString(36).slice(2) + Date.now().toString(36);
  Object.assign(app, { mode: 'guest', room: code, name, token, seats: [], started: false, screen: 'lobby', truth: null, S: null, review: false });
  store.set(SESSION_KEY, { mode: 'guest', room: code, name, token }, sessionStorage);
  setUrl(code);
  render();
  app.net = joinHost(code, { t: 'hello', name, token }, { onData: onGuestData, onStatus: s => setStatus(s, s === 'đã vào phòng') });
}
function onGuestData(d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'lobby') {
    app.seats = d.seats; app.me = d.you; app.started = d.started;
    if (!app.started) { app.screen = 'lobby'; render(); }
  } else if (d.t === 'state') {
    app.truth = d.S; app.me = d.you; app.started = true;
    if (app.screen !== 'game') { app.screen = 'game'; app.S = null; }
    show(d.S, d.events || []);
  } else if (d.t === 'error') {
    if (app.net) app.net.destroy();
    app.net = null;
    app.screen = 'error';
    app.error = d.code === 'version'
      ? { kicker: 'Sao không vào được?', title: 'Hai máy đang dùng hai phiên bản khác nhau.', table: [['phòng', 'v' + d.host], ['máy bạn', 'v' + APP_VERSION, true]], text: 'Tải lại trang (Ctrl + F5) để lấy bản mới nhất, hoặc nhờ chủ phòng tải lại.', primary: ['reload', 'Tải lại trang'] }
      : { kicker: 'Hết chỗ', title: 'Phòng đã đủ 6 người.', text: 'Nhờ chủ phòng mở phòng mới, hoặc chờ ván sau.' };
    store.del(SESSION_KEY, sessionStorage);
    render();
  }
}

// ---------- rời / về trang đầu ----------
function goHome() {
  if (app.net) app.net.destroy();
  store.del(SESSION_KEY, sessionStorage);
  Object.assign(app, { mode: null, screen: 'home', truth: null, S: null, net: null, room: '', status: '', started: false, seats: [], me: -1, viewOverride: null, pos: null, animating: false, modal: null, review: false });
  app.queue = Promise.resolve();
  setUrl('');
  render();
}
function exit() {
  if (app.mode === 'host' && app.started && app.truth && app.truth.winner == null) {
    return ask({ strip: 'Rời phòng', stripR: 'chủ phòng', kicker: 'Đi thật à?', title: 'Bạn là chủ phòng: rời đi thì cả phòng tạm dừng.', text: `Ván vẫn được lưu trên máy này. Mở lại mã ${app.room} là mọi người chơi tiếp được.`, ok: 'Rời phòng', danger: true, cancel: 'Ở lại', onOk: goHome });
  }
  if (app.mode === 'host' || app.mode === 'guest') {
    if (app.truth && app.truth.winner != null) return goHome();
    return ask({ strip: 'Rời phòng', kicker: 'Đi thật à?', title: 'Rời phòng này?', text: app.started ? 'Bạn có thể quay lại bằng đúng link phòng trong tab này.' : '', ok: 'Rời phòng', danger: true, cancel: 'Ở lại', onOk: goHome });
  }
  goHome();
}

// ---------- trang đầu & sảnh ----------
function renderHome(root) {
  const urlCode = (params.get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
  const local = store.get(LOCAL_KEY);
  const draft = app.homeDraft || {};
  root.innerHTML = V.homeHtml({ name: draft.name ?? store.get(NAME_KEY) ?? '', code: draft.code ?? urlCode, online: peerAvailable(), hasLocalSave: !!(local && local.S && local.S.winner == null), devDefault: isLocalhost || params.has('dev'), version: APP_VERSION });
  $('#count').querySelectorAll('button').forEach(b => { const on = +b.dataset.n === app.homeCount; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  const getName = () => {
    const v = $('#nm').value.trim().slice(0, 14);
    if (!v) { $('#err').textContent = 'nhập tên trước đã'; $('#nm').focus(); return null; }
    store.set(NAME_KEY, v); return v;
  };
  const on = (id, f) => { const el = $(id); if (el) el.onclick = e => { e.preventDefault(); f(); }; };
  on('#create', () => { const v = getName(); if (v) { app.homeDraft = null; startHost(v, makeRoomCode()); } });
  on('#join', () => {
    const v = getName(); if (!v) return;
    const c = ($('#code').value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 5) { $('#err').textContent = 'mã phòng có 5 ký tự'; $('#code').focus(); return; }
    app.homeDraft = null; startGuest(v, c);
  });
  const code = $('#code'); if (code) code.onkeydown = e => { if (e.key === 'Enter') $('#join').click(); };
  $('#count').onclick = e => {
    const b = e.target.closest('[data-n]'); if (!b) return;
    app.homeCount = +b.dataset.n;
    $('#count').querySelectorAll('button').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
  };
  on('#local', () => { const v = $('#nm').value.trim(); if (v) store.set(NAME_KEY, v.slice(0, 14)); app.homeDraft = null; startLocal(app.homeCount, $('#devchk').checked); });
  on('#resume-local', () => { app.homeDraft = null; if (!resumeLocal()) $('#err').textContent = 'không mở được ván thử đã lưu'; });
}
function renderLobby(root) {
  const url = roomUrl(app.room), isHost = app.mode === 'host';
  const seats = app.seats.map(x => ({ ...x, piece: x.piece ?? 0 }));
  root.innerHTML = V.lobbyHtml({ room: app.room, url, seats, me: app.me, isHost, canStart: isHost && app.seats.length >= 2 && app.net && app.net.isOpen(), status: app.status || 'đang kết nối…', statusOk: app.statusOk });
  $('#copy').onclick = () => {
    $('#roomlink').select();
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => document.execCommand('copy'));
    $('#copy').textContent = 'Đã chép';
  };
}

// ---------- sự kiện ----------
document.addEventListener('click', e => {
  const tile = e.target.closest('[data-tile]');
  if (tile && app.S && app.screen === 'game') { ctx(); app.viewOverride = { kind: 'tile', i: +tile.dataset.tile }; render(); return; }
  const b = e.target.closest('[data-act]');
  if (!b) return;
  if (b.classList.contains('modal-bg') && e.target.closest('.modal')) return; // bấm trong hộp thoại, không phải nền
  e.preventDefault();
  const a = b.dataset.act, arg = b.dataset.arg === undefined || b.dataset.arg === '' ? undefined : (isNaN(+b.dataset.arg) ? b.dataset.arg : +b.dataset.arg);
  switch (a) {
    case 'modal-ok': { const f = app.modal && app.modal.onOk; closeModal(); if (f) f(); return; }
    case 'modal-cancel': return closeModal();
    case 'rules': return ask({ strip: 'Luật chơi', kicker: 'Chơi thế nào?', title: 'Sáu điều cần biết', html: V.RULES_HTML });
    case 'exit': return exit();
    case 'home': return goHome();
    case 'reload': return location.reload();
    case 'tab': app.tab = arg; return render();
    case 'review': app.review = true; return render();
    case 'review-end': app.review = false; return render();
    case 'start': return startOnlineGame();
    case 'piece':
      if (app.mode === 'host') choosePiece(0, arg);
      else if (app.net) app.net.send({ t: 'piece', piece: arg });
      return;
    case 'new':
      if (app.mode === 'host') return startOnlineGame();
      if (app.mode === 'local') return startLocal(app.truth.players.length, app.truth.opts.dev);
      return;
    case 'forfeit': {
      const p = app.truth.players[app.truth.turn];
      return ask({ strip: 'Người chơi rớt mạng', kicker: `Chờ ${p.name} hay đi tiếp?`, title: `Cho ${p.name} rời ván?`, text: 'Đất trả về phố, mọi người chơi tiếp.', ok: `Cho ${p.name} rời ván`, danger: true, cancel: 'Chờ thêm', onOk: () => commit(app.truth.turn, { type: 'forfeit' }) });
    }
    case 'bankrupt':
      return ask({ strip: 'Phá sản', kicker: 'Hết cách rồi?', title: 'Phá sản và rời ván?', text: 'Đất của bạn chuyển cho người bạn đang nợ (hoặc trả về phố). Bạn vẫn xem tiếp được.', ok: 'Phá sản', danger: true, cancel: 'Thử xoay xở tiếp', onOk: () => act({ type: 'bankrupt' }) });
    case 'dev-roll': return act({ type: 'roll', dice: [+$('#dv1').value, +$('#dv2').value] });
    case 'dev-money': return act({ type: 'debug', op: 'money', n: arg });
    case 'dev-goto': return act({ type: 'debug', op: 'goto', i: arg });
    case 'dev-own': return act({ type: 'debug', op: 'own', i: arg });
    case 'dev-own-district': group(TILES[arg].d).forEach(i => act({ type: 'debug', op: 'own', i })); return;
    case 'build': case 'sell': case 'mort': case 'unmort': return act({ type: a, i: arg });
    default: return act({ type: a });
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && app.modal) return closeModal();
  if (app.modal || app.screen !== 'game' || !app.S || app.animating || /INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName) && e.code === 'Space' || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || !ctx().mine) return;
  if (e.code === 'Space') { e.preventDefault(); act({ type: 'roll' }); }
  else if (e.key === 'b' || e.key === 'B') act({ type: 'buy' });
  else if (e.key === 's' || e.key === 'S') act({ type: 'skip' });
  else if (e.key === 'e' || e.key === 'E') act({ type: 'end' });
});

// ---------- khởi động ----------
const ses = store.get(SESSION_KEY, sessionStorage);
if (ses && ses.mode === 'host' && peerAvailable()) startHost(ses.name, ses.room);
else if (ses && ses.mode === 'guest' && peerAvailable()) startGuest(ses.name, ses.room);
else if (ses && ses.mode === 'local' && resumeLocal()) { /* đã mở lại ván thử */ }
else if (params.has('local')) startLocal(Math.min(6, Math.max(2, +params.get('local') || 3)), isLocalhost || params.has('dev'));
else render();

// cho script kiểm thử
window.__phogiay = { app, act, startHost, startGuest, startOnlineGame, startLocal, version: APP_VERSION };
