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
- **Bản hoàn chỉnh A6 (gốc 160×240, mỗi PNG < 8 KB < 40 KB):**
  - `vietnam-map.png` (bản A: biển xanh RPG rực rỡ, mặc định).
  - `vietnam-map-vintage.png` (bản B: bản đồ giấy cổ vàng kem nắng — giữ cả 2 làm tùy chọn theo yêu cầu người dùng, ghi trong `vietnam-map.json`).
  - `vietnam-board.png` (bản nhạt cho giữa bàn, kiểm chứng AA ≥ 4,65:1 mọi pixel với `--ink-2` và ≥ 8,96:1 với `--ink`).
  - `classic-map.png` (Phố Giấy nhìn chéo từ trên xuống, dòng sông uốn lượn, 2 cầu, 8 khu đúng màu A1, hải đăng, thuyền, người que nhỏ) + `classic-map.json`.
  - `classic-board.png` (bản nhạt cho giữa bàn Phố Giấy, kiểm chứng AA ≥ 4,70:1 mọi pixel).
  - Ảnh kiểm tra: `check/classic-map-preview.png` (×3), `check/boards-preview.png`.
