# Nguồn avatar nhân vật (`assets/avatars/`)

Mọi avatar trong thư mục này đều do dự án tự vẽ dạng **sprite pixel 2D có hoạt ảnh** ở kích thước gốc (32×32/khung, sheet 128×128, chân dung 48×48, nền trong suốt, không khử răng cưa, viền ngoài 1px `--ink`, mỗi sheet ~2,0–2,6 KB < 20 KB). Không dùng ảnh của tác giả bên ngoài.
*(Các bản avatar SVG vector cũ của A2/A3 đã được gỡ bỏ theo kế hoạch A3p.)*

## Công cụ & quy chuẩn chung
- **Công cụ:** Python 3 + Pillow + NumPy, vẽ từng pixel theo mảng RGBA từ bảng màu `design/themes/palettes.md`.
- **Cấu trúc sheet `<id>.png` (128×128 = 4×4 ô 32×32):**
  - Hàng 0: `idle` (4 khung, 4 fps) — đứng thở, chớp mắt.
  - Hàng 1: `walk` (4 khung, 8 fps) — bước đi quay phải (lật ngang là đi trái).
  - Hàng 2: `happy` (4 khung, 6 fps) — nhảy vui, giơ tay, lấp lánh.
  - Hàng 3: `sad` (3 khung, 4 fps) — cúi đầu, giọt mồ hôi rơi.

## A2p · 6 sprite Dải đất (`assets/avatars/vietnam/`, 2026-11-28)

| ID | Tên | Màu áo & đại diện | Tạo hình |
|---|---|---|---|
| `non-la` | Cô Hai | `#C93420` (đỏ son) | Áo bà ba đỏ son, nón lá vàng rơm, quai nón dưới cằm (không vắt ngang mặt), quang gánh tre + 2 thúng trái cây. |
| `xich-lo` | Bác Ba | `#F0A814` (vàng hoa mai) | Áo sơ mi vàng mai, khăn trắng vắt vai, mũ cối xanh rêu, ghi-đông xích lô có chuông vàng. |
| `ao-dai` | Minh Thư | `#D43F84` (hồng sen) | Áo dài hồng sen cổ cao, tà dài tới gối xẻ 2 bên lộ quần dài trắng, tóc dài đen cài nơ; tà áo bay rõ khi `walk`. |
| `ong-do` | Ông Đồ | `#177D8C` (xanh ngọc lam) | Áo the xanh ngọc viền vàng, khăn đóng, kính tròn, chòm râu bạc nhọn dưới cằm, cầm bút lông mực đỏ. |
| `ngu-dan` | Anh Năm | `#1D73B2` (xanh biển) | Áo sọc xanh biển – trắng, khăn đỏ buộc trán bay đuôi sau, mái chèo gỗ vắt chéo lưng. |
| `tha-dieu` | Bé Tí | `#1A7D43` (xanh lá mạ) | Áo thun xanh lá mạ sọc vàng + quần ngắn nâu, tóc chỏm dựng, dây thả con diều vàng-đỏ bay phía sau. |

## A3p · 6 sprite Phố Giấy (`assets/avatars/classic/`, 2026-11-28)

| ID | Tên | Màu áo & đại diện | Tạo hình |
|---|---|---|---|
| `chu-do` | Ông Lái Đò | `#1E74BA` (xanh sông) | Áo bà ba xanh sông, mũ rơm rộng vành đai đỏ, râu ngắn, mái chèo gỗ sau lưng. |
| `co-hoa` | Chị Hoa | `#BD3E6D` (hồng phấn) | Váy & tạp dề hồng phấn, tóc 2 búi cài hoa 5 cánh trắng-vàng, tay cầm bó hoa. |
| `tho-gom` | Bác Thợ Gốm | `#C7461E` (cam đất nung) | Áo cam đất nung + tạp dề nâu, khăn trắng chấm cam buộc trán, tay cầm bình gốm. |
| `be-den-long` | Bé Lồng Đèn | `#F0B41C` (vàng nắng) | Áo vàng nắng viền đỏ, 2 búi tóc tròn viền đỏ, tay xách đèn lồng đỏ sáng lung linh. |
| `co-vuon` | Chị Vườn Sen | `#1B7D44` (xanh lá vườn) | Áo & yếm xanh lá vườn, kính tròn, mũ vải xanh có mầm lá non mọc trên đỉnh. |
| `hai-dang` | Bác Hải Đăng | `#C73236` (đỏ – trắng hải đăng) | Áo sọc đỏ – trắng ngọn hải đăng (tách hẳn màu xanh của Ông Lái Đò), mũ thủy thủ trắng sao vàng, râu bạc gọn, đèn hiệu biển. |
