# Verification checklist

## Fresh setup (Express + Vite)

- [ ] MySQL 8 running (`MySQL80`) and `letwell` database created
- [ ] `apps/api/.env` configured with the correct MySQL password
- [ ] `npm install` completes
- [ ] `npm run db:migrate -w @letwell/api` applies
- [ ] `npm run db:seed -w @letwell/api` completes
- [ ] `npm run dev:api` serves `/api/health`
- [ ] `npm run dev:web` serves the public site

## Week 1

- [ ] Homepage loads approved properties from the API
- [ ] `/search` filters update the URL and refetch
- [ ] Draft properties are excluded from public results
- [ ] Login as admin / manager / tenant reaches the matching workspace
- [ ] Dual-role user can switch only granted workspaces
- [ ] Pending and suspended accounts cannot load `/api/me/dashboard`
- [ ] `npm run typecheck` passes
- [ ] `npm run test -w @letwell/api` passes

## Checks run on 2026-11-22

- [x] `npm run typecheck` (API + web)
- [x] `npm run test -w @letwell/api` (auth validation)
- [x] `npm run build -w @letwell/web`
- [ ] Live `/api/health` against PostgreSQL
- [ ] Seeded login through API + web

## Blocked on this machine (recorded 2026-11-22)

- Database provider is now **MySQL**. Service `MySQL80` exists but is stopped; starting it requires Administrator rights (`System error 5`).
- Until MySQL listens on `localhost:3306` and `DATABASE_URL` uses the correct root password, migrate/seed/API health remain blocked.

### Unblock (run elevated PowerShell)

```powershell
Start-Service MySQL80
# Use your real MySQL root password when prompted
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS letwell CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd "C:\Users\Gaurav\Desktop\Rental Management"
# Put the same password into apps\api\.env DATABASE_URL
npm run db:migrate -w @letwell/api
npm run db:seed -w @letwell/api
npm run dev:api
npm run dev:web
```
