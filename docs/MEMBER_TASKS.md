# Letwell - member task sheet

Send this to the team. It records what is already done and what each member owns next.

**Project:** Letwell rental management  
**Stack:** Express 5 API + Prisma/MySQL + Vite React  
**Brand:** Letwell · UK English · GBP  

**How to run (short):**

```powershell
# MySQL must be running on localhost:3306
cd "C:\Users\Gaurav\Desktop\Rental Management"
npm install
npm run db:migrate -w @letwell/api
npm run db:seed -w @letwell/api
npm run dev:api
# second terminal
npm run dev:web
```

- Web: http://localhost:5173  
- API: http://localhost:4000/api/health  
- Password for all seeded accounts: `Password123!`

---

## Seeded logins

| Email | Role(s) |
|---|---|
| `admin@letwell.test` | Admin |
| `manager.north@letwell.test` | Manager |
| `tenant.active@letwell.test` | Tenant |
| `dual@letwell.test` | Tenant + Manager |
| `tenant.pending@letwell.test` | Pending tenant |
| `tenant.suspended@letwell.test` | Suspended tenant |

---

## Already completed (Week 1)

These items are in the repo now. Do not rebuild them from scratch.

### Member 1 - Backend and integration (done)

- [x] Express API scaffold in `apps/api`
- [x] MySQL + Prisma schema (18 models including booking/payment/maintenance tables for later weeks)
- [x] JWT auth: register, login, me
- [x] Role grants (`TENANT` / `MANAGER` / `ADMIN`) and account status checks
- [x] Public property list + detail APIs
- [x] Dashboard/overview endpoints for approved users
- [x] Seed script with demo users and properties
- [x] Env examples and local MySQL run path

### Member 2 - Frontend and verification (done)

- [x] Vite React app in `apps/web`
- [x] Sign-in / register forms (React Hook Form + Zod)
- [x] Auth context, JWT storage, workspace role switching
- [x] Pending / rejected / suspended account screens
- [x] Tenant / manager / admin workspace shells
- [x] Baseline typecheck and auth validation tests

### Member 3 - Product research and public experience (done for Week 1)

- [x] Journey notes in `docs/PRODUCT_NOTES.md`
- [x] Homepage, search and property detail content
- [x] URL-backed search filters
- [x] HD property photos bundled locally (Unsplash licence documented)

### Member 4 - Design, administration and coordination (done for Week 1)

- [x] Repository assessment (`docs/REPOSITORY_ASSESSMENT.md`)
- [x] Build plan and architecture notes
- [x] Shared UI components (button, input, label) and Letwell visual tokens
- [x] README PowerShell setup instructions
- [x] Task board / ownership table

---

## What each member should do next

### Member 1 - Backend and integration · Week 2 focus

1. Booking create/list endpoints for tenants  
2. Manager approve/reject booking  
3. Atomic rental + invoice creation on approval  
4. Server-side pricing by unit (monthly / daily / nightly / event)  
5. Prevent overlapping approved bookings for the same property  
6. Keep Swagger/OpenAPI updated when routes land  

**Owner of:** all persisted booking/rental rules and conflict safety

### Member 2 - Frontend and verification · Week 2 focus

1. Tenant booking request UI on property detail  
2. Tenant bookings / rentals screens  
3. Permission tests (wrong role / wrong owner denied)  
4. Conflict and retry UI states for booking approval  
5. Keep auth shell working against new API routes  

**Owner of:** tenant booking/rental screens and verification of access rules

### Member 3 - Product research and public experience · Week 2 focus

1. Polish public search (category, pricing unit, empty/error states)  
2. Richer property detail gallery and copy  
3. Confirm public results only show approved, non-suspended listings  
4. Capture screenshots / notes for the report from the real API  

**Owner of:** public browsing experience quality

### Member 4 - Design, administration and coordination · Week 2 focus

1. Manager property list / submit-for-approval screens  
2. Manager booking review UI (approve / reject)  
3. Clear moderation state labels (draft, pending, approved, suspended)  
4. Keep task board current; coordinate API/frontend handoffs  

**Owner of:** manager workspace UI and team coordination

---

## Later weeks (do not start early unless Week 2 is done)

| Week | Member 1 | Member 2 | Member 3 | Member 4 |
|---|---|---|---|---|
| 3 | Stripe payments, webhooks, earnings | Invoice/payment UI | Report evidence | Admin approvals + income |
| 4 | Maintenance APIs + reminders | Tenant maintenance UI | Search/a11y polish | Assignment + history |
| 5 | Integrity / authz fixes | Full journey testing | Usability checks | Acceptance tracking |
| 6 | Fresh setup + recovery docs | Final UI polish | Demo narrative | Handover pack |

---

## Suggested message you can copy to the group

```text
Hi team - Letwell Week 1 is done on the Express + MySQL + Vite stack.

Please read docs/MEMBER_TASKS.md

Completed already:
- API auth, MySQL schema, property APIs, seed data
- Web auth shell, public home/search/detail, HD images
- Docs: assessment, build plan, README

Seeded password for all demo accounts: Password123!
Web: http://localhost:5173
API: http://localhost:4000/api/health

Next (Week 2):
- Member 1: booking approval + rental creation APIs
- Member 2: tenant booking/rental screens + permission tests
- Member 3: public search/detail polish from live API
- Member 4: manager property + booking review screens

Do not rebuild Week 1 work. Extend it.
```

---

## Key folders

| Path | Purpose |
|---|---|
| `apps/api` | Backend |
| `apps/web` | Frontend |
| `docs/` | Plans, assessment, this task sheet |
| `archive/nextjs-sqlite-letwell/` | Old prototype (reference only) |
