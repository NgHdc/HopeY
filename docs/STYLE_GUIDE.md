# STYLE GUIDE — Board game "Phố Giấy" theo phong cách Swiss Paper

> Bản chuyển thể của `../Slide_Style_Guide_Swiss_Paper.md` từ **slide** sang **board game** (bàn cờ, thẻ, tiền, quân cờ, giao diện số).
> Phần **CỐ ĐỊNH** giữ nguyên tinh thần gốc; phần **RIÊNG CHO GAME** là những gì slide không có.
> Token màu/cỡ chữ dùng trong code nằm ở `../design/tokens.css` — sửa ở đây thì sửa luôn ở đó.

---

## 0. Định vị

| Mục | Nội dung |
|---|---|
| Thể loại | board game mua – bán – xây đất, 2–6 người (cùng thể loại với Monopoly, nhưng **tên, ô, hình, luật riêng**) |
| Tên tạm | **Phố Giấy** — thành phố dựng trên giấy kem, mỗi ô đất là một nơi chốn có người sống |
| Câu hỏi của game | *"Mình muốn sống ở một con phố như thế nào?"* |
| Định dạng | bản in (bàn cờ 500 × 500 mm) + bản số (web, `src/`) — dùng chung một hệ hình |

**Không bắt chước Monopoly:** không dùng tên, logo, linh vật, bố cục ô "GO/Jail/Free Parking" nguyên bản, dải màu đặc ở đầu thẻ đất, font hay màu nhận diện của họ. Cơ chế thể loại thì được, bộ mặt phải là của mình.

---

## 1. Tinh thần (CỐ ĐỊNH — từ bản gốc)

1. **Deconstructed Swiss Design + post-digital**: giấy kem có vân, lưới hairline, dấu canh in "+", nhãn mono nhỏ, khoảng trắng rộng.
2. **Ảnh thật ↔ hệ ký hiệu trừu tượng**: mỗi quận trên bàn cờ có một ảnh thật (hộp game, thẻ quận) và bản dựng lại bằng hình học (ô trên bàn cờ).
3. **Con người & tự nhiên**: mỗi ô đất có **một người que nhỏ** đang sống ở đó; mỗi thẻ có một **human line** nghiêng.
4. **Kể chuyện bằng câu hỏi**: thẻ sự kiện là một câu hỏi + câu trả lời đời thường, không phải mệnh lệnh khô.
5. **Một thành phần = một thông điệp.** Ít chữ, số làm tròn, đọc được từ 1 m (bản in) / 1 cánh tay (màn hình).

**Cấm:** nền màu template, **dải màu đặc ở đầu thẻ**, gradient, bóng đổ, thẻ bo góc lớn (> 1 mm), icon clip-art, emoji, chữ 3D, khung viền dày, hơn 2 điểm nhấn ACCENT trên một thành phần.

---

## 2. Bảng màu

### 2.1 Nền & nhấn (CỐ ĐỊNH)

| Token | Hex | Dùng cho |
|---|---|---|
| `--paper` | `#F1ECE2` | nền bàn cờ, thẻ, màn hình |
| `--panel` | `#E7E0D1` | khối "lời khẳng định", vùng giữa bàn cờ, ô góc |
| `--ink` | `#22262B` | chữ chính, hairline, người que |
| `--ink-2` | `#5E6266` | chữ phụ, nhãn mono |
| `--accent` | rust `#B0472F` | giá tiền quan trọng, nút chính, badge số — **≤ 2 chỗ / thành phần** |
| `--accent-2` | ochre `#D49A2A` | xúc xắc, mặt trời, nón người que, ô "thưởng" |
| `--cool-1` / `--cool-1-l` | `#6F90AE` / `#A9C1D6` | dòng thông tin, ô ga/giao thông |
| `--cool-2` / `--cool-2-l` | `#2E6B6B` / `#DCE8E4` | nước, cây, ô tiện ích |
| `--neutral` | sand `#D9C8A6` | lưới, số lớn mờ, hairline ngăn cột |
| `--grey` | concrete `#9A978F` | ô đã thế chấp, trạng thái vô hiệu |

