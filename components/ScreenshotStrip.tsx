'use client';

import {useTranslations} from 'next-intl';
import Shot from './Shot';
import Lightbox from './Lightbox';
import {useLightbox, type LightboxImage} from '@/hooks/useLightbox';

/**
 * Screenshot row on a feature page. Captions come from `screenshots.images`
 * so the same file is never described twice in two different ways.
 */
export default function ScreenshotStrip({files, title}: {files: string[]; title: string}) {
  const t = useTranslations('screenshots');
  const all = t.raw('images') as LightboxImage[];
  const images: LightboxImage[] = files.map(file => ({
    file,
    caption: all.find(i => i.file === file)?.caption ?? file.replace(/\.[a-z]+$/i, ''),
  }));
  const lb = useLightbox(images);

  return (
    <section className="section theme-light" style={{background: 'var(--fog)'}} aria-labelledby="strip-title">
      <div className="container">
        <h2 id="strip-title" className="t-h2" style={{marginBottom: '1.75rem'}}>{title}</h2>

        <ul className="fg-grid" style={{listStyle: 'none', margin: 0, padding: 0}}>
          {images.map((img, i) => (
            <li key={img.file}>
              <button
                type="button"
                className="shot-frame"
                onClick={() => lb.open(i)}
                aria-label={t('enlarge', {caption: img.caption})}
              >
                <Shot
                  file={img.file}
                  alt={img.caption}
                  sizes="(min-width: 1024px) 32vw, (min-width: 600px) 48vw, calc(100vw - 3rem)"
                  ratio="16 / 10"
                  objectPosition="top center"
                />
              </button>
              <span className="doc-caption">{img.caption}</span>
            </li>
          ))}
        </ul>
      </div>

      {lb.index !== null && (
        <Lightbox
          images={images}
          index={lb.index}
          onClose={lb.close}
          onPrev={lb.prev}
          onNext={lb.next}
        />
      )}
    </section>
  );
}
