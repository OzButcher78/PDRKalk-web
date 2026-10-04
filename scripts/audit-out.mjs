#!/usr/bin/env node
/**
 * postbuild audit of out/**. Runs without a browser and without a server, so it
 * can gate every build.
 *
 * Checks per page: <html lang> matches the path, exactly one h1, no heading
 * level skips, no leaked MISSING_MESSAGE / `namespace.key` / `{placeholder}`
 * text, canonical + hreflang + og:url + og:image, parsable JSON-LD with the
 * expected softwareVersion and two offers, the download anchors, the contact
 * form markup, the order form + terms on /{locale}/order/ and /au/order/, the
 * required section ids, and that every internal href/src resolves inside out/.
 *
 * Plus, once per build: out/_redirects matches public/_redirects, out/404.html
 * has a document shell, the sitemap <loc> set equals the emitted pages, the
 * manifest icons exist, and the CSS self-hosts its fonts.
 *
 * Usage: node scripts/audit-out.mjs [--baseline <dir>]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const args = process.argv.slice(2);
const baselineDir = args.includes('--baseline') ? args[args.indexOf('--baseline') + 1] : null;

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (!fs.existsSync(OUT)) {
  console.error('audit-out: out/ does not exist — run `next build` first');
  process.exit(1);
}

// ------------------------------------------------------------------ helpers
const htmlFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next') continue;
      walk(p);
    } else if (e.name.endsWith('.html')) {
      htmlFiles.push(p);
    }
  }
};
walk(OUT);

const rel = (p) => path.relative(OUT, p).split(path.sep).join('/');
const urlOf = (p) => '/' + rel(p).replace(/index\.html$/, '');

// HTML attributes are case-insensitive; Next renders hreflang as hrefLang.
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) ?? [];
const textOnly = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');

const REQUIRED_HOME_IDS = [
  'hero', 'trust', 'timesavings', 'demo', 'workflow', 'screenshots', 'whats-new',
  'features', 'more', 'regions', 'import', 'ai', 'documents', 'team', 'data',
  'testimonials', 'pricing', 'comparison', 'faq', 'download', 'contact',
];
const AU_IDS = REQUIRED_HOME_IDS.filter(id => id !== 'demo' && id !== 'ai');

const LOCALES = ['de', 'en', 'fr', 'it'];

// -------------------------------------------------------------- per-page audit
const pageUrls = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const url = urlOf(file);
  const name = rel(file);
  if (!name.startsWith('404')) pageUrls.add(url);

  // --- document shell
  const htmlTag = html.match(/<html\b[^>]*>/)?.[0];
  if (!htmlTag) { err(`${name}: no <html> tag`); continue; }
  if (!/<body\b/.test(html)) err(`${name}: no <body> tag`);

  const lang = attr(htmlTag, 'lang');
  const seg = url.split('/')[1];
  if (LOCALES.includes(seg) && lang !== seg) err(`${name}: <html lang="${lang}"> does not match /${seg}/`);
  if (seg === 'au' && lang !== 'en-AU') err(`${name}: /au/ must be lang="en-AU", got "${lang}"`);

  // --- headings
  const headings = [...html.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
  const h1s = headings.filter(h => h === 1).length;
  if (name.startsWith('404') || name.startsWith('_not-found')) {
    if (h1s > 1) err(`${name}: ${h1s} <h1> elements`);
  } else if (h1s !== 1) {
    err(`${name}: expected exactly one <h1>, found ${h1s}`);
  }
  let prev = 0;
  for (const level of headings) {
    if (prev && level > prev + 1) { warn(`${name}: heading level skip h${prev} → h${level}`); break; }
    prev = level;
  }

  // --- leaked message plumbing
  const text = textOnly(html);
  if (text.includes('MISSING_MESSAGE')) err(`${name}: MISSING_MESSAGE in the rendered text`);
  const literalKey = text.match(/\b(hero|nav|trust|demo|workflow|whatsNew|features|regions|integrations|documents|team|security|testimonials|pricing|faq|download|contact|footer|updates|pages|badges|screenshots|order)\.[a-zA-Z][\w.]*/);
  if (literalKey) err(`${name}: literal message key in text: ${literalKey[0]}`);
  const PLACEHOLDER_RE = /\{(version|price|priceEur|days|languages|years|paymentDays|n|caption|r|title|amount|email)\}/;
  const placeholder = text.match(PLACEHOLDER_RE);
  if (placeholder) err(`${name}: unexpanded placeholder in text: ${placeholder[0]}`);
  // Several raw strings reach only an attribute (alt, aria-label, title).
  for (const attrMatch of html.matchAll(/(?:alt|title|aria-label|content)="([^"]*)"/g)) {
    const leak = attrMatch[1].match(PLACEHOLDER_RE);
    if (leak) { err(`${name}: unexpanded placeholder in an attribute: ${leak[0]}`); break; }
  }

  // --- SEO head
  const isErrorPage = name.startsWith('404') || name.startsWith('_not-found');
  const canonical = tags(html, 'link').find(t => /rel="canonical"/.test(t));
  if (!canonical && !isErrorPage) err(`${name}: no canonical link`);
  const ogUrl = tags(html, 'meta').find(t => /property="og:url"/.test(t));
  if (!ogUrl && !isErrorPage) err(`${name}: no og:url`);
  const ogImage = tags(html, 'meta').find(t => /property="og:image"/.test(t));
  if (!ogImage && !isErrorPage) err(`${name}: no og:image`);

  if (LOCALES.includes(seg)) {
    const alternates = tags(html, 'link').filter(t => /rel="alternate"/.test(t));
    const hreflangs = alternates.map(t => attr(t, 'hreflang')).filter(Boolean);
    for (const l of [...LOCALES, 'x-default']) {
      if (!hreflangs.includes(l)) err(`${name}: missing hreflang="${l}"`);
    }
  }
  if (seg === 'au') {
    if (tags(html, 'link').some(t => /rel="alternate"/.test(t) && /hreflang/i.test(t))) {
      err(`${name}: /au/ must not carry hreflang alternates`);
    }
  }

  // --- JSON-LD
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch {
      err(`${name}: JSON-LD does not parse`);
      continue;
    }
    const nodes = data['@graph'] ?? [data];
    for (const node of nodes) {
      if (node['@type'] === 'SoftwareApplication') {
        if (!node.softwareVersion) err(`${name}: SoftwareApplication has no softwareVersion`);
        if (!Array.isArray(node.offers) || node.offers.length !== 2) {
          err(`${name}: SoftwareApplication should carry exactly 2 offers`);
        }
      }
      if (node['@type'] === 'FAQPage' && (!node.mainEntity || node.mainEntity.length === 0)) {
        err(`${name}: FAQPage with no questions`);
      }
    }
  }

  // --- home / AU specific structure
  const isHome = (LOCALES.includes(seg) && url === `/${seg}/`) || url === '/au/';
  if (isHome) {
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    const required = url === '/au/' ? AU_IDS : REQUIRED_HOME_IDS;
    for (const id of required) {
      const count = ids.filter(i => i === id).length;
      if (count === 0) err(`${name}: missing id="${id}"`);
      else if (count > 1) err(`${name}: id="${id}" appears ${count}×`);
    }

    // download section: exactly two installer anchors with the right attributes
    const downloadAnchors = [...html.matchAll(/<a\b[^>]*href="(https:\/\/updates\.pdrkalk\.ch\/[^"]+)"[^>]*>/g)];
    const inDownloadCard = downloadAnchors.filter(a => /download/.test(a[0]) && /class="btn btn-red/.test(a[0]));
    if (inDownloadCard.length !== 2) err(`${name}: expected 2 installer buttons, found ${inDownloadCard.length}`);
    for (const a of downloadAnchors) {
      if (!/target="_blank"/.test(a[0])) err(`${name}: installer anchor without target="_blank"`);
      if (!/rel="noopener noreferrer"/.test(a[0])) err(`${name}: installer anchor without rel="noopener noreferrer"`);
      if (!/\sdownload/.test(a[0])) err(`${name}: installer anchor without the download attribute`);
    }

    // contact form
    const form = html.match(/<form\b[^>]*>/)?.[0];
    if (!form) err(`${name}: no contact form`);
    else {
      if (!/noValidate|novalidate/.test(form)) err(`${name}: form is missing noValidate`);
      if (/\saction=/.test(form)) err(`${name}: form must not have an action attribute`);
      if (/\smethod=/.test(form)) err(`${name}: form must not have a method attribute`);
    }
    const names = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*\sname="([^"]+)"/g)].map(m => m[1]).sort();
    for (const required of ['intent', 'firstName', 'lastName', 'email', 'message']) {
      if (!names.includes(required)) err(`${name}: form field "${required}" is missing`);
    }
    for (const v of ['buy', 'inquiry']) {
      if (!html.includes(`value="${v}"`)) err(`${name}: intent radio "${v}" is missing`);
    }
    if (!/\[at\]/.test(html)) err(`${name}: obfuscated e-mail fallback is missing`);
  }

  // --- order page: terms + form with the consent checkbox
  if (/^\/(de|en|fr|it|au)\/order\/$/.test(url)) {
    const form = html.match(/<form\b[^>]*>/)?.[0];
    if (!form || !/noValidate|novalidate/.test(form)) err(`${name}: order form missing or without noValidate`);
    if ((html.match(/\sid="terms"/g) ?? []).length !== 1) err(`${name}: expected exactly one id="terms"`);
    if (!/<input\b(?=[^>]*type="checkbox")(?=[^>]*name="consent")[^>]*>/.test(html)) err(`${name}: consent checkbox is missing`);
  }

  // --- internal links resolve
  const refs = [
    ...[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/<source\b[^>]*srcSet="([^"]+)"/gi)].map(m => m[1]),
    ...[...html.matchAll(/<source\b[^>]*srcset="([^"]+)"/gi)].map(m => m[1]),
  ];
  for (const raw of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)) {
      if (/fonts\.(googleapis|gstatic)\.com/.test(raw)) err(`${name}: still links to Google Fonts (${raw})`);
      continue;
    }
    for (const candidate of raw.split(',').map(s => s.trim().split(/\s+/)[0]).filter(Boolean)) {
      const clean = candidate.split('#')[0].split('?')[0];
      if (!clean.startsWith('/')) continue;
      if (clean.includes('/en-AU/')) err(`${name}: emits an /en-AU/ link (${clean})`);
      const target = path.join(OUT, decodeURIComponent(clean));
      const ok = fs.existsSync(target) || fs.existsSync(target + 'index.html') || fs.existsSync(target.replace(/\/$/, '') + '.html');
      if (!ok) err(`${name}: broken internal link ${clean}`);
      if (clean !== '/' && !clean.includes('.') && !clean.endsWith('/')) {
        err(`${name}: internal link without a trailing slash: ${clean}`);
      }
    }
  }
}

