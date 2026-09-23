import {
  APP_LANGUAGE_COUNT,
  APP_VERSION,
  COST_HORIZON_YEARS,
  PRICE_CHF,
  PRICE_EUR_APPROX,
  TRIAL_DAYS,
} from './site';

/**
 * next-intl only expands ICU placeholders for messages read through `t()`.
 * Arrays and objects read with `t.raw()` come back verbatim, so any copy in
 * them that carries a placeholder has to be expanded here. Keep the value set
 * in sync with lib/site.ts — the message checker asserts that every
 * placeholder used in messages appears in this map.
 */
export const SITE_VALUES: Record<string, string | number> = {
  version: APP_VERSION,
  price: PRICE_CHF,
  priceEur: PRICE_EUR_APPROX,
  days: TRIAL_DAYS,
  languages: APP_LANGUAGE_COUNT,
  years: COST_HORIZON_YEARS,
};

export function interpolate(text: string, values: Record<string, string | number> = SITE_VALUES): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
