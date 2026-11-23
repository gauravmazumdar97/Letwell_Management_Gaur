# Letwell

Letwell is a local-first rental property management platform for fictional UK lettings. It combines a public property website with private workspaces for tenants, landlords and administrators.

The app is designed to run on a laptop with seeded data. It does not require cloud deployment, paid services, API keys or external accounts.

## Features (current)

**Week 1 complete**

- Public homepage with location search and curated available homes
- Search page with location, rent, bedrooms, property type and sort filters (stored in the URL)
- Property detail pages for published, available listings
- Credential sign-in with role-based dashboards (tenant, landlord, admin)
- Account status screens for pending, rejected and suspended users
- SQLite database with migrations and an idempotent seed

Later weeks add listing management, registration and approval, enquiries, leases, rent payments, reporting and maintenance workflows. See `docs/BUILD_PLAN.md`.

## Requirements

- Node.js 20 or newer (tested on 22)
- npm 10 or newer

## Quick start

From the project root:

```bash
npm install
copy .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001).

### Environment

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite path, default `file:./dev.db` |
| `AUTH_SECRET` | Long random string for Auth.js sessions |

Generate a secret if you want:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not commit `.env` or `prisma/dev.db`.

### Destructive reset

This deletes the local database, re-applies migrations and re-seeds demo data:

```bash
npm run db:reset
```

## Seeded sign-in accounts

Shared password for every seeded account:

```text
Password123!
```

| Role | Email | Status | Notes |
|---|---|---|---|
| Admin | `admin@letwell.test` | Approved | Platform overview and user list |
| Landlord | `landlord.north@letwell.test` | Approved | Clerkenwell, Shoreditch, Islington portfolio |
| Landlord | `landlord.south@letwell.test` | Approved | Balham and draft Hackney Wick listing |
| Tenant | `tenant.active@letwell.test` | Approved | Active Islington lease, rent and maintenance |
| Tenant | `tenant.free@letwell.test` | Approved | No lease yet |
| Tenant | `tenant.pending@letwell.test` | Pending | Blocked from portal until approved |
| Tenant | `tenant.suspended@letwell.test` | Suspended | Blocked even with an existing session |
| Landlord | `landlord.pending@letwell.test` | Pending | Awaiting approval |

Workers are contact records only (`worker.plumbing@letwell.test`, `worker.electrical@letwell.test`). There is no worker login in this release.

## Demo walkthrough (Week 1)

1. Open the homepage and confirm curated London homes appear.
2. Go to **Browse homes** / `/search`, filter by location or rent, and confirm the URL updates.
3. Open a property detail page. Draft, archived and occupied listings should not appear in public search.
4. Sign in as `admin@letwell.test` and open the admin dashboard.
5. Sign out, then sign in as `landlord.north@letwell.test` and `tenant.active@letwell.test`.
6. Sign in as `tenant.pending@letwell.test` and confirm you land on the pending account screen.
7. Sign in as `tenant.suspended@letwell.test` and confirm the suspended screen blocks `/tenant`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript (`tsc --noEmit`) |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed or refresh demo data (idempotent for users) |
| `npm run db:reset` | Destructive database reset and seed |
| `npm run db:studio` | Open Prisma Studio |

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 15 App Router, TypeScript |
| UI | Tailwind CSS, shadcn-style components, Lucide icons |
| Forms | React Hook Form, Zod |
| Auth | Auth.js (NextAuth v5) credentials provider |
| Database | Prisma 6, SQLite |
| Money | Integer pence, displayed as GBP (`en-GB`) |
| Locale | UK English, UK date formats |

## Project layout

```text
docs/                 Build plan and verification checklist
prisma/               Schema, migrations and seed
public/images/        Offline property illustrations
src/app/              App Router pages and server actions
src/components/       Shared UI, layout and listing components
src/lib/              Auth, database, listings, money and date helpers
```

## Roles at a glance

| User | Can do now | Coming later |
|---|---|---|
| Visitor | Search and view published available homes | - |
| Tenant | Sign in, see lease/rent/maintenance summaries | Enquiries, demo payments, request updates |
| Landlord | Sign in, see own properties | Listing publish, enquiry review, rent reports |
| Admin | Sign in, see users and operational counts | Approvals, rent generation, maintenance queue actions |

## Conventions

- UK English copy throughout
- Amounts stored as integer pence, never floating-point pounds
- Public search shows only `PUBLISHED` listings on `AVAILABLE` properties
- Property records stay distinct from public listings
- Protected routes re-check account status so suspension applies immediately

## Documentation

- `docs/BUILD_PLAN.md` - stack choices, data contracts and six-week ownership
- `docs/VERIFICATION.md` - shared local verification checklist
- `public/images/USAGE.md` - rights note for bundled visual assets

## Known limitations (Week 1)

- Self-registration is stubbed; use seeded accounts for demos
- Enquiry, lease activation, demo payments and maintenance assignment land in later weeks
- Several portal nav links show milestone placeholders until their week is implemented
