# Map Việt Nam: thiết kế màn chơi (bản nháp 1, 2026-11-27)

Nguồn: ý tưởng của người dùng (8 thành phố, bộ thẻ Vận mệnh, cơ chế ẩn Thanh Hóa).
File này chốt luật để code. Chỗ nào ý gốc còn mơ hồ thì ghi rõ cách hiểu đã chọn; đánh dấu **[mặc định]** là chỗ người dùng có thể đổi.

## 1. Bố cục 40 ô

Vị trí ô, giá và giá nhà giữ đúng như bàn hiện tại, chỉ đổi tên và nội dung. Nhờ vậy engine, bảng thuê và bot không phải cân lại.

8 thành phố xếp từ rẻ đến đắt, đúng thứ tự 8 quận. Nhóm đầu và nhóm cuối chỉ có 2 ô.

| Quận | Thành phố | Ô (giá) | Giá nhà |
|---|---|---|---|
| 1 | Hưng Yên | Làng Nôm (60) · Phố Hiến – Chùa Chuông (60) | 50 |
| 2 | Thanh Hóa ★ | Cầu Hàm Rồng (100) · Sầm Sơn – Hòn Trống Mái (100) · Thành Nhà Hồ (120) | 50 |
| 3 | Cần Thơ | Cầu Cần Thơ (140) · Bến Ninh Kiều (140) · Chợ nổi Cái Răng (160) | 100 |
| 4 | Huế | Cầu Trường Tiền (180) · Chùa Thiên Mụ (180) · Đại Nội – Ngọ Môn (200) | 100 |
| 5 | Hải Phòng | Đồ Sơn – Cát Bà (220) · Cảng Hải Phòng (220) · Nhà hát Lớn (240) | 150 |
| 6 | Đà Nẵng | Ngũ Hành Sơn – Sơn Trà (260) · Cầu Rồng (260) · Cầu Vàng (280) | 150 |
| 7 | TP. Hồ Chí Minh | Nhà thờ Đức Bà (300) · Chợ Bến Thành (300) · Landmark 81 (320) | 200 |
| 8 | Hà Nội | Văn Miếu (350) · Hồ Hoàn Kiếm – Tháp Rùa (400) | 200 |

Lý do xếp như vậy:
- **Hà Nội ở ô đắt nhất (39):** thủ đô, đúng vai "ô đắt nhất bàn".
- **Hưng Yên ở nhóm rẻ nhất:** có 3 địa danh nhưng nhóm chỉ có 2 ô, nên gộp Chùa Chuông vào Phố Hiến và bỏ Đền Chử Đồng Tử. Đền này có thể làm minh họa cho thẻ.
- **Hà Nội bỏ Lăng Chủ tịch và Hoàng thành:** không nên để lăng thành ô mua bán, xây khách sạn, cầm cố. Hoàng thành có thể dùng làm hình nền góc.
- **Thanh Hóa ở nhóm rẻ thứ hai:** cơ chế ẩn cần có cơ hội xảy ra. Mua đủ 3 ô hết 320, đạt được ngay giữa ván.

Ô không phải đất:

| Ô | Hiện tại | Map Việt Nam |
|---|---|---|
| 0 | Nhà | **Xuất phát**, nhận lương 200 |
| 5 · 15 · 25 · 35 | 4 ga | Ga Hà Nội · Ga Huế · Ga Đà Nẵng · Ga Sài Gòn |
| 12 · 28 | Điện, Giếng | Điện lực · Nước sạch |
| 4 | Phí chợ 150 | Trạm thu phí 150 |
| 38 | thuế | Phí đỗ xe phố cổ (giữ số tiền cũ) |
| 10 | Trạm nghỉ | Tù / chỉ ghé thăm |
| 20 | Công viên | Quán cà phê vỉa hè (nghỉ, không mất gì) |
| 30 | Lạc đường | Vào tù |
| 2 · 7 · 17 · 22 · 33 · 36 | 2 bộ thẻ | **Vận mệnh** (gộp thành 1 bộ) |

## 2. Bộ thẻ Vận mệnh (16 lá)

- Chỉ còn một bộ thẻ.
- Bộ được xáo bằng `state.rng`, rút lần lượt, hết thì xáo lại. Nhờ vậy mọi máy trong phòng thấy cùng một kết quả.

