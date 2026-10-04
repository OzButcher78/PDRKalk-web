# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
npm run dev      # dev server (Next.js 16, Turbopack)
npm run build    # prebuild checker → next build → postbuild audit
npm run check    # both guard scripts against the current out/
npm run images   # regenerate WebP/OG/logo/icon assets (outputs are committed)
npm run llms     # regenerate public/llms.txt from lib/site.ts + data/
npm run preview  # wrangler dev — serves out/ the way Cloudflare does
npm run deploy   # build + wrangler deploy (the owner runs this, not the agent)
```

There is no linter and no test runner. `npm run build` is the gate: it fails on a
missing/asymmetric message key (prebuild) and on a broken page, link, anchor,
heading or JSON-LD graph (postbuild).

## Architecture

Marketing site for PDR Kalk, a Swiss PDR (paintless dent repair) cost-calculation
desktop app. **Next.js 16 static export** (`output: 'export'`, `trailingSlash: true`,
`images.unoptimized: true`) deployed to **Cloudflare Workers Assets**
(`wrangler.jsonc` → `./out`, `not_found_handling: "404-page"`).

There is no server, no middleware, no API route and no analytics. `public/_redirects`
(`/ → /de/ 301`) is the only thing serving the bare domain — keep it byte-identical
unless the redirect itself is meant to change.

### Routes

| Route | Source |
|---|---|
| `/de/ /en/ /fr/ /it/` | `app/[locale]/page.tsx` |
| `/au/` | `app/au/page.tsx` — standalone, **not** a routing locale |
| `/{locale}/privacy/` | `app/[locale]/privacy/page.tsx` |
| `/{locale}/updates/` | `app/[locale]/updates/page.tsx` (data: `data/releases.ts`) |
| `/{locale}/order/` | `app/[locale]/order/page.tsx` → `components/Order.tsx` |
| `/au/order/` | `app/au/order/page.tsx` — static metadata from `au.json`, `lockedCountry="au"` |
| `/{locale}/{slug}/` | `app/[locale]/[slug]/page.tsx` → `components/FeaturePage.tsx`, slugs from `data/pages.ts` |
| `404` | `app/not-found.tsx` — renders its own `<html>/<body>` |

`app/layout.tsx` returns bare children on purpose: each locale layout owns
`<html lang>`. That is why `not-found.tsx` has to render a full document shell.

### i18n

- `i18n/routing.ts` — locales `['de','en','fr','it']`, default `de`.
- `i18n/request.ts` — server config; `onError` **throws** so a missing key fails the
  build instead of rendering the literal `namespace.key`. `ENVIRONMENT_FALLBACK` is
  a provider-placement warning and is deliberately ignored.
- `components/IntlProvider.tsx` — the same strictness on the client boundary.
- `/au` is a **variant, not a locale**: `messages/au.json` must contain every key the
  components on that page read. `useLocale()` returns `en-AU` there, so any shared
  component that builds a locale link takes an explicit `locale` or `basePath`/`home`
  prop instead of reading the locale itself.

### Source of truth

- `lib/site.ts` — versions, download URLs, CTA targets, prices, `resolveCta()`, and
  the order constants: `ORDER_PATH`, `PAYMENT_TERM_DAYS` (→ `{paymentDays}`),
  `VAT_RATE_CH` (the terms copy carries "8,1 %" literally — change both) and
  `TERMS_VERSION` (sent with every order; bump it whenever `order.terms` changes).
  `PRICE_EUR` is the real EU price, not a conversion — never write "≈".
- `data/releases.ts` — release notes, copied verbatim from the desktop app's
  `src/data/changelog.ts`. `APP_VERSION` = newest entry with `status: 'public'`,
  `TEST_VERSION` = newest `'testing'` or `null`.
- `data/pages.ts` — the feature-page registry (per-locale slugs, FAQ subset,
  screenshot strip, related pages).

**Release bump = one entry.** Add/flip the entry in `data/releases.ts` (copy the
localized arrays too), optionally adjust the hand-written `whatsNew.items` cards in
`messages/*.json`, run `npm run build`, then `npm run llms`, commit "Bump to v…".
The owner deploys with `npx wrangler deploy`.

## Messages

All user-facing copy lives in `messages/{de,en,fr,it,au}.json`. German is canonical.
The only documented exception is `data/releases.ts` (per-release data maintained in
the app repo).

Rules the prebuild checker enforces:

- every key exists in all four locales, with the same ICU placeholders;
- no `.` inside a key segment;
- no literal `4.xx.yy` version string — use `{version}`;
- `download.*.version` and `footer.versionLabel` must contain `{version}`;
- every key the `/au` components read exists in `au.json` (exceptions are listed in
  `AU_OPTIONAL` in the script — add there when a block is genuinely optional).

A new placeholder goes into `SITE_VALUES` (`lib/interpolate.ts`, if site-wide),
`KNOWN_PLACEHOLDERS` (`scripts/check-messages.mjs`) and `PLACEHOLDER_RE`
(`scripts/audit-out.mjs`). `{amount}` and `{email}` are call-site only (order page).

**Placeholders only expand through `t()`.** Anything read with `t.raw()` (arrays,
nested objects) comes back verbatim, so run it through `interpolate()` from
`lib/interpolate.ts`. Optional blocks are guarded with `t.has()`.

## Components

`components/` is flat. Homepage order (`app/[locale]/page.tsx`):

`Navbar` → `Hero` → `TrustBar` → `Demo` → `Workflow` → `WhatsNew` → `FeatureGroups`
→ `Regions` → `Integrations` → `Documents` → `TeamBusiness` → `Security`
→ `Testimonials` → `Pricing` → `Faq` → `Download` → `Contact` → `Footer` → `BackToTop`

`/au` uses the same order minus `Demo`, with `showAi={false}` on `Integrations`,
`showPrivacy={false}` on `Security`/`Footer`, `regions={['au']}` on `Hero`/`Footer`,
`basePath="/au/"`, `home="/au/"` and `lockedCountry="au"` on `Contact`.

Shared building blocks: `Shot` (WebP `<picture>` from the committed manifest),
`Lightbox` + `hooks/useLightbox`, `Badge`, `SectionHead`, `MediaBlock`,
`ScreenshotStrip`, `ComparisonTables`, `hooks/useCountUp`, `lib/icons.tsx`.

### Frozen anchors

These ids must each exist exactly once on every home page (the audit checks it —
ads and external links point at them):

`hero trust timesavings demo workflow screenshots whats-new features more regions
import ai documents team data testimonials pricing comparison faq download contact`

`#pricing`, `#contact` and `#download` are hard-frozen.

### Orders vs enquiries

Licences are ordered on the order page (`components/Order.tsx`): terms
(`order.terms`, German is authoritative), billing form, required consent checkbox,
price by billing country (CH: CHF + 8.1 % VAT; EU: EUR, VAT ID required, reverse
charge; UK: EUR, no Swiss VAT; AU: AUD, GST). It posts to the same Formspree form
with the same `[Licence Order] …` subject and keys as the old buy payload, plus
`price`, `paymentTerm`, `termsAccepted` and `page`. `Contact.tsx` handles
enquiries only: its "order" card shows a hand-off panel linking to `order/`
(relative — Contact cannot take a `home` prop). The buy branch in Contact's frozen
logic is now unreachable; leave it in place. The order page deliberately breaks
the colour roles: green H1, red (`--red-on-dark`) sub headings — the owner's choice.

### Contact.tsx is frozen above `const inputStyle = {`

Everything above that line — the Formspree endpoint and payload, `_subject`
formats, validation order, focus-first-error refs, state resets, `submitting/
submitted/sendError` semantics — must stay byte-identical except for added
imports. Presentation below it is free. Never extract a hook.

Review recipe (Git Bash):

```bash
diff <(git show main:components/Contact.tsx | sed -n '1,/^  const inputStyle = {/p') \
     <(sed -n '1,/^  const inputStyle = {/p' components/Contact.tsx)
# only import lines may differ

for rev in main HEAD; do
  git show $rev:components/Contact.tsx |
  grep -o 'name="[A-Za-z]*"\|value="\(buy\|inquiry\)"\|autoComplete="[^"]*"\|type="[a-z]*"\|inputMode="[a-z]*"\|noValidate\|role="status"\|aria-live="polite"\|disabled={submitting}' |
  sort > "/tmp/attrs-$rev.txt"
done
diff /tmp/attrs-main.txt /tmp/attrs-HEAD.txt   # must be empty
```

To test the form without creating a lead, paste a `fetch` interceptor in the console
that records the request and returns `{"ok": true}`.

## Styling

- Tailwind v4, no `tailwind.config.ts`; tokens are declared in `app/globals.css`
  (`:root` + `@theme inline`).
- Brand: `--ink` `--ink-mid` `--ink-card` `--red` `--blue` `--green` `--green-glow`
  `--steel` `--fog`, plus `--text-dark-mute` / `--text-light-mute` and
  `--line-dark` / `--line-light`.
- Type/layout classes: `.t-h1 .t-h2 .t-h3 .t-num .eyebrow .lead .small .micro`,
  `.section .section--band .container .container--narrow .container--text
  .section-head`, `.theme-dark` / `.theme-light`.
- Buttons `.btn` + `.btn-red|.btn-ghost|.btn-ghost-dark`, badges `.badge--new|
  testing|soon|ai|windows|released|region`. Colour roles: red = action/new,
  blue = AI/coming soon, green = released/price, orange = in testing,
  steel = Windows only. One red element per viewport.
- Inline `style` is still used for layout-critical values next to the utility
  classes — that is deliberate, don't refactor it to Tailwind-only.
- Mobile behaviour lives in the breakpoint blocks at the bottom of `globals.css`
  (1024 / 768 / 640 / 600 / 480), not in per-component `<style>` tags.

### Fonts

Self-hosted through `next/font/google` in `app/fonts.ts`; `fontClass` goes on
`<html>` in every layout. **Never write a literal `Barlow` font-family** — use
`var(--font-display)` / `var(--font-body)`. The audit fails the build if the emitted
CSS references Google Fonts.

### Images

`npm run images` regenerates everything derived and the outputs are committed:
`public/screenshots/_opt/**` WebP variants + `lib/screenshot-manifest.json`,
`logo-320/640`, store badges, `public/og/{home,au}.jpg` (1200×630),
`video-poster-1280.*` and the manifest icons. Add a screenshot → run it → commit.
Render screenshots through `components/Shot.tsx` so the srcset stays honest.

## Links & CTAs

- Every internal link ends with a trailing slash.
- `BUY_URL` (`order/`), `NAV_BUY_URL` (`#pricing`) and `TRIAL_URL` (`#download`)
  come from `lib/site.ts`; wrap hash and relative CTAs in `resolveCta(url, home)`
  so they work from a subpage and from `/au/` (absolute URLs pass through).
- The desktop app's trial banner links to `/{locale}/#contact`; keep the order
  hand-off in Contact until the app points at `order/` directly.
- The locale switcher maps feature-page slugs through `pageBySlug` so switching
  language stays on the same page.

## Privacy constraint

The privacy copy promises no analytics, no tracking and no third-party cookies.
Do not add any — that includes fonts, embeds and pixel tags. The product video is a
click-to-load facade so a visit that never plays it contacts no third party.

## Naming guardrails

- "Deutsche AW-Liste" / "German AW list" — **never** "BVAT".
- "Belgische UPEX-Liste" / "Belgium UPEX List".
- Optional AI: bring-your-own key, redacted image goes only to the provider the user
  picked, off by default. Never say "stays on device" about the scan itself.
- The licence is a **Dauerlizenz / perpetual licence** with no expiry. "5 Jahre" only
  ever appears as the cost illustration. Never "lebenslang" / "for life".

## Verification

```bash
npm run build              # guards run automatically
npx tsc --noEmit
npx wrangler dev           # then: curl -sI localhost:8787/ → Location: /de/
node scripts/audit-out.mjs --baseline <dir>   # diff anchors against an old out/
```
