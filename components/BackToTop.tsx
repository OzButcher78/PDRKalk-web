'use client';

import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';

export default function BackToTop() {
  const t = useTranslations('nav');
  // Starts false so server and first client render match (no hydration mismatch).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reveal once the user has scrolled roughly one screen down.
    const threshold = () => Math.max(600, window.innerHeight * 0.8);
    const onScroll = () => setVisible(window.scrollY > threshold());
    onScroll(); // sync immediately (handles reloads mid-page)
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'});
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('backToTop')}
      className={`back-to-top${visible ? ' visible' : ''}`}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 40,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--ink)',
        border: '1px solid rgba(232,0,29,0.45)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(10,15,30,0.45)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 15l6-6 6 6"
          stroke="var(--red)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
