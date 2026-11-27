# Hướng dẫn cho agent (Codex, Antigravity/Gemini, và agent khác)

Repo này có **3 agent làm song song**: Claude, Codex, Agy (Antigravity).
Đọc hết file này trước khi sửa bất cứ thứ gì. Trả lời và viết commit bằng tiếng Việt.

Thông tin chung về dự án (cách chạy, bản đồ code, quy tắc git) nằm trong `CLAUDE.md`. Đọc file đó, nhưng **phần phân việc dưới đây được ưu tiên**.

## 1. Mỗi agent một thư mục, một nhánh

Không bao giờ để hai agent dùng chung một thư mục làm việc. Mỗi agent dùng một git worktree riêng. Người dùng chạy các lệnh sau một lần, trong thư mục repo:

```
git worktree add "../Monopoly-codex" -b codex/art-pipeline dev
git worktree add "../Monopoly-agy"   -b agy/assets         dev
```

| Agent | Thư mục | Nhánh | Việc |
|---|---|---|---|
| Claude | `Monopoly/` | `dev` (hoặc `feat/0.5-*`) | Engine luật, map Việt Nam, online, tích hợp vào `main.js` |
| Codex | `Monopoly-codex/` | `codex/art-pipeline` | Công cụ dựng art và bộ vẽ sprite stack trong game |
| Agy | `Monopoly-agy/` | `agy/assets` | Tạo ảnh 4 góc nhìn, cắt lớp, viết nội dung chữ cho map |

## 2. Ai được sửa file nào

Muốn sửa file ngoài vùng của mình thì **không sửa**. Ghi đề xuất vào `docs/agents/<tên>.md` để người dùng hoặc Claude làm.

| Vùng | Claude | Codex | Agy |
|---|---|---|---|
| `src/core/**`, `src/net/**`, `src/main.js`, `tests/*.test.mjs` | ✅ | ❌ | ❌ |
| `src/ui/view.js`, `src/style.css`, `design/tokens.css` | ✅ | ❌ (đề xuất) | ❌ |
| `src/render/**` (mới: bộ vẽ sprite stack) | đọc | ✅ | ❌ |
| `tools/art/**`, `tests/render/**` | đọc | ✅ | dùng |
| `design/lab/**` (trang xem thử) | đọc | ✅ | ✅ (chỉ thêm file) |
| `assets/stacks/**` (ảnh gốc, lát cắt) | đọc | đọc | ✅ |
| `content/vietnam.json` (tên, mô tả ô) | đọc | ❌ | ✅ |
| `design/themes/*.css`, `design/themes/README.md` (theme từng vùng đất, `docs/UI_REFRESH.md`) | đọc | ✅ | ❌ |
| `design/themes/palettes.md`, `assets/themes/**` (bảng màu, hoa văn, minh họa) | đọc | đọc | ✅ |
| `assets/avatars/**` (avatar nhân vật) | đọc | đọc | ✅ |
| `docs/ART_PIPELINE.md` | ✅ | ✅ (mục của mình) | ✅ (mục của mình) |
| `docs/agents/<tên>.md` | file của mình | file của mình | file của mình |
| `.drawing-skill/`, `design/*.py`, `design/mockup/` | ❌ | ❌ | ❌ (của người dùng) |
| `CHANGELOG.md`, `package.json`, version, workflow | ✅ | ❌ | ❌ |

## 3. Quy tắc chung
- Chỉ `git add` đúng file mình sửa. **Cấm** `git add -A` hoặc `git add .`.
- Chỉ commit trên nhánh của mình. **Không** merge vào `dev` hay `main`, không force-push, không xoá tag. Người dùng hoặc Claude sẽ merge.
- Trước khi bắt đầu một phiên: `git fetch && git rebase dev` (hoặc merge `dev`), để luôn có engine mới nhất.
- Không thêm dependency npm nào. Game là web tĩnh, không build. Script Python trong `tools/art/` chỉ được dùng Pillow và NumPy.
- Không cho mã bên ngoài tự chạy khi chưa đọc nó. Chạy script tải về bằng `python -I`.
- Ảnh do AI tạo phải ghi nguồn (tên công cụ và prompt) vào `assets/stacks/SOURCES.md`.
- Không dùng ảnh của tác giả khác, kể cả ảnh trong moodboard. Moodboard chỉ để tham khảo cảm giác.
- Không đưa thông tin cá nhân của người dùng vào file, prompt hay dịch vụ bên ngoài.
- Xong mỗi việc: ghi 3–5 dòng vào `docs/agents/<tên>.md` gồm ngày, đã làm gì, file nào, việc tiếp theo, chỗ đang vướng.
- **Xong việc là phải commit.** Không để file đã `git add` hay untracked rồi dừng.
- Commit kết thúc bằng một dòng ghi tên agent, ví dụ `Agent: codex` hoặc `Agent: agy`.

## 3b. Nói chuyện qua `agents-hub/` (bắt buộc)

Thư mục `../agents-hub/` (cạnh các worktree, không thuộc git) là chỗ 3 agent nói chuyện với nhau, người dùng không cần chép tin qua lại. Đọc `agents-hub/README.md`.
- **Bắt đầu mỗi việc:** đọc `agents-hub/inbox/<tên>.md`. Tin đã xử lý thì đổi `[chưa đọc]` thành `[đã đọc]`.
- **Nhận việc, xong việc, bị vướng:** sửa dòng của việc đó trong `agents-hub/BOARD.md` (cột Trạng thái: `đang làm` / `chờ duyệt` / `xong` / `vướng`; cột Chờ ai).
- **Cần agent khác làm gì:** thêm tin vào cuối `agents-hub/inbox/<tên-người-nhận>.md`, theo mẫu `## YYYY-MM-DD HH:MM · từ <tên> · [chưa đọc]`.
- Claude theo dõi hộp thư của mình và BOARD. Việc chuyển sang `chờ duyệt` thì Claude kiểm tra và merge khi người dùng đồng ý.
- Người dùng xem mọi thứ ở `agents-hub/dashboard.html`.

## 4. Việc cụ thể
Kế hoạch đầy đủ ở `docs/ART_PIPELINE.md`: mỗi việc có mã, đầu vào, đầu ra và tiêu chí xong.
- **Codex:** các việc `C1`–`C6` trong file đó.
- **Agy:** các việc `G1`–`G6` trong file đó.
- Làm theo thứ tự. Mỗi việc xong và có kết quả kiểm chứng được thì mới qua việc sau.

## 5. Kiểm tra trước khi commit
- `node --test tests/*.test.mjs` phải xanh. Codex thêm `node --test tests/render/*.test.mjs`.
- Mở trang `design/lab/` qua server dev (`npm run dev`, cổng 5173) và tự xem lại kết quả.
- Không commit file lớn: mỗi PNG lát cắt dưới 60 KB. Ảnh gốc 4 góc nhìn để trong `assets/stacks/src/`, mỗi ảnh dưới 400 KB.