| # | Thẻ | Số lá | Luật đã chốt |
|---|---|---|---|
| 1 | **Bán nhà ngẫu nhiên** | 1 | Máy chọn ngẫu nhiên 1 công trình của bạn và bán lại, được 50% giá nhà. Chỉ chọn trong các ô đang cao nhất của từng quận để giữ luật xây đều. Không có nhà thì không xảy ra gì. |
| 2 | **Hạ cấp nhà người khác** | 1 | Bạn chọn 1 ô có công trình của đối thủ và hạ 1 bậc (khách sạn về 4 nhà). Chủ ô không được hoàn tiền. Chỉ chọn được ô cao nhất trong quận đó. Không đối thủ nào có nhà thì không xảy ra gì. |
| 3 | **Vé giảm 50%** | 2 | Thẻ giữ lại, mỗi người giữ tối đa 2 vé. Vé tự dùng ở lần trả tiền thuê kế tiếp: tiền thuê giảm một nửa, làm tròn lên bội 10. |
| 4 | **Vé máy bay** | 1 | Chọn ngay một ô bất kỳ để bay tới, trừ ô 30 (Vào tù). Máy bay đi theo chiều bàn cờ: qua Xuất phát vẫn nhận lương. Tới nơi thì xử lý ô như bình thường (mua, trả thuê…). |
| 5 | **Vào tù** | 1 | Như hiện tại: vào thẳng ô 10, không nhận lương. |
| 6 | **Con bạc** | 2 | Xem mục 3. |
| 7 | **Sinh nhật** | 2 | Mỗi người chơi khác tặng bạn 30 **[mặc định]**. |
| 8 | **Về Xuất phát** | 1 | Về ô 0, nhận lương. |
| 9 | **Thu thuế** | 1 | Nộp 7,5% tổng giá trị công trình đang có: số nhà × giá nhà của quận, khách sạn tính bằng 5 nhà. Làm tròn lên bội 10. Chưa xây gì thì nộp 0. Thẻ này đánh vào người xây nhiều. |
| 10 | Thưởng 100 | 1 | Thẻ thường, cho bộ đủ 16 lá và dễ thở hơn. |
| 11 | Phạt 50 | 1 | Thẻ thường. |
| 12 | Lùi 3 ô | 1 | Thẻ thường. |
| 13 | Vé ra tù | 1 | Giữ lại, như hiện tại. |

Tỉ lệ thẻ xấu, trung tính và tốt khoảng 6 : 4 : 6. Thẻ tương tác mạnh (Hạ cấp, Máy bay, Con bạc) chiếm 4/16, trung bình mỗi người gặp một thẻ loại này khoảng 1–2 vòng một lần.

## 3. Thẻ Con bạc: luật chi tiết

Ý gốc là được tung thêm xúc xắc, cược chẵn/lẻ, đúng thì nhận gấp đôi, sai thì bị dịch chuyển tới ô đắt nhất. Khi chốt luật cần xử lý bốn chỗ:

1. **Xúc xắc thêm chỉ để phân thắng thua, không dùng để đi.** Tổng 2 viên chẵn hoặc lẻ đều có xác suất đúng 50%.
2. **Cược bắt buộc.**
   - Mức cược tối thiểu 50, tối đa là số nhỏ hơn giữa 50% tiền mặt và 500, bước 10.
   - Có dưới 50 tiền mặt thì thẻ không xảy ra gì.
   - Nếu cho phép cược 0 thì ai cũng né, thẻ thành vô nghĩa.
3. **Thắng:** nhận lãi gấp đôi tiền cược, tức +2× cược **[mặc định, cách hiểu chữ "gấp đôi"]**.
4. **Thua:**
   - Mất tiền cược.
   - Bay tới ô của **đối thủ** đang có tiền thuê cao nhất và trả tiền thuê ở đó. Bay kiểu này không qua Xuất phát nên không nhận lương.
   - Nếu chưa có đối thủ nào sở hữu đất: bay tới ô đắt nhất chưa có chủ và được quyền mua.
   - Không chọn ô của chính mình, vì về ô nhà mình thì chẳng phải là phạt.

