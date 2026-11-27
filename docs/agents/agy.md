# Nhật ký agent Agy

## 2026-11-27 · G6
- Đã tạo nội dung chữ cho map Việt Nam (40 ô, 13 loại thẻ Vận mệnh, gợi ý Thanh Hóa) và chạy `node --test tests/*.test.mjs` (17/17 xanh).
- File: `content/vietnam.json`.

## 2026-11-27 · G1 (dừng ở Cổng duyệt 1)
- Đã tạo đủ 3 địa danh thử × 2 kiểu (**A · Pixel** và **B · Giấy xếp lớp** = 6 asset), chạy `../Monopoly-codex/tools/art/build_stacks.py --bake16` ra dải lát cắt, sheet 16 góc, 6 check sheet và `manifest.json`; mọi ảnh gốc dưới 5 KB, mọi dải lát cắt dưới 7 KB (dưới ngưỡng 60 KB / 400 KB).
- Đã kiểm tra trực quan cả 6 check sheet, thêm trang so sánh `design/lab/g1-compare.html`, chạy renderer thật của Codex (`src/render/stack.js` + `design/lab/stack.html`) trên Edge headless và chụp bảng so sánh A/B cùng ảnh lab desktop (1280px) & mobile (390px).
- File: `assets/stacks/src/*`, `assets/stacks/out/*`, `assets/stacks/check/*`, `assets/stacks/manifest.json`, `assets/stacks/SOURCES.md`, `design/lab/g1-compare.html`.
- Việc tiếp theo: **chờ người dùng chọn ở Cổng duyệt 1** (kiểu A Pixel, kiểu B Giấy xếp lớp, hay chỉnh lại) rồi mới làm G2–G5.
- Đề xuất gửi Codex (không tự sửa vùng của Codex):
  1. Trong `src/render/stack.js:186` (`mountTurntable`), dòng `(canvas.clientHeight + size.height * scale) / 2 - 4` đang đặt `baseY` xuống sát đáy canvas nên khi `scale >= 3.5` đáy mô hình bị cắt ở mép dưới (thấy rõ ở ảnh `g1-lab-mobile.png` và `deedCanvas` trong `stack.html:95`). Đề xuất đổi thành `(canvas.clientHeight - size.height * scale) / 2 + size.baseY * scale` để căn đúng giữa khung.
  2. Trong `tools/art/build_stacks.py:84`, font mặc định của Pillow không hỗ trợ dấu tiếng Việt nên nhãn `"tách lớp"` trên check sheet hiện `t□ch l□p`; có thể dùng `"tach lop"` hoặc nạp font TTF hệ thống.

### Cổng duyệt 1 · Bảng so sánh A (Pixel) vs B (Giấy xếp lớp) trên `src/render/stack.js`

![So sánh G1 kiểu A và B](../../assets/stacks/check/g1-lab-compare.png)

### Ảnh chụp trang lab của Codex (`design/lab/stack.html`) với manifest G1 thật

| Desktop (1280px, Tháp Rùa · B giấy + Xem trên bàn) | Mobile (390px, Cầu Rồng · A pixel) |
|---|---|
| ![Lab desktop](../../assets/stacks/check/g1-lab-desktop.png) | ![Lab mobile](../../assets/stacks/check/g1-lab-mobile.png) |

### 6 Check sheet (4 góc 35°/135°/225°/315° + tách lớp)

| Địa danh | A · Pixel | B · Giấy xếp lớp |
|---|---|---|
| **Hồ Hoàn Kiếm – Tháp Rùa** | ![Tháp Rùa pixel](../../assets/stacks/check/hn-ho-hoan-kiem-pixel.png) | ![Tháp Rùa paper](../../assets/stacks/check/hn-ho-hoan-kiem-paper.png) |
| **Cầu Rồng (`parts`)** | ![Cầu Rồng pixel](../../assets/stacks/check/dn-cau-rong-pixel.png) | ![Cầu Rồng paper](../../assets/stacks/check/dn-cau-rong-paper.png) |
| **Chợ Bến Thành (`parts`)** | ![Chợ Bến Thành pixel](../../assets/stacks/check/hcm-cho-ben-thanh-pixel.png) | ![Chợ Bến Thành paper](../../assets/stacks/check/hcm-cho-ben-thanh-paper.png) |
