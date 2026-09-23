'use client';

import {NextIntlClientProvider, type IntlError} from 'next-intl';
import type {ReactNode} from 'react';

// next-intl reports this when a Client Component resolves its messages from the
// request config instead of a provider higher up the tree. It is a warning, not
// a missing translation, and it predates this refactor — do not fail on it.
const IGNORED = new Set(['ENVIRONMENT_FALLBACK']);

/**
 * A missing message renders as the literal `namespace.key` by default, which is
 * easy to ship by accident. During the static export (no `window`) we throw, so
 * the build fails loudly; in the browser we only log, so one bad key never
 * blanks a page for a visitor.
 */
function onError(error: IntlError) {
  if (IGNORED.has(error.code)) return;
  if (typeof window === 'undefined') throw error;
  // eslint-disable-next-line no-console
  console.error(error);
}

type Props = {
  locale: string;
  // The JSON carries arrays and numbers that AbstractIntlMessages does not model.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any;
  children: ReactNode;
};

export default function IntlProvider({locale, messages, children}: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} onError={onError}>
      {children}
    </NextIntlClientProvider>
  );
}
