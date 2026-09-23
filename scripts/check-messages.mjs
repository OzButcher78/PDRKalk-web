#!/usr/bin/env node
/**
 * prebuild guard for messages/*.json.
 *
 * Errors (exit 1):
 *   - key-set parity across de/en/fr/it
 *   - ICU placeholder parity across those locales
 *   - a placeholder that lib/interpolate.ts cannot expand
 *   - a dot inside a key segment (breaks next-intl namespace lookup)
 *   - a literal 4.xx.yy version string anywhere in messages
 *   - download.*.version without the {version} placeholder
 *   - /au coverage: every key the /au components read must exist in au.json
 *   - a release without items, or APP_VERSION not derivable
 *
 * Warnings (exit 0):
 *   - au.json values identical to the German original (untranslated)
 *   - message keys no literal t('…') call references (dead copy)
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MESSAGES = path.join(ROOT, 'messages');
const LOCALES = ['de', 'en', 'fr', 'it'];

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const read = (name) => JSON.parse(fs.readFileSync(path.join(MESSAGES, `${name}.json`), 'utf8'));
const msgs = Object.fromEntries([...LOCALES, 'au'].map(l => [l, read(l)]));

/** Flatten to `a.b.0.c` → string, recording arrays by index. */
function flatten(node, prefix = '', out = {}) {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    out[prefix] = String(node);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
    return out;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k.includes('.')) err(`key segment contains a dot: "${prefix ? prefix + '.' : ''}${k}"`);
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

const flat = Object.fromEntries(Object.entries(msgs).map(([l, m]) => [l, flatten(m)]));

// ---------------------------------------------------------------- key parity
const base = new Set(Object.keys(flat.de));
for (const loc of LOCALES.slice(1)) {
  const other = new Set(Object.keys(flat[loc]));
  for (const k of base) if (!other.has(k)) err(`${loc}.json is missing key: ${k}`);
  for (const k of other) if (!base.has(k)) err(`${loc}.json has an extra key: ${k}`);
}

// --------------------------------------------------------- placeholder rules
const KNOWN_PLACEHOLDERS = new Set(['version', 'price', 'days', 'languages', 'n', 'caption', 'r', 'title']);
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');

for (const [key, value] of Object.entries(flat.de)) {
  for (const p of value.matchAll(/\{(\w+)\}/g)) {
    if (!KNOWN_PLACEHOLDERS.has(p[1])) err(`unknown placeholder {${p[1]}} in de.json → ${key}`);
  }
  for (const loc of LOCALES.slice(1)) {
    const other = flat[loc][key];
    if (other === undefined) continue;
    if (placeholders(value) !== placeholders(other)) {
      err(`placeholder mismatch for ${key}: de "${placeholders(value)}" vs ${loc} "${placeholders(other)}"`);
    }
  }
}

// -------------------------------------------------------------- version rules
for (const [loc, entries] of Object.entries(flat)) {
  for (const [key, value] of Object.entries(entries)) {
    if (/\b4\.\d{1,2}\.\d{1,3}\b/.test(value) && !key.startsWith('whatsNew.items') && !key.startsWith('pages.')) {
      err(`${loc}.json hard-codes a version in ${key}: "${value.slice(0, 60)}" — use {version}`);
    }
  }
  for (const key of ['download.windows.version', 'download.android.version', 'footer.versionLabel']) {
    const value = entries[key];
    if (value === undefined) continue;
    if (!value.includes('{version}')) err(`${loc}.json → ${key} must contain {version}`);
  }
}

