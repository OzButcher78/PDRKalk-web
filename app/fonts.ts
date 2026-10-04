import {Barlow, Barlow_Condensed} from 'next/font/google';

// Self-hosted at build time (next/font copies the files into
// out/_next/static/media), so there is no render-blocking Google Fonts request
// and no third-party connection at runtime — which the privacy copy promises.
//
// Never write a literal "Barlow" font-family anywhere else: components use
// var(--font-display) / var(--font-body), declared in app/globals.css.

export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-barlow-condensed',
});

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-barlow',
});

/** Applied on <html> in every layout. */
export const fontClass = `${barlowCondensed.variable} ${barlow.variable}`;
