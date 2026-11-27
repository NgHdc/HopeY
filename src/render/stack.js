/** Bộ vẽ sprite stack cho Canvas 2D. Góc tính bằng độ, 0 là hướng gốc của sheet. */

const assets = new Map();
const cache = new Map();

export function frameFor(angle, angles = 16) {
  if (!Number.isFinite(angle) || !Number.isInteger(angles) || angles < 1) {
    throw new RangeError('Góc hoặc số khung không hợp lệ');
  }
  return Math.round((((angle % 360) + 360) % 360) * angles / 360) % angles;
}

export function validateManifest(data) {
  if (!data || !Array.isArray(data.assets)) throw new TypeError('Manifest cần mảng assets');
  const seen = new Set();
  return data.assets.map(entry => {
    if (typeof entry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)
      || seen.has(entry.id) || ![entry.w, entry.h, entry.count].every(n => Number.isInteger(n) && n > 0)
      || !['pixel', 'paper'].includes(entry.style) || typeof entry.strip !== 'string'
      || !Number.isFinite(entry.squash) || entry.squash <= 0 || entry.squash > 1
      || !Number.isFinite(entry.spacing) || entry.spacing < 0) {
      throw new TypeError(`Asset không hợp lệ: ${entry?.id ?? '?'}`);
    }
    seen.add(entry.id);
    return { ...entry };
  });
}

