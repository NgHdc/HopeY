# Nhật ký Codex

## 2026-11-27 · C1
- Đã đồng bộ `codex/art-pipeline` với `dev`, đọc skill và mã nguồn sprite stacking tại commit `0cce02e`.
- Đã đưa skill và giấy phép MIT vào `.agents/skills/sprite-stacking/`; ghi tham số tại `tools/art/THIRD_PARTY.md`.
- Kiểm chứng: `python -I tests/check.py` trong bản nguồn in `ok`; `tools/art/fixtures/car-views.png` cắt thành 36 lát và `car-check.png` đã được xem trực quan.
- Vướng: chưa có ba asset G1 từ Agy; C2 sẽ dùng fixture trong `tools/art/` để kiểm tra trước.

## 2026-11-27 · C2
- Đã viết `tools/art/build_stacks.py`: đọc JSON từng asset, ghép `parts` theo offset x/y/z, xuất dải PNG, check sheet, sheet 16 góc và manifest.
- Có `--only`, tham số đường dẫn để kiểm thử tách khỏi `assets/stacks/`; mô tả schema `parts` trong phần đầu script.
- `python -I tools/art/test_build_stacks.py` xanh với ba asset giả lập; hash của toàn bộ 10 file trùng nhau sau hai lần chạy và sau `--only`.
- Dựng lại sáu asset G1 trong `tools/art/g1-verify/`: manifest trùng, 12/12 dải PNG và sheet 16 góc trùng hash với bản Agy; không ghi vào vùng asset của Agy.
- Nhãn `tách lớp` đã hiển thị đủ dấu bằng Arial trên máy; font dự phòng dùng `tach lop`. Tiếp theo: C3.

## 2026-11-27 · C3
- Đã thêm `src/render/stack.js` với `loadStacks`, `bake`, `drawStack`, `frameFor`, `mountTurntable` và kiểm tra schema manifest.
- Style pixel tạo viền silhouette sau khi xếp lớp; style paper dùng bóng từng lát, lớp dưới tối dần và vân giấy lấy màu từ CSS tokens.
- `node --test tests/render/*.test.mjs`: 3/3 xanh; kiểm tra canvas và hai style trong lab ở C4.
- Đã xem ảnh mobile G1 của Agy và sửa tọa độ chân turntable để mô hình nằm giữa canvas theo toàn bộ khung bake.
- Tiếp theo: C4 kiểm tra lab. Vướng: trình duyệt tự động của phiên Codex vẫn không khả dụng.

## 2026-11-27 · C4
- Đã tạo `design/lab/stack.html`: lưới asset, turntable, chỉnh squash/spacing/scale, chuyển A/B, nền giấy/quận và mô phỏng ô 64px cùng thẻ đất.
- Lab đọc manifest G1 của Agy qua URL `manifest`; sau khi merge sẽ tự đọc `assets/stacks/manifest.json`. Mặc định mở Tháp Rùa kiểu A · Pixel theo lựa chọn của người dùng.
- Kiểm chứng HTTP 200 cho lab, renderer, manifest và PNG G1; đã xem ảnh chụp Agy: [desktop](../../assets/stacks/check/g1-lab-desktop.png), [mobile 390px](../../assets/stacks/check/g1-lab-mobile.png), [so sánh sau sửa mái](../../assets/stacks/check/g1-lab-compare.png).
- Tiếp theo: Claude merge và mở lab. Vướng: ảnh desktop/mobile trên được chụp trước bản sửa căn giữa C3; công cụ trình duyệt Codex không khả dụng để chụp lại.

## 2026-11-28 · U1
- Đã thêm `design/themes/vietnam.css`, `classic.css` và `README.md`; palette/họa tiết lấy từ A1, có bí danh biến để tương thích `view.js` hiện hành.
- Đã tạo `design/lab/theme.html`, dùng trực tiếp `homeHtml`, `lobbyHtml`, `gameHtml`, `endHtml` và `createGame`; có nút đổi hai map, bốn màn hình và iframe 390×844.
- Kiểm chứng HTTP 200 cho trang, view, rules và hai SVG hoa văn; gọi thử renderer Node cho đủ 8 kết hợp map/màn hình thành công.
- Vướng: không chụp được desktop/mobile vì CUA báo `native pipe unavailable`; trang sẵn sàng xem tại `/design/lab/theme.html`.

## 2026-11-28 · U3
- Đã tạo `design/themes/components.css` cho nút viên thuốc, thẻ, ô bàn cờ, cột người chơi, sảnh chọn quân và các khối màn hình.
- Màu sắc, bo góc, bóng và font lấy từ biến theme; nút có bóng cứng và trạng thái nhấn lún. Lab nạp CSS thành phần sau hai theme.
- Kiểm tra mã CSS và link lab; chưa kiểm tra trực quan 390px do CUA/native pipe không kết nối được.
- Tiếp theo: U2 avatar renderer và bộ chọn trong lab. Vướng: cần cập nhật trạng thái BOARD ngoài worktree.

## 2026-11-28 · U2
- Đã thêm `src/render/avatar.js`: tải manifest sáu nhân vật mỗi map, dựng portrait/token đồng bộ và giữ quân hình học khi JSON/ảnh không có; chỉ số ghế ngoài 0–5 được chuẩn hóa an toàn.
- Đã thêm `tests/render/avatar.test.mjs` cho manifest hợp lệ, JSON thiếu/sai và chỉ số ngoài miền; lab có bộ chọn sáu avatar, portrait ở ghế/cột người chơi và token trên bàn, lựa chọn đồng bộ sang khung 390px.
- Kiểm chứng: `node --test tests/*.test.mjs` (29/29), `node --test tests/render/*.test.mjs` (6/6), HTTP 200 cho lab và hai manifest avatar.
- Tiếp theo: cập nhật BOARD và nhắn Claude mở cổng duyệt 2. Vướng: chưa chụp được màn hình desktop/390px vì CUA/native pipe không khả dụng.

