// Test map Việt Nam: bộ thẻ Vận mệnh và Vương quốc Thanh Hóa (docs/MAP_VIETNAM.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, applyAction, choiceTiles, betRange, gambleTarget, rentFor } from '../src/core/rules.js';
import { START_MONEY, SALARY, JAIL } from '../src/core/board.js';
import { MAPS } from '../src/core/maps/index.js';
import { TH_FIRST, TH_TRIBUTE } from '../src/core/maps/vietnam.js';
import { migrate } from '../src/core/version.js';

const VN = MAPS.vietnam, T = VN.tiles;
const C = { sell: 0, downgrade: 1, discount: 2, discount2: 3, fly: 4, jail: 5, gamble: 6, birthday: 8, home: 10, tax: 11, ticket: 15 };
const game = (n = 2, seed = 42) => createGame(['An', 'Bình', 'Chi', 'Dũng'].slice(0, n), { seed, dev: true, map: 'vietnam' });
function go(S, action, seat = S.turn) {
  const r = applyAction(S, seat, action);
  assert.ok(r.ok, `thao tác ${JSON.stringify(action)} phải hợp lệ (phase=${S.phase}, turn=${S.turn})`);
  return r.state;
}
const no = (S, action) => assert.equal(applyAction(S, S.turn, action).ok, false, `không được phép: ${JSON.stringify(action)}`);
const own = (S, ...is) => is.reduce((s, i) => go(s, { type: 'debug', op: 'own', i }), S);
const build = (S, ...is) => is.reduce((s, i) => go(s, { type: 'build', i }), S);
const card = (S, id) => go(S, { type: 'debug', op: 'card', deck: 'v', id });
const goto = (S, i) => { S = go(S, { type: 'debug', op: 'goto', i }); return S.phase === 'buy' ? go(S, { type: 'skip' }) : S; };
/** Hết lượt người hiện tại, những người khác ngồi Cà phê vỉa hè, quay về người đầu. */
function round(S) {
  const me = S.turn;
  S = go(S, { type: 'end' });
  while (S.turn !== me) { S = S.players[S.turn].pos === 20 ? go(S, { type: 'debug', op: 'goto', i: 21 }) : goto(S, 20); if (S.phase === 'buy') S = go(S, { type: 'skip' }); S = go(S, { type: 'end' }); }
  return S;
}

test('map Việt Nam: 40 ô, vị trí và giá giữ như bàn gốc, 16 lá Vận mệnh', () => {
  const C0 = MAPS.classic.tiles;
  assert.equal(T.length, 40);
  T.forEach((t, i) => {
    assert.equal(t.type, C0[i].type, `ô ${i}`);
    assert.equal(t.price, C0[i].price, `giá ô ${i}`);
    assert.equal(t.d, C0[i].d, `quận ô ${i}`);
  });
  assert.equal(T[39].name, 'Hồ Hoàn Kiếm – Tháp Rùa');
  assert.equal(VN.districts[8].name, 'Hà Nội');
  assert.equal(VN.decks.v.cards.length, 16);
  assert.deepEqual(Object.keys(game().decks), ['v']);
  assert.equal(createGame(['A', 'B']).map, 'classic', 'mặc định trong engine vẫn là bàn gốc');
});

test('Bán nhà ngẫu nhiên: chỉ bán ở ô cao nhất quận, nhận 50% giá nhà', () => {
  let S = card(game(), C.sell);
  assert.equal(S.players[0].money, START_MONEY, 'không có nhà thì không mất gì');
  S = round(S);
  S = build(own(S, 1, 3), 1, 3, 1);         // ô 1: 2 nhà, ô 3: 1 nhà
  const m = S.players[0].money;
  S = card(S, C.sell);
  assert.equal(S.houses[1], 1);
  assert.equal(S.houses[3], 1);
  assert.equal(S.players[0].money, m + 25);
});

