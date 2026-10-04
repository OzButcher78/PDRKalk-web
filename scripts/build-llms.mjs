#!/usr/bin/env node
/**
 * Regenerates public/llms.txt from the same constants the site renders, so the
 * version, price and page list can never drift. Run via `npm run llms`
 * (it is also safe to run at any time — the output is committed).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const releasesSrc = fs.readFileSync(path.join(ROOT, 'data', 'releases.ts'), 'utf8');
const APP_VERSION = releasesSrc.match(/version:\s*'([^']+)',\s*\n\s*status:\s*'public'/)?.[1];
if (!APP_VERSION) throw new Error('could not derive APP_VERSION from data/releases.ts');

const pagesSrc = fs.readFileSync(path.join(ROOT, 'data', 'pages.ts'), 'utf8');
const slugBlocks = [...pagesSrc.matchAll(/slugs:\s*\{([^}]+)\}/g)].map(m =>
  Object.fromEntries([...m[1].matchAll(/(\w+):\s*'([^']+)'/g)].map(x => [x[1], x[2]])),
);

const LOCALES = ['de', 'en', 'fr', 'it'];
const SITE = 'https://pdrkalk.ch';

const pages = [
  ...LOCALES.map(l => `- ${SITE}/${l}/ — home (${l})`),
  `- ${SITE}/au/ — Australian landing page (AUD, GST)`,
  ...LOCALES.map(l => `- ${SITE}/${l}/order/ — licence order form with terms (${l})`),
  `- ${SITE}/au/order/ — Australian licence order form (AUD, GST)`,
  ...LOCALES.map(l => `- ${SITE}/${l}/updates/ — release notes (${l})`),
  ...slugBlocks.flatMap(slugs => LOCALES.map(l => `- ${SITE}/${l}/${slugs[l]}/ — feature page (${l})`)),
  ...LOCALES.map(l => `- ${SITE}/${l}/privacy/ — privacy policy (${l})`),
  `- ${SITE}/sitemap.xml — sitemap`,
];

const txt = `# PDR Kalk

> Offline desktop software for PDR (paintless dent repair) technicians: estimate hail and parking damage, produce reports, Swiss QR-bills and ZUGFeRD / Factur-X e-invoices, and run the whole job-to-invoice workflow without a cloud or a subscription.

## About

PDR Kalk is built by Balmer Storm Solutions, a Swiss company founded by Dieter Balmer, a PDR technician with over 25 years of hail and parking-damage repair experience. It runs locally on Windows and Android, keeps all data on the user's own device or NAS, and is sold as a one-time perpetual licence (CHF 550 plus Swiss VAT; EUR 580 for EU companies with a VAT ID; AUD 590 on the Australian page) with a free 30-day trial. There is no expiry date and no renewal. PDR Kalk is GDPR / revDSG compliant and serves workshops in Switzerland, Germany, Austria, Belgium, the Netherlands and Australia.

## Key facts

- Product: PDR Kalk desktop application
- Current version: ${APP_VERSION}
- Maker: Balmer Storm Solutions (Switzerland)
- Founder: Dieter Balmer
- Pricing: one-time perpetual licence, CHF 550 plus 8.1 % Swiss VAT; EUR 580 for EU companies with a VAT ID (reverse charge, no VAT); AUD 590 on /au/. No expiry date, no monthly fee, no per-user cost. Minor updates included; optional insurance-list updates may attract a small fee
- How to buy: binding order through the order page (/de/order/, /en/order/, /fr/order/, /it/order/, /au/order/), business customers only; invoice by email, payable by bank transfer within 14 days; licence details are sent once payment has arrived. No refunds — the 30-day trial is the test period
- Trial: 30 days, full feature set, direct download, no sign-up and no credit card
- Platforms: Windows 10/11 and Android 10+ (Apple devices and smartphones are not supported)
- Markets: Switzerland (CH), Germany (DE), Austria (AT), Australia (AU), Belgium (BE), Netherlands (NL)
- App interface languages: 7 (German, French, Italian, English, Dutch, Portuguese, Spanish)
- Document language is chosen per document, independently of the app language
- Tariff matrices: VFFS (CH), Zurich mixed hail (CH), German AW list with removal/refitting (DE), Austria, Belgium UPEX List (UPEX 2015). Netherlands hail matrix to follow
- Australia hail estimating: per panel, per vehicle, triage tier or hourly
- Invoicing: Swiss QR-bill, ZUGFeRD / Factur-X (PDF/A-3 with embedded XML, EN 16931), GST tax invoices on /au/
- Accounting export: DATEV CSV, VAT export, open receivables as Excel
- Audit trail: SHA-256 hash chain, automatic document versions, PDF snapshots, JSON export
- Sync: shared work folder on the user's own NAS, OneDrive or Synology Drive (Windows only); Android tablets run standalone
- Data ownership: 100 % local, full ZIP backup on the device, no vendor cloud, no telemetry
- Contact: info@pdrkalk.ch

## What is new

- Hail document import (since 4.26.63, Switzerland first): PDR Kalk reads an existing hail-scanner dent protocol or SilverDAT calculation from a PDF that has a text layer, shows a review screen, and applies panels, dents, parts, removal/refitting items and additional costs after the user approves. Processed entirely on the device. It is not an interface to SilverDAT — it reads a PDF the user already has.
- Document language: invoices, reports and emails go out in the customer's language, independent of the app language.
- Fixed price / manual mode now works independently of the tariff table, in every country.
- Optional AI scan for the vehicle registration and VIN: off by default, bring-your-own provider key. The holder's name and address are blacked out in the image, which then goes directly to the provider the user chose (Infomaniak CH recommended, Mistral AI EU, OpenAI or Anthropic USA only after explicit confirmation) — never through PDR Kalk's servers.

## What problem it solves

PDR technicians traditionally estimate hail and parking damage in spreadsheets, then re-enter the same data into separate tools for reports, invoices and accounting. PDR Kalk replaces that chain with one offline application covering estimation, report generation, customer approval with a signature, insurance hand-off, the subcontractor workflow, invoicing (including the Swiss QR-bill and German e-invoice) and accounting export — saving 30 to 60 minutes per job and removing transcription errors.

## Who it is for

Independent PDR technicians, hail-repair workshops and PDR subcontractors in Switzerland, Germany, Austria, Belgium, the Netherlands and Australia who want a one-time purchase that runs offline and keeps customer data on their own hardware.

## Pages

${pages.join('\n')}
`;

fs.writeFileSync(path.join(ROOT, 'public', 'llms.txt'), txt);
console.log(`build-llms: wrote public/llms.txt (version ${APP_VERSION}, ${pages.length} pages)`);
