# Nguồn avatar nhân vật (`assets/avatars/`)

Mọi avatar trong thư mục này đều do dự án tự vẽ dạng SVG vector nét đậm (không dùng ảnh ngoài hay moodboard).

## Lý do chọn định dạng & phong cách (theo `docs/UI_REFRESH.md`)
- **Định dạng SVG:** nhẹ (~1–3 KB/file, xa dưới ngưỡng 40 KB), sắc nét tuyệt đối ở cả chân dung 256×256 lẫn quân cờ 20–28px trên bàn.
- **Phong cách nét vẽ:** vector hoạt hình rực rỡ, viền mực dày (`#1F1A2E` / `#1B263B`, kiểu sticker có bóng cứng lệch xuống), mảng màu phẳng tươi bão hòa, đồng bộ với sprite địa danh **kiểu A · Pixel** và hệ thành phần mới.
- **Phân biệt ở cỡ 24px:** mỗi nhân vật có đồng thời màu nền riêng biệt (6 màu cách xa nhau trên vòng tròn màu) và hình dáng mũ/phụ kiện đặc trưng đọc rõ ngay cả khi bỏ màu.

## A2 · 6 nhân vật Dải đất (`assets/avatars/vietnam/`, 2026-11-27)

Công cụ: SVG dựng bằng Python (script tạo hình vector chuẩn hóa kích thước 256×256 cho `portrait` và 64×64 tối giản cho `token`).

| ID | Tên | Màu đại diện | Mô tả tạo hình (portrait & token) |
|---|---|---|---|
| `non-la` | Cô Hai | `#C93420` (đỏ son) | Cô bán hàng rong đội nón lá vàng rơm, quai lụa đỏ, áo bà ba, đòn gánh tre ngang vai; token nổi bật hình nón lá rộng. |
| `xich-lo` | Bác Ba | `#F0A814` (vàng hoa mai) | Bác xích lô đội mũ cối xanh rêu, khăn trắng vắt vai, áo sơ mi xanh, nụ cười rạng rỡ; token nổi bật vòm mũ cối. |
| `ao-dai` | Minh Thư | `#D43F84` (hồng sen) | Nữ sinh tóc đen dài cài nơ hoa sen hồng-vàng, áo dài trắng cổ cao; token nổi bật tóc đen, nơ sáng và cổ áo dài trắng. |
| `ong-do` | Ông Đồ | `#177D8C` (xanh ngọc lam) | Ông đồ đội khăn đóng, kính tròn, chòm râu bạc dài, cầm bút lông cạnh tờ giấy đỏ câu đối; token nổi bật khăn đóng, kính tròn và râu trắng. |
| `ngu-dan` | Anh Năm | `#1D73B2` (xanh biển) | Ngư dân rám nắng buộc băng đô đỏ trên trán, áo sọc biển trắng-xanh, mái chèo và vành thuyền thúng phía sau; token nổi bật băng đô đỏ. |
| `tha-dieu` | Bé Tí | `#1A7D43` (xanh lá mạ) | Bé lanh lợi tóc chỏm dựng, áo vàng yếm xanh, cánh diều sáo vàng-đỏ bay phía sau; token nổi bật cánh diều vàng + chỏm tóc. |
