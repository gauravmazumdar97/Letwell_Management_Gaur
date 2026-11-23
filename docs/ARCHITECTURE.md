# Letwell architecture notes (Week 1)

## Runtime

```text
Browser (Vite React :5173)
  -> /api proxy or VITE_API_URL
Express API (:4000)
  -> Prisma
MySQL 8 (:3306 / letwell)
```

## Auth

1. `POST /api/auth/login` verifies email/password and returns a JWT (`Authorization: Bearer`).
2. JWT payload contains only `sub` (user id).
3. Every protected request reloads the user, `AccountStatus` and `UserRole` grants from PostgreSQL.
4. `X-Letwell-Role` may select an active workspace among **granted** roles. It never creates permissions.
5. Suspended / rejected / pending accounts can authenticate enough to see a status screen, but dashboard routes return 403.

## ER (Week 1 schema)

18 Prisma models, including forward tables for later weeks:

- Identity: `User`, `UserRole`, `ManagerApplication`, `AuditLog`
- Catalogue: `Category`, `Property`, `PropertyImage`
- Booking lifecycle: `Booking`, `Rental`, `Invoice`, `Payment`, `PaymentAttempt`, `Earning`
- Maintenance: `Worker`, `MaintenanceRequest`, `MaintenanceStatusHistory`, `Notification`
- Config: `PlatformSettings`

Public discovery only returns `Property.status = APPROVED` where the manager account is also `APPROVED`.

## Folder map

```text
apps/api    Express + Prisma
apps/web    Vite React SPA
archive/    Frozen Next.js SQLite prototype
docs/       Assessment, plan, architecture, verification
```
