# Rời GitHub Pages? Kế hoạch hoạt ảnh và nơi chạy game

> **Bản nháp 2, 2026-11-28.** Người dùng chốt: **làm Giai đoạn A trước** (đã làm phần lõi, xem mục 2). **Giai đoạn B (đổi host/server) để PENDING**, tiếp tục tìm hiểu (mục 3b).
> Lý do: người dùng thấy game chạy hoạt ảnh yếu và muốn bỏ GitHub Pages.

---

## 1. Chẩn đoán: hoạt ảnh yếu là do code, không phải do GitHub Pages

GitHub Pages chỉ **gửi file** (HTML, JS, ảnh) về trình duyệt một lần. Mọi hoạt ảnh chạy **trong trình duyệt** của người chơi, nên chuyển sang nơi khác **không làm hoạt ảnh mượt hơn**.

Nguyên nhân thật nằm ở `src/main.js`:

```js
// show(): mỗi bước quân đi
for (const p of e.path) { app.pos[e.seat] = p; render(); await sleep(STEP_MS); }

// render(): vẽ lại TOÀN BỘ trang
root.innerHTML = V.gameHtml(app.S, c);
```

Mỗi ô quân đi qua, game xóa cả trang (40 ô, cột người chơi, nhật ký) rồi dựng lại từ chuỗi HTML. Hậu quả:
1. **Quân "nhảy cóc" từng ô** chứ không trượt, vì phần tử quân bị xóa và tạo mới nên không thể có `transition`.
2. Mỗi bước, trình duyệt phải tính lại bố cục cả trang, nên giật trên điện thoại yếu.
3. **Chặn K1 (0.6.0):** sprite pixel chạy bằng CSS `steps()`. Mỗi lần `render()`, phần tử sprite bị tạo lại nên hoạt ảnh **quay về khung đầu**: quân đi bộ sẽ không bao giờ bước được hết 4 khung.

Những thứ GitHub Pages **thật sự** yếu (không liên quan tới độ mượt):

| Điểm yếu | Ảnh hưởng |
|---|---|
| Không có máy chủ chạy code | Online phải dựa vào máy chủ PeerJS công cộng miễn phí để nối 2 máy; lúc nó chậm hoặc sập thì không vào phòng được. Chủ phòng tắt máy thì ván mất. |
| Cache cố định 10 phút, không chỉnh header | Ảnh sprite và font tải lại nhiều hơn cần thiết. Bản mới có thể tới chậm 10 phút. |
| Không có bản xem thử cho từng nhánh | Chỉ có `/next/` cho `dev`; nhánh của Codex, Agy phải chạy trên máy. |

---

## 2. Giai đoạn A: lớp hoạt ảnh mới (BẮT BUỘC, ở host nào cũng phải làm)

### Đã làm (2026-11-28, trên `dev`)
- `src/ui/pieces.js`: lớp quân nằm ngoài `#root`, mỗi quân là một phần tử sống suốt ván.
  - `walk()`: đi từng ô, mỗi bước nhảy nhẹ, bằng `transform`.
  - `jump()`: bay vòng cung (máy bay, vào Tù).
  - Tôn trọng `prefers-reduced-motion`.
- `main.js`:
  - `show()` chỉ vẽ lại trang **1 lần** khi bắt đầu đi (trước đây 1 lần cho **mỗi** ô);
  - đặt lại quân sau mỗi `render()`, khi đổi cỡ cửa sổ và khi font tải xong.
- `view.js`: `ctx.layer` thì ô không vẽ quân nữa.
- `?fps` hiện số khung hình mỗi giây khi thử.
- Đo bằng Edge headless, đi 11 ô:
  - `#root` chỉ bị thay **2 lần** (code cũ: mỗi ô một lần, tức khoảng 12 lần);
  - quân đứng đúng ô trên desktop 1440px và điện thoại 390px (CPU chậm ×4).
- E2E thêm 3 kiểm tra (quân đúng ô, không vẽ lại mỗi bước): 27/27 xanh.

### Còn lại, làm trong K1 khi có sprite
- Thay `pieceSvg` bằng sprite của Codex (`spriteHtml`). Lớp quân giữ phần tử nên `steps()` không bị khởi động lại.
- `walk` khi di chuyển và lật hướng ở góc; `happy`/`sad` theo sự kiện.
- Vẽ lại có chọn lọc phần cột bên (mục 3 dưới) nếu đo thấy còn giật.

### Thiết kế ban đầu

1. **Tách lớp quân khỏi bàn cờ.**
   - Bàn cờ (40 ô) vẫn dựng bằng HTML như cũ.
   - Thêm một lớp `<div class="pieces-layer">` phủ lên bàn. Mỗi quân là **một phần tử sống suốt ván**: không bao giờ bị `innerHTML` xóa.
2. **Quân trượt bằng `transform`.**
   - Vị trí mỗi ô tính sẵn từ lưới bàn cờ (đo lại khi đổi kích thước cửa sổ).
   - Quân đi bằng Web Animations API (`el.animate(...)` với `translate`). Chỉ dùng `transform` và `opacity`, nên trình duyệt chạy trên GPU, không tính lại bố cục.
   - Khi đi, sprite chuyển sang `walk`; tới góc bàn thì lật hướng.
