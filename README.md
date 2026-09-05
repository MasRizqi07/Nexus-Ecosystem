# Nexus Ecosystem — Unified High-Velocity Web Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.39.3-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.3-443e38?style=for-the-badge)](https://zustand.docs.pmnd.rs/)

**Nexus Ecosystem** is a unified, production-grade full-stack platform converging four distinct domains into a seamless Next.js 15 App Router web application:
1. **High-Converting Marketing Landing Page**: SEO & performance-optimized presentation layer with cyberpunk ambient glassmorphism and illustrative architectural benchmarks.
2. **Interactive Data & Algorithm Visualizer**: Client-heavy execution engine powered by pure ES6 generator functions (`function*`) with timeline scrubbing, comparisons, swaps, pivots, and dynamic custom array parsing.
3. **Developer Productivity & Utility Suite**: Real-time JSON Formatter & Schema Linter, Regex Pattern Sandbox with capture groups and string substitution, and live Markdown Split-View Studio with PostgreSQL persistence.
4. **Micro E-Commerce Catalog & Checkout Flow**: Faceted search filtering, Zustand LocalStorage persisted cart drawer, and a 3-step checkout flow with atomic inventory verification and order persistence.

---

## 🏛️ Architectural Isolation (Route Groups)

To eliminate context pollution, stylesheet bleed, and runtime overhead, concerns are isolated using Next.js Route Groups:

```text
src/
├── app/
│   ├── (marketing)/                # High-speed static marketing layer
│   │   ├── layout.tsx              # Public minimal layout (Navbar + Footer)
│   │   ├── page.tsx                # Hero, Features Bento, Telemetry, Dual CTA
│   │   └── about/page.tsx          # Architectural Manifesto & Engineering Specs
│   ├── (shop)/                     # E-Commerce domain
│   │   ├── layout.tsx              # Commerce layout with Cart Drawer trigger & badge
│   │   ├── catalog/page.tsx        # Faceted search, filtering, and sorting
│   │   ├── catalog/[slug]/page.tsx # Dynamic product specs & Add to Cart
│   │   └── checkout/page.tsx       # 3-step checkout wizard with confirmation receipt
│   ├── (workspace)/                # Developer application domain
│   │   ├── layout.tsx              # Sidebar navigation, active route indicators, breadcrumbs
│   │   ├── dashboard/page.tsx      # System health & utility launchpad
│   │   ├── visualizer/page.tsx     # Algorithm Visualizer console & canvas bars
│   │   └── tools/                  # Developer productivity tools
│   │       ├── json-formatter/page.tsx # AST validation, beautify, minify, DB save
│   │       ├── regex-tester/page.tsx   # Pattern matching, groups table, substitution
│   │       └── markdown-editor/page.tsx# Split-screen editor, sanitized preview, .md export
│   ├── api/
│   │   ├── checkout/route.ts       # Atomic order mutation & inventory verification
│   │   └── tools/save/route.ts     # Developer tool state persistence endpoint
│   ├── globals.css                 # Cyber dark theme tokens & glassmorphic utilities
│   ├── layout.tsx                  # Root shell, typography, global toast container
│   ├── loading.tsx                 # Suspense loading skeleton with cyber spinner
│   ├── error.tsx                   # Top-level error boundary with frame reset
│   └── not-found.tsx               # Custom 404 handler with cross-domain links
├── components/
│   ├── ui/                         # Atomic primitives (Button, Input, Card, Badge, Sheet, Slider, Toast)
│   ├── shop/                       # ProductCard, CartDrawer, CartTriggerButton, ProductDetailActions
│   └── workspace/                  # WorkspaceSidebar, BreadcrumbRail
├── db/
│   ├── index.ts                    # Thread-safe globalThis memory singleton & Drizzle pooling
│   ├── schema.ts                   # Tables: Users, Products, Orders, OrderItems, ToolSavedStates
│   └── seed-data.ts                # Initial catalog products & tool presets
├── lib/
│   ├── utils.ts                    # cn(), formatCentsToUsd(), formatRating(), debounce()
│   ├── validators/                 # Zod boundary schemas (checkout, custom array, tool state)
│   └── visualizer-engine/          # Pure TS sorting generators (Bubble, Selection, Insertion, Merge, Quick)
├── stores/
│   ├── use-cart-store.ts           # Zustand cart store with LocalStorage persistence
│   └── use-visualizer-store.ts     # Visualizer state machine with strict timer lifecycle cleanup
└── types/
    └── index.ts                    # Strict TypeScript interfaces & Drizzle inferred types
```

