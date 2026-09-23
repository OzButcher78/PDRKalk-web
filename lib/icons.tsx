import type {ReactElement} from 'react';

const S = {width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true} as const;

/**
 * Keyed by the `icon` field on each group in messages/*.json — /au ships a
 * different set of groups than the other locales, so a positional array would
 * hand the wrong icon to half the grid.
 */
export const groupIcons: Record<string, ReactElement> = {
  search: <svg {...S}>
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  hailparts: <svg {...S}>
    <path d="M15.5 3.5a5 5 0 00-6 6.5L4 15.5a2.1 2.1 0 003 3l5.5-5.5a5 5 0 006.5-6l-3 3-2.5-2.5 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  invoice: <svg {...S}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7h8M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  analytics: <svg {...S}>
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="5" y="12" width="3" height="7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="10.5" y="8" width="3" height="11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="16" y="4" width="3" height="15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  package: <svg {...S}>
    <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  users: <svg {...S}>
    <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="17" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M15 20c0-2 1.5-3.5 4-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  camera: <svg {...S}>
    <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6l1-3h6l1 3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  devices: <svg {...S}>
    <rect x="2" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="17" y="9" width="5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  backup: <svg {...S}>
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12v4M10 14l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  globe: <svg {...S}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 12h18M12 3c-3 2.5-4.5 5.5-4.5 9s1.5 6.5 4.5 9c3-2.5 4.5-5.5 4.5-9s-1.5-6.5-4.5-9z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  timeline: <svg {...S}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v5l3.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  help: <svg {...S}>
    <path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  mail: <svg {...S}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2.5 7l9.5 6 9.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  shield: <svg {...S}>
    <path d="M12 2.5L4.5 6v6c0 4.6 3.2 8.7 7.5 9.5 4.3-.8 7.5-4.9 7.5-9.5V6L12 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 12l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  lock: <svg {...S}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="15" r="1.4" fill="currentColor"/>
  </svg>,
  doc: <svg {...S}>
    <path d="M6 2.5h7l5 5v14H6v-19z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13 2.5v5h5M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  bolt: <svg {...S}>
    <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
  clock: <svg {...S}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v5l3.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  wallet: <svg {...S}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16.5" cy="14.5" r="1.3" fill="currentColor"/>
  </svg>,
  wifiOff: <svg {...S}>
    <path d="M2.5 8.5C5.2 6.3 8.5 5 12 5c3.5 0 6.8 1.3 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 12c1.7-1.4 3.8-2.2 6-2.2s4.3.8 6 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17.5" r="1.5" fill="currentColor"/>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
};

/** Small inline check used in hero chips and dense lists. */
export const CheckIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12.5l5.5 5.5L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronRight = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** 14-panel top view of a car — the signature PDR decoration. */
export const CarTopView = (
  <svg viewBox="0 0 220 420" fill="none" aria-hidden="true" style={{width: '100%', height: 'auto'}}>
    <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      {/* body outline */}
      <path d="M110 8c-34 0-56 22-62 52l-8 44c-4 22-6 48-6 82s2 60 6 82l8 44c6 30 28 52 62 52s56-22 62-52l8-44c4-22 6-48 6-82s-2-60-6-82l-8-44C166 30 144 8 110 8z"/>
      {/* bonnet / roof / boot */}
      <path d="M48 96h124M48 150h124M48 272h124M48 326h124"/>
      {/* windscreen + rear screen */}
      <path d="M62 150l12-40h72l12 40M62 272l12 40h72l12-40"/>
      {/* centre line */}
      <path d="M110 150v122"/>
      {/* doors */}
      <path d="M40 190h140M40 232h140"/>
    </g>
  </svg>
);