3. **Vẽ lại có chọn lọc.**
   - `render()` không đụng tới lớp quân.
   - Cột người chơi, thẻ, nhật ký chỉ vẽ lại phần đổi. Ván đầu tiên có thể làm đơn giản: chỉ vẽ lại vùng đó khi state đổi, không vẽ lại mỗi bước quân.
4. **Hoạt ảnh theo sự kiện:** `happy` / `sad` gắn vào chính phần tử quân, tự quay về `idle` sau 1–2 giây.
5. **Đo và tiêu chí xong:**
   - Chrome/Edge DevTools → Performance, khi quân đi 12 ô: không có khung nào quá 16 ms do layout.
   - Mượt trên điện thoại tầm trung (thử bằng CPU throttling ×4).
   - Thêm cờ `?fps` hiện số khung hình mỗi giây khi thử.
   - E2E hiện có vẫn xanh.
6. **Chưa cần canvas/WebGL.** Bàn cờ 40 ô + 6 quân là quá nhẹ. Chỉ cân nhắc canvas (hoặc PixiJS) cho lớp hiệu ứng nếu sau này có pháo hoa, mưa tiền hàng trăm hạt.

Phương án dự phòng: nếu tách lớp vẫn chưa đủ, tách hẳn thành thư viện nhỏ dựng DOM có diff (như Preact, khoảng 4 KB, chạy không cần build qua `esm.sh`). Không cần đổi nơi chạy.

---

## 3. Giai đoạn B: có nên rời GitHub Pages? So sánh nơi chạy

Tra cứu ngày 2026-11-28 (nguồn ở cuối file). Số liệu gói miễn phí có thể đổi, kiểm tra lại trước khi làm.

| Phương án | Chi phí | Điểm mạnh | Điểm yếu | Hợp với game này? |
|---|---|---|---|---|
| **Giữ GitHub Pages** | 0 | Đang chạy ổn, đã có `/v/`, `/next/`, rollback | Không máy chủ, cache 10 phút | Đủ cho giao diện; **yếu cho online** |
| **Cloudflare Workers + Static Assets** | 0 (gói Free) | File tĩnh miễn phí không giới hạn, CDN mạnh ở châu Á, tự đặt cache, URL xem thử cho mỗi nhánh | Phải học `wrangler`, chuyển lại workflow deploy | **Tốt nhất** |
| ↳ thêm **Durable Objects** (máy chủ phòng) | 0 trong hạn mức Free (khoảng 100 000 request/ngày; tin WebSocket tính 20 tin = 1 request) | Mỗi phòng là một "máy chủ nhỏ" giữ state và chạy `rules.js`. WebSocket ổn định, chủ phòng tắt máy ván vẫn còn | Viết thêm phần server, đổi giao thức (PROTOCOL 5) | **Đúng mục tiêu "Phòng bền"** |
| Netlify | 0 (300 credit/tháng) | Dễ dùng | Hết credit thì **cả trang bị tạm dừng** tới tháng sau; không có WebSocket server | Không nên |
| Vercel Hobby | 0 | Nhanh, xem thử từng nhánh | **Chỉ dùng phi thương mại**; không giữ WebSocket lâu | Không nên |
| VPS riêng (Node + WebSocket) | khoảng 5 USD/tháng | Toàn quyền | Tự lo bảo mật, cập nhật, sập máy | Chỉ khi Cloudflare không đủ |
| itch.io | 0 | Có cộng đồng người chơi game | Không có server, không có lịch sử phiên bản `/v/` | Có thể đăng thêm bản giới thiệu sau 1.0 |

### Đề xuất
- **Cloudflare**, chia 2 bước:
  - **B1:** chỉ chuyển file tĩnh, vẫn dùng PeerJS;
  - **B2:** thay PeerJS bằng Durable Objects.
- Engine đã là hàm thuần `applyAction(state, seat, action)`, nên đưa lên Durable Object gần như không phải sửa luật.
- **Giữ GitHub Pages chạy song song** tới khi Cloudflare ổn định 2 tuần. Sau đó trang cũ chỉ còn trang chuyển hướng sang địa chỉ mới.

---

## 3b. Tìm hiểu thêm (Giai đoạn B đang PENDING)

### Đã tìm thêm (2026-11-28)
- **GitHub Pages:**
  - đặt cứng `Cache-Control: max-age=600` cho mọi file, không cho đổi header;
  - cách thường dùng là đặt Cloudflare phía trước hoặc chuyển host.
- **Máy chủ PeerJS công cộng (`0.peerjs.com`):**
  - dịch vụ miễn phí do cộng đồng góp tiền, không cam kết thời gian hoạt động;
  - có báo cáo nối chậm tới 6 phút;
  - chạy ở cổng 443, mạng chặn cổng này thì không vào được;
  - PeerJS khuyên app thật nên tự chạy PeerServer.
  - Đây là **rủi ro lớn nhất hiện tại** của chế độ online, lớn hơn chuyện host trang.
