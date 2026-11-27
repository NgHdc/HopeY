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
