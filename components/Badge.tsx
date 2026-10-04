import type {ReactNode} from 'react';

export type BadgeKind = 'new' | 'testing' | 'soon' | 'ai' | 'windows' | 'released' | 'region';

const SPARKLE = (
  <svg className="ai-sparkle" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.7 8.3L22 12l-8.3 1.7L12 22l-1.7-8.3L2 12l8.3-1.7L12 2z" />
  </svg>
);

/**
 * Colour roles: red = new/action, blue = AI / coming soon, green = released,
 * orange = in testing (reserved for future pre-releases), steel = Windows only.
 */
export default function Badge({
  kind = 'new',
  children,
  className,
}: {
  kind?: BadgeKind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`badge badge--${kind}${className ? ` ${className}` : ''}`}>
      {kind === 'ai' && SPARKLE}
      {children}
    </span>
  );
}
