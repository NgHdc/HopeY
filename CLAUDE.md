# Phố Giấy (repo HopeY) — đọc nhanh cho phiên mới

Trả lời bằng tiếng Việt. Đọc file này trước, **chỉ mở thêm file khi task cần**.

## Là gì
- Game kiểu cờ tỷ phú chạy trên web.
- Có online nhiều máy (PeerJS/WebRTC, máy chủ phòng giữ luật) và chơi thử trên một máy.
- Không có bước build: HTML/CSS/JS ES modules thuần.
- Bản live: https://nghdc.github.io/HopeY/ · GitHub: NgHdc/HopeY.

## Chạy và test
- Server dev: `npm run dev` (python http.server 5173), mở http://127.0.0.1:5173/src/?local=3&dev. Mở `file://` không chạy.
- Test: `npm test`, tức `node --test tests/*.test.mjs`: test luật, test thẻ Vận mệnh, và 80 ván bot giả lập cho mỗi map (khoảng 1,5 phút).
- E2E: `npm run e2e` (Edge headless qua CDP, cần server dev đang chạy).
- Máy hay thiếu RAM: không tự bật lại server dev nếu nó bị tắt, hỏi người dùng trước.
- Cổng 5173 có thể đang phục vụ worktree của Codex/Agy: kiểm tra `curl http://127.0.0.1:5173/src/core/version.js` trước khi chạy e2e. E2E nhận `BASE_URL`.

## Làm việc cùng Codex và Agy
- Có 3 agent làm song song. Ai sửa file nào và mỗi agent dùng worktree, nhánh nào: xem `AGENTS.md`.
- Claude giữ engine (`src/core`, `src/net`, `main.js`, `view.js`, `style.css`) và là người merge các nhánh `codex/*`, `agy/*` vào `dev` khi người dùng đồng ý.
- Agent khác ghi tiến độ vào `docs/agents/<tên>.md`. Đọc file này khi cần biết họ đang làm gì.
- Kế hoạch art (sprite stacking) nằm ở `docs/ART_PIPELINE.md`.

## Bản đồ code (src/)
| File | Vai trò |
|---|---|
| `core/version.js` | APP_VERSION, PROTOCOL_VERSION (online), SCHEMA_VERSION + `migrate()` cho save cũ |
| `core/board.js` | Phần chung: hằng số (START_MONEY 1500, SALARY 200, JAIL 10, GO_JAIL 30), `rentTable`, `P`/`ST` dựng ô, `groupOf` |
| `core/maps/` | Mỗi map một file: `classic.js` (Phố Giấy gốc), `vietnam.js` (Dải đất, mặc định). Map = `terms`, `districts`, `tiles` (40 ô), `decks` (thẻ có `fx` dạng dữ liệu), `hooks` (`afterStep`, `onPassStart`). `index.js`: `MAPS`, `mapOf(S)` |
| `core/rules.js` | Engine thuần: `applyAction(state, seat, action) → {ok, state, events}`. Đọc bàn từ `mapOf(S)`. Random dùng `state.rng` có seed. Phase lựa chọn: `buy`, `downgrade`, `fly`, `gamble` (`CHOICE_PHASES`); `choiceTiles`, `betRange`, `gambleTarget` cho UI và bot |
| `net/peer.js` | Mở và nhập phòng; peer id = `phogiay-p${PROTOCOL}-` + mã 5 ký tự |
| `ui/view.js` | Chỉ có hàm dựng chuỗi HTML (home, lobby, game, end, modal, luật) |
| `main.js` | Trạng thái app, render, hàng đợi animation, chế độ local/host/guest, phím tắt |
| `style.css` + `design/tokens.css` | Mọi màu, chữ, khoảng cách lấy từ tokens.css; style.css chỉ dùng biến |

## Quy tắc khi sửa
- Luật mới đi vào `rules.js` / `cards.js` dưới dạng dữ liệu cộng hàm thuần, kèm test trong `tests/rules.test.mjs`.
- Bot giả lập phải còn ≥40% số ván kết thúc.
- Đổi format state: tăng SCHEMA_VERSION và viết bước migrate.
- Đổi format tin nhắn online: tăng PROTOCOL_VERSION.
- Lựa chọn của người chơi giữa lượt (chọn ô, đặt cược…) làm thành một `phase` riêng trong state, sau đó gửi action.
- UI không tự tính luật.

## Git, release, rollback
- Làm việc trên nhánh `dev`; `main` là bản đã phát hành.
- Tag `vX.Y.Z` (đã có v0.1.0 → v0.4.0). Không force-push, không xoá tag đã push.
- Chỉ `git add` đúng file mình sửa, không dùng `git add -A`: repo có file của người dùng như `.drawing-skill/`, `design/*.py`, `design/mockup/`.
- Release: xem `docs/RELEASE.md`. Rollback: sửa `deploy/current.txt` thành tag cũ rồi push lên main.
- Mỗi bản đều xem được ở `/v/X.Y.Z/`, bản dev ở `/next/`.
- Máy không có `gh` CLI; push qua Git Credential Manager.
- Heredoc dài trong bash hay lỗi: viết script ra scratchpad bằng Write rồi mới chạy.
- Commit kết thúc bằng `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Tài liệu (chỉ mở khi cần)
- `docs/ROADMAP.md`: các bản đã xong và bản kế tiếp.
- `docs/DECISIONS.md`: lý do các quyết định kỹ thuật (#1–#12).
- `docs/STYLE_GUIDE.md`: style Swiss Paper.
- `docs/MAP_VIETNAM.md`: thiết kế map Việt Nam và bộ thẻ Vận mệnh (đã code ở 0.5.0).
- `CHANGELOG.md`.

## Hướng nghệ thuật (đang bàn, chưa code)
- Nhiều map, mỗi map là một vùng đất có bảng màu và câu chuyện riêng.
- "Agnes" là tên một vùng đất, có cô bé đại diện, vẽ kiểu màu nước.
- Canvas thảo luận: https://claude.ai/artifact/FCTmds2AKdLEdaXujWpThs. Canvas đang để công khai và có ảnh của tác giả khác, nên nhắc người dùng chuyển về riêng tư.
- Mockup UI 0.4: https://claude.ai/artifact/XgBsVGfNrQCLjF5zMmkzRf
- Map Việt Nam (`docs/MAP_VIETNAM.md`) là map thật đầu tiên, đã code ở 0.5.0. Các vùng đất Agnes làm sau: thêm một file trong `src/core/maps/`.

## Việc người dùng tự làm (đừng lặp lại)
- Thêm collaborator trong GitHub Settings → Collaborators.
