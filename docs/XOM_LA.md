# Chế độ "Xóm lạ": bàn cờ ẩn, hội làng, lệ làng (bản nháp thiết kế)

> **Bản nháp 2, 2026-11-28. Chưa code.** Người dùng đã chốt: **thắng bằng uy tín sau 12 vòng**; chủ đề có thể đổi theo lối chơi.
> Gốc: cơ chế ẩn Vương quốc Thanh Hóa (0.5.0) và ý tưởng "Luật ngầm xóm cũ".

## 0. Ý chính

Người chơi là **người mới dọn đến một xóm lạ**. Không ai biết trước:
- **xóm trông thế nào:** bàn cờ phủ sương, đi tới đâu ô mở tới đó (phần A);
- **xóm có trò gì:** một số ô là trò chơi dân gian của hội làng (phần B);
- **xóm có lệ gì:** luật ngầm phải tự mò (phần C).

Cuối ván, ai **có uy tín nhất xóm** thì thắng (phần D).

Ba phần này dùng chung một chủ đề là **khám phá**: chủ đề và luật cùng nói một điều, khác cờ tỷ phú gốc. Mỗi phần là một **công tắc** trong sảnh (phần E), nên vẫn giữ được **cờ tỷ phú cổ điển** như hiện nay.

---

## Phần A. Bàn cờ ẩn (sương mù)

- Đầu ván, **cả 40 ô phủ sương**, chỉ 4 ô góc lộ (Xuất phát, Tù, Cà phê, Vào Tù) để người chơi biết mình đang ở đâu.
- **Ô chỉ mở khi có người dừng chân ở đó.** Đi ngang qua thì không mở. Đã mở thì mở cho cả bàn và mở luôn tới hết ván.
- **Mỗi ván một bàn khác** (xếp theo seed của ván), nên không thuộc lòng được:
  - giữ khung 40 ô và 4 góc;
  - các ô còn lại (đất, ga, thuế, thẻ, ô hội làng) được xáo vị trí theo vài ràng buộc: đất cùng quận đứng gần nhau, không 2 ô thuế liền nhau, ô hội làng rải đều 4 cạnh.
- **Thưởng khai hoang:** người mở một ô được +10 tiền và quyền **mua trước** (người đến trước được chọn trước). Mở được 5 ô thì +1 uy tín.
- Ô chưa mở trông như đám mây pixel có dấu "?". Mở ô có hoạt ảnh lật.
- **Lựa chọn khi đi (tùy chọn, để thêm sau nếu thấy thiếu):** tung 2 xúc xắc, được chọn đi theo **tổng** hoặc theo **một con**. Người chơi tự chọn đi về phía sương để khám phá hay về phía ô đã biết cho an toàn.

## Phần B. Hội làng: trò chơi ẩn trong ô

Khoảng **6 ô** trên bàn là ô hội làng, mỗi ô giấu một trò. Dừng ở đó thì mở ra trò (lần đầu là bất ngờ), cả bàn cùng chơi trong 15–30 giây.

**Quy tắc vàng cho chơi online: mọi người chọn bí mật cùng lúc, rồi lật cùng lúc. Không dùng trò thi phản xạ.**
- Máy chậm hay mạng lag đều không thiệt, vì chủ phòng chỉ chờ đủ người chọn rồi mới lật.
- Hết giờ chưa chọn thì lấy lựa chọn mặc định.

| Trò | Cách chơi | Gắn với ván |
|---|---|---|
| **Bầu cua** | Mỗi người đặt tiền vào 1–2 trong 6 mặt; lắc 3 hột | tiền |
| **Oẳn tù tì** | Người dừng chân đấu một người tự chọn; thua nộp 50 cho người thắng | tiền |
| **Đấu giá kín** | Ô đất vừa mở được đấu giá kín: ai cũng ghi một giá, giá cao nhất mua được | cũng là cách thêm luật đấu giá còn thiếu |
| **Kéo co** | Bàn chia 2 phe theo chỗ ngồi; mỗi người bí mật góp sức (tiền); phe góp nhiều hơn thắng, chia quỹ đình | góp nhiều thì mất tiền, góp ít thì mang tiếng |
| **Đập niêu** | Niêu giấu ở một ô trong lưới 5×5; mỗi người chọn một ô; ai gần nhất được thưởng | may rủi + suy đoán |
| **Đố vui** | Câu đố dân gian / về vùng đất, chọn trong 4 đáp án, 20 giây; ai đúng cũng được, không tính nhanh chậm | lấy từ `content/*.json` của Agy |
| **Bốc thăm** | 3 lá úp, chọn 1: thưởng, phạt, hoặc một lệ làng lộ ra | nối với phần C |

