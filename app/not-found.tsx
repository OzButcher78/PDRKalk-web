import type {Metadata} from 'next';
import {fontClass} from './fonts';

// Cloudflare serves out/404.html for unknown paths (`not_found_handling:
// "404-page"`). The root layout returns bare children so the locale layouts can
// own <html lang>, which means this page has to render its own document shell —
// otherwise the 404 ships without <html> or <body>.

export const metadata: Metadata = {
  title: 'Seite nicht gefunden · Page not found | PDR Kalk',
  robots: {index: false, follow: true},
};

const LOCALES: Array<{href: string; label: string}> = [
  {href: '/de/', label: 'Deutsch'},
  {href: '/en/', label: 'English'},
  {href: '/fr/', label: 'Français'},
  {href: '/it/', label: 'Italiano'},
  {href: '/au/', label: 'Australia'},
];

export default function NotFound() {
  return (
    <html lang="de" className={fontClass}>
      <body style={{background: 'var(--ink)', color: '#fff', margin: 0}}>
        <main style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1.5rem',
          gap: '0.75rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            color: 'var(--red)',
            margin: 0,
            lineHeight: 1,
          }}>
            404
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            margin: '0.5rem 0 0',
          }}>
            Seite nicht gefunden · Page not found
          </h1>
          <p style={{fontFamily: 'var(--font-body)', color: 'var(--steel)', maxWidth: '52ch', margin: '0.5rem 0 1.5rem'}}>
            Diese Seite existiert nicht (mehr). Wählen Sie unten Ihre Sprache.
            <br />
            This page does not exist. Pick your language below.
          </p>
          <nav aria-label="Languages" style={{display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center'}}>
            {LOCALES.map(({href, label}) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '0.6rem 1.15rem',
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
