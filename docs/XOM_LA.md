# Chế độ "Xóm lạ": bàn cờ ẩn, hội làng, lệ làng (bản nháp thiết kế)

> **Bản nháp 3, 2026-11-28. Chưa code. Các quyết định của người dùng: mục "Đã chốt" ở cuối.** Đã áp các sửa đổi từ phân tích lý thuyết trò chơi (Phần I). Người dùng đã chốt: **thắng bằng uy tín sau 12 vòng**; chủ đề có thể đổi theo lối chơi.
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
- **Lựa chọn khi đi (có ngay từ bước 1):** tung 2 xúc xắc, được chọn đi theo **tổng** hoặc theo **một con**. Người chơi tự chọn liều vào sương hay về ô đã biết (xem I.1).
- **Mỗi ván thay 4–6 ô** bằng ô lạ rút từ một kho lớn hơn, để không đếm bài được hoàn toàn.

## Phần B. Hội làng: trò chơi ẩn trong ô

Khoảng **6 ô** trên bàn là ô hội làng, mỗi ô giấu một trò. Dừng ở đó thì mở ra trò (lần đầu là bất ngờ), cả bàn cùng chơi trong 15–30 giây.

**Quy tắc vàng cho chơi online: mọi người chọn bí mật cùng lúc, rồi lật cùng lúc. Không dùng trò thi phản xạ.**
- Máy chậm hay mạng lag đều không thiệt, vì chủ phòng chỉ chờ đủ người chọn rồi mới lật.
- Hết giờ chưa chọn thì lấy lựa chọn mặc định.

| Trò | Cách chơi | Gắn với ván |
|---|---|---|
| **Bầu cua** | Mỗi người đặt tiền vào 1–2 trong 6 mặt (tối thiểu 10); lắc 3 hột | tiền |
| **Oẳn tù tì** | Người dừng chân đấu một người tự chọn; thua nộp 50 cho người thắng | tiền |
| **Đấu giá kín** | Ô đất vừa mở được đấu giá kín: ai cũng ghi một giá, giá cao nhất mua được. Người dừng chân đã từ chối mua thì giá tối thiểu 50% | cũng là cách thêm luật đấu giá còn thiếu |
| **Kéo co** | Bàn chia 2 phe có tổng tài sản gần bằng nhau; mỗi người bí mật góp tiền; phe góp nhiều hơn thắng, chia thưởng theo tỷ lệ góp, người góp nhiều nhất +1 uy tín | góp nhiều thì mất tiền, góp ít thì mang tiếng |
| **Đoán giá chợ** | Mỗi người ghi kín một số 0–100; ai gần **2/3 trung bình** của cả bàn nhất thì thắng | đoán xem người khác nghĩ gì (I.6); thay cho Đập niêu |
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
  - người đoán ẵm **toàn bộ quỹ đình** và được **+5 uy tín**;
  - người đoán trở thành **chủ lệ**: từ giờ tiền phạt của lệ đó vào túi họ thay vì vào quỹ.
- **Sai:** nộp 50 vào quỹ đình; cả bàn chỉ thấy "sai", không thấy nội dung đã đoán (I.7c). Mỗi lượt trình làng tối đa 1 lần. Đoán càng nhiều lần sai, quỹ càng to, người đoán đúng sau càng được nhiều.

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
  - \+ 5 cho mỗi lệ trình làng đúng (phần C), cộng tiền quỹ đình ẵm được
  - nhà tính **1,2 lần** giá xây
  - \+ 1 cho mỗi 5 ô đã khai hoang (phần A)
  - \+ điểm thắng các trò hội làng (phần B, mỗi trò thắng +1)
- Có nhiều đường thắng: **giàu**, **hiểu xóm**, **đi nhiều**, **chơi hội giỏi**. Bảng uy tín hiện suốt ván.

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
| 1 | Sương mù + chọn cách đi + 12 vòng uy tín + 3 trò hội làng (đấu giá kín, bầu cua, đoán giá chợ) | đi vào sương có hồi hộp không; ván 12 vòng dài bao lâu |
| 2 | Thêm lệ làng (3 lệ, trình làng, quỹ đình) | có bàn tán, đoán lệ, đổi cách chơi không |
| 3 | Thêm trò hội làng còn lại, gài lệ mới, chọn cách đi (tổng hoặc một con) | |