**Tỉ lệ toàn bàn cờ:** ~70% giấy + mực · ~20% màu quận dịu · < 10% ACCENT.

### 2.2 Màu quận — 8 nhóm đất (RIÊNG CHO GAME)

Board game cần 8 nhóm phân biệt được, nhưng không được biến bàn cờ thành cầu vồng. Quy tắc: **mỗi quận = một màu dịu + một hoa văn**, để người mù màu vẫn phân biệt được và màu không bao giờ phải đứng một mình.

| # | Quận (tên tạm) | Token | Hex | Hoa văn | Cảm hứng |
|---|---|---|---|---|---|
| 1 | Ngõ Đất | `--d1` | `#8A6A4F` | hatch 45° | đất nện, tường vôi cũ |
| 2 | Bến Sông | `--d2` | `#A9C1D6` | lưới chấm | trời sáng sớm trên sông |
| 3 | Chợ Hoa | `--d3` | `#C98A7A` | vạch dọc | hoa giấy, mái ngói |
| 4 | Phố Nghề | `--d4` | `#C9773A` | vạch ngang | lò gạch, gốm |
| 5 | Phố Cổ | `--d5` | `#9E3B32` | hatch chéo kép | đỏ son cửa đình |
| 6 | Đồi Nắng | `--d6` | `#D49A2A` | chấm tròn đặc | lúa chín, nắng chiều |
| 7 | Vườn Xanh | `--d7` | `#4C6E52` | sóng mảnh | lá, ruộng bậc thang |
| 8 | Cảng Biển | `--d8` | `#34506E` | đặc (solid) | biển sâu, thép cảng |

Kiểm tra: chữ `--ink` đọc rõ trên `--d2`, `--d3`, `--d6`; chữ `--paper` đọc rõ trên `--d1`, `--d4`, `--d5`, `--d7`, `--d8`.

**Ô đặc biệt** (không thuộc quận):

| Loại ô | Màu | Ký hiệu |
|---|---|---|
| Ga / tuyến xe (4 ô) | `--cool-1` | 2 thanh song song + vòng tròn rỗng |
| Tiện ích điện / nước (2 ô) | `--cool-2` | tròn đặc ACCENT2 (điện) · sóng COOL2 (nước) |
| Thẻ "Câu hỏi" (≈ thẻ cơ hội) | `--accent-2` | dấu "?" Georgia italic trong vòng tròn |
| Thẻ "Hàng xóm" (≈ thẻ cộng đồng) | `--cool-2` | 3 người que đứng cạnh nhau |
| Thuế / phí | `--grey` | lưới chấm INK2 |

---

## 3. Hệ thống chữ (CỐ ĐỊNH, quy đổi cho game)

Font: **Arial** · **Courier New** như bản gốc. Chữ nghiêng (human line) dùng **Noto Serif Italic** (dự phòng Cambria → Georgia): Georgia trên Windows thiếu glyph tiếng Việt như *ồ, ề, ổ* nên dấu bị tách rời. Mọi chỗ ghi "Georgia" bên dưới hiểu là font serif này.

| Vai trò | Font | Bản in | Bản số | Màu | Ghi chú |
|---|---|---|---|---|---|
| Header strip | Arial | 6 pt | 11 px | INK2 | IN HOA, giãn +100: `PHỐ GIẤY / QUẬN 3    12 / 40` |
| Kicker | Arial Bold | 7 pt | 12 px | ACCENT | IN HOA, giãn +150, là câu hỏi |
| Tên ô / tên thẻ | Arial Bold | 9–11 pt | 16–20 px | INK | ≤ 2 dòng, line-height 0.95 |
| Human line | Georgia Italic | 7.5–8 pt | 13–14 px | INK2 | 1 câu đời thường |
| Giá tiền | Arial Bold | 10–12 pt | 18–22 px | INK (ACCENT nếu là giá mua) | luôn kèm ký hiệu `₫g` |
| Số lớn mờ | Arial Bold | 28–40 pt | 48–72 px | NEUTRAL | số ô `01–40`, số quận |
| Bảng giá thuê, nhãn | Courier New | 6–7 pt | 11–12 px | INK2 | chữ thường, căn phải cột số |
| Luật / thân | Arial | 7.5 pt | 14 px | INK2 | 1–2 dòng mỗi mục |
| Credit | Arial | 5.5 pt | 10 px | INK2 | |

