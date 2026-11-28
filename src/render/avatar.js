// Avatar renderer for the two map themes. The renderer itself is synchronous;
// loadAvatarManifest fetches and caches the map's JSON before a view is drawn.
const manifests = new Map();

const SHAPES = [
  '<circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="2.4" fill="none" stroke="var(--paper)" stroke-width=".8"/>',
  '<path d="M8 1.5 L15 14.5 H1Z"/><line x1="8" y1="6" x2="8" y2="12" stroke="var(--ink)" stroke-width=".6"/>',
  '<rect x="2" y="2" width="12" height="12"/><path d="M2 8 H14 M8 2 V14" stroke="var(--paper)" stroke-width=".6"/>',
  '<path d="M8 1 L14.1 4.5 V11.5 L8 15 L1.9 11.5 V4.5Z"/><circle cx="8" cy="8" r="1.6" fill="var(--paper)"/>',
  '<path d="M1.5 7.5 L8 2 L14.5 7.5 V14.5 H1.5Z"/><rect x="6.5" y="9.5" width="3" height="5" fill="var(--accent-2)"/>',
  '<path d="M1.5 14.5 C1.5 6 6 1.5 14.5 1.5 C14.5 10 10 14.5 1.5 14.5Z"/><path d="M2.5 13.5 L11 5" stroke="var(--paper)" stroke-width=".7"/>',
];
const SHAPE_NAMES = ['tròn', 'tam giác', 'vuông', 'lục giác', 'ngôi nhà', 'chiếc lá'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validEntries(value) {
  return Array.isArray(value) && value.length === 6 && value.every(item =>
    item && typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.color === 'string' && /^#[\da-f]{6}$/i.test(item.color) &&
    typeof item.portrait === 'string' && typeof item.token === 'string');
}

/** Fetch avatars.json for a map and resolve image paths against its URL. */
export async function loadAvatarManifest(mapId, { fetchImpl = globalThis.fetch, url = `../../assets/avatars/${encodeURIComponent(mapId)}/avatars.json` } = {}) {
  try {
    const response = await fetchImpl(url);
    if (!response.ok) throw new Error(`Avatar manifest HTTP ${response.status}`);
    const entries = await response.json();
    if (!validEntries(entries)) throw new TypeError('Invalid avatar manifest');
    const base = new URL('.', new URL(url, globalThis.location?.href ?? 'http://localhost/')).href;
    manifests.set(mapId, entries.map(entry => ({ ...entry,
      portraitUrl: new URL(entry.portrait, base).href,
      tokenUrl: new URL(entry.token, base).href,
    })));
    return true;
  } catch {
    manifests.delete(mapId);
    return false;
  }
}

/** Synchronous HTML renderer. Unknown maps, kinds and seats use the legacy piece. */
export function avatarHtml(mapId, k, size, kind) {
  const index = Number.isInteger(k) && k >= 0 && k < 6 ? k : (Number.isInteger(k) ? ((k % 6) + 6) % 6 : 0);
  const dimension = Number.isFinite(Number(size)) && Number(size) > 0 ? Math.min(512, Number(size)) : 24;
  const type = kind === 'portrait' ? 'portrait' : 'token';
  const item = manifests.get(mapId)?.[index];
  if (item) {
    const src = type === 'portrait' ? item.portraitUrl : item.tokenUrl;
    return `<img class="avatar avatar-${type}" src="${esc(src)}" width="${dimension}" height="${dimension}" alt="${esc(item.name)}" title="${esc(item.name)}" style="--avatar-color:${esc(item.color)}">`;
  }
  const name = SHAPE_NAMES[index];
  return `<svg class="piece avatar-fallback" width="${dimension}" height="${dimension}" viewBox="0 0 16 16" style="fill:var(--piece-${index})" role="img" aria-label="quân ${name}">${SHAPES[index]}</svg>`;
}

export function avatarEntries(mapId) {
  return (manifests.get(mapId) ?? []).map(({ id, name, line, color }) => ({ id, name, line, color }));
}
