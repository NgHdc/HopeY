# Làm mới giao diện: "Rực rỡ" (dự kiến 0.6.0)

Bản nháp 1, 2026-11-27. Người dùng đã chốt 3 điều:
1. **Hướng style:** hoạt hình rực rỡ. Màu bão hòa, góc bo tròn, viền đậm, bóng đổ, nút to.
2. **Mỗi map là một vùng đất** có bảng màu, hoa văn và minh họa riêng.
3. **Avatar:** mỗi map có bộ nhân vật vẽ sẵn, người chơi chọn trong sảnh, thay cho 6 quân hình học hiện nay.

Phân việc: **Agy** vẽ và chọn màu, **Codex** làm hệ thống theme, avatar và trang lab xem thử, **Claude** nối vào game (`view.js`, `main.js`, `style.css`). Ai sửa file nào: xem `AGENTS.md` mục 2.

---

## 1. Hướng style chung

| Thành phần | Hiện tại (Swiss Paper) | Mới (Rực rỡ) |
|---|---|---|
| Nền | giấy kem nhạt, nhiều mảng trống | nền sáng của vùng đất, có hoa văn nhẹ hoặc minh họa ở giữa bàn |
| Màu | trầm, ít bão hòa | bão hòa, tươi; mỗi quận một màu rõ, dễ phân biệt khi nhìn nhanh |
| Góc | vuông | bo tròn: ô 8px, thẻ 16px, nút 999px (viên thuốc) |
| Viền | mảnh 0.5–1px | đậm 2–3px màu mực, kiểu sticker |
| Bóng | không | bóng cứng lệch xuống `0 4px 0` màu mực (cảm giác bấm được); nút bấm thì bóng thu lại |
| Chữ tiêu đề | Inter 800 | **Baloo 2** (tròn, vui, đủ dấu tiếng Việt). Chữ thường vẫn Inter. Bỏ IBM Plex Mono khỏi chỗ đông chữ, chỉ giữ cho số tiền |
| Chuyển động | gần như không | nảy nhẹ khi bấm nút, thẻ lật khi rút, quân cờ nhảy từng ô (Claude làm trong `main.js`) |

**Không đổi:** bố cục (bàn cờ trái, cột lượt chơi phải), luồng màn hình, kích thước tối thiểu cho điện thoại 390px. Độ tương phản chữ vẫn phải đạt AA (4.5:1).

## 2. Theme theo vùng đất

Mỗi map có một file `design/themes/<map>.css`, chỉ khai báo biến CSS trong `[data-map="<map>"] { … }`. Game đặt `data-map` lên `<body>`. `design/tokens.css` giữ phần chung (khoảng cách, cỡ chữ, font) và là theme mặc định.

Biến mọi theme phải có (Codex chốt tên cuối cùng trong U1, ghi vào đầu `design/themes/README.md`):

```
--bg  --bg-pattern (url hoặc none)  --surface  --surface-2
--ink  --ink-2  --accent  --accent-2  --good  --bad
--d1 … --d8           màu 8 quận (cộng hoa văn như hiện nay để người mù màu vẫn phân biệt)
--station  --util  --tax  --card
--radius-sm --radius-md --radius-lg   --border   --shadow   --shadow-press
--font-display
--board-art (url minh họa giữa bàn hoặc none)
```

Gợi ý bảng màu (Agy chốt trong A1):
- **Dải đất (Việt Nam):** nền vàng kem nắng, đỏ son sơn mài, hồng sen, xanh lá mạ, xanh ngọc biển, vàng hoa mai. Hoa văn: sóng nước, mây cách điệu. Giữa bàn: dải đất cong chữ S với 8 thành phố.
- **Phố Giấy (bàn gốc):** giữ tinh thần giấy, nhưng tươi hơn: xanh trời, cam đất nung, hồng phấn.

## 3. Avatar

- **Mỗi map 6 nhân vật** (tối đa 6 người chơi), cùng một nét vẽ.
  - Gợi ý cho Dải đất: cô bán hàng rong đội nón lá, bác xích lô, sinh viên áo dài, ông đồ, ngư dân, bé thả diều.
  - Gợi ý cho Phố Giấy: 6 cư dân của 8 khu phố.
