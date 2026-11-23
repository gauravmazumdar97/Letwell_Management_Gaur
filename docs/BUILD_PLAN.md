# Letwell build plan (Express API + Vite web)

Working brand: **Letwell**. Locale: UK English, GBP (integer pence) unless a seeded currency override is introduced later.

**Authority:** This plan supersedes the earlier Next.js + SQLite Week 1 plan for active delivery. The prototype is preserved under `archive/nextjs-sqlite-letwell/`. See `docs/REPOSITORY_ASSESSMENT.md`.

## Chosen stack (new implementation)

| Layer | Choice |
|---|---|
| API | Node.js, Express 5, TypeScript |
| Auth | JWT bearer tokens, bcrypt password hashes, server-side role grants |
| Validation | Zod on API request bodies |
| ORM / DB | Prisma + MySQL 8 |
| Payments | Stripe test mode + webhook signature verification (from Week 3) |
| Images | Local upload in development; Cloudinary via server credentials (Week 2+) |
| Web | Vite, React, TypeScript, Tailwind, shadcn/ui patterns, React Router, TanStack Query, RHF, Zod, Lucide |
| Docs | Swagger/OpenAPI aligned to implemented routes |
| Money | Integer pence; fee snapshots on payment |

## Shared contracts (Week 1 baseline)

### Roles and grants

- Roles: `TENANT`, `MANAGER`, `ADMIN`
- A user may hold multiple grants (`UserRole`). Active workspace is selected from **server-verified** grants only.
- Self-registration creates `TENANT` and/or pending `MANAGER` application. Admins are seeded.
- `AccountStatus`: `PENDING` | `APPROVED` | `REJECTED` | `SUSPENDED`
- Protected handlers re-read status and grants on each request.

### Ownership

- Managers: only their properties and related bookings/rentals/maintenance.
- Tenants: only their bookings, rentals, invoices, maintenance.
- Admins: moderation, users, categories, settings, platform income.

## Six-week ownership

| Week | Member 1 · Backend and integration | Member 2 · Frontend and verification | Member 3 · Product research and public experience | Member 4 · Design, administration and coordination | Weekly outcome |
|---|---|---|---|---|---|
| 1 | API setup, MySQL init, JWT auth, env | Endpoint map, baseline checks, frontend auth shell | Journey notes, public-page content draft | Design tokens/components, task board, diagrams | Fresh local API + web; sign-in as seeded roles |
| 2 | Booking approval, rental creation, pricing rules | Tenant booking/rental screens; conflict tests | Public search + detail from API | Manager property/booking screens | Booking to rental path works |
| 3 | Stripe test payments, webhooks, earnings | Invoice/payment UI; retry cases | Report sections from evidence | Admin approvals + income screens | Paid invoice and earnings reconcile |
| 4 | Maintenance APIs + overdue reminders | Tenant maintenance + notifications | Search/a11y polish | Assignment, history, ops views | Maintenance end-to-end |
| 5 | Integrity/authz/integration fixes | Full journeys + responsive fixes | Usability + report accuracy | Acceptance coordination | Release blockers cleared |
| 6 | Fresh setup, migrations, seed, recovery | UI polish + final checks | Demo narrative + guidance | Handover pack | README-only demo works |

## Week 1 deliverables

- [x] Repository assessment
- [x] Monorepo `apps/api` + `apps/web`; archive Next.js prototype
- [x] MySQL Prisma schema (auth + core property tables; 18 models)
- [x] JWT register/login/me + role middleware
- [x] Seeded accounts and PowerShell README
- [x] Vite auth shell + shared design components + public content draft
- [ ] Health check and baseline verification against a running MySQL instance

## Progress log

- **2026-11-22** - Assessment complete: repo was Next.js/SQLite prototype; Express + Vite stack implemented as new work under `apps/`.
- **2026-11-22** - Database provider switched from PostgreSQL to MySQL 8. `MySQL80` is installed on the machine but the service was stopped and could not be started without elevation; migrate/seed remain blocked until MySQL is running and `DATABASE_URL` has the correct root password.
