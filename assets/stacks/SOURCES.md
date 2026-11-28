# Nguồn asset sprite stacking (`assets/stacks/`)

Mọi ảnh trong thư mục này đều do dự án tự dựng, không lấy từ tác giả bên ngoài hay moodboard.

## G1 · 3 địa danh thử (2026-11-27)

- **Công cụ dựng ảnh gốc 4 góc nhìn (1×4: TRÊN · CẠNH · TRƯỚC · SAU):** Python 3 + Pillow + NumPy (đường (c) trong skill `sprite-stacking`, vẽ trực giao pixel-chính-xác không phối cảnh, nền trắng phẳng `#FFFFFF`).
- **Bộ cắt lớp:** `tools/art/build_stacks.py` (Codex) gọi `views_to_slices.py` (MIT, commit `0cce02e`).
- **Bảng màu:** Lấy gốc từ biến quận trong `design/tokens.css` và hướng dẫn thành phố trong `docs/ART_PIPELINE.md`.

| Asset ID | Địa danh | Kiểu | Bảng màu & cấu trúc |
|---|---|---|---|
| `hn-ho-hoan-kiem-pixel` | Hồ Hoàn Kiếm – Tháp Rùa (Hà Nội) | A · Pixel (32 lát, `spacing=1.0`) | Hồ xanh ngọc `#2E6B6B`/`#3E857D`, cỏ `#567D58`, tường vôi đá cổ `#D1C8B1`, mái đá xám rêu `#7A776C`/`#5F5D54`, chóp đá `#9E9887`. Khối 3 tầng đối xứng. |
| `hn-ho-hoan-kiem-paper` | Hồ Hoàn Kiếm – Tháp Rùa (Hà Nội) | B · Giấy xếp lớp (14 lát, `spacing=2.1`) | Cùng bảng màu đá cổ xám rêu & hồ xanh, thêm vân loang màu nước và sáng mép giấy cắt, 14 lớp dày. |
| `dn-cau-rong-pixel` | Cầu Rồng (Đà Nẵng) | A · Pixel (25 lát, `spacing=1.0`, dùng `parts`) | Xanh biển `#4A85A6`, mặt đường `#6B727B`, dầm/trụ `#BEB6A7`, rồng vàng `#DBA02C`/`#F8D05E`, mắt đỏ `#C74B30`. Ghép 2 phần `-bridge` + `-dragon` giữ rỗng gầm cầu và 3 vòm rồng. |
| `dn-cau-rong-paper` | Cầu Rồng (Đà Nẵng) | B · Giấy xếp lớp (14 lát, `spacing=1.85`, dùng `parts`) | Cùng bảng màu Đà Nẵng + vân màu nước, ghép `-bridge` (7 lát) + `-dragon` (8 lát). |
| `hcm-cho-ben-thanh-pixel` | Chợ Bến Thành (TP.HCM) | A · Pixel (27 lát, `spacing=1.0`, dùng `parts`) | Tường kem `#E0D2B5`, ngói gạch đỏ `#B4472F`, mái hiên xanh ngọc `#2E6B6B`, mặt đồng hồ `#FAF7F0`. Ghép `-hall` + `-tower` để tháp đồng hồ không lem màu lên mái nhà lồng. |
| `hcm-cho-ben-thanh-paper` | Chợ Bến Thành (TP.HCM) | B · Giấy xếp lớp (14 lát, `spacing=2.0`, dùng `parts`) | Cùng bảng màu TP.HCM + vân màu nước, ghép `-hall` (8 lát) + `-tower` (14 lát). |

## G3a · 6 địa danh đợt 1 — Kiểu A · Pixel (2026-11-28)

- **Công cụ dựng ảnh gốc 4 góc nhìn (1×4: TRÊN · CẠNH · TRƯỚC · SAU):** Python 3 + Pillow + NumPy (dựng khối voxel trực giao theo chuẩn `assets/stacks/STYLE.md` rồi chiếu ra 4 hình chiếu 1×4 nền trắng phẳng `#FFFFFF`, không phối cảnh).
- **Bộ cắt lớp:** `python -I tools/art/build_stacks.py --only <id> --bake16` gọi `views_to_slices.py` (MIT, commit `0cce02e`).
- **Bảng màu:** Lấy từ bảng màu 8 thành phố trong `assets/stacks/STYLE.md` (gốc `design/themes/palettes.md`), tôn trọng vật liệu thật của từng công trình.

| Ô | Asset ID | Địa danh | Cấu trúc (`parts`) & bảng màu |
|---|---|---|---|
| 1 | `hy-lang-nom` | Làng Nôm (Hưng Yên) | 3 phần (`-base` sông & trụ cầu + cây nhãn, `-bridge` cầu đá cong lan can, `-gate` cổng tam quan mái ngói rêu). Màu `--d1` `#945228`, tường vôi `#DFD3B8`, rêu `#6C8062`, cây `#567D58`. |
| 3 | `hy-pho-hien-chua-chuong` | Phố Hiến – Chùa Chuông (Hưng Yên) | 2 phần (`-base` sân gạch đỏ + tam quan tầng 1 + 2 cây nhãn, `-upper` gác chuông đồng vàng & mái chồng diêm 4 góc đao cong). Màu gạch `#945228`, tường vôi `#DFD3B8`, ngói `#9E4124`/`#6C8062`. |
| 6 | `th-cau-ham-rong` | Cầu Hàm Rồng (Thanh Hóa ★) | 5 phần (`-river` sông Mã + 2 bờ núi đá xanh + trụ giữa, `-road1`/`-road2` mặt cầu đường ray đỏ tách rời để gầm cầu rỗng, `-arch1`/`-arch2` 2 vòm giàn thép parabol mở đáy rỗng). Màu `--d2` `#1D73B2`, đá xanh `#7A8594`, thép `#555D70`/`#8894AB`. |
| 8 | `th-sam-son-hon-trong-mai` | Sầm Sơn – Hòn Trống Mái (Thanh Hóa ★) | 3 phần (`-base` biển sóng bọt trắng & bệ đá Trường Lệ, `-trong` Hòn Trống cao nhọn chênh vênh, `-mai` Hòn Mái tròn đối diện). Màu biển `#1D73B2`/`#5CA4F0`, đá xanh xám `#7A8594`/`#A0ABB8`, rêu `#567D58`. |
| 9 | `th-thanh-nha-ho` | Thành Nhà Hồ (Thanh Hóa ★) | 2 phần (`-base` nền đất & 4 trụ đá khối lớn mở 3 khe cổng rỗng, `-top` 3 vòm cuốn đá ghép khít + tường thành phủ cỏ xanh). Màu đá xanh `#7A8594`/`#A0ABB8`/`#5B6573`, cỏ `#567D58`. |
| 11 | `ct-cau-can-tho` | Cầu Cần Thơ (Cần Thơ) | 5 phần (`-river` sông Hậu + 2 móng trụ + ghe gỗ nhỏ, `-deck1`/`-deck2` mặt cầu lan can cam & đèn vàng giữ gầm cầu rỗng, `-pylon1`/`-pylon2` 2 tháp chữ A kem xám `#DCD7CC` mở đáy + cánh dây văng). Màu sông `#2E7D8A`, tháp `#DCD7CC`, dây `#9EB8CC`, gỗ `--d3` `#B84C10`, đèn `#F5B71A`. |
