"""Kiểm chứng ba asset thử và tính tái lập của C2. Chạy: python -I tools/art/test_build_stacks.py"""

import hashlib
import json
import runpy
import tempfile
from pathlib import Path

build_all = runpy.run_path(str(Path(__file__).with_name("build_stacks.py")))["build_all"]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    src, out, check = root / "src", root / "out", root / "check"
    src.mkdir()
    image = Path(__file__).parent / "fixtures/car-views.png"
    for name, config in (
        ("test-pixel", {"slices": 12, "style": "pixel"}),
        ("test-paper", {"slices": 16, "style": "paper", "shade": 0.1}),
        ("test-parts", {"slices": 12, "style": "pixel", "parts": [
            {"file": "left.png", "offset": [-28, 0, 0]},
            {"file": "right.png", "offset": [28, 0, 4]},
        ]}),
    ):
        (src / f"{name}.png").write_bytes(image.read_bytes())
        (src / f"{name}.json").write_text(json.dumps(config), encoding="utf-8")
    for name in ("left", "right"):
        (src / f"{name}.png").write_bytes(image.read_bytes())

    manifest = root / "manifest.json"
    entries = build_all(src, out, check, manifest, bake16=True)
    assert [e["id"] for e in entries] == ["test-paper", "test-parts", "test-pixel"]
    assert entries[1]["count"] == 16
    assert entries[1]["w"] > entries[0]["w"]
    paths = [manifest] + sorted(out.glob("*.png")) + sorted(check.glob("*.png"))
    assert len(paths) == 10, paths  # manifest + 3 dải + 3 sheet 16 góc + 3 check sheet
    first = {p.relative_to(root): digest(p) for p in paths}
    build_all(src, out, check, manifest, bake16=True)
    assert first == {p.relative_to(root): digest(p) for p in paths}

    # --only chỉ cập nhật một mục, giữ hai mục còn lại.
    single = build_all(src, out, check, manifest, only="test-paper", bake16=True)
    assert len(single) == 3
    assert first == {p.relative_to(root): digest(p) for p in paths}

print("ok")
