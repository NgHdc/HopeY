// Máy chủ TURN: chuyển tiếp dữ liệu khi hai máy không nối thẳng được (4G, wifi công ty, NAT chặt).
// Dùng Metered Open Relay (gói miễn phí 20 GB/tháng, quá hạn mức thì dừng, không tự tính tiền).
// Ván cờ chỉ gửi vài KB mỗi lượt nên 20 GB là rất dư.
//
// Cách bật: tạo tài khoản miễn phí ở https://www.metered.ca/tools/openrelay/ → tạo app → chép
// "TURN credentials API URL" (dạng https://<app>.metered.live/api/v1/turn/credentials?apiKey=...) vào TURN_API.
// Khóa này nằm công khai trong trang web: Metered thiết kế cho cách dùng này, hạn mức chặn lạm dụng.
// Để trống thì chỉ dùng STUN (cùng wifi vẫn chơi được).
export const TURN_API = '';

let cached = null;
/** Danh sách iceServers TURN (rỗng nếu chưa cấu hình hoặc lỗi). Chờ tối đa 4 giây. */
export function iceServers() {
  if (!TURN_API) return Promise.resolve([]);
  if (!cached) {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(() => ctrl && ctrl.abort(), 4000);
    cached = fetch(TURN_API, ctrl ? { signal: ctrl.signal } : {})
      .then(r => (r.ok ? r.json() : []))
      .then(list => (Array.isArray(list) ? list : []))
      .catch(() => [])
      .finally(() => clearTimeout(t));
  }
  return cached;
}
