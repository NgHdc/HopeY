// Map "Dải đất" (Việt Nam): 8 thành phố, 1 bộ thẻ Vận mệnh, cơ chế ẩn Vương quốc Thanh Hóa.
// Thiết kế và lý do: docs/MAP_VIETNAM.md. Vị trí, giá ô giữ đúng như bàn gốc.
import { SALARY, CUR, P, ST } from '../board.js';

const V = { type: 'card', deck: 'v', name: 'Vận mệnh' };
const TRAIN = 'Tàu Thống Nhất chạy dọc dải đất, ga nào cũng có người chờ.';
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
    P(1, 'Làng Nôm', 60, 'Cổng làng rêu phong, giếng đình soi bóng cây đa.'),
    V,
    S_(P(1, 'Phố Hiến – Chùa Chuông', 60, 'Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến. Nhãn lồng chín vàng sân chùa.'), 'Phố Hiến'),
    { type: 'tax', name: 'Trạm thu phí', amount: 150, human: 'Hàng xe dài, ai cũng phải dừng lại một lúc.' },
    ST('Ga Hà Nội', TRAIN),
    P(2, 'Cầu Hàm Rồng', 100, 'Cây cầu thép vắt qua sông Mã, dưới chân núi Rồng.'),
    V,
    S_(P(2, 'Sầm Sơn – Hòn Trống Mái', 100, 'Biển sớm đông người, đôi đá chồng lên nhau giữ lời hẹn.'), 'Sầm Sơn'),
    P(2, 'Thành Nhà Hồ', 120, 'Những khối đá lớn xếp khít, đứng đó hơn sáu trăm năm.'),
    { type: 'corner', key: 'jail', name: 'Tù', note: 'Chỉ ghé thăm', visit: 'ghé thăm Tù rồi đi tiếp', human: 'Ghé thăm thì cứ đi tiếp; bị giữ thì ngồi chờ.' },
    P(3, 'Cầu Cần Thơ', 140, 'Cây cầu dây văng nối hai bờ sông Hậu.'),
    { type: 'util', name: 'Điện lực', price: 150, human: 'Đèn đường bật lên, phố bắt đầu bữa tối.' },
    P(3, 'Bến Ninh Kiều', 140, 'Gió sông Hậu thổi qua bến, đèn thuyền lấp lánh.'),
    S_(P(3, 'Chợ nổi Cái Răng', 160, 'Năm giờ sáng, cây bẹo treo trái gì thì ghe bán trái nấy.'), 'Cái Răng'),
    ST('Ga Huế', TRAIN),
    S_(P(4, 'Cầu Trường Tiền', 180, 'Sáu vài mười hai nhịp, áo trắng qua cầu trong mưa.'), 'Trường Tiền'),
    V,
    P(4, 'Chùa Thiên Mụ', 180, 'Tiếng chuông chiều lan trên mặt sông Hương.'),
    S_(P(4, 'Đại Nội – Ngọ Môn', 200, 'Cửa chính vào hoàng thành, mái vàng lợp ngói lưu ly.'), 'Đại Nội'),
    { type: 'corner', key: 'park', name: 'Cà phê vỉa hè', note: 'Ngồi xuống, không mất gì', visit: 'ngồi ghế nhựa uống cà phê vỉa hè', human: 'Ghế nhựa thấp, ly cà phê đen, nhìn phố đi qua.' },
    S_(P(5, 'Đồ Sơn – Cát Bà', 220, 'Hai bãi biển của thành phố hoa phượng đỏ.'), 'Đồ Sơn'),
    V,
    P(5, 'Cảng Hải Phòng', 220, 'Cần cẩu nối nhau, tàu ra vào suốt ngày đêm.'),
    P(5, 'Nhà hát Lớn', 240, 'Tòa nhà màu vàng giữa trung tâm, nhìn ra quảng trường.'),
    ST('Ga Đà Nẵng', TRAIN),
    S_(P(6, 'Ngũ Hành Sơn – Sơn Trà', 260, 'Năm ngọn núi đá và bán đảo xanh ôm lấy biển.'), 'Ngũ Hành Sơn'),
    P(6, 'Cầu Rồng', 260, 'Tối cuối tuần rồng phun lửa, cả bờ sông đứng xem.'),
    { type: 'util', name: 'Nước sạch', price: 150, human: 'Nước về tận vòi, mát quanh năm.' },
    P(6, 'Cầu Vàng', 280, 'Đôi bàn tay đá nâng cây cầu giữa mây núi Bà Nà.'),
    { type: 'corner', key: 'lost', name: 'Vào Tù', note: 'Về thẳng ô Tù', human: 'Không qua Xuất phát, không nhận lương.' },
    S_(P(7, 'Nhà thờ Đức Bà', 300, 'Gạch đỏ không tô trát, hai tháp chuông giữa trung tâm.'), 'Nhà thờ Đức Bà'),
    P(7, 'Chợ Bến Thành', 300, 'Cửa Nam có tháp đồng hồ, trong chợ thứ gì cũng có.'),
    V,
    P(7, 'Landmark 81', 320, 'Tòa nhà cao nhất nước, đèn sáng tới tận khuya.'),
    ST('Ga Sài Gòn', TRAIN),
    V,
    P(8, 'Văn Miếu', 350, 'Sân gạch, giếng Thiên Quang, những tấm bia tiến sĩ.'),
    { type: 'tax', name: 'Phí đỗ xe phố cổ', amount: 100, human: 'Chỗ để xe chật như lòng phố.' },
    S_(P(8, 'Hồ Hoàn Kiếm – Tháp Rùa', 400, 'Trái tim thủ đô, sáng sớm người đi bộ quanh hồ.'), 'Hồ Gươm'),
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
