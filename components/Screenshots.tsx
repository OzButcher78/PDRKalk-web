'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {useState} from 'react';

type ImgEntry = {file: string; caption: string};

export default function Screenshots() {
  const t = useTranslations('screenshots');
  const images = t.raw('images') as ImgEntry[];
  const [lightbox, setLightbox] = useState<ImgEntry | null>(null);

  return (
    <section id="screenshots" style={{
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

        {/* Screenshot grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
          className="screenshots-grid"
        >
          {images.map((img, i) => (
            <div
              key={img.file}
              className={`fade-up-${Math.min(i + 1, 6)}`}
              style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}
            >
              <button
                onClick={() => setLightbox(img)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                }}
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
                    style={{objectFit: 'cover', transition: 'transform 0.35s ease'}}
                    className={`screenshot-img-${i}`}
                  />
                  {/* Hover overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(37,99,235,0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.25s',
                    }}
                    className={`screenshot-overlay-${i}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="white"
                      style={{opacity: 0, transition: 'opacity 0.25s', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}>
                      <circle cx="14" cy="14" r="13" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                      <path d="M11 9l8 5-8 5V9z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Caption below the image */}
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

              <style>{`
                button:hover .screenshot-img-${i} { transform: scale(1.04); }
                button:hover .screenshot-overlay-${i} { background: rgba(37,99,235,0.18) !important; }
                button:hover .screenshot-overlay-${i} svg { opacity: 1 !important; }
              `}</style>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.2rem',
            }}
          >
            ✕
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '92vw',
            }}
          >
            {/* Image — no caption overlay */}
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
                  maxHeight: '76vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Caption below the image */}
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              background: 'rgba(10,15,30,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '0.4rem 1.25rem',
            }}>
              {lightbox.caption}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .screenshots-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .screenshots-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