- **Mỗi nhân vật cần:**
  - `portrait`: chân dung vuông 256×256, nền trong suốt hoặc nền màu riêng của nhân vật. Dùng ở sảnh, cột người chơi, màn kết thúc.
  - `token`: hình nhỏ toàn thân hoặc đầu, đọc rõ ở 20–28px. Đây là quân cờ trên bàn.
  - Một màu đại diện (thay `--piece-k`), một tên ngắn, một câu giới thiệu.
- **Định dạng:** SVG nếu vẽ được (nhẹ, sắc nét), không thì PNG. Mỗi file dưới 40 KB. Ghi nguồn vào `assets/avatars/SOURCES.md` như với sprite.
- **Dữ liệu:** `assets/avatars/<map>/avatars.json`:
  ```json
  [{ "id": "non-la", "name": "Cô Hai", "line": "Gánh hàng rong qua mọi con phố.", "color": "#E2543A",
     "portrait": "non-la.svg", "token": "non-la-token.svg" }]
  ```
- **Trong game:** ghế k chọn `avatar` (chỉ số 0–5 trong bộ của map), giống cách chọn quân hiện nay. Không đổi định dạng state, vì `players[k].piece` vẫn là chỉ số 0–5; UI tra ra avatar theo map. Thiếu ảnh thì rơi về quân hình học cũ.

## 4. Việc và thứ tự

| Mã | Ai | Việc | Đầu ra | Xong khi |
|---|---|---|---|---|
| A1 | agy | Bảng màu + hoa văn cho 2 vùng đất | `design/themes/palettes.md` (mã màu, lý do, ảnh swatch `assets/themes/<map>-swatch.png`), hoa văn `assets/themes/<map>-pattern.svg` | đủ biến ở mục 2; mọi cặp chữ/nền đạt AA |
| A2 | agy | 6 avatar Dải đất | `assets/avatars/vietnam/` + `avatars.json` | 6 portrait + 6 token, đọc rõ ở 24px, dưới 40 KB |
| A3 | agy | 6 avatar Phố Giấy | `assets/avatars/classic/` + `avatars.json` | như A2 |
| A4 | agy | Minh họa giữa bàn cho 2 vùng đất (không bắt buộc ở vòng đầu) | `assets/themes/<map>-board.svg` | đọc được dưới chữ của khu giữa bàn |
| U1 | codex | Hệ thống theme + trang lab | `design/themes/{classic,vietnam}.css`, `design/themes/README.md`, `design/lab/theme.html` | lab dựng **màn hình thật** (import `src/ui/view.js` + `createGame`) cho trang đầu, sảnh, bàn cờ, kết thúc; chuyển qua lại 2 theme; chụp desktop + mobile 390px |
| U2 | codex | Bộ hiển thị avatar | `src/render/avatar.js` (hàm thuần trả HTML: `avatarHtml(mapId, k, size, kind)`; tải `avatars.json`; rơi về quân cũ), test `tests/render/avatar.test.mjs` | lab có bộ chọn avatar giống sảnh, hiện avatar trên bàn và ở cột người chơi |
| U3 | codex | Đề xuất CSS cho thành phần (nút, thẻ, ô, cột lượt) theo style mới | `design/themes/components.css` (chỉ dùng biến) | lab trông như game thật theo style mới; Claude chép vào `style.css` khi tích hợp |
| K1 | claude | Tích hợp vào game | `index.html` nạp theme, `data-map` trên body, `view.js` dùng `avatarHtml`, sảnh chọn avatar, `style.css` theo U3 | e2e xanh, chụp màn hình 2 map |

Thứ tự:
- A1 → U1: Codex làm khung theme với màu tạm, có palette của Agy thì thay vào.
- A2 → U2: tương tự, Codex dùng hình tạm cho tới khi có avatar của Agy.
- **Cổng duyệt 2:** người dùng xem `design/lab/theme.html` và duyệt màu, avatar, thành phần. Sau đó mới tới K1.

## 5. Ghi chú
- **Cổng duyệt 1 đã chốt: sprite kiểu A · Pixel** (viền đậm, hợp với hướng hoạt hình rực rỡ). Avatar nên cùng tinh thần: nét viền đậm, màu phẳng tươi, có thể pixel hoặc vector nét dày. Agy chọn và ghi lý do trong A2.
- Không thêm dependency npm. Font tải từ Google Fonts như hiện nay (thêm Baloo 2).
- Ảnh do AI tạo phải ghi công cụ + prompt. Không dùng ảnh của tác giả khác.
