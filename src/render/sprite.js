// Sprite sheet renderer. The outer span stays available for board movement.
const cache = new Map();
const esc = value => String(value ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const valid = x => x && typeof x.name === 'string' && typeof x.sheet === 'string' &&
  typeof x.portrait === 'string' && Number.isInteger(x.frame) && x.frame > 0 &&
  x.anims && typeof x.anims === 'object';
const spec = (item, anim) => item.anims[anim] || item.anims.idle;
const lookup = (list, k) => Array.isArray(list) && Number.isInteger(k) && k >= 0 && k < list.length && valid(list[k]) ? list[k] : null;
const imageUrl = (name, base) => new URL(name, base).href;

export async function loadAvatars(mapId, base = '../assets/avatars/') {
  const key = String(mapId);
  if (cache.has(key)) return cache.get(key);
  try {
    const url = new URL(`${encodeURIComponent(key)}/avatars.json`, new URL(base, globalThis.location?.href ?? import.meta.url));
    const response = await fetch(url);
    if (!response.ok) throw new Error('avatar JSON missing');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('avatar JSON invalid');
    const list = data.filter(valid).map(item => ({
      ...item, sheetUrl: imageUrl(item.sheet, url), portraitUrl: imageUrl(item.portrait, url),
    }));
    cache.set(key, list);
    return list;
  } catch { cache.set(key, []); return []; }
}

function style(item, anim, scale, flip) {
  const [row, frames, fps] = spec(item, anim);
  const frame = item.frame * scale;
  return `--frame:${frame}px;--row:${row};--frames:${frames};--fps:${fps};--duration:${frames / fps}s;--sheet-width:${item.frame * 4 * scale}px;--sheet-height:${item.frame * 4 * scale}px;--sprite-image:url(&quot;${esc(item.sheetUrl)}&quot;);${flip ? '--flip:-1' : '--flip:1'}`;
}

export function spriteHtml(list, k, { anim = 'idle', scale = 1, flip = false, label = true } = {}) {
  const item = lookup(list, k);
  if (!item || !Array.isArray(spec(item, anim))) return null;
  const zoom = Number.isInteger(scale) && scale > 0 ? scale : 1;
  const active = item.anims[anim] ? anim : 'idle';
  return `<span class="sprite" data-anim="${active}" style="${style(item, active, zoom, flip)}" ${label ? `role="img" aria-label="${esc(item.name)}"` : 'aria-hidden="true"'}><span class="sprite-frames"></span></span>`;
}

export function portraitHtml(list, k, scale = 2) {
  const item = lookup(list, k);
  if (!item) return null;
  const zoom = Number.isInteger(scale) && scale > 0 ? scale : 2;
  return `<img class="sprite-portrait" src="${esc(item.portraitUrl)}" width="${48 * zoom}" height="${48 * zoom}" alt="${esc(item.name)}">`;
}

export function setAnim(el, anim, list, k) {
  const item = lookup(list, k);
  if (!el || !item || !Array.isArray(item.anims[anim])) return false;
  const [row, frames, fps] = item.anims[anim];
  el.style.setProperty('--row', row);
  el.style.setProperty('--frames', frames);
  el.style.setProperty('--fps', fps);
  el.style.setProperty('--duration', `${frames / fps}s`);
  el.dataset.anim = anim;
  return true;
}
