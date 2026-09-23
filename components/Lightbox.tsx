'use client';

import {useTranslations} from 'next-intl';
import Shot from './Shot';
import type {LightboxImage} from '@/hooks/useLightbox';

type Props = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** Folder prefix for /au captures, e.g. "au/". */
  prefix?: string;
};

export default function Lightbox({images, index, onClose, onPrev, onNext, prefix = ''}: Props) {
  const t = useTranslations('screenshots');
  const image = images[index];
  if (!image) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.caption}
    >
      <button onClick={onClose} aria-label={t('close')} className="lb-btn lb-close">✕</button>

      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); onPrev(); }}
            aria-label={t('prev')}
            className="lb-btn lb-nav lb-prev"
          >‹</button>
          <button
            onClick={e => { e.stopPropagation(); onNext(); }}
            aria-label={t('next')}
            className="lb-btn lb-nav lb-next"
          >›</button>
        </>
      )}

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '96vw',
          padding: '0 0.5rem',
        }}
      >
        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          lineHeight: 0,
        }}>
          <Shot
            file={`${prefix}${image.file}`}
            alt=""
            priority
            sizes="92vw"
            fit="contain"
            style={{maxWidth: '92vw', maxHeight: '84vh', width: 'auto', height: 'auto'}}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontFamily: 'var(--font-display)',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
            background: 'rgba(10,15,30,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            padding: '0.4rem 1.1rem',
          }}>
            {image.caption}
          </span>
          <span style={{
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            color: 'rgba(148,163,184,0.75)',
            whiteSpace: 'nowrap',
          }}>
            {index + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
