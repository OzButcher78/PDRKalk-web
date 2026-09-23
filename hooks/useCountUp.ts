'use client';

import {useEffect, useRef, useState} from 'react';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Swiss thousands separator (U+2019), one decimal while counting.
 * German, French and Italian write the decimal with a comma; English with a
 * point — the caller passes the right one for the page's locale.
 */
export function formatCount(n: number, decimalSeparator = ','): string {
  const fixed = n % 1 === 0 ? String(Math.round(n)) : n.toFixed(1);
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  return frac ? `${grouped}${decimalSeparator}${frac}` : grouped;
}

/**
 * Counts each target up once the element scrolls into view. Under
 * prefers-reduced-motion the final values are shown immediately.
 * Extracted from the retired TimeSavings component.
 */
export function useCountUp(targets: number[], duration = 1800, stagger = 140) {
  const ref = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<number[]>(() => targets.map(() => 0));
  const started = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) setValues(targets);
    // targets is a stable list derived from messages; re-running on identity
    // changes would restart the animation on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.join(',')]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced.current) return;
    // The frame id lives outside the observer callback: a cleanup returned from
    // there would be discarded, leaving the loop running after unmount.
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const elapsed = now - t0;
          setValues(targets.map((target, i) => {
            const e = elapsed - i * stagger;
            if (e <= 0) return 0;
            return easeOutExpo(Math.min(e / duration, 1)) * target;
          }));
          if (elapsed < duration + stagger * targets.length) frame = requestAnimationFrame(tick);
          else setValues(targets);
        };
        frame = requestAnimationFrame(tick);
      },
      {threshold: 0.3},
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.join(','), duration, stagger]);

  return {ref, values};
}
