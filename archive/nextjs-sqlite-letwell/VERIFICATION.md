# Shared verification checklist

Use this after each weekly milestone. Mark items only with evidence from a local run.

## Fresh setup

- [ ] `npm install` completes
- [ ] `.env` created from `.env.example`
- [ ] `npx prisma migrate dev` applies cleanly
- [ ] `npm run db:seed` completes without error
- [ ] `npm run dev` serves the app

## Week 1

- [x] Homepage shows Letwell brand, search and curated available homes
- [x] `/search` filters restore from the URL
- [x] Draft / archived / occupied listings do not appear in public search
- [x] Sign in as admin reaches `/admin` (landlord/tenant dashboards wired the same way)
- [x] Pending account reaches `/account/pending` and cannot open `/tenant`
- [x] Suspended account reaches `/account/suspended` and cannot open protected data
- [x] `npm run lint` and `npm run typecheck` pass
- [x] `npm run build` succeeds

## Later weeks (placeholders)

- [ ] Registration + admin approval
- [ ] Enquiry to lease activation and occupancy change
- [ ] Demo payment once with receipt; retry does not duplicate
- [ ] Overdue reminder generation is idempotent
- [ ] Maintenance assignment and resolution with history
- [ ] Cross-owner access denied
