'use client';

import Shot from './Shot';

type Props = {
  eyebrow?: string;
  title: string;
  desc?: string;
  points?: string[];
  file: string;
  alt: string;
  file2?: string;
  alt2?: string;
  flip?: boolean;
  href?: string;
  linkLabel?: string;
  /** When given, the shot becomes a button that opens the shared lightbox. */
  onOpen?: () => void;
  /** Accessible name for that button, e.g. "Enlarge <caption>". */
  enlargeLabel?: string;
  headingLevel?: 2 | 3;
  sizes?: string;
};

/**
 * Zig-zag text + screenshot block. Takes plain strings (no namespace) so the
 * same component serves the homepage sections and the feature-page templates.
 */
export default function MediaBlock({
  eyebrow,
  title,
  desc,
  points,
  file,
  alt,
  file2,
  alt2,
  flip = false,
  href,
  linkLabel,
  onOpen,
  enlargeLabel,
  headingLevel = 3,
  sizes = '(min-width: 769px) 48vw, calc(100vw - 3rem)',
}: Props) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const media = (
    <Shot file={file} alt={alt} sizes={sizes} />
  );

  return (
    <div className={`media-block${flip ? ' media-block--flip' : ''}`}>
      <div className="media-block__copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Heading className={headingLevel === 2 ? 't-h2' : 't-h3'} style={{fontSize: headingLevel === 3 ? 'clamp(1.4rem, 2.4vw, 1.9rem)' : undefined}}>
          {title}
        </Heading>
        {desc && <p className="lead" style={{marginTop: '0.85rem', fontSize: '1rem'}}>{desc}</p>}
        {points && points.length > 0 && (
          <ul className="ul-check ul-check--tick" style={{marginTop: '1.1rem'}}>
            {points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {href && linkLabel && (
          <p style={{margin: '1.25rem 0 0'}}>
            <a href={href} className="link-more">{linkLabel} <span aria-hidden>→</span></a>
          </p>
        )}
      </div>

      <div className="media-block__media">
        {onOpen ? (
          <button type="button" className="shot-frame" onClick={onOpen} aria-label={enlargeLabel ?? alt}>
            {media}
          </button>
        ) : (
          <div className="shot-frame">{media}</div>
        )}
        {file2 && alt2 && (
          <div className="media-block__second shot-frame">
            <Shot file={file2} alt={alt2} sizes="22vw" />
          </div>
        )}
      </div>
    </div>
  );
}
