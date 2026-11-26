/* Phố Giấy — luật, giao diện và chơi online (PeerJS/WebRTC). 2–6 người, mỗi người một máy.
   Máy chủ phòng giữ trạng thái và luật; máy khách chỉ gửi thao tác và vẽ lại trạng thái nhận được. */
(function () {
  'use strict';

  // ---------- hằng số ----------
  const START_MONEY = 1500, SALARY = 200, JAIL = 10, BAIL = 50, STEP_MS = 120;
  const CUR = '₫g';

  const DISTRICTS = {
    1: { name: 'Ngõ Đất', house: 50 }, 2: { name: 'Bến Sông', house: 50 },
    3: { name: 'Chợ Hoa', house: 100 }, 4: { name: 'Phố Nghề', house: 100 },
    5: { name: 'Phố Cổ', house: 150 }, 6: { name: 'Đồi Nắng', house: 150 },
    7: { name: 'Vườn Xanh', house: 200 }, 8: { name: 'Cảng Biển', house: 200 },
  };

  const P = (d, name, price, human) => ({ type: 'prop', d, name, price, human, rent: rentTable(price) });
  const ST = name => ({ type: 'station', name, price: 200, human: 'Tàu sớm chở người đi làm, tàu muộn chở người về nhà.' });
  const T = [
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

  function rentTable(price) {
    const b = Math.max(2, Math.round(price / 14));
    const r = m => Math.round((b * m) / 5) * 5;
    return [b, r(5), r(15), r(40), r(55), r(70)];
  }

  // ---------- thẻ ----------
  const QC = [
    { k: 'Hôm nay trời mưa?', t: 'Bạn trú mưa ở quán nước, gặp lại bạn cũ, được mời một bữa.', a: 'nhận 50', run: p => gain(p, 50) },
    { k: 'Có ai đón bạn không?', t: 'Bác xe ôm quen chở bạn ra ga gần nhất.', a: 'đến ga gần nhất', run: p => moveTo(p, nearest(p.pos, 'station')) },
    { k: 'Muốn về nhà không?', t: 'Mẹ gọi về ăn cơm.', a: `về Nhà, nhận ${SALARY}`, run: p => moveTo(p, 0) },
    { k: 'Đi lạc à?', t: 'Bạn rẽ nhầm ngõ.', a: 'lùi 3 ô', run: p => moveBy(p, -3) },
    { k: 'Sửa nhà chưa?', t: 'Mùa mưa dột mái, phải thay ngói.', a: 'trả 25 mỗi nhà, 100 mỗi phố', run: p => repairs(p, 25, 100) },
    { k: 'Tranh bán được rồi?', t: 'Bức tranh bạn vẽ có người mua ở Chợ Đêm.', a: 'nhận 100', run: p => gain(p, 100) },
    { k: 'Quên gì đó?', t: 'Quên đội mũ bảo hiểm, bị nhắc nhở.', a: 'trả 15', run: p => pay(p, null, 15, 'phạt') },
    { k: 'Muốn ngắm biển?', t: 'Bạn đi một mạch ra tận Hải Đăng.', a: 'đến Hải Đăng', run: p => moveTo(p, 39) },
    { k: 'Cần nghỉ chút?', t: 'Bạn mệt rồi, ngồi lại Trạm Nghỉ.', a: 'vào Trạm Nghỉ, không qua Nhà', run: p => sendJail(p) },
    { k: 'Có vé đi qua?', t: 'Ai đó dúi vào tay bạn một tấm vé.', a: 'giữ vé ra khỏi Trạm Nghỉ', run: p => { p.cards++; } },
    { k: 'Lên đồi không?', t: 'Gió chiều rủ bạn lên Đồi Nắng.', a: 'đến Đồi Nắng', run: p => moveTo(p, 29) },
  ];
  const HC = [
    { k: 'Ai cưới vậy?', t: 'Đám cưới đầu ngõ, mỗi nhà mừng bạn một phong bao.', a: 'nhận 10 từ mỗi người', run: p => eachPays(p, 10) },
    { k: 'Ai ốm thế?', t: 'Bạn mang cháo sang nhà bên, mua thêm ít thuốc.', a: 'trả 50', run: p => pay(p, null, 50, 'tiền thuốc') },
    { k: 'Tết đến chưa?', t: 'Hàng xóm gửi bánh chưng kèm phong lì xì.', a: 'nhận 100', run: p => gain(p, 100) },
    { k: 'Khao gì đây?', t: 'Bạn khao cả xóm trà đá đầu ngõ.', a: 'trả 10 cho mỗi người', run: p => payEach(p, 10) },
    { k: 'Ai nhặt được ví?', t: 'Bác tổ trưởng trả lại chiếc ví bạn đánh rơi.', a: 'nhận 20', run: p => gain(p, 20) },
    { k: 'Học thêm gì?', t: 'Bạn đăng ký lớp đàn buổi tối.', a: 'trả 50', run: p => pay(p, null, 50, 'học phí') },
    { k: 'Về quê không?', t: 'Chuyến xe sớm đưa bạn về nhà.', a: `về Nhà, nhận ${SALARY}`, run: p => moveTo(p, 0) },
    { k: 'Có việc làm thêm?', t: 'Phụ quán phở cuối tuần.', a: 'nhận 50', run: p => gain(p, 50) },
    { k: 'Ồn quá ai chịu?', t: 'Karaoke tới khuya, bạn bị mời ra Trạm Nghỉ.', a: 'vào Trạm Nghỉ, không qua Nhà', run: p => sendJail(p) },
    { k: 'Có vé đi qua?', t: 'Hàng xóm cho bạn tấm vé thừa.', a: 'giữ vé ra khỏi Trạm Nghỉ', run: p => { p.cards++; } },
    { k: 'Quỹ xóm đóng chưa?', t: 'Cả xóm góp tiền sửa nhà văn hóa.', a: 'trả 40 mỗi nhà, 115 mỗi phố', run: p => repairs(p, 40, 115) },
  ];

  // ---------- quân cờ ----------
  const PIECES = [
    { n: 'tròn', c: 'var(--accent)', s: '<circle cx="8" cy="8" r="6"/>' },
    { n: 'tam giác', c: 'var(--accent-2)', s: '<path d="M8 2 L14.5 14 H1.5Z"/>' },
    { n: 'vuông', c: 'var(--cool-1)', s: '<rect x="2.5" y="2.5" width="11" height="11"/>' },
    { n: 'lục giác', c: 'var(--cool-2)', s: '<path d="M8 1.5 L13.6 4.75 V11.25 L8 14.5 L2.4 11.25 V4.75Z"/>' },
    { n: 'ngôi nhà', c: 'var(--ink)', s: '<path d="M2 8 L8 2.5 L14 8 V14 H2Z"/>' },
    { n: 'chiếc lá', c: 'var(--d7)', s: '<path d="M2 14 C2 6 6 2 14 2 C14 10 10 14 2 14Z"/>' },
  ];
  const pieceSvg = (k, sz) =>
    `<svg class="piece" width="${sz}" height="${sz}" viewBox="0 0 16 16" style="fill:${PIECES[k].c};stroke:var(--paper);stroke-width:1.2" aria-label="${PIECES[k].n}">${PIECES[k].s}</svg>`;

  // ---------- trạng thái ----------
  let S = null;
  const $ = s => document.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  const pad = n => String(n + 1).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cur = () => S.players[S.turn];
  const idx = p => S.players.indexOf(p);
  const buyable = t => t.type === 'prop' || t.type === 'station' || t.type === 'util';

  function newGame(names) {
    S = {
      players: names.map((n, i) => ({ name: n, money: START_MONEY, pos: 0, jail: 0, cards: 0, out: false, piece: i, creditor: null, online: true })),
      owner: {}, houses: {}, mort: {},
      turn: 0, phase: 'roll', doubles: 0, dice: [1, 1], round: 1,
      log: [], decks: { q: shuffle([...QC.keys()]), h: shuffle([...HC.keys()]) },
      view: { kind: 'tile', i: 0 }, winner: null, busy: false,
      msg: 'Quân cờ đặt ở Nhà. Người đầu tiên lăn xúc xắc.',
    };
    log(`Ván mới, ${names.length} người, mỗi người ${START_MONEY} ${CUR}.`);
    done();
  }

  function log(s) { S.log.unshift(s); S.log.length = Math.min(S.log.length, 80); }
  function say(s) { S.msg = s; log(s); }
  // done = lưu + vẽ + gửi cho mọi máy; sync = chỉ vẽ + gửi (dùng khi quân cờ đang đi)
  function done() { saveHost(); sync(); }
  function sync() { render(); broadcastState(); }

  // ---------- tiền ----------
  function gain(p, amt) { p.money += amt; say(`${p.name} nhận ${amt} ${CUR}.`); }
  function pay(p, toIdx, amt, why) {
    p.money -= amt;
    if (toIdx != null) S.players[toIdx].money += amt;
    say(`${p.name} trả ${amt} ${CUR}${toIdx != null ? ' cho ' + S.players[toIdx].name : ''}${why ? ' — ' + why : ''}.`);
    if (p.money < 0) { p.creditor = toIdx; log(`${p.name} đang nợ ${-p.money} ${CUR}: bán nhà hoặc thế chấp đất.`); }
  }
  function eachPays(p, amt) { S.players.forEach((o, i) => { if (o !== p && !o.out) pay(o, idx(p), amt, 'mừng cưới'); }); }
  function payEach(p, amt) { S.players.forEach((o, i) => { if (o !== p && !o.out) pay(p, i, amt, 'khao trà'); }); }
  function repairs(p, perHouse, perStreet) {
    let total = 0;
    Object.keys(S.owner).forEach(i => { if (S.owner[i] === idx(p)) { const h = S.houses[i] || 0; total += h === 5 ? perStreet : h * perHouse; } });
    if (total) pay(p, null, total, 'sửa nhà'); else say(`${p.name} chưa có nhà nào, không phải trả.`);
  }

  // ---------- di chuyển ----------
  async function moveBy(p, steps) {
    const dir = Math.sign(steps);
    for (let s = 0; s < Math.abs(steps); s++) {
      p.pos = (p.pos + dir + 40) % 40;
      if (p.pos === 0 && dir > 0) { p.money += SALARY; log(`${p.name} đi qua Nhà, nhận ${SALARY} ${CUR}.`); }
      sync();
      await sleep(STEP_MS);
    }
    await land(p);
  }
  const moveTo = (p, target) => moveBy(p, (target - p.pos + 40) % 40);
  function nearest(from, type) { for (let s = 1; s <= 40; s++) { const i = (from + s) % 40; if (T[i].type === type) return i; } return from; }
  function sendJail(p) { p.pos = JAIL; p.jail = 1; S.doubles = 0; S.view = { kind: 'tile', i: JAIL }; say(`${p.name} vào Trạm Nghỉ.`); }

  async function land(p) {
    const i = p.pos, t = T[i];
    S.view = { kind: 'tile', i };
    if (buyable(t)) {
      const o = S.owner[i];
      if (o == null) {
        if (p.money >= t.price) { S.phase = 'buy'; S.msg = `${t.name} chưa có ai ở. ${p.name} có muốn mua với giá ${t.price} ${CUR}?`; }
        else say(`${p.name} chưa đủ tiền mua ${t.name}.`);
      } else if (o === idx(p)) say(`${p.name} về thăm ${t.name} của mình.`);
      else if (S.mort[i]) say(`${t.name} đang thế chấp, không thu tiền thuê.`);
      else pay(p, o, rentFor(i), `thuê ${t.name}`);
    } else if (t.type === 'tax') pay(p, null, t.amount, t.name);
    else if (t.type === 'card') await draw(p, t.deck);
    else if (t.key === 'lost') sendJail(p);
    else if (t.key === 'park') say(`${p.name} ngồi nghỉ ở Công Viên.`);
    else if (t.key === 'jail') say(`${p.name} ghé chơi Trạm Nghỉ.`);
    else if (t.key === 'home') say(`${p.name} đứng ở Nhà.`);
  }

  async function draw(p, deck) {
    const pile = S.decks[deck];
    const id = pile.shift(); pile.push(id);
    const c = (deck === 'q' ? QC : HC)[id];
    S.view = { kind: 'card', deck, id };
    S.msg = `${c.k} ${c.t}`;
    log(`${p.name} rút thẻ ${deck === 'q' ? 'Câu hỏi' : 'Hàng xóm'}: ${c.t}`);
    sync();
    await sleep(700);
    await c.run(p);
    if (S.view.kind === 'tile' && S.view.i === p.pos && T[p.pos].type === 'card') S.view = { kind: 'card', deck, id };
  }

  function rentFor(i) {
    const t = T[i], o = S.owner[i];
    if (t.type === 'station') { const n = ownedOfType(o, 'station'); return 25 * 2 ** (n - 1); }
    if (t.type === 'util') { const n = ownedOfType(o, 'util'); return (S.dice[0] + S.dice[1]) * (n === 2 ? 10 : 4); }
    const h = S.houses[i] || 0;
    if (h) return t.rent[h];
    return ownsGroup(o, t.d) ? t.rent[0] * 2 : t.rent[0];
  }
  const ownedOfType = (o, type) => T.filter((t, i) => t.type === type && S.owner[i] === o).length;
  const group = d => T.map((t, i) => (t.d === d ? i : -1)).filter(i => i >= 0);
  const ownsGroup = (o, d) => o != null && group(d).every(i => S.owner[i] === o);

  // ---------- lượt ----------
  async function roll() {
    if (S.busy || S.phase !== 'roll' || S.winner != null) return;
    S.busy = true;
    try { await doRoll(); } finally { S.busy = false; done(); }
  }
  async function doRoll() {
    const p = cur(), a = d6(), b = d6(), dbl = a === b;
    S.dice = [a, b];
    log(`${p.name} lăn ${a} + ${b}${dbl ? ' (đôi)' : ''}.`);
    if (p.jail > 0) {
      if (dbl) { p.jail = 0; say(`${p.name} lăn đôi, rời Trạm Nghỉ.`); await moveBy(p, a + b); }
      else if (++p.jail > 3) { p.jail = 0; pay(p, null, BAIL, 'ngồi đủ 3 lượt, phải trả để đi'); await moveBy(p, a + b); }
      else say(`${p.name} vẫn ngồi ở Trạm Nghỉ (lần thử ${p.jail - 1}/3).`);
      if (S.phase !== 'buy') S.phase = 'end';
      return;
    }
    if (dbl && ++S.doubles === 3) { log('Ba lần đôi liền.'); sendJail(p); S.phase = 'end'; return; }
    await moveBy(p, a + b);
    if (S.phase !== 'buy') afterLand();
  }
  function afterLand() {
    const p = cur(), again = S.dice[0] === S.dice[1] && S.doubles > 0 && p.jail === 0 && !p.out;
    S.phase = again ? 'roll' : 'end';
    if (again) S.msg = `${p.name} lăn đôi, được lăn thêm lần nữa.`;
  }
  function buy() {
    if (S.phase !== 'buy' || S.busy) return;
    const p = cur(), i = p.pos, t = T[i];
    p.money -= t.price; S.owner[i] = S.turn;
    say(`${p.name} mua ${t.name} với giá ${t.price} ${CUR}.`);
    afterLand(); done();
  }
  function skip() {
    if (S.phase !== 'buy' || S.busy) return;
    say(`${cur().name} để ${T[cur().pos].name} cho người sau.`);
    afterLand(); done();
  }
  function bail(useCard) {
    const p = cur();
    if (S.busy || S.phase !== 'roll' || !p.jail) return;
    if (useCard && p.cards) { p.cards--; say(`${p.name} dùng vé, rời Trạm Nghỉ.`); }
    else if (!useCard) pay(p, null, BAIL, 'rời Trạm Nghỉ');
    else return;
    p.jail = 0; done();
  }
  function endTurn() {
    if (S.busy || S.phase !== 'end' || cur().money < 0) return;
    nextPlayer(); done();
  }
  function nextPlayer() {
    let n = S.turn;
    do { n = (n + 1) % S.players.length; if (n === 0) S.round++; } while (S.players[n].out);
    S.turn = n; S.phase = 'roll'; S.doubles = 0;
    const p = cur();
    S.view = { kind: 'tile', i: p.pos };
    S.msg = p.jail ? `${p.name} đang ở Trạm Nghỉ: lăn đôi, trả ${BAIL} ${CUR} hoặc dùng vé.` : `Đến lượt ${p.name}.`;
    if (p.money < 0) S.msg += ` Còn nợ ${-p.money} ${CUR}.`;
  }
  function bankrupt(force) {
    const p = cur();
    if (S.busy || (p.money >= 0 && !force)) return;
    const to = force ? null : p.creditor;
    Object.keys(S.owner).forEach(i => {
      if (S.owner[i] !== S.turn) return;
      delete S.houses[i];
      if (to != null && !S.players[to].out) S.owner[i] = to;
      else { delete S.owner[i]; delete S.mort[i]; }
    });
    p.out = true; p.money = 0;
    say(`${p.name} phá sản${to != null ? ', đất chuyển cho ' + S.players[to].name : ', đất trả về phố'}.`);
    const alive = S.players.filter(x => !x.out);
    if (alive.length === 1) { S.winner = idx(alive[0]); S.msg = `${alive[0].name} giữ được phố.`; return done(); }
    nextPlayer(); done();
  }

  // ---------- quản lý đất ----------
  function can(action, i) {
    const t = T[i], me = S.turn, p = cur();
    if (S.busy || S.winner != null || S.owner[i] !== me) return false;
    const h = S.houses[i] || 0;
    if (action === 'mort') return !S.mort[i] && (t.type !== 'prop' || group(t.d).every(j => !S.houses[j]));
    if (action === 'unmort') return !!S.mort[i] && p.money >= unmortCost(t);
    if (t.type !== 'prop') return false;
    const g = group(t.d), hs = g.map(j => S.houses[j] || 0);
    if (action === 'build') return ownsGroup(me, t.d) && g.every(j => !S.mort[j]) && h < 5 && h <= Math.min(...hs) && p.money >= DISTRICTS[t.d].house;
    if (action === 'sell') return h > 0 && h >= Math.max(...hs);
    return false;
  }
  const unmortCost = t => Math.round((t.price / 2) * 1.1);
  function manage(action, i) {
    if (!can(action, i)) return;
    const p = cur(), t = T[i];
    if (action === 'build') { const c = DISTRICTS[t.d].house; p.money -= c; S.houses[i] = (S.houses[i] || 0) + 1; say(`${p.name} xây ${S.houses[i] === 5 ? 'phố' : 'nhà'} ở ${t.name} (${c} ${CUR}).`); }
    if (action === 'sell') { const c = DISTRICTS[t.d].house / 2; p.money += c; S.houses[i]--; say(`${p.name} bán bớt nhà ở ${t.name}, nhận ${c} ${CUR}.`); }
    if (action === 'mort') { const c = t.price / 2; p.money += c; S.mort[i] = true; say(`${p.name} thế chấp ${t.name}, nhận ${c} ${CUR}.`); }
    if (action === 'unmort') { const c = unmortCost(t); p.money -= c; delete S.mort[i]; say(`${p.name} chuộc lại ${t.name} (${c} ${CUR}).`); }
    if (p.money >= 0) p.creditor = null;
    done();
  }

  // ---------- vẽ ----------
  function cell(i) {
    if (i === 0) return [11, 11];
    if (i < 10) return [11, 11 - i];
    if (i === 10) return [11, 1];
    if (i < 20) return [11 - (i - 10), 1];
    if (i === 20) return [1, 1];
    if (i < 30) return [1, 1 + (i - 20)];
    if (i === 30) return [1, 11];
    return [1 + (i - 30), 11];
  }
  const swClass = t => t.type === 'prop' ? 'd' + t.d : t.type === 'station' ? 'st' : t.type === 'util' ? 'ut' : t.type === 'tax' ? 'tx' : t.type === 'card' ? (t.deck === 'q' ? 'cq' : 'ch') : '';

  const ICONS = {
    home: '<svg class="icon" viewBox="0 0 60 44"><circle cx="46" cy="12" r="7" fill="var(--accent-2)"/><path d="M8 24 L22 12 L36 24 V40 H8Z" fill="none" stroke="var(--ink)" stroke-width="1"/><rect x="18" y="30" width="8" height="10" fill="var(--ink)"/><line x1="0" y1="40" x2="60" y2="40" stroke="var(--ink)" stroke-width=".6"/></svg>',
    jail: '<svg class="icon" viewBox="0 0 60 44"><line x1="6" y1="30" x2="54" y2="30" stroke="var(--ink)" stroke-width="2"/><line x1="12" y1="30" x2="12" y2="40" stroke="var(--ink)"/><line x1="48" y1="30" x2="48" y2="40" stroke="var(--ink)"/><circle cx="22" cy="12" r="3.2" fill="var(--ink)"/><path d="M22 15 V28 M17 20 H27" stroke="var(--ink)"/><circle cx="38" cy="12" r="3.2" fill="var(--ink)"/><path d="M38 15 V28 M33 20 H43" stroke="var(--ink)"/><rect x="34" y="6" width="8" height="2" fill="var(--accent-2)"/></svg>',
    park: '<svg class="icon" viewBox="0 0 60 44"><defs><pattern id="h45" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="var(--neutral)" stroke-width="1.4"/></pattern></defs><rect x="0" y="34" width="60" height="10" fill="url(#h45)"/><circle cx="22" cy="16" r="12" fill="var(--cool-2)"/><line x1="22" y1="26" x2="22" y2="38" stroke="var(--ink)" stroke-width="1.4"/><circle cx="44" cy="22" r="3" fill="var(--ink)"/><path d="M44 25 V36 M40 29 H48" stroke="var(--ink)"/></svg>',
    lost: '<svg class="icon" viewBox="0 0 60 44"><path d="M6 36 C14 6 26 40 32 18 S48 4 52 22" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="2 3"/><path d="M52 22 L47 20 L52 29 L56 20Z" fill="var(--accent)"/><circle cx="6" cy="36" r="3" fill="var(--ink)"/></svg>',
  };

  function renderBoard() {
    const v = view(), sel = v.kind === 'tile' ? v.i : -1;
    let html = '';
    T.forEach((t, i) => {
      const [r, c] = cell(i);
      const here = S.players.map((p, k) => (!p.out && p.pos === i ? pieceSvg(k, 15) : '')).join('');
      const o = S.owner[i], h = S.houses[i] || 0;
      const cls = ['tile', t.type === 'corner' ? 'corner' : '', i === sel ? 'sel' : '', S.mort[i] ? 'mort' : ''].join(' ');
      const style = `grid-row:${r};grid-column:${c}`;
      if (t.type === 'corner') {
        html += `<div class="${cls}" style="${style}" data-tile="${i}" title="${esc(t.name)}">
          <span class="big">${pad(i)}</span><div class="t-name">${t.name}</div>${ICONS[t.key]}<div class="pieces">${here}</div></div>`;
        return;
      }
      const price = buyable(t) ? t.price : t.type === 'tax' ? '−' + t.amount : '?';
      const houses = h === 5 ? '<b></b>' : '<i></i>'.repeat(h);
      html += `<div class="${cls}" style="${style}" data-tile="${i}" title="${esc(t.name)}">
        <div class="t-top"><span class="num">${pad(i)}</span><span class="sw ${swClass(t)}"></span></div>
        <div class="t-name">${t.name}</div>
        <div class="pieces">${here}</div>
        <div class="t-bot"><span>${price}</span><span class="houses">${houses}</span>${o != null ? `<span class="own">${pieceSvg(S.players[o].piece, 10)}</span>` : ''}</div>
      </div>`;
    });
    html += renderCenter();
    $('#board').innerHTML = html;
  }

  function dieSvg(n) {
    const P6 = { 1: [[8, 8]], 2: [[4, 4], [12, 12]], 3: [[4, 4], [8, 8], [12, 12]], 4: [[4, 4], [12, 4], [4, 12], [12, 12]], 5: [[4, 4], [12, 4], [8, 8], [4, 12], [12, 12]], 6: [[4, 4], [12, 4], [4, 8], [12, 8], [4, 12], [12, 12]] };
    return `<svg class="die" viewBox="0 0 16 16">${P6[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" style="fill:${n === 1 ? 'var(--accent-2)' : 'var(--ink)'}"/>`).join('')}</svg>`;
  }

  const SCENE = `<svg class="scene" viewBox="0 0 260 90" aria-hidden="true">
    <line x1="0" y1="80" x2="260" y2="80" stroke="var(--ink)" stroke-width=".6"/>
    <rect x="0" y="80" width="260" height="10" fill="var(--cool-2-l)"/>
    <path d="M0 85 q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="var(--cool-2)" stroke-width=".6"/>
    <rect x="18" y="44" width="34" height="36" fill="none" stroke="var(--ink)" stroke-width=".7"/><path d="M14 44 L35 28 L56 44" fill="none" stroke="var(--ink)" stroke-width=".7"/>
    <rect x="70" y="30" width="22" height="50" fill="var(--d5)"/><circle cx="81" cy="22" r="7" fill="none" stroke="var(--accent)" stroke-width="1"/>
    <g stroke="var(--ink)" stroke-width=".5">${[0, 1, 2, 3, 4, 5].map(k => `<line x1="${104 + k * 5}" y1="50" x2="${104 + k * 5}" y2="80"/>`).join('')}</g>
    <circle cx="170" cy="56" r="16" fill="var(--d7)"/><line x1="170" y1="70" x2="170" y2="80" stroke="var(--ink)"/>
    <circle cx="222" cy="22" r="9" fill="var(--accent-2)"/>
    <g stroke="var(--ink)" stroke-width="1" fill="none"><circle cx="140" cy="59" r="3" fill="var(--ink)"/><path d="M140 62 V72 M135 66 H145 M140 72 L136 80 M140 72 L144 80"/></g>
    <path d="M133 57 L140 52 L147 57Z" fill="var(--accent-2)"/>
    <g stroke="var(--ink)" stroke-width="1" fill="none"><circle cx="200" cy="61" r="2.6" fill="var(--ink)"/><path d="M200 64 V73 M196 67 H204 M200 73 L197 80 M200 73 L203 80"/></g>
  </svg>`;

  function renderCenter() {
    return `<div class="center">
      <span class="reg tl"></span><span class="reg tr"></span><span class="reg bl"></span><span class="reg br"></span>
      <div class="c-left">
        <div class="logo"><small>BOARD GAME / VÒNG ${S.round}</small>Phố<br>Giấy</div>
        <div><div class="dice">${dieSvg(S.dice[0])}${dieSvg(S.dice[1])}</div></div>
        <p class="msg">${esc(S.msg)}</p>
        ${SCENE}
      </div>
      <div class="c-right">${view().kind === 'card' ? eventCard(view()) : deed(view().i)}</div>
    </div>`;
  }

  function deed(i) {
    const t = T[i], o = S.owner[i];
    const kick = { prop: 'Ai sống ở đây?', station: 'Đi đâu hôm nay?', util: 'Ai giữ cho phố sáng?', tax: 'Phải đóng gì?', card: 'Rút một thẻ?', corner: 'Dừng lại ở đâu?' }[t.type];
    const group = t.type === 'prop' ? DISTRICTS[t.d].name : t.type === 'station' ? 'Nhà ga' : t.type === 'util' ? 'Tiện ích' : t.name;
    let body = '';
    if (t.type === 'prop') {
      const h = S.houses[i] || 0, full = ownsGroup(o, t.d);
      const rows = [['đất trống', t.rent[0]], ['cả quận, đất trống', t.rent[0] * 2], ['1 nhà', t.rent[1]], ['2 nhà', t.rent[2]], ['3 nhà', t.rent[3]], ['4 nhà', t.rent[4]], ['phố', t.rent[5]]];
      const on = o == null ? -1 : h ? h + 1 : full ? 1 : 0;
      body = `<table class="rent">${rows.map((r, k) => `<tr class="${k === on ? 'on' : ''}"><td>${r[0]}</td><td>${r[1]} ${CUR}</td></tr>`).join('')}</table>
        <div class="foot">giá mua <b>${t.price} ${CUR}</b> · xây nhà ${DISTRICTS[t.d].house} · thế chấp ${t.price / 2}</div>`;
    } else if (t.type === 'station') {
      body = `<table class="rent">${[1, 2, 3, 4].map(n => `<tr class="${o != null && ownedOfType(o, 'station') === n ? 'on' : ''}"><td>sở hữu ${n} ga</td><td>${25 * 2 ** (n - 1)} ${CUR}</td></tr>`).join('')}</table>
        <div class="foot">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
    } else if (t.type === 'util') {
      body = `<table class="rent"><tr><td>1 tiện ích</td><td>4 × xúc xắc</td></tr><tr><td>cả 2 tiện ích</td><td>10 × xúc xắc</td></tr></table>
        <div class="foot">giá mua <b>${t.price} ${CUR}</b> · thế chấp ${t.price / 2}</div>`;
    } else if (t.type === 'tax') {
      body = `<div class="foot">đóng <b>${t.amount} ${CUR}</b> cho phố</div>`;
    } else if (t.type === 'card') {
      body = `<div class="foot">dừng ở đây → rút một thẻ ${t.name}</div>`;
    }
    const owner = buyable(t) ? `<div class="act">${o == null ? 'chưa có ai ở' : 'chủ: ' + esc(S.players[o].name) + (S.mort[i] ? ' · đang thế chấp' : '')}</div>` : '';
    return `<div class="card">
      <div class="strip"><span>Phố Giấy / ${group}</span><span>${pad(i)} / 40</span></div>
      <div class="k-row"><span class="kicker">${kick}</span>${t.type === 'corner' ? '' : `<span class="sw lg ${swClass(t)}"></span>`}</div>
      <h3>${t.name}</h3>
      ${t.human ? `<p class="human">${t.human}</p>` : ''}
      ${body}${owner}
    </div>`;
  }

  function eventCard(v) {
    const c = (v.deck === 'q' ? QC : HC)[v.id];
    return `<div class="card">
      <div class="strip"><span>Phố Giấy / ${v.deck === 'q' ? 'Câu hỏi' : 'Hàng xóm'}</span><span>thẻ ${String(v.id + 1).padStart(2, '0')}</span></div>
      ${v.deck === 'q' ? '<span class="mark">?</span>' : ''}
      <div class="kicker">${c.k}</div>
      <h3>${c.t}</h3>
      <div class="act">→ ${c.a}</div>
    </div>`;
  }

  function renderSide() {
    const p = cur(), alive = S.players.filter(x => !x.out).length;
    const me = NET.me, mine = me === S.turn && S.winner == null, host = NET.role === 'host';
    const human = S.winner != null ? 'Phố vẫn còn đó, và những người đã sống ở đây.'
      : !mine ? (me < 0 ? 'Bạn đang xem ván này.' : `Pha ấm trà, chờ ${esc(p.name)} lăn xúc xắc.`)
      : p.jail ? 'Ngồi ghế đá, ngắm người qua lại.'
      : { roll: 'Xúc xắc đang chờ trong lòng bàn tay.', buy: 'Một mảnh phố đang chờ người đến ở.', end: 'Uống ngụm trà rồi chuyền xúc xắc.' }[S.phase];
    const title = S.winner != null ? `${esc(S.players[S.winner].name)} giữ được phố.` : mine ? 'Lượt của bạn.' : `Lượt của ${esc(p.name)}.`;
    const B = (act, label, primary, enabled = true, arg = '') =>
      `<button class="btn ${primary ? 'primary' : ''}" data-act="${act}" data-arg="${arg}" ${enabled && !S.busy ? '' : 'disabled'}>${label}</button>`;

    let actions = '';
    if (S.winner != null) actions = host ? B('new', 'Ván mới', true) : '<span class="label">chờ chủ phòng mở ván mới</span>';
    else if (!mine) {
      actions = `<span class="label">${p.online === false ? esc(p.name) + ' đang mất kết nối…' : 'đang chờ ' + esc(p.name) + '…'}</span>`;
      if (host && p.online === false) actions += B('kick', `Cho ${esc(p.name)} rời ván`, false);
    } else if (S.phase === 'roll') {
      actions = B('roll', p.jail ? 'Lăn tìm đôi' : 'Lăn xúc xắc', true);
      if (p.jail) actions += B('bail', `Trả ${BAIL} ${CUR}`, false, p.money >= BAIL) + (p.cards ? B('card', 'Dùng vé', false) : '');
    } else if (S.phase === 'buy') {
      const t = T[p.pos];
      actions = B('buy', `Mua ${t.name} — ${t.price} ${CUR}`, true) + B('skip', 'Bỏ qua', false);
    } else {
      actions = B('end', 'Kết thúc lượt', true, p.money >= 0) + (p.money < 0 ? B('bankrupt', 'Phá sản', false) : '');
    }

    let manage = '';
    const v = view();
    if (mine && v.kind === 'tile' && S.owner[v.i] === S.turn) {
      const i = v.i, t = T[i];
      manage = `<div><div class="label">quản lý ${esc(t.name)}</div><div class="manage">
        ${t.type === 'prop' ? `<button class="btn sm" data-act="build" data-arg="${i}" ${can('build', i) ? '' : 'disabled'}>Xây nhà (${DISTRICTS[t.d].house})</button>
        <button class="btn sm" data-act="sell" data-arg="${i}" ${can('sell', i) ? '' : 'disabled'}>Bán nhà (+${DISTRICTS[t.d].house / 2})</button>` : ''}
        ${S.mort[i] ? `<button class="btn sm" data-act="unmort" data-arg="${i}" ${can('unmort', i) ? '' : 'disabled'}>Chuộc (${unmortCost(t)})</button>`
          : `<button class="btn sm" data-act="mort" data-arg="${i}" ${can('mort', i) ? '' : 'disabled'}>Thế chấp (+${t.price / 2})</button>`}
      </div></div>`;
    } else if (mine) {
      manage = `<div class="label">bấm vào ô đất của mình trên bàn cờ để xây nhà hoặc thế chấp</div>`;
    }

    $('#side').innerHTML = `
      <div>
        <div class="strip"><span>Phố Giấy / Phòng ${esc(NET.room)}</span><span>Vòng ${S.round}</span></div>
        <div class="kicker">${S.winner != null ? 'Ai giữ được phố?' : 'Đến lượt ai?'}</div>
        <h2>${title}</h2>
        <p class="human">${human}</p>
      </div>
      <div class="players">${S.players.map((x, k) => `
        <div class="pl ${k === S.turn && S.winner == null ? 'cur' : ''} ${x.out ? 'out' : ''}">
          ${pieceSvg(x.piece, 18)}<span class="nm">${esc(x.name)}${k === me ? ' <span class="label">(bạn)</span>' : ''}</span>
          <span class="tag">${[x.online === false && !x.out ? 'mất kết nối' : '', x.jail ? 'trạm nghỉ' : '', x.cards ? 'vé ×' + x.cards : '', Object.values(S.owner).filter(o => o === k).length + ' ô'].filter(Boolean).join(' · ')}</span>
          <span class="money ${x.money < 0 ? 'neg' : ''}">${x.money}</span>
        </div>`).join('')}</div>
      <div class="actions">${actions}</div>
      ${manage}
      <ul class="log">${S.log.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      <div class="sources">Phố Giấy · phòng ${esc(NET.room)} · ${alive} người còn chơi${NET.status ? ' · ' + esc(NET.status) : ''} · <a href="#" data-act="leave" style="color:inherit">rời phòng</a></div>`;
  }

  function render() { if (!S) return; renderBoard(); renderSide(); }

  // Ô đang xem: mỗi máy tự bấm xem ô riêng; khi trạng thái chung đổi ô (quân vừa dừng) thì theo trạng thái chung.
  let viewOverride = null, lastView = '';
  function view() {
    const sv = JSON.stringify(S.view);
    if (sv !== lastView) { lastView = sv; viewOverride = null; }
    return viewOverride || S.view;
  }

  // ---------- luật: máy chủ nhận thao tác của từng ghế ----------
  function dispatch(seat, act, arg) {
    if (!S) return;
    if (act === 'new') { if (seat === 0 && S.winner != null) startGame(); return; }
    if (act === 'kick') { if (seat === 0 && cur().online === false && S.winner == null) bankrupt(true); return; }
    if (seat !== S.turn || S.winner != null) return;
    if (act === 'roll') roll();
    else if (act === 'buy') buy();
    else if (act === 'skip') skip();
    else if (act === 'end') endTurn();
    else if (act === 'bail') bail(false);
    else if (act === 'card') bail(true);
    else if (act === 'bankrupt') bankrupt();
    else if (['build', 'sell', 'mort', 'unmort'].includes(act) && Number.isInteger(arg) && arg >= 0 && arg < 40) manage(act, arg);
  }
  function act(a, arg) {
    if (NET.role === 'host') dispatch(0, a, arg);
    else if (NET.hostConn && NET.hostConn.open) NET.hostConn.send({ t: 'act', act: a, arg });
  }

  // ---------- mạng (PeerJS) ----------
  const PREFIX = 'phogiay-v1-';
  const SESSION_KEY = 'phogiay-session';
  const PEER_OPTS = { config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] } };
  const NET = { role: null, room: '', peer: null, conns: new Map(), seats: [], hostConn: null, me: -1, lobby: [], started: false, status: '', token: '', name: '' };
  const newToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const makeCode = () => { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; return Array.from({ length: 5 }, () => A[Math.floor(Math.random() * A.length)]).join(''); };
  const readSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; } };
  const roomUrl = code => location.href.split(/[?#]/)[0] + '?room=' + code;
  function setStatus(s) { NET.status = s; renderAll(); }
  function setUrl(code) { try { history.replaceState(null, '', code ? '?room=' + code : location.pathname); } catch (e) { /* file:// */ } }

  // máy chủ phòng
  function saveHost() {
    if (NET.role !== 'host' || !S) return;
    try { localStorage.setItem('phogiay-room-' + NET.room, JSON.stringify({ S: { ...S, busy: false }, seats: NET.seats.map(x => ({ name: x.name, token: x.token })) })); } catch (e) { /* bỏ qua */ }
  }
  function hostRoom(name, code) {
    NET.role = 'host'; NET.room = code; NET.me = 0; NET.name = name;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'host', room: code, name }));
    setUrl(code);
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('phogiay-room-' + code)); } catch (e) { /* bỏ qua */ }
    if (saved && saved.S && saved.seats) {
      S = saved.S; S.busy = false;
      NET.seats = saved.seats.map((x, i) => ({ ...x, peerId: null, online: i === 0 }));
      S.players.forEach((x, i) => { x.online = i === 0; });
      NET.started = true;
    } else {
      S = null; NET.started = false;
      NET.seats = [{ name, token: newToken(), peerId: null, online: true }];
    }
    openHostPeer(0);
  }
  function openHostPeer(attempt) {
    setStatus('đang mở phòng…');
    const peer = new Peer(PREFIX + NET.room, PEER_OPTS);
    NET.peer = peer;
    peer.on('open', () => setStatus('phòng đã mở'));
    peer.on('connection', conn => {
      conn.on('data', d => onHostData(conn, d));
      conn.on('close', () => onHostClose(conn));
      conn.on('error', () => onHostClose(conn));
    });
    peer.on('disconnected', () => { if (!peer.destroyed) try { peer.reconnect(); } catch (e) { /* bỏ qua */ } });
    peer.on('error', err => {
      if (err.type === 'unavailable-id' && attempt < 15) { setStatus('mã phòng còn bận, thử lại…'); peer.destroy(); setTimeout(() => openHostPeer(attempt + 1), 3000); }
      else if (err.type !== 'peer-unavailable') setStatus('lỗi kết nối: ' + err.type);
    });
  }
  const seatOf = conn => NET.seats.findIndex(x => x.peerId === conn.peer);
  function onHostData(conn, d) {
    if (!d || typeof d !== 'object') return;
    if (d.t === 'hello') {
      const name = String(d.name || '').trim().slice(0, 14) || 'Khách';
      const tok = String(d.token || '');
      let seat = tok ? NET.seats.findIndex(x => x.token === tok) : -1;
      if (seat < 0 && !NET.started) {
        if (NET.seats.length >= 6) { conn.send({ t: 'error', msg: 'Phòng đã đủ 6 người.' }); return; }
        NET.seats.push({ name, token: tok || newToken(), peerId: conn.peer, online: true });
        seat = NET.seats.length - 1;
      }
      NET.conns.set(conn.peer, conn);
      if (seat >= 0) {
        const x = NET.seats[seat];
        x.peerId = conn.peer; x.online = true;
        if (!NET.started) x.name = name;
        if (S && S.players[seat]) { S.players[seat].online = true; log(`${S.players[seat].name} đã vào lại phòng.`); }
      }
      broadcastLobby();
      if (S) done(); else renderAll();
    } else if (d.t === 'act') {
      const seat = seatOf(conn);
      if (seat > 0) dispatch(seat, String(d.act), Number(d.arg));
    }
  }
  function onHostClose(conn) {
    if (!NET.conns.has(conn.peer)) return;
    NET.conns.delete(conn.peer);
    const seat = seatOf(conn);
    if (seat < 0) return;
    if (!NET.started) NET.seats.splice(seat, 1);
    else {
      NET.seats[seat].online = false;
      if (S && S.players[seat]) { S.players[seat].online = false; log(`${S.players[seat].name} mất kết nối.`); }
    }
    broadcastLobby();
    if (S) done(); else renderAll();
  }
  function broadcastLobby() {
    const seats = NET.seats.map(x => ({ name: x.name, online: x.online }));
    NET.conns.forEach(c => { if (c.open) c.send({ t: 'lobby', seats, you: seatOf(c), started: NET.started }); });
  }
  function broadcastState() {
    if (NET.role !== 'host' || !S) return;
    NET.conns.forEach(c => { if (c.open) c.send({ t: 'state', S, you: seatOf(c) }); });
  }
  function startGame() {
    if (NET.role !== 'host' || NET.seats.length < 2) return;
    NET.started = true;
    newGame(NET.seats.map(x => x.name));
    S.players.forEach((x, i) => { x.online = NET.seats[i].online; });
    broadcastLobby(); done();
  }

  // máy khách
  function joinRoom(name, code) {
    const ses = readSession();
    NET.role = 'guest'; NET.room = code; NET.name = name;
    NET.token = (ses && ses.role === 'guest' && ses.room === code && ses.token) || newToken();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role: 'guest', room: code, name, token: NET.token }));
    setUrl(code);
    const peer = new Peer(PEER_OPTS);
    NET.peer = peer;
    setStatus('đang kết nối…');
    peer.on('open', connectHost);
    peer.on('disconnected', () => { if (!peer.destroyed) try { peer.reconnect(); } catch (e) { /* bỏ qua */ } });
    peer.on('error', err => {
      if (err.type === 'peer-unavailable') { setStatus(`chưa thấy phòng ${code} — chủ phòng còn mở trang không? đang thử lại…`); retry(); }
      else setStatus('lỗi kết nối: ' + err.type);
    });
  }
  let retryTimer = null;
  function retry() { if (retryTimer) return; retryTimer = setTimeout(() => { retryTimer = null; if (NET.peer && !NET.peer.destroyed && NET.peer.open) connectHost(); }, 3000); }
  function connectHost() {
    if (NET.hostConn && NET.hostConn.open) return;
    const conn = NET.peer.connect(PREFIX + NET.room, { reliable: true });
    NET.hostConn = conn;
    conn.on('open', () => { conn.send({ t: 'hello', name: NET.name, token: NET.token }); setStatus('đã vào phòng'); });
    conn.on('data', onGuestData);
    conn.on('close', () => { if (NET.hostConn === conn) { NET.hostConn = null; setStatus('mất kết nối với chủ phòng, đang thử lại…'); retry(); } });
  }
  function onGuestData(d) {
    if (!d || typeof d !== 'object') return;
    if (d.t === 'lobby') { NET.lobby = d.seats; NET.me = d.you; NET.started = d.started; renderAll(); }
    else if (d.t === 'state') { S = d.S; NET.me = d.you; NET.started = true; renderAll(); }
    else if (d.t === 'error') setStatus(d.msg);
  }

  function leaveRoom() {
    if (!confirm(NET.role === 'host' ? 'Rời phòng? Phòng sẽ đóng với mọi người cho tới khi bạn mở lại mã này.' : 'Rời phòng?')) return;
    sessionStorage.removeItem(SESSION_KEY);
    if (NET.peer) NET.peer.destroy();
    setUrl('');
    location.reload();
  }

  // ---------- sự kiện ----------
  document.addEventListener('click', e => {
    const tile = e.target.closest('[data-tile]');
    if (tile && S) { view(); viewOverride = { kind: 'tile', i: +tile.dataset.tile }; render(); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    e.preventDefault();
    const a = b.dataset.act, arg = +b.dataset.arg;
    if (a === 'leave') return leaveRoom();
    if (!S) return;
    if (a === 'bankrupt' && !confirm('Phá sản và rời ván?')) return;
    if (a === 'kick' && !confirm(`${cur().name} đang mất kết nối. Cho người này phá sản, đất trả về phố?`)) return;
    act(a, arg);
  });
  document.addEventListener('keydown', e => {
    if (!S || !$('#setup').hidden || e.target.tagName === 'INPUT' || NET.me !== S.turn) return;
    if (e.code === 'Space') { e.preventDefault(); act('roll'); }
    else if (e.key === 'b' || e.key === 'B') act('buy');
    else if (e.key === 'e' || e.key === 'E') act('end');
  });

  // ---------- sảnh: tạo / vào phòng ----------
  const savedName = () => localStorage.getItem('phogiay-name') || '';
  function renderAll() {
    const inGame = S && NET.started;
    $('#setup').hidden = !!inGame;
    if (inGame) render(); else renderLobby();
  }
  function renderLobby() {
    const sheet = $('#setup .sheet');
    if (!NET.role) {
      const code = (new URLSearchParams(location.search).get('room') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      sheet.innerHTML = `
        <div class="strip"><span>Phố Giấy / Chơi online</span><span>2–6 người</span></div>
        <div class="kicker">Ai sẽ sống ở phố này?</div>
        <h1>Mỗi người một máy, chung một con phố.</h1>
        <p class="human">Một người tạo phòng rồi gửi mã cho bạn bè; mỗi người mở trên máy của mình.</p>
        <label class="field"><span class="label">tên của bạn</span><input id="nm" maxlength="14" value="${esc(savedName())}" placeholder="ví dụ: Lan"></label>
        ${code ? `
          <div class="row"><button class="btn primary" id="join">Vào phòng ${code}</button></div>
          <p class="small">hoặc <a href="#" id="create" style="color:inherit">tạo phòng mới</a></p>` : `
          <div class="row"><button class="btn primary" id="create">Tạo phòng mới</button></div>
          <div class="or label">— hoặc vào phòng của bạn bè —</div>
          <div class="row"><input id="code" class="code-in" maxlength="5" placeholder="MÃ PHÒNG"><button class="btn" id="join">Vào phòng</button></div>`}
        <p class="small" id="err"></p>`;
      const getName = () => { const n = $('#nm').value.trim().slice(0, 14); if (!n) { $('#err').textContent = 'nhập tên trước đã'; $('#nm').focus(); return null; } localStorage.setItem('phogiay-name', n); return n; };
      $('#create').onclick = e => { e.preventDefault(); const n = getName(); if (n) hostRoom(n, makeCode()); };
      $('#join').onclick = () => {
        const n = getName(); if (!n) return;
        const c = code || $('#code').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (c.length !== 5) { $('#err').textContent = 'mã phòng có 5 ký tự'; return; }
        joinRoom(n, c);
      };
      return;
    }
    const seats = NET.role === 'host' ? NET.seats : NET.lobby;
    const url = roomUrl(NET.room);
    sheet.innerHTML = `
      <div class="strip"><span>Phố Giấy / Phòng ${esc(NET.room)}</span><span>${seats.length} / 6</span></div>
      <div class="kicker">Ai đã đến?</div>
      <h1>Phòng <span class="room-code">${esc(NET.room)}</span></h1>
      <p class="human">Gửi mã hoặc đường link cho bạn bè. Ai mở link trên máy mình là vào được phòng.</p>
      <div class="row"><input class="link" readonly value="${esc(url)}"><button class="btn" id="copy">Sao chép link</button></div>
      <div class="players lobby">${seats.map((x, k) => `
        <div class="pl">${pieceSvg(k, 18)}<span class="nm">${esc(x.name)}${k === NET.me ? ' <span class="label">(bạn)</span>' : ''}</span>
          <span class="tag">${k === 0 ? 'chủ phòng' : x.online === false ? 'mất kết nối' : 'đã vào'}</span></div>`).join('') || '<div class="label" style="padding:8px 0">đang chờ…</div>'}</div>
      <div class="row">${NET.role === 'host'
        ? `<button class="btn primary" id="go" ${seats.length >= 2 && NET.peer && NET.peer.open ? '' : 'disabled'}>Bắt đầu ván</button>`
        : '<span class="label" style="align-self:center">chờ chủ phòng bắt đầu ván…</span>'}
        <button class="btn" data-act="leave">Rời phòng</button></div>
      <p class="small">${esc(NET.status)}${NET.role === 'host' && seats.length < 2 ? ' · cần ít nhất 2 người' : ''}</p>`;
    $('#copy').onclick = () => {
      const inp = sheet.querySelector('.link'); inp.select();
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => document.execCommand('copy'));
      $('#copy').textContent = 'Đã chép';
    };
    const go = $('#go'); if (go) go.onclick = startGame;
  }

  // ---------- khởi động ----------
  if (typeof Peer === 'undefined') {
    $('#setup').hidden = false;
    $('#setup .sheet').innerHTML = '<div class="kicker">Không tải được thư viện kết nối</div><h1>Cần có mạng để chơi online.</h1><p class="human">Kiểm tra kết nối internet rồi tải lại trang.</p>';
    return;
  }
  const ses = readSession();
  if (ses && ses.role === 'host' && ses.room) hostRoom(ses.name, ses.room);
  else if (ses && ses.role === 'guest' && ses.room) joinRoom(ses.name, ses.room);
  else renderAll();

  // dùng khi kiểm thử
  window.__phogiay = { get S() { return S; }, NET, act, hostRoom, joinRoom, startGame };
})();
