# pdrkalk.ch

Marketing site for **PDR Kalk**, the PDR (paintless dent repair) cost-calculation
app by Balmer Storm Solutions.

Next.js 16 static export, deployed to Cloudflare Workers Assets.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000/de/
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Message checker → static export → output audit |
| `npm run check` | Both guard scripts against the current `out/` |
| `npm run images` | Regenerate WebP / OG / logo / icon assets (outputs are committed) |
| `npm run llms` | Regenerate `public/llms.txt` |
| `npm run preview` | `wrangler dev` — serves `out/` the way Cloudflare does |
| `npm run deploy` | `npm run build && wrangler deploy` |

`npm run build` is the quality gate: it fails on a missing or asymmetric message
key, and on a broken page, link, anchor, heading or JSON-LD graph.

## Where things live

- `app/` — routes. Four locales under `app/[locale]/`, plus the standalone
  Australian page at `app/au/`.
- `components/` — one component per page section, flat.
- `messages/` — all user-facing copy (`de` is canonical; `au` is a variant).
- `data/` — `releases.ts` (release notes) and `pages.ts` (feature-page registry).
- `lib/site.ts` — versions, prices, download URLs and CTA targets.

Architecture, conventions and the frozen parts of the code are documented in
[CLAUDE.md](CLAUDE.md). Read that before changing `components/Contact.tsx`.

## Licence

See [LICENSE.md](LICENSE.md).
