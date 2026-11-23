import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AccountStatus, Role } from "@prisma/client";
import { env } from "../config.js";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  status: AccountStatus;
  roles: Role[];
};

export type AuthedRequest = Request & { user?: AuthUser };

type JwtPayload = {
  sub: string;
};

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function loadAuthUser(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    roles: user.roles.map((r) => r.role),
  };
}

export async function authenticate(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication required");
    }
    const token = header.slice("Bearer ".length).trim();
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await loadAuthUser(payload.sub);
    if (!user) {
      throw new HttpError(401, "Authentication required");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid or expired token"));
  }
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  await authenticate(req, res, (error?: unknown) => {
    if (error) {
      next(error);
      return;
    }
    const user = req.user;
    if (!user) {
      next(new HttpError(401, "Authentication required"));
      return;
    }
    if (user.status === "SUSPENDED") {
      next(new HttpError(403, "Account suspended"));
      return;
    }
    if (user.status === "REJECTED") {
      next(new HttpError(403, "Account rejected"));
      return;
    }
    if (user.status === "PENDING") {
      next(new HttpError(403, "Account pending approval"));
      return;
    }
    if (user.status !== "APPROVED") {
      next(new HttpError(403, "Account not approved"));
      return;
    }
    next();
  });
}

export function requireRoles(...roles: Role[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpError(401, "Authentication required"));
      return;
    }
    const allowed = roles.some((role) => req.user!.roles.includes(role));
    if (!allowed) {
      next(new HttpError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
}

/** Active workspace must be one of the caller's granted roles. */
export function requireActiveRole(role: Role) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const requested = String(req.headers["x-letwell-role"] ?? role) as Role;
    if (!req.user?.roles.includes(requested)) {
      next(new HttpError(403, "Active workspace role is not granted for this account"));
      return;
    }
    if (requested !== role && !req.user.roles.includes(role)) {
      next(new HttpError(403, "Insufficient permissions"));
      return;
    }
    if (!req.user.roles.includes(role)) {
      next(new HttpError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
}
