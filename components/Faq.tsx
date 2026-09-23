'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import SectionHead from './SectionHead';
import {faqItems, type FaqItem} from '@/lib/faq';

type Props = {
  /** Restrict to these ids, in registry order (used by the feature pages). */
  filter?: string[];
  id?: string;
};

export default function Faq({filter, id = 'faq'}: Props = {}) {
  const t = useTranslations('faq');
  const items = faqItems(t.raw('items') as FaqItem[], filter);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <section id={id} className="section theme-light" style={{background: 'var(--fog)'}} aria-labelledby={`${id}-title`}>
      <div className="container--text">
        <SectionHead
          id={`${id}-title`}
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <ul className="faq-list">
          {items.map(item => {
            const isOpen = Boolean(open[item.id]);
            return (
              <li key={item.id} className="faq-item">
                <h3 className="faq-h">
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${item.id}`}
                    onClick={() => setOpen(prev => ({...prev, [item.id]: !prev[item.id]}))}
                  >
                    {item.q}
                    <span className="faq-q__icon" aria-hidden />
                  </button>
                </h3>
                <div id={`faq-a-${item.id}`} className={`accordion-body${isOpen ? ' open' : ''}`}>
                  <div>
                    <p className="faq-a">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
