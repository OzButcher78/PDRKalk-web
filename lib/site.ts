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

export const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ||
  `https://updates.pdrkalk.ch/PDR-Kalk-Setup-${APP_VERSION}.exe`;

export const ANDROID_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL ||
  `https://updates.pdrkalk.ch/pdrkalk-android-${APP_VERSION}.apk`;

/** Buy CTA on the price card / AU navbar — falls back to the contact form. */
export const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#contact';
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
export const PRICE_EUR_APPROX = 580;
export const PRICE_AUD = 590;

/**
 * Cost-comparison horizon. This is an illustration only — the licence itself
 * has no expiry date and nothing falls due after five years.
 */
export const COST_HORIZON_YEARS = 5;

/**
 * Hash CTAs have to be prefixed with the page home so they also work from a
 * subpage (/de/import/ → /de/#contact) and from /au/ (→ /au/#contact).
 */
export const resolveCta = (url: string, home: string) =>
  url.startsWith('#') ? `${home}${url}` : url;
