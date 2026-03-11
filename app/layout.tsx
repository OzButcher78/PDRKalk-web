import type {Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
  width: 'device-width',
  initialScale: 1,
};

// Minimal root layout — html/body rendered in [locale]/layout.tsx for lang attribute
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
