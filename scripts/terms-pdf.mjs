#!/usr/bin/env node
/**
 * Renders the terms and conditions to A4 PDFs — one per routing locale plus
 * the /au variant — so the exact text the website shows can be attached to
 * every licence invoice.
 *
 * Source of truth: the `terms` namespace in messages/{de,en,fr,it,au}.json and
 * the constants in lib/site.ts (prices, trial days, payment term, TERMS_VERSION,
 * TERMS_PDF = output paths under public/). Run via `npm run terms:pdf` after
 * editing the terms or bumping TERMS_VERSION; the PDFs are committed and served
 * as static assets, and the terms page links to them.
 *
 * Needs a locally installed Chromium-based browser. Edge (ships with Windows)
 * and Chrome are auto-detected; override with PDF_BROWSER=<path to executable>.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MESSAGES = path.join(ROOT, 'messages');
const PUBLIC = path.join(ROOT, 'public');

// ------------------------------------------------------- constants (lib/site.ts)
const siteSrc = fs.readFileSync(path.join(ROOT, 'lib', 'site.ts'), 'utf8');
const scalar = (name) => {
  const m = siteSrc.match(new RegExp(`export const ${name}\\s*=\\s*([^;\\n]+);`));
  if (!m) throw new Error(`lib/site.ts: cannot read ${name}`);
  const v = m[1].trim();
  return /^['"]/.test(v) ? v.slice(1, -1) : Number(v);
};
const VALUES = {
  price: scalar('PRICE_CHF'),
  priceEur: scalar('PRICE_EUR'),
  days: scalar('TRIAL_DAYS'),
  paymentDays: scalar('PAYMENT_TERM_DAYS'),
};
const TERMS_VERSION = scalar('TERMS_VERSION');
const pdfBlock = siteSrc.match(/export const TERMS_PDF[^=]*=\s*\{([\s\S]*?)\};/);
if (!pdfBlock) throw new Error('lib/site.ts: cannot read TERMS_PDF');
const TERMS_PDF = Object.fromEntries([...pdfBlock[1].matchAll(/(\w+):\s*'([^']+)'/g)].map(m => [m[1], m[2]]));

const LANG = {de: 'de-CH', en: 'en', fr: 'fr-CH', it: 'it-CH', au: 'en-AU'};

// ------------------------------------------------------------------- browser
// Chrome before Edge: on Windows, msedge.exe hands off to an already running
// Edge and exits with code 0 before puppeteer can attach ("Failed to launch
// the browser process: Code: 0"), so Edge only works while Edge is closed.
const BROWSERS = [
  process.env.PDF_BROWSER,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);
const executablePath = BROWSERS.find(p => fs.existsSync(p));
if (!executablePath) {
  console.error('terms-pdf: no Chromium-based browser found — set PDF_BROWSER=<path to msedge.exe / chrome.exe>');
  process.exit(1);
}

// ---------------------------------------------------------------------- html
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => (k in VALUES ? String(VALUES[k]) : m));
const text = (s) => esc(fill(s));

const logo = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, 'logo-640.png')).toString('base64')}`;

const CSS = `
  @page { size: A4; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0; color: #1f2937;
    font-family: "Segoe UI", "Helvetica Neue", Arial, Helvetica, sans-serif;
    font-size: 9.6pt; line-height: 1.45;
    hyphens: auto; -webkit-hyphens: auto;
  }
  header { display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 2px solid #e8001d; padding-bottom: 4mm; margin-bottom: 7mm; }
  header img { height: 13mm; width: auto; display: block; }
  header .meta { text-align: right; font-size: 8.4pt; color: #6b7280; line-height: 1.4; }
  h1 { font-size: 17pt; font-weight: 800; letter-spacing: 0.01em; margin: 0 0 2mm; color: #111827; }
  .stamp { font-size: 8.6pt; color: #6b7280; margin: 0 0 4mm; letter-spacing: 0.03em; }
  .intro { margin: 0 0 5mm; font-size: 10pt; }
  .seller { border-left: 3px solid #e8001d; padding: 1.5mm 0 1.5mm 4mm; margin: 0 0 7mm; font-size: 9.2pt; color: #374151; }
  .seller strong { color: #111827; }
  section { break-inside: auto; margin-top: 5mm; }
  h2 { font-size: 11.4pt; font-weight: 700; margin: 0 0 2mm; color: #111827; break-after: avoid; page-break-after: avoid; }
  ol.clauses { list-style: none; margin: 0; padding: 0; }
  ol.clauses > li { display: grid; grid-template-columns: 10mm 1fr; column-gap: 2mm; margin-top: 1.6mm; break-inside: avoid; page-break-inside: avoid; }
  /* A clause with a bullet list runs half a page — let it break between bullets
     instead of leaving a page half empty; only its intro line is pinned to the
     first bullet. (A blanket break-after: avoid on every <p> chains whole
     sections into one unbreakable block — measured: +1 page and two half-empty
     pages.) */
  ol.clauses > li.has-list { break-inside: auto; page-break-inside: auto; }
  ol.clauses > li.has-list > div > p { break-after: avoid; page-break-after: avoid; }
  ol.clauses > li > .n { color: #6b7280; font-weight: 700; font-variant-numeric: tabular-nums; }
  ol.clauses p { margin: 0; }
  ol.clauses ul { margin: 1.2mm 0 0; padding-left: 4.5mm; }
  ol.clauses ul li { margin-top: 0.6mm; break-inside: avoid; page-break-inside: avoid; }
  .end { margin-top: 8mm; font-size: 8.4pt; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 2mm; }
`;

function render(locale, t) {
  const sections = t.sections.map((s, i) => {
    const items = s.items.map((c, j) => {
      const body = typeof c === 'string' ? c : c.text;
      const bullets = typeof c === 'string' ? [] : c.bullets;
      const list = bullets.length
        ? `<ul>${bullets.map(b => `<li>${text(b)}</li>`).join('')}</ul>`
        : '';
      return `<li${bullets.length ? ' class="has-list"' : ''}><span class="n">${i + 1}.${j + 1}</span><div><p>${text(body)}</p>${list}</div></li>`;
    }).join('');
    return `<section id="${esc(s.id)}"><h2>${i + 1}. ${text(s.title)}</h2><ol class="clauses">${items}</ol></section>`;
  }).join('');

  const seller = t.sellerLines.map((l, i) => (i === 0 ? `<strong>${esc(l)}</strong>` : esc(l))).join('<br>');

  return `<!doctype html>
<html lang="${LANG[locale]}">
<head><meta charset="utf-8"><title>${text(t.title)} — PDR Kalk</title><style>${CSS}</style></head>
<body>
  <header>
    <img src="${logo}" alt="PDR Kalk">
    <div class="meta">${esc(t.sellerLines[0])}<br>pdrkalk.ch · ${esc(t.sellerLines[t.sellerLines.length - 1])}</div>
  </header>
  <h1>${text(t.title)}</h1>
  <p class="stamp">${text(t.lastUpdated)} · ${text(t.versionLabel)} ${esc(TERMS_VERSION)}</p>
  <p class="intro">${text(t.intro)}</p>
  <div class="seller">${esc(t.sellerTitle)}<br>${seller}</div>
  ${sections}
  <p class="end">PDR Kalk · ${text(t.title)} · ${text(t.versionLabel)} ${esc(TERMS_VERSION)} · ${text(t.lastUpdated)}</p>
</body>
</html>`;
}

const footerTemplate = (t) => `
  <div style="font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:7.4pt;color:#6b7280;width:100%;padding:0 18mm 0 20mm;display:flex;justify-content:space-between;align-items:baseline;">
    <span>PDR Kalk · ${text(t.title)} · ${text(t.versionLabel)} ${esc(TERMS_VERSION)} · ${esc(t.sellerLines[0])}</span>
    <span>${text(t.pdfPage)} <span class="pageNumber"></span> ${text(t.pdfOf)} <span class="totalPages"></span></span>
  </div>`;

// ------------------------------------------------------------------- render
const browser = await puppeteer.launch({executablePath, headless: true});
try {
  const page = await browser.newPage();
  for (const [locale, rel] of Object.entries(TERMS_PDF)) {
    const t = JSON.parse(fs.readFileSync(path.join(MESSAGES, `${locale}.json`), 'utf8')).terms;
    if (!t) throw new Error(`${locale}.json has no terms namespace`);
    const out = path.join(PUBLIC, rel);
    fs.mkdirSync(path.dirname(out), {recursive: true});

    await page.setContent(render(locale, t), {waitUntil: 'load'});
    await page.evaluateHandle('document.fonts.ready');
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: footerTemplate(t),
      margin: {top: '16mm', right: '18mm', bottom: '18mm', left: '20mm'},
    });
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`terms-pdf: ${rel} (${kb} KB, ${t.sections.length} sections, version ${TERMS_VERSION})`);
  }
} finally {
  await browser.close();
}
