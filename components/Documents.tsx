'use client';

import {useTranslations} from 'next-intl';
import Shot from './Shot';
import SectionHead from './SectionHead';
import Lightbox from './Lightbox';
import {useLightbox, type LightboxImage} from '@/hooks/useLightbox';

type More = {title: string; items: string[]};

export default function Documents() {
  const t = useTranslations('documents');
  const shots = useTranslations('screenshots');
  const items = t.raw('items') as LightboxImage[];
  const more = t.raw('more') as More;
  const lb = useLightbox(items);

  return (
    <section id="documents" className="section theme-light" style={{background: 'var(--fog)'}} aria-labelledby="documents-title">
      <div className="container">
        <SectionHead
          id="documents-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <ul className="docs-fan">
          {items.map((item, i) => (
            <li key={item.file}>
              <button
                type="button"
                className="doc-page"
                onClick={() => lb.open(i)}
                aria-label={shots('enlarge', {caption: item.caption})}
              >
                <Shot file={item.file} alt={item.caption} sizes="220px" fit="cover" objectPosition="top center" />
              </button>
              <span className="doc-caption">{item.caption}</span>
            </li>
          ))}
        </ul>

        <div style={{textAlign: 'center'}}>
          <h3 className="t-h3">{more.title}</h3>
          <ul className="docs-more-chips">
            {more.items.map(item => <li key={item}>{item}</li>)}
          </ul>
          <p className="micro" style={{marginTop: '1.1rem', color: 'var(--text-light-mute)'}}>{t('note')}</p>
        </div>
      </div>

      {lb.index !== null && (
        <Lightbox
          images={items}
          index={lb.index}
          onClose={lb.close}
          onPrev={lb.prev}
          onNext={lb.next}
        />
      )}
    </section>
  );
}
