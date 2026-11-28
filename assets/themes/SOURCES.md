# Nguồn tài nguyên vùng đất (`assets/themes/`)

Mọi ảnh trong thư mục này do dự án tự vẽ hoặc dựng từ dữ liệu địa lý công khai thuộc phạm vi công cộng (public domain).

## A1 · Bảng màu & hoa văn (2026-11-27)
- `vietnam-swatch.png`, `classic-swatch.png`: dựng bằng Python + Pillow từ bảng màu `design/themes/palettes.md` (kiểm chứng WCAG 2.1 AA ≥ 4,5:1).
- `vietnam-pattern.svg`, `classic-pattern.svg`, `vietnam-board.svg`, `classic-board.svg`: SVG tự vẽ (sẽ thay bằng bản pixel ở A4p và A6).

## A6 · Bản đồ vùng đất kiểu pixel (2026-11-28)
- **Nguồn đường bờ biển Việt Nam và biên giới láng giềng:** Natural Earth (`ne_50m_admin_0_countries.geojson`, tỉ lệ 1:50m, phạm vi công cộng / Public Domain — https://www.naturalearthdata.com/), chiếu đẳng cự có hệ số `cos(16°)` và đưa về lưới pixel gốc `160×240`.
- **Quần đảo:** Hoàng Sa vẽ đúng vị trí trên Biển Đông và Trường Sa đặt trong khung góc chuẩn bản đồ Việt Nam; Phú Quốc và Côn Đảo giữ đúng vị trí địa lý.
- **Công cụ vẽ:** Python 3 + Pillow + NumPy, vẽ pixel không khử răng cưa, màu lấy từ `design/themes/palettes.md`, 8 địa danh pixel nhỏ 11–15px tự vẽ.
- **Bản phác duyệt sớm (phóng ×3 nearest-neighbor = 480×720):**
  - `check/vietnam-map-draft-a.png` (A: biển xanh đậm kiểu bản đồ game RPG).
  - `check/vietnam-map-draft-b.png` (B: bản đồ giấy cổ vàng kem nắng).
- **Tọa độ pixel gốc:** `vietnam-map.json` (không vẽ chữ lên ảnh).
