// Map "Dải đất" (Việt Nam): 8 thành phố, 1 bộ thẻ Vận mệnh, cơ chế ẩn Vương quốc Thanh Hóa.
// Thiết kế và lý do: docs/MAP_VIETNAM.md. Câu mô tả ô: content/vietnam.json (Agy). Vị trí, giá ô giữ đúng như bàn gốc.
import { SALARY, CUR, P, ST } from '../board.js';

const V = { type: 'card', deck: 'v', name: 'Vận mệnh' };
const S_ = (t, short) => ({ ...t, short });

export const TH = 2; // quận Thanh Hóa
export const TH_FIRST = 50, TH_TRIBUTE = 10;

export const VIETNAM = {
  id: 'vietnam',
  name: 'Dải đất',
  blurb: 'Tám thành phố Việt Nam, một bộ thẻ Vận mệnh, và một bí mật.',
  terms: { start: 'Xuất phát', jail: 'Tù', goJail: 'Vào Tù' },
  districts: {
    1: { name: 'Hưng Yên', house: 50 },
    2: { name: 'Thanh Hóa', house: 50, hint: 'Người xưa nói: ai giữ đủ ba nơi này sẽ thành vua.', reveal: `Vương quốc Thanh Hóa: giữ đủ 3 ô, không cầm cố. Lần đầu mỗi người nộp ${TH_FIRST}; mỗi lần chủ qua Xuất phát, mỗi người cống nạp ${TH_TRIBUTE}.` },
    3: { name: 'Cần Thơ', house: 100 },
    4: { name: 'Huế', house: 100 },
    5: { name: 'Hải Phòng', house: 150 },
    6: { name: 'Đà Nẵng', house: 150 },
    7: { name: 'TP. Hồ Chí Minh', house: 200 },
    8: { name: 'Hà Nội', house: 200 },
  },
  tiles: [
    { type: 'corner', key: 'home', name: 'Xuất phát', note: `Đi qua nhận ${SALARY} ${CUR}`, visit: 'đứng ở Xuất phát', human: `Mỗi lần đi qua nhận ${SALARY} ${CUR} lương.` },
    P(1, 'Làng Nôm', 60, 'Cầu đá chín nhịp bắc qua sông nhỏ, mái ngói chợ Nôm rêu phong.'),
    V,
    S_(P(1, 'Phố Hiến – Chùa Chuông', 60, 'Thương cảng xưa bên sông Hồng, tiếng chuông chùa chiều vang vọng.'), 'Phố Hiến'),
    { type: 'tax', name: 'Trạm thu phí', amount: 150, human: 'Xe qua trạm, nộp 150 ₫g phí đường bộ.' },
    ST('Ga Hà Nội', 'Sân ga rộng, còi tàu đêm giục người lên chuyến Bắc – Nam.'),
    P(2, 'Cầu Hàm Rồng', 100, 'Cầu thép bắc qua sông Mã, nối hai bờ núi Ngọc – núi Rồng.'),
    V,
    S_(P(2, 'Sầm Sơn – Hòn Trống Mái', 100, 'Sóng biển rì rào dưới chân núi Trường Lệ, hai khối đá chênh vênh.'), 'Sầm Sơn'),
    P(2, 'Thành Nhà Hồ', 120, 'Những khối đá xanh ghép khít không vữa, đứng vững qua hơn sáu trăm năm.'),
    { type: 'corner', key: 'jail', name: 'Tù', note: 'Chỉ ghé thăm', visit: 'ghé thăm Tù rồi đi tiếp', human: 'Ghé thăm thì cứ đi tiếp; bị giữ thì ngồi đếm song sắt.' },
    P(3, 'Cầu Cần Thơ', 140, 'Nhịp cầu dây văng vươn qua sông Hậu, sáng đèn mỗi tối.'),
    { type: 'util', name: 'Điện lực', price: 150, human: 'Đường dây sáng đèn từ phố lớn tới tận ngõ nhỏ.' },
    P(3, 'Bến Ninh Kiều', 140, 'Gió sông Hậu mát rượi, thuyền xuôi ngược dưới ánh đèn bến nước.'),
    S_(P(3, 'Chợ nổi Cái Răng', 160, 'Cây bẹo treo trái cây trước mũi ghe, tiếng máy nổ rộn ràng từ mờ sáng.'), 'Cái Răng'),
    ST('Ga Huế', 'Nhà ga cổ bên bờ sông Hương, tàu dừng trong tiếng chuông chiều.'),
    S_(P(4, 'Cầu Trường Tiền', 180, 'Sáu vài mười hai nhịp cong mềm bắc qua dòng sông Hương xanh biếc.'), 'Trường Tiền'),
    V,
    P(4, 'Chùa Thiên Mụ', 180, 'Tháp Phước Duyên bảy tầng soi bóng xuống sông Hương chiều muộn.'),
    S_(P(4, 'Đại Nội – Ngọ Môn', 200, 'Tường thành rêu phong, lầu Ngũ Phụng uy nghi giữa nắng cố đô.'), 'Đại Nội'),
    { type: 'corner', key: 'park', name: 'Cà phê vỉa hè', note: 'Ngồi xuống, không mất gì', visit: 'ngồi ghế nhựa uống cà phê vỉa hè', human: 'Ghế nhựa thấp, ly cà phê sữa đá, ngồi nghỉ không mất đồng nào.' },
    S_(P(5, 'Đồ Sơn – Cát Bà', 220, 'Rừng xanh ôm vịnh đá vôi, gió biển mặn mà thổi suốt bốn mùa.'), 'Đồ Sơn'),
    V,
    P(5, 'Cảng Hải Phòng', 220, 'Cần cẩu vươn cao bên bến tàu, còi tàu vang lên mỗi chuyến rời bến.'),
    P(5, 'Nhà hát Lớn', 240, 'Mặt tiền vàng nhạt cổ kính, quảng trường trước cửa rợp bóng phượng đỏ.'),
    ST('Ga Đà Nẵng', 'Tàu rời ga giữa lòng phố biển, chuẩn bị vượt đèo Hải Vân.'),
    S_(P(6, 'Ngũ Hành Sơn – Sơn Trà', 260, 'Năm ngọn núi đá vôi bên bờ biển, bán đảo xanh mướt vươn ra khơi.'), 'Ngũ Hành Sơn'),
    P(6, 'Cầu Rồng', 260, 'Thân rồng vàng uốn lượn qua sông Hàn, cuối tuần lại phun lửa phun nước.'),
    { type: 'util', name: 'Nước sạch', price: 150, human: 'Dòng nước mát chảy đều tới từng mái nhà.' },
    P(6, 'Cầu Vàng', 280, 'Hai bàn tay đá khổng lồ nâng dải lụa vàng giữa mây ngàn Bà Nà.'),
    { type: 'corner', key: 'lost', name: 'Vào Tù', note: 'Về thẳng ô Tù', human: 'Đi nhầm đường rồi — vào thẳng ô 10 ngồi nghỉ.' },
    S_(P(7, 'Nhà thờ Đức Bà', 300, 'Gạch ngói đỏ au giữa lòng thành phố, tháp chuông đôi đứng lặng qua trăm năm.'), 'Nhà thờ Đức Bà'),
    P(7, 'Chợ Bến Thành', 300, 'Tháp đồng hồ bốn mặt quen thuộc, bên trong rộn rã tiếng chào hàng.'),
    V,
    P(7, 'Landmark 81', 320, 'Tòa tháp kính vươn cao bên bờ sông Sài Gòn, sáng rực cả đường chân trời.'),
    ST('Ga Sài Gòn', 'Sân ga nhộn nhịp người đi kẻ đến từ sáng sớm tới khuya.'),
    V,
    P(8, 'Văn Miếu', 350, 'Hàng bia tiến sĩ trên lưng rùa đá, sân gạch rợp bóng cây cổ thụ.'),
    { type: 'tax', name: 'Phí đỗ xe phố cổ', amount: 100, human: 'Đỗ xe giữa phố đông, nộp 100 ₫g phí bến bãi.' },
    S_(P(8, 'Hồ Hoàn Kiếm – Tháp Rùa', 400, 'Mặt hồ xanh lục quanh năm, Tháp Rùa nhỏ nhắn soi bóng giữa lòng phố cổ.'), 'Hồ Gươm'),
  ],
  decks: {
    v: {
      name: 'Vận mệnh', cls: 'cq', mark: '✦',
      cards: [
        { k: 'Nhà dột à?', t: 'Bão về, một công trình của bạn phải bán gấp.', a: 'bán ngẫu nhiên 1 công trình, nhận lại nửa giá nhà', fx: { sellRandom: true } },
        { k: 'Ghen tị à?', t: 'Bạn báo phường một công trình xây quá tầng.', a: 'chọn 1 ô có nhà của đối thủ, hạ 1 bậc', fx: { downgrade: true } },
        { k: 'Có mã giảm giá?', t: 'Ví điện tử tặng bạn một mã giảm giá.', a: 'giữ vé: lần trả tiền thuê tới giảm 50%', fx: { discount: true } },
        { k: 'Có mã giảm giá?', t: 'Người quen cho bạn ở nhờ một đêm.', a: 'giữ vé: lần trả tiền thuê tới giảm 50%', fx: { discount: true } },
        { k: 'Săn được vé rẻ?', t: 'Vé máy bay 0 đồng, muốn đi đâu cũng được.', a: 'chọn một ô bất kỳ để bay tới', fx: { fly: true } },
        { k: 'Vượt đèn đỏ?', t: 'Bạn bị giữ lại để làm việc.', a: 'vào Tù, không qua Xuất phát', fx: { jail: true } },
        { k: 'Chẵn hay lẻ?', t: 'Một ván xúc xắc bên vỉa hè. Đã ngồi xuống thì phải cược.', a: 'đặt cược, đoán chẵn hay lẻ', fx: { gamble: true } },
        { k: 'Chẵn hay lẻ?', t: 'Ông chú đầu ngõ rủ bạn làm một ván.', a: 'đặt cược, đoán chẵn hay lẻ', fx: { gamble: true } },
        { k: 'Sinh nhật ai đây?', t: 'Cả nhóm góp tiền mua bánh kem cho bạn.', a: 'nhận 30 từ mỗi người', fx: { collectEach: 30, why: 'quà sinh nhật' } },
        { k: 'Sinh nhật ai đây?', t: 'Bạn bè chuyển khoản kèm lời chúc.', a: 'nhận 30 từ mỗi người', fx: { collectEach: 30, why: 'quà sinh nhật' } },
        { k: 'Về quê ăn Tết?', t: 'Chuyến xe đêm đưa bạn về lại nơi bắt đầu.', a: `về Xuất phát, nhận ${SALARY}`, fx: { goto: 0 } },
        { k: 'Đoàn kiểm tra?', t: 'Cán bộ thuế đi kiểm đếm từng công trình.', a: 'nộp 7,5% giá trị nhà đang có', fx: { wealthTax: 0.075 } },
        { k: 'Trúng số à?', t: 'Tờ vé số mua vội trúng giải khuyến khích.', a: 'nhận 100', fx: { gain: 100 } },
        { k: 'Quên mũ bảo hiểm?', t: 'Bị thổi phạt ở ngã tư.', a: 'trả 50', fx: { pay: 50, why: 'phạt' } },
        { k: 'Đi nhầm đường?', t: 'Bản đồ trên điện thoại chỉ sai một ngã rẽ.', a: 'lùi 3 ô', fx: { back: 3 } },
        { k: 'Có người bảo lãnh?', t: 'Một người bạn hứa đứng ra bảo lãnh cho bạn.', a: 'giữ vé ra Tù', fx: { ticket: true } },
      ],
    },
  },
  hooks: {
    // Chạy sau mỗi thao tác thành công: ai đang giữ đủ Thanh Hóa (không cầm cố) thì là vua.
    afterStep(G, api) {
      const S = G.S, sec = (S.secret.th ||= { fired: false, king: null });
      const g = api.group(TH), o = S.owner[g[0]];
      const king = o != null && !S.players[o].out && g.every(i => S.owner[i] === o && !S.mort[i]) ? o : null;
      if (king === sec.king) return;
      if (sec.king != null) api.log(`Vương quốc Thanh Hóa tan rã: ${S.players[sec.king].name} không còn giữ đủ ba nơi.`);
      sec.king = king;
      if (king == null) return;
      const p = S.players[king];
      if (!sec.fired) {
        sec.fired = true;
        G.ev.push({ type: 'kingdom', seat: king });
        api.say(`${p.name} giữ đủ ba nơi của Thanh Hóa và lập nên Vương quốc Thanh Hóa!`);
        S.players.forEach(x => { if (x !== p && !x.out) api.pay(x, king, TH_FIRST, 'nộp cho Vương quốc Thanh Hóa'); });
      } else api.log(`${p.name} lập lại Vương quốc Thanh Hóa: qua Xuất phát lại được cống nạp.`);
    },
    // Chủ vương quốc đi qua Xuất phát: mỗi người khác cống nạp.
    onPassStart(G, p, api) {
      const S = G.S, k = S.players.indexOf(p);
      if (!S.secret.th || S.secret.th.king !== k) return;
      S.players.forEach(x => { if (x !== p && !x.out) api.pay(x, k, TH_TRIBUTE, 'cống nạp Vương quốc Thanh Hóa'); });
    },
  },
};
