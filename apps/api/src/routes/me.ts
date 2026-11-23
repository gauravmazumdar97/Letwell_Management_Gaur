import { Router } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const meRouter = Router();

meRouter.get("/me/dashboard", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const user = req.user!;
    const payload: Record<string, unknown> = {
      user,
      nextActions: [] as string[],
    };

    if (user.roles.includes("TENANT")) {
      const bookingCount = await prisma.booking.count({ where: { tenantId: user.id } });
      const rentalCount = await prisma.rental.count({ where: { tenantId: user.id, status: "ACTIVE" } });
      payload.tenant = { bookingCount, rentalCount };
      (payload.nextActions as string[]).push(
        rentalCount > 0 ? "Review your active rental and invoices" : "Browse homes and request a booking",
      );
    }

    if (user.roles.includes("MANAGER")) {
      const propertyCount = await prisma.property.count({ where: { managerId: user.id } });
      const pendingBookings = await prisma.booking.count({
        where: { status: "PENDING", property: { managerId: user.id } },
      });
      payload.manager = { propertyCount, pendingBookings };
      (payload.nextActions as string[]).push(
        pendingBookings > 0 ? "Review pending booking requests" : "Add or submit a property for approval",
      );
    }

    if (user.roles.includes("ADMIN")) {
      const pendingManagers = await prisma.managerApplication.count({ where: { status: "PENDING" } });
      const pendingProperties = await prisma.property.count({ where: { status: "PENDING_APPROVAL" } });
      payload.admin = { pendingManagers, pendingProperties };
      (payload.nextActions as string[]).push("Review manager applications and property submissions");
    }

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

meRouter.get(
  "/admin/overview",
  requireAuth,
  requireRoles("ADMIN"),
  async (_req, res, next) => {
    try {
      const [users, properties, pendingManagers] = await Promise.all([
        prisma.user.count(),
        prisma.property.count({ where: { status: "APPROVED" } }),
        prisma.managerApplication.count({ where: { status: "PENDING" } }),
      ]);
      res.json({ users, approvedProperties: properties, pendingManagers });
    } catch (error) {
      next(error);
    }
  },
);
