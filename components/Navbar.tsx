'use client';

import {useTranslations, useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';
import {useState, useEffect, useRef} from 'react';
import {routing} from '@/i18n/routing';
import {NAV_BUY_URL, TRIAL_URL} from '@/lib/site';
import {pageBySlug} from '@/data/pages';

const SPY_IDS = ['features', 'workflow', 'whats-new', 'pricing', 'faq', 'contact'];

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const langRef = useRef<HTMLDivElement>(null);
  const langToggleRef = useRef<HTMLButtonElement>(null);

  const allLocales = routing.locales.map(code => ({code, label: code.toUpperCase()}));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the nav link for whichever section is in view.
  useEffect(() => {
    const sections = SPY_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveId(top.target.id);
      },
      {rootMargin: '-80px 0px -55% 0px', threshold: 0},
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close lang dropdown on outside click; Escape closes both overlays.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langOpen && langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Closing the popup unmounts whatever had focus — hand it back to the
      // toggle instead of dropping the user at the top of the document.
      if (langOpen) langToggleRef.current?.focus();
      setLangOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  /**
   * Keep the visitor on the same page when switching language. Feature pages
   * have per-locale slugs, so the second segment is translated through the
   * registry; static segments (privacy, updates) stay as they are.
   */
  const switchToLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    const slug = segments[2];
    if (slug) {
      const page = pageBySlug(locale, slug);
      if (page) segments[2] = page.slugs[next] ?? slug;
    }
    router.push(segments.join('/') || `/${next}`);
    setLangOpen(false);
  };

  const home = `/${locale}/`;
  const navLinks = [
    {href: `${home}#features`,   label: t('features')},
    {href: `${home}#workflow`,   label: t('workflow')},
    {href: `${home}#whats-new`,  label: t('whatsNew')},
    {href: `${home}#pricing`,    label: t('pricing')},
    {href: `${home}#faq`,        label: t('faq')},
    {href: `${home}#contact`,    label: t('contact')},
  ];
  const linkId = (href: string) => href.split('#')[1] ?? '';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(10,15,30,0.97)' : 'rgba(10,15,30,1)',
        borderBottom: scrolled ? '1px solid rgba(232,0,29,0.25)' : '1px solid transparent',
        backdropFilter: 'blur(12px)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <a href={home} className="nav-logo" style={{display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0}}>
          <picture>
            <source type="image/webp" srcSet="/logo-320.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-320.png" alt="PDR Kalk" width={320} height={86} style={{height: '44px', width: 'auto', display: 'block'}} />
          </picture>
        </a>

        <ul className="hidden-mobile" style={{display: 'flex', gap: '0.15rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center'}}>
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link${linkId(link.href) === activeId ? ' nav-link-active' : ''}`}
                aria-current={linkId(link.href) === activeId ? 'location' : undefined}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--steel)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.6rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0}}>
          <div ref={langRef} style={{position: 'relative'}}>
            <button
              ref={langToggleRef}
              onClick={() => setLangOpen(!langOpen)}
              className="nav-link"
              aria-expanded={langOpen}
              aria-haspopup="true"
              aria-controls="lang-menu"
              aria-label={t('language')}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                color: 'var(--steel)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '4px',
                padding: '0.4rem 0.65rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              {locale.toUpperCase()}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" style={{transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none'}}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {langOpen && (
              <div id="lang-menu" role="group" aria-label={t('language')} style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: 'rgba(10,15,30,0.97)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '6px',
                overflow: 'hidden',
                minWidth: '52px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(12px)',
                zIndex: 60,
              }}>
                {allLocales.map(({code, label}) => (
                  <button
                    key={code}
                    onClick={() => switchToLocale(code)}
                    style={{
                      display: 'block',
                      width: '100%',
                      fontFamily: 'var(--font-display)',
                      fontWeight: code === locale ? 800 : 600,
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      color: code === locale ? '#fff' : 'var(--steel)',
                      background: code === locale ? 'rgba(232,0,29,0.15)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      padding: '0.6rem 1rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                    aria-current={code === locale ? 'true' : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href={`${home}${TRIAL_URL}`} className="btn btn-ghost btn--sm hidden-mobile" style={{whiteSpace: 'nowrap'}}>
            {t('try')}
          </a>

          <a href={NAV_BUY_URL.startsWith('#') ? `${home}${NAV_BUY_URL}` : NAV_BUY_URL} className="btn btn-red btn--sm hidden-mobile" style={{whiteSpace: 'nowrap'}}>
            {t('cta')}
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            aria-label={t('menu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#fff',
                borderRadius: '1px',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" style={{background: 'var(--ink)', borderTop: '1px solid rgba(232,0,29,0.2)', padding: '0.4rem 1.25rem 1rem'}}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={linkId(link.href) === activeId ? 'nav-link-active' : undefined}
              aria-current={linkId(link.href) === activeId ? 'location' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                minHeight: '44px',
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{display: 'grid', gap: '0.6rem', marginTop: '0.9rem'}}>
            <a href={`${home}${TRIAL_URL}`} onClick={() => setMenuOpen(false)} className="btn btn-ghost">
              {t('try')}
            </a>
            <a
              href={NAV_BUY_URL.startsWith('#') ? `${home}${NAV_BUY_URL}` : NAV_BUY_URL}
              onClick={() => setMenuOpen(false)}
              className="btn btn-red"
            >
              {t('cta')} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