Mỗi bước là một bản nhỏ, chơi thử một buổi 3–4 người có mic, rồi mới làm bước sau.

## Phần I. Người chơi sẽ nghĩ gì (phân tích lý thuyết trò chơi)

Mục này xem từng cơ chế dưới góc nhìn người chơi muốn thắng:
- họ được lợi gì;
- họ sẽ tính toán thế nào;
- có chiến thuật nào "phá game" (ai cũng làm một kiểu nên hết vui);
- sửa thế nào.

Những chỗ cần sửa được gom ở **I.10**.

### I.1. Bàn cờ ẩn: nếu không có lựa chọn thì chỉ là xổ số
- Đi bao nhiêu ô do xúc xắc quyết định, nên với luật gốc người chơi **không quyết định gì** về việc khám phá. Sương mù chỉ tạo hồi hộp, không tạo chiến thuật.
- **Đếm bài:** người chơi biết map gồm những ô nào (40 ô của Dải đất). Mỗi ô mở ra làm thu hẹp những gì còn lại trong sương. Cuối ván, vài ô cuối gần như đoán chắc được.
  - Đây là suy luận tốt.
  - Nhưng nếu ai cũng thuộc bộ ô thì sương chỉ còn giấu *vị trí*.
- **Suy luận không gian:** luật xếp "đất cùng quận đứng gần nhau" cho phép đoán ô kế bên. Mở một ô Huế thì ô cạnh nó nhiều khả năng cũng là Huế. Đây là thứ đáng giữ.
- **Kết luận:**
  - đưa **"đi theo tổng hoặc theo một con xúc xắc"** vào bước 1, không để sau. Có lựa chọn thì mới có câu hỏi "liều vào sương hay về chỗ quen";
  - mỗi ván **thay 4–6 ô bằng ô lạ** rút từ một kho lớn hơn, để không đếm bài được hoàn toàn.

### I.2. Đấu giá kín: người chơi sẽ trả thấp hơn giá trị
- Mỗi người ghi một giá kín, giá cao nhất thắng và trả đúng giá mình ghi. Theo lý thuyết, người chơi sẽ **ghi thấp hơn giá trị thật** của ô với mình: ghi đúng giá trị thì thắng cũng chẳng lời gì.
- **Ô càng mù mờ thì giá càng thấp.** Giá trị một ô phụ thuộc những ô cùng quận còn trong sương, không ai biết chắc. Ai thắng thường là người lạc quan nhất, và hay bị **"thắng mà lỗ"**: trả nhiều hơn giá trị thật. Người chơi có kinh nghiệm sẽ trả thấp hơn nữa.
- **Ai trả cao:** người đã có ô cùng quận. Ô đó với họ đáng giá hơn với mọi người, nên đấu giá tự nhiên đẩy ô về đúng người cần nó. Đây là điều tốt.
- **Mẹo cũ của cờ tỷ phú:** người dừng chân **từ chối mua** để đẩy ô ra đấu giá, hy vọng mua rẻ hơn khi người khác đang ít tiền.
  - Sửa: nếu người dừng chân đã từ chối thì giá đấu tối thiểu là 50% giá ô.
  - Hòa giá thì người ngồi gần người dừng chân hơn thắng.
- **Có mic thì vui:** người chơi dọa giá ("ô này tôi trả 300 đấy") hoặc giả vờ không quan tâm. Lời nói suông như vậy về lý thuyết không đáng tin, nhưng giữa bạn bè thì chính trò bắt bài mới là cái vui.

