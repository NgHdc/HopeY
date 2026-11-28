// Lớp quân cờ: mỗi quân là MỘT phần tử sống suốt ván, nằm ngoài #root nên render() không xóa nó.
// Quân trượt giữa các ô bằng transform (Web Animations API), không tính lại bố cục trang.
// Xem docs/HOSTING.md mục 2 (Giai đoạn A).

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAX = 6;

/**
 * `pieceSvg(piece, size)`: quân hình học (dự phòng).
 * `sprite()`: { list, html(list, k), setAnim(el, anim, list, k) } — nhân vật pixel của map; trả list rỗng khi chưa nạp.
 */
export function createPieces({ pieceSvg, sprite }) {
  const layer = document.createElement('div');
  layer.className = 'pieces-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const els = new Map(); // seat → { el, piece, size, list, emote }
  const SHEET_COLS = 4;

  /** Vị trí trên trang của ô i (null nếu chưa có bàn cờ). `spot`: chỗ dành cho quân (span .pieces trong ô). */
  function box(i) {
    const t = document.querySelector(`.board [data-tile="${i}"]`);
    if (!t) return null;
    const r = t.getBoundingClientRect(), s = t.querySelector('.pieces');
    const q = s && s.getBoundingClientRect();
    return {
      x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height,
      spot: q && { x: q.left + scrollX, y: q.top + scrollY, w: q.width, corner: t.classList.contains('corner') },
    };
  }

  /** Cỡ quân theo cỡ ô nhỏ nhất (ô thường). Nhân vật pixel: bội của 8 (16–32px) cho nét đều; quân hình học: 12–20px. */
  function pieceSize(pixel) {
    const b = box(1);
    if (!b) return 16;
    const m = Math.min(b.w, b.h);
    return pixel ? Math.max(16, Math.min(32, Math.floor(m * 0.42 / 8) * 8)) : Math.max(12, Math.min(20, Math.round(m * 0.32)));
  }

  /** Tọa độ góc trái-trên của quân `seat` khi đứng ở ô i, xếp lưới 3×2 cạnh các quân cùng ô. */
  function slot(i, seat, pos, players, size) {
    const b = box(i);
    if (!b) return null;
    const here = players.map((p, k) => k).filter(k => !players[k].out && pos[k] === i);
    if (!here.includes(seat)) here.push(seat);
    const n = here.length, idx = here.indexOf(seat), gap = 2, step = size + gap;
    const sp = b.spot;
    // Kiểu cũ: quân xếp hàng từ trái sang trong dải .pieces ở mép trên ô (góc: mép dưới).
    if (sp && sp.w >= size * 2) {
      const per = Math.max(1, Math.floor((sp.w + gap) / step));
      const c = idx % per, r = Math.floor(idx / per), rows = Math.ceil(n / per);
      const y0 = sp.corner ? sp.y - rows * step + gap : sp.y;
      return { x: Math.round(sp.x + c * step), y: Math.round(y0 + r * step) };
    }
    // Ô hẹp (điện thoại): lưới 3×2 ở giữa ô.
    const cols = Math.min(n, 3), rows = Math.ceil(n / 3);
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const c = idx % 3, r = Math.floor(idx / 3);
    const rowCols = r === rows - 1 ? n - r * 3 : cols;
    return {
      x: Math.round(cx - (rowCols * size + (rowCols - 1) * gap) / 2 + c * step),
      y: Math.round(cy - (rows * size + (rows - 1) * gap) / 2 + r * step),
    };
  }

  function ensure(seat, piece, size) {
    let o = els.get(seat);
    if (!o) {
      const el = document.createElement('div');
      el.className = 'pc';
      el.dataset.seat = seat;
      layer.append(el);
      o = { el, piece: -1, size: 0 };
      els.set(seat, o);
    }
    const list = sprite ? sprite().list : [];
    if (o.piece !== piece || o.size !== size || o.list !== list) {
      const html = list[piece] && sprite().html(list, piece);
      o.el.innerHTML = html || pieceSvg(piece, size, false);
      o.sp = html ? o.el.querySelector('.sprite') : null;
      if (o.sp) {
        // cỡ khung theo ô (sprite.js chỉ nhận hệ số nguyên)
        o.sp.style.setProperty('--frame', size + 'px');
        o.sp.style.setProperty('--sheet-width', size * SHEET_COLS + 'px');
        o.sp.style.setProperty('--sheet-height', size * SHEET_COLS + 'px');
      }
      o.piece = piece; o.size = size; o.list = list;
    }
    return o;
  }

  /** Đổi hoạt ảnh (idle/walk/happy/sad) và hướng nhìn của nhân vật. Quân hình học thì bỏ qua. */
  function pose(o, anim, flip) {
    if (!o.sp) return;
    sprite().setAnim(o.sp, anim, o.list, o.piece);
    if (flip != null) o.sp.style.setProperty('--flip', flip ? -1 : 1);
  }

  const place = (el, p) => { el.style.transform = `translate(${p.x}px, ${p.y}px)`; };

  /** Đặt mọi quân đúng chỗ, không hoạt ảnh. Gọi sau mỗi render() và khi đổi kích thước. */
  function sync(S, pos) {
    const onBoard = S && document.querySelector('.board');
    layer.hidden = !onBoard;
    if (!onBoard) return;
    const size = pieceSize(!!(sprite && sprite().list.length));
    const at = pos || S.players.map(p => p.pos);
    S.players.forEach((p, k) => {
      const o = ensure(k, p.piece, size);
      o.el.hidden = !!p.out;
      if (o.anim) return; // đang chạy hoạt ảnh: để yên
      const s = slot(at[k], k, at, S.players, size);
      if (s) place(o.el, s);
    });
    for (const [k, o] of els) if (k >= S.players.length) { o.el.remove(); els.delete(k); }
  }

  /** Quân `seat` đi bộ qua từng ô của `path`, mỗi bước nhảy nhẹ. Trả Promise khi tới nơi. */
  async function walk(S, pos, seat, path, stepMs) {
    const o = els.get(seat);
    if (!o || !path.length || !document.querySelector('.board')) return;
    const size = o.size, at = pos.slice();
    const pts = [slot(at[seat], seat, at, S.players, size)];
    for (const i of path) { at[seat] = i; pts.push(slot(i, seat, at, S.players, size)); }
    if (pts.some(p => !p)) return;
    const end = pts[pts.length - 1];
    if (reduced()) { place(o.el, end); return; }
    const lift = Math.round(size * (o.sp ? 0.2 : 0.45));
    // các đoạn liên tiếp cùng hướng ngang (đi sang trái thì nhân vật quay mặt sang trái)
    const runs = [];
    let face = null;
    for (let s = 0; s < pts.length - 1; s++) {
      const dx = pts[s + 1].x - pts[s].x, f = dx < 0 ? true : dx > 0 ? false : face;
      if (!runs.length || f !== face) runs.push({ face: f, from: s, to: s + 1 }); else runs[runs.length - 1].to = s + 1;
      face = f;
    }
    pose(o, 'walk');
    for (const r of runs) {
      const n = r.to - r.from, frames = [], last = pts[r.to];
      pose(o, 'walk', !!r.face);
      for (let s = r.from; s < r.to; s++) {
        const a = pts[s], b = pts[s + 1], k = s - r.from;
        frames.push({ offset: k / n, transform: `translate(${a.x}px, ${a.y}px)`, easing: 'ease-out' });
        frames.push({ offset: (k + 0.5) / n, transform: `translate(${(a.x + b.x) / 2}px, ${(a.y + b.y) / 2 - lift}px)`, easing: 'ease-in' });
      }
      frames.push({ offset: 1, transform: `translate(${last.x}px, ${last.y}px)` });
      await run(o, frames, n * stepMs, last);
    }
    pose(o, 'idle');
  }

  /** Nhân vật vui (`happy`) hoặc buồn (`sad`) một lúc rồi đứng yên lại. Không chặn luồng game. */
  function emote(seat, anim, ms = 1400) {
    const o = els.get(seat);
    if (!o || !o.sp || reduced()) return;
    clearTimeout(o.emote);
    pose(o, anim);
    o.emote = setTimeout(() => { if (!o.anim) pose(o, 'idle'); }, ms);
  }

  /** Bay thẳng tới ô `to` (vé máy bay, vào Tù, thẻ dịch chuyển): vòng cung và phóng to ở giữa. */
  async function jump(S, pos, seat, to, ms = 520) {
    const o = els.get(seat);
    if (!o || !document.querySelector('.board')) return;
    const at = pos.slice();
    const a = slot(at[seat], seat, at, S.players, o.size);
    at[seat] = to;
    const b = slot(to, seat, at, S.players, o.size);
    if (!a || !b) return;
    if (reduced()) { place(o.el, b); return; }
    const mid = `translate(${(a.x + b.x) / 2}px, ${(a.y + b.y) / 2 - o.size * 2}px) scale(1.6)`;
    await run(o, [
      { transform: `translate(${a.x}px, ${a.y}px)` },
      { transform: mid, offset: 0.5 },
      { transform: `translate(${b.x}px, ${b.y}px)` },
    ], ms, b);
  }

  async function run(o, frames, duration, end) {
    o.el.classList.add('moving');
    place(o.el, end); // giá trị cuối; hoạt ảnh phủ lên trong lúc chạy
    o.anim = o.el.animate(frames, { duration, easing: 'linear' });
    try { await o.anim.finished; } catch { /* bị hủy */ }
    o.anim = null;
    o.el.classList.remove('moving');
  }

  function clear() { for (const o of els.values()) { clearTimeout(o.emote); o.el.remove(); } els.clear(); layer.hidden = true; }

  return { sync, walk, jump, emote, clear, layer };
}

/** Đồng hồ FPS nhỏ (bật bằng ?fps) để đo độ mượt khi thử. */
export function fpsMeter() {
  const el = document.createElement('div');
  el.className = 'fps';
  document.body.append(el);
  let n = 0, t0 = performance.now(), worst = 0, last = t0;
  const tick = now => {
    n++; worst = Math.max(worst, now - last); last = now;
    if (now - t0 >= 1000) {
      el.textContent = `${Math.round(n * 1000 / (now - t0))} fps · khung chậm nhất ${Math.round(worst)} ms`;
      n = 0; t0 = now; worst = 0;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