- **PartyKit / PartyServer:**
  - Cloudflare mua PartyKit (4/2024);
  - PartyServer là lớp mỏng trên Durable Objects: phòng, WebSocket, phát tin cho cả phòng;
  - giấy phép MIT, không thu thêm phí ngoài phí Workers.
  - Có thể dùng để viết máy chủ phòng (B2) nhanh hơn.

### Lý do mới (2026-11-28): chế độ "Xóm lạ" cần giữ bí mật
Ô trong sương và lệ ẩn phải nằm ở nơi người chơi không đọc được. Máy chủ phòng P2P thì chủ phòng luôn đọc được. Người dùng chốt: chơi thử với bạn bè thì chấp nhận; **mở cho người lạ thì phải có máy chủ phòng (B2) trước**. Xem `docs/XOM_LA.md` mục I.9.

### Cần tìm hiểu tiếp trước khi quyết
1. Hạn mức gói Free của Workers: CPU mỗi request, số request/ngày. Ước tính 1 ván 4 người, 45 phút, dùng bao nhiêu request (WebSocket tính 20 tin = 1 request).
2. Độ trễ từ Việt Nam tới Cloudflare (có điểm ở Hà Nội, TP.HCM?) so với PeerJS P2P.
3. Phương án ở giữa, không đổi host: tự chạy PeerServer (Docker) hoặc đổi sang PartyServer chỉ cho phần online, trang vẫn ở GitHub Pages.
4. Tên miền: `*.workers.dev` có bị chặn ở mạng nào tại Việt Nam không.
5. Đo thật: tốc độ tải trang lần đầu trên 4G (GitHub Pages so với Cloudflare) khi đã có sprite và font pixel (khoảng 300–500 KB ảnh).

## 4. Lộ trình thực hiện (chờ duyệt)

| Bước | Việc | Bản | Ai | Rollback |
|---|---|---|---|---|
| A | Lớp hoạt ảnh mới (mục 2), làm cùng K1 | 0.6.0 | Claude | revert commit |
| B0 | **Người dùng:** tạo tài khoản Cloudflare (miễn phí); chọn tên miền: `*.workers.dev` miễn phí, hoặc mua tên riêng khoảng 10 USD/năm | | người dùng | |
| B1 | Đưa file tĩnh lên Cloudflare Workers Static Assets: `wrangler.toml`; workflow deploy mới dựng `/`, `/next/`, `/v/X.Y.Z/`, `/versions/` như hiện tại; header cache dài cho ảnh và font, ngắn cho HTML | 0.6.x | Claude | trang GitHub Pages vẫn chạy |
| B1' | Kiểm tra: e2e chạy với `BASE_URL` của Cloudflare; đo tốc độ tải trên 4G | | Claude | |
| B2 | `server/room.js`: Durable Object giữ state, chạy `rules.js`, phát state qua WebSocket. `net/` có thêm transport `ws` cạnh `peer`; chọn bằng cờ, PeerJS giữ làm dự phòng | 0.7.0 Phòng bền | Claude | bật lại transport `peer` |
| B3 | Nối lại khi rớt mạng, chủ phòng rời ván vẫn chạy, khán giả (các mục của "Phòng bền") | 0.7.x | Claude | |
| B4 | GitHub Pages chỉ còn trang chuyển hướng; cập nhật README, RELEASE.md, CLAUDE.md | sau 2 tuần ổn định | Claude | |

**Ảnh hưởng tới lộ trình:**
- 0.6.0 trở thành "Pixel", gồm giao diện pixel và Giai đoạn A.
- "Phòng bền" lùi sang 0.7.0 và dùng Durable Objects (B2, B3).
- ROADMAP sẽ đánh số lại khi người dùng duyệt plan này.

---

## 5. Người dùng cần quyết
1. Đồng ý chẩn đoán ở mục 1 và làm Giai đoạn A trong K1?
2. Có chuyển sang Cloudflare không? Nếu có: dùng `*.workers.dev` miễn phí hay mua tên miền riêng?
3. Có thay PeerJS bằng máy chủ phòng (Durable Objects) ở 0.7.0 không?

## Nguồn
- Durable Objects có trong gói Free (2025-04-07): https://developers.cloudflare.com/changelog/2025-04-07-durable-objects-free-tier
- Giá và hạn mức Durable Objects: https://developers.cloudflare.com/durable-objects/platform/pricing , https://developers.cloudflare.com/durable-objects/platform/limits
- File tĩnh trên Workers miễn phí, không giới hạn: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations
- Chuyển từ Pages sang Workers: https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/
- Vercel Hobby chỉ phi thương mại: https://vercel.com/docs/plans/hobby
- So sánh gói miễn phí (2026-09): https://flaviocopes.com/hosting-free-tiers/
- Cloudflare mua PartyKit: https://blog.cloudflare.com/cloudflare-acquires-partykit , PartyServer: https://github.com/cloudflare/partykit
- PeerJS cloud server và FAQ: https://peerjs.com/server/cloud , https://peerjs.com/client/faq
- GitHub Pages không cho đặt header: https://github.com/orgs/community/discussions/54257
