#!/usr/bin/env bash
# Dựng thư mục trang web cho GitHub Pages từ các tag git.
#   /            = bản chính (tag ghi trong deploy/current.txt, "latest" = tag mới nhất)
#   /v/X.Y.Z/    = mọi phiên bản đã phát hành
#   /next/       = nhánh dev (bản thử)
#   /versions/   = trang danh sách phiên bản
# Dùng: bash scripts/build-site.sh [thư-mục-ra] [tag-bản-chính]
set -euo pipefail

OUT=${1:-_site}
CURRENT=${2:-}

TAGS=$(git tag -l 'v*' --sort=-v:refname)
LATEST=$(echo "$TAGS" | head -n1)
[ -n "$LATEST" ] || { echo "Chưa có tag phiên bản nào (v*)"; exit 1; }

if [ -z "$CURRENT" ]; then
  CURRENT=$(git show origin/main:deploy/current.txt 2>/dev/null || cat deploy/current.txt 2>/dev/null || echo latest)
fi
CURRENT=$(echo "$CURRENT" | tr -d '[:space:]')
[ "$CURRENT" = "latest" ] && CURRENT=$LATEST
if ! [[ "$CURRENT" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || ! git rev-parse -q --verify "refs/tags/$CURRENT" >/dev/null; then
  echo "Tag bản chính không hợp lệ hoặc không tồn tại: '$CURRENT'"; exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT/v"
for t in $TAGS; do
  mkdir -p "$OUT/v/${t#v}"
  git archive "$t" | tar -x -C "$OUT/v/${t#v}"
done
git archive "$CURRENT" | tar -x -C "$OUT"
if git rev-parse -q --verify refs/remotes/origin/dev >/dev/null; then
  mkdir -p "$OUT/next"
  git archive refs/remotes/origin/dev | tar -x -C "$OUT/next"
fi

echo "$CURRENT" > "$OUT/CURRENT"
mkdir -p "$OUT/versions"
node scripts/versions-page.mjs "$CURRENT" > "$OUT/versions/index.html"
touch "$OUT/.nojekyll"
echo "Bản chính: $CURRENT · có $(echo "$TAGS" | wc -l | tr -d ' ') phiên bản trong /v/"
