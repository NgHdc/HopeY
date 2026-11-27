# Nguồn asset sprite stacking (`assets/stacks/`)

Mọi ảnh trong thư mục này đều do dự án tự dựng, không lấy từ tác giả bên ngoài hay moodboard.

## G1 · 3 địa danh thử (2026-11-27)

- **Công cụ dựng ảnh gốc 4 góc nhìn (1×4: TRÊN · CẠNH · TRƯỚC · SAU):** Python 3 + Pillow + NumPy (đường (c) trong skill `sprite-stacking`, vẽ trực giao pixel-chính-xác không phối cảnh, nền trắng phẳng `#FFFFFF`).
- **Bộ cắt lớp:** `tools/art/build_stacks.py` (Codex) gọi `views_to_slices.py` (MIT, commit `0cce02e`).
- **Bảng màu:** Lấy gốc từ biến quận trong `design/tokens.css` và hướng dẫn thành phố trong `docs/ART_PIPELINE.md`.

| Asset ID | Địa danh | Kiểu | Bảng màu & cấu trúc |
|---|---|---|---|
| `hn-ho-hoan-kiem-pixel` | Hồ Hoàn Kiếm – Tháp Rùa (Hà Nội) | A · Pixel (32 lát, `spacing=1.0`) | Hồ xanh ngọc `#2E6B6B`/`#3E857D`, cỏ `#567D58`, tường vôi cổ `#D6C6A5`, ngói đỏ `#B0472F`, chóp `#D49A2A`. Khối 3 tầng đối xứng. |
| `hn-ho-hoan-kiem-paper` | Hồ Hoàn Kiếm – Tháp Rùa (Hà Nội) | B · Giấy xếp lớp (14 lát, `spacing=2.1`) | Cùng bảng màu Hà Nội, thêm vân loang màu nước và sáng mép giấy cắt, 14 lớp dày. |
| `dn-cau-rong-pixel` | Cầu Rồng (Đà Nẵng) | A · Pixel (25 lát, `spacing=1.0`, dùng `parts`) | Xanh biển `#4A85A6`, mặt đường `#6B727B`, dầm/trụ `#BEB6A7`, rồng vàng `#DBA02C`/`#F8D05E`, mắt đỏ `#C74B30`. Ghép 2 phần `-bridge` + `-dragon` giữ rỗng gầm cầu và 3 vòm rồng. |
| `dn-cau-rong-paper` | Cầu Rồng (Đà Nẵng) | B · Giấy xếp lớp (14 lát, `spacing=1.85`, dùng `parts`) | Cùng bảng màu Đà Nẵng + vân màu nước, ghép `-bridge` (7 lát) + `-dragon` (8 lát). |
| `hcm-cho-ben-thanh-pixel` | Chợ Bến Thành (TP.HCM) | A · Pixel (27 lát, `spacing=1.0`, dùng `parts`) | Tường kem `#E0D2B5`, ngói gạch đỏ `#B4472F`, mái hiên xanh ngọc `#2E6B6B`, mặt đồng hồ `#FAF7F0`. Ghép `-hall` + `-tower` để tháp đồng hồ không lem màu lên mái nhà lồng. |
| `hcm-cho-ben-thanh-paper` | Chợ Bến Thành (TP.HCM) | B · Giấy xếp lớp (14 lát, `spacing=2.0`, dùng `parts`) | Cùng bảng màu TP.HCM + vân màu nước, ghép `-hall` (8 lát) + `-tower` (14 lát). |
