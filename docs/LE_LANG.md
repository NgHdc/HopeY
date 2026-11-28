# Chế độ "Lệ làng": luật ngầm của xóm (bản nháp thiết kế)

> **Bản nháp 1, 2026-11-28. Chưa code.** Ý tưởng gốc: "Luật ngầm xóm cũ", phóng to từ cơ chế ẩn Vương quốc Thanh Hóa (0.5.0).
> Làm thành một **chế độ chơi** trên map Dải đất trước. Chơi thử với người thật thấy vui rồi mới tính chuyện thành game riêng.

"Phép vua thua lệ làng": xóm nào cũng có lệ riêng, người mới đến phải tự mò.

---

## 1. Năm nguyên tắc (lọc mọi luật qua đây)

1. **Suy ra được.** Luật kích hoạt thì cả bàn đều thấy *luật nào* vừa ứng nghiệm, *ai* bị, *hệ quả gì*, nhưng không thấy *vì sao*. Sổ tay tự ghi bối cảnh mỗi lần ứng nghiệm (ô, xúc xắc, tiền, vòng, ai đứng cạnh). Suy luận là giải đố, không phải thi trí nhớ.
2. **Ít mà rõ.** Mỗi ván chỉ có **3 lệ ẩn**. Mỗi lệ ứng nghiệm khoảng **4–8 lần một ván** (đo bằng bot giả lập). Ít hơn thì không đủ dữ kiện, nhiều hơn thì đoán quá dễ.
3. **Biết luật thì đổi được cách chơi.** Xúc xắc thì không chọn được, nên lệ chỉ dựa vào xúc xắc cho biết luật mà không dùng được. Ít nhất 2/3 lệ phải gắn với **lựa chọn của người chơi**: mua, xây, nộp tiền ra Tù, cầm cố, đặt cược, giữ bao nhiêu tiền.
4. **Có cả lệ tốt lẫn lệ xấu.** Lệ xấu thì tránh, lệ tốt thì cố tình kích hoạt. Vì có lệ tốt, người chơi có lý do **giấu** điều mình đã đoán ra.
5. **Lệ không nhắm vào một người.** Điều kiện chỉ nói về hành động và trạng thái, không bao giờ nói tên người.

## 2. Ngữ pháp một lệ: KHI … MÀ … THÌ …

Mỗi lệ = **Sự kiện** (khi) × **Điều kiện** (mà) × **Hệ quả** (thì). Đoán theo hai tầng:
- sự kiện thì dễ đoán vì thấy lúc nào lệ nổ;
- điều kiện mới là phần khó.

| Sự kiện (KHI) | Điều kiện (MÀ) | Hệ quả (THÌ) |
|---|---|---|
| mua đất | tiền còn lại là số tròn trăm | nộp quỹ đình 50 |
| xây nhà | đang là vòng lẻ | khao xóm: trả mỗi người 20 |
| trả tiền thuê | xúc xắc ra đôi | được biếu: mỗi người đưa 15 |
| dừng ở một ô | có người khác đứng cùng ô | lùi 2 ô |
| qua Xuất phát | đang nghèo nhất bàn | được đổ thêm một lần |
| rút thẻ | đang giàu nhất bàn | nhận vé giảm 50% |
| ra Tù | ô thuộc quận màu X | mất 10% tiền mặt vào quỹ đình |
| đặt cược (Con bạc) | đang giữ ≥ N ô | uy tín +1 / −1 |

- Lệ không ghép ngẫu nhiên hoàn toàn mà lấy từ **mẫu có tham số** (ví dụ quận X, số N). Mỗi mẫu được cân bằng tay, tham số đổi theo seed, nên chơi nhiều cũng không thuộc lòng được.
- **Quỹ đình** là hũ tiền giữa bàn: tiền phạt của lệ và tiền đoán sai đều dồn vào đây.

### Một số mẫu lệ (tên lệ là thứ cả bàn thấy, điều kiện thì không)
| Tên lệ | Nội dung thật | Loại |
|---|---|---|
| Lệ Sĩ diện | Mua đất mà tiền còn lại tròn trăm → nộp quỹ đình 50 | xấu, tránh được |
| Lệ Khao làng | Xây nhà vào vòng lẻ → trả mỗi người 20 | xấu, tránh được |
| Lệ Tối lửa tắt đèn | Dừng ở ô đang có người khác → cả hai nhận 30 | tốt, may rủi |
| Lệ Đất lành chim đậu | Qua Xuất phát mà nghèo nhất bàn → mỗi người biếu 20 | tốt, **giúp người đang thua** |
| Lệ Báo phường | Xây nhà ở quận mà mình đã có nhiều hơn mọi người ≥ 2 nhà → nộp quỹ 50 | xấu, kìm người dẫn đầu |
| Lệ Trâu chậm | Tổng xúc xắc ≤ 4 → được đổ thêm | tốt, may rủi |
| Lệ Phép vua | Rút thẻ mà đang giàu nhất bàn → mất 10% vào quỹ | xấu, kìm người dẫn đầu |
| Lệ Tổ trưởng | Giữ đủ 3 ô cùng chữ cái đầu → mỗi lần chủ qua Xuất phát, mỗi người nộp 10 | tốt, chủ động |