### I.3. Bầu cua: người dẫn đầu và người đang thua chơi ngược nhau
- Đặt cược theo luật thật thì trung bình lỗ khoảng 8% tiền cược. Người chơi tính toán sẽ đặt **ít nhất có thể**.
- **Nhưng ai thắng thì lấy hết**, nên:
  - người **dẫn đầu** muốn ván ít may rủi và đặt tối thiểu;
  - người **đang thua** muốn may rủi nhiều và đặt tối đa, vì thua thêm cũng chẳng mất gì về thứ hạng.
- Bầu cua tự nhiên thành **cơ hội lật kèo cho người đang thua**. Đây là hành vi tốt, nên giữ.
- Cần **mức cược tối thiểu** (ví dụ 10), nếu không người dẫn đầu ngồi ngoài và trò thành nhạt với họ.

### I.4. Oẳn tù tì: về lý thuyết là may rủi, ngoài đời là đọc người
- Chiến thuật tối ưu trên lý thuyết là ra búa, bao, kéo ngẫu nhiên mỗi thứ 1/3, nên kết quả trung bình hòa vốn.
- Người thật thì không ngẫu nhiên:
  - ván đầu hay ra búa;
  - thắng thì hay ra lại cái cũ;
  - thua thì hay đổi.
  
  Người quan sát giỏi sẽ có lợi, nhất là khi có mic để nói nhử.
- **Chọn đối thủ:** kỳ vọng hòa vốn, nên chọn ai chỉ làm đổi độ may rủi. Người đang thua sẽ thách người dẫn đầu (thắng thì rút ngắn khoảng cách gấp đôi). Hành vi này hợp lý và không cần sửa.

### I.5. Kéo co: ai cũng muốn đồng đội gánh
- Mỗi người góp tiền kín, phe góp nhiều hơn thắng. Nếu phe thắng chia đều phần thưởng thì **góp ít là lợi nhất**: thắng vẫn được chia, thua thì mất ít. Kết quả là cả hai phe góp rất ít và trò thành nhạt.
- **Sửa:** người góp nhiều nhất của phe thắng được **+1 uy tín**, phần thưởng chia **theo tỷ lệ tiền góp**. Như vậy mỗi người phải cân giữa góp để giữ tiếng và giữ tiền.
- Phe chia theo chỗ ngồi có thể lệch, ví dụ phe giàu đấu phe nghèo. Nên chia sao cho **tổng tài sản hai phe gần bằng nhau**.

### I.6. Đập niêu: mọi người sẽ chọn ô giữa, nên phải thay trò
- Nếu thắng là "chọn ô gần niêu nhất" thì ô giữa lưới luôn gần nhất về trung bình, nên **ai cũng chọn ô giữa** và hòa nhau.
- Nếu thắng là "chọn trúng chóc" thì đó là xổ số, không có gì để nghĩ.
- **Thay bằng "Đoán giá chợ"**, là trò "đoán 2/3 trung bình" nổi tiếng trong lý thuyết trò chơi:
  - mỗi người ghi kín một số từ 0 đến 100;
  - ai gần **2/3 trung bình** của cả bàn nhất thì thắng.
  - Người chơi phải đoán người khác nghĩ gì: "họ sẽ ghi khoảng 50, vậy tôi ghi 33… nhưng họ cũng nghĩ thế, vậy tôi ghi 22…". Mỗi bàn bạn bè dừng ở một mức suy nghĩ khác nhau, nên lần nào chơi cũng khác.
  - Đây chính là kiểu "suy nghĩ về cách người khác suy nghĩ" mà game này muốn có.
- Một trò khác cùng loại để dành: **"Số nhỏ không trùng"**: ai ghi số nhỏ nhất mà không ai ghi trùng thì thắng.

