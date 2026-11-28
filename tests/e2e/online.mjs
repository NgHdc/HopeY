// Kiểm thử trên trình duyệt thật (Edge/Chrome headless, qua DevTools Protocol).
//   1. Ván thử trên máy: vào thẳng bàn cờ, công cụ dev, thoát về trang đầu
//   2. Online: 2 browser context riêng (như 2 máy) → tạo phòng → vào phòng → chơi → so trạng thái
// Cần: server dev đang chạy (npm run dev) và có internet (PeerJS).
// Chạy: npm run e2e   ·   biến môi trường: BASE_URL, BROWSER, SHOTS (thư mục lưu ảnh chụp)
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173/src/';
const SHOTS = process.env.SHOTS || '';
const BROWSER = process.env.BROWSER || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
if (!BROWSER) { console.error('Không tìm thấy Chrome/Edge. Đặt biến BROWSER.'); process.exit(2); }
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const br = spawn(BROWSER, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'pg-'))}`, 'about:blank'], { stdio: 'ignore' });

let ver;
for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await sleep(200); } }
const ws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

async function openPage(url, width = 1440, height = 900) {
  const { result: { browserContextId } } = await send('Target.createBrowserContext');
  const { result: { targetId } } = await send('Target.createTarget', { url, browserContextId });
  const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
  await send('Page.enable', {}, sessionId);
  const ev = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || JSON.stringify(r.result.exceptionDetails));
    return r.result.result.value;
  };
  const shot = async name => { if (!SHOTS) return; const r = await send('Page.captureScreenshot', { format: 'png' }, sessionId); writeFileSync(join(SHOTS, name), Buffer.from(r.result.data, 'base64')); };
  const ready = async () => { for (let i = 0; i < 50; i++) { try { if (await ev('!!window.__phogiay')) return; } catch { /* đang tải */ } await sleep(200); } throw new Error('trang không tải được: ' + url); };
  await ready();
  return { ev, shot };
}
async function until(f, ms = 25000) { const t = Date.now(); while (Date.now() - t < ms) { try { if (await f()) return true; } catch { /* thử lại */ } await sleep(300); } return false; }

let failed = 0;
const check = (ok, msg) => { console.log(`${ok ? '✓' : '✗'} ${msg}`); if (!ok) failed++; };

try {
  // ---------- 1. ván thử trên máy ----------
  const L = await openPage(BASE + '?local=3&dev');
  check(await until(() => L.ev(`__phogiay.app.screen === 'game'`), 5000), 'ván thử: vào thẳng bàn cờ không cần phòng');
  check(await L.ev(`!!document.querySelector('.dev')`), 'ván thử: có công cụ dev');
  await L.ev(`document.getElementById('dv1').value='1'; document.getElementById('dv2').value='2'; document.querySelector('[data-act=dev-roll]').click()`);
  await until(() => L.ev(`!__phogiay.app.animating && __phogiay.app.truth.phase === 'buy'`), 5000);
  check(await L.ev(`__phogiay.app.truth.players[0].pos === 3`), 'ván thử: đặt xúc xắc 1+2 → ô 3');
  // lớp quân (src/ui/pieces.js): quân đứng trong đúng ô, và #root không bị vẽ lại ở mỗi bước đi
  const inTile = `(() => { const t = document.querySelector('.board [data-tile="' + __phogiay.app.S.players[0].pos + '"]').getBoundingClientRect(); const e = document.querySelector('.pieces-layer .pc[data-seat="0"]').getBoundingClientRect(); const x = e.left + e.width / 2, y = e.top + e.height / 2; return x > t.left && x < t.right && y > t.top && y < t.bottom; })()`;
  check(await L.ev(inTile), 'lớp quân: quân nằm trong ô 3');
  await L.ev(`window.__rr = 0; new MutationObserver(l => { window.__rr += l.length; }).observe(document.getElementById('root'), { childList: true })`);
  await L.ev(`document.querySelector('[data-act=skip]').click()`); await sleep(150);
  await L.ev(`document.querySelector('[data-act=end]').click()`);
  await until(() => L.ev(`__phogiay.app.truth.phase === 'roll' && !__phogiay.app.animating`), 5000);
  await L.ev(`window.__rr = 0; document.getElementById('dv1').value='5'; document.getElementById('dv2').value='6'; document.querySelector('[data-act=dev-roll]').click()`);
  await until(() => L.ev(`!__phogiay.app.animating && __phogiay.app.truth.players[1].pos === 11`), 6000);
  check(await L.ev(`window.__rr <= 4`), 'lớp quân: đi 11 ô mà trang chỉ vẽ lại ≤ 2 lần');
  check(await L.ev(inTile.replaceAll('players[0]', 'players[1]').replace('seat="0"', 'seat="1"')), 'lớp quân: quân người 2 tới đúng ô 11');
  await L.ev(`if (__phogiay.app.truth.phase === 'buy') document.querySelector('[data-act=skip]').click()`); await sleep(150);
  await L.ev(`document.querySelector('[data-act=end]').click()`);
  await until(() => L.ev(`__phogiay.app.truth.phase === 'roll' && !__phogiay.app.animating`), 5000);
  await L.ev(`document.getElementById('dv1').value='1'; document.getElementById('dv2').value='2'; document.querySelector('[data-act=dev-roll]').click()`);
  await until(() => L.ev(`!__phogiay.app.animating`), 5000);
  await L.shot('local-game.png');
  // thẻ Vận mệnh qua giao diện (map Việt Nam là mặc định)
  check(await L.ev(`__phogiay.app.truth.map === 'vietnam'`), 'ván thử: mặc định là map Việt Nam');
  const endTurn = async () => {
    await until(() => L.ev('!__phogiay.app.animating'), 5000);
    await L.ev(`if (__phogiay.app.truth.phase === 'buy') document.querySelector('[data-act=skip]').click()`);
    await sleep(150);
    await L.ev(`document.querySelector('[data-act=end]').click()`);
    await until(() => L.ev(`__phogiay.app.truth.phase === 'roll' && !__phogiay.app.animating`), 5000);
  };
  await endTurn();
  await L.ev(`document.getElementById('dvc').value = 'v:6'; document.querySelector('[data-act=dev-card]').click()`);
  check(await until(() => L.ev(`__phogiay.app.truth.phase === 'gamble' && !!document.getElementById('bet')`), 3000), 'Con bạc: hiện thanh cược');
  await L.ev(`const b = document.getElementById('bet'); b.value = '100'; b.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('[data-act=gamble][data-arg=even]').click()`);
  check(await until(() => L.ev(`!!__phogiay.app.truth.gamble && __phogiay.app.truth.gamble.bet === 100`), 3000), 'Con bạc: cược 100 vào chẵn');
  await until(() => L.ev('!__phogiay.app.animating'), 5000);
  check(await L.ev(`!!document.querySelector('.gamble-res')`), 'Con bạc: hiện kết quả xúc xắc cược');
  await L.shot('vn-gamble.png');
  await endTurn();
  await L.ev(`document.getElementById('dvc').value = 'v:4'; document.querySelector('[data-act=dev-card]').click()`);
  check(await until(() => L.ev(`__phogiay.app.truth.phase === 'fly' && !!document.querySelector('.board.picking')`), 3000), 'Máy bay: bàn cờ sáng ô chọn được');
  await L.ev(`document.querySelector('[data-tile="39"]').click()`);
  await sleep(100);
  await L.ev(`document.querySelector('.dock [data-act=fly]').click()`);
  check(await until(() => L.ev(`__phogiay.app.truth.players[__phogiay.app.truth.turn].pos === 39`), 3000), 'Máy bay: bay tới Hồ Gươm');
  await L.shot('vn-fly.png');
  check(await L.ev(`!!document.querySelector('[data-act=exit]')`), 'ván thử: có nút thoát');
  await L.ev(`document.querySelector('[data-act=exit]').click()`);
  check(await until(() => L.ev(`__phogiay.app.screen === 'home' && !!document.getElementById('resume-local')`), 3000), 'ván thử: thoát về trang đầu, có nút tiếp tục');
  await L.shot('home.png');
  await L.ev(`document.getElementById('resume-local').click()`);
  check(await until(() => L.ev(`__phogiay.app.screen === 'game'`), 3000), 'ván thử: tiếp tục ván đã lưu');
  await L.ev(`document.querySelector('[data-act=tab][data-arg=log]').click()`);
  check(await L.ev(`document.querySelectorAll('.log li').length > 0`), 'ván thử: tab nhật ký');
  // kết thúc ván: hai người lần lượt phá sản → còn một người thắng
  for (let k = 0; k < 2; k++) {
    await until(() => L.ev('!__phogiay.app.animating'), 5000);
    await L.ev(`__phogiay.act({ type: 'debug', op: 'money', n: -5000 }); __phogiay.act({ type: 'bankrupt' })`);
    await sleep(300);
  }
  check(await until(() => L.ev(`!!document.querySelector('.end-hero')`), 5000), 'ván thử: màn hình kết thúc ván');
  await L.shot('end.png');
  // điện thoại
  const M = await openPage(BASE + '?local=4&dev', 390, 844);
  check(await until(() => M.ev(`__phogiay.app.screen === 'game'`), 5000), 'điện thoại: vào bàn cờ');
  await M.shot('mobile-game.png');

  // ---------- 2. online hai máy ----------
  const A = await openPage(BASE), B = await openPage(BASE);
  const online = await A.ev('typeof Peer === "function"');
  if (!online) { check(false, 'online: không tải được PeerJS (cần internet)'); throw new Error('bỏ qua phần online'); }
  const code = 'T' + Math.random().toString(36).slice(2, 6).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
  await A.ev(`__phogiay.startHost('Lan', '${code}')`);
  check(await until(() => A.ev('__phogiay.app.net.isOpen()')), `online: mở phòng ${code}`);
  await B.ev(`__phogiay.startGuest('Minh', '${code}')`);
  check(await until(() => A.ev('__phogiay.app.seats.length === 2')), 'online: khách vào phòng');
  await sleep(400); await B.shot('online-lobby-guest.png');
  await B.ev(`document.querySelector('[data-act=piece][data-arg="3"]').click()`);
  check(await until(() => A.ev('__phogiay.app.seats[1].piece === 3')), 'online: khách chọn quân lục giác');
  await A.shot('online-lobby-host.png');
  await A.ev('__phogiay.startOnlineGame()');
  check(await until(() => B.ev(`__phogiay.app.screen === 'game' && __phogiay.app.me === 1`)), 'online: khách nhận bàn cờ');
  check(await B.ev(`__phogiay.app.truth.map === 'vietnam'`), 'online: khách nhận đúng map chủ phòng chọn');
  await B.ev(`__phogiay.act({ type: 'roll' })`); await sleep(800);
  check(await A.ev(`__phogiay.app.truth.turn === 0 && __phogiay.app.truth.phase === 'roll'`), 'online: khách lăn trái lượt bị chặn');
  for (let k = 0; k < 24; k++) {
    const st = await A.ev('({ turn: __phogiay.app.truth.turn, phase: __phogiay.app.truth.phase })');
    const W = st.turn === 0 ? A : B, type = { roll: 'roll', buy: 'buy', gamble: 'gamble', fly: 'fly', downgrade: 'downgrade' }[st.phase] || 'end';
    await until(() => W.ev('!__phogiay.app.animating'), 8000);
    // phase lựa chọn của thẻ Vận mệnh: cược tối thiểu, bay tới ô kế bên, hạ ô có nhà đầu tiên
    const extra = { gamble: ", bet: 50, pick: 'even'", fly: ', i: (__phogiay.app.truth.players[__phogiay.app.truth.turn].pos + 1) % 40 === 30 ? 31 : (__phogiay.app.truth.players[__phogiay.app.truth.turn].pos + 1) % 40', downgrade: ', i: +Object.keys(__phogiay.app.truth.houses).find(i => __phogiay.app.truth.owner[i] !== __phogiay.app.truth.turn)' }[type] || '';
    await W.ev(`__phogiay.act({ type: '${type}'${extra} })`);
    await sleep(type === 'roll' ? 600 : 250);
  }
  await until(() => B.ev('!__phogiay.app.animating'), 8000); await sleep(500);
  const pick = 'JSON.stringify({ m: __phogiay.app.truth.players.map(p => p.money), o: __phogiay.app.truth.owner, r: __phogiay.app.truth.round })';
  const sa = await A.ev(pick), sb = await B.ev(pick);
  check(sa === sb, `online: hai máy cùng trạng thái ${sa}`);
  await B.shot('online-game-guest.png');
  await A.shot('online-game-host.png');
  await B.ev(`document.querySelector('[data-act=exit]').click()`);
  check(await until(() => B.ev(`!!document.querySelector('.modal [data-act=modal-ok]')`), 3000), 'online: rời phòng hỏi lại bằng hộp thoại');
  await B.ev(`document.querySelector('.modal [data-act=modal-ok]').click()`);
  check(await until(() => A.ev(`__phogiay.app.truth.players[1].online === false`), 8000), 'online: khách rời phòng → chủ phòng thấy mất kết nối');
} catch (e) {
  if (e.message !== 'bỏ qua phần online') { console.log('✗ lỗi:', e.message); failed++; }
}
ws.close(); br.kill();
console.log(failed ? `\n${failed} kiểm tra thất bại` : '\nTất cả kiểm tra đều qua');
process.exit(failed ? 1 : 0);
