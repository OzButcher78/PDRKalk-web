import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    // A missing key would otherwise render as the literal `namespace.key`.
    // Fail the static export instead of shipping that text. ENVIRONMENT_FALLBACK
    // is a next-intl warning about provider placement, not a missing message.
    onError(error) {
      if (error.code === 'ENVIRONMENT_FALLBACK') return;
      throw error;
    },
  };
});
