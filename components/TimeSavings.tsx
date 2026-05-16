'use client';

import {useTranslations} from 'next-intl';
import {useRef, useState, useEffect} from 'react';

type CardData = { value: string; unit: string; period: string };

function formatSwiss(n: number): string {
  if (n < 1000) return n % 1 === 0 ? String(n) : n.toFixed(1);
  const int = Math.floor(n);
  const str = String(int);
  const parts: string[] = [];
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.slice(Math.max(0, i - 3), i));
  }
  return parts.join('\u2019'); // Swiss apostrophe separator
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function TimeSavings() {
  const t = useTranslations('timeSavings');
  const cards = t.raw('cards') as CardData[];
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(cards.map(() => 0));
  const [doneFlags, setDoneFlags] = useState<boolean[]>(cards.map(() => false));
  const hasTriggered = useRef(false);

  // Check reduced motion preference
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion.current) {
      setCounts(cards.map(c => parseFloat(c.value)));
      setDoneFlags(cards.map(() => true));
    }
  }, [cards]);

  // Intersection Observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate counts
  useEffect(() => {
    if (!isVisible || prefersReducedMotion.current) return;

    const targets = cards.map(c => parseFloat(c.value));
    const duration = 2000;
    const staggers = [0, 150, 300, 450];

    const startTime = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const newCounts = targets.map((target, i) => {
        const cardElapsed = elapsed - staggers[i];
        if (cardElapsed <= 0) return 0;
        const progress = Math.min(cardElapsed / duration, 1);
        return easeOutExpo(progress) * target;
      });

      setCounts(newCounts);

      // Check which cards are done
      const newDone = targets.map((target, i) => {
        const cardElapsed = elapsed - staggers[i];
        return cardElapsed >= duration;
      });
      setDoneFlags(prev => {
        const changed = newDone.some((d, i) => d !== prev[i]);
        return changed ? newDone : prev;
      });

      if (elapsed < duration + staggers[staggers.length - 1]) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCounts(targets);
        setDoneFlags(targets.map(() => true));
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, cards]);

  return (
    <section
      ref={sectionRef}
      id="timesavings"
      className="timesavings-section"
      style={{
        background: 'linear-gradient(180deg, var(--ink) 0%, #0d1425 100%)',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2}}>
        {/* Title */}
        <h2 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          color: '#ffffff',
          textAlign: 'center',
          margin: '0 0 3rem',
          letterSpacing: '-0.01em',
        }}>
          {t('title')}{' '}
          <span style={{color: 'var(--red)'}}>{t('titleAccent')}</span>
        </h2>

        {/* 4 counter cards */}
        <div
          className="timesavings-grid"
          style={{display: 'grid', gap: '1.25rem'}}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                textAlign: 'center',
                transition: 'opacity 0.5s ease',
                opacity: isVisible || prefersReducedMotion.current ? 1 : 0,
              }}
            >
              {/* Large number */}
              <div
                className={doneFlags[i] ? 'count-pulse' : undefined}
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatSwiss(counts[i])}
              </div>

              {/* Unit */}
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                color: 'var(--steel)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '0.35rem',
              }}>
                {card.unit}
              </div>

              {/* Period */}
              <div style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.82rem',
                color: 'rgba(148,163,184,0.6)',
                marginTop: '0.25rem',
              }}>
                {card.period}
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
          color: '#8fa8c8',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '2.5rem auto 0',
          lineHeight: 1.6,
        }}>
          {t('tagline')}
        </p>

        {/* Disclaimer */}
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.72rem',
          color: 'rgba(148,163,184,0.4)',
          textAlign: 'center',
          marginTop: '1.5rem',
        }}>
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
