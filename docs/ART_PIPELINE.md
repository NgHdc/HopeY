# Art pipeline: địa danh "xếp lớp" bằng sprite stacking (kế hoạch, 2026-11-27)

Người làm: **Codex** (công cụ và bộ vẽ), **Agy** (ảnh và nội dung), **Claude** (tích hợp vào game).
Phân quyền file xem `AGENTS.md`. Bản phát hành dự kiến: **0.6.0 "Phố có hình"**, ra sau bản 0.5.0 (map Việt Nam) mà Claude đang làm.

## 0. Vì sao dùng sprite stacking, và rủi ro

Repo [danielwh2/sprite-stacking](https://github.com/danielwh2/sprite-stacking) (MIT) là một "agent skill" chạy được trên Claude Code, Codex, Gemini CLI…

**Cách hoạt động:**
1. Đầu vào là một ảnh 4 góc nhìn xếp thành hàng ngang 1×4 theo thứ tự **TRÊN · CẠNH · TRƯỚC · SAU**.
2. Script `views_to_slices.py` (Python, Pillow + NumPy) khắc ra khối 3D. Một voxel chỉ được giữ khi cả 4 góc đều phủ nó ("visual hull").
3. Khối được cắt thành N lát nằm ngang, ra một dải PNG.
4. Khi vẽ, mỗi lát được xoay, ép dọc (`squash` ≈ 0.75) và nâng `z × spacing`, xếp chồng từ dưới lên. Kết quả là một vật xoay 360° như 3D thật.

**Hợp với game ở chỗ:**
- 22 địa danh Việt Nam (Tháp Rùa, Cầu Rồng, Chợ Bến Thành…) có thể xoay trên thẻ đất, hiện lên giữa bàn khi có người đi vào ô.
- Quân cờ xoay theo hướng đi.
- Nhà và khách sạn thành khối nhỏ có chiều sâu.

**Rủi ro và cách xử lý:**
1. **Lệch style.** Mặc định skill ra pixel art, còn hướng hiện tại là Swiss Paper cộng màu nước.
   - Cách xử lý: thử song song hai kiểu.
   - **A · Pixel:** giữ nguyên kiểu của skill.
   - **B · Giấy xếp lớp:** ít lát hơn (10–16 lát dày), vẽ mượt (không pixel), mỗi lát có viền giấy, bóng đổ nhẹ và vân giấy màu nước.
   - Kiểu B khớp với chính cái tên "Phố Giấy", như một mô hình giấy cắt dán. Người dùng chọn ở cổng duyệt 1.
2. **Hình lõm bị lấp.** Visual hull không giữ được lỗ và vòm: gầm cầu, vòm cổng, đôi tay Cầu Vàng.
   - Tách vật thành nhiều phần, mỗi phần một ảnh rồi ghép bằng `parts` trong `<id>.json` (C2).
   - Hoặc vẽ thẳng các lát bằng script PIL, đây là đường (c) mà skill hỗ trợ.
3. **AI tạo ảnh 4 góc hay lệch tỉ lệ giữa các góc.**
   - Agy phải đo và sửa bằng PIL trước khi cắt lớp: cùng chiều cao, cùng chiều rộng giữa các góc tương ứng.
   - Ảnh check sheet (`--preview`) là bằng chứng bắt buộc.
4. **Hiệu năng trên điện thoại.**
   - Bake sẵn 16 góc thành sprite sheet.
   - Trên bàn cờ chỉ vẽ ảnh tĩnh một góc. Chỉ thẻ đất và màn trung tâm mới xoay.
5. **Mã bên ngoài.** Codex đọc toàn bộ script trước khi chạy, ghi lại commit hash, và chạy bằng `python -I`.

## 1. Danh sách asset (map Việt Nam)

| Nhóm | Số lượng | Ghi chú |
|---|---|---|
| Địa danh (ô đất) | 22 | Theo bảng trong `docs/MAP_VIETNAM.md` |
| Ga | 4 | Ga Hà Nội, Ga Huế, Ga Đà Nẵng, Ga Sài Gòn. Dùng chung một đầu tàu, đổi màu theo thành phố |
| Tiện ích | 2 | Cột điện, tháp nước |
| Góc | 4 | Cột mốc Xuất phát, song sắt nhà tù, ghế cà phê vỉa hè, xe chở vào tù |
| Nhà / khách sạn | 2 | Khối chung, tô màu theo `--dN` của quận |
| Quân cờ | 6 | Gợi ý: nón lá, xe đạp, xích lô, thuyền thúng, đèn lồng, con trâu |
| **Tổng** | **40** | |

**Mã asset:** `kebab-case` không dấu, có tiền tố thành phố. Ví dụ `hn-ho-hoan-kiem`, `dn-cau-rong`, `piece-non-la`.

## 2. Luồng làm một asset

```
[Agy] prompt → ảnh 1×4  ──►  assets/stacks/src/<id>.png + <id>.json (tham số)
                               │
[Codex] tools/art/build_stacks.py
                               ├─► assets/stacks/out/<id>.png        (dải lát cắt)
                               ├─► assets/stacks/out/<id>.16.png     (16 góc bake sẵn, tuỳ chọn)
                               ├─► assets/stacks/check/<id>.png      (check sheet để duyệt)
                               └─► assets/stacks/manifest.json       (id, w, h, count, spacing, squash, style)
                               │
[Codex] src/render/stack.js ──► design/lab/stack.html (xem thử)
                               │
[Claude] gắn vào src/ui/view.js + main.js (ô, thẻ đất, giữa bàn, quân cờ)
```

## 3. Việc của Codex (C1–C6)

**C1 · Đưa skill vào repo và đọc kỹ.**
- Chép `skills/sprite-stacking/` vào `.agents/skills/sprite-stacking/` và `.claude/skills/sprite-stacking/`. Cả 3 agent sẽ dùng được.
- Đọc toàn bộ `views_to_slices.py`, `viewer.html`, `references/engines.md`.
- Ghi vào `tools/art/THIRD_PARTY.md`: commit hash, giấy phép MIT, tóm tắt các tham số.
- Xong khi: `python -I tests/check.py` in ra `ok`, và ảnh mẫu cắt ra dải lát cắt đúng.

**C2 · `tools/art/build_stacks.py`: chạy hàng loạt.**
- Với mỗi `assets/stacks/src/*.png`, đọc file `<id>.json` đi kèm: `slices`, `side_nose`, `colours`, `round`, `style`, `parts`.
- Gọi bộ cắt lớp, xuất dải PNG, check sheet và tuỳ chọn bake 16 góc.
- Cập nhật `manifest.json`.
- Có `--only <id>` để chạy lại một asset.
- Chạy lại với cùng đầu vào phải ra file y hệt (kiểm bằng hash).
- Mục `parts` ghép nhiều khối với độ lệch x, y, z, dùng cho cầu và cổng có vòm.
- Xong khi: 3 asset thử ra đủ file, chạy hai lần cho cùng hash.

**C3 · `src/render/stack.js`: bộ vẽ trong game (ES module, không dependency).**
- API:
  - `loadStacks(manifestUrl)`
  - `bake(id, {angles:16, scale, style})` → các canvas đã bake
  - `drawStack(ctx, id, angle, x, y)`
  - `frameFor(angle, angles)`
  - `mountTurntable(el, id, {speed, drag:true})`
- Style `pixel`: `imageSmoothingEnabled=false`, viền cả khối một lần.
- Style `paper`: vẽ mượt, mỗi lát có bóng đổ 1–2px màu `--ink` mờ, lát dưới tối dần, phủ một lớp vân giấy. Màu đọc từ biến CSS trong `design/tokens.css`, không viết cứng.
- Tôn trọng `prefers-reduced-motion`: chỉ vẽ ảnh tĩnh.
- Test thuần trong `tests/render/*.test.mjs`: chọn khung theo góc, bố cục, đọc manifest. Phần canvas không test được bằng Node.
- Xong khi: test xanh, và lab (C4) vẽ đúng cả 2 style.

**C4 · `design/lab/stack.html`: trang xem thử.**
- Lưới tất cả asset trong manifest.
- Chọn một asset để mở turntable lớn, có thanh trượt `squash`, `spacing`, `scale` và nút bật/tắt pixel ↔ paper.
- Nền đổi được giữa màu giấy và màu từng quận.
- Có chế độ "trên bàn": mô phỏng ô 64px và thẻ đất.
- Xong khi: chạy được ở `http://127.0.0.1:5173/design/lab/stack.html`, có ảnh chụp desktop và mobile 390px trong `docs/agents/codex.md`.

**C5 · Hiệu năng.**
- Đo thời gian bake 40 asset × 16 góc. Mục tiêu dưới 300 ms trên desktop. Nếu chậm hơn, chuyển sang dùng file `.16.png` bake sẵn.
- Ngân sách dung lượng: tổng asset map dưới 1,5 MB, mỗi dải dưới 60 KB.
- Ghi số đo vào `docs/agents/codex.md`.

**C6 · Đề xuất tích hợp (không tự sửa `view.js`).**
- Viết trong `docs/agents/codex.md`:
  - HTML cần thêm, ví dụ `<canvas data-stack="hn-ho-hoan-kiem" data-angle="225">`;
  - hàm cần gọi sau `render()`;
  - cách dọn dẹp khi rời màn;
  - cách quân cờ đổi góc theo hướng đi (`atan2`).
- Claude sẽ làm theo bản này.

## 4. Việc của Agy (G1–G6)

**G1 · Thử style (cổng duyệt 1).**
- Làm 3 asset thử, mỗi cái kiểm một kiểu hình khó:
  - `hn-ho-hoan-kiem`: Tháp Rùa, khối đơn giản;
  - `dn-cau-rong`: dài và mảnh, có vòm, dùng để thử `parts`;
  - `hcm-cho-ben-thanh`: toà nhà có tháp đồng hồ.
- Mỗi asset ra 2 kiểu: A pixel và B giấy xếp lớp.
- Xong khi: có 6 check sheet và ảnh chụp lab đặt cạnh nhau trong `docs/agents/agy.md`, chờ người dùng chọn.

**G2 · Sổ tay style: `assets/stacks/STYLE.md`.**
- Mỗi thành phố một bảng màu 3–4 màu, lấy gốc từ `--d1`…`--d8` trong tokens:
  - Hưng Yên: nâu đất và rêu;
  - Thanh Hóa: đá xanh xám;
  - Cần Thơ: xanh sông và cam trái cây;
  - Huế: tím Huế và vàng cung đình;
  - Hải Phòng: vàng nhà hát và xanh cảng;
  - Đà Nẵng: vàng rồng và xanh biển;
  - TP.HCM: gạch đỏ và kính xanh;
  - Hà Nội: xanh hồ và đỏ ngói.
- Quy ước chung:
  - ánh sáng chiếu từ trên, bên trái;
  - viền màu `--ink`;
  - cùng một tỉ lệ: 1 tầng nhà ≈ 6 lát;
  - kích thước theo nhóm: địa danh cỡ "detailed", 26–36 lát, khoảng 40–64px; nhà, quân cờ cỡ "chunky", 12–18 lát.

**G3 · 22 địa danh.**
- Làm theo thứ tự quận từ 1 đến 8. Mỗi asset gồm `src/<id>.png`, `<id>.json`, check sheet, và một dòng trong `SOURCES.md` (công cụ, prompt).
- Duyệt từng đợt 6 asset (cổng duyệt 2 sau đợt đầu).

**G4 · Ga, tiện ích, góc, nhà và khách sạn:** 12 asset.

**G5 · 6 quân cờ:** nhìn từ trên phải phân biệt được ngay ở cỡ 24px.

**G6 · Nội dung chữ: `content/vietnam.json`.**
- Schema:
  ```json
  { "tiles": { "1": { "name": "Làng Nôm", "human": "…" } },
    "cards": [ { "id": "gamble", "title": "Con bạc", "text": "…" } ],
    "hints": { "thanhhoa": "Người xưa nói: ai giữ đủ ba nơi này sẽ thành vua." } }
  ```
- Mỗi ô có 1 câu `human`, giọng giống các câu trong `src/core/board.js`: nhẹ, cụ thể, có hình ảnh.
- Kiểm tra đúng sự thật lịch sử và địa lý.
- Không dùng chữ có thể gây tranh cãi chính trị.
- Claude đọc file này khi tích hợp. Nếu file chưa có thì Claude dùng tên trong `MAP_VIETNAM.md`.

### Mẫu prompt ảnh 4 góc (Agy chỉnh theo từng asset)
```
Orthographic model sheet of <TÊN ĐỊA DANH, mô tả hình khối ngắn>, four views in ONE horizontal row,
left to right: TOP view (front facing down), SIDE view (facing left), FRONT view, BACK view.
Same scale and same baseline in every view, clear gaps between views, flat pure white background,
no perspective, no shadows on background, no text, no labels.
Style: <A: crisp pixel art, limited palette of 12 colours, 1px dark outline |
        B: flat cut-paper shapes, limited palette, soft watercolour texture inside shapes, thin ink outline>.
Palette: <3–4 mã màu của thành phố từ STYLE.md>. Light from top-left.
```
- Ảnh tạo ra phải được kiểm và sửa trước khi đưa vào `src/`: cắt đều 4 ô, chiều cao CẠNH = TRƯỚC = SAU, chiều rộng TRÊN = TRƯỚC.
- Hình có lỗ hoặc vòm thì tách thành nhiều phần, hoặc vẽ thẳng các lát bằng PIL.

## 5. Cổng duyệt với người dùng

| Cổng | Khi nào | Người dùng quyết |
|---|---|---|
| 1 | Xong G1 + C1–C4 | Kiểu A (pixel) hay B (giấy xếp lớp), hoặc chỉnh lại |
| 2 | Xong 6 địa danh đầu (Hưng Yên, Thanh Hóa) và đã gắn thử lên bàn | Đạt thì làm tiếp phần còn lại |
| 3 | Đủ 40 asset, đã tích hợp, đã chạy e2e | Phát hành 0.6.0 |

## 6. Thứ tự song song

```
Claude: 0.5.0 engine map VN + thẻ Vận mệnh ─────────────► merge dev ─► tích hợp art (0.6) ─► release
Codex:  C1 ─► C2 ─► C3 ─► C4 ─► (cổng 1) ─► C5 ─► C6 ───────────┘
Agy:    G1 (cần C1, C2) ─► (cổng 1) ─► G2 ─► G3 (đợt 1) ─► (cổng 2) ─► G3 còn lại ─► G4 ─► G5
        G6 (chữ) làm được ngay từ đầu, không phụ thuộc ai
```
- Agy làm G6 trong lúc chờ Codex xong C1–C2.
- Không ai đụng file của Claude, nên 0.5.0 và art chạy song song không xung đột.