test('Hạ cấp nhà người khác: chọn trên bàn, chỉ ô cao nhất quận, chủ không được hoàn tiền', () => {
  let S = build(own(game(), 1, 3), 1, 3, 1);
  S = goto(S, 20); S = go(S, { type: 'end' });            // tới lượt Bình
  const ownerMoney = S.players[0].money;
  S = card(S, C.downgrade);
  assert.equal(S.phase, 'downgrade');
  assert.deepEqual(choiceTiles(S), [1]);
  no(S, { type: 'downgrade', i: 3 });
  no(S, { type: 'end' });
  S = go(S, { type: 'downgrade', i: 1 });
  assert.equal(S.houses[1], 1);
  assert.equal(S.players[0].money, ownerMoney);
  assert.equal(S.phase, 'end');
  // không ai có nhà: thẻ không có tác dụng
  let E = card(game(), C.downgrade);
  assert.equal(E.phase, 'end');
});

test('Vé giảm 50%: giữ tối đa 2 vé, tự dùng ở lần trả thuê kế tiếp, làm tròn lên bội 10', () => {
  let S = card(game(), C.discount);
  assert.equal(S.players[0].discount, 1);
  S = card(round(S), C.discount2); S = card(round(S), C.discount);
  assert.equal(S.players[0].discount, 2, 'tối đa 2 vé');
  S = go(S, { type: 'end' });
  S = own(S, 39); S = goto(S, 20); S = go(S, { type: 'end' });   // Bình có Hồ Gươm
  const rent = rentFor(S, 39), half = Math.ceil(rent / 20) * 10;
  const m = S.players[0].money;
  S = goto(S, 39);
  assert.equal(S.players[0].money, m - half);
  assert.equal(S.players[0].discount, 1);
});

test('Vé máy bay: chọn ô bất kỳ trừ Vào Tù, qua Xuất phát vẫn nhận lương', () => {
  let S = card(game(), C.fly);
  assert.equal(S.phase, 'fly');
  assert.ok(!choiceTiles(S).includes(30) && !choiceTiles(S).includes(0));
  no(S, { type: 'fly', i: 30 });
  S = go(S, { type: 'fly', i: 39 });
  assert.equal(S.players[0].pos, 39);
  assert.equal(S.phase, 'buy', 'tới nơi xử lý ô như bình thường');
  S = go(S, { type: 'skip' });
  S = card(round(S), C.fly);
  const m = S.players[0].money;
  S = go(S, { type: 'fly', i: 5 });
  assert.equal(S.players[0].money, m + SALARY);
});

test('Con bạc: cược bắt buộc 50 → min(50% tiền, 500), bước 10', () => {
  let S = card(game(), C.gamble);
  assert.equal(S.phase, 'gamble');
  assert.deepEqual(betRange(S), { min: 50, max: 500, step: 10 });
  for (const bad of [{ bet: 40, pick: 'even' }, { bet: 510, pick: 'even' }, { bet: 55, pick: 'odd' }, { bet: 100, pick: 'x' }, { pick: 'odd' }]) no(S, { type: 'gamble', ...bad });
  no(S, { type: 'end' });
  // chưa ai có đất: thua thì tới ô trống đắt nhất
  assert.equal(gambleTarget(S), 39);
  const r = applyAction(S, 0, { type: 'gamble', bet: 100, pick: 'even' });
  assert.ok(r.ok);
  const g = r.state.gamble, sum = g.dice[0] + g.dice[1];
  assert.equal(g.win, sum % 2 === 0);
  if (g.win) { assert.equal(r.state.players[0].money, START_MONEY + 200); assert.equal(r.state.players[0].pos, 0); }
  else { assert.equal(r.state.players[0].money, START_MONEY - 100); assert.equal(r.state.players[0].pos, 39); assert.equal(r.state.phase, 'buy'); }
  assert.ok(r.events.some(e => e.type === 'dice' && e.gamble));
});

