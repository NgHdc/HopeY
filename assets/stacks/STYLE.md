# Sổ tay style sprite stacking — Kiểu A · Pixel (`assets/stacks/STYLE.md` — G2)

Quy chuẩn thống nhất cho toàn bộ địa danh, ga, tiện ích, ô góc, nhà/khách sạn và quân cờ sprite stacking của bản 0.6.0, khớp với hướng **Pixel rực rỡ** (`docs/UI_REFRESH.md` mục 0) và bảng màu A1 (`design/themes/palettes.md`).

> **Cổng duyệt 1 đã chốt:** **Kiểu A · Pixel** (`style: "pixel"`), viền ngoài 1px màu `--ink`, màu phẳng rực rỡ (≤ 4 sắc độ mỗi vật thể), không khử răng cưa.

---

## 1. Thông số lưới, lát cắt & hiển thị

| Nhóm asset | Cỡ mặt cắt ngang (`W × L`) | Số lát (`count`) | `spacing` | `squash` | `colours` | `shade` |
|---|---|---|---|---|---|---|
| **Địa danh** (22 ô đất — "detailed") | `32–48 × 30–60 px` | `25–36` lát | `1.0` | `0.75` | `24` | `0.14–0.18` |
| **Ga, tiện ích, ô góc** | `24–36 × 24–40 px` | `18–26` lát | `1.0` | `0.75` | `20` | `0.16` |
| **Nhà / khách sạn, quân cờ** ("chunky") | `14–22 × 14–24 px` | `12–18` lát | `1.0` | `0.75` | `16` | `0.16` |

### Quy ước tỉ lệ & ánh sáng
- **Tỉ lệ kiến trúc chung:** `1 tầng nhà ≈ 6 lát` (giúp các công trình đặt cạnh nhau trên bàn cờ có độ cao hài hòa: Tháp Rùa 3 tầng ~32 lát tính cả đảo, Chợ Bến Thành + tháp đồng hồ ~27 lát, Cầu Rồng 25 lát).
- **Hướng ánh sáng cố định:** chiếu từ **trên, bên trái** (`top-left`):
  - Mặt trên (`TOP`): sắc sáng nhất.
  - Mặt trái: sắc sáng hơn mặt chính 1 bậc.
  - Mặt phải / mặt sau: tối hơn 1 bậc, cộng thêm `--shade 0.14–0.18` từ bộ cắt lớp.
- **Viền mực (`--ink`):**
  - Ảnh gốc 4 góc nhìn đại diện (`src/<id>.png`): viền ngoài 1px màu `--ink` (`#1F1A2E` / `#22262B`), nền trắng phẳng `#FFFFFF`.
  - Khi vẽ trên Canvas (`src/render/stack.js`): **không vẽ viền cho từng lát** — renderer chỉ viền 1 lần theo silhouette cuối cùng bằng màu `var(--ink)` với `imageSmoothingEnabled = false`.
- **Giới hạn dung lượng:**
  - Ảnh gốc `assets/stacks/src/*.png`: dưới **400 KB** (thực tế bản pixel vẽ tay chỉ `1–6 KB`).
  - Dải lát cắt `assets/stacks/out/*.png` và sheet 16 góc `*.16.png`: mỗi file dưới **60 KB**.

---

## 2. Bảng màu theo 8 thành phố (lấy gốc từ `design/themes/palettes.md`)

Mỗi thành phố giữ **3–4 màu chủ đạo** ăn khớp màu quận `--d1`…`--d8` (kèm 1 sắc sáng + 1 sắc tối cho từng mảng), đồng thời **tôn trọng sự thật lịch sử & vật liệu thật của công trình** (ví dụ: Tháp Rùa dùng mái đá xám rêu thay vì ngói đỏ).

