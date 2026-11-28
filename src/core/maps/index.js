// Danh sách map. Mỗi map: id, name, blurb, terms, districts, tiles (40 ô), decks, hooks.
import { CLASSIC } from './classic.js';
import { VIETNAM } from './vietnam.js';

export const MAPS = { vietnam: VIETNAM, classic: CLASSIC };
export const MAP_IDS = Object.keys(MAPS);
export const DEFAULT_MAP = 'vietnam';
/** Map của một ván. Ván cũ chưa có `map` là bàn gốc. */
const baseOf = S => MAPS[(S && S.map) || 'classic'] || MAPS.classic;
// Chế độ Xóm lạ: S.layout[vị trí] = chỉ số ô gốc của map. Bàn đã xáo được dựng một lần rồi giữ lại,
// nên luật và giao diện đọc `mapOf(S).tiles` như bàn thường.
const derived = new Map();
export const mapOf = S => {
  const base = baseOf(S);
  if (!S || !Array.isArray(S.layout)) return base;
  const key = base.id + ':' + S.layout.join(',');
  let m = derived.get(key);
  if (!m) {
    if (derived.size > 32) derived.clear();
    m = { ...base, tiles: S.layout.map(i => base.tiles[i]), base };
    derived.set(key, m);
  }
  return m;
};
