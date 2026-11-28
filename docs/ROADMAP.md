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
| 0.7.0 | Phòng bền | Kết nối ổn định, chat + mic, mỗi máy chỉ thấy phần của mình, khán giả | 🔨 đang làm (TURN pending, chuyển chủ phòng hoãn) |
| 0.8.0 | Xóm lạ | Chế độ mới: bàn cờ ẩn (sương mù), trò chơi hội làng, lệ làng, thắng bằng uy tín sau 12 vòng | 🔨 phần luật làm song song |
| 0.9.0 | Mọi màn hình | Điện thoại, máy tính bảng, bàn phím, trợ năng | |
| 0.10.0 | Có hồn | Chuyển động, âm thanh, cảm giác khi chơi | |
| 0.11.0 | Beta | Cân bằng, chơi thử với người thật, sửa lỗi | |
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

## Đánh giá lại kế hoạch (2026-11-28, chiều)

Kế hoạch 0.7.0 ban đầu được viết **trước** khi có chế độ Xóm lạ. Xem lại thì có 5 điểm cần đổi:
1. **Chuyển chủ phòng (P2) dễ thành việc bỏ đi.** Xóm lạ muốn mở cho người lạ thì phải chuyển máy chủ phòng lên Cloudflare (Giai đoạn B). Khi đó máy chủ không bao giờ "rời phòng", và toàn bộ code chuyển chủ phòng P2P thành thừa. P2 lại là việc khó nhất. → **Hoãn P2**, chờ quyết định Giai đoạn B. Thay bằng việc nhỏ: chủ phòng tải lại trang thì mở lại đúng ván (đã lưu sẵn), khách tự nối lại.
2. **Thiếu hẳn việc "mỗi máy chỉ nhận phần được thấy"**, dù Xóm lạ cần nó. → thêm **P9**, làm chung đợt đổi định dạng tin nhắn với P1 và chat.
3. **Phần luật của Xóm lạ không cần chờ mạng.** Đó là code luật thuần (`rules.js`), test và bot giả lập, chơi thử được ngay ở chế độ một máy. → **Làm song song từ bây giờ** (X1–X3), không đợi 0.7.0 phát hành.
4. **Codex và Agy đang có việc không phục vụ hướng mới:** dọn lab (U5), địa danh trên thẻ đất (U8). → Đổi sang **giao diện và art cho Xóm lạ**. Địa danh giữ lại nhưng đổi vai trò: hình hiện ra **lúc mở ô trong sương**, đó là phần thưởng của việc khám phá.
5. **Chơi một máy không giấu được lựa chọn kín** (đấu giá kín, đoán giá chợ). → cần màn hình **"chuyền máy"**: che màn hình, gọi tên người tiếp theo chọn.

Rủi ro lớn nhất vẫn là **TURN đang pending**: chưa có TURN thì mọi buổi chơi thử online phải dùng chung wifi. Tạo khóa Metered mất khoảng 5 phút và mở khóa được mọi buổi chơi thử.

---

## 0.7.0 — Phòng bền (đang làm)

**Mục tiêu:** chơi online với bạn bè ổn định, **chat và mở mic**, mỗi máy chỉ nhận phần được phép thấy (nền cho Xóm lạ).

**Xong khi:** ván 4 người 45 phút không mất ván (chủ phòng tải lại trang vẫn tiếp tục); chat, biểu cảm, mic chạy trên 2 mạng wifi khác nhau; test luật + e2e online xanh.

