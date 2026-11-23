# Letwell - project analysis and tasks performed (4 members)

**Product:** Letwell - UK rental property management platform  
**Team size:** 4 members  
**Current stage:** Week 1 foundation + demo UX polish  
**Stack:** Express 5 API + Prisma + MySQL + Vite React + TypeScript + Tailwind  

This document is for coursework submission and viva prep. It records what exists in the repository now, what each member owns, and how each member should explain their work to the teacher.

---

## 1. Project analysis (current verified state)

### 1.1 What Letwell is

Letwell is a fictional UK lettings platform. Visitors browse approved homes. Signed-in users open role-based workspaces:

- **Tenant** - browse, track bookings/rent (demo dashboard)
- **Manager** - portfolio and booking inbox (demo dashboard)
- **Admin** - approvals, alerts, platform fee overview (demo dashboard)

Money is stored as integer pence. Locale is UK English and GBP.

### 1.2 Repository structure

| Path | Purpose |
|---|---|
| `apps/api` | Express API, Prisma schema, migrations, seed |
| `apps/web` | Vite React frontend |
| `docs/` | Assessment, architecture, build plan, member docs |
| `archive/nextjs-sqlite-letwell/` | Earlier Next.js + SQLite prototype (reference only) |

### 1.3 What is working now

| Area | Status | Evidence |
|---|---|---|
| Monorepo run path | Working | `npm run dev:api`, `npm run dev:web` |
| MySQL + Prisma migrate/seed | Working | `letwell` database, seed script |
| API health | Working | `GET /api/health` returns database up |
| Public property list/detail | Working | `GET /api/properties`, `GET /api/properties/:id` |
| Search filters | Working | location, pricing unit, price range, sort |
| Seeded homes + HD photos | Working | 11 approved listings with local Unsplash images |
| Homepage / search / detail UI | Working | Public routes load from live API |
| Splash screen | Working | Shows on each full page load |
| Demo sign-in | Working | Hardcoded local demo accounts |
| Role dashboards | Working | Separate Admin / Manager / Tenant layouts |
| Register page | Maintenance mode | Shows under-maintenance message by design |
| JWT API auth routes | Implemented in API | `POST /api/auth/login`, `register`, `GET /api/auth/me` |
| Booking / payment / maintenance flows | Schema ready, UI/API not complete | Planned Weeks 2-4 |

### 1.4 Auth note (important for teacher)

Two layers exist:

1. **API layer (Member 1):** real JWT + bcrypt + Prisma user tables.
2. **Current demo web login (Member 2 polish):** hardcoded demo credentials in the browser so the team can demo role dashboards quickly without depending on token plumbing for every UI change.

Public browsing (home/search/detail) uses the live API property endpoints. Dashboards are role-specific UI shells for Week 1 demonstration.

### 1.5 Demo credentials

Shared password: `Password123!`

| Role | Email |
|---|---|
| Admin | `admin@letwell.test` |
| Manager | `manager.north@letwell.test` |
| Tenant | `tenant.active@letwell.test` |

### 1.6 How to run

```powershell
cd "C:\Users\Gaurav\Desktop\Letwell_Management"
# MySQL must be running; apps/api/.env DATABASE_URL must be correct
npm install
npm run db:migrate -w @letwell/api
npm run db:seed -w @letwell/api
npm run dev:api
# second terminal
npm run dev:web
```

- Web: http://localhost:5173  
- API health: http://localhost:4000/api/health  

### 1.7 What is intentionally not finished yet

- Full booking approve/reject API + tenant booking UI (Week 2)
- Stripe payments and earnings (Week 3)
- Maintenance assignment workflow (Week 4)
- Swagger/OpenAPI and CI pipeline
- Reconnecting every dashboard widget to live `/api/me/dashboard` counts

---

## 2. Four-member ownership model

```text
Member 3                      Member 4
Public website + research     Design system + admin/manager UX + coordination
             \               /
              \             /
               Member 2 ---- Frontend behaviour, auth shell, verification
                     |
                     | calls
                     v
               Member 1 ---- Express API + MySQL + business rules
```

---

## 3. Tasks performed by each member

### Member 1 - Backend and integration

**Role:** Build the authoritative server, database and security rules.

**Tasks performed:**

