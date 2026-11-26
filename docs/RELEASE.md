# RELEASE — Phiên bản, deploy, lịch sử và rollback

> Quy trình này áp dụng từ v0.3.0. Những phần ghi **(từ 0.3.0)** chưa có, sẽ được làm trong phiên bản "Nền móng" (`ROADMAP.md`).

---

## 1. Đánh số phiên bản

Dùng **Semantic Versioning** `MAJOR.MINOR.PATCH`, gắn bằng **git tag** `vX.Y.Z`.

| Đổi | Khi nào | Ví dụ |
|---|---|---|
| PATCH | sửa lỗi, chỉnh chữ, không thêm tính năng | 0.2.0 → 0.2.1 |
| MINOR | tính năng mới, thiết kế lại | 0.2.1 → 0.3.0 |
| MAJOR | từ 1.0.0 trở đi, khi đổi lớn làm hỏng ván / link cũ | 1.4.2 → 2.0.0 |

Trước 1.0.0, MINOR được phép thay đổi lớn.

**Hai số phụ đi kèm (từ 0.3.0):**
- `PROTOCOL_VERSION`: tăng khi đổi định dạng tin nhắn giữa các máy. Khác số thì không vào chung phòng được, và game báo rõ lý do.
- `schemaVersion` của trạng thái ván: tăng khi đổi cấu trúc dữ liệu đã lưu; viết `migrate()` để ván cũ mở được.

---

## 2. Nhánh git

```
main ──●────────────●──────────────●──→   luôn chạy được; mỗi lần phát hành = 1 tag
        \          / v0.3.0        / v0.3.1
dev      ●──●──●──●──●──●──●──●───●──→   tích hợp, deploy ra /next/
            \   /      \     /
feature/…    ●─●        ●───●            mỗi việc một nhánh, PR vào dev
hotfix/…                       (từ tag) ─→ PR thẳng vào main khi có lỗi gấp
```

- **Không bao giờ** `push --force` lên `main` hay `dev`, không xóa tag đã đẩy lên GitHub.
- Mọi thay đổi vào `main` đi qua Pull Request.
- Tên nhánh: `feature/trao-doi`, `design/the-dat`, `fix/mat-ket-noi`, `hotfix/0.3.1`.

---

## 3. Môi trường

| Môi trường | Địa chỉ | Nguồn | Ai dùng |
|---|---|---|---|
| Dev (máy bạn) | http://127.0.0.1:5173/src/ | thư mục làm việc | bạn, khi đang code |
| Next (thử) **(từ 0.3.0)** | https://nghdc.github.io/HopeY/next/ | nhánh `dev` | thử trước khi phát hành |
| Bản chính | https://nghdc.github.io/HopeY/ | tag được chọn làm bản chính | người chơi |
| Lưu trữ **(từ 0.3.0)** | https://nghdc.github.io/HopeY/v/0.2.0/ … | mỗi tag | xem / chơi lại bản cũ |

### Chạy bản dev trên máy

```bash
cd "C:/Users/Admin/Documents/How to live/Monopoly"
python -m http.server 5173 --bind 127.0.0.1
```

Mở http://127.0.0.1:5173/src/. Để thử chơi online một mình: mở **hai tab** (hoặc một tab thường + một tab ẩn danh), tab 1 tạo phòng, tab 2 dán link vào. Các tab có phiên riêng nên được tính là hai người chơi khác nhau.

> Server dev chỉ nghe ở `127.0.0.1`, máy khác trong mạng không vào được. PeerJS vẫn cần internet để các tab tìm thấy nhau.

---

## 4. Phát hành một phiên bản

Checklist (chép vào mô tả Pull Request `dev → main`):

