import {releases, type Release} from '@/data/releases';

// ---------------------------------------------------------------------------
// Single source of truth for versions, URLs, prices and CTA targets.
// A release bump is ONE entry in data/releases.ts — everything below follows.
// ---------------------------------------------------------------------------

/**
 * Picked by date, not by position: appending a new entry at the bottom of
 * data/releases.ts is the natural mistake, and `find()` would then keep every
 * download URL and the JSON-LD softwareVersion on the previous version.
 */
const newestBy = (status: Release['status']) =>
  releases
    .filter(r => r.status === status)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))[0];

/** Newest released version (data/releases.ts, status 'public'). */
export const APP_VERSION = newestBy('public')?.version ?? releases[0].version;

/** Newest pre-release, or null when nothing is in testing. */
export const TEST_VERSION = newestBy('testing')?.version ?? null;

export const SITE_URL = 'https://pdrkalk.ch';

/** Installers are GitHub release assets: tag v{version} (Windows), android-v{version} (APK). */
const RELEASES = 'https://github.com/OzButcher78/pdrkalk/releases/download';

export const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ||
  `${RELEASES}/v${APP_VERSION}/PDR-Kalk-Setup-${APP_VERSION}.exe`;

export const ANDROID_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL ||
  `${RELEASES}/android-v${APP_VERSION}/pdrkalk-android-${APP_VERSION}.apk`;

/** The binding order page, relative to the page home (/de/order/, /au/order/). */
export const ORDER_PATH = 'order/';

/** Buy CTA on the price card / AU navbar — falls back to the order page. */
export const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || ORDER_PATH;
/** Buy CTA in the main navbar — falls back to the pricing section. */
export const NAV_BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';
/** Trial CTA — always the on-page download section. */
export const TRIAL_URL = '#download';

export const YOUTUBE_VIDEO_ID = 'YnwMff4CjB4';

/** App UI languages: de fr it en nl pt es (PT/ES shipped in 4.26.40). */
export const APP_LANGUAGE_COUNT = 7;
export const APP_LANGUAGES = ['de', 'fr', 'it', 'en', 'nl', 'pt', 'es'] as const;

export const TRIAL_DAYS = 30;
export const PRICE_CHF = 550;
/** EU companies with a valid VAT ID pay this flat, without VAT — not a conversion. */
export const PRICE_EUR = 580;
export const PRICE_AUD = 590;

/**
 * Swiss VAT for the order total. The order terms in messages/*.json carry the
 * rate as literal text ("8,1 %"), so the two change together.
 */
export const VAT_RATE_CH = 0.081;

/** Invoices are payable within this many days of the invoice date. */
export const PAYMENT_TERM_DAYS = 14;

/**
 * Sent with every order so the email records which terms text was accepted.
 * Bump it whenever `order.terms` changes in any message file.
 */
export const TERMS_VERSION = '2026-10';

/**
 * Cost-comparison horizon. This is an illustration only — the licence itself
 * has no expiry date and nothing falls due after five years.
 */
export const COST_HORIZON_YEARS = 5;

/**
 * Hash and relative CTAs have to be prefixed with the page home so they also
 * work from a subpage (/de/import/ → /de/#download, /de/order/) and from /au/
 * (→ /au/#download, /au/order/). Absolute URLs and root paths pass through.
 */
export const resolveCta = (url: string, home: string) =>
  /^(https?:)?\/|^[a-z]+:/i.test(url) ? url : `${home}${url}`;
