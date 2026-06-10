'use client';

import {useTranslations, useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';
import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {routing} from '@/i18n/routing';

const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';

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

  const allLocales = routing.locales.map(code => ({code, label: code.toUpperCase()}));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the nav link for whichever section is in view.
  useEffect(() => {
    const ids = ['features', 'screenshots', 'pricing', 'more', 'testimonials', 'contact'];
    const sections = ids
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

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [langOpen]);

  const switchToLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
    setLangOpen(false);
  };

  const home = `/${locale}/`;
  const navLinks = [
    {href: `${home}#features`,     label: t('features')},
    {href: `${home}#screenshots`,  label: t('screenshots')},
    {href: `${home}#pricing`,      label: t('pricing')},
    {href: `${home}#more`,         label: t('more')},
    {href: `${home}#testimonials`, label: t('testimonials')},
    {href: `${home}#contact`,      label: t('contact')},
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
        {/* Logo */}
        <a
          href={home}
          className="nav-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="PDR Kalk Logo"
            width={200}
            height={54}
            style={{objectFit: 'contain'}}
            priority
          />
        </a>

        {/* Desktop nav links */}
        <ul
          className="hidden-mobile"
          style={{
            display: 'flex',
            gap: '0.25rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
        >
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link${linkId(link.href) === activeId ? ' nav-link-active' : ''}`}
                aria-current={linkId(link.href) === activeId ? 'true' : undefined}
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--steel)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0}}>
          {/* Lang switcher dropdown */}
          <div ref={langRef} style={{position: 'relative'}}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="nav-link"
              aria-expanded={langOpen}
              aria-label="Language"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
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
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" style={{
                transition: 'transform 0.2s',
                transform: langOpen ? 'rotate(180deg)' : 'none',
              }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {langOpen && (
              <div style={{
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
                      fontFamily: 'Barlow Condensed, sans-serif',
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
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (code !== locale) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (code !== locale) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--steel)';
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <a
            href={BUY_URL}
            className="btn-red hidden-mobile"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'var(--red)',
              border: 'none',
              borderRadius: '5px',
              padding: '0.5rem 1.1rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {t('cta')}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            aria-label="Menu"
            aria-expanded={menuOpen}
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
              }}/>
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--ink)',
          borderTop: '1px solid rgba(232,0,29,0.2)',
          padding: '0.4rem 1.25rem 0.85rem',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={linkId(link.href) === activeId ? 'nav-link-active' : undefined}
              aria-current={linkId(link.href) === activeId ? 'true' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.55rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                minHeight: '40px',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={BUY_URL}
            onClick={() => setMenuOpen(false)}
            className="btn-red"
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'var(--red)',
              textDecoration: 'none',
              padding: '0.65rem 1rem',
              borderRadius: '5px',
              marginTop: '0.75rem',
              transition: 'background 0.2s',
            }}
          >
            {t('cta')} →
          </a>
        </div>
      )}
    </header>
  );
}