### I.7. Lệ làng: phần sâu nhất
**a) Giữ bí mật hay trình làng?**
- Trình làng đúng được: quỹ đình, +5 uy tín, và tiền phạt của lệ đó về sau.
- Giữ bí mật được: một mình khai thác lệ, nhưng có thể bị người khác trình làng trước.
- Với **lệ xấu**, biết luật chỉ giúp mình né, và trình làng xong thì cả bàn cũng né nên lệ "chết". Vì vậy cứ biết là **trình làng ngay** để ẵm thưởng.
- Với **lệ tốt**, có giằng co thật: giữ để khai thác, nhưng mỗi lần mình cố tình kích hoạt là **để lộ manh mối**. Người khác thấy "sao Lan cứ giữ tiền tròn trăm khi mua đất?" là đoán ra.
- Hành vi của người đã biết lệ trở thành manh mối cho người chưa biết. Đây là tầng suy luận thứ hai: "nó đang biết điều gì".

**b) Chờ quỹ to rồi mới trình làng**
- Quỹ đình lớn dần theo tiền phạt và tiền đoán sai. Người đã biết lệ muốn **chờ quỹ to** mới trình làng, nhưng chờ lâu thì dễ bị người khác giành trước.
- Đây là thế "ai nhảy trước": nhìn đối thủ có đang tiến gần đáp án không để quyết định khi nào ra tay. Rất hợp để bàn tán qua mic.

**c) Đoán mò: lúc nào thì đáng?**
- Chỉ nên đoán khi `xác suất đúng × (quỹ + giá trị 3 uy tín) > (1 − xác suất đúng) × 50`.
- Quỹ càng to thì đoán càng "đáng" dù chưa chắc. Cuối ván sẽ có nhiều lần đoán liều, mỗi lần sai lại nộp thêm 50 làm quỹ to hơn nữa. Vòng này hơi tự khuếch đại nhưng **vui**, nên giữ, chỉ cần:
  - **tối đa 1 lần trình làng mỗi lượt**;
  - **đoán sai thì chỉ báo "sai", không công bố nội dung đã đoán**. Nếu công bố, mỗi lần đoán sai là tặng không thông tin cho đối thủ, và người khôn sẽ chờ người khác đoán sai rồi loại trừ.

**d) Gài lệ (bước 3): kẻ gài bẫy**
- Người gài biết lệ, nên sẽ chọn điều kiện **đối thủ hay dính mà mình né được**, ví dụ "mua đất khi đang giàu nhất bàn" khi mình đang nghèo.
- Từ đó người khác nhìn hành vi của người gài để đoán lệ. Thông tin lệch nhau như vậy là tốt.
- **Ràng buộc để không bị lạm dụng:**
  - lệ gài chỉ được là **lệ phạt**, tiền phạt vào quỹ đình chứ không vào túi người gài;
  - người gài không trình làng lệ của chính mình được;
  - trong 2 vòng đầu sau khi gài, người gài **cũng bị lệ đó** như mọi người.

### I.8. 12 vòng và uy tín: người chơi sẽ tính ngược từ vòng cuối
- **Vòng cuối:** xây nhà chỉ là đổi tiền thành tài sản. Nếu tài sản tính đúng giá mua thì không lời không lỗ, nên không ai xây, và đấu giá cũng không ai trả quá giá ô.
  - Muốn vòng cuối vẫn có việc để làm: **nhà tính 1,2 lần giá xây** (khuyến khích xây sớm) và **lệ trình làng cuối ván vẫn ăn trọn quỹ**.
- **Người hết hy vọng thắng** sẽ đóng vai **"chọn vua"**: thách oẳn tù tì ai, góp kéo co bên nào… Với bạn bè thì chấp nhận được. Nên **hiện bảng uy tín** suốt ván để ai cũng biết mình đang ở đâu, và nhiều người còn thấy mình có cơ hội.
- **Cân điểm** để cả 4 kiểu người chơi đều có đường thắng:
  - **Địa chủ:** mua và xây nhiều;
  - **Thám tử:** đoán lệ;
  - **Liều ăn nhiều:** chơi bầu cua và hội làng;
  - **Kẻ gài bẫy:** gài lệ (bước 3).
  
  Ước tính: tài sản cuối ván 1 500–4 000 tương đương 15–40 điểm, trong khi 3 lệ × 3 điểm chỉ 9 điểm, quá ít để thám tử thắng được. Đề xuất **5 điểm mỗi lệ cộng quỹ đình**, rồi chỉnh lại bằng giả lập.

