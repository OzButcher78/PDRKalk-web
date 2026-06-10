'use client';

import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';
import Image from 'next/image';

// AU is a standalone, single-locale landing page: no language switcher and
// in-page anchor links (no `/${locale}/` prefix). This is why it forks Navbar
// instead of reusing it — the shared Navbar's switcher rewrites the first path
// segment, which on `/au/` would send the visitor to `/de/`.
const BUY_URL = process.env.NEXT_PUBLIC_BUY_URL || '#contact';

export default function AuNavbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

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

  const navLinks = [
    {href: '#features',     label: t('features')},
    {href: '#screenshots',  label: t('screenshots')},
    {href: '#pricing',      label: t('pricing')},
    {href: '#more',         label: t('more')},
    {href: '#testimonials', label: t('testimonials')},
    {href: '#contact',      label: t('contact')},
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
          href="#hero"
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