## 2026-11-28 · U0/U4
- Sửa nhật ký C1 để chỉ ghi skill tại `.agents/skills/sprite-stacking/`; không còn nhắc bản `.claude/skills/` đã xóa.
- Thêm lab `design/lab/fonts.html`, so sánh Pixelify Sans, Tiny5, Jersey 10, Silkscreen, VT323, Press Start 2P và Inter ở 12/16/24px bằng câu thử tiếng Việt.
- Chọn Tiny5 cho tiêu đề/tiền/nhãn ngắn, Inter cho nội dung dài; thêm `--px`, font, bóng pixel và góc vuông vào cả hai theme. Metadata Google Fonts xác nhận Tiny5/VT323 có subset Việt.
- Kiểm chứng: 29/29 test game, 6/6 test renderer, `node --check` cho script lab, HTTP 200 và `git diff --check`; chụp trực quan chưa làm được do CUA/native pipe lỗi. Tiếp theo: U3p.

## 2026-11-28 · U3p
- Viết lại `design/themes/components.css` theo UI kit A5: border-image 9 ô cho nút, thẻ, cột bên và ô bàn cờ; icon đặc biệt lấy từ `assets/ui/icons/`.
- Hai theme khai báo URL ảnh qua biến; nút lún theo `--px`, dùng Tiny5 và màu chữ theo nền, không có bo góc/blur/gradient. Sửa mẫu font trong `design/lab/fonts.html` để dấu nháy không cắt thuộc tính style.
- Lab theme nạp Tiny5/VT323, giữ khung điện thoại có chiều rộng nội dung 390px. Nền pixel A4p chưa có nên `--bg-tile` đang dùng hoa văn hiện tại.
- Kiểm chứng: 29/29 test game, 6/6 test renderer; chưa chụp 8 tổ hợp màn hình do CUA/native pipe lỗi. Tiếp theo: U2p.

## 2026-11-28 · U2p
- Đã thay `src/render/avatar.js` bằng `src/render/sprite.js` và `design/themes/sprite.css`: nạp JSON/sheet PNG, vẽ portrait hoặc sprite, chuyển idle/walk/happy/sad bằng CSS steps trên phần tử con.
- Lab `design/lab/theme.html` có chọn sáu portrait, sprite trên bàn/cột chơi, nút thử bốn trạng thái và nút đi năm ô qua góc bàn; sprite đi bộ 64px, quân thường 32px.
- Đổi theme sang nền pixel, minh họa bàn và bản đồ PNG mới của Agy; xóa renderer/test SVG cũ. Lab giữ fallback quân hình học khi thiếu sprite.
- Kiểm chứng: 29/29 test game, 5/5 test render, cả hai manifest HTTP trả sáu avatar, mã script hợp lệ. Trình duyệt tự động vẫn lỗi native pipe; Claude chụp khi duyệt. Tiếp theo: báo cổng duyệt 2.
## 2026-11-28 · U7
- Dành dải `.pieces` riêng giữa tên và giá trong `design/themes/components.css`, có cỡ riêng cho cạnh dọc, ngang và điện thoại.
- Thêm `design/lab/pieces.html`: bàn thật, chuyển 1–6 người vào ô cạnh ngang, cạnh dọc hoặc góc, xem ở 1440px và 390px.
- Kiểm chứng: test game và render xanh; chưa chụp màn hình tự động. Ở 390px, cần Claude thu nhỏ hoặc gom quân trong `src/ui/pieces.js` để sáu người không tràn ô.
- Tiếp theo: U6; không vướng file trong phạm vi Codex.
## 2026-11-29 · U6
- Thêm `design/lab/social.html` và `design/themes/social.css`: chat giới hạn 30 tin/80 ký tự, biểu cảm 10 nút với bong bóng 2 giây, mic tắt mặc định và giữ để nói.
- Lab có vòng sáng người đang nói trên bàn/danh sách, huy hiệu vai trò, trạng thái mạng, chế độ khán giả và bố cục 390px thu chat thành nút.
- Icon A7/A8 chưa có trong nhánh hiện tại nên dùng ký hiệu tạm; cần thay khi Agy bàn giao. Chưa chụp được ảnh tự động, Claude sẽ chụp khi duyệt.
- Tiếp theo: U9; không vướng file trong phạm vi Codex.
## 2026-11-29 · U9
- Thêm `design/lab/xomla.html` và `design/themes/xomla.css`: 40 ô sương, lật mở 520ms, địa danh bằng `drawStack`, ba lựa chọn đi và ô đích sáng.
- Lab có bảng uy tín vòng 5/12, đấu giá kín, bầu cua, đoán giá chợ với trạng thái chờ kín và màn lật kết quả; thêm màn chuyền máy, công tắc sảnh và bảng kết thúc.
- CSS đã tham chiếu bộ ảnh A9 trong `assets/xomla/` của Agy; cần merge ảnh vào dev để hiển thị. Chưa chụp được ảnh tự động vì cổng dev 5173 không chạy.
- Tiếp theo: tích hợp A7/A8/A9 sau khi ảnh được merge, báo Claude mở cổng duyệt 3; vướng: ảnh còn ở nhánh Agy.
