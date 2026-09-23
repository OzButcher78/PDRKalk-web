'use client';

import {useTranslations} from 'next-intl';
import {useCallback, useEffect, useId, useRef, useState} from 'react';
import SectionHead from './SectionHead';

type Item = {quote: string; name: string; company?: string; location?: string};

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

const Stars = ({label}: {label: string}) => (
  <span className="t-stars" role="img" aria-label={label}>
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
      </svg>
    ))}
  </span>
);

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="testimonials"
      className="section theme-dark"
      style={{background: 'var(--ink-mid)'}}
      aria-labelledby="testimonials-title"
    >
      <div className="container--narrow">
        <SectionHead
          id="testimonials-title"
          eyebrow={t('subtitle')}
          title={t('title')}
          center
        />

        <ul className="t-grid">
          {items.map((item, i) => (
            <li key={i}>
              <Quote item={item} rating={t('rating', {r: 5})} more={t('readMore')} less={t('readLess')} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Quote({item, rating, more, less}: {item: Item; rating: string; more: string; less: string}) {
  const quoteId = useId();
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const el = quoteRef.current;
    if (!el) return;
    // Measure against the clamped height, not the expanded one.
    if (!expanded) setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, [expanded]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <figure className="card-dark t-card" style={{margin: 0}}>
      <div className="t-head">
        <span className="t-avatar" aria-hidden>{initials(item.name)}</span>
        <span>
          <span className="t-name" style={{display: 'block'}}>{item.name}</span>
          <span className="t-meta">
            {[item.company, item.location].filter(Boolean).join(' · ')}
          </span>
        </span>
      </div>

      <Stars label={rating} />

      <blockquote style={{margin: 0}}>
        <p
          id={quoteId}
          ref={quoteRef}
          className={`t-quote${expanded ? '' : ' t-quote--clamped'}`}
        >
          {item.quote}
        </p>
      </blockquote>

      {overflows && (
        <button
          type="button"
          className="t-readmore"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-controls={quoteId}
        >
          {expanded ? less : more}
        </button>
      )}

      <figcaption className="sr-only">{item.name}</figcaption>
    </figure>
  );
}