Vì sao luật như vậy thành một quyết định thật:
- Tính theo tiền thì kỳ vọng là 0,5 × 2B − 0,5 × B = +0,5B, ngoài ra còn 50% khả năng phải trả tiền thuê lớn nhất bàn.
- Đầu ván, đất chưa có nhà, nên cược cao.
- Cuối ván, Hà Nội đã có khách sạn, nên cược thấp.
- Người chơi phải nhìn bàn cờ để quyết, đúng tinh thần "con bạc".

Trong engine:
- Rút thẻ thì chuyển sang `phase: 'gamble'`.
- Người chơi gửi `{type:'gamble', bet, pick:'even'|'odd'}`.
- Engine tung xúc xắc bằng `rng` và trả ra event `dice` để client chạy animation.
- Bot cược theo tỉ lệ giữa tiền thuê lớn nhất và tiền mặt.

## 4. Cơ chế ẩn: Vương quốc Thanh Hóa

Ý gốc: mua đủ khu Thanh Hóa thì "trộm" một ít tiền của tất cả người chơi. Luật đã chốt:

- **Kích hoạt:**
  - Xảy ra ngay khi một người sở hữu đủ 3 ô Thanh Hóa và không ô nào đang cầm cố.
  - Hiện banner "Vương quốc Thanh Hóa", mỗi người chơi khác nộp 50 một lần.
  - Cả ván chỉ kích hoạt một lần.
- **Duy trì:**
  - Mỗi lần chủ vương quốc đi qua Xuất phát, mỗi người khác cống nạp 10.
  - Mất hiệu lực khi một ô bị bán, cầm cố hoặc đổi chủ.
  - Lấy lại đủ ô thì có lại khoản cống nạp, nhưng không thu lại khoản 50.
- **Ẩn:**
  - Không ghi trong màn Luật chơi.
  - Thẻ đất Thanh Hóa chỉ có một dòng gợi ý: "Người xưa nói: ai giữ đủ ba nơi này sẽ thành vua."
  - Sau khi kích hoạt, cơ chế được ghi vào nhật ký và hiện trên thẻ đất.
- **Cân bằng:**
  - Với 4 người: một lần 150, sau đó khoảng 30 mỗi vòng.
  - Mức này nhỏ hơn tiền thuê 1 nhà ở quận rẻ, nên là phần thưởng vui chứ không phá ván.

Hướng mở rộng (chưa làm): mỗi thành phố có một bí mật riêng, như Huế, Hội An… Chỉ thêm sau khi Thanh Hóa chạy ổn và người chơi thấy vui.

## 5. Kế hoạch code: bản 0.5.0 "Dải đất"

1. **Nhiều map:**
   - Tách dữ liệu bàn ra `src/core/maps/` (`classic.js` là Phố Giấy cũ, `vietnam.js` là map mới).
   - Mỗi map gồm tiles, districts, deck, hooks và tokens màu.
   - `createGame(..., {map})`, chủ phòng chọn map ở lobby.
2. **Bộ thẻ:**
   - Thêm các `fx`: `sellRandom`, `downgrade` (phase), `discount`, `fly` (phase), `gamble` (phase), `wealthTax`.
   - Bộ thẻ có thứ tự xáo trong state.
3. **Hook theo map:** `onOwnershipChange` và `onPassStart` cho Thanh Hóa.
4. **Test:**
   - Mỗi thẻ có test riêng.
   - Bot giả lập chạy trên cả hai map, vẫn ≥40% số ván kết thúc.
5. **Phiên bản:**
   - PROTOCOL 3 → 4 vì có action mới.
   - SCHEMA 2 → 3: migrate save cũ thành `map: 'classic'`.
6. **UI:**
   - Màn chọn ô cho Hạ cấp và Máy bay: bấm trực tiếp lên bàn cờ, các ô bấm được sẽ sáng lên.
   - Modal Con bạc có thanh trượt mức cược và hai nút Chẵn/Lẻ.
7. **Hình minh họa địa danh:** để sau. Ban đầu chỉ dùng tên và màu, vẽ sau theo hướng nghệ thuật trên canvas.

## 6. Điểm người dùng có thể đổi
- Cách hiểu "gấp đôi" ở thẻ Con bạc: lãi 2× (mặc định) hoặc nhận lại 2× (tức chỉ lãi 1×).
- Mức quà Sinh nhật (30), mức cống nạp Thanh Hóa (50 một lần, 10 mỗi vòng).
- Giữ map Phố Giấy cũ làm lựa chọn hay thay hẳn.
