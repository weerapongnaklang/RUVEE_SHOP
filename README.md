# RUVEE Shop

E-commerce storefront built with Next.js 15 (App Router), React 19 and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the dev server               |
| `npm run build` | Production build                   |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Structure

- `src/app/` — routes (`/` welcome page, `/home` product catalog)
- `src/components/` — `Navbar`, `CardItem`, inline SVG icons
- `src/data/product.js` — static product data (no backend yet)
- `public/` — images and favicon