1. Created Express 5 TypeScript API under `apps/api`.
2. Designed Prisma schema (18 models) for users, roles, properties, bookings, payments, maintenance and settings.
3. Added MySQL datasource, migration and seed script with demo users and London properties.
4. Implemented auth validation with Zod and auth service with bcrypt password hashing.
5. Implemented JWT login/register/me routes and auth middleware that re-checks account status and roles.
6. Implemented public property search/detail APIs with approved-only listing rules.
7. Implemented health check and protected dashboard/overview endpoints.
8. Added API unit checks for auth validation and documented local PowerShell setup.

**Key files:**

- `apps/api/src/app.ts`
- `apps/api/src/routes/auth.ts`
- `apps/api/src/routes/properties.ts`
- `apps/api/src/middleware/auth.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/seed.ts`

**Result for the team:** Frontend and demos have a real database and API to call.

---

### Member 2 - Frontend and verification

**Role:** Build React app behaviour, sign-in flow and prove the product is usable.

**Tasks performed:**

1. Built Vite React app shell with React Router and TanStack Query.
2. Implemented sign-in page with password show/hide control.
3. Implemented local demo credential login so Admin/Manager/Tenant can enter workspaces quickly.
4. Routed users to role-specific dashboards after login.
5. Kept public browsing available without login (home, search, property detail).
6. Put registration into an under-maintenance state for the current demo phase.
7. Wired API client helpers and verified public listings load from the live API.
8. Supported baseline typecheck/test awareness for frontend and auth forms.

**Key files:**

- `apps/web/src/App.tsx`
- `apps/web/src/auth/auth-context.tsx`
- `apps/web/src/auth/demo-credentials.ts`
- `apps/web/src/pages/sign-in-page.tsx`
- `apps/web/src/pages/register-page.tsx`
- `apps/web/src/lib/api.ts`

**Result for the team:** Teacher can sign in as each role and walk the main demo path.

---

### Member 3 - Product research and public experience

**Role:** Make the public website credible and keep the product story clear.

**Tasks performed:**

1. Wrote product journey notes and competitor references (`docs/PRODUCT_NOTES.md`).
2. Shaped homepage content with Letwell as the brand-first hero.
3. Built search experience with URL-backed filters.
4. Built property detail presentation for approved listings.
5. Expanded seeded listing content and neighbourhood coverage for a richer browse demo.
6. Documented image usage rights for bundled Unsplash photographs.
7. Ensured draft/unapproved homes stay out of public results (with Member 1 API rules).

**Key files:**

- `docs/PRODUCT_NOTES.md`
- `apps/web/src/pages/home-page.tsx`
- `apps/web/src/pages/search-page.tsx`
- `apps/web/src/pages/property-detail-page.tsx`
- `apps/web/public/images/USAGE.md`
- `apps/api/prisma/seed.ts` (listing copy and photo mapping, with Member 1)

**Result for the team:** The public site looks like a real lettings product, not an empty scaffold.

---

### Member 4 - Design, administration and coordination

**Role:** Keep visual consistency, build role workspace presentation, and organise the team.

**Tasks performed:**

1. Produced repository assessment and architecture/build planning docs.
2. Defined shared design tokens and UI primitives (button, input, label, password input).
3. Designed site header/footer and overall visual language.
4. Added splash screen for first impression / demo opening.
5. Built clearly different Admin, Manager and Tenant dashboards.
6. Coordinated member task sheets and ownership boundaries.
7. Kept README and verification notes aligned to the Express + Vite stack.

**Key files:**

- `docs/REPOSITORY_ASSESSMENT.md`
- `docs/ARCHITECTURE.md`
- `docs/BUILD_PLAN.md`
- `docs/MEMBER_TASKS.md`
- `apps/web/src/components/splash-screen.tsx`
- `apps/web/src/pages/workspace-page.tsx`
- `apps/web/src/index.css`

**Result for the team:** The project looks consistent and each role workspace is visually distinct for marking and demo.

---

## 4. Shared Week 1 outcome (what the team can demo together)

1. Open http://localhost:5173 - splash appears, then public homepage.
2. Browse Search homes without login - listings come from MySQL through the API.
3. Open a property detail page with photos and pricing unit.
4. Sign in as admin / manager / tenant using demo credentials.
5. Show that each dashboard looks and behaves differently.
6. Show register page currently under maintenance.
7. Show API health endpoint proving database connectivity.

---

## 5. Guideline: how each member should explain work to the teacher

Use this structure in viva or presentation. Keep answers short, then offer to show the screen.

### Shared opening (any member can say this)

> Letwell is a UK rental management platform. We rebuilt from an early Next.js prototype into Express + MySQL + Vite React. Week 1 focuses on auth foundation, public browsing and role workspaces. Booking payments and maintenance come in later weeks.

