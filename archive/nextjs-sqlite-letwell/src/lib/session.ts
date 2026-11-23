import { redirect } from "next/navigation";
import type { AccountStatus, Role } from "@prisma/client";
import { auth, type SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const fresh = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, status: true },
  });

  return fresh;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function requireApprovedRole(roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();

  if (user.status === "PENDING") {
    redirect("/account/pending");
  }
  if (user.status === "REJECTED") {
    redirect("/account/rejected");
  }
  if (user.status === "SUSPENDED") {
    redirect("/account/suspended");
  }
  if (user.status !== "APPROVED") {
    redirect("/sign-in");
  }
  if (!roles.includes(user.role)) {
    redirect(dashboardPathForRole(user.role));
  }

  return user;
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "LANDLORD":
      return "/landlord";
    case "TENANT":
      return "/tenant";
    default:
      return "/";
  }
}

export function canAccessPortal(status: AccountStatus): boolean {
  return status === "APPROVED";
}
