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

## A3 · 6 cư dân Phố Giấy (`assets/avatars/classic/`, 2026-11-27)

Công cụ: SVG dựng bằng Python cùng hệ nét viền sticker dày (`#1B263B`), portrait 256×256 và token 64×64 đọc rõ ở 24px.

| ID | Tên | Màu đại diện | Mô tả tạo hình (portrait & token) |
|---|---|---|---|
| `chu-do` | Ông Lái Đò | `#1E74BA` (xanh sông) | Bác lái đò Bến Sông đội mũ rơm rộng vành đai đỏ, mái chèo gỗ phía sau; token nổi bật mũ rơm rộng vành. |
| `co-hoa` | Chị Hoa | `#BD3E6D` (hồng phấn) | Cô bán hoa Chợ Hoa tóc hai búi cài bông hoa 5 cánh trắng-vàng, bó hoa rực rỡ; token nổi bật bông hoa lớn cài tóc. |
| `tho-gom` | Bác Thợ Gốm | `#C7461E` (cam đất nung) | Thợ gốm Phố Nghề đeo tạp dề nâu, khăn trắng chấm cam buộc trán, bình gốm đất nung; token nổi bật khăn trắng buộc trán. |
| `be-den-long` | Bé Lồng Đèn | `#F0B41C` (vàng nắng) | Bé Phố Cổ hai búi tóc tròn viền đỏ, áo đỏ, chiếc đèn lồng đỏ tua vàng treo góc trên; token nổi bật hai búi tóc tròn đối xứng. |
| `co-vuon` | Chị Vườn Sen | `#1B7D44` (xanh lá vườn) | Cô làm vườn đeo kính tròn, mũ vải xanh có mầm lá non mọc trên đỉnh, chậu cây mầm; token nổi bật mầm lá xanh non trên mũ. |
| `hai-dang` | Bác Hải Đăng | `#24579E` (xanh biển sâu) | Người gác hải đăng Cảng Biển mặc áo khoác vàng, râu bạc gọn, đội mũ thủy thủ trắng sao vàng; token nổi bật mũ thủy thủ trắng sao vàng. |

## A2p · 6 sprite pixel Dải đất có hoạt ảnh (`assets/avatars/vietnam/`, 2026-11-28)

Công cụ: Python 3 + Pillow + NumPy (vẽ pixel gốc 32×32/khung, sheet 128×128 = 4 hàng `idle`/`walk`/`happy`/`sad`, chân dung nửa người 48×48, không khử răng cưa, viền ngoài 1px `--ink` `#1F1A2E`, mỗi sheet 2,0–2,7 KB < 20 KB). Màu áo 6 nhân vật khác biệt hoàn toàn theo `design/themes/palettes.md`.

| ID | Tên | Màu áo & đại diện | Tạo hình & lỗi đã sửa |
|---|---|---|---|
| `non-la` | Cô Hai | `#C93420` (đỏ son) | Áo bà ba đỏ son, nón lá vàng rơm, **quai nón nằm gọn dưới cằm** (không vắt ngang mặt), quang gánh tre + 2 thúng trái cây nhấp nhô khi bước đi. |
| `xich-lo` | Bác Ba | `#F0A814` (vàng hoa mai) | Áo sơ mi vàng mai, khăn trắng vắt vai, mũ cối xanh rêu, tay cầm ghi-đông xích lô có chuông vàng. |
| `ao-dai` | Minh Thư | `#D43F84` (hồng sen) | **Áo dài thật** cổ cao, tà dài tới gối xẻ hai bên để lộ **quần dài trắng**, tóc dài đen cài nơ; khi `walk` tà áo trước/sau bay về phía sau. |
| `ong-do` | Ông Đồ | `#177D8C` (xanh ngọc lam) | Áo the dài xanh ngọc viền vàng, khăn đóng, kính gọng tròn, chòm râu bạc nhọn dài dưới cằm, cầm bút lông chấm mực đỏ. |
| `ngu-dan` | Anh Năm | `#1D73B2` (xanh biển) | Áo sọc xanh biển – trắng, khăn đỏ buộc trán bay đuôi sau, mái chèo gỗ vắt chéo lưng. |
| `tha-dieu` | Bé Tí | `#1A7D43` (xanh lá mạ) | Áo thun xanh lá mạ sọc vàng + quần ngắn nâu, tóc chỏm dựng, dây thả con diều vàng-đỏ bay phía sau. |
