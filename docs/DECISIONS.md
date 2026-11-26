# DECISIONS — Nhật ký quyết định

> Mỗi quyết định lớn: bối cảnh, đã chọn gì, vì sao, đánh đổi. Không xóa mục cũ; nếu đổi ý thì thêm mục mới ghi "thay thế #N".

---

### #1 — Tên riêng "Phố Giấy", không dùng tên Monopoly · 2026-11-26 · v0.1.0
**Bối cảnh:** ý tưởng ban đầu là "monopoly game".
**Quyết định:** giữ thể loại mua – bán – xây, nhưng tên, ô góc, thẻ, hình và tiền đều tự thiết kế.
**Vì sao:** Monopoly là thương hiệu có chủ; game riêng thì tự do phát hành và có bản sắc ("Mình muốn sống ở một con phố như thế nào?").

### #2 — Phong cách Swiss Paper · 2026-11-26 · v0.1.0
**Quyết định:** chuyển thể `Slide_Style_Guide_Swiss_Paper.md` thành `docs/STYLE_GUIDE.md`. Mỗi quận là màu dịu kèm hoa văn, không dùng dải màu đặc ở đầu thẻ.
**Vì sao:** đồng bộ với dự án *How to live*. Có hoa văn thì người mù màu vẫn phân biệt được quận.

### #3 — Noto Serif thay Georgia cho chữ nghiêng · 2026-11-26 · v0.1.0
**Bối cảnh:** Georgia nghiêng trên Windows hiển thị "ồ, ề" thành dấu rời.
**Quyết định:** `"Noto Serif", Cambria, Georgia, serif`.
**Đánh đổi:** cần tải font từ Google Fonts. Không có mạng thì dùng Cambria thay thế.

### #4 — Web tĩnh, không bước build · 2026-11-26 · v0.1.0
**Quyết định:** HTML/CSS/JS thuần, deploy bằng GitHub Pages.
**Vì sao:** miễn phí, mở là chạy, dễ cho người mới đóng góp.
**Xem lại ở:** 0.3.0, khi tách module có thể vẫn không cần build (ES modules chạy thẳng trên trình duyệt).

### #5 — Online bằng PeerJS (WebRTC), máy chủ phòng giữ luật · 2026-11-26 · v0.2.0
**Bối cảnh:** muốn mỗi người một máy, có phòng riêng, nhưng trang là web tĩnh.
**Các lựa chọn:** Firebase / Supabase (cần tạo tài khoản và lưu khóa), server riêng (tốn tiền, phải vận hành), PeerJS (miễn phí, không cần đăng ký).
**Quyết định:** PeerJS. Máy tạo phòng là "chủ" và chạy luật, các máy khác gửi thao tác lên và nhận lại trạng thái.
**Đánh đổi:** chủ phòng phải mở trang suốt ván; vài mạng chặn WebRTC; chủ phòng về lý thuyết có thể gian lận (chấp nhận được khi chơi với bạn bè).
**Xem lại ở:** 0.6.0 (TURN dự phòng, chuyển chủ phòng).

### #6 — Nền móng trước, thiết kế lại sau · 2026-11-26
**Quyết định:** 0.3.0 làm test, phiên bản, deploy có lưu trữ và rollback; 0.4.0 mới thiết kế lại UI.
**Vì sao:** thiết kế lại là đập đi làm lại nhiều thứ. Có test và có đường lui thì làm mạnh tay mà không sợ hỏng bản đang chạy.

### #7 — "Ván thử trên máy" thay cho trang dev nhiều khung · 2026-11-26 · v0.3.0
**Bối cảnh:** muốn sửa luật hay UI thì phải tạo phòng và chờ người vào; vào game rồi lại không có lối thoát rõ ràng.
**Quyết định:** thêm chế độ `local`: một máy điều khiển mọi ghế, cùng bộ luật với online, có công cụ dev. Luôn có nút Thoát / Rời phòng.
**Vì sao:** vào bàn cờ bằng một cú nhấp, không cần mạng. Luật dùng chung nên thử ở local cũng là thử luật online.

### #8 — Luật thuần + sự kiện, hiệu ứng chạy riêng · 2026-11-26 · v0.3.0
**Quyết định:** `applyAction(state, seat, action)` trả về trạng thái mới + danh sách sự kiện (đi, nhảy, rút thẻ, trả tiền). Chủ phòng gửi cả hai; mỗi máy tự chạy hiệu ứng.
**Vì sao:** test được bằng Node không cần trình duyệt; số ngẫu nhiên có seed nên lặp lại được lỗi; không còn trạng thái "đang chạy dở" bị gửi qua mạng.

### #9 — Deploy từ tag, rollback bằng `deploy/current.txt` · 2026-11-26 · v0.3.0
**Quyết định:** GitHub Actions dựng trang từ mọi tag (`/v/X.Y.Z/`), bản chính theo `deploy/current.txt` (`latest` hoặc một tag).
**Vì sao:** rollback chỉ là sửa một dòng trên web GitHub, không cần biết git; mọi bản cũ vẫn chơi được nên dễ so sánh khi thiết kế lại.
**Đánh đổi:** môi trường `github-pages` chỉ cho deploy từ `main`, nên tag và nhánh `dev` gọi Deploy gián tiếp qua workflow Release.

### #10 — Đưa mockup 0.4 vào game trước, chỉnh style sau · 2026-11-27 · v0.4.0
**Bối cảnh:** bạn muốn dùng bản thiết kế "Giấy mới" ngay và sẽ định hình style dần về sau.
**Quyết định:** code giao diện theo mockup; mọi màu, font, cỡ chữ, khoảng cách gom vào `design/tokens.css`, `src/style.css` chỉ dùng biến. Đồ họa từng ô (giai đoạn B) để sang 0.4.x.
**Vì sao:** đổi style về sau chỉ cần sửa một file, không đụng tới luật hay bố cục.

### #11 — Inter + IBM Plex Mono thay Arial + Courier New · 2026-11-27 · v0.4.0 (thay một phần #3)
**Quyết định:** chữ chính Inter, nhãn và số IBM Plex Mono, chữ nghiêng vẫn Noto Serif (#3).
**Vì sao:** cả ba đủ dấu tiếng Việt, đều nét, đọc rõ ở cỡ 10–12 px trên màn hình. Courier New quá mảnh, Arial thiếu nhịp Swiss.
**Đánh đổi:** cần tải font Google; không có mạng thì rơi về Arial / Courier New.
