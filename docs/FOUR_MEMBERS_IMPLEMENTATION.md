# Letwell - four members implementation and explanation

This document explains how the project is split across **four members**, what each person builds, and how the pieces connect.

**Product:** Letwell - rental property management platform  
**Stack:** Express 5 API · Prisma · MySQL · Vite · React · TypeScript · Tailwind  

---

## How the four roles work together

```text
Member 3                Member 4
Public website    +     Design system / admin UX
        \              /
         \            /
          Member 2 --- Frontend screens (all workspaces)
                |
                | calls
                v
          Member 1 --- Express API + MySQL + business rules
```

- **Member 1** owns the server, database and rules. Nothing important is trusted to the browser alone.
- **Member 2** owns the React app wiring: auth, forms, API calls, tenant flows and verification.
- **Member 3** owns the public visitor experience and product narrative (search, detail, copy, research).
- **Member 4** owns design consistency, manager/admin screens coordination and team tracking.

If Member 2 builds a booking button before Member 1 finishes the booking API, the button must stay disabled or show "coming soon". Vertical slices land only when UI + API + database agree.

---

## Member 1 - Backend and integration

### Responsibility

Build and maintain the **authoritative backend**.

### What this member implements

| Area | Explanation |
|---|---|
| Express API | Routes under `apps/api` (`/api/auth`, `/api/properties`, later bookings, payments, maintenance) |
| MySQL + Prisma | Schema, migrations, seed data |
| JWT auth | Login/register tokens; re-check account status on protected routes |
| Roles | `TENANT`, `MANAGER`, `ADMIN` grants; dual-role support |
| Business rules | Pricing, booking conflicts, rental creation, invoice generation |
| Stripe (Week 3) | Checkout, webhook signature checks, earnings, fee snapshots |
| Maintenance APIs (Week 4) | Status transitions, worker assignment |
| Integrity | Transactions so approve-booking cannot leave half-created rentals |

### Week-by-week (Member 1)

| Week | Implementation focus |
|---|---|
| 1 | API setup, MySQL, JWT, env, seed (**done**) |
| 2 | Booking approve/reject, rental + invoices, pricing, conflict prevention |
| 3 | Stripe test payments, webhooks, payment allocation, earnings |
| 4 | Maintenance APIs, overdue reminders |
| 5 | Fix authz/integrity bugs found in testing |
| 6 | Fresh setup, migrations, seed recovery docs |

### Why this role matters

The frontend can look finished while still being unsafe. Member 1 makes sure:

- only approved users reach protected data  
- managers cannot touch other managers' properties  
- booking approval cannot double-book a home  
- payments and earnings match stored records  

---

## Member 2 - Frontend and verification

### Responsibility

Build the **React application behaviour** and prove it works against the real API.

### What this member implements

| Area | Explanation |
|---|---|
| Auth shell | Sign-in, register, token storage, logout |
| Workspace routing | Tenant / manager / admin areas from server-verified roles |
| Account states | Pending, rejected, suspended screens |
| Tenant screens | Booking request, rentals, invoices/payments (as APIs land) |
| API integration | TanStack Query + fetch to Express |
| Forms | React Hook Form + Zod matching API validation |
| Verification | Permission tests, conflict/retry cases, responsive checks |

### Week-by-week (Member 2)

| Week | Implementation focus |
|---|---|
| 1 | Auth shell, workspace shells, baseline checks (**done**) |
| 2 | Tenant booking/rental screens; permission and conflict tests |
| 3 | Invoice, payment and receipt screens; failure/retry UX |
| 4 | Tenant maintenance + notification screens |
| 5 | Full user journeys and responsive defect fixes |
| 6 | Final interface polish and application checks |

### Why this role matters

Member 2 turns Member 1's APIs into usable screens and catches mistakes early:

- wrong role still blocked  
- unpaid invoice pay flow works once, not twice  
- errors are readable, not blank failures  

---

## Member 3 - Product research and public experience

### Responsibility

Make the **public website** credible and explain the product clearly for demos and the report.

### What this member implements

