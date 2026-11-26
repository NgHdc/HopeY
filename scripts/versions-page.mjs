// Tạo trang /versions/: danh sách mọi phiên bản (từ git tag + CHANGELOG.md), theo phong cách Swiss Paper.
// Dùng: node scripts/versions-page.mjs <tag-bản-chính> > _site/versions/index.html
import { execFileSync } from 'node:child_process';
import { readChangelog } from './changelog.mjs';

const current = (process.argv[2] || '').replace(/^v/, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tags = execFileSync('git', ['for-each-ref', '--sort=-v:refname', '--format=%(refname:short)|%(creatordate:short)|%(contents:subject)', 'refs/tags/v*'], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean).map(l => { const [tag, date, subject] = l.split('|'); return { v: tag.replace(/^v/, ''), date, subject }; });
const log = readChangelog();

// markdown tối giản: ### tiêu đề, - gạch đầu dòng, `code`
const md = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .split('\n').map(l => l.startsWith('### ') ? `<h4>${l.slice(4)}</h4>` : l.startsWith('- ') ? `<li>${l.slice(2)}</li>` : l.trim() ? `<p>${l}</p>` : '')
  .join('\n').replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);

const rows = tags.map(t => {
  const c = log[t.v];
  const isCur = t.v === current;
  return `<article class="ver${isCur ? ' cur' : ''}">
    <div class="meta"><span class="num">${esc(t.v)}</span><span class="label">${esc(c?.date || t.date)}</span>${isCur ? '<span class="badge">đang là bản chính</span>' : ''}</div>
    <div class="body">
      <h3>${esc(c?.title || t.subject)}</h3>
      ${c ? md(c.body) : ''}
      <p class="links"><a href="../v/${esc(t.v)}/src/">Chơi bản ${esc(t.v)} →</a> · <a href="https://github.com/NgHdc/HopeY/tree/v${esc(t.v)}">mã nguồn</a></p>
    </div>
  </article>`;
}).join('\n');

console.log(`<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Phố Giấy — các phiên bản</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital@0;1&display=swap">
<style>
:root{--paper:#F1ECE2;--panel:#E7E0D1;--ink:#22262B;--ink2:#5E6266;--accent:#B0472F;--neutral:#D9C8A6}
body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.45 Arial,sans-serif}
main{max-width:860px;margin:0 auto;padding:32px 24px 64px}
.strip{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.1em;color:var(--ink2);text-transform:uppercase;border-bottom:.5px solid var(--ink);padding-bottom:6px}
.kicker{margin-top:14px;font-weight:700;font-size:12px;letter-spacing:.15em;color:var(--accent);text-transform:uppercase}
h1{font-size:30px;line-height:1;margin:6px 0}
.human{font:italic 14px/1.4 "Noto Serif",Cambria,Georgia,serif;color:var(--ink2);margin:0 0 24px}
.ver{display:grid;grid-template-columns:150px 1fr;gap:20px;border-top:.5px solid var(--neutral);padding:18px 0}
.ver.cur{outline:1.5px dashed var(--accent);outline-offset:6px}
.num{display:block;font:700 30px/1 Arial,sans-serif;color:var(--neutral)}
.cur .num{color:var(--accent)}
.label{display:block;font:12px "Courier New",monospace;color:var(--ink2);margin-top:4px}
.badge{display:inline-block;margin-top:6px;font:700 11px Arial;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
h3{margin:0 0 6px;font-size:18px}
h4{margin:10px 0 2px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2)}
ul{margin:0;padding-left:18px}li{margin:2px 0}
code{font:12px "Courier New",monospace;background:var(--panel);padding:0 3px}
a{color:var(--ink)}.links{font:12px "Courier New",monospace;margin-top:10px}
</style></head><body><main>
<div class="strip"><span>Phố Giấy / Lịch sử</span><span>${tags.length} phiên bản</span></div>
<div class="kicker">Phố đã thay đổi thế nào?</div>
<h1>Mọi phiên bản vẫn chơi được.</h1>
<p class="human">Như những lớp giấy chồng lên nhau, bản cũ không bị xóa. <a href="../">Về bản chính</a>${tags.length ? '' : ''}.</p>
${rows}
</main></body></html>`);
