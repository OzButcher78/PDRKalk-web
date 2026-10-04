'use client';

import {useEffect, useState} from 'react';

/**
 * Starts `false` so the server render and the first client render match, then
 * syncs in an effect. Use it only for behaviour (ARIA roles, event wiring) —
 * visual breakpoints belong in CSS.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