Cỡ chữ nhỏ nhất: **≥ 5.5 pt** (in) / **≥ 10 px** (số).

---

## 4. Bàn cờ (RIÊNG CHO GAME)

### 4.1 Kích thước & lưới

```
bàn cờ 500 × 500 mm · lề ngoài 10 mm · ô góc 66 × 66 mm · ô cạnh 40 × 66 mm (9 ô/cạnh)
┌──────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬──────┐
│ GÓC  │    │    │    │    │    │    │    │    │    │ GÓC  │
│  21  │ 22 │ 23 │ …  │    │    │    │    │    │ 30 │  31  │
├──────┼────┴────┴────┴────┴────┴────┴────┴────┴────┼──────┤
│  20  │ +                                        + │  32  │
│  …   │        VÙNG GIỮA — PANEL #E7E0D1           │  …   │
│      │   bản đồ trừu tượng cả thành phố,          │      │
│      │   hai ô đặt chồng thẻ, tên game nhỏ        │      │
│  12  │ +                                        + │  40  │
├──────┼────┬────┬────┬────┬────┬────┬────┬────┬────┼──────┤
│ GÓC  │ 10 │ …  │    │    │    │    │    │    │ 02 │ GÓC  │
│  11  │    │    │    │    │    │    │    │    │    │  01  │
└──────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴──────┘
```

- Ranh giới ô: **hairline INK 0.5 pt**. Không khung hộp dày quanh bàn cờ.
- Dấu **"+"** (2 đoạn 4 mm, nét 0.5 pt) ở 4 góc vùng giữa và ở giao điểm giữa các quận.
- Vùng giữa: PANEL, chứa **bản đồ trừu tượng thành phố** (sông = dải COOL2L + sóng mảnh, đường = hairline, mỗi quận một khối hoa văn của nó, người que nhỏ khắp nơi). Tên game nhỏ, góc dưới trái, không logo to.

### 4.2 Ô đất

```
┌──────────────┐  ← hairline INK
│ 07       ▦  │  số ô Courier 6pt INK2 · ô vuông màu quận 6×6mm + hoa văn (góc phải)
│              │
│  Hẻm Bánh   │  tên ô Arial Bold 9pt
│  Mì         │
│              │
│     o        │  người que nhỏ + 1 vật đặc trưng (hình học)
│    /|\  ▭    │
│              │
│ ─────────── │  hairline NEUTRAL
│ 120 ₫g       │  giá Arial Bold 10pt
└──────────────┘
```

- **Màu quận chỉ xuất hiện ở ô vuông 6 × 6 mm** (và hoa văn nhạt 15% phủ nửa dưới ô nếu cần) — **không dải màu đặc kín đầu ô**.
- Chữ trên các cạnh đọc hướng ra ngoài (xoay 90° / 180° / 270°).
- Nhà/khách sạn đặt trên bàn cờ = hình học: **nhà** = khối vuông có mái tam giác; **"phố"** (cấp cao nhất) = chữ nhật cao + vòng tròn viền ACCENT.

### 4.3 Bốn ô góc (thay cho GO / Jail / Free Parking / Go to Jail)

| Góc | Tên tạm | Ý nghĩa | Hình |
|---|---|---|---|
| 01 | **Nhà** | đi qua nhận lương | ngôi nhà + mặt trời ACCENT2 |
| 11 | **Trạm Nghỉ** | bị giữ lại / ghé chơi | ghế băng + 2 người que ngồi |
| 21 | **Công Viên** | ô yên bình | cây tròn COOL2 + hatch NEUTRAL |
| 31 | **Lạc Đường** | về Trạm Nghỉ | đường chấm vòng vèo + mũi tên ACCENT |

Ô góc nền PANEL, số lớn mờ NEUTRAL 28 pt.

---

## 5. Thẻ (RIÊNG CHO GAME)

Kích thước: **63 × 88 mm** (cỡ bài poker), góc bo **≤ 1 mm** hoặc vuông. Lề trong 4 mm.

