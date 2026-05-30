'use client';

import {useTranslations} from 'next-intl';
import {
  useState,
  useCallback,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';

type TestimonialItem = {
  quote: string;
  name: string;
  company: string;
  location: string;
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as TestimonialItem[];
  const count = items.length;

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );
  const prev = useCallback(() => setIndex(i => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex(i => (i + 1) % count), [count]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="testimonials"
      style={{
        background: 'var(--ink-mid)',
        padding: '5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid texture — sets this section apart from the
          var(--ink) Download / FinalCTA sections on either side. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
      {/* Subtle red glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 65% at 50% 45%, rgba(232,0,29,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '840px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2.75rem'}}>
          <h2
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              margin: '0 0 0.75rem',
            }}
          >
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto 1rem'}} />
          <p
            style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '1.05rem',
              color: 'var(--steel)',
              margin: 0,
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Carousel */}
        <div
          className="t-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label={t('title')}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{outline: 'none'}}
        >
          {/* Viewport — all slides stacked in one grid cell so the height is
              stable (tallest slide) and every quote stays in the server HTML
              for crawlers. Inactive slides fade out and are aria-hidden. */}
          <div aria-live="polite" style={{position: 'relative'}}>
            {items.map((item, i) => {
              const active = i === index;
              return (
                <figure
                  key={i}
                  className="t-slide"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}`}
                  aria-hidden={!active}
                  style={{
                    // The active slide stays in flow and sets the height;
                    // inactive slides are absolutely positioned so they stay
                    // in the DOM (crawlable) without inflating the height.
                    position: active ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    opacity: active ? 1 : 0,
                    pointerEvents: active ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease',
                  }}
                >
                  {/* 5-star rating */}
                  <div
                    role="img"
                    aria-label={t('rating', {r: 5})}
                    style={{
                      color: '#fbbf24',
                      fontSize: '1.15rem',
                      letterSpacing: '0.15em',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span aria-hidden="true">★★★★★</span>
                  </div>

                  {/* Quote */}
                  <blockquote
                    style={{
                      margin: 0,
                      maxWidth: '720px',
                      fontFamily: 'Barlow, sans-serif',
                      fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                      lineHeight: 1.7,
                      color: '#e6edf7',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        color: 'var(--red)',
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.5em',
                        lineHeight: 0,
                        verticalAlign: '-0.35em',
                        marginRight: '0.08em',
                      }}
                    >
                      &ldquo;
                    </span>
                    {item.quote}
                    <span
                      aria-hidden="true"
                      style={{
                        color: 'var(--red)',
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.5em',
                        lineHeight: 0,
                        verticalAlign: '-0.35em',
                        marginLeft: '0.06em',
                      }}
                    >
                      &rdquo;
                    </span>
                  </blockquote>

                  <div
                    className="gradient-line"
                    style={{width: '40px', margin: '1.75rem auto'}}
                  />

                  {/* Attribution */}
                  <figcaption
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--red), var(--blue))',
                        color: '#ffffff',
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {initials(item.name)}
                    </span>
                    <span style={{textAlign: 'left'}}>
                      <cite
                        style={{
                          display: 'block',
                          fontStyle: 'normal',
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#ffffff',
                        }}
                      >
                        {item.name}
                      </cite>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'Barlow, sans-serif',
                          fontSize: '0.85rem',
                          color: 'var(--steel)',
                        }}
                      >
                        {item.company}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'Barlow, sans-serif',
                          fontSize: '0.8rem',
                          color: 'var(--steel)',
                        }}
                      >
                        {item.location}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* Controls */}
          {count > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '2.25rem',
              }}
            >
              <button
                type="button"
                onClick={prev}
                aria-label={t('prev')}
                className="t-arrow"
              >
                <span aria-hidden="true">‹</span>
              </button>

              <div role="tablist" style={{display: 'flex', gap: '0.5rem'}}>
                {items.map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={t('goTo', {n: i + 1})}
                    aria-current={i === index ? 'true' : undefined}
                    className="t-dot"
                    style={{
                      width: i === index ? '26px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      background: i === index ? 'var(--red)' : 'rgba(255,255,255,0.25)',
                      transition: 'background 0.3s ease, width 0.3s ease',
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label={t('next')}
                className="t-arrow"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .t-carousel:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 10px;
          border-radius: 10px;
        }
        .t-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.16);
          color: #ffffff;
          font-family: Barlow, sans-serif;
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        @media (hover: hover) {
          .t-arrow:hover {
            background: var(--red);
            border-color: var(--red);
            transform: translateY(-2px);
          }
          .t-dot:hover {
            background: rgba(255,255,255,0.5);
          }
        }
        @media (max-width: 480px) {
          .t-slide blockquote { font-size: 1rem !important; line-height: 1.65 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-slide { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