---

## ⚡ Key Architectural Invariants

- **100% Strict TypeScript 5**: Built with `strict: true`, `noImplicitAny: true`, explicit interfaces, and inferred Drizzle schema types (`Product`, `Order`, `ToolSavedState`).
- **Next.js 15 Async Props Compliance**: All dynamic routes (`/catalog/[slug]`) and layouts treat `params` and `searchParams` as asynchronous `Promise` objects.
- **Thread-Safe `globalThis` Singleton Fallback**: When external PostgreSQL credentials are not yet configured, the database repository seamlessly utilizes an in-memory singleton attached to `globalThis.__nexus_memory_store__`. This prevents state loss across Next.js Fast Refresh and Server Actions while hot-swapping to live PostgreSQL pools when `DATABASE_URL` is set.
- **Atomic Order Mutations**: Checkout operations perform server-side price lookup and atomic inventory verification before generating orders and line items.
- **Strict Visualizer Loop Lifecycle**: All timer IDs (`setTimeout`) and animation frame handles (`requestAnimationFrame`) are strictly tracked and cancelled on component unmount and algorithm resets.
- **Store Hydration Barriers**: Reads of persisted client stores are deferred until after client mount, preventing React 19 SSR hydration mismatches.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20+ (v22+ recommended)
- **pnpm**: v9+ (or npm v10+)

### 1. Clone & Install
```bash
git clone https://github.com/MasRizqi07/Nexus-Ecosystem.git
cd Nexus-Ecosystem
pnpm install
```

### 2. Environment Setup (Optional)
The application runs immediately out-of-the-box using the built-in memory store. To connect a live PostgreSQL database (Neon / Supabase / Local):
```bash
cp .env.example .env.local
```
Update `.env.local`:
```env
DATABASE_URL="postgresql://user:password@ep-host.region.neon.tech/nexus_db?sslmode=require"
```
Push the schema to your live database and seed catalog data & users:
```bash
pnpm exec drizzle-kit push
pnpm run db:seed
```

### 3. Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start
```bash
pnpm run build
pnpm run start
```

---

## 🧪 Verification & Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Starts the Next.js development server with hot reload |
| `pnpm run build` | Compiles optimized production bundle (14 routes) |
| `pnpm run start` | Runs the production server on port 3000 |
| `pnpm run typecheck` | Validates TypeScript strict mode (`tsc --noEmit`) |
| `pnpm run test` | Executes unit and concurrency integration tests via Vitest |
| `pnpm run lint` | Runs strict Next.js ESLint validation |
| `pnpm run db:seed` | Idempotently seeds initial catalog products and test accounts |
| `pnpm exec drizzle-kit push` | Pushes Drizzle schema directly to PostgreSQL |
| `pnpm exec drizzle-kit studio` | Opens interactive Drizzle Studio database viewer |

---

## 📦 Deployment

### Vercel (Recommended)
1. Import repository `MasRizqi07/Nexus-Ecosystem` into Vercel.
2. Next.js 15 App Router will be automatically detected.
3. Add `DATABASE_URL` in Environment Variables (optional, for persistent PostgreSQL).
4. Deploy!

### Docker / Cloud Run (Standalone)
`output: 'standalone'` is pre-configured in `next.config.ts`. The production output creates a minimal standalone Node.js server container.

---

## 📄 License

MIT © [Mas Rizqi](https://github.com/MasRizqi07). Engineered for extreme software velocity.