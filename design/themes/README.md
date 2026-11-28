# Theme theo vùng đất

`vietnam.css` và `classic.css` chỉ khai báo biến dưới `[data-map="vietnam"]` hoặc `[data-map="classic"]`. Đặt `data-map` lên `<body>`; nạp `design/tokens.css`, CSS giao diện hiện tại, rồi hai file theme. `components.css` của U3 sẽ phủ kiểu thành phần sau cùng.

## Tên biến cuối cùng

| Nhóm | Biến |
|---|---|
| Nền | `--bg`, `--bg-pattern`, `--surface`, `--surface-2`, `--board-art` |
| Chữ và trạng thái | `--ink`, `--ink-2`, `--accent`, `--accent-2`, `--good`, `--bad`, `--on-accent`, `--on-accent-2`, `--on-d6` |
| Ô | `--d1` đến `--d8`, `--station`, `--util`, `--tax`, `--card` |
| Hình khối | `--radius-sm`, `--radius-md`, `--radius-lg`, `--border`, `--shadow`, `--shadow-press` |
| Chữ tiêu đề | `--font-display` |

Nguồn màu và hoa văn: `design/themes/palettes.md` cùng `assets/themes/` của Agy (A1). `--d6` luôn dùng `--on-d6`; các nền tối dùng chữ trắng. Các biến `--paper`, `--panel`, `--cool-*`, `--piece-*` là cầu nối cho `src/ui/view.js` và `src/style.css` hiện tại; Claude có thể bỏ chúng khi tích hợp K1.
