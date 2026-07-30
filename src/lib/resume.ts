import { PROFILE, PROJECTS, SKILLS } from "./data";

/** Builds a print-ready résumé document and downloads it. */
export function downloadResume() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${PROFILE.name} — Résumé</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Inter, sans-serif; color:#0b1222; margin:0; padding:40px; max-width:900px; }
  h1 { font-size:32px; margin:0 0 4px; letter-spacing:-.02em; }
  .role { color:#1d4ed8; font-weight:600; letter-spacing:.16em; text-transform:uppercase; font-size:11px; }
  .meta { color:#64748b; font-size:12px; margin-top:6px; }
  h2 { font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:#1d4ed8; margin:32px 0 10px; border-top:1px solid #e2e8f0; padding-top:14px; }
  p { line-height:1.65; font-size:13px; color:#334155; }
  .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
  .card { border:1px solid #e2e8f0; border-radius:10px; padding:14px; }
  .card h3 { margin:0 0 2px; font-size:14px; }
  .card .cat { font-size:10px; text-transform:uppercase; letter-spacing:.14em; color:#64748b; }
  .card ul { margin:8px 0 0 16px; padding:0; font-size:12px; color:#475569; line-height:1.6; }
  .tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .tag { font-size:10px; border:1px solid #dbeafe; background:#eff6ff; color:#1d4ed8; border-radius:99px; padding:3px 9px; }
</style></head><body>
<div class="role">${PROFILE.role}</div>
<h1>${PROFILE.name}</h1>
<div class="meta">${PROFILE.email} · ${PROFILE.location}</div>

<h2>Profile</h2>
<p>${PROFILE.intro} Twenty-plus years leading accounting, bookkeeping, inventory and financial operations, now combined with three-plus years building production software with React, TypeScript, Python, Supabase and AI tooling. I design systems that remove manual work, close books faster and give owners real numbers in real time.</p>

<h2>Core Experience</h2>
<p><strong>20+ years — Business Operations.</strong> Accounting · Bookkeeping · Inventory · Financial Operations · Business Improvement.<br/>
<strong>3+ years — Modern Software Development.</strong> React · TypeScript · Python · Supabase · Claude Code · OpenAI.</p>

<h2>Selected Systems</h2>
<div class="grid">
${PROJECTS.map(
  (p) => `<div class="card"><div class="cat">${p.category} · ${p.year}</div><h3>${p.name}</h3>
  <p style="margin:6px 0 0;font-size:12px">${p.description}</p>
  <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
  <div class="tags">${p.stack.map((s) => `<span class="tag">${s}</span>`).join("")}</div></div>`
).join("")}
</div>

<h2>Toolchain</h2>
<div class="tags">${SKILLS.map((s) => `<span class="tag">${s.name}</span>`).join("")}</div>

<h2>Contact</h2>
<p>${PROFILE.email}</p>
</body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Adrian-Llano-Resume.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
