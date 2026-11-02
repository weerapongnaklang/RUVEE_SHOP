# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js, default port 3000)
npm run build      # Production build
npm run start      # Start production server (requires build first)
npm run lint       # Run ESLint (eslint .)
```

No test suite is configured. Verify changes with `npm run lint` and `npm run build`.

## Architecture

RUVEE_SHOP is a React 19 e-commerce storefront built with **Next.js 15 App Router**, with product data in **Supabase**.

### Routing

Pages live in `src/app/` following Next.js file-system routing:

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.jsx` | Welcome/landing page |
| `/home` | `src/app/home/page.jsx` | Product catalog (Server Component, `force-dynamic`) |
| `/home` (loading) | `src/app/home/loading.jsx` | Skeleton shown while the catalog query runs |
| `/login` | `src/app/login/page.jsx` | Login form UI only — submit handler is a `TODO: check auth`, no auth yet |

`src/app/layout.jsx` is the root layout — it imports global CSS and sets `metadata`. Icons are inline SVG components in `src/components/icons.jsx` (no FontAwesome).

### Data flow

`HomePage` queries the Supabase table `catalog_items` (`select("*").order("id")`) on every request and maps the rows to one `CardItem` each. Errors are logged with `console.error` and the page renders an empty list.

- The client is created in `src/lib/supabase.js` from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (set in `.env.local`, which is gitignored). Never print, paste or commit the values.
- Row fields used by the UI: `id`, `name`, `description`, `image`, `unitPrice`.
- `src/data/product.js` is the old static product array. Nothing imports it any more.
- `next.config.mjs` has no `images.remotePatterns`; if `image` ever holds a remote URL, add the host there or `next/image` will reject it.

### Components

`src/components/` holds shared components:
- `Navbar` — logo is a `<Link>` to `/home`, profile image links to `/login`, cart count is hardcoded to `0` (not yet implemented); About/Services/Contact are placeholder anchors with no target yet
- `icons.jsx` — inline SVG `CartIcon` / `SearchIcon`
- `CardItem` — pure display card, receives a product row as `item`; `priority` prop is set for the first 3 cards (above the fold)

Components are Server Components by default; add `'use client'` only to components that use hooks or browser APIs (currently only the login page).

Every element carries a descriptive `id` (e.g. `product-card-${item.id}`, `nav-logo`, `login-form`). Keep this convention when adding markup.

### Styling

- **Global styles**: `src/styles/globals.css` — `@import "tailwindcss"` (Tailwind v4) plus an `@theme inline` block of colour tokens.
- **Use the tokens, not raw colours**: `bg-brand`, `bg-brand-hover`, `bg-cta`, `bg-cta-hover`, `bg-surface`, `bg-page`, `text-ink`, `text-ink-muted`, `text-ink-subtle`, `text-on-brand`, `text-price`, `bg-badge`. Add new colours as tokens in `globals.css`.
- **Tailwind v4** is configured via `postcss.config.mjs` using `@tailwindcss/postcss` (no `tailwind.config.js` needed)
- Components are styled with Tailwind utility classes only (no per-component CSS files)

### Images

All images are served from `public/` (`public/images/`, `public/favicon/`) and referenced with root-relative paths (e.g. `/images/logo_Ruvee.png`, `/images/rawit_black.jpg`). They use `next/image` with explicit `width`/`height`.

## Safety

- Do not read, print or edit `.env*` files; they hold Supabase credentials. Refer to variables by name only.
- Do not commit or push unless asked.
