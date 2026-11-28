# ROADMAP — Phố Giấy

> Kế hoạch từ bản thử nghiệm hiện tại (v0.2.0) tới bản phát hành v1.0.0.
> Mỗi phiên bản có: **mục tiêu**, **việc cần làm**, **xong khi** (tiêu chí nghiệm thu). Chỉ chuyển sang phiên bản sau khi bản trước đạt "xong khi".
> Quy trình phát hành và rollback: [`RELEASE.md`](RELEASE.md) · Lịch sử thay đổi: [`../CHANGELOG.md`](../CHANGELOG.md) · Lý do các quyết định: [`DECISIONS.md`](DECISIONS.md)

---

## Tổng quan

| Phiên bản | Tên | Trọng tâm | Trạng thái |
|---|---|---|---|
| 0.1.x | Bản giấy nháp | Luật chơi cơ bản, chơi chung một máy | ✅ đã phát hành |
| 0.2.x | Mở cửa phòng | Chơi online, phòng riêng (PeerJS) | ✅ đã phát hành |
| 0.3.0 | Nền móng | Tách code, test, version, deploy có lưu trữ + rollback, chơi thử trên máy | ✅ đã phát hành |
| 0.4.0 | Giấy mới | Thiết kế lại toàn bộ UI theo mockup | ✅ **đang chạy** |
| 0.4.x | Giấy mới (tiếp) | Đồ họa từng ô, chỉnh style theo ý bạn | ⏭ tiếp theo |
| 0.5.0 | Dải đất | Nhiều map, map Việt Nam, bộ thẻ Vận mệnh, cơ chế ẩn Thanh Hóa | ✅ phát hành 2026-11-28 |
| 0.5.x | Luật đầy đủ | Trao đổi, đấu giá, tùy chỉnh luật | |
| 0.6.0 | Pixel | Giao diện pixel theo map, bản đồ vùng đất, nhân vật biết đi, quân trượt mượt | ✅ phát hành 2026-11-28 |
| 0.7.0 | Phòng bền | Kết nối ổn định, chuyển chủ phòng, chat, khán giả | 🔨 đang làm (TURN pending) |
| 0.8.0 | Mọi màn hình | Điện thoại, máy tính bảng, bàn phím, trợ năng | |
| 0.9.0 | Có hồn | Chuyển động, âm thanh, cảm giác khi chơi | |
| 0.10.0 | Beta | Cân bằng, chơi thử với người thật, sửa lỗi | |
| 1.0.0 | Phát hành | Trang giới thiệu, hướng dẫn, bản in giấy (print & play) | |

Thứ tự này có chủ đích: **làm nền móng (0.3) trước khi thiết kế lại (0.4)**. Có test, có bản lưu từng phiên bản và có rollback thì việc đập đi làm lại UI mới an toàn.

---

## 0.3.0 — Nền móng

**Mục tiêu:** code dễ sửa, mỗi phiên bản được lưu lại và chơi lại được, lỗi thì quay về bản cũ trong 2 phút.

### Cấu trúc code
- [x] Tách `src/game.js` (≈ 700 dòng) thành module ES:
  - `src/core/rules.js`: luật thuần (không DOM, không mạng): `applyAction(state, seat, action) → state + events`
  - `src/core/board.js`: dữ liệu 40 ô, quận, giá, bảng thuê
  - `src/core/cards.js`: bộ thẻ Câu hỏi / Hàng xóm
  - `src/net/peer.js`: phòng, kết nối, nối lại
  - `src/ui/*.js`: bàn cờ, thẻ, cột người chơi, sảnh
- [x] Bỏ `Math.random()` rải rác → một hàm `rng` có seed, để lặp lại được một ván khi tìm lỗi.
- [x] Trạng thái ván có `schemaVersion`; viết hàm `migrate(state)` khi đổi cấu trúc.

### Phiên bản & tương thích
- [x] Hằng `APP_VERSION` (ví dụ `0.3.0`) hiển thị ở chân trang và trong sảnh.
- [x] `PROTOCOL_VERSION`: khách khác phiên bản giao thức với chủ phòng → báo *"Phòng này dùng bản X, hãy tải lại trang"* thay vì lỗi ngầm.
- [x] Mã phòng peer có tiền tố theo giao thức (`phogiay-p2-…`), để bản cũ và bản mới không vào nhầm phòng của nhau.

