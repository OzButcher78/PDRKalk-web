'use client';

import {useTranslations} from 'next-intl';
import {useRef, useState} from 'react';
import Shot from './Shot';
import SectionHead from './SectionHead';
import Lightbox from './Lightbox';
import {useLightbox, type LightboxImage} from '@/hooks/useLightbox';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {CarTopView} from '@/lib/icons';

type Step = {
  label: string;
  title: string;
  benefit: string;
  points: string[];
  file: string;
  alt: string;
};

export default function Workflow() {
  const t = useTranslations('workflow');
  const shots = useTranslations('screenshots');
  const steps = t.raw('steps') as Step[];
  const gallery = shots.raw('images') as LightboxImage[];

  const [active, setActive] = useState(0);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // Below 768px the CSS hides the stepper and shows every panel, so the tab
  // roles would describe a structure that is no longer on screen. Drop them
  // there and let the panels be plain, headed sections.
  const isStacked = useMediaQuery('(max-width: 768px)');

  // One lightbox for both entry points: a step's screenshot opens the gallery
  // at that image; the button below opens it at the first one.
  const stepIndexInGallery = (file: string) => {
    const i = gallery.findIndex(g => g.file === file);
    return i === -1 ? 0 : i;
  };
  const lb = useLightbox(gallery);

  const onStepKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % steps.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + steps.length) % steps.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = steps.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    btnRefs.current[next]?.focus();
  };

  return (
    <section id="workflow" className="section theme-light" style={{background: '#fff'}} aria-labelledby="workflow-title">
      {/* Legacy anchor: external links still point at #screenshots. */}
      <div className="wf-car" aria-hidden>{CarTopView}</div>

      <div className="container">
        <SectionHead
          id="workflow-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        <ol className="wf-steps" role={isStacked ? undefined : 'tablist'} aria-label={isStacked ? undefined : t('title')}>
          {steps.map((step, i) => (
            <li key={i}>
              <button
                type="button"
                role={isStacked ? undefined : 'tab'}
                id={`wf-tab-${i}`}
                aria-selected={isStacked ? undefined : i === active}
                aria-controls={`wf-panel-${i}`}
                data-done={i < active ? 'true' : 'false'}
                tabIndex={isStacked || i === active ? 0 : -1}
                ref={el => { btnRefs.current[i] = el; }}
                className="wf-step-btn"
                onClick={() => setActive(i)}
                onKeyDown={e => onStepKey(e, i)}
              >
                <span className="wf-num" aria-hidden>{i + 1}</span>
                {step.label}
              </button>
            </li>
          ))}
        </ol>

        <div className="wf-stage">
          {steps.map((step, i) => (
            <div
              key={i}
              id={`wf-panel-${i}`}
              role={isStacked ? undefined : 'tabpanel'}
              aria-labelledby={isStacked ? undefined : `wf-tab-${i}`}
              className="wf-panel"
              data-active={i === active ? 'true' : 'false'}
            >
              <div className="wf-panel__media">
                <button
                  type="button"
                  className="shot-frame"
                  onClick={() => lb.open(stepIndexInGallery(step.file))}
                  aria-label={shots('enlarge', {caption: step.alt})}
                >
                  <Shot
                    file={step.file}
                    alt={step.alt}
                    sizes="(min-width: 1024px) 55vw, calc(100vw - 3rem)"
                    ratio="16 / 10"
                    objectPosition="top center"
                  />
                </button>
              </div>

              <div className="wf-panel__copy">
                <span className="eyebrow">{t('stepLabel', {n: i + 1})}</span>
                <h3 className="t-h3" style={{fontSize: 'clamp(1.35rem, 2.4vw, 1.85rem)'}}>{step.title}</h3>
                <p className="wf-benefit">{step.benefit}</p>
                <ul className="ul-check ul-check--tick">
                  {step.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="wf-all">
          <button
            type="button"
            id="screenshots"
            className="btn btn-ghost-dark"
            onClick={() => lb.open(0)}
          >
            {t('allScreenshots', {n: gallery.length})}
          </button>
        </div>
      </div>

      {lb.index !== null && (
        <Lightbox
          images={gallery}
          index={lb.index}
          onClose={lb.close}
          onPrev={lb.prev}
          onNext={lb.next}
        />
      )}
    </section>
  );
}