| Quận | Thành phố | Màu quận A1 | Bảng màu địa danh (3–4 sắc chính) | Ghi chú vật liệu thật |
|---|---|---|---|---|
| 1 | **Hưng Yên** | `--d1` `#945228` | Nâu đất gạch cổ `#945228`, tường vôi ấm `#DFD3B8`, ngói rêu `#6C8062`, tán cây nhãn `#567D58` | Làng Nôm (cầu đá cổ, ngói rêu), Phố Hiến – Chùa Chuông |
| 2 | **Thanh Hóa ★** | `--d2` `#1D73B2` | Đá xanh xám `#7A8594` / `#A0ABB8`, sóng biển `#1D73B2` / `#5CA4F0`, thép cầu `#555D70` | Thành Nhà Hồ (đá xanh ghép khít), Cầu Hàm Rồng, Hòn Trống Mái |
| 3 | **Cần Thơ** | `--d3` `#B84C10` | Xanh sông Hậu `#2E7D8A`, gỗ ghe `#B84C10`, trái cây cam-vàng `#F5B71A` / `#E24A33`, dây văng trắng `#F2EFE6` | Cầu Cần Thơ, Bến Ninh Kiều, Chợ nổi Cái Răng |
| 4 | **Huế** | `--d4` `#7F38AD` | Tím Huế `#7F38AD`, vàng hoàng lưu ly `#F0B016`, đỏ son cung đình `#C93420`, xanh sông Hương `#2E7D8A` | Cầu Trường Tiền (6 vài 12 nhịp), Chùa Thiên Mụ (tháp 7 tầng), Đại Nội – Ngọ Môn |
| 5 | **Hải Phòng** | `--d5` `#C72E3E` | Vàng kem Nhà hát `#F2E4B8`, đỏ phượng & cần cẩu `#C72E3E`, xanh cảng `#22509E`, đá vôi Cát Bà `#6C8062` | Đồ Sơn – Cát Bà, Cảng Hải Phòng, Nhà hát Lớn |
| 6 | **Đà Nẵng** | `--d6` `#F0B016` | Vàng rồng `#F0B016` / `#F8D05E`, xanh biển `#4A85A6`, mặt đường xám `#6B727B`, đá cẩm thạch `#D7D0C2` | Ngũ Hành Sơn – Sơn Trà, Cầu Rồng (`parts`), Cầu Vàng (`parts`) |
| 7 | **TP.HCM** | `--d7` `#157B52` | Gạch/ngói đỏ `#B4472F`, tường kem `#E0D2B5`, kính/mái hiên xanh ngọc `#157B52` / `#4FC4D4`, kính tòa tháp `#64B5F0` | Nhà thờ Đức Bà, Chợ Bến Thành (`parts`), Landmark 81 |
| 8 | **Hà Nội** | `--d8` `#22509E` | Xanh hồ `#2E6B6B` / `#3E857D`, cỏ `#567D58`, vôi đá cổ `#D1C8B1`, đá xám rêu `#7A776C` (Tháp Rùa) / ngói đỏ `#B0472F` (Văn Miếu) | **Tháp Rùa: mái đá xám rêu** (không ngói đỏ); Văn Miếu: ngói đỏ & tường gạch |

---

## 3. Cấu trúc ảnh gốc 1×4 và cách dùng `parts`

### Thứ tự 4 hình chiếu (`order: "reading"`, `side_nose: "left"`, `top_nose: "down"`)
Xếp thành một hàng ngang trên nền `#FFFFFF`, khoảng trống giữa các hình chiếu ≥ `40 px`:
1. **TRÊN (`TOP`, cỡ `L × W`):** nhìn thẳng từ trên xuống, mặt trước hướng **xuống dưới** (`+y`).
2. **CẠNH (`SIDE`, cỡ `H × L`):** mặt trước hướng **sang trái** (`x = 0`).
3. **TRƯỚC (`FRONT`, cỡ `H × W`):** nhìn chính diện mặt trước.
4. **SAU (`BACK`, cỡ `H × W`):** nhìn chính diện từ phía sau.

