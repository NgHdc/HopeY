// Danh sách map. Mỗi map: id, name, blurb, terms, districts, tiles (40 ô), decks, hooks.
import { CLASSIC } from './classic.js';
import { VIETNAM } from './vietnam.js';

export const MAPS = { vietnam: VIETNAM, classic: CLASSIC };
export const MAP_IDS = Object.keys(MAPS);
export const DEFAULT_MAP = 'vietnam';
/** Map của một ván. Ván cũ chưa có `map` là bàn gốc. */
export const mapOf = S => MAPS[(S && S.map) || 'classic'] || MAPS.classic;