### Member 1 - what to say

**One-sentence claim:**  
> I own the backend: database schema, seed data, JWT auth APIs and public property APIs.

**Explain with evidence:**

1. Show `schema.prisma` and name core models (`User`, `UserRole`, `Property`, later booking/payment tables).
2. Show `GET /api/health` returning `"database":"up"`.
3. Show `GET /api/properties` returning only approved homes.
4. Explain security idea: JWT identifies the user; roles and account status are re-checked on the server.

**Likely teacher questions and answers:**

- *Why MySQL?* Local Windows setup practicality for the team; Prisma keeps provider portable.
- *Why so many models already?* Forward schema for Weeks 2-4 so we do not redesign the database every week.
- *Is the web login using JWT right now?* API JWT exists; current demo UI also supports hardcoded demo login for fast role demos. Next step is to fully re-bind dashboards to JWT session data.

### Member 2 - what to say

**One-sentence claim:**  
> I own the React app behaviour: routing, sign-in, role redirection and verification of the user flow.

**Explain with evidence:**

1. Show sign-in page and password eye toggle.
2. Sign in as tenant, then manager, then admin and show different destinations.
3. Show that home/search remain usable without login.
4. Show register under maintenance and explain it is intentional for this demo phase.

**Likely teacher questions and answers:**

- *How do roles work in the UI?* After login, the app reads granted roles and opens `/app/admin`, `/app/manager` or `/app/tenant`.
- *What did you verify?* Public API listing load, sign-in path per role, and that protected workspace routes require authentication.
- *What is next?* Connect tenant booking screens to Member 1 booking APIs in Week 2.

### Member 3 - what to say

**One-sentence claim:**  
> I own the public experience and product narrative: homepage, search, detail pages and research notes.

**Explain with evidence:**

1. Show homepage brand-first hero and featured homes.
2. Show search filters and that the URL updates.
3. Open a property detail page and point out price unit clarity (`pcm`, per night).
4. Mention research against Airbnb/Rightmove-style browsing patterns in `PRODUCT_NOTES.md`.

**Likely teacher questions and answers:**

- *Why URL filters?* So back button and shared links restore the same search.
- *How do you stop draft homes appearing?* Public API only returns approved properties with approved managers.
- *What is next?* Polish empty/error states and deepen detail gallery once booking CTA is live.

### Member 4 - what to say

**One-sentence claim:**  
> I own design consistency, role dashboard presentation and team coordination docs.

**Explain with evidence:**

1. Show splash screen and shared UI components.
2. Compare Admin vs Manager vs Tenant dashboards and explain why each layout is different.
3. Show assessment/build-plan docs and how work is split across 4 members.
4. Explain admin dashboard is light-themed for clarity and marking readability.

**Likely teacher questions and answers:**

- *Why different dashboards?* Because each role has different jobs: moderation, portfolio operations, and personal tenant tasks.
- *What was your coordination role?* Keep task ownership clear so backend and frontend do not rebuild each other's work.
- *What is next?* Manager property submission screens and admin approval actions hooked to live APIs.

---

## 6. Suggested 5-minute team demo script

1. Member 4 opens site - splash + brand.  
2. Member 3 browses search and opens one home.  
3. Member 2 signs in as tenant and shows tenant dashboard.  
4. Member 2 signs out, signs in as manager, shows portfolio desk.  
5. Member 2 signs in as admin, shows approval queue.  
6. Member 1 shows `/api/health` and `/api/properties` in browser/Postman.  
7. Close with Week 2 plan: booking request to manager approval.

---

## 7. Related documents

| File | Use |
|---|---|
| `docs/REPOSITORY_ASSESSMENT.md` | What existed before Express migration |
| `docs/BUILD_PLAN.md` | Six-week plan |
| `docs/ARCHITECTURE.md` | Technical structure |
| `docs/MEMBER_TASKS.md` | Short checklist for chat/handoff |
| `docs/FOUR_MEMBERS_IMPLEMENTATION.md` | Role explanation overview |
| `README.md` | How to run locally |

---

## 8. Honest status summary for marking

**Completed for Week 1 demo:** runnable API + database, public browsing with real listings/photos, demo sign-in, distinct role dashboards, documentation split across 4 members.

**Not claimed as complete:** end-to-end booking, Stripe payments, maintenance workflow, production deployment, full JWT-only web session for every dashboard widget.
