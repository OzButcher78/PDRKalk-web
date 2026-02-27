import type {Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
};

// Minimal root layout — locale-specific setup is in app/[locale]/layout.tsx
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