| Area | Explanation |
|---|---|
| Public homepage | Brand-led hero, curated homes, clear CTA |
| Search | Location, category, pricing unit, price range, URL filters |
| Property detail | Photos, amenities, price units, availability story |
| Content | UK English copy, realistic listings, empty/error states |
| Research | Compare Airbnb / Rightmove / Stripe patterns; write journey notes |
| Report evidence | Screenshots and descriptions taken from the working app |

### Week-by-week (Member 3)

| Week | Implementation focus |
|---|---|
| 1 | Journeys, public copy, home/search/detail draft, HD images (**done**) |
| 2 | Public search + detail polished against live API responses |
| 3 | Consolidate requirements/report sections from real behaviour |
| 4 | Search refinement and accessibility |
| 5 | Usability, terminology, report accuracy checks |
| 6 | User guidance and demonstration narrative |

### Why this role matters

Visitors judge Letwell from the public site first. Member 3 ensures:

- listings look real and professional  
- price units are obvious (`pcm`, `per night`, etc.)  
- draft/suspended homes never appear publicly  
- the team can demo and write the report from truth, not invent features  

---

## Member 4 - Design, administration and coordination

### Responsibility

Keep the product **visually consistent**, build **manager/admin UX**, and keep the team aligned.

### What this member implements

| Area | Explanation |
|---|---|
| Design system | Colours, typography, spacing, shared components |
| Manager workspace | Properties, photos, booking review, earnings views |
| Admin workspace | Approvals, moderation, users, categories, income reports |
| States | Draft / pending / approved / rejected / suspended explained clearly |
| Coordination | Task board, handoffs, acceptance tracking |
| Diagrams | Architecture / ER alignment with the real schema |

### Week-by-week (Member 4)

| Week | Implementation focus |
|---|---|
| 1 | Assessment, design tokens, components, task organisation (**done**) |
| 2 | Manager property + booking screens and moderation states |
| 3 | Admin approvals + income screens; assessed API demo coordination |
| 4 | Maintenance assignment, status history, ops views |
| 5 | Acceptance testing and defect tracking |
| 6 | Contribution evidence, final acceptance, handover |

### Why this role matters

Without Member 4:

- screens look inconsistent  
- managers/admins lack clear next actions  
- team work overlaps or gets stuck waiting  

Member 4 is the bridge between design quality and operational screens.

---

## Shared Week 1 outcome (already delivered)

All four members' Week 1 outcomes combine into one runnable demo:

1. Visitor browses HD property photos on the public site (Member 3 + 4 design)  
2. User registers or signs in (Member 1 API + Member 2 UI)  
3. Approved role opens the correct workspace (Member 1 grants + Member 2 shell)  
4. Pending/suspended users are blocked with a clear screen (Members 1 + 2)  
5. README explains MySQL + API + web setup (Member 4 coordination / docs)

**Demo accounts password:** `Password123!`

---

## Week 2 handoff (next implementation slice)

| Member | Must deliver | Depends on |
|---|---|---|
| 1 | Booking + rental APIs with conflict-safe approval | Existing schema tables |
| 2 | Tenant booking/rental screens | Member 1 booking endpoints |
| 3 | Search/detail polish using real API data | Current public APIs (+ any new fields) |
| 4 | Manager property/booking review UI | Member 1 booking review endpoints |

**Integration rule:** Member 1 publishes endpoint contracts first (path, body, response). Members 2 and 4 build screens against those contracts. Member 3 validates the public story still makes sense.

---

## Simple explanation you can say in a meeting

> We are four people on one product.  
> Member 1 builds the brain (API and database).  
> Member 2 builds the hands (screens that call the API and tests).  
> Member 3 builds the shop window (public website and product story).  
> Member 4 builds the look and the staff tools (design system, manager/admin, coordination).  
> Week 1 foundation is done. Week 2 is booking from request to approved rental.

---

## Related files

| File | Use |
|---|---|
| `docs/MEMBER_TASKS.md` | Checklist to send in chat |
| `docs/BUILD_PLAN.md` | Full six-week plan |
| `docs/ARCHITECTURE.md` | Technical structure |
| `docs/REPOSITORY_ASSESSMENT.md` | What existed before Express/MySQL |
| `README.md` | How to run locally |
