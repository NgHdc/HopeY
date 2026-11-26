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
src/                    bản chơi trên web (index.html · style.css · game.js)
```

## Việc tiếp theo

- [ ] Trao đổi đất giữa người chơi, đấu giá khi không ai mua
- [x] Chơi online nhiều máy, có phòng riêng
- [ ] `docs/GAME_DESIGN.md`: cân bằng giá, thêm thẻ "Câu hỏi" & "Hàng xóm"

Phong cách gốc: `../Slide_Style_Guide_Swiss_Paper.md`.