### Khi nào bắt buộc tách `parts` trong `<id>.json`
Bộ khắc visual hull (`views_to_slices.py`) sẽ **lấp đặc mọi lỗ/vòm kín** và **lem màu mặt bên** nếu một khối nhô cao che phủ một khối khác trong hình chiếu `SIDE`. Giải pháp chuẩn (đã kiểm chứng ở G1):
- **Công trình có vòm / gầm rỗng** (Cầu Rồng, Cầu Trường Tiền, Cầu Hàm Rồng, Cầu Vàng, cổng Thành Nhà Hồ):
  - Tách phần có khe rỗng sao cho khoảng trống **thông ra mép trên hoặc mép dưới** của hình chiếu `SIDE` để thuật toán flood-fill nhận diện nền trắng (ví dụ `dn-cau-rong`: tách `-bridge.png` gồm trụ + mặt cầu và `-dragon.png` gồm 3 vòm rồng).
- **Khối tháp nhô trên mái nhà rộng** (Chợ Bến Thành, Nhà thờ Đức Bà, Chùa Thiên Mụ):
  - Tách `-hall.png` (nhà lồng mái ngói sạch) và `-tower.png` (tháp đồng hồ / tháp chuông độc lập) để màu tường tháp không lem sang hai đầu hồi mái ngói.
- **Cú pháp `parts`** (khớp `tools/art/build_stacks.py`):
  ```json
  {
    "style": "pixel",
    "order": "reading",
    "side_nose": "left",
    "top_nose": "down",
    "dark_thresh": 0,
    "spacing": 1.0,
    "squash": 0.75,
    "parts": [
      { "file": "<id>-part1.png", "slices": 18, "offset": [0, 0, 0] },
      { "file": "<id>-part2.png", "slices": 27, "offset": [0, 9, 0] }
    ]
  }
  ```
  - Lưu ảnh tổng hợp đầy đủ 4 góc tại `src/<id>.png` để dễ xem, nhưng không bật `include_main` khi đã ghép đủ bằng `parts`.
  - Mỗi part phải là **một khối liên thông duy nhất** trong cả 4 hình chiếu (nếu hai trụ tách rời hoàn toàn, `find_views` sẽ đếm thừa khung).

---

## 4. Các lỗi hay gặp & cách phòng tránh (kinh nghiệm từ G1)

1. **Hình chiếu nhỏ bị `find_views()` bỏ sót (`ValueError: Found 3 drawings`):**
   - `views_to_slices.py` loại các vùng có diện tích `< 14%` vùng lớn nhất. Với vật dài và mảnh (cầu, dầm), phải đảm bảo tỉ lệ `H / L ≥ 0,16` (và bề rộng `BACK` tương đương `FRONT`).
2. **Đường tròn/elip trên `TOP` bị cắt lẹm 1px khiến màu mái lem xuống cỏ:**
   - Khi vẽ elip chạm khung `(L, W)` có tâm bán nguyên `(L-1)/2`, dùng bán kính `L/2, W/2` (không trừ `0.5`) để hàng đầu và hàng cuối có điểm ảnh, tránh `find_views` tự cắt khung rồi kéo giãn lệch 1px.
3. **Resampling lệch hàng khi có viền 1px (`add_outline`):**
   - Viền 1px quanh hình chiếu làm tăng chiều cao gốc thêm `+2 px`. Hoặc đặt `"slices": H + 2` cho khớp 1:1, hoặc bỏ viền ở các `part` con và đặt `"dark_thresh": 0` với `"slices": H` để tránh đốm đen sót trong khe lõm.
4. **Cửa vòm / chi tiết tối ở sát mép bị `strip_outline` xóa mất:**
   - `strip_outline` mặc định xóa mọi điểm ảnh mép ngoài có độ sáng trung bình `< 70`. Giữ màu cửa tối ở mức trung bình `≥ 71` (vd `#4E4B44` ~73) hoặc đặt bậc thềm 1px ở `z = 0`.
5. **Quân cờ / công trình lệch tâm khi xoay:**
   - Luôn căn vật thể đối xứng quanh tâm khung `TOP` để khi xoay 360° không bị đảo quỹ đạo.
6. **Bắt buộc kiểm tra trực quan:**
   - Luôn chạy `python -I tools/art/build_stacks.py --only <id> --bake16`, mở `assets/stacks/check/<id>.png` xem đủ 4 góc (35°/135°/225°/315°) + bản tách lớp, và ghi nguồn vào `assets/stacks/SOURCES.md`.