### I.9. Lỗ hổng lớn nhất: chủ phòng biết hết
- Máy chủ phòng chạy luật, nên **máy đó phải biết lệ ẩn và các ô trong sương**. Ai làm chủ phòng mà mở công cụ dev của trình duyệt là đọc được hết. Chuyển chủ phòng (P2) còn làm thêm người biết.
- Với cờ tỷ phú thường thì không sao. Với Xóm lạ, đây là **chuyện công bằng cốt lõi**: thông tin ẩn là toàn bộ game.
- Các hướng:
  1. Chơi với bạn bè thì chấp nhận "chủ phòng là lý trưởng, tin nhau". Ghi rõ trong luật.
  2. Để **máy chủ phòng trên Cloudflare** giữ bí mật thay cho máy người chơi. Đây chính là Giai đoạn B trong `docs/HOSTING.md`, và là thêm một lý do mạnh để làm nó.
- Đề xuất: bước 1 và 2 của Xóm lạ dùng hướng 1 để thử độ vui. Nếu vui thì làm hướng 2 trước khi phát hành rộng.

### I.10. Những sửa đổi rút ra (đã áp vào thiết kế)
| # | Sửa | Vì sao |
|---|---|---|
| 1 | "Đi theo tổng hoặc một con xúc xắc" vào bước 1 | không có lựa chọn thì sương mù chỉ là xổ số |
| 2 | Mỗi ván thay 4–6 ô bằng ô lạ | để không đếm bài được hoàn toàn |
| 3 | Từ chối mua thì giá đấu tối thiểu là 50% | chặn mẹo từ chối để mua rẻ |
| 4 | Bầu cua có mức cược tối thiểu | người dẫn đầu không ngồi ngoài |
| 5 | Kéo co: chia thưởng theo tỷ lệ góp, góp nhiều nhất +1 uy tín, chia phe cân tài sản | chống "để đồng đội gánh" |
| 6 | Bỏ Đập niêu, thay bằng **Đoán giá chợ** (2/3 trung bình) | ai cũng chọn ô giữa; trò mới bắt người chơi đoán ý nhau |
| 7 | Tối đa 1 lần trình làng mỗi lượt; đoán sai không công bố nội dung | chặn loại trừ ăn theo, giữ cuộc đua giành quỹ |
| 8 | 5 điểm uy tín mỗi lệ | để thám tử có đường thắng |
| 9 | Nhà tính 1,2 lần giá xây khi chấm điểm | vòng cuối vẫn có việc để làm |
| 10 | Lệ gài chỉ là lệ phạt, tiền vào quỹ; người gài cũng bị lệ trong 2 vòng đầu | chặn gài lệ có lợi cho mình |
| 11 | Hiện bảng uy tín suốt ván | giảm "chọn vua", ai cũng biết mình còn cơ hội |
| 12 | Chủ phòng biết hết: bước 1–2 tin nhau, phát hành rộng thì chuyển máy chủ phòng lên Cloudflare | thông tin ẩn là cốt lõi của chế độ |

## Đã chốt (2026-11-28)
1. **Đi ngang qua không làm ô mở**, chỉ dừng chân mới mở.
2. **Xáo vị trí ô mỗi ván** theo seed (thứ tự Bắc → Nam của Dải đất không giữ trong chế độ này; chế độ cổ điển vẫn giữ).
3. **Thắng bằng uy tín sau 12 vòng.**
4. **Ba trò hội làng làm trước:** đấu giá kín, bầu cua, đoán giá chợ.
5. **Chơi thử với bạn bè chấp nhận "chủ phòng biết hết"** (I.9). Trước khi mở cho người lạ thì chuyển máy chủ phòng lên Cloudflare (Giai đoạn B, `docs/HOSTING.md`).

## Câu hỏi còn mở
1. Tên chế độ: "Xóm lạ", "Người mới đến", "Hội làng"…?
