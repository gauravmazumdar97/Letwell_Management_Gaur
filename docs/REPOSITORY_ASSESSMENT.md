# Letwell repository assessment

**Date:** 2026-11-22  
**Scope:** Inspect the open workspace against the Express 5 + PostgreSQL + Vite brief, then plan Week 1.

## Executive finding

Important: this repository is **not** the Express/PostgreSQL/Stripe backend described in the new brief.

It is a **working Week 1 Letwell prototype** built earlier as a **Next.js 15 App Router + Auth.js + Prisma + SQLite** monolith. Branding, UK locale, role dashboards and public browsing exist. The intended Node/Express API, JWT auth, PostgreSQL, Stripe, Cloudinary, Swagger, CI and Vite SPA **are absent** and must be **new implementation**.

| Claim in brief | Verified in this repo |
|---|---|
| Node.js + Express 5 API | **Missing** - Next.js only |
| JWT authentication | **Partial** - Auth.js JWT sessions, not Express JWT bearer API |
| Zod validation | **Present** (auth credentials only) |
| Prisma + PostgreSQL | Originally **Prisma + SQLite**; active stack now **Prisma + MySQL 8** (switched from the brief's PostgreSQL for local Windows practicality) |
| Stripe payments + webhooks | **Missing** |
| Cloudinary / local uploads | **Missing** - static SVG placeholders only |
| ~15 database tables | **13** Prisma models (see below) |
| ~50 endpoints | **1** HTTP route (`/api/auth/[...nextauth]`); other behaviour via RSC/server actions |
| Swagger documentation | **Missing** |
| CI configuration | **Missing** |
| Vite React frontend | **Missing** - Next.js `src/app` UI |
| Upstream / licence fork | **No remote**. Git history starts at `Initial commit from Create Next App`. No third-party project licence to attribute beyond standard dependency licences. |

## What works today (verified previously / reconfirmed by inspection)

| Area | Status | Evidence |
|---|---|---|
| Public home + search + property detail | **Working** | `src/app/(public)/*`, Prisma listing queries |
| URL-backed search filters | **Working** | `search/page.tsx` + `lib/listings.ts` |
| Public listing rules (published + available) | **Working** | Draft/archived/occupied excluded |
| Sign-in / sign-out | **Working** | Auth.js credentials + seed users |
| Role dashboards (tenant / landlord / admin) | **Working** | Portal pages + middleware role checks |
| Pending / suspended gates | **Working** | Middleware + account status pages |
| Seeded demo data | **Working** | `prisma/seed.ts`, password `Password123!` |
| Lint / typecheck / production build | **Working** (Week 1 handoff) | Documented in `docs/VERIFICATION.md` |
| Registration | **Stub** | Register page explains Week 2 |
| Listing CRUD, enquiries, lease activation | **Not implemented** | Placeholder portal pages |
| Rent charge generation / demo payments | **Models + seed only** | No generation/payment actions |
| Maintenance submit / assign / resolve | **Seed + read views only** | No write workflows |
| Stripe / earnings / booking conflicts | **Not applicable** to current schema | Different domain model |

## Endpoint inventory (actual)

The current app is not an Express REST API. Authoritative mutations live in server actions and server components.

### HTTP routes

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| `GET`/`POST` | `/api/auth/[...nextauth]` | Public (credentials) | Auth.js protocol (CSRF + credentials form fields) | Session cookie / JSON session |
| `GET` | `/api/auth/csrf` | Public | - | `{ csrfToken }` |
| `GET` | `/api/auth/session` | Cookie | - | `{ user: { id, email, name, role, status }, expires }` or `{}` |
| `POST` | `/api/auth/callback/credentials` | Public | `email`, `password`, `csrfToken` | Redirect / session cookie |

### Server action (not a REST endpoint)

| Action | File | Request | Result |
|---|---|---|---|
| `signInAction` | `src/app/actions/auth.ts` | FormData email/password | Redirect to role dashboard or status page; `{ error }` on failure |
| `signOutAction` | same | - | Clears session, redirects `/` |

### Page-level data access (server components)

Examples of persisted reads (not REST):

- `GET` logical: featured listings on `/` via `getFeaturedListings()`
- Search listings on `/search` via `getPublicListings(filters)`
- Property detail on `/properties/[id]` via Prisma `property.findUnique`
- Tenant rent table via `rentCharge.findMany({ where: { lease: { tenantId } } })`
- Admin users via `user.findMany`

**There are no ~50 REST endpoints to group by role in this repository.** Any Swagger or report claiming that inventory does not describe this codebase.

## Database models and relationships (actual)

**13 models** (not 15):

```text
User
  |- Property (landlord)
  |- Enquiry (tenant)
  |- Lease (tenant)
  |- MaintenanceRequest (tenant)
  |- Notification
  |- MaintenanceStatusHistory (actor)

Property
  |- Listing (1:1)
  |- PropertyImage (1:n)
  |- Enquiry, Lease, MaintenanceRequest

Lease
  |- RentCharge (1:n) -> Payment (1:1), Reminder (1:n)
  |- MaintenanceRequest

Worker -> MaintenanceRequest
MaintenanceRequest -> MaintenanceStatusHistory, Notification
```

Money is integer **pence**. Roles: `TENANT | LANDLORD | ADMIN`. No dual-role grants, no booking/rental/invoice/earnings tables, no Stripe IDs, no categories table, no platform settings table.

## Checks: working, failing, missing

| Check | Status |
|---|---|
| `npm run typecheck` | **Working** (as of Week 1 handoff) |
| `npm run lint` | **Working** |
| `npm run build` | **Working** |
| Fresh migrate + seed | **Working** (SQLite) |
| Auth + role dashboards smoke | **Working** |
| Pending/suspended portal denial | **Working** |
| Express/API integration tests | **Missing** |
| Booking conflict / atomic rental tests | **Missing** (domain not present) |
| Stripe webhook / duplicate payment tests | **Missing** |
| PostgreSQL init on this machine | **Blocked** - `psql` not installed, no Postgres service, Docker not available |
| Swagger drift checks | **N/A** - no Swagger |
| CI pipeline | **Missing** |

## Differences: implementation vs Swagger vs project report

- **Swagger:** none present, so nothing to drift against.
- **Project report claims** (15 tables, ~50 endpoints, Express, Stripe, Cloudinary, manager dual-role): **do not match** this repository. Treat those as requirements for the **new** system, not as documentation of current code.
- **Naming:** current code uses `LANDLORD`; the new brief uses **property manager**. New API should adopt manager terminology while mapping seed/demo copy carefully.
- **Domain shift:** current model is long-let enquiry/lease/rent-charge. New brief centres **booking request -> rental -> invoices -> Stripe**, with multi-unit pricing (monthly/daily/nightly/event). This is a **schema redesign**, not a thin adapter.

## Upstream, licence, attribution

- No `git remote` configured.
- History is local scaffolding (`create-next-app`) plus Letwell Week 1 work.
- Bundled property SVGs are original placeholders; see `public/images/USAGE.md`.
- Dependency licences are standard npm package licences (MIT/Apache etc.); no separate upstream product licence was found to copy.

## Local tooling gap (this laptop)

| Tool | Present? |
|---|---|
| Node 22 / npm 10 | Yes |
| PostgreSQL (`psql` / service) | **No** |
| Docker | **No** |
| winget / chocolatey | Yes (can install Postgres) |

Week 1 API verification against PostgreSQL requires installing PostgreSQL (or Docker) before migrate/seed can succeed.

## Proposed folder arrangement

Preserve the Next.js prototype as an archive (reference for brand/UI patterns), and make the brief’s architecture the active product:

```text
Rental Management/
  README.md                 # PowerShell setup for API + web + Postgres
  docs/
    REPOSITORY_ASSESSMENT.md
    BUILD_PLAN.md           # six-week Express/Vite plan (authoritative going forward)
    VERIFICATION.md
    ARCHITECTURE.md         # ER + auth/role notes
  archive/
    nextjs-sqlite-letwell/  # frozen previous prototype (source only)
  apps/
    api/                    # Express 5 + Prisma + PostgreSQL + JWT + Zod (+ Stripe later)
    web/                    # Vite + React + TS + Tailwind + shadcn + TanStack Query
  package.json              # npm workspaces root
```

Conventions to keep from the prototype where they still fit:

- Letwell brand, UK English, GBP/pence
- Warm off-white / ink / teal visual language
- Role-gated workspaces and account status screens
- Idempotent seed with clearly labelled demo accounts
- Server-side ownership and status checks (now on Express middleware/services)

## Week 1 implementation intent (new stack)

**New implementation** (not a continuation of Next.js routes):

1. Archive the Next.js SQLite prototype under `archive/`.
2. Scaffold `apps/api` with Express 5, Prisma PostgreSQL schema v1 (users, roles/grants, properties, categories, auth-ready), JWT login/register, health route, Zod validation, env template.
3. Scaffold `apps/web` with Vite React, shared design tokens, public shell, sign-in/register, role-aware app shell.
4. Seed admin + manager + tenant accounts; document PowerShell commands.
5. Baseline checks: API health, login, protected route denial, frontend auth shell against API.

Out of Week 1 scope (later milestones): booking approval atomics, Stripe webhooks, Cloudinary, full Swagger inventory, maintenance write APIs.

## Week 1 delivery status (after scaffolding)

| Item | Status |
|---|---|
| Archive Next.js prototype | Done (`archive/nextjs-sqlite-letwell`) |
| Monorepo `apps/api` + `apps/web` | Done |
| Prisma schema (18 models) | Done |
| JWT auth + role grants + public properties API | Done |
| Vite auth shell + public pages | Done |
| README PowerShell instructions | Done |
| `npm run typecheck` / web build / API unit tests | Passing |
| PostgreSQL migrate + seed + live API health | **Blocked** - installer did not create a running cluster (needs elevated Windows install / UAC) |

### New API endpoint map (Week 1)

| Role | Method | Path | Example body / result |
|---|---|---|---|
| Public | GET | `/api/health` | `{ ok, service, database }` |
| Public | POST | `/api/auth/register` | `{ email, password, name, asTenant, asManager, managerMessage? }` -> pending user |
| Public | POST | `/api/auth/login` | `{ email, password }` -> `{ token, user:{id,roles,status} }` |
| Authenticated | GET | `/api/auth/me` | `{ user }` including non-approved statuses |
| Approved | GET | `/api/me/dashboard` | role-scoped counts + nextActions |
| Admin | GET | `/api/admin/overview` | `{ users, approvedProperties, pendingManagers }` |
| Public | GET | `/api/properties` | query: location, pricingUnit, min/maxPrice, sort |
| Public | GET | `/api/properties/:id` | approved property detail or 404 |
