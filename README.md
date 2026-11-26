# Phố Giấy

Board game mua – bán – xây phố (cùng thể loại với Monopoly), 2–6 người, vẽ theo phong cách **Swiss Paper**: giấy kem, hairline mực, hình học tối giản, người que nhỏ ở mọi nơi.

> Câu hỏi của game: *"Mình muốn sống ở một con phố như thế nào?"*

Tên, bàn cờ, thẻ, hình và luật chi tiết là của riêng dự án — không dùng tên, logo hay hình ảnh của Monopoly.

## Chơi

Mở `src/index.html` bằng trình duyệt (bấm đúp là được, không cần cài gì). 2–6 người chơi chung một máy, ván tự lưu trong trình duyệt.

- Bắt đầu 1500 ₫g, đi qua **Nhà** nhận 200 ₫g.
- Dừng ở đất chưa có chủ → mua hoặc bỏ qua; đất có chủ → trả tiền thuê (gấp đôi nếu chủ có cả quận).
- Có cả quận → bấm vào ô của mình để xây nhà (tối đa 4 nhà rồi lên **phố**), xây đều trong quận.
- Thiếu tiền → bán nhà, thế chấp; vẫn âm → phá sản. Người cuối cùng còn lại giữ được phố.
- **Trạm Nghỉ**: lăn đôi, trả 50 ₫g hoặc dùng vé; sau 3 lần thử phải trả. Lăn đôi 3 lần liền hoặc vào **Lạc Đường** → về Trạm Nghỉ.
- Phím tắt: `Space` lăn · `B` mua · `E` kết thúc lượt.

## Cấu trúc

```
docs/STYLE_GUIDE.md     hệ thiết kế: màu, chữ, bàn cờ, thẻ, tiền, UI
design/tokens.css       token màu / chữ dùng trong code
assets/photos/          ảnh thật (có credit)
assets/illustrations/   hình SVG trừu tượng
src/                    bản chơi trên web (index.html · style.css · game.js)
```

## Việc tiếp theo

- [x] Prototype web chơi chung một máy
- [ ] Trao đổi đất giữa người chơi, đấu giá khi không ai mua
- [ ] Chơi online nhiều máy
- [ ] `docs/GAME_DESIGN.md`: cân bằng giá, thêm thẻ "Câu hỏi" & "Hàng xóm"

Phong cách gốc: `../Slide_Style_Guide_Swiss_Paper.md`.
