// Đọc CHANGELOG.md. Dùng làm thư viện (versions-page) hoặc chạy:
//   node scripts/changelog.mjs 0.3.0   → in phần ghi chú của phiên bản 0.3.0 (cho GitHub Release)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function readChangelog(path = new URL('../CHANGELOG.md', import.meta.url)) {
  const text = readFileSync(path, 'utf8');
  const sections = {};
  let cur = null;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^## \[(\d+\.\d+\.\d+)\](?:\s*[—-]\s*(\S+))?(?:\s*·\s*(.+))?/);
    if (m) { cur = { version: m[1], date: m[2] || '', title: (m[3] || '').trim(), body: [] }; sections[m[1]] = cur; continue; }
    if (/^## /.test(line) || /^\[.+\]:/.test(line)) { cur = null; continue; }
    if (cur) cur.body.push(line);
  }
  for (const s of Object.values(sections)) s.body = s.body.join('\n').trim();
  return sections;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const v = (process.argv[2] || '').replace(/^v/, '');
  const s = readChangelog()[v];
  if (!s) { console.error(`CHANGELOG.md không có mục [${v}]`); process.exit(1); }
  console.log(s.body);
}
