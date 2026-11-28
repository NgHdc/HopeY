// Phần chung của mọi bàn cờ: hằng số, bảng thuê, hàm dựng ô. Dữ liệu từng map ở ./maps/.
export const START_MONEY = 1500;
export const SALARY = 200;
export const JAIL = 10;
export const GO_JAIL = 30;
export const BAIL = 50;
export const CUR = '₫g';

export function rentTable(price) {
  const b = Math.max(2, Math.round(price / 14));
  const r = m => Math.round((b * m) / 5) * 5;
  return [b, r(5), r(15), r(40), r(55), r(70)];
}

/** Ô đất: quận d, tên, giá, một câu mô tả. */
export const P = (d, name, price, human) => ({ type: 'prop', d, name, price, human, rent: rentTable(price) });
export const ST = (name, human) => ({ type: 'station', name, price: 200, human });

export const buyable = t => t.type === 'prop' || t.type === 'station' || t.type === 'util';
/** Các ô của quận d trên bàn tiles. */
export const groupOf = (tiles, d) => tiles.map((t, i) => (t.d === d ? i : -1)).filter(i => i >= 0);
export const unmortCost = t => Math.round((t.price / 2) * 1.1);
