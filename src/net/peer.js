// Lớp mỏng quanh PeerJS: mở phòng (chủ) hoặc vào phòng (khách). Không biết gì về luật chơi.
import { PROTOCOL_VERSION } from '../core/version.js';

export const PEER_PREFIX = `phogiay-p${PROTOCOL_VERSION}-`;
import { iceServers } from './ice.js';

const STUN = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }];
// STUN chỉ giúp hai máy tìm địa chỉ của nhau. Mạng 4G / wifi công ty (NAT chặt) chặn kết nối trực tiếp:
// khi đó cần máy chủ TURN chuyển tiếp (ice.js). Không có TURN thì báo rõ cho người chơi thay vì im lặng.
const peerOpts = async () => ({ config: { iceServers: [...STUN, ...(await iceServers())] } });
export const BLOCKED = 'mạng chặn kết nối trực tiếp giữa hai máy';
const JOIN_TIMEOUT = 20000;

export const peerAvailable = () => typeof window !== 'undefined' && typeof window.Peer === 'function';
export const makeRoomCode = () => { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; return Array.from({ length: 5 }, () => A[Math.floor(Math.random() * A.length)]).join(''); };

/**
 * Chủ phòng. cb: onOpen(), onData(peerId, data), onClose(peerId), onStatus(text)
 * Trả về { send(peerId, msg), broadcast(fn(peerId) → msg|null), isOpen(), destroy() }
 */
export function openHost(room, cb) {
  const conns = new Map();
  const failed = new Set(); // máy khách đã nối hỏng: thử lại thì giữ lời báo mạng chặn
  let peer = null, dead = false;
  async function start(attempt) {
    cb.onStatus('đang mở phòng…');
    const opts = await peerOpts();
    if (dead) return;
    peer = new window.Peer(PEER_PREFIX + room, opts);
    peer.on('open', () => { cb.onStatus('phòng đã mở'); cb.onOpen(); });
    peer.on('connection', conn => {
      if (!failed.has(conn.peer)) cb.onStatus('có người đang vào phòng…');
      const fail = () => { if (!conn.open) failed.add(conn.peer), cb.onStatus(`một người đang cố vào nhưng không nối được: ${BLOCKED}`); };
      const slow = setTimeout(fail, JOIN_TIMEOUT);
      conn.on('iceStateChanged', st => { if (st === 'failed') fail(); });
      conn.on('open', () => { clearTimeout(slow); failed.delete(conn.peer); conns.set(conn.peer, conn); cb.onStatus('phòng đã mở'); });
      conn.on('data', d => cb.onData(conn.peer, d));
      const close = () => { if (conns.get(conn.peer) === conn) { conns.delete(conn.peer); cb.onClose(conn.peer); } };
      conn.on('close', close);
      conn.on('error', close);
    });
    peer.on('disconnected', () => { if (!peer.destroyed && !dead) try { peer.reconnect(); } catch { /* bỏ qua */ } });
    peer.on('error', err => {
      if (err.type === 'unavailable-id' && attempt < 15 && !dead) { cb.onStatus('mã phòng còn bận, thử lại…'); peer.destroy(); setTimeout(() => start(attempt + 1), 3000); }
      else if (err.type !== 'peer-unavailable') cb.onStatus('lỗi kết nối: ' + err.type);
    });
  }
  start(0);
  return {
    send(id, msg) { const c = conns.get(id); if (c && c.open) c.send(msg); },
    broadcast(fn) { conns.forEach((c, id) => { const m = fn(id); if (m && c.open) c.send(m); }); },
    isOpen: () => !!(peer && peer.open),
    destroy() { dead = true; if (peer) peer.destroy(); },
  };
}

/**
 * Khách. hello = tin chào gửi khi nối được. cb: onData(data), onStatus(text)
 * Tự nối lại mỗi 3 giây khi mất kết nối. Trả về { send(msg), destroy() }
 */
export function joinHost(room, hello, cb) {
  let conn = null, timer = null, dead = false, peer = null, slow = null, failed = false;
  const blocked = () => (failed = true) && cb.onStatus(`không nối được với chủ phòng: ${BLOCKED} (thường gặp khi một máy dùng 4G). Thử cho hai máy cùng một wifi. Đang thử lại…`);
  const retry = () => { if (timer || dead) return; timer = setTimeout(() => { timer = null; if (peer && peer.open && !dead) connect(); }, 3000); };
  function connect() {
    if (conn && conn.open) return;
    if (!failed) cb.onStatus('đang vào phòng…'); // đã báo mạng chặn thì giữ nguyên lời báo khi thử lại
    const c = peer.connect(PEER_PREFIX + room, { reliable: true });
    conn = c;
    clearTimeout(slow);
    slow = setTimeout(() => { if (conn === c && !c.open && !dead) { blocked(); conn = null; c.close(); retry(); } }, JOIN_TIMEOUT);
    c.on('iceStateChanged', st => { if (st === 'failed' && conn === c && !dead) { clearTimeout(slow); blocked(); conn = null; c.close(); retry(); } });
    c.on('open', () => { clearTimeout(slow); failed = false; c.send({ ...hello, protocol: PROTOCOL_VERSION }); cb.onStatus('đã vào phòng'); });
    c.on('data', d => cb.onData(d));
    c.on('close', () => { if (conn === c && !dead) { conn = null; cb.onStatus('mất kết nối với chủ phòng, đang thử lại…'); retry(); } });
  }
  (async () => {
    const opts = await peerOpts();
    if (dead) return;
    peer = new window.Peer(opts);
    peer.on('open', connect);
    wire();
  })();
  function wire() {
  peer.on('disconnected', () => { if (!peer.destroyed && !dead) try { peer.reconnect(); } catch { /* bỏ qua */ } });
  peer.on('error', err => {
    if (err.type === 'peer-unavailable') { cb.onStatus(`chưa thấy phòng ${room}: chủ phòng còn mở trang không? đang thử lại…`); retry(); }
    else cb.onStatus('lỗi kết nối: ' + err.type);
  });
  }
  return {
    send(msg) { if (conn && conn.open) conn.send(msg); },
    destroy() { dead = true; clearTimeout(timer); clearTimeout(slow); if (peer) peer.destroy(); },
  };
}