// ------------------------------------------------------------- once per build
// The desktop app's «Bestellen» link and every buy CTA point at these.
for (const seg of [...LOCALES, 'au']) {
  if (!pageUrls.has(`/${seg}/order/`)) err(`/${seg}/order/ was not emitted`);
}

const redirectsOut = path.join(OUT, '_redirects');
const redirectsSrc = path.join(ROOT, 'public', '_redirects');
if (!fs.existsSync(redirectsOut)) err('out/_redirects is missing');
else if (fs.readFileSync(redirectsOut, 'utf8') !== fs.readFileSync(redirectsSrc, 'utf8')) {
  err('out/_redirects differs from public/_redirects');
}

const notFound = path.join(OUT, '404.html');
if (!fs.existsSync(notFound)) err('out/404.html is missing');
else {
  const html = fs.readFileSync(notFound, 'utf8');
  if (!/<html\s+lang=/.test(html)) err('out/404.html has no <html lang>');
  if (!/<body/.test(html)) err('out/404.html has no <body>');
}

const sitemapPath = path.join(OUT, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) err('out/sitemap.xml is missing');
else {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>https:\/\/pdrkalk\.ch([^<]*)<\/loc>/g)].map(m => m[1]);
  for (const loc of locs) {
    if (!pageUrls.has(loc)) err(`sitemap lists ${loc} but no such page was emitted`);
  }
  for (const url of pageUrls) {
    if (url === '/' || url.startsWith('/_')) continue;
    if (!locs.includes(url)) warn(`page ${url} is not in the sitemap`);
  }
}

