# Mã nguồn sprite stacking

- Nguồn: `https://github.com/danielwh2/sprite-stacking`, commit `0cce02efe6aa81fffcd05744d7ab65d40f412de2` (Daniel White, 2026).
- Giấy phép: MIT. Bản quyền và toàn văn giấy phép được giữ trong cả hai bản sao skill ở `.agents/skills/sprite-stacking/` và `.claude/skills/sprite-stacking/`.
- Đã đọc `SKILL.md`, `scripts/views_to_slices.py`, `scripts/viewer.html`, `references/engines.md` và `tests/check.py` trước khi chạy mã. `python -I tests/check.py` trong bản nguồn cho kết quả `ok`.

## Tham số bộ cắt lớp

Đầu vào là PNG gồm bốn hình chiếu theo thứ tự trên, cạnh, trước, sau. `--slices` quyết định số lát (mặc định tự chọn, `0` giữ độ phân giải gốc); `--order` chọn tự nhận dạng hoặc thứ tự đọc; `--side-nose` và `--top-nose` chỉnh hướng; `--round` cắt khối theo tiết diện elip. `--colours` lượng tử hóa bảng màu chung, `--shade` làm tối mặt bên; `--bg-tol` nhận diện nền và `--dark-thresh` xử lý viền tối. `--preview` xuất bảng kiểm tra, `--html` xuất viewer độc lập, `--normals` và `--emissive` xuất dải bổ sung.

Đầu ra chính là một dải PNG, lát sát đất ở trái và lát trên cùng ở phải. Khi vẽ, lần lượt xoay từng lát quanh tâm, ép trục dọc theo `squash` (tham chiếu 0,75), rồi nâng theo `z × spacing` (tham chiếu 1 px). Viewer nguồn chỉ dùng làm tài liệu tham khảo; renderer của game sẽ là ES module riêng.
