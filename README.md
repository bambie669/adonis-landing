# adonis-landing

Marketing site for [adonis-smart-ads](https://github.com/cristidan94/adonis-smart-ads). Vite + React + Tailwind v4 + a WebGL background.

## Dev

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # static export -> dist/
```

## Why a separate repo?

So the smart-ads app and the landing page can be iterated on in parallel
without one's build / tooling state colliding with the other's.

## Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css                 # Tailwind v4 + HUD utility kit (lifted from smart-ads)
├── WebGLBackground.tsx       # shader background (grid + particles + reticle + mouse glow)
└── sections/
    ├── Hero.tsx
    ├── Features.tsx          # also exports SectionHeader
    ├── Pipeline.tsx
    ├── Stack.tsx
    └── Footer.tsx
```

Visual language mirrors the smart-ads Neural Observatory UI on purpose --
same fonts (Playfair Display + Inter + JetBrains Mono), same palette
(mint / orange / void), same WebGL background. HUD utility classes
(`hud-frame`, `card-hud`, `glow-mint`, `scan-lines`, `grid-bg`,
`divider-dots`, `status-live`) live in `src/index.css`.

## Deploy

Anywhere that serves static files: Cloudflare Pages, Vercel, Netlify,
GitHub Pages. `npm run build` then upload `dist/`.
