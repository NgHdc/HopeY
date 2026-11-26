// Lớp mỏng quanh PeerJS: mở phòng (chủ) hoặc vào phòng (khách). Không biết gì về luật chơi.
import { PROTOCOL_VERSION } from '../core/version.js';

export const PEER_PREFIX = `phogiay-p${PROTOCOL_VERSION}-`;
const PEER_OPTS = { config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] } };

export const peerAvailable = () => typeof window !== 'undefined' && typeof window.Peer === 'function';
export const makeRoomCode = () => { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; return Array.from({ length: 5 }, () => A[Math.floor(Math.random() * A.length)]).join(''); };

/**
 * Chủ phòng. cb: onOpen(), onData(peerId, data), onClose(peerId), onStatus(text)
 * Trả về { send(peerId, msg), broadcast(fn(peerId) → msg|null), isOpen(), destroy() }
 */
export function openHost(room, cb) {
  const conns = new Map();
  let peer = null, dead = false;
  function start(attempt) {
    cb.onStatus('đang mở phòng…');
    peer = new window.Peer(PEER_PREFIX + room, PEER_OPTS);
    peer.on('open', () => { cb.onStatus('phòng đã mở'); cb.onOpen(); });
    peer.on('connection', conn => {
      conn.on('open', () => conns.set(conn.peer, conn));
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
  let conn = null, timer = null, dead = false;
  const peer = new window.Peer(PEER_OPTS);
  const retry = () => { if (timer || dead) return; timer = setTimeout(() => { timer = null; if (peer.open && !dead) connect(); }, 3000); };
  function connect() {
    if (conn && conn.open) return;
    cb.onStatus('đang vào phòng…');
    const c = peer.connect(PEER_PREFIX + room, { reliable: true });
    conn = c;
    c.on('open', () => { c.send({ ...hello, protocol: PROTOCOL_VERSION }); cb.onStatus('đã vào phòng'); });
    c.on('data', d => cb.onData(d));
    c.on('close', () => { if (conn === c && !dead) { conn = null; cb.onStatus('mất kết nối với chủ phòng, đang thử lại…'); retry(); } });
  }
  peer.on('open', connect);
  peer.on('disconnected', () => { if (!peer.destroyed && !dead) try { peer.reconnect(); } catch { /* bỏ qua */ } });
  peer.on('error', err => {
    if (err.type === 'peer-unavailable') { cb.onStatus(`chưa thấy phòng ${room}: chủ phòng còn mở trang không? đang thử lại…`); retry(); }
    else cb.onStatus('lỗi kết nối: ' + err.type);
  });
  return {
    send(msg) { if (conn && conn.open) conn.send(msg); },
    destroy() { dead = true; clearTimeout(timer); peer.destroy(); },
  };
}
