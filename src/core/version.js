// Số phiên bản. Quy tắc tăng số: docs/RELEASE.md mục 1.
export const APP_VERSION = '0.3.0';
// Tăng khi đổi định dạng tin nhắn giữa các máy → khác số thì không vào chung phòng.
export const PROTOCOL_VERSION = 2;
// Tăng khi đổi cấu trúc trạng thái ván đã lưu → viết thêm bước trong migrate().
export const SCHEMA_VERSION = 1;

/** Nâng trạng thái ván cũ lên SCHEMA_VERSION hiện tại. Trả về null nếu không đọc được. */
export function migrate(state) {
  if (!state || typeof state !== 'object' || !Array.isArray(state.players)) return null;
  const v = state.schemaVersion || 0;
  if (v > SCHEMA_VERSION) return null; // ván của bản mới hơn: bản này không mở được
  // v0 (bản 0.2.x) → v1: thêm schemaVersion, rng, opts
  if (v < 1) {
    state.schemaVersion = 1;
    if (typeof state.rng !== 'number') state.rng = (Math.random() * 2 ** 32) >>> 0;
    if (!state.opts) state.opts = {};
  }
  return state;
}
