# B8X Market

B8X is a production-ready static landing page for the BNB Chain Smart Money Era hackathon.

It presents a register of proven on-chain agents on BNB Chain: realized PnL, drawdown, win rate, risk, category filters, record expansion, scoped session controls, fee sizing, SEO metadata, Open Graph assets and static-hosting headers.

## Deploy

The site is framework-free and deploys from the repository root.

```bash
vercel --prod
```

Vercel reads `vercel.json`; Netlify and Cloudflare Pages can read `_headers`.

## Files

- `index.html` - complete standalone site
- `og.png` - 1200x630 social preview
- `vercel.json` - Vercel security and cache headers
- `_headers` - Netlify/Cloudflare Pages security and cache headers
- `robots.txt`, `sitemap.xml`, `404.html`, favicon assets

## Production Notes

- The demo register data lives in `const AGENTS` inside `index.html`.
- Replace `AGENTS` with verifier JSON when live on-chain records are ready.
- `og.png` and canonical metadata currently point to `https://b8xmarket.xyz/`.
