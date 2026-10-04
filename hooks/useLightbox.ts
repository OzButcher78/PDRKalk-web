'use client';

import {useCallback, useEffect, useState} from 'react';

export type LightboxImage = {file: string; caption: string};

/**
 * Lightbox state + keyboard handling, lifted verbatim out of the old
 * Screenshots.tsx (Escape closes, arrows navigate, Tab is trapped inside the
 * overlay, focus returns to the trigger) with a body scroll lock added.
 */
export function useLightbox(images: LightboxImage[]) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex(i => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setIndex(i => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  // Keyboard: Escape to close, arrow keys to navigate
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, prev, next]);

  // Scroll lock + focus restore: tied to open/close, NOT to the current index.
  // Keying these on `index` made every Prev/Next hand focus back to the trigger
  // behind the overlay and then re-focus Close, so Enter closed the lightbox
  // instead of advancing.
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  // Focus the close button once, when the overlay appears.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      (document.querySelector('.lightbox-overlay .lb-close') as HTMLElement | null)?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  // Keep Tab inside the overlay.
  useEffect(() => {
    if (!isOpen) return;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const overlay = document.querySelector('.lightbox-overlay') as HTMLElement | null;
      if (!overlay) return;
      const focusable = overlay.querySelectorAll(focusableSelector);
      if (focusable.length === 0) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', trapFocus);
    return () => window.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  return {index, open, close, prev, next, current: index === null ? null : images[index]};
}
