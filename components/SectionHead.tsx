import type {ReactNode} from 'react';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  /** Used as the section's aria-labelledby target. */
  id: string;
  lead?: ReactNode;
  center?: boolean;
  headingLevel?: 1 | 2;
  children?: ReactNode;
};

export default function SectionHead({
  eyebrow,
  title,
  id,
  lead,
  center = false,
  headingLevel = 2,
  children,
}: Props) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className={`section-head${center ? ' section-head--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading id={id} className={headingLevel === 1 ? 't-h1' : 't-h2'}>{title}</Heading>
      <div className="gradient-line" aria-hidden />
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  );
}
