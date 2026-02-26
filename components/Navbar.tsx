'use client';

import {useTranslations, useLocale} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';
import {useState, useEffect} from 'react';
import Image from 'next/image';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '#';
const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#pricing';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === 'de' ? 'en' : 'de';
    // Replace locale prefix in pathname
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  };

  const navLinks = [
    {href: '#features', label: t('features')},
    {href: '#screenshots', label: t('screenshots')},
    {href: '#pricing', label: t('pricing')},
    {href: '#access', label: t('howItWorks')},
    {href: '#contact', label: t('contact')},
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled
          ? 'rgba(10,15,30,0.97)'
          : 'rgba(10,15,30,1)',
        borderBottom: scrolled ? '1px solid rgba(232,0,29,0.25)' : '1px solid transparent',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s ease',
      }}
    >
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Logo */}
        <a
          href="#"
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
            width={70}
            height={47}
            style={{objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))'}}
            priority
          />
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#fff',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}>
              PDR KALK
            </div>
            <div style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.62rem',
              color: 'var(--steel)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              v3.18.0
            </div>
          </div>
        </a>

        {/* Desktop nav links */}
        <ul style={{
          display: 'flex',
          gap: '0.25rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          alignItems: 'center',
        }}
          className="hidden-mobile"
        >
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--steel)',
                  textDecoration: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--steel)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0}}>
          {/* Lang switcher */}
          <button
            onClick={switchLocale}
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              color: 'var(--steel)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '4px',
              padding: '0.35rem 0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--steel)';
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
            }}
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>

          {/* CTA */}
          <a
            href={BUY_URL}
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
              transition: 'background 0.2s, transform 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--red-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--red)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('cta')}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            className="show-mobile"
            aria-label="Menu"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#fff',
                borderRadius: '1px',
                transition: 'all 0.3s',
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
          padding: '1rem 1.5rem',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