Một số lệ cố ý **kéo người đang thua lên, kìm người dẫn đầu**. Đây là cách chữa bệnh "người dẫn đầu thắng mãi" của cờ tỷ phú.

## 3. Đoán lệ: "Trình làng"

- Trong lượt của mình, người chơi có thể **trình làng** một lệ: chọn tên lệ, rồi chọn sự kiện và điều kiện từ **danh sách** (không gõ chữ tự do). Danh sách lớn hơn nhiều so với các lệ thật, nên đoán mò rất khó trúng.
- **Đúng:**
  - lệ được ghi vào **hương ước** (cả bàn thấy luật đầy đủ);
  - người đoán ẵm **toàn bộ quỹ đình** và được **+3 uy tín**;
  - người đoán trở thành **chủ lệ**: từ giờ tiền phạt của lệ đó vào túi họ thay vì vào quỹ.
- **Sai:** nộp 50 vào quỹ đình. Đoán càng nhiều lần sai, quỹ càng to, người đoán đúng sau càng được nhiều.

**Thế giằng co hay nhất:** đã đoán ra một lệ tốt thì nên trình làng ngay để ẵm quỹ, hay **giấu đi** để một mình khai thác? Có mic thì càng vui: người chơi bàn tán, dò nhau, và nói dối được.

## 4. Gài lệ mới (bước 2, làm sau khi bước 1 đã vui)

Ai trình làng đúng thì được **bí mật đặt một lệ mới** từ danh sách mẫu:
- người đặt biết lệ này, người khác thì không;
- người đặt không được trình làng lệ của chính mình.

Ván không bao giờ hết bí ẩn. Thông tin lệch nhau làm người chơi phải dò xem ai gài lệ nào.

## 5. Thắng bằng uy tín, không bằng làm người khác phá sản

- Ván có giới hạn: **12 vòng** (hoặc 45 phút). Không ai bị loại: hết tiền thì "đi làm thuê" (nhận lương thấp, không mua được đất) nhưng vẫn đoán lệ.
- **Uy tín** = tài sản ròng / 100 + 3 × số lệ đã trình làng đúng (+ điểm từ một vài hệ quả của lệ).
- Như vậy có hai đường thắng: **giàu** hoặc **hiểu xóm**, và câu "mình muốn sống ở một con phố thế nào" có nghĩa thật trong luật.

## 6. Kỹ thuật

- **Lệ là dữ liệu cộng hàm thuần** trong `rules.js`, như thẻ Vận mệnh:
  - kiểm tra lệ ở các điểm đã có (`afterStep`, mua, xây, trả tiền…);
  - lệ ứng nghiệm thì phát sự kiện `{ type: 'custom', id, seat, fx }`.
- **Giấu thật sự:** hiện nay chủ phòng gửi toàn bộ trạng thái cho mọi máy, nên ai mở công cụ dev của trình duyệt cũng đọc được lệ. Phải đổi sang **gửi cho mỗi máy một bản đã cắt phần bí mật**:
  - đổi định dạng tin nhắn online;
  - nên làm cùng chat ở 0.7.0;
  - chuyển chủ phòng (P2) phải tính tới chuyện máy lên làm chủ không được biết trước lệ của người khác.
- **Bot giả lập:** đo mỗi lệ ứng nghiệm bao nhiêu lần một ván, chỉnh tham số cho rơi vào 4–8 lần; kiểm tra không lệ nào làm ván lệch hẳn về một phía.
- **Sổ tay:** một tab bên cạnh Nhật ký, mỗi lệ một cột, liệt kê bối cảnh từng lần ứng nghiệm; người chơi đánh dấu giả thuyết của mình (chỉ lưu trên máy mình).

## 7. Cách thử nhanh nhất (một bản nhỏ)

1. 8 mẫu lệ ở mục 2, 3 lệ mỗi ván, trình làng bằng danh sách, quỹ đình, thắng bằng uy tín sau 12 vòng. **Chưa** có gài lệ.
2. Chơi thật **một buổi 3–4 người có bật mic**. Cái cần đo: người chơi có **bàn tán và đoán** không, có ai **đổi cách chơi** sau khi đoán ra không.
3. Có thì làm bước 2 (gài lệ) và thêm mẫu lệ. Không thì giữ làm chế độ phụ, quay lại cờ tỷ phú.

## 8. Câu hỏi còn mở (cần người dùng chọn)
1. Thắng bằng uy tín sau 12 vòng, hay vẫn giữ luật phá sản và chỉ thêm lệ?
2. Lệ chỉ có ở Dải đất, hay ở mọi map?
3. Tên gọi: "Lệ làng", "Hương ước", hay "Luật ngầm xóm cũ"?
