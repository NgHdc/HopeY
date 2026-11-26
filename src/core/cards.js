// Thẻ "Câu hỏi" (q) và "Hàng xóm" (h). Hiệu ứng là dữ liệu (fx) để luật thuần xử lý.
import { SALARY } from './board.js';

export const CARDS = {
  q: [
    { k: 'Hôm nay trời mưa?', t: 'Bạn trú mưa ở quán nước, gặp lại bạn cũ, được mời một bữa.', a: 'nhận 50', fx: { gain: 50 } },
    { k: 'Có ai đón bạn không?', t: 'Bác xe ôm quen chở bạn ra ga gần nhất.', a: 'đến ga gần nhất', fx: { nearest: 'station' } },
    { k: 'Muốn về nhà không?', t: 'Mẹ gọi về ăn cơm.', a: `về Nhà, nhận ${SALARY}`, fx: { goto: 0 } },
    { k: 'Đi lạc à?', t: 'Bạn rẽ nhầm ngõ.', a: 'lùi 3 ô', fx: { back: 3 } },
    { k: 'Sửa nhà chưa?', t: 'Mùa mưa dột mái, phải thay ngói.', a: 'trả 25 mỗi nhà, 100 mỗi phố', fx: { repairs: [25, 100] } },
    { k: 'Tranh bán được rồi?', t: 'Bức tranh bạn vẽ có người mua ở Chợ Đêm.', a: 'nhận 100', fx: { gain: 100 } },
    { k: 'Quên gì đó?', t: 'Quên đội mũ bảo hiểm, bị nhắc nhở.', a: 'trả 15', fx: { pay: 15, why: 'phạt' } },
    { k: 'Muốn ngắm biển?', t: 'Bạn đi một mạch ra tận Hải Đăng.', a: 'đến Hải Đăng', fx: { goto: 39 } },
    { k: 'Cần nghỉ chút?', t: 'Bạn mệt rồi, ngồi lại Trạm Nghỉ.', a: 'vào Trạm Nghỉ, không qua Nhà', fx: { jail: true } },
    { k: 'Có vé đi qua?', t: 'Ai đó dúi vào tay bạn một tấm vé.', a: 'giữ vé ra khỏi Trạm Nghỉ', fx: { ticket: true } },
    { k: 'Lên đồi không?', t: 'Gió chiều rủ bạn lên Đồi Nắng.', a: 'đến Đồi Nắng', fx: { goto: 29 } },
  ],
  h: [
    { k: 'Ai cưới vậy?', t: 'Đám cưới đầu ngõ, mỗi nhà mừng bạn một phong bao.', a: 'nhận 10 từ mỗi người', fx: { collectEach: 10, why: 'mừng cưới' } },
    { k: 'Ai ốm thế?', t: 'Bạn mang cháo sang nhà bên, mua thêm ít thuốc.', a: 'trả 50', fx: { pay: 50, why: 'tiền thuốc' } },
    { k: 'Tết đến chưa?', t: 'Hàng xóm gửi bánh chưng kèm phong lì xì.', a: 'nhận 100', fx: { gain: 100 } },
    { k: 'Khao gì đây?', t: 'Bạn khao cả xóm trà đá đầu ngõ.', a: 'trả 10 cho mỗi người', fx: { payEach: 10, why: 'khao trà' } },
    { k: 'Ai nhặt được ví?', t: 'Bác tổ trưởng trả lại chiếc ví bạn đánh rơi.', a: 'nhận 20', fx: { gain: 20 } },
    { k: 'Học thêm gì?', t: 'Bạn đăng ký lớp đàn buổi tối.', a: 'trả 50', fx: { pay: 50, why: 'học phí' } },
    { k: 'Về quê không?', t: 'Chuyến xe sớm đưa bạn về nhà.', a: `về Nhà, nhận ${SALARY}`, fx: { goto: 0 } },
    { k: 'Có việc làm thêm?', t: 'Phụ quán phở cuối tuần.', a: 'nhận 50', fx: { gain: 50 } },
    { k: 'Ồn quá ai chịu?', t: 'Karaoke tới khuya, bạn bị mời ra Trạm Nghỉ.', a: 'vào Trạm Nghỉ, không qua Nhà', fx: { jail: true } },
    { k: 'Có vé đi qua?', t: 'Hàng xóm cho bạn tấm vé thừa.', a: 'giữ vé ra khỏi Trạm Nghỉ', fx: { ticket: true } },
    { k: 'Quỹ xóm đóng chưa?', t: 'Cả xóm góp tiền sửa nhà văn hóa.', a: 'trả 40 mỗi nhà, 115 mỗi phố', fx: { repairs: [40, 115] } },
  ],
};