### Môi trường dev
- [x] Script chạy server dev: `npm run dev` (hoặc `python -m http.server`), cổng cố định `5173`.
- [x] ~~Trang `src/dev.html`~~ → thay bằng **ván thử trên máy** (`src/?local=3`): một người điều khiển mọi ghế, không cần mạng. Thử online thật: 2 tab.
- [x] Nút debug (chỉ ở dev): đặt xúc xắc, cộng tiền, nhảy tới ô.

### Test tự động
- [x] Test luật bằng `node --test`: mua, thuê, cả quận ×2, xây đều, thế chấp, Trạm Nghỉ 3 lượt, 3 lần đôi, phá sản trả cho chủ nợ, thẻ di chuyển qua Nhà.
- [x] Test giả lập: bot chơi 300 ván (đặt `SIM_GAMES=1000` để chạy nhiều hơn) → không ván nào kẹt, trạng thái luôn hợp lệ.
- [x] Test online (đưa script kiểm thử 2 trình duyệt hiện có vào `tests/e2e/`): tạo phòng → vào phòng → chơi 5 vòng → hai máy có trạng thái giống nhau.
- [x] GitHub Actions chạy test ở mọi push / pull request.

### Deploy có lưu trữ & rollback (chi tiết ở `RELEASE.md`)
- [x] Workflow `deploy.yml`: dựng trang từ **các tag**, không từ nhánh:
  - `/` = phiên bản đang chọn làm bản chính (mặc định: tag mới nhất)
  - `/v/0.2.0/`, `/v/0.3.0/`, … = mọi phiên bản cũ vẫn chơi được
  - `/next/` = bản thử từ nhánh `dev`
- [x] Rollback: `deploy/current.txt` (lâu dài) hoặc chạy tay workflow với ô `current` (tạm thời).
- [x] Trang `/versions/`: danh sách phiên bản, ngày, tóm tắt thay đổi (đọc từ CHANGELOG).
- [x] Mỗi tag tạo một GitHub Release kèm ghi chú.

**Còn phải thử trên GitHub** (sau khi đổi Pages sang GitHub Actions): rollback 0.3.0 → 0.2.0 → 0.3.0.

**Xong khi:** test chạy xanh trên GitHub; rollback thử từ 0.3.0 về 0.2.0 và quay lại mất dưới 3 phút; `/v/0.2.0/` vẫn chơi được.

---

## 0.4.0 — Giấy mới (thiết kế lại UI + đồ họa)

**Mục tiêu:** mọi màn hình và hình vẽ đạt chuẩn `STYLE_GUIDE.md`, được thiết kế trước rồi mới code.

### Giai đoạn A — Thiết kế (chưa code)
- [x] **Kiểm kê UI hiện tại**: chụp mọi màn hình và trạng thái, ghi những chỗ chưa ổn.
- [ ] **Moodboard**: Swiss poster, bản đồ giấy, tem, vé tàu cũ, giấy kẻ ô; ảnh phố Việt cho 8 quận.
- [x] **Style guide v2** (bản nháp trên canvas, khung 01): lưới 8 px, thang chữ, nét 0.5 / 1 / 1.5, thành phần. Đề xuất font Inter + IBM Plex Mono + Noto Serif, chờ duyệt.
- [x] **Mockup độ trung thực cao** cho từng màn hình (canvas *Phố Giấy 0.4 — Mockup giao diện*, 10 khung):
  1. Trang chủ: tạo phòng / vào phòng
  2. Sảnh chờ: mã phòng, danh sách người, chọn quân cờ, chọn màu
  3. Bàn cờ: desktop 1440, laptop 1280, tablet 1024, điện thoại 390
  4. Cột người chơi: tiền, đất sở hữu, trạng thái
  5. Thẻ đất (đủ 3 loại: đất / ga / tiện ích), thẻ Câu hỏi, thẻ Hàng xóm, mặt sau thẻ
  6. Hộp thoại: mua, đấu giá, trao đổi, phá sản, xác nhận
  7. Màn hình kết thúc ván: người thắng, thống kê
  8. Trạng thái lỗi: mất kết nối, phòng không tồn tại, khác phiên bản
