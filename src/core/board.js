// Dữ liệu bàn cờ: 40 ô, 8 quận, giá, bảng thuê. Không phụ thuộc DOM.
export const START_MONEY = 1500;
export const SALARY = 200;
export const JAIL = 10;
export const BAIL = 50;
export const CUR = '₫g';

export const DISTRICTS = {
  1: { name: 'Ngõ Đất', house: 50 }, 2: { name: 'Bến Sông', house: 50 },
  3: { name: 'Chợ Hoa', house: 100 }, 4: { name: 'Phố Nghề', house: 100 },
  5: { name: 'Phố Cổ', house: 150 }, 6: { name: 'Đồi Nắng', house: 150 },
  7: { name: 'Vườn Xanh', house: 200 }, 8: { name: 'Cảng Biển', house: 200 },
};

export function rentTable(price) {
  const b = Math.max(2, Math.round(price / 14));
  const r = m => Math.round((b * m) / 5) * 5;
  return [b, r(5), r(15), r(40), r(55), r(70)];
}

const P = (d, name, price, human) => ({ type: 'prop', d, name, price, human, rent: rentTable(price) });
const ST = name => ({ type: 'station', name, price: 200, human: 'Tàu sớm chở người đi làm, tàu muộn chở người về nhà.' });

export const TILES = [
  { type: 'corner', key: 'home', name: 'Nhà', human: `Mỗi lần đi qua nhận ${SALARY} ${CUR} lương.` },
  P(1, 'Ngõ Vôi', 60, 'Tường vôi trắng, trẻ con vẽ phấn lên chân tường.'),
  { type: 'card', deck: 'h', name: 'Hàng xóm' },
  P(1, 'Ngõ Giếng', 60, 'Sáng nào cũng có người kéo nước, hỏi thăm nhau.'),
  { type: 'tax', name: 'Phí Chợ', amount: 150, human: 'Mỗi gánh hàng góp một ít để chợ sạch.' },
  ST('Ga Bắc'),
  P(2, 'Bến Đò', 100, 'Ông lái đò nhớ tên từng khách quen.'),
  { type: 'card', deck: 'q', name: 'Câu hỏi' },
  P(2, 'Bến Lưới', 100, 'Lưới phơi kín bờ, mùi muối và nắng.'),
  P(2, 'Bến Trăng', 120, 'Đêm rằm, cả bến ngồi ngắm trăng trên sông.'),
  { type: 'corner', key: 'jail', name: 'Trạm Nghỉ', human: 'Ghé chơi thì cứ đi tiếp; bị giữ thì ngồi ngắm phố.' },
  P(3, 'Chợ Sớm', 140, 'Bốn giờ sáng, gánh rau đã lên phố.'),
  { type: 'util', name: 'Trạm Điện', price: 150, human: 'Đèn đường bật lên, phố bắt đầu bữa tối.' },
  P(3, 'Chợ Hoa', 140, 'Hoa giấy đỏ rực trên những mái ngói thấp.'),
  P(3, 'Chợ Đêm', 160, 'Đèn bão lấp lánh, tiếng mặc cả vui như hát.'),
  ST('Ga Đông'),
  P(4, 'Lò Gốm', 180, 'Bàn tay xoay đất thành chiếc bát đầu tiên trong ngày.'),
  { type: 'card', deck: 'h', name: 'Hàng xóm' },
  P(4, 'Xưởng Mộc', 180, 'Mùn cưa thơm như gỗ mít mới bổ.'),
  P(4, 'Phố Rèn', 200, 'Tiếng búa đều như nhịp tim của phố.'),
  { type: 'corner', key: 'park', name: 'Công Viên', human: 'Không ai thu tiền ở đây. Ngồi xuống, thở chậm.' },
  P(5, 'Đình Làng', 220, 'Cửa son mở rộng ngày hội, trống gọi cả làng.'),
  { type: 'card', deck: 'q', name: 'Câu hỏi' },
  P(5, 'Phố Đèn Lồng', 220, 'Mỗi nhà treo một chiếc đèn, cả phố thành dải sáng.'),
  P(5, 'Cửa Ô', 240, 'Cổng thành cũ, nơi người đi xa quay về.'),
  ST('Ga Nam'),
  P(6, 'Đồi Chè', 260, 'Những nón lá nhấp nhô giữa hàng chè xanh.'),
  P(6, 'Đồi Gió', 260, 'Diều bay suốt chiều, không ai muốn về.'),
  { type: 'util', name: 'Giếng Nước', price: 150, human: 'Giếng chung của cả xóm, nước mát quanh năm.' },
  P(6, 'Đồi Nắng', 280, 'Nắng muộn nhuộm vàng cả sườn đồi và mái nhà.'),
  { type: 'corner', key: 'lost', name: 'Lạc Đường', human: 'Rẽ nhầm quá nhiều ngõ — về Trạm Nghỉ ngồi đã.' },
  P(7, 'Vườn Ươm', 300, 'Mỗi chậu cây con là một lời hứa nhỏ.'),
  P(7, 'Vườn Sen', 300, 'Sen nở sớm, người đến hái trước khi nắng lên.'),
  { type: 'card', deck: 'h', name: 'Hàng xóm' },
  P(7, 'Vườn Mây', 320, 'Vườn trên cao, mây lững thững qua hàng rào.'),
  ST('Ga Tây'),
  { type: 'card', deck: 'q', name: 'Câu hỏi' },
  P(8, 'Cảng Cá', 350, 'Thuyền về lúc rạng đông, cả cảng thức dậy.'),
  { type: 'tax', name: 'Phí Cảng', amount: 100, human: 'Bến bãi cần được sửa sau mùa bão.' },
  P(8, 'Hải Đăng', 400, 'Ngọn đèn cuối phố, soi đường cho người đi biển.'),
];

export const buyable = t => t.type === 'prop' || t.type === 'station' || t.type === 'util';
export const group = d => TILES.map((t, i) => (t.d === d ? i : -1)).filter(i => i >= 0);
export const unmortCost = t => Math.round((t.price / 2) * 1.1);
