# Changelog — Phố Giấy

Mọi thay đổi đáng kể được ghi ở đây. Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/), đánh số theo [Semantic Versioning](https://semver.org/lang/vi/).
Quy trình phát hành và rollback: [`docs/RELEASE.md`](docs/RELEASE.md).

## [Chưa phát hành]

### Thêm
- `docs/ROADMAP.md`: kế hoạch từ 0.3.0 tới 1.0.0
- `docs/RELEASE.md`: đánh số phiên bản, nhánh, môi trường, phát hành, rollback
- `docs/DECISIONS.md`: nhật ký các quyết định lớn
- `CHANGELOG.md` (file này), gắn tag cho các phiên bản đã có

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

[Chưa phát hành]: https://github.com/NgHdc/HopeY/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/NgHdc/HopeY/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/NgHdc/HopeY/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/NgHdc/HopeY/releases/tag/v0.1.0
