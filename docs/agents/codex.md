# Nhật ký Codex

## 2026-11-27 · C1
- Đã đồng bộ `codex/art-pipeline` với `dev`, đọc skill và mã nguồn sprite stacking tại commit `0cce02e`.
- Đã đưa skill và giấy phép MIT vào `.agents/skills/sprite-stacking/`, `.claude/skills/sprite-stacking/`; ghi tham số tại `tools/art/THIRD_PARTY.md`.
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
