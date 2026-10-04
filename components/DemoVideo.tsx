'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useRef, useState} from 'react';

/**
 * Lite-YouTube facade: a self-hosted poster plus a play button. The iframe —
 * and any connection to youtube-nocookie.com — only appears once the visitor
 * clicks, so a visit that never plays the video contacts no third party.
 */
export default function DemoVideo({videoId}: {videoId: string}) {
  const t = useTranslations('demo');
  const hero = useTranslations('hero');
  const [playing, setPlaying] = useState(false);
  const [warmed, setWarmed] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Clicking play unmounts the button; without this, focus lands on <body>.
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  // Only touch YouTube's DNS once the visitor shows intent.
  const warm = () => {
    if (warmed) return;
    setWarmed(true);
    for (const href of ['https://www.youtube-nocookie.com', 'https://i.ytimg.com']) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      document.head.appendChild(link);
    }
  };

  return (
    <div className="shot-frame yt">
      {playing ? (
        <iframe
          ref={frameRef}
          tabIndex={-1}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={hero('videoTitle')}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <picture>
            <source type="image/webp" srcSet="/video-poster-1280.webp" />
            <img
              src="/video-poster-1280.jpg"
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </picture>
          <button
            type="button"
            className="yt-play"
            aria-label={t('play')}
            onMouseEnter={warm}
            onFocus={warm}
            onClick={() => { warm(); setPlaying(true); }}
          >
            <span className="yt-play__disc" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
