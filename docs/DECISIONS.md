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
