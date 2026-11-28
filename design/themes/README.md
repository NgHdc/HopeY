# Theme theo vùng đất

`vietnam.css` và `classic.css` chỉ khai báo biến dưới `[data-map="vietnam"]` hoặc `[data-map="classic"]`. Đặt `data-map` lên `<body>`; nạp `design/tokens.css`, CSS giao diện hiện tại, rồi hai file theme. `components.css` sẽ phủ kiểu thành phần pixel sau cùng.

## Tên biến cuối cùng

| Nhóm | Biến |
|---|---|
| Nền | `--bg`, `--bg-pattern`, `--surface`, `--surface-2`, `--board-art` |
| Chữ và trạng thái | `--ink`, `--ink-2`, `--accent`, `--accent-2`, `--good`, `--bad`, `--on-accent`, `--on-accent-2`, `--on-d6` |
| Ô | `--d1` đến `--d8`, `--station`, `--util`, `--tax`, `--card` |
| Hình khối pixel | `--px`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--border`, `--shadow`, `--shadow-press` |
| Chữ | `--font-pixel`, `--font-text`, `--font-display` (bí danh tương thích) |

## Font pixel và hỗ trợ tiếng Việt (U4)

Trang xem mẫu: `design/lab/fonts.html`. Mỗi font hiện cùng một câu ở 12, 16 và 24px để dễ nhận ra dấu bị thiếu hoặc chạm nhau. Nhãn phản ánh subset tiếng Việt được công bố trong metadata Google Fonts; chưa thay cho việc xem thực tế trên trình duyệt.

| Font | License | Dấu tiếng Việt theo metadata | Ghi chú |
|---|---|---|---|
| Tiny5 | OFL | Có subset `vietnamese` | Lưới pixel 5px, chọn cho tiêu đề, tiền và nhãn ngắn; kiểm tra trực quan tại trang lab |
| VT323 | OFL | Có subset `vietnamese` | Chữ terminal mảnh hơn, làm font pixel dự phòng trong stack |
| Pixelify Sans | OFL | Chưa xác nhận; metadata liệt kê `latin-ext` | Không chọn làm font chính vì có thể fallback ở ký tự Việt mở rộng |
| Jersey 10 | OFL | Chưa xác nhận; metadata liệt kê `latin-ext` | Không chọn làm font chính |
| Silkscreen | OFL | Chưa xác nhận; metadata liệt kê `latin-ext` | Không chọn làm font chính |
| Press Start 2P | OFL | Chưa xác nhận; metadata liệt kê `latin-ext` | Không chọn làm font chính |
| Inter | OFL | Có ký tự Việt | Đối chiếu dấu và dùng cho nội dung dài; pixel font không phù hợp để đọc đoạn 14px liên tục |

Chọn `--font-pixel: "Tiny5", "VT323", monospace` cho chữ ngắn. Chọn `--font-text: "Inter", Arial, "Helvetica Neue", sans-serif` cho mô tả và đoạn dài. Bộ biến pixel: `--px: 3px` desktop, `2px` ở màn hình ≤600px; viền và bóng cứng lấy theo `--px`; mọi `--radius-*` bằng 0. Tiny5 được chọn theo thiết kế lưới pixel và metadata có subset Việt; trình duyệt chụp/soi dấu chưa khả dụng ở phiên Codex, nên lab để lộ trực tiếp mẫu ở cả ba cỡ cho Claude/người dùng kiểm tra.

Nguồn metadata chính chủ: [Tiny5](https://raw.githubusercontent.com/google/fonts/main/ofl/tiny5/METADATA.pb), [VT323](https://raw.githubusercontent.com/google/fonts/main/ofl/vt323/METADATA.pb), [Pixelify Sans](https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/METADATA.pb), [Jersey 10](https://raw.githubusercontent.com/google/fonts/main/ofl/jersey10/METADATA.pb), [Silkscreen](https://raw.githubusercontent.com/google/fonts/main/ofl/silkscreen/METADATA.pb), [Press Start 2P](https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/METADATA.pb), [Inter](https://raw.githubusercontent.com/google/fonts/main/ofl/inter/METADATA.pb). Tất cả đều công bố license OFL trong Google Fonts.

Nguồn màu và hoa văn: `design/themes/palettes.md` cùng `assets/themes/` của Agy (A1). `--d6` luôn dùng `--on-d6`; các nền tối dùng chữ trắng. Các biến `--paper`, `--panel`, `--cool-*`, `--piece-*` là cầu nối cho `src/ui/view.js` và `src/style.css` hiện tại; Claude có thể bỏ chúng khi tích hợp K1.