### Claude
| Mã | Việc | Ghi chú |
|---|---|---|
| P0 | Nhân vật không đè tên ô, ô đông xếp gọn | cần U7 của Codex |
| P9 | **Mỗi máy chỉ nhận phần được thấy**: chủ phòng gửi bản đã lọc cho từng ghế | mới; nền cho Xóm lạ |
| P1 | Mã băm trạng thái, khách lệch thì xin lại | cùng đợt với P9 |
| P5 | Chat ngắn + biểu cảm, bong bóng trên đầu nhân vật | `PROTOCOL_VERSION` 5 (P9, P1, P5, P8 đổi chung một lần) |
| P8 | Mở mic: tắt mặc định, giữ-để-nói, vòng sáng người đang nói | |
| P3 | Khán giả: xem bản công khai của ván | nhỏ, nhờ có P9 |
| P4 | Sảnh: đá người, đổi tên | |
| P6 | Thông báo trạng thái mạng | gần xong trên `dev` |
| P10 | Chủ phòng tải lại trang thì mở lại đúng ván, khách tự nối lại | thay cho P2 |
| K2 | Ghép giao diện xã hội (U6) và art (A7, A8) | sau cổng duyệt 3 |
| ⏸ P2 | Chuyển chủ phòng P2P | **hoãn**: chờ quyết định Giai đoạn B |
| ⏸ P7 | TURN | **pending**: chờ khóa Metered |

---

## 0.8.0 — Xóm lạ (thiết kế: `docs/XOM_LA.md`, đã chốt phần lớn)

Chế độ mới bên cạnh cờ tỷ phú cổ điển. **Phần luật làm song song với 0.7.0**, chơi thử một máy trước; phát hành sau 0.7.0.

### Claude (luật, bot, ghép vào game)
| Mã | Việc |
|---|---|
| X1 | **Bàn ẩn:** xáo 36 ô theo seed (ràng buộc: cùng quận gần nhau, ô hội làng rải đều), 4–6 ô lạ mỗi ván, ô chỉ mở khi dừng chân, thưởng khai hoang + quyền mua trước |
| X2 | **Chọn cách đi** (tổng hoặc một con xúc xắc) + **12 vòng, chấm uy tín**, không loại ai ("đi làm thuê"); nhà tính 1,2 lần |
| X3 | **Hội làng**: phase lựa chọn kín cùng lúc (chung cho mọi trò) + 3 trò: đấu giá kín, bầu cua, đoán giá chợ |
| X4 | **Bot theo 4 kiểu người chơi** (Địa chủ, Liều, Thám tử, ngẫu nhiên) + giả lập 1 000 ván: đo độ dài ván, tỉ lệ thắng mỗi kiểu, số ô mở mỗi ván |
| X5 | Công tắc chế độ trong sảnh + màn hình chuyền máy (chơi một máy) |
| K3 | Ghép giao diện Xóm lạ (U9) và art (A9) |
| X6 | Lệ làng (bước 2) — sau buổi chơi thử đầu tiên |

**Xong bước 1 khi:** ván 12 vòng 3–4 người dưới 40 phút; không kiểu bot nào thắng quá 40%; một buổi chơi thử thật với bạn bè có mic.

---

## 0.9.0 — Mọi màn hình

- [ ] Bố cục điện thoại dọc: bàn cờ phóng to / thu nhỏ, khay hành động dưới cùng.
- [ ] Cử chỉ chạm: chụm để phóng to, chạm giữ để xem thẻ đất.
- [ ] Bàn phím: chơi trọn ván không cần chuột; thứ tự Tab hợp lý.
- [ ] Trình đọc màn hình: thông báo lượt, xúc xắc, tiền (aria-live).
- [ ] Kiểm tra mù màu (deuteranopia / protanopia / tritanopia) cho 8 quận.
- [ ] (tùy chọn) Tiếng Anh.

**Xong khi:** chơi trọn ván trên iPhone SE và Android tầm trung; chấm Lighthouse Accessibility ≥ 95.

---

## 0.10.0 — Có hồn

- [ ] Xúc xắc lăn (lật mặt 2D, ≤ 600 ms), quân cờ nhảy từng ô.
- [ ] Hiệu ứng tiền bay giữa người chơi khi trả tiền thuê.
- [ ] Nhà mọc lên trên bản đồ giữa bàn cờ.
- [ ] Âm thanh nhẹ: giấy, xúc xắc gỗ, chuông xe đạp, tiếng chợ; có nút tắt.
- [ ] Tôn trọng `prefers-reduced-motion`.

**Xong khi:** người chơi thử nói "vui tay"; không giật trên máy yếu (60 fps trên laptop phổ thông).

---

## 0.11.0 — Beta

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