### 5.1 Thẻ quyền sở hữu đất (khung chuẩn, giống khung slide thu nhỏ)

```
y  4  PHỐ GIẤY / QUẬN 3                     07 / 40   ← header strip
y  7  ───────────────────────────────────────────    ← hairline INK
y  9  AI SỐNG Ở ĐÂY?                            ▦ 3  ← kicker ACCENT · ô màu quận + số quận NEUTRAL
y 13  Hẻm Bánh Mì                                    ← tên Arial Bold 11pt
y 19  Mùi bơ nướng lúc 5 giờ sáng gọi cả xóm dậy.    ← human line Georgia italic
y 26  [ hình trừu tượng nhỏ: người que + lò nướng ]
y 50  ───────────────────────────── hairline NEUTRAL
y 52  tiền thuê đất trống ............. 10 ₫g        ← Courier 6.5pt, căn phải số
      1 nhà ........................... 50 ₫g
      2 nhà .......................... 150 ₫g
      3 nhà .......................... 450 ₫g
      4 nhà .......................... 625 ₫g
      phố ............................ 750 ₫g
y 76  ───────────────────────────────────────────
y 78  giá mua 120 ₫g · xây nhà 50 ₫g · thế chấp 60 ₫g
```

- Giá mua là chỗ ACCENT thứ hai (cùng kicker). Không thêm ACCENT nào khác.
- Mặt sau: PAPER, hoa văn của quận phủ kín 30%, dấu "+" ở tâm, số quận lớn.

### 5.2 Thẻ "Câu hỏi" & "Hàng xóm"

- Kicker = câu hỏi đời thường: `HÔM NAY TRỜI MƯA?`
- Tiêu đề = câu trả lời / hệ quả: *"Bạn trú mưa ở quán nước, mất lượt nhưng có thêm bạn."*
- Hành động trong game ghi bằng Courier ở đáy: `→ mất 1 lượt · nhận 20 ₫g từ người bên trái`
- Mặt sau "Câu hỏi": ochre, chữ "?" Georgia italic 60 pt PAPER. Mặt sau "Hàng xóm": COOL2, 3 người que PAPER.

### 5.3 Giọng văn trên thẻ

- Ưu tiên chuyện đời thường, gia đình, hàng xóm, thời tiết, nghề — hợp với dự án *How to live*.
- Không mỉa mai người nghèo/giàu; tiền là phương tiện, không phải mục đích.
- Số làm tròn (10, 20, 50, 100…), luôn có đơn vị `₫g`.

---

## 6. Tiền, quân cờ, xúc xắc (RIÊNG CHO GAME)

### Tiền — "đồng giấy" `₫g`

| Mệnh giá | Màu nền | Hình |
|---|---|---|
| 1 | PAPER | 1 chấm INK |
| 5 | `--cool-2-l` | lưới chấm 5 |
| 10 | `--cool-1-l` | 2 vạch song song |
| 20 | `--neutral` | hatch 45° |
| 50 | `--d3` | vòng tròn rỗng |
| 100 | `--accent-2` | mặt trời |
| 500 | `--accent` (chữ PAPER) | ngôi nhà |

- Khổ 120 × 60 mm, số mệnh giá Arial Bold 28 pt góc trái trên, Courier nhỏ `phố giấy · đồng giấy` dọc mép phải. Không mô phỏng tiền thật của bất kỳ quốc gia nào.

### Quân cờ (6)

Hình học phẳng/khối đơn giản, mỗi quân một màu từ bảng: **vòng tròn** ACCENT · **tam giác** ACCENT2 · **vuông** COOL1 · **lục giác** COOL2 · **ngôi nhà nhỏ** INK · **chiếc lá** `--d7`. Bản số: SVG 32 px, nét 1.5 px INK, không bóng.

### Xúc xắc

PAPER, chấm INK; mặt 1 dùng chấm ACCENT2 thay vì INK. Bản số: animation lăn ≤ 600 ms, không hiệu ứng 3D bóng bẩy — chỉ lật mặt 2D.

---

## 7. Giao diện bản số (RIÊNG CHO GAME)

