import './globals.css';

// Minimal root layout — locale-specific setup is in app/[locale]/layout.tsx
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
