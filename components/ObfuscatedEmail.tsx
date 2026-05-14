'use client';

import {useEffect, useState, type CSSProperties} from 'react';

type Props = {
  user: string;
  domain: string;
  className?: string;
  style?: CSSProperties;
};

export default function ObfuscatedEmail({user, domain, className, style}: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
  }, []);

  if (!revealed) {
    return (
      <span className={className} style={style}>
        {user} [at] {domain.replace('.', ' [dot] ')}
      </span>
    );
  }

  const address = `${user}@${domain}`;
  return (
    <a href={`mailto:${address}`} className={className} style={style}>
      {address}
    </a>
  );
}
