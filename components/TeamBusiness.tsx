'use client';

import {useTranslations} from 'next-intl';
import SectionHead from './SectionHead';
import MediaBlock from './MediaBlock';
import Lightbox from './Lightbox';
import {useLightbox, type LightboxImage} from '@/hooks/useLightbox';
import {pageHref} from '@/data/pages';

type Block = {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  file: string;
  alt: string;
  file2?: string;
  alt2?: string;
  linkLabel?: string;
};

export default function TeamBusiness({locale}: {locale?: string} = {}) {
  const t = useTranslations('team');
  const shots = useTranslations('screenshots');
  const blocks = t.raw('blocks') as Block[];
  const images: LightboxImage[] = blocks.map(b => ({file: b.file, caption: b.alt}));
  const lb = useLightbox(images);

  return (
    <section id="team" className="section theme-light" style={{background: '#fff'}} aria-labelledby="team-title">
      <div className="container">
        <SectionHead
          id="team-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
          center
        />

        {blocks.map((block, i) => (
          <MediaBlock
            key={i}
            eyebrow={block.eyebrow}
            title={block.title}
            desc={block.desc}
            points={block.points}
            file={block.file}
            alt={block.alt}
            file2={block.file2}
            alt2={block.alt2}
            flip={i % 2 === 1}
            onOpen={() => lb.open(i)}
            enlargeLabel={shots('enlarge', {caption: block.alt})}
            href={block.linkLabel && locale ? pageHref('subcontractors', locale) : undefined}
            linkLabel={block.linkLabel}
          />
        ))}
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