- [x] **Duyệt mockup**: đồng ý dùng làm nền (2026-11-27); style sẽ chỉnh dần ở các bản 0.4.x

### Giai đoạn B — Đồ họa → chuyển sang 0.4.x (sau khi bạn định hình style)
- [ ] Hình minh họa SVG cho **22 ô đất** (mỗi ô: 1 cảnh hình học + người que), **4 ga**, **2 tiện ích**, **4 ô góc**.
- [ ] Bộ **8 hoa văn quận** dạng SVG `<pattern>` (thay cho CSS gradient), dùng chung cho bàn cờ, thẻ và bản in.
- [ ] **Bản đồ thành phố** ở giữa bàn cờ: sông, đường, 8 quận, người que; nhà và phố hiện lên theo những gì người chơi xây.
- [ ] **6 quân cờ** vẽ lại kỹ hơn, có trạng thái "đang đến lượt".
- [ ] **Xúc xắc**, nhà, "phố", tiền đồng giấy (7 mệnh giá).
- [ ] Biểu tượng giao diện (lăn, mua, xây, thế chấp, trao đổi…) cùng nét vẽ, không dùng clip-art.
- [ ] Texture giấy thật (ảnh quét hoặc tự tạo), file nhẹ hơn 60 KB.

### Giai đoạn C — Code UI ✅ (0.4.0)
- [x] Viết lại CSS theo token v2 (`design/tokens.css` là nơi duy nhất để đổi style)
- [x] Trang đầu, sảnh chờ (chọn quân cờ), bàn cờ, tab Đất của tôi / Nhật ký, màn hình kết thúc, hộp thoại, trạng thái lỗi, bố cục điện thoại
- [ ] Bàn cờ vẽ bằng SVG, chữ xoay theo cạnh như bản in → 0.4.x
- [ ] So sánh ảnh chụp trước/sau tự động (visual regression) → 0.4.x

**Xong khi:** mọi màn hình khớp mockup; qua checklist mục 9 của `STYLE_GUIDE.md`; không có chữ dưới 10 px; tương phản ≥ 4.5:1.

---

## 0.5.0 — Dải đất

Thiết kế: `docs/MAP_VIETNAM.md`.

- [x] Nhiều map (`src/core/maps/`), chọn ở trang đầu và sảnh
- [x] Map Việt Nam: 8 thành phố, ô không phải đất đổi tên
- [x] Bộ thẻ Vận mệnh 16 lá: Bán nhà ngẫu nhiên, Hạ cấp, Vé giảm 50%, Máy bay, Con bạc, Sinh nhật, Thu thuế…
- [x] Cơ chế ẩn Vương quốc Thanh Hóa
- [x] Test từng thẻ, bot giả lập trên cả hai map
- [ ] Chơi thử trên `/next/` với 2 máy, rồi phát hành
- [ ] Hình minh họa địa danh (theo hướng nghệ thuật, làm sau)

## 0.5.x — Luật đầy đủ

- [ ] **Trao đổi**: đề nghị đổi đất + tiền + vé giữa 2 người; người kia chấp nhận / từ chối / trả giá.
- [ ] **Đấu giá** khi người dừng chân không mua: mọi người trả giá, có đồng hồ 10 giây.
- [ ] **Giới hạn nhà**: kho có 32 nhà và 12 phố, hết thì phải chờ.
- [ ] **Bộ thẻ đầy đủ**: 16 Câu hỏi + 16 Hàng xóm, viết theo giọng văn của style guide.
- [ ] **Tùy chỉnh luật** trong sảnh: tiền khởi đầu, lương qua Nhà, quỹ Công Viên (tiền phạt dồn vào giữa), giới hạn thời gian ván.
- [ ] **Chế độ ván ngắn**: hết giờ thì tính tài sản (tiền + đất + nhà).
- [ ] **Đồng hồ lượt** (tùy chọn): 60 giây, quá giờ thì tự kết thúc lượt.
- [ ] **Thống kê cuối ván**: ai thu nhiều tiền thuê nhất, ô được dừng nhiều nhất, biểu đồ tài sản theo vòng.

