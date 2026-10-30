# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js, default port 3000)
npm run build      # Production build
npm run start      # Start production server (requires build first)
npm run lint       # Run ESLint (eslint .)
```

No test suite is configured.

## Architecture

RUVEE_SHOP is a React 19 e-commerce storefront built with **Next.js 15 App Router**.

### Routing

Pages live in `src/app/` following Next.js file-system routing:

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.jsx` | Welcome/landing page |
| `/home` | `src/app/home/page.jsx` | Product catalog |

`src/app/layout.jsx` is the root layout — it imports global CSS and sets `metadata`. Icons are inline SVG components in `src/components/icons.jsx` (no FontAwesome).

### Data flow

Product data is a static array in `src/data/product.js`. `HomePage` is a Server Component that maps the array directly to one `CardItem` per product. There is no backend or API.

### Components

`src/components/` holds shared components:
- `Navbar` — logo is a `<Link>` to `/`, cart count is hardcoded to `0` (not yet implemented); About/Services/Contact are placeholder anchors with no target yet
- `icons.jsx` — inline SVG `CartIcon` / `SearchIcon`
- `CardItem` — pure display card, receives a product object as `item` prop

Components are Server Components by default; add `'use client'` only to components that use hooks or browser APIs (none currently).

### Styling

- **Global styles**: `src/styles/globals.css` — contains `@import "tailwindcss"` (Tailwind v4 syntax) plus base body reset
- **Tailwind v4** is configured via `postcss.config.mjs` using `@tailwindcss/postcss` (no `tailwind.config.js` needed)
- Components are styled with Tailwind utility classes only (no per-component CSS files)

### Images

All images are served from `public/` and referenced with root-relative paths (e.g. `/images/logo_Ruvee.png`, `/images/rawit_black.jpg`). They use `next/image` with explicit `width`/`height`.
