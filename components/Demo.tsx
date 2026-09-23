'use client';

import {useTranslations} from 'next-intl';
import SectionHead from './SectionHead';
import DemoVideo from './DemoVideo';
import {YOUTUBE_VIDEO_ID} from '@/lib/site';

export default function Demo() {
  const t = useTranslations('demo');
  const points = t.raw('points') as string[];

  return (
    <section id="demo" className="section theme-light" style={{background: 'var(--fog)'}} aria-labelledby="demo-title">
      <div className="container--narrow demo-grid">
        <div>
          <SectionHead
            id="demo-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
          <ul className="ul-check ul-check--tick" style={{marginTop: '-1rem'}}>
            {points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <DemoVideo videoId={YOUTUBE_VIDEO_ID} />
      </div>
    </section>
  );
}
