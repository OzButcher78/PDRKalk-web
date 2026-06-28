'use client';

import type {CSSProperties} from 'react';
import {useTranslations} from 'next-intl';

type Props = {
  className?: string;
  label?: string;
};

const BADGE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  borderRadius: '3px',
  padding: '0.3rem 0.8rem',
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 700,
  fontSize: '0.78rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  background: 'rgba(37,99,235,0.14)',
  border: '1px solid rgba(37,99,235,0.45)',
  color: '#93c5fd',
};

/**
 * Small reusable "Optional AI" pill — blue accent, animated 4-point sparkle.
 * Prop-light so it can later drop into the Hero trust area; reads its own
 * label from the optionalAi namespace unless an explicit `label` is passed.
 */
export default function OptionalAiBadge({className, label}: Props) {
  const t = useTranslations('optionalAi');

  return (
    <span className={`ai-badge${className ? ` ${className}` : ''}`} style={BADGE_STYLE}>
      <svg
        className="ai-sparkle"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l1.7 8.3L22 12l-8.3 1.7L12 22l-1.7-8.3L2 12l8.3-1.7L12 2z" />
      </svg>
      {label ?? t('badge')}
    </span>
  );
}