Trò đầu tiên nên làm: **đấu giá kín** (sửa luôn chỗ thiếu của cờ tỷ phú) và **bầu cua**.

---

## Phần C. Lệ làng: luật ngầm

"Phép vua thua lệ làng": xóm nào cũng có lệ riêng, người mới đến phải tự mò.

### C1. Năm nguyên tắc (lọc mọi luật qua đây)

1. **Suy ra được.** Luật kích hoạt thì cả bàn đều thấy *luật nào* vừa ứng nghiệm, *ai* bị, *hệ quả gì*, nhưng không thấy *vì sao*. Sổ tay tự ghi bối cảnh mỗi lần ứng nghiệm (ô, xúc xắc, tiền, vòng, ai đứng cạnh). Suy luận là giải đố, không phải thi trí nhớ.
2. **Ít mà rõ.** Mỗi ván chỉ có **3 lệ ẩn**. Mỗi lệ ứng nghiệm khoảng **4–8 lần một ván** (đo bằng bot giả lập). Ít hơn thì không đủ dữ kiện, nhiều hơn thì đoán quá dễ.
3. **Biết luật thì đổi được cách chơi.** Xúc xắc thì không chọn được, nên lệ chỉ dựa vào xúc xắc cho biết luật mà không dùng được. Ít nhất 2/3 lệ phải gắn với **lựa chọn của người chơi**: mua, xây, nộp tiền ra Tù, cầm cố, đặt cược, giữ bao nhiêu tiền.
4. **Có cả lệ tốt lẫn lệ xấu.** Lệ xấu thì tránh, lệ tốt thì cố tình kích hoạt. Vì có lệ tốt, người chơi có lý do **giấu** điều mình đã đoán ra.
5. **Lệ không nhắm vào một người.** Điều kiện chỉ nói về hành động và trạng thái, không bao giờ nói tên người.

### C2. Ngữ pháp một lệ: KHI … MÀ … THÌ …

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

### C3. Đoán lệ: "Trình làng"

- Trong lượt của mình, người chơi có thể **trình làng** một lệ: chọn tên lệ, rồi chọn sự kiện và điều kiện từ **danh sách** (không gõ chữ tự do). Danh sách lớn hơn nhiều so với các lệ thật, nên đoán mò rất khó trúng.
- **Đúng:**
  - lệ được ghi vào **hương ước** (cả bàn thấy luật đầy đủ);
  - người đoán ẵm **toàn bộ quỹ đình** và được **+3 uy tín**;
  - người đoán trở thành **chủ lệ**: từ giờ tiền phạt của lệ đó vào túi họ thay vì vào quỹ.
- **Sai:** nộp 50 vào quỹ đình. Đoán càng nhiều lần sai, quỹ càng to, người đoán đúng sau càng được nhiều.

**Thế giằng co hay nhất:** đã đoán ra một lệ tốt thì nên trình làng ngay để ẵm quỹ, hay **giấu đi** để một mình khai thác? Có mic thì càng vui: người chơi bàn tán, dò nhau, và nói dối được.

### C4. Gài lệ mới (bước 2, làm sau khi bước 1 đã vui)

Ai trình làng đúng thì được **bí mật đặt một lệ mới** từ danh sách mẫu:
- người đặt biết lệ này, người khác thì không;
- người đặt không được trình làng lệ của chính mình.

Ván không bao giờ hết bí ẩn. Thông tin lệch nhau làm người chơi phải dò xem ai gài lệ nào.

---

## Phần D. Thắng bằng uy tín (đã chốt)

- Ván có **12 vòng**. Không ai bị loại: hết tiền thì "đi làm thuê" (lương thấp, không mua được đất) nhưng vẫn chơi hội làng và đoán lệ.
- **Uy tín cuối ván** =
  - tài sản ròng / 100
  - \+ 3 cho mỗi lệ trình làng đúng (phần C)
  - \+ 1 cho mỗi 5 ô đã khai hoang (phần A)
  - \+ điểm thắng các trò hội làng (phần B, mỗi trò thắng +1)
- Có nhiều đường thắng: **giàu**, **hiểu xóm**, **đi nhiều**, **chơi hội giỏi**.

