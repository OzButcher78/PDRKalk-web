#!/usr/bin/env node
/**
 * npm run images — regenerate every derived image asset. Outputs are COMMITTED,
 * so this only has to run when a source image is added or replaced.
 *
 * Produces:
 *   public/screenshots/_opt/<name>-640.webp / -1280.webp   (+ au/ subfolder)
 *   lib/screenshot-manifest.json                            (w/h/widths per file)
 *   public/logo-320.(png|webp), logo-640.(png|webp)
 *   public/a-microsoft-176.png, a-microsoft-352.png
 *   public/android-176.png, android-352.png
 *   public/og/home.jpg, public/og/au.jpg                    (1200x630)
 *   public/video-poster-1280.(webp|jpg)
 *   public/favicon/icon-512.png, icon-maskable-512.png
 *
 * Idempotent: an output is rewritten only when it is missing or older than its
 * source. Pass --force to rebuild everything.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const SHOTS = path.join(PUBLIC, 'screenshots');
const OPT = path.join(SHOTS, '_opt');
const FORCE = process.argv.includes('--force');

const WIDTHS = [640, 1280];
let written = 0;
let skipped = 0;
let bytes = 0;

const mkdir = (d) => fs.mkdirSync(d, {recursive: true});
const stale = (src, out) => {
  if (FORCE || !fs.existsSync(out)) return true;
  return fs.statSync(src).mtimeMs > fs.statSync(out).mtimeMs;
};
const note = (out) => {
  written++;
  bytes += fs.statSync(out).size;
  process.stdout.write('.');
};

async function screenshots() {
  const manifest = {};
  const groups = [
    {dir: SHOTS, prefix: ''},
    {dir: path.join(SHOTS, 'au'), prefix: 'au/'},
  ];

  for (const {dir, prefix} of groups) {
    if (!fs.existsSync(dir)) continue;
    const outDir = path.join(OPT, prefix);
    mkdir(outDir);
    const files = fs.readdirSync(dir).filter(f => /\.jpe?g$/i.test(f));
    for (const file of files) {
      const src = path.join(dir, file);
      const meta = await sharp(src).metadata();
      const base = file.replace(/\.jpe?g$/i, '');
      const widths = [];
      for (const w of WIDTHS) {
        if (meta.width && meta.width < w * 0.9 && w !== WIDTHS[0]) continue;
        widths.push(w);
        const out = path.join(outDir, `${base}-${w}.webp`);
        if (!stale(src, out)) { skipped++; continue; }
        await sharp(src).resize({width: w, withoutEnlargement: true}).webp({quality: 78}).toFile(out);
        note(out);
      }
      manifest[prefix + file] = {w: meta.width ?? 0, h: meta.height ?? 0, widths};
    }
  }

  const manifestPath = path.join(ROOT, 'lib', 'screenshot-manifest.json');
  mkdir(path.dirname(manifestPath));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 0) + '\n');
  console.log(`\n  screenshots: ${Object.keys(manifest).length} entries in lib/screenshot-manifest.json`);
}

async function logo() {
  const src = path.join(PUBLIC, 'logo.png');
  if (!fs.existsSync(src)) return;
  for (const w of [320, 640]) {
    for (const ext of ['png', 'webp']) {
      const out = path.join(PUBLIC, `logo-${w}.${ext}`);
      if (!stale(src, out)) { skipped++; continue; }
      const pipe = sharp(src).trim({threshold: 12}).resize({width: w, withoutEnlargement: true});
      await (ext === 'png' ? pipe.png({compressionLevel: 9}) : pipe.webp({quality: 90})).toFile(out);
      note(out);
    }
  }
}

async function storeBadges() {
  for (const name of ['a-microsoft', 'android']) {
    const src = path.join(PUBLIC, `${name}.png`);
    if (!fs.existsSync(src)) continue;
    for (const w of [176, 352]) {
      const out = path.join(PUBLIC, `${name}-${w}.png`);
      if (!stale(src, out)) { skipped++; continue; }
      await sharp(src).resize({width: w, withoutEnlargement: true}).png({compressionLevel: 9}).toFile(out);
      note(out);
    }
  }
}

/** 1200x630 social card: ink background, red bar, logo, cropped dashboard. */
async function ogImage(shot, out) {
  const src = path.join(SHOTS, shot);
  if (!fs.existsSync(src)) return;
  if (!stale(src, out)) { skipped++; return; }
  mkdir(path.dirname(out));

  const W = 1200, H = 630;
  const shotBuf = await sharp(src)
    .resize({width: 760, height: 470, fit: 'cover', position: 'top'})
    .toBuffer();
  const logoSrc = path.join(PUBLIC, 'logo.png');
  const logoBuf = fs.existsSync(logoSrc)
    ? await sharp(logoSrc).trim({threshold: 12}).resize({width: 300}).toBuffer()
    : null;

  const layers = [
    {
      input: Buffer.from(
        `<svg width="${W}" height="${H}">
           <defs><radialGradient id="g" cx="72%" cy="42%" r="62%">
             <stop offset="0%" stop-color="#2563eb" stop-opacity="0.28"/>
             <stop offset="100%" stop-color="#0a0f1e" stop-opacity="0"/>
           </radialGradient></defs>
           <rect width="${W}" height="${H}" fill="#0a0f1e"/>
           <rect width="${W}" height="${H}" fill="url(#g)"/>
           <rect x="0" y="0" width="10" height="${H}" fill="#e8001d"/>
         </svg>`,
      ),
      top: 0,
      left: 0,
    },
    {input: shotBuf, top: 80, left: 400},
  ];
  if (logoBuf) layers.push({input: logoBuf, top: 78, left: 70});

  await sharp({create: {width: W, height: H, channels: 3, background: '#0a0f1e'}})
    .composite(layers)
    .jpeg({quality: 86, mozjpeg: true})
    .toFile(out);
  note(out);
}

