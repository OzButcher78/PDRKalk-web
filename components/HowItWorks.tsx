'use client';

import {useTranslations} from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const steps = t.raw('steps') as Array<{num: string; title: string; desc: string}>;

  return (
    <section id="access" className="section-pad" style={{
      background: 'var(--ink)',
      padding: '6rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        left: '-200px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,0,29,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2}}>
        <div style={{textAlign: 'center', marginBottom: '3.5rem'}}>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            margin: '0 0 0.75rem',
          }}>
            {t('title')}
          </h2>
          <div className="gradient-line" style={{width: '60px', margin: '0 auto'}}/>
        </div>

        {/* Steps grid — breakpoints handled in globals.css */}
        <div
          className="steps-grid"
          style={{
            display: 'grid',
            gap: '0',
            position: 'relative',
          }}
        >
          {/* Connector line — hidden on mobile via CSS */}
          <div
            className="steps-connector"
            style={{
              position: 'absolute',
              top: '36px',
              left: '16.67%',
              right: '16.67%',
              height: '2px',
              background: 'linear-gradient(90deg, var(--red), var(--blue))',
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`fade-up-${i + 1}`}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 1.5rem',
              }}
            >
              {/* Step number circle */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: i === 0 ? 'var(--red)' : '#1e2d42',
                border: `2px solid ${i === 0 ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: i === 0 ? '0 0 24px rgba(232,0,29,0.4)' : 'none',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  color: '#fff',
                  letterSpacing: '0.02em',
                }}>
                  {step.num}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '0.04em',
                color: '#ffffff',
                margin: '0 0 0.75rem',
                textTransform: 'uppercase',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.92rem',
                color: '#8fa8c8',
                lineHeight: 1.65,
                margin: 0,
                maxWidth: '260px',
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
