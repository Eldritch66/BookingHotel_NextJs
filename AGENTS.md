# Booking App — Agents Guide

## Commands
- `npm run dev` — start dev server (Next.js 16 App Router)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- No test suite, no CI, no Husky configured

## Tech Stack
- **Next.js 16** App Router, **React 19**, **TypeScript** (strict, `bundler` module resolution)
- **NextAuth v5** (Auth.js) with **Google OAuth**, JWT session strategy
- **Supabase** (Postgres) — project at `rhsajlnzpqcwfqrxmngi.supabase.co`
- **Tailwind CSS v4** + `@tailwindcss/postcss`, **shadcn/ui** (radix-nova style), **lucide-react** icons
- Path alias `@/*` → project root (configured in `tsconfig.json`)

## Required Environment Variables
```
SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY
NEXTAUTH_URL, NEXTAUTH_SECRET
AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
```

## Project Structure
```
app/              — routes, API, private components (_components/), private lib (_lib/)
components/ui/    — shadcn/ui primitives (Button, Pagination)
lib/utils.ts      — cn() utility (clsx + tailwind-merge)
types/            — NextAuth type augmentations (UserRole, Session.user)
```

## Routes & Access Control
| Route | Access | Notes |
|-------|--------|-------|
| `/` | Public | Landing page |
| `/properti` | Public | Property listing with filter + pagination |
| `/properti/[id]` | **Protected** by middleware | Property detail + booking form |
| `/login`, `/login/registrasi` | Public | Google sign-in |
| `/role` | Auth redirect (role="new") | Role selection (penyewa/pemilik) |
| `/account/*` | Auth required, role="penyewa" | Guest area |
| `/dashboard/*` | Auth required, role="pemilik" | Owner area (unimplemented) |

**Middleware** (`middleware.ts`): only protects `/properti/:id*`. All other route protection is handled in `auth.ts` via the `authorized` callback.

**Role resolution**: on sign-in, looks up email in `pemilik` then `penyewa` tables; if neither found, role = `"new"` → redirect to `/role`.

## Key Patterns
- **Server components by default**; client components only for interactivity (carousels, pagination, forms, optimistic updates)
- **Server actions** in `app/_lib/action.ts` (`"use server"`)
- **DB queries** use `supabaseAdmin` (service role key) in `app/_lib/data-services.ts`
- **Type mappers** (`mapPropertiToProperty`, `mapSewaToSewa`) convert snake_case DB rows to camelCase frontend types
- **Cancel is soft delete**: `cancelSewa` sets `sewa.catatan = "CANCELLED"`
- **Pricing formula**: `blocks * price_per_two_months + 25000 (service) + 10% tax`, where `blocks = ceil(durasi_bulan / 2)`
- **Optimistic UI** with `useOptimistic` in `DaftarSewa`
- **Private folders** (`_components/`, `_lib/` inside `app/`) excluded from routing

## Database Tables
`penyewa`, `pemilik`, `properti`, `foto_properti`, `unit`, `sewa`, `pembayaran`

## Notable
- `midtrans-client` dependency installed but not yet wired into any payment flow
- No `npm test` script exists
- Next.js output is configured for static export (`out/` directory present, no `output: "export"` in config — verify intent before relying on static mode)
