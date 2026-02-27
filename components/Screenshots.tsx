'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {useState, useEffect, useCallback} from 'react';

type ImgEntry = {file: string; caption: string};

export default function Screenshots() {
  const t = useTranslations('screenshots');
  const images = t.raw('images') as ImgEntry[];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const prevImage = useCallback(() => {
    setLightboxIdx(idx => idx === null ? null : (idx - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIdx(idx => idx === null ? null : (idx + 1) % images.length);
  }, [images.length]);

  // Keyboard: Escape to close, arrow keys to navigate
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, closeLightbox, prevImage, nextImage]);

  const lightbox = lightboxIdx !== null ? images[lightboxIdx] : null;

  return (
    <section id="screenshots" className="section-pad" style={{
      background: 'var(--ink-mid)',
      padding: '6rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }}/>

      <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto 1rem'}}/>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '1.05rem',
            color: '#8fa8c8',
          }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Screenshot grid — breakpoints in globals.css */}
        <div
          className="screenshots-grid"
          style={{
            display: 'grid',
            gap: '1rem',
          }}
        >
          {images.map((img, i) => (
            <div
              key={img.file}
              className={`fade-up-${Math.min(i + 1, 6)}`}
              style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}
            >
              <button
                onClick={() => setLightboxIdx(i)}
                className="screenshot-btn"
                aria-label={`${img.caption} vergrössern`}
              >
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <Image
                    src={`/screenshots/${img.file}`}
                    alt={img.caption}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{objectFit: 'cover'}}
                    className="screenshot-img"
                  />
                  {/* Hover overlay */}
                  <div
                    className="screenshot-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(37,99,235,0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="white"
                      className="screenshot-play"
                      style={{filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'}}
                    >
                      <circle cx="20" cy="20" r="19" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                      <path d="M16 13l14 7-14 7V13z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </button>

              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'rgba(148,163,184,0.7)',
                textAlign: 'center',
                padding: '0 0.25rem',
              }}>
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && lightboxIdx !== null && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Schliessen"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.3rem',
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            ✕
          </button>

          {/* Prev button */}
          <button
            onClick={e => { e.stopPropagation(); prevImage(); }}
            aria-label="Vorheriges Bild"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.4rem',
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            ‹
          </button>

          {/* Next button */}
          <button
            onClick={e => { e.stopPropagation(); nextImage(); }}
            aria-label="Nächstes Bild"
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.4rem',
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            ›
          </button>

          {/* Content — stop click propagation so clicking image doesn't close */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '92vw',
              padding: '0 4rem',
            }}
          >
            <div style={{
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Image
                src={`/screenshots/${lightbox.file}`}
                alt={lightbox.caption}
                width={1400}
                height={900}
                style={{
                  maxWidth: '88vw',
                  maxHeight: '72vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Caption + counter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontFamily: 'Barlow Condensed, sans-serif',
              textAlign: 'center',
            }}>
              <span style={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                background: 'rgba(10,15,30,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: '0.4rem 1.25rem',
              }}>
                {lightbox.caption}
              </span>
              <span style={{
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                color: 'rgba(148,163,184,0.7)',
                whiteSpace: 'nowrap',
              }}>
                {lightboxIdx + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
