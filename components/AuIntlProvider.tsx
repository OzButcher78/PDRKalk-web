'use client';

import {NextIntlClientProvider} from 'next-intl';
import auMessages from '@/messages/au.json';

// Rendering the provider from a Client Component keeps /au fully static. The
// server (react-server) variant of NextIntlClientProvider resolves config from
// the request (headers()), which would force dynamic rendering and break
// `output: 'export'`. The client variant simply consumes the props we pass.
// The cast mirrors the effectively `any`-typed messages the locale layout
// passes — the AbstractIntlMessages type does not model the arrays/numbers our
// JSON contains.
export default function AuIntlProvider({children}: {children: React.ReactNode}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <NextIntlClientProvider locale="en-AU" messages={auMessages as any}>
      {children}
    </NextIntlClientProvider>
  );
}