**Xong khi:** đủ luật để chơi một ván 4 người trọn vẹn không cần luật ngoài; test luật phủ mọi tình huống mới.

---

## 0.6.0 — Pixel ✅ phát hành 2026-11-28

Kế hoạch art: `docs/ART_PIPELINE.md`. Hoạt ảnh: `docs/HOSTING.md` mục 2.

- [x] Lớp quân riêng, trượt bằng `transform` (Giai đoạn A)
- [x] Theme pixel theo map: màu, nền lặp, khung 9 ô, icon ô, font VT323
- [x] Bản đồ pixel 2 bản (rực rỡ ở trang đầu, giấy cổ nhạt giữa bàn) cho cả 2 map
- [x] 12 nhân vật pixel: đứng, đi (quay mặt theo hướng), vui, buồn
- [ ] Nhân vật đứng đè lên tên ô; ô có 4+ người hơi chật (sửa ở 0.6.x)

---

## 0.7.0 — Phòng bền (đang làm, kế hoạch 2026-11-28)

**Mục tiêu:** chơi online với bạn bè không mất ván, thấy rõ ai đang ở đâu, nói chuyện được trong ván. Art tiếp tục song song: biểu cảm pixel và địa danh đợt 1.

**Xong khi:**
- ván 4 người, 45 phút, trên 2 mạng wifi khác nhau không mất ván;
- chủ phòng tắt trình duyệt giữa ván thì ván vẫn tiếp tục ở máy khác;
- người đến muộn xem được ván;
- test luật + e2e online xanh, có e2e mới cho chuyển chủ phòng và khán giả.

### Claude (engine, mạng, ghép vào game)
| Mã | Việc | Ghi chú |
|---|---|---|
| P0 | Sửa từ 0.6.0: nhân vật không đè tên ô, ô đông người xếp gọn | `pieces.js`; dùng chỗ đứng U7 của Codex |
| P1 | **Kiểm tra trạng thái:** chủ phòng gửi mã băm kèm mỗi lượt; khách lệch thì xin bản đầy đủ | không đổi luật |
| P2 | **Chuyển chủ phòng:** chủ phòng mất > 15 giây thì khách có ghế nhỏ nhất đang online mở lại phòng (peer id theo `mã phòng + đời`), các máy khác tự nối sang | khó nhất; e2e riêng |
| P3 | **Khán giả:** vào sau khi ván đã bắt đầu thì xem, không chơi; danh sách khán giả ở cột bên | |
| P4 | **Sảnh:** chủ phòng đá người khỏi sảnh; khách đổi tên | |
| P5 | **Chat ngắn + biểu cảm** (vẫy tay, cười, "đắt quá!"…): biểu cảm hiện thành bong bóng trên đầu nhân vật | tăng `PROTOCOL_VERSION` lên 5 |
| P6 | Thông báo rõ: đang nối lại, chủ phòng vắng, phòng đã đóng, mạng chặn | phần mạng chặn đã xong trên `dev` |
| K2 | Ghép UI của Codex (U6–U8) và art của Agy (A7, A8, G3 đợt 1) vào game | sau cổng duyệt 3 |
| ⏸ P7 | **TURN** (chơi qua 4G): `src/net/ice.js` đã sẵn chỗ cắm | **PENDING**: chờ người dùng tạo khóa Metered Open Relay |

### Codex (giao diện, `design/`, `src/render/`)
| Mã | Việc |
|---|---|
| U5 | Dọn lab: khung điện thoại trống, nút đổi bản đồ rực rỡ / giấy cổ, font VT323 |
| U6 | Giao diện xã hội trong lab: khung chat, thanh biểu cảm, bong bóng trên đầu nhân vật, huy hiệu chủ phòng / khán giả, chip trạng thái mạng |
| U7 | Chỗ đứng cho nhân vật trong ô: CSS ô chừa dải riêng cho quân, không che tên; thử 1–6 người một ô, desktop và 390px |
| U8 | `src/render/landmark.js`: hình địa danh (sprite stacking) trên thẻ đất, có test + lab |