async function videoPoster() {
  const src = path.join(SHOTS, 'dashboard.jpg');
  if (!fs.existsSync(src)) return;
  for (const ext of ['webp', 'jpg']) {
    const out = path.join(PUBLIC, `video-poster-1280.${ext}`);
    if (!stale(src, out)) { skipped++; continue; }
    const pipe = sharp(src)
      .resize({width: 1280, height: 720, fit: 'cover', position: 'top'})
      .modulate({brightness: 0.72});
    await (ext === 'webp' ? pipe.webp({quality: 80}) : pipe.jpeg({quality: 82, mozjpeg: true})).toFile(out);
    note(out);
  }
}

async function icons() {
  const src = path.join(PUBLIC, 'favicon', 'android-chrome-192x192.png');
  if (!fs.existsSync(src)) return;
  const out512 = path.join(PUBLIC, 'favicon', 'icon-512.png');
  if (stale(src, out512)) {
    await sharp(src).resize(512, 512, {fit: 'contain', background: '#0a0f1e'}).png().toFile(out512);
    note(out512);
  } else skipped++;

  const maskable = path.join(PUBLIC, 'favicon', 'icon-maskable-512.png');
  if (stale(src, maskable)) {
    const inner = await sharp(src).resize(360, 360, {fit: 'contain', background: {r: 10, g: 15, b: 30, alpha: 0}}).toBuffer();
    await sharp({create: {width: 512, height: 512, channels: 4, background: '#0a0f1e'}})
      .composite([{input: inner, top: 76, left: 76}])
      .png()
      .toFile(maskable);
    note(maskable);
  } else skipped++;
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

console.log('Optimizing images…');
await screenshots();
await logo();
await storeBadges();
await ogImage('dashboard.jpg', path.join(PUBLIC, 'og', 'home.jpg'));
await ogImage('au/dashboard.jpg', path.join(PUBLIC, 'og', 'au.jpg'));
await videoPoster();
await icons();
console.log(`\nDone — ${written} written (${kb(bytes)}), ${skipped} up to date.`);
