#!/usr/bin/env python3
"""Dựng các dải sprite stack từ PNG bốn hình chiếu và JSON đi kèm.

Ví dụ: python -I tools/art/build_stacks.py --only hn-ho-hoan-kiem --bake16
Phần ghép dùng `parts: [{"file":"<id>-pillar.png", "offset":[x,y,z]}]`.
Nếu có parts, chỉ ghép chúng; đặt `include_main: true` để thêm ảnh chính.
Offset tính bằng pixel nghệ thuật sau khi cắt lớp, x sang phải, y xuống, z lên.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SLICER = ROOT / ".agents/skills/sprite-stacking/scripts/views_to_slices.py"
spec = importlib.util.spec_from_file_location("views_to_slices", SLICER)
slicer = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = slicer
spec.loader.exec_module(slicer)


def options(meta: dict, override: dict | None = None) -> dict:
    raw = {**meta, **(override or {})}
    return {
        "slices": raw.get("slices"),
        "side_nose": raw.get("side_nose", "left"),
        "top_nose": raw.get("top_nose", "down"),
        "order": raw.get("order", "reading"),
        "colours": raw.get("colours", 24),
        "round_": raw.get("round", False),
        "shade": raw.get("shade", 0.2),
        "bg_tol": raw.get("bg_tol", 28),
        "dark_thresh": raw.get("dark_thresh", 70),
    }


def load_volume(path: Path, meta: dict, override: dict | None = None) -> np.ndarray:
    image = np.asarray(Image.open(path).convert("RGBA"))
    volume, _ = slicer.views_to_slices(image, **options(meta, override))
    return volume


def compose(parts: list[tuple[np.ndarray, tuple[int, int, int]]]) -> np.ndarray:
    """Ghép lát RGBA của nhiều khối quanh cùng tâm, không dựng visual hull cho cả vòm."""
    if not parts:
        raise ValueError("Không có phần nào để ghép")
    bounds = []
    for vol, (ox, oy, oz) in parts:
        n, h, w = vol.shape[:3]
        x0, y0 = ox - w // 2, oy - h // 2
        bounds.append((x0, y0, oz, x0 + w, y0 + h, oz + n))
    min_x = min(b[0] for b in bounds)
    min_y = min(b[1] for b in bounds)
    min_z = min(b[2] for b in bounds)
    max_x = max(b[3] for b in bounds)
    max_y = max(b[4] for b in bounds)
    max_z = max(b[5] for b in bounds)
    result = np.zeros((max_z - min_z, max_y - min_y, max_x - min_x, 4), dtype=np.uint8)
    for (vol, _), (x0, y0, z0, x1, y1, z1) in zip(parts, bounds):
        target = result[z0 - min_z:z1 - min_z, y0 - min_y:y1 - min_y, x0 - min_x:x1 - min_x]
        opaque = vol[..., 3] > 0
        target[opaque] = vol[opaque]
    return result


def check_sheet(vol: np.ndarray, path: Path, squash: float, spacing: float) -> None:
    angles = (35, 135, 225, 315)
    images = [slicer.render_stack_image(vol, angle, squash, spacing) for angle in angles]
    images.append(slicer.render_stack_image(vol, 35, squash, spacing * 2.4))
    scale, pad, label_h = 3, 12, 22
    width = sum(im.width * scale + pad for im in images) + pad
    height = max(im.height for im in images) * scale + label_h + 2 * pad
    sheet = Image.new("RGB", (width, height), "#f4f0e8")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 14)
        exploded_label = "tách lớp"
    except OSError:
        font = ImageFont.load_default()
        exploded_label = "tach lop"
    x = pad
    for label, im in zip((*map(str, angles), exploded_label), images):
        draw.text((x, pad), label, fill="#202020", font=font)
        enlarged = im.resize((im.width * scale, im.height * scale), Image.Resampling.NEAREST)
        sheet.paste(enlarged, (x, pad + label_h), enlarged)
        x += enlarged.width + pad
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)


def bake_sheet(vol: np.ndarray, path: Path, squash: float, spacing: float) -> tuple[int, int]:
    frames = [slicer.render_stack_image(vol, a * 360 / 16, squash, spacing) for a in range(16)]
    fw = max(im.width for im in frames)
    fh = max(im.height for im in frames)
    sheet = Image.new("RGBA", (fw * 16, fh))
    for i, frame in enumerate(frames):
        sheet.alpha_composite(frame, (i * fw + (fw - frame.width) // 2, fh - frame.height))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path)
    return fw, fh


def build_one(source: Path, out_dir: Path, check_dir: Path, bake16: bool) -> dict:
    asset_id = source.stem
    meta_path = source.with_suffix(".json")
    if not meta_path.exists():
        raise FileNotFoundError(f"Thiếu tham số: {meta_path}")
    meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
    raw_parts = meta.get("parts", [])
    pieces = []
    if not raw_parts or meta.get("include_main", False):
        pieces.append((load_volume(source, meta), (0, 0, 0)))
    for part in raw_parts:
        name = part["file"]
        part_path = (source.parent / name).resolve()
        if part_path.parent != source.parent.resolve():
            raise ValueError(f"Đường dẫn part không hợp lệ: {name}")
        offset = tuple(part.get("offset", (0, 0, 0)))
        if len(offset) != 3 or any(type(v) is not int for v in offset):
            raise ValueError(f"offset cần ba số nguyên: {name}")
        pieces.append((load_volume(part_path, meta, part), offset))
    volume = compose(pieces)
    count, h, w = volume.shape[:3]
    spacing = float(meta.get("spacing", 1.0))
    squash = float(meta.get("squash", 0.75))
    style = meta.get("style", "pixel")
    if style not in ("pixel", "paper") or not 0 < squash <= 1 or spacing < 0:
        raise ValueError(f"Tham số style/squash/spacing không hợp lệ: {asset_id}")
    out_dir.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.concatenate(list(volume), axis=1)).save(out_dir / f"{asset_id}.png")
    check_sheet(volume, check_dir / f"{asset_id}.png", squash, spacing)
    entry = {"id": asset_id, "w": w, "h": h, "count": count,
             "spacing": spacing, "squash": squash, "style": style,
             "strip": f"out/{asset_id}.png"}
    if bake16:
        fw, fh = bake_sheet(volume, out_dir / f"{asset_id}.16.png", squash, spacing)
        entry.update({"baked": f"out/{asset_id}.16.png", "frameW": fw, "frameH": fh})
    return entry


def build_all(src_dir: Path, out_dir: Path, check_dir: Path, manifest: Path,
              only: str | None = None, bake16: bool = False) -> list[dict]:
    existing = {}
    if manifest.exists():
        existing = {e["id"]: e for e in json.loads(manifest.read_text(encoding="utf-8"))["assets"]}
    sources = sorted(src_dir.glob("*.png"))
    # Part PNG có tên trong JSON, không phải asset độc lập.
    part_names = set()
    for source in sources:
        meta_path = source.with_suffix(".json")
        if meta_path.exists():
            meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
            part_names.update(part["file"] for part in meta.get("parts", []))
    sources = [p for p in sources if p.name not in part_names]
    if only:
        sources = [p for p in sources if p.stem == only]
        if not sources:
            raise FileNotFoundError(f"Không tìm thấy asset: {only}")
    for source in sources:
        entry = build_one(source, out_dir, check_dir, bake16)
        existing[entry["id"]] = entry
        print(f"{entry['id']}: {entry['count']} lát {entry['w']}×{entry['h']}")
    entries = [existing[key] for key in sorted(existing)]
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps({"assets": entries}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return entries


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", type=Path, default=ROOT / "assets/stacks/src")
    parser.add_argument("--out", type=Path, default=ROOT / "assets/stacks/out")
    parser.add_argument("--check", type=Path, default=ROOT / "assets/stacks/check")
    parser.add_argument("--manifest", type=Path, default=ROOT / "assets/stacks/manifest.json")
    parser.add_argument("--only")
    parser.add_argument("--bake16", action="store_true")
    args = parser.parse_args()
    build_all(args.src, args.out, args.check, args.manifest, args.only, args.bake16)


if __name__ == "__main__":
    main()