test('Con bạc: thua thì tới ô đối thủ có tiền thuê cao nhất, không chọn ô của mình; dưới 50 thì bỏ qua', () => {
  let S = own(game(), 37);                    // An có Văn Miếu
  S = goto(S, 20); S = go(S, { type: 'end' });
  S = own(S, 1, 3); S = build(S, 1, 3);       // Bình có Hưng Yên + nhà
  assert.equal(gambleTarget(S, 1), 37);
  assert.equal(gambleTarget(S, 0), 3, 'An: ô của Bình (bằng thuê thì lấy ô sau)');
  S = go(S, { type: 'debug', op: 'money', n: -(S.players[1].money - 40) });
  S = card(S, C.gamble);
  assert.equal(S.phase, 'end', 'dưới 50 tiền mặt thì thẻ không có tác dụng');
  // seed nào đó thua: kiểm tra trả thuê tại ô đích
  for (let seed = 1; seed < 40; seed++) {
    let X = own(game(2, seed), 37); X = goto(X, 20); X = go(X, { type: 'end' });
    X = card(X, C.gamble);
    const r = applyAction(X, 1, { type: 'gamble', bet: 50, pick: 'even' });
    if (r.state.gamble.win) continue;
    assert.equal(r.state.players[1].pos, 37);
    assert.equal(r.state.players[1].money, X.players[1].money - 50 - rentFor(X, 37));
    return;
  }
  assert.fail('không tìm được seed thua');
});

test('Sinh nhật, Về Xuất phát, Vào Tù, Vé ra Tù', () => {
  let S = card(game(3), C.birthday);
  assert.equal(S.players[0].money, START_MONEY + 60);
  assert.equal(S.players[1].money, START_MONEY - 30);
  S = card(round(goto(round(S), 20)), C.home);
  assert.equal(S.players[0].pos, 0);
  S = card(round(S), C.jail);
  assert.equal(S.players[0].pos, JAIL);
  assert.equal(S.players[0].jail, 1);
  const P = card(game(), C.ticket);
  assert.equal(P.players[0].cards, 1);
});

test('Thu thuế: 7,5% giá trị công trình, làm tròn lên bội 10', () => {
  let S = card(game(), C.tax);
  assert.equal(S.players[0].money, START_MONEY, 'chưa xây thì nộp 0');
  S = round(S);
  S = build(own(S, 37, 39), 37, 39, 37, 39); // 4 nhà × 200 = 800 → 60
  const m = S.players[0].money;
  S = card(S, C.tax);
  assert.equal(S.players[0].money, m - 60);
});

test('Vương quốc Thanh Hóa: nộp 50 một lần, cống nạp 10 khi qua Xuất phát, mất khi cầm cố', () => {
  let S = own(game(3), 6, 8);
  assert.equal(S.secret.th?.king ?? null, null);
  const r = applyAction(S, 0, { type: 'debug', op: 'own', i: 9 });
  S = r.state;
  assert.ok(r.events.some(e => e.type === 'kingdom'));
  assert.equal(S.secret.th.king, 0);
  assert.equal(S.players[0].money, START_MONEY + 2 * TH_FIRST);
  assert.equal(S.players[1].money, START_MONEY - TH_FIRST);
  // cầm cố: mất vương quốc; chuộc lại: có lại nhưng không thu lại 50
  S = go(S, { type: 'mort', i: 6 });
  assert.equal(S.secret.th.king, null);
  S = go(S, { type: 'unmort', i: 6 });
  assert.equal(S.secret.th.king, 0);
  assert.equal(S.players[1].money, START_MONEY - TH_FIRST);
  // qua Xuất phát: cống nạp
  S = goto(S, 38); S = round(S);
  const m = S.players.map(p => p.money);
  S = goto(S, 1);
  assert.equal(S.players[1].money, m[1] - TH_TRIBUTE);
  assert.equal(S.players[2].money, m[2] - TH_TRIBUTE);
});

test('migrate: ván 0.4 (schema 2) mở thành bàn gốc', () => {
  const old = createGame(['A', 'B'], { seed: 3 });
  old.schemaVersion = 2; delete old.map; delete old.choice; delete old.secret; old.players.forEach(p => delete p.discount);
  const m = migrate(old);
  assert.equal(m.map, 'classic');
  assert.equal(m.players[0].discount, 0);
  assert.ok(applyAction(m, 0, { type: 'roll' }).ok);
});
