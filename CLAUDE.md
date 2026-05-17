# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (Next.js 16)
npm run build    # Production build
npm run start    # Start production server
```

No linter or test runner is configured.

## Architecture

This is a single-page marketing website for PDR Kalk, a Swiss PDR cost calculator desktop app. The site is a Next.js 16 App Router project deployed on Cloudflare with full i18n support (German default, English).

### Routing & i18n

- `proxy.ts` — next-intl middleware (note: Next.js 16 renamed `middleware.ts` to `proxy.ts` in this project)
- `i18n/routing.ts` — defines locales `['de', 'en']` with `defaultLocale: 'de'`
- `i18n/request.ts` — server-side locale resolution
- `app/page.tsx` — root fallback that redirects to `/de`
- `app/[locale]/layout.tsx` — validates locale, loads messages, wraps with `NextIntlClientProvider`
- `app/[locale]/page.tsx` — composes all section components in order
- `app/layout.tsx` — minimal root layout (just html/body tags, no providers here)
- `messages/de.json` and `messages/en.json` — all user-facing strings keyed by section

### Components

All components live flat in `components/`. Each corresponds to one page section rendered in order:

`Navbar` → `Hero` → `Features` → `Screenshots` → `HowItWorks` → `Pricing` → `Contact` → `Footer`

Components use `useTranslations('sectionKey')` from next-intl. Client components are marked `'use client'`. The `Screenshots` component includes a lightbox; `Navbar` handles mobile hamburger menu and locale switching.

### Styling

- Tailwind CSS v4 — no `tailwind.config.ts`; theme tokens are declared via `@theme inline` in `app/globals.css`
- Brand CSS variables: `--ink` (#0a0f1e dark bg), `--red` (#e8001d accent), `--steel` (#94a3b8 muted text)
- Font classes: `--font-display` (Barlow Condensed 900 for headings), `--font-body` (Barlow for body)
- Components use inline `style` props for layout-critical styles; Tailwind classes for utilities
- Animation utility classes (`.fade-up`, `.fade-up-1` through `.fade-up-6`, `.gradient-line`, `.lightbox-overlay`) are defined in `globals.css`
- `@/*` path alias maps to the project root

### Environment Variables

Two env vars drive external links; fall back to `#` / `#pricing` if unset:
- `NEXT_PUBLIC_BUY_URL` — payment/purchase link
- `NEXT_PUBLIC_APP_URL` — link to the installable app

### Key Conventions

- Inline styles are used extensively for design precision alongside Tailwind utilities — don't refactor to Tailwind-only
- All copy lives in `messages/de.json` and `messages/en.json`; never hardcode user-facing strings in components
- Mobile responsiveness is handled via scoped `<style>` tags inside components (e.g., `.hidden-mobile` / `.show-mobile` in Navbar)
- `generateStaticParams` in `[locale]/layout.tsx` enables static generation for all locales
