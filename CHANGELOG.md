# Changelog — Phố Giấy

Mọi thay đổi đáng kể được ghi ở đây. Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/), đánh số theo [Semantic Versioning](https://semver.org/lang/vi/).
Quy trình phát hành và rollback: [`docs/RELEASE.md`](docs/RELEASE.md).

## [Chưa phát hành]

## [0.4.0] — 2026-11-27 · Giấy mới

### Thêm
- Giao diện mới theo mockup "Giấy mới": trang đầu 50/50 với bản đồ phố, sảnh chờ có mã phòng lớn và 6 ghế, bàn cờ có cột lượt chơi gọn hơn
- **Chọn quân cờ** trong sảnh chờ (mỗi người một quân, không trùng)
- Tab **Đất của tôi**: xây nhà, bán nhà, thế chấp, chuộc ngay trong danh sách đất
- Tab **Nhật ký**; dãy ô màu cho biết mỗi người có đất ở quận nào
- Khi đang nợ: khung báo số tiền thiếu và chỉ cách xoay xở
- **Màn hình kết thúc ván**: người thắng, tài sản, tiền thuê thu được, ô được dừng nhiều nhất, biểu đồ tài sản theo vòng, thứ tự rời phố
- Hộp thoại riêng (rời phòng, phá sản, cho người rớt mạng rời ván, luật chơi) thay cho hộp `confirm` của trình duyệt
- Dải báo khi mất kết nối với chủ phòng; trang lỗi khác phiên bản có bảng so sánh
- Bố cục điện thoại: bàn cờ thu nhỏ, nút hành động dính ở đáy màn hình
- Phím S để bỏ qua khi được hỏi mua

### Đổi
- Font: Inter (chữ chính) và IBM Plex Mono (nhãn, số) thay Arial và Courier New; vẫn dùng Noto Serif nghiêng
- `design/tokens.css` v2 là **nơi duy nhất** để đổi màu, font, cỡ chữ, khoảng cách; `src/style.css` chỉ dùng biến
- Giao thức online v3 (thêm chọn quân cờ); trạng thái ván schema v2 (thêm thống kê); ván 0.3 vẫn mở được
- Giả lập trong `npm test` giảm còn 120 ván cho nhanh (đặt `SIM_GAMES` để chạy nhiều hơn)

## [0.3.0] — 2026-11-26 · Nền móng

### Thêm
- **Chơi thử trên một máy**: vào thẳng bàn cờ, bạn điều khiển mọi người chơi, không cần tạo phòng (nút "Chơi thử ngay" ở trang đầu, hoặc mở `src/?local=3`)
- **Công cụ dev** trong ván thử: đặt xúc xắc, cộng/trừ tiền, nhảy tới ô, nhận đất / cả quận
- Nút **Thoát ván / Rời phòng** luôn hiện ở đầu cột bên phải
- Số phiên bản ở chân trang; khách khác phiên bản với chủ phòng được báo rõ thay vì lỗi ngầm
- Test tự động: 16 test luật + giả lập 300 ván bot (`npm test`); kiểm thử trình duyệt thật cho ván thử và online 2 máy (`npm run e2e`)
- GitHub Actions: chạy test mỗi lần push; deploy lưu mọi phiên bản ở `/v/X.Y.Z/`, bản thử ở `/next/`, trang `/versions/`; tự tạo GitHub Release từ CHANGELOG
- Rollback bản chính bằng `deploy/current.txt` hoặc chạy tay workflow Deploy
- `docs/ROADMAP.md`, `docs/RELEASE.md`, `docs/DECISIONS.md`, `CHANGELOG.md`

### Đổi
- Tách `src/game.js` thành module: `core/` (luật thuần, có seed), `net/` (PeerJS), `ui/` (vẽ), `main.js` (điều phối)
- Luật chạy tức thì; hiệu ứng quân cờ đi từng ô chạy riêng trên mỗi máy theo sự kiện
- Giao thức online v2 (mã phòng dạng `phogiay-p2-…`): bản 0.2 và 0.3 không vào nhầm phòng của nhau
- Cần chạy qua server (`npm run dev`), không mở thẳng file được nữa (ES modules)

### Sửa
- Thao tác gửi lên khi quân cờ đang đi có thể bị áp vào trạng thái cũ

## [0.2.0] — 2026-11-26 · Mở cửa phòng

### Thêm
- Chơi online, mỗi người một máy, 2–6 người, qua PeerJS (WebRTC), không cần server riêng
- Tạo phòng nhận mã 5 ký tự và link; vào phòng bằng link hoặc mã
- Sảnh chờ: danh sách người đã vào, chủ phòng bấm bắt đầu
- Máy chủ phòng giữ luật và lưu ván; tự nối lại khi tải lại trang hoặc rớt mạng
- Chủ phòng có thể cho người mất kết nối rời ván

### Bỏ
- Chế độ chơi chung trên một máy

## [0.1.1] — 2026-11-26

### Thêm
- Trang gốc tự chuyển vào game (cho GitHub Pages), file `.nojekyll`

## [0.1.0] — 2026-11-26 · Bản giấy nháp

### Thêm
- `docs/STYLE_GUIDE.md`: phong cách Swiss Paper chuyển thể cho board game (8 quận màu + hoa văn, bàn cờ, thẻ, tiền, giao diện)
- `design/tokens.css`: token màu và chữ
- Game web chơi chung một máy: 40 ô, 22 ô đất / 8 quận, 4 ga, 2 tiện ích, thẻ Câu hỏi và Hàng xóm, xây nhà / phố, thế chấp, Trạm Nghỉ, phá sản; tự lưu ván

### Đổi
- Chữ nghiêng dùng Noto Serif thay Georgia (Georgia trên Windows lỗi dấu tiếng Việt)

[Chưa phát hành]: https://github.com/NgHdc/HopeY/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/NgHdc/HopeY/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/NgHdc/HopeY/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/NgHdc/HopeY/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/NgHdc/HopeY/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/NgHdc/HopeY/releases/tag/v0.1.0