### Agy (ảnh, `assets/`)
| Mã | Việc |
|---|---|
| A7 | 10 biểu cảm pixel 16×16 + khung bong bóng 9 ô, cho 2 vùng đất |
| A8 | Icon trạng thái mạng 16×16 (online, đang nối, mất kết nối, chủ phòng, khán giả) + favicon pixel cho trang |
| G3a | Địa danh đợt 1: 6 địa danh Dải đất tiếp theo (quận 1–3 trừ 3 cái G1 đã có), kiểu A · Pixel theo `STYLE.md` |

### Thứ tự và cổng duyệt
```
Claude: P0 ─► P1 ─► P6 ─► P4 ─► P3 ─► P2 ─────────────► K2 ─► P5 ─► phát hành 0.7.0
Codex:  U5 ─► U7 (Claude cần cho P0) ─► U6 ─► U8 ─┐
Agy:    A8 ─► A7 ─────────────────────────────────┼─► (cổng duyệt 3: người dùng xem lab xã hội + địa danh)
        G3a ──────────────────────────────────────┘
TURN (P7): cắm vào bất cứ lúc nào người dùng gửi khóa.
```
- **Cổng duyệt 3:** người dùng xem `design/lab/social.html` (chat, biểu cảm, bong bóng) và các địa danh G3a trên thẻ đất.
- Trước khi phát hành: chơi thử thật trên 2 máy ở 2 mạng khác nhau.

---

## 0.8.0 — Mọi màn hình

- [ ] Bố cục điện thoại dọc: bàn cờ phóng to / thu nhỏ, khay hành động dưới cùng.
- [ ] Cử chỉ chạm: chụm để phóng to, chạm giữ để xem thẻ đất.
- [ ] Bàn phím: chơi trọn ván không cần chuột; thứ tự Tab hợp lý.
- [ ] Trình đọc màn hình: thông báo lượt, xúc xắc, tiền (aria-live).
- [ ] Kiểm tra mù màu (deuteranopia / protanopia / tritanopia) cho 8 quận.
- [ ] (tùy chọn) Tiếng Anh.

**Xong khi:** chơi trọn ván trên iPhone SE và Android tầm trung; chấm Lighthouse Accessibility ≥ 95.

---

## 0.9.0 — Có hồn

- [ ] Xúc xắc lăn (lật mặt 2D, ≤ 600 ms), quân cờ nhảy từng ô.
- [ ] Hiệu ứng tiền bay giữa người chơi khi trả tiền thuê.
- [ ] Nhà mọc lên trên bản đồ giữa bàn cờ.
- [ ] Âm thanh nhẹ: giấy, xúc xắc gỗ, chuông xe đạp, tiếng chợ; có nút tắt.
- [ ] Tôn trọng `prefers-reduced-motion`.

**Xong khi:** người chơi thử nói "vui tay"; không giật trên máy yếu (60 fps trên laptop phổ thông).

---

## 0.10.0 — Beta

- [ ] Cân bằng giá và tiền thuê bằng giả lập 10 000 ván bot (độ dài ván, tỉ lệ thắng theo thứ tự đi).
- [ ] 5 buổi chơi thử với người thật, ghi lại vấn đề.
- [ ] Sửa toàn bộ lỗi mức cao; đóng băng tính năng.
- [ ] Trang báo lỗi (link tới GitHub Issues kèm phiên bản và mã phòng).

**Xong khi:** một ván 4 người trung bình 45–75 phút; không còn lỗi mức cao.

---

## 1.0.0 — Phát hành

- [ ] Trang giới thiệu: câu chuyện của Phố Giấy, ảnh chụp, nút "Tạo phòng".
- [ ] Hướng dẫn chơi có hình (không dài quá 1 trang).
- [ ] **Print & play**: PDF bàn cờ 500 × 500 mm chia trang A4/A3, thẻ 63 × 88 mm, tiền: in ra chơi bằng giấy được.
- [ ] Credit: ảnh, font, thư viện.
- [ ] Tên miền riêng (tùy chọn).

---

## Ngoài phạm vi (chưa làm)

Tài khoản người dùng, bảng xếp hạng, bot AI chơi cùng, app trên kho ứng dụng. Xem lại sau 1.0.