- Màn hình = một tờ giấy: nền `--paper` + noise nhẹ (CSS `background-image` từ `assets/paper.png` hoặc SVG `feTurbulence`, độ mờ 4–6%).
- Bố cục desktop: bàn cờ vuông bên trái (chiếm chiều cao màn hình) · cột phải 360 px gồm: header strip → người chơi (tên, tiền Courier, quân cờ) → nhật ký lượt (Courier 12 px) → nút hành động.
- **Nút**: chữ nhật vuông góc, viền INK 1 px, nền PAPER; nút chính nền ACCENT chữ PAPER. Hover = nền PANEL. Không bo góc, không bóng.
- **Modal** (mua đất, thẻ rút): chính là thẻ ở mục 5 phóng to, đặt trên lớp phủ PAPER 80%.
- **Trạng thái**: đang đến lượt = viền ACCENT nét đứt quanh khung người chơi; đất thế chấp = phủ hatch GREY; đất của mình = góc ô có chấm màu quân cờ.
- **Chuyển động**: quân cờ đi từng ô 120 ms/ô, easing `ease-out`; không nảy, không lóe sáng.
- Mobile: bàn cờ trên, khay thông tin dạng ngăn kéo dưới; cỡ chữ không nhỏ hơn bảng mục 3.
- Accessibility: tương phản ≥ 4.5:1 cho chữ thân; màu quận luôn kèm hoa văn; mọi hành động có phím tắt (`Space` lăn, `B` mua, `E` kết thúc lượt).

---

## 8. Ảnh & hình minh họa

- Ảnh thật (hộp game, sách luật, thẻ quận cao cấp): người đang sống/làm việc ở phố — bàn tay, quán xá, nghề thủ công. Chỉnh: saturation × 0.82 · contrast × 0.93 · hòa 8% kem `RGB(241,228,205)`. Credit ghi trên sản phẩm.
- Hình minh họa: rect, circle, path; nét 0.5–0.8 pt (in) / 1–1.5 px (số); không gradient/bóng.
- **Mọi hình có người que** (mũ ACCENT2, nón lá, áo bà ba… tùy quận).
- Mũi tên tam giác nhỏ: ACCENT = tiền/quan trọng, COOL1 = di chuyển, COOL2 = tự nhiên.
- Vẽ bằng SVG trong `assets/illustrations/`; xuất PNG 4× nền trong suốt cho bản in.

**Prompt AI tạo ảnh** (dùng lại mục 9 bản gốc), ví dụ cho quận:

```text
Abstract generative symbol system rebuilding a {DISTRICT SCENE, e.g. riverside market at dawn} from simple geometry:
circles, rectangles, thin parallel lines, 45-degree hatching, dot grids, small stick-figure people for scale.
Deconstructed Swiss design, post-digital, flat shapes, 0.5pt ink hairlines, "+" registration marks,
generous white space, on warm cream textured paper #F1ECE2.
Colors only: ink #22262B, {DISTRICT HEX}, #D49A2A, #6F90AE, #2E6B6B, #D9C8A6. No text, no gradients, no shadows, no 3D.
```

Chữ, số, giá tiền **không để AI vẽ** — thêm bằng code/phần mềm dàn trang.

---

## 9. Checklist trước khi in / release

- [ ] Không có tên, logo, ô, hình nào sao chép Monopoly
- [ ] Mỗi thẻ đất: header strip · kicker câu hỏi · tên · human line · hình có người · bảng giá Courier
- [ ] ACCENT ≤ 2 chỗ / thẻ, / ô, / màn hình
- [ ] Màu quận luôn đi kèm hoa văn; không có dải màu đặc ở đầu thẻ
- [ ] Không gradient, bóng đổ, bo góc lớn, clip-art, emoji
- [ ] Chữ tiếng Việt có dấu hiển thị đúng ở mọi cỡ; nhỏ nhất ≥ 5.5 pt / 10 px
- [ ] Mọi giá có đơn vị `₫g`, làm tròn
- [ ] Ảnh có credit; ảnh AI ghi `Illustration: AI-generated`
- [ ] Bản số: tương phản ≥ 4.5:1, chơi được bằng bàn phím
