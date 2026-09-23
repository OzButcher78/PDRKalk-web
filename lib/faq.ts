import {interpolate} from './interpolate';

export type FaqItem = {id: string; q: string; a: string};

/**
 * Shared by the accordion and the FAQPage JSON-LD so both show the same text.
 * Placeholders are expanded here because the items arrive via `t.raw()`.
 */
export function faqItems(raw: FaqItem[], filter?: string[]): FaqItem[] {
  const expanded = raw.map(item => ({
    id: item.id,
    q: interpolate(item.q),
    a: interpolate(item.a),
  }));
  if (!filter) return expanded;
  return filter
    .map(id => expanded.find(i => i.id === id))
    .filter((i): i is FaqItem => Boolean(i));
}
