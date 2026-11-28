# Nguồn UI kit pixel (`assets/ui/`)

Mọi file PNG trong `assets/ui/` và `assets/ui/icons/` đều do dự án tự vẽ ở độ phân giải gốc (16×16 và 24×24 pixel), không dùng ảnh của tác giả bên ngoài hay moodboard.

## A5 · UI kit pixel (2026-11-28)
- **Công cụ:** Python 3 + Pillow + NumPy (vẽ từng pixel bằng mảng RGBA, không khử răng cưa, nền trong suốt, xuất PNG tối ưu).
- **Bảng màu:** Lấy trực tiếp từ `design/themes/palettes.md` (A1) cùng các sắc độ sáng/tối của chính màu đó (tối đa 4 sắc độ mỗi vật thể), viền ngoài 1px màu `--ink`.
- **Phạm vi:** 16 khung 9 ô (8 khung Dải đất mặc định + 8 khung `-classic` cho Phố Giấy), 23 icon 16×16 trong `assets/ui/icons/`, và ảnh kiểm tra `assets/ui/check/ui-kit.png` phóng nearest-neighbor.