const manifestPath = path.join(OUT, 'manifest.webmanifest');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const icon of manifest.icons ?? []) {
    if (!fs.existsSync(path.join(OUT, icon.src))) err(`manifest icon missing: ${icon.src}`);
  }
}

// CSS must self-host the fonts. Turbopack emits stylesheets under
// _next/static/chunks, not _next/static/css — walk the whole tree so the guard
// cannot go quiet the next time Next changes where it puts them.
const cssFiles = [];
const walkCss = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkCss(p);
    else if (e.name.endsWith('.css')) cssFiles.push(p);
  }
};
walkCss(path.join(OUT, '_next'));
if (cssFiles.length === 0) {
  err('no CSS emitted under out/_next — the font self-hosting check cannot run');
} else {
  const css = cssFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
  if (!/@font-face/.test(css)) err('no @font-face in the emitted CSS — fonts are not self-hosted');
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(css)) err('CSS still references Google Fonts');
}

// OG images: declared dimensions must match the file
for (const og of ['og/home.jpg', 'og/au.jpg']) {
  const p = path.join(OUT, og);
  if (!fs.existsSync(p)) { err(`missing OG image ${og}`); continue; }
  const meta = await sharp(p).metadata();
  if (meta.width !== 1200 || meta.height !== 630) {
    err(`${og} is ${meta.width}×${meta.height}, expected 1200×630`);
  }
}

// ------------------------------------------------------------------ baseline
if (baselineDir) {
  const baseIdsFor = (file) => {
    if (!fs.existsSync(file)) return null;
    const html = fs.readFileSync(file, 'utf8');
    return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  };
  for (const home of [...LOCALES.map(l => `${l}/index.html`), 'au/index.html']) {
    const before = baseIdsFor(path.join(baselineDir, home));
    const after = baseIdsFor(path.join(OUT, home));
    if (!before || !after) continue;
    for (const id of before) {
      if (!after.has(id) && !id.startsWith('radix') && !/^:/.test(id)) {
        warn(`baseline: ${home} lost id="${id}"`);
      }
    }
  }
}

// -------------------------------------------------------------------- report
for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.error(`\naudit-out: ${errors.length} error(s), ${warnings.length} warning(s) across ${htmlFiles.length} pages`);
  process.exit(1);
}
console.log(`audit-out: OK (${htmlFiles.length} pages, ${warnings.length} warning(s))`);
