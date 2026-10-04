'use client';

import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';
import {BUY_URL, TRIAL_URL, resolveCta} from '@/lib/site';

// AU is a standalone, single-locale landing page: no language switcher and
// in-page anchor links (no `/${locale}/` prefix). This is why it forks Navbar
// instead of reusing it — the shared Navbar's switcher rewrites the first path
// segment, which on `/au/` would send the visitor to `/de/`.

const SPY_IDS = ['features', 'workflow', 'whats-new', 'pricing', 'faq', 'contact'];
const AU_HOME = '/au/';

/** `home` prefixes the anchor links — `/au/` on a subpage, '' on /au/ itself. */
export default function AuNavbar({home = ''}: {home?: string} = {}) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  const navLinks = [
    {href: `${home}#features`,  label: t('features')},
    {href: `${home}#workflow`,  label: t('workflow')},
    {href: `${home}#whats-new`, label: t('whatsNew')},
    {href: `${home}#pricing`,   label: t('pricing')},
    {href: `${home}#faq`,       label: t('faq')},
    {href: `${home}#contact`,   label: t('contact')},
  ];
  const trialHref = resolveCta(TRIAL_URL, home);
  const buyHref = resolveCta(BUY_URL, AU_HOME);
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
        <a href={`${home}#hero`} className="nav-logo" style={{display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0}}>
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
          <a href={trialHref} className="btn btn-ghost btn--sm hidden-mobile" style={{whiteSpace: 'nowrap'}}>
            {t('try')}
          </a>
          <a href={buyHref} className="btn btn-red btn--sm hidden-mobile" style={{whiteSpace: 'nowrap'}}>
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
            <a href={trialHref} onClick={() => setMenuOpen(false)} className="btn btn-ghost">{t('try')}</a>
            <a href={buyHref} onClick={() => setMenuOpen(false)} className="btn btn-red">
              {t('cta')} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
