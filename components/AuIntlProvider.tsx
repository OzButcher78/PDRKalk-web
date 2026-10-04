'use client';

import IntlProvider from './IntlProvider';
import auMessages from '@/messages/au.json';

// Rendering the provider from a Client Component keeps /au fully static. The
// server (react-server) variant of NextIntlClientProvider resolves config from
// the request (headers()), which would force dynamic rendering and break
// `output: 'export'`. The client variant simply consumes the props we pass.
export default function AuIntlProvider({children}: {children: React.ReactNode}) {
  return (
    <IntlProvider locale="en-AU" messages={auMessages}>
      {children}
    </IntlProvider>
  );
}
