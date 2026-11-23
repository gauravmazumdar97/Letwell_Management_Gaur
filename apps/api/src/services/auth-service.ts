import { hash, compare } from "bcryptjs";
import type { z } from "zod";
import type { Role } from "@prisma/client";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { loadAuthUser, signAccessToken } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validation/auth.js";

export { loginSchema, registerSchema };

export async function registerUser(input: z.infer<typeof registerSchema>) {
  if (!input.asTenant && !input.asManager) {
    throw new HttpError(400, "Select at least one of tenant or manager registration");
  }
  if (input.asManager && !input.managerMessage) {
    throw new HttpError(400, "Manager applications require a short message");
  }

  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "An account with that email already exists");
  }

  const passwordHash = await hash(input.password, 10);
  const roles: Role[] = [];
  if (input.asTenant) roles.push("TENANT");

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email,
        passwordHash,
        name: input.name.trim(),
        phone: input.phone,
        status: "PENDING",
        roles: {
          create: roles.map((role) => ({ role })),
        },
        managerApplication: input.asManager
          ? {
              create: {
                message: input.managerMessage!,
                status: "PENDING",
              },
            }
          : undefined,
      },
      include: { roles: true, managerApplication: true },
    });
    return created;
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    roles: user.roles.map((r) => r.role),
    managerApplication: user.managerApplication
      ? { status: user.managerApplication.status }
      : null,
  };
}

export async function loginUser(input: z.infer<typeof loginSchema>) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }
  const valid = await compare(input.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const authUser = await loadAuthUser(user.id);
  if (!authUser) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signAccessToken(user.id);
  return {
    token,
    user: authUser,
  };
}
