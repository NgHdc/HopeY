# Nguồn art chế độ "Xóm lạ" (`assets/xomla/`)

Mọi ảnh PNG trong `assets/xomla/` đều do dự án tự vẽ ở kích thước gốc, không dùng ảnh của tác giả bên ngoài hay moodboard.

## A9 · Art chế độ Xóm lạ (2026-11-28)
- **Công cụ:** Python 3 + Pillow (vẽ từng pixel bằng mảng RGBA và lưới ký tự, không khử răng cưa, nền trong suốt, xuất PNG tối ưu).
- **Bảng màu:** Lấy trực tiếp từ `design/themes/palettes.md` (A1) cùng các sắc độ sáng/tối của chính màu đó (≤ 4 sắc độ mỗi vật thể), viền ngoài 1px màu `--ink` (`#1F1A2E` cho Dải đất, `#1B263B` cho Phố Giấy).
- **Phạm vi:**
  - `assets/xomla/fog/`: 6 file sương mù cho 2 vùng đất (`fog-tile-h`, `fog-tile-v`, `fog-clear` 3 khung 96×32, và bản `-classic`).
  - `assets/xomla/baucua/`: 6 linh vật 32×32 (`nai`, `bau`, `ga`, `ca`, `cua`, `tom`), 6 mặt xúc xắc 16×16 (`die-*`), và 4 chiếu 3×2 (`mat`, `mat-classic`, `mat-empty`, `mat-empty-classic`).
  - `assets/xomla/`: `envelope-closed.png` (24×24), `envelope-open.png` (24×24), `market-scale.png` (32×32).
  - `assets/xomla/icons/`: 6 icon 16×16 (`festival`, `prestige`, `fund`, `charter`, `explore`, `choose-move`).
  - `assets/xomla/check/xomla-all.png`: ảnh kiểm tra phóng ×4 nearest-neighbor (chiếu ×3).
