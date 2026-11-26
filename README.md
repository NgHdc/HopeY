# Phố Giấy

Board game mua – bán – xây phố (cùng thể loại với Monopoly), 2–6 người, vẽ theo phong cách **Swiss Paper**: giấy kem, hairline mực, hình học tối giản, người que nhỏ ở mọi nơi.

> Câu hỏi của game: *"Mình muốn sống ở một con phố như thế nào?"*

Tên, bàn cờ, thẻ, hình và luật chi tiết là của riêng dự án — không dùng tên, logo hay hình ảnh của Monopoly.

## Chơi online

Mở **https://nghdc.github.io/HopeY/**, mỗi người chơi trên máy của mình, 2–6 người.

1. Một người nhập tên → **Tạo phòng mới** → nhận mã phòng 5 ký tự và một link.
2. Gửi link (hoặc mã) cho bạn bè → họ mở trên máy mình, nhập tên → **Vào phòng**.
3. Đủ người, chủ phòng bấm **Bắt đầu ván**.

Cách hoạt động: các máy nối thẳng với nhau qua WebRTC (thư viện PeerJS, không cần server riêng). Máy **chủ phòng** giữ luật và trạng thái ván, nên chủ phòng phải để trang mở suốt ván. Lỡ tải lại trang thì mọi người tự nối lại, ván vẫn còn (lưu trên máy chủ phòng). Người chơi rớt mạng thì vào lại bằng đúng link cũ trong cùng tab; nếu không quay lại, chủ phòng có thể cho họ rời ván khi tới lượt họ.

Lưu ý: vài mạng công ty/trường học chặn WebRTC, khi đó không vào được phòng. Thử bằng 4G nếu gặp lỗi.

## Luật

- Bắt đầu 1500 ₫g, đi qua **Nhà** nhận 200 ₫g.
- Dừng ở đất chưa có chủ → mua hoặc bỏ qua; đất có chủ → trả tiền thuê (gấp đôi nếu chủ có cả quận).
- Có cả quận → bấm vào ô của mình để xây nhà (tối đa 4 nhà rồi lên **phố**), xây đều trong quận.
- Thiếu tiền → bán nhà, thế chấp; vẫn âm → phá sản. Người cuối cùng còn lại giữ được phố.
- **Trạm Nghỉ**: lăn đôi, trả 50 ₫g hoặc dùng vé; sau 3 lần thử phải trả. Lăn đôi 3 lần liền hoặc vào **Lạc Đường** → về Trạm Nghỉ.
- Phím tắt (khi tới lượt bạn): `Space` lăn · `B` mua · `E` kết thúc lượt.

## Cấu trúc

```
docs/STYLE_GUIDE.md     hệ thiết kế: màu, chữ, bàn cờ, thẻ, tiền, UI
design/tokens.css       token màu / chữ dùng trong code
assets/photos/          ảnh thật (có credit)
assets/illustrations/   hình SVG trừu tượng
src/                    game web: core/ (luật) · net/ (online) · ui/ (vẽ) · main.js
tests/                  test luật, giả lập, e2e trình duyệt
scripts/                dựng trang deploy, trang phiên bản
deploy/current.txt      bản chính đang chạy (latest hoặc một tag) → rollback
```

## Kế hoạch & lịch sử

- [`docs/ROADMAP.md`](docs/ROADMAP.md): các phiên bản từ 0.3.0 tới 1.0.0
- [`CHANGELOG.md`](CHANGELOG.md): thay đổi của từng phiên bản
- [`docs/RELEASE.md`](docs/RELEASE.md): chạy bản dev, phát hành, **rollback**
- Mọi phiên bản (chơi được): https://nghdc.github.io/HopeY/versions/
- [`docs/DECISIONS.md`](docs/DECISIONS.md): các quyết định lớn và lý do

## Chạy trên máy (bản dev)

```bash
npm run dev       # hoặc: python -m http.server 5173 --bind 127.0.0.1
```

- **Thử nhanh không cần phòng:** http://127.0.0.1:5173/src/?local=3 (bạn điều khiển cả 3 người, có công cụ dev)
- Trang đầu: http://127.0.0.1:5173/src/
- Test: `npm test` · kiểm thử trình duyệt: `npm run e2e`

**Đổi style** (màu, font, cỡ chữ, khoảng cách): chỉ sửa `design/tokens.css`, tải lại trang là thấy.

Phong cách gốc: `../Slide_Style_Guide_Swiss_Paper.md`.
