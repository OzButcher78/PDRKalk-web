import type {CSSProperties} from 'react';
import manifest from '@/lib/screenshot-manifest.json';

type Manifest = Record<string, {w: number; h: number; widths: number[]}>;
const SHOTS = manifest as Manifest;

type Props = {
  /** File name as it appears in messages, e.g. "dashboard.jpg" or "au/dashboard.jpg". */
  file: string;
  alt: string;
  /** Rendered eagerly with fetchpriority=high — use for the LCP image only. */
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** `contain` keeps small sources (portrait PDFs) whole inside the frame. */
  fit?: 'cover' | 'contain';
  objectPosition?: string;
  /** Aspect ratio for the frame; omit to use the image's intrinsic ratio. */
  ratio?: string;
};

/**
 * Screenshot with WebP sources from the committed optimize-images output.
 * Plain <picture>/<img> rather than next/image: the site is a static export
 * with images.unoptimized, so next/image adds no value here and this keeps the
 * srcset honest (widths come from the manifest, never guessed).
 */
export default function Shot({
  file,
  alt,
  priority = false,
  sizes = '100vw',
  className,
  style,
  fit = 'cover',
  objectPosition,
  ratio,
}: Props) {
  const entry = SHOTS[file];
  const widths = entry?.widths ?? [];
  const base = file.replace(/\.jpe?g$/i, '');
  const srcSet = widths.map(w => `/screenshots/_opt/${base}-${w}.webp ${w}w`).join(', ');

  return (
    <picture>
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/screenshots/${file}`}
        alt={alt}
        width={entry?.w || undefined}
        height={entry?.h || undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={className}
        style={{
          display: 'block',
          width: '100%',
          height: ratio ? '100%' : 'auto',
          aspectRatio: ratio,
          objectFit: fit,
          objectPosition,
          ...style,
        }}
      />
    </picture>
  );
}