export function stackLayout(w, h, count, squash = 0.75, spacing = 1) {
  if (![w, h, count].every(n => Number.isInteger(n) && n > 0)
    || !Number.isFinite(squash) || squash <= 0 || squash > 1
    || !Number.isFinite(spacing) || spacing < 0) throw new RangeError('Bố cục stack không hợp lệ');
  const diag = Math.ceil(Math.hypot(w, h)) + 8;
  const width = diag + 12;
  const height = Math.ceil(diag * squash) + Math.ceil((count - 1) * spacing) + 16;
  return { width, height, cx: Math.floor(width / 2),
    baseY: height - Math.ceil(diag * squash / 2) - 6 };
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Không tải được ${url}`));
    img.src = url;
  });
}

export async function loadStacks(manifestUrl) {
  const response = await fetch(manifestUrl);
  if (!response.ok) throw new Error(`Không tải được manifest: ${response.status}`);
  const entries = validateManifest(await response.json());
  const base = new URL(manifestUrl, location.href);
  const loaded = await Promise.all(entries.map(async entry => {
    const sheet = await loadImage(new URL(entry.strip, base).href);
    if (sheet.width !== entry.w * entry.count || sheet.height !== entry.h) {
      throw new Error(`Dải ${entry.id} sai kích thước: ${sheet.width}×${sheet.height}`);
    }
    return [entry.id, { entry, sheet }];
  }));
  assets.clear();
  cache.clear();
  for (const [id, asset] of loaded) assets.set(id, asset);
  return entries;
}

export function listStacks() {
  return [...assets.values()].map(({ entry }) => ({ ...entry }));
}

function drawFrame(asset, angle, style, squash, spacing) {
  const { entry, sheet } = asset;
  const { width, height, cx, baseY } = stackLayout(entry.w, entry.h, entry.count, squash, spacing);
  const body = makeCanvas(width, height);
  const ctx = body.getContext('2d');
  ctx.imageSmoothingEnabled = style === 'paper';
  const ink = token('--ink');
  const rad = angle * Math.PI / 180;
  for (let z = 0; z < entry.count; z++) {
    ctx.save();
    ctx.translate(cx, baseY - Math.round(z * spacing));
    ctx.scale(1, squash);
    ctx.rotate(rad);
    if (style === 'paper') {
      ctx.shadowColor = ink;
      ctx.shadowBlur = 1.5;
      ctx.shadowOffsetY = 1.5;
      ctx.filter = `brightness(${(0.84 + 0.16 * z / Math.max(1, entry.count - 1)).toFixed(3)})`;
    }
    ctx.drawImage(sheet, z * entry.w, 0, entry.w, entry.h,
      -(entry.w - 1) / 2, -(entry.h - 1) / 2, entry.w, entry.h);
    ctx.restore();
  }
  const frame = makeCanvas(width, height);
  const out = frame.getContext('2d');
  if (style === 'pixel') {
    // Viền theo silhouette cuối cùng: bốn bản sao lệch 1 px, sau đó phủ màu mực.
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) out.drawImage(body, dx, dy);
    out.globalCompositeOperation = 'source-in';
    out.fillStyle = ink;
    out.fillRect(0, 0, width, height);
    out.globalCompositeOperation = 'source-over';
  }
  out.drawImage(body, 0, 0);
  if (style === 'paper') {
    // Vân giấy cố định theo pixel, chỉ hiện trong silhouette đã vẽ.
    out.globalCompositeOperation = 'source-atop';
    out.fillStyle = token('--ink-2');
    out.globalAlpha = 0.045;
    for (let y = 2; y < height; y += 5) {
      for (let x = (y * 7) % 11; x < width; x += 11) out.fillRect(x, y, 1, 1);
    }
    out.globalAlpha = 1;
    out.globalCompositeOperation = 'source-over';
  }
  return frame;
}

export function bake(id, { angles = 16, scale = 1, style, squash, spacing } = {}) {
  const asset = assets.get(id);
  if (!asset) throw new Error(`Chưa tải asset: ${id}`);
  if (!Number.isInteger(angles) || angles < 1 || angles > 360 || !Number.isFinite(scale) || scale <= 0) {
    throw new RangeError('Tham số bake không hợp lệ');
  }
  style ??= asset.entry.style;
  squash ??= asset.entry.squash;
  spacing ??= asset.entry.spacing;
  if (!['pixel', 'paper'].includes(style)) throw new RangeError('Style không hợp lệ');
  const key = JSON.stringify([id, angles, scale, style, squash, spacing, token('--ink'), token('--ink-2')]);
  if (!cache.has(key)) {
    cache.set(key, Array.from({ length: angles }, (_, i) =>
      drawFrame(asset, i * 360 / angles, style, squash, spacing)));
  }
  return cache.get(key);
}

export function drawStack(ctx, id, angle, x, y, options = {}) {
  const asset = assets.get(id);
  if (!asset) throw new Error(`Chưa tải asset: ${id}`);
  const frames = bake(id, options);
  const frame = frames[frameFor(angle, frames.length)];
  const scale = options.scale ?? 1;
  const layout = stackLayout(asset.entry.w, asset.entry.h, asset.entry.count,
    options.squash ?? asset.entry.squash, options.spacing ?? asset.entry.spacing);
  ctx.save();
  ctx.imageSmoothingEnabled = (options.style ?? asset.entry.style) === 'paper';
  ctx.drawImage(frame, Math.round(x - layout.cx * scale), Math.round(y - layout.baseY * scale),
    frame.width * scale, frame.height * scale);
  ctx.restore();
}

export function mountTurntable(el, id, { speed = 25, drag = true, ...initial } = {}) {
  const canvas = el instanceof HTMLCanvasElement ? el : document.createElement('canvas');
  if (canvas !== el) el.append(canvas);
  const ctx = canvas.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let angle = 35, prev = 0, raf = 0, downX = null, opts = { ...initial };
  function paint(time = 0) {
    const ratio = devicePixelRatio || 1;
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const entry = assets.get(id)?.entry;
    if (entry) {
      const size = stackLayout(entry.w, entry.h, entry.count, opts.squash ?? entry.squash,
        opts.spacing ?? entry.spacing);
      const fit = Math.min((canvas.clientWidth - 12) / size.width, (canvas.clientHeight - 12) / size.height);
      const scale = opts.scale ?? fit;
      drawStack(ctx, id, angle, canvas.clientWidth / 2,
        (canvas.clientHeight - size.height * scale) / 2 + size.baseY * scale,
        { ...opts, scale });
    }
    if (!motion.matches && downX === null && prev) angle += speed * (time - prev) / 1000;
    prev = time;
    if (!motion.matches) raf = requestAnimationFrame(paint);
  }
  function pointerDown(event) {
    if (!drag || motion.matches) return;
    downX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    if (downX === null) return;
    angle += (event.clientX - downX) * 0.8;
    downX = event.clientX;
  }
  function pointerUp() { downX = null; }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  function onMotionChange() {
    cancelAnimationFrame(raf);
    prev = 0;
    raf = requestAnimationFrame(paint);
  }
  motion.addEventListener('change', onMotionChange);
  const observer = new ResizeObserver(() => { if (motion.matches) paint(); });
  observer.observe(canvas);
  raf = requestAnimationFrame(paint);
  return {
    canvas,
    update(next = {}) { opts = { ...opts, ...next }; if (motion.matches) paint(); },
    setAngle(next) { angle = next; if (motion.matches) paint(); },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      motion.removeEventListener('change', onMotionChange);
      observer.disconnect();
      if (canvas !== el) canvas.remove();
    },
  };
}
