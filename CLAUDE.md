# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js, default port 3000)
npm run build      # Production build
npm run start      # Start production server (requires build first)
npm run lint       # Run ESLint (next lint)
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

`src/app/layout.jsx` is the root layout — it imports global CSS and loads FontAwesome via CDN `<link>` tag (which is why `<i className="fa-solid ...">` class strings work in components without importing the React FontAwesome wrapper).

### Data flow

Product data is a static array in `src/data/product.js`. `HomePage` loads it into local state via `useEffect` on mount, then renders one `CardItem` per product. There is no backend or API.

### Components

`src/components/` holds shared components:
- `Navbar` — logo navigates to `/` via `useRouter`, cart count is hardcoded to `0` (not yet implemented)
- `CardItem` — pure display card, receives a product object as `item` prop

All components that use hooks (`useRouter`, `useState`, `useEffect`) are marked `'use client'`.

### Styling

- **Global styles**: `src/styles/globals.css` — contains `@import "tailwindcss"` (Tailwind v4 syntax) plus base body reset
- **Component styles**: `src/styles/Navbar.css` and `src/styles/CardItem.css` — plain CSS imported directly in each component
- **Tailwind v4** is configured via `postcss.config.mjs` using `@tailwindcss/postcss` (no `tailwind.config.js` needed)
- Components mix Tailwind utility classes with the scoped CSS files

### Images

All images are served from `public/` and referenced with root-relative paths (e.g. `/logo_Ruvee.png`, `/rawit_black.jpg`). They use plain `<img>` tags, not `next/image`.
