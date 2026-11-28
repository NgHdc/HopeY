# Nguồn UI kit pixel (`assets/ui/`)

Mọi file PNG trong `assets/ui/` và `assets/ui/icons/` đều do dự án tự vẽ ở độ phân giải gốc (16×16 và 24×24 pixel), không dùng ảnh của tác giả bên ngoài hay moodboard.

## A5 · UI kit pixel (2026-11-28)
- **Công cụ:** Python 3 + Pillow + NumPy (vẽ từng pixel bằng mảng RGBA, không khử răng cưa, nền trong suốt, xuất PNG tối ưu).
- **Bảng màu:** Lấy trực tiếp từ `design/themes/palettes.md` (A1) cùng các sắc độ sáng/tối của chính màu đó (tối đa 4 sắc độ mỗi vật thể), viền ngoài 1px màu `--ink`.
- **Phạm vi:** 16 khung 9 ô (8 khung Dải đất mặc định + 8 khung `-classic` cho Phố Giấy), 23 icon 16×16 trong `assets/ui/icons/`, và ảnh kiểm tra `assets/ui/check/ui-kit.png` phóng nearest-neighbor.

## A8 · Icon trạng thái, mic và favicon pixel (2026-11-28)
- **Công cụ:** Python 3 + Pillow (vẽ từng pixel bằng lưới ký tự và mảng RGBA, không khử răng cưa, nền trong suốt, xuất PNG tối ưu).
- **Bảng màu:** Lấy từ `design/themes/palettes.md` (A1: `--ink`, `--good`, `--accent`, `--accent-2`, `--bad`, `--d1`, `--d2`, `--station`, `--bg`, `--surface-2`), mỗi vật thể 3–4 sắc độ, viền ngoài 1px màu `--ink`.
- **Phạm vi:** 8 icon trong `assets/ui/icons/` (`net-ok.png`, `net-wait.png` 32×16 2 khung, `net-lost.png`, `host.png`, `watch.png`, `mic-on.png`, `mic-off.png`, `speaking.png` 32×16 2 khung), 2 favicon (`assets/ui/favicon-32.png`, `assets/ui/favicon-16.png`), và ảnh kiểm tra `assets/ui/check/a8-status-mic-favicon.png` phóng ×4 nearest-neighbor.

## A7 · Biểu cảm chat & khung bong bóng 9 ô (2026-11-28)
- **Công cụ:** Python 3 + Pillow (vẽ từng pixel ở kích thước gốc 16×16 và 24×28, không khử răng cưa, nền trong suốt, xuất PNG tối ưu).
- **Bảng màu:** Lấy trực tiếp từ `design/themes/palettes.md` (A1) cho cả 2 vùng đất (`vietnam` và `classic`), viền ngoài 1px màu `--ink`.
- **Phạm vi:** 10 biểu cảm 16×16 trong `assets/ui/emotes/` + `emotes.json`, 2 khung bong bóng 9 ô 24×28 (`bubble.png`, `bubble-classic.png`) + 2 đuôi rời 9×6 (`bubble-tail.png`, `bubble-tail-classic.png`), và ảnh kiểm tra `assets/ui/check/a7-emotes-bubble.png` phóng ×4 nearest-neighbor.
