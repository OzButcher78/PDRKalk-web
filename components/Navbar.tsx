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
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  };

  const navLinks = [
    {href: '#features',    label: t('features')},
    {href: '#screenshots', label: t('screenshots')},
    {href: '#pricing',     label: t('pricing')},
    {href: '#access',      label: t('howItWorks')},
    {href: '#contact',     label: t('contact')},
  ];

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
            src="/PDRKalk-logot2.png"
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
                className="nav-link"
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
          {/* Lang switcher */}
          <button
            onClick={switchLocale}
            className="nav-link"
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
            }}
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>

          {/* CTA */}
          <a
            href={BUY_URL}
            className="btn-red"
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
          padding: '0.75rem 1.5rem 1.25rem',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.85rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                minHeight: '48px',
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
              fontSize: '1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'var(--red)',
              textDecoration: 'none',
              padding: '0.85rem 1rem',
              borderRadius: '5px',
              marginTop: '1rem',
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