// ---------------------------------------------------------------- /au coverage
// Namespaces read by the components that app/au/page.tsx composes.
const AU_NAMESPACES = [
  'meta', 'badges', 'nav', 'hero', 'trust', 'workflow', 'whatsNew', 'features',
  'regions', 'integrations', 'documents', 'team', 'security', 'testimonials',
  'pricing', 'faq', 'download', 'contact', 'screenshots', 'footer',
];
// Keys that /au deliberately omits (guarded with t.has or a prop).
const AU_OPTIONAL = [
  /^whatsNew\.featured/,
  /^features\.disclaimer$/,
  /^integrations\.trademarkNote$/,
  /^integrations\.tiles\./,          // AU ships a different tile set
  /^integrations\.flow\./,
  /^regions\.items\./,               // AU ships a single region card
  /^documents\.items\./,
  /^documents\.more\.items\./,
  /^features\.groups\./,             // AU ships its own group copy
  /^faq\.items\./,                   // AU ships a 15-question subset
  /^whatsNew\.items\./,
  /^whatsNew\.also\.items\./,
  /^team\.blocks\./,
  /^security\.items\./,
  /^trust\.items\./,
  /^trust\.stats\./,
  /^hero\.trustChips\./,
  /^hero\.stack\./,
  /^workflow\.steps\./,
  /^pricing\.licence\./,
  /^pricing\.journey\./,
  /^pricing\.comparison\./,
  /^pricing\.costTable\./,
  /^screenshots\.images\./,
  /^testimonials\.items\./,
  /^download\.chips\./,
  /^contact\.country_(?!au)/,
];
for (const key of Object.keys(flat.de)) {
  const ns = key.split('.')[0];
  if (!AU_NAMESPACES.includes(ns)) continue;
  if (AU_OPTIONAL.some(re => re.test(key))) continue;
  if (flat.au[key] === undefined) err(`au.json is missing key: ${key}`);
}

for (const [key, value] of Object.entries(flat.au)) {
  if (/\.(company|name|location|file|code|key|icon|status)$/.test(key)) continue;
  if (flat.de[key] !== undefined && flat.de[key] === value && value.length > 12 && /[äöüß]/i.test(value)) {
    warn(`au.json still carries the German text for ${key}`);
  }
}

// -------------------------------------------------------------------- releases
const releasesSrc = fs.readFileSync(path.join(ROOT, 'data', 'releases.ts'), 'utf8');
if (!/status:\s*'public'/.test(releasesSrc)) err('data/releases.ts has no public release — APP_VERSION cannot be derived');
for (const block of releasesSrc.split(/\n  \{\n/).slice(1)) {
  const version = block.match(/version:\s*'([^']+)'/)?.[1];
  if (version && !/items:\s*\[\s*\n\s*"/.test(block)) err(`release ${version} has no items`);
}

// -------------------------------------------------- dead keys (best effort)
const sourceFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(e.name)) sourceFiles.push(p);
  }
};
for (const d of ['app', 'components', 'lib', 'hooks', 'data']) {
  const dir = path.join(ROOT, d);
  if (fs.existsSync(dir)) walk(dir);
}
const source = sourceFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

/**
 * Best-effort dead-key report. Only leaf keys that are NOT inside an array are
 * considered (array contents are consumed wholesale by a .map()). A key counts
 * as referenced when its own segment appears in the source as a quoted string,
 * a template-literal fragment or a property access.
 */
const leafKeys = [];
const collectLeaves = (node, prefix) => {
  if (Array.isArray(node)) return;
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) collectLeaves(v, prefix ? `${prefix}.${k}` : k);
    return;
  }
  if (prefix) leafKeys.push(prefix);
};
collectLeaves(msgs.de, '');

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const segmentUsed = (seg) =>
  new RegExp(`['"\`.{]${escapeRe(seg)}['"\`}.,)\\s]`).test(source);

// Keys built at runtime, e.g. t(`country_${code}`) or t(`${field}Label`).
const dynamicPatterns = [...source.matchAll(/`([^`\n]*\$\{[^`\n]*)`/g)]
  .map(m => m[1])
  .filter(lit => /^[\w.${}\s]+$/.test(lit))
  .map(lit => new RegExp(`^${lit.split(/\$\{[^}]*\}/).map(escapeRe).join('[\\w.]+')}$`));
const builtDynamically = (tail) => dynamicPatterns.some(re => re.test(tail));

const dead = leafKeys.filter(key => {
  const parts = key.split('.');
  const leaf = parts[parts.length - 1];
  const tail = parts.slice(1).join('.');
  return !segmentUsed(leaf) && !source.includes(tail) && !builtDynamically(tail) && !builtDynamically(leaf);
});
for (const k of dead) warn(`possibly unused message key: ${k}`);

// ------------------------------------------------------------------- report
for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.error(`\ncheck-messages: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`check-messages: OK (${Object.keys(flat.de).length} keys × ${LOCALES.length} locales, ${Object.keys(flat.au).length} on /au, ${warnings.length} warning(s))`);