## Phần E. Công tắc trong sảnh

| Công tắc | Cờ tỷ phú cổ điển | Xóm lạ |
|---|---|---|
| Bàn cờ | lộ hết, xếp cố định theo map | **sương mù**, xếp theo seed |
| Hội làng | tắt | bật |
| Lệ làng | tắt (chỉ có Thanh Hóa) | 3 lệ |
| Kết thúc | phá sản | **12 vòng, uy tín** |

- Chủ phòng chọn một trong hai bộ có sẵn, hoặc tự bật/tắt từng công tắc.
- Map (Dải đất, Phố Giấy) vẫn chọn riêng: bàn ẩn dùng ô của map đó nhưng xáo vị trí.

## Phần F. Kỹ thuật

- **Lệ là dữ liệu cộng hàm thuần** trong `rules.js`, như thẻ Vận mệnh:
  - kiểm tra lệ ở các điểm đã có (`afterStep`, mua, xây, trả tiền…);
  - lệ ứng nghiệm thì phát sự kiện `{ type: 'custom', id, seat, fx }`.
- **Giấu thật sự:** hiện nay chủ phòng gửi toàn bộ trạng thái cho mọi máy, nên ai mở công cụ dev của trình duyệt cũng đọc được lệ. Phải đổi sang **gửi cho mỗi máy một bản đã cắt phần bí mật**:
  - đổi định dạng tin nhắn online;
  - nên làm cùng chat ở 0.7.0;
  - chuyển chủ phòng (P2) phải tính tới chuyện máy lên làm chủ không được biết trước lệ của người khác.
- **Bot giả lập:** đo mỗi lệ ứng nghiệm bao nhiêu lần một ván, chỉnh tham số cho rơi vào 4–8 lần; kiểm tra không lệ nào làm ván lệch hẳn về một phía.
- **Bàn ẩn:** state giữ bàn đã xáo (`S.layout`) và danh sách ô đã mở (`S.seen`). Bản gửi cho từng máy chỉ có nội dung các ô đã mở; ô chưa mở chỉ gửi "sương".
- **Hội làng:** mỗi trò là một `phase` mới (giống `gamble`):
  - mọi máy gửi lựa chọn kín cho chủ phòng; đủ người hoặc hết giờ thì chủ phòng lật;
  - kết quả tính bằng hàm thuần + rng có seed, nên test được và bot chơi được.
  - Chủ phòng về lý thuyết đọc được lựa chọn của người khác trước khi tự chọn. Chơi với bạn bè thì chấp nhận được; ghi lại để tính sau.
- **Sổ tay:** một tab bên cạnh Nhật ký, mỗi lệ một cột, liệt kê bối cảnh từng lần ứng nghiệm; người chơi đánh dấu giả thuyết của mình (chỉ lưu trên máy mình).

## Phần G. Làm theo thứ tự nào

Cả ba phần đều cần **gửi mỗi máy một bản trạng thái đã cắt phần bí mật**. Việc này làm ở **0.7.0 Phòng bền**, cùng chat và mic.

| Bước | Nội dung | Thử gì với người thật |
|---|---|---|
| 1 | Sương mù + 12 vòng uy tín + 2 trò hội làng (đấu giá kín, bầu cua) | đi vào sương có hồi hộp không; ván 12 vòng dài bao lâu |
| 2 | Thêm lệ làng (3 lệ, trình làng, quỹ đình) | có bàn tán, đoán lệ, đổi cách chơi không |
| 3 | Thêm trò hội làng còn lại, gài lệ mới, chọn cách đi (tổng hoặc một con) | |

Mỗi bước là một bản nhỏ, chơi thử một buổi 3–4 người có mic, rồi mới làm bước sau.

## Phần H. Câu hỏi còn mở
1. Ô có mở khi **đi ngang qua** không? (Bản nháp: không, chỉ khi dừng chân. Đi ngang mà mở thì sương tan rất nhanh: khoảng 3 vòng là lộ hết.)
2. Bàn ẩn **xáo vị trí** mỗi ván, hay giữ vị trí cố định của map và chỉ che đi? (Bản nháp: xáo, để chơi lại vẫn lạ. Nhưng Dải đất hiện xếp Bắc → Nam có ý nghĩa.)
3. Tên chế độ: "Xóm lạ", "Người mới đến", "Hội làng"…?
4. Trò hội làng nào làm trước?