- [ ] Test chạy xanh (`node --test`, e2e online) **(từ 0.3.0)**
- [ ] Đã chơi thử trên `/next/` với ít nhất 2 máy
- [ ] `CHANGELOG.md`: chuyển mục **Chưa phát hành** thành `## [X.Y.Z] — YYYY-MM-DD`
- [ ] Cập nhật `APP_VERSION` (và `PROTOCOL_VERSION` / `schemaVersion` nếu đổi)
- [ ] Merge PR vào `main`
- [ ] Gắn tag và đẩy lên:
  ```bash
  git switch main && git pull
  git tag -a v0.3.0 -m "v0.3.0 — Nền móng"
  git push origin v0.3.0
  ```
- [ ] Workflow deploy tự chạy **(từ 0.3.0)**: cập nhật `/`, thêm `/v/0.3.0/`, tạo GitHub Release từ CHANGELOG
- [ ] Mở bản chính, tạo một phòng thử, xem chân trang đúng số phiên bản

---

## 5. Rollback: khi bản mới gặp trục trặc

Chọn mức nhẹ nhất giải quyết được vấn đề.

### Mức 1 — Đưa bản chính về phiên bản cũ (không sửa code) **(từ 0.3.0)**
Dùng khi bản vừa phát hành hỏng và cần người chơi dùng được ngay.

1. GitHub → **Actions** → **Deploy** → **Run workflow**
2. Ô `current`: nhập tag tốt gần nhất, ví dụ `v0.2.0` → **Run**
3. Khoảng 1–2 phút sau, `https://nghdc.github.io/HopeY/` chạy bản `v0.2.0`. Các bản `/v/*` khác giữ nguyên.

Trong lúc chờ, người chơi có thể mở thẳng `/v/0.2.0/`.

### Mức 2 — Sửa bằng commit đảo ngược (revert)
Dùng khi đã biết commit gây lỗi.

```bash
git switch main && git pull
git log --oneline              # tìm commit lỗi
git revert <mã-commit>         # tạo commit mới đảo ngược, không xóa lịch sử
# cập nhật CHANGELOG mục "Sửa lỗi", rồi phát hành bản PATCH:
git tag -a v0.3.1 -m "v0.3.1 — revert …" && git push origin main v0.3.1
```

### Mức 3 — Hotfix từ một tag
Dùng khi `main` đã có thêm thay đổi chưa sẵn sàng.

```bash
git switch -c hotfix/0.3.1 v0.3.0   # nhánh mới từ đúng bản đang chạy
# sửa, commit, PR vào main, phát hành v0.3.1, rồi merge main ngược vào dev
```

### Mức 4 — Xem / chạy lại một bản cũ trên máy

```bash
git switch --detach v0.2.0     # xem code đúng như lúc phát hành
python -m http.server 5173     # chạy thử
git switch dev                 # quay lại làm việc
```

### Ván đang chơi khi rollback
- Ván được lưu ở trình duyệt của **chủ phòng**, theo mã phòng.
- Rollback về bản có `schemaVersion` thấp hơn sẽ **không** mở được ván tạo bởi bản mới. Bản cũ sẽ tự bắt đầu ván mới thay vì báo lỗi **(từ 0.3.0)**.

### Hiện tại (0.2.x, chưa có workflow)
GitHub Pages đang đọc thẳng nhánh `main`. Cách rollback tạm thời: dùng **Mức 2** (`git revert` rồi `git push`), trang tự cập nhật sau 1–2 phút.

---

## 6. Ghi lại lịch sử

| Nơi | Ghi gì |
|---|---|
| `CHANGELOG.md` | mỗi phiên bản: thêm / đổi / sửa / bỏ, ngày phát hành, viết cho người đọc |
| git tag `vX.Y.Z` | đúng mã nguồn của từng phiên bản, không bao giờ xóa |
| GitHub Releases | ghi chú phát hành, ảnh chụp màn hình **(từ 0.3.0)** |
| `docs/DECISIONS.md` | các quyết định lớn và **lý do**: tại sao chọn PeerJS, tại sao đổi font… |
| `/v/X.Y.Z/` | bản chạy được của mọi phiên bản **(từ 0.3.0)** |
| Commit message | tiếng Việt, câu đầu tóm tắt ≤ 72 ký tự, phần sau giải thích vì sao |
